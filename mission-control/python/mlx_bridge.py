#!/usr/bin/env python3
"""
MLX LLM Bridge - Production Local Inference

Uses Apple's MLX framework for fast, efficient on-device inference.
This is the PRIMARY local inference method (fastest, smallest).
Ollama is the fallback.

Requirements:
    pip install mlx-lm transformers

Usage:
    python mlx_bridge.py --check
    python mlx_bridge.py --prompt "Hello" --max-tokens 50
"""

import argparse
import json
import sys
import time
import platform
import os
from pathlib import Path
from typing import Optional, Dict, Any

# Suppress transformers warnings
os.environ['TOKENIZERS_PARALLELISM'] = 'false'
import warnings
warnings.filterwarnings('ignore')

# Configuration
DEFAULT_MODEL = "mlx-community/Llama-3.2-1B-Instruct-4bit"  # 128K context, OpenClaw compatible, ~0.5GB
MAX_MODELS_TO_CACHE = 3  # Keep last 3 models in memory

def check_system() -> Dict[str, Any]:
    """Check if system supports MLX inference."""
    info = {
        "available": False,
        "platform": platform.system(),
        "machine": platform.machine(),
        "processor": platform.processor(),
    }
    
    # Check if macOS on Apple Silicon
    if platform.system() != "Darwin":
        info["reason"] = "MLX requires macOS"
        return info
    
    if platform.machine() != "arm64":
        info["reason"] = "MLX requires Apple Silicon (M1/M2/M3/M4)"
        return info
    
    # Try to import MLX
    try:
        import mlx.core as mx
        info["mlx_version"] = mx.__version__
    except ImportError:
        info["reason"] = "MLX not installed. Run: pip install mlx-lm"
        return info
    
    # Check for transformers
    try:
        import transformers
        info["transformers_version"] = transformers.__version__
    except ImportError:
        info["reason"] = "transformers not installed. Run: pip install transformers"
        return info
    
    info["available"] = True
    info["chip"] = "Apple Silicon"
    return info

# Model cache to avoid reloading
_model_cache = {}

def generate(
    prompt: str,
    max_tokens: int = 150,
    temperature: float = 0.7,
    model_name: str = DEFAULT_MODEL
) -> Dict[str, Any]:
    """Generate text using MLX LLM."""
    
    from mlx_lm import load, generate as mlx_generate
    
    start_time = time.time()
    
    try:
        # Load model (cached)
        if model_name not in _model_cache:
            # Evict oldest if cache full
            if len(_model_cache) >= MAX_MODELS_TO_CACHE:
                oldest = next(iter(_model_cache))
                del _model_cache[oldest]
            
            model, tokenizer = load(model_name)
            _model_cache[model_name] = (model, tokenizer)
        else:
            model, tokenizer = _model_cache[model_name]
        
        load_time = time.time() - start_time
        
        # Format as chat if instruct model
        if "instruct" in model_name.lower() or "chat" in model_name.lower():
            messages = [{"role": "user", "content": prompt}]
            formatted_prompt = tokenizer.apply_chat_template(
                messages, 
                tokenize=False, 
                add_generation_prompt=True
            )
        else:
            formatted_prompt = prompt
        
        # Generate
        gen_start = time.time()
        response = mlx_generate(
            model,
            tokenizer,
            prompt=formatted_prompt,
            max_tokens=max_tokens,
            verbose=False,
        )
        gen_time = time.time() - gen_start
        
        tokens_per_sec = max_tokens / gen_time if gen_time > 0 else 0
        total_time = time.time() - start_time
        
        return {
            "text": response,
            "tokens_generated": max_tokens,
            "model": model_name,
            "load_time_ms": int(load_time * 1000),
            "gen_time_ms": int(gen_time * 1000),
            "total_time_ms": int(total_time * 1000),
            "tokens_per_sec": round(tokens_per_sec, 1),
            "from_cache": model_name in _model_cache,
        }
        
    except Exception as e:
        import traceback
        return {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "fallback_required": True,
        }

def main():
    # Suppress stderr for cleaner JSON output
    sys.stderr = open(os.devnull, 'w')
    
    parser = argparse.ArgumentParser(description="MLX LLM Bridge")
    parser.add_argument("--check", action="store_true", help="Check system availability")
    parser.add_argument("--prompt", type=str, help="Prompt for generation")
    parser.add_argument("--max-tokens", type=int, default=150)
    parser.add_argument("--temperature", type=float, default=0.7)
    parser.add_argument("--model", type=str, default=DEFAULT_MODEL)
    
    args = parser.parse_args()
    
    if args.check:
        result = check_system()
        print(json.dumps(result))
        sys.exit(0 if result["available"] else 1)
    
    if args.prompt:
        result = generate(
            prompt=args.prompt,
            max_tokens=args.max_tokens,
            temperature=args.temperature,
            model_name=args.model,
        )
        print(json.dumps(result))
        sys.exit(0 if "error" not in result else 1)
    
    parser.print_help()
    sys.exit(1)

if __name__ == "__main__":
    main()
