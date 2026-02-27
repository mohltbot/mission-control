#!/usr/bin/env python3
"""
Apple On-Device LLM Bridge

Python bridge to Apple's Foundation Model SDK for local inference.
Called by the TypeScript layer to run models on Apple Neural Engine.

Requirements:
    pip install apple-fm-sdk transformers torch

Usage:
    python apple_llm_bridge.py --check
    python apple_llm_bridge.py --prompt "Hello" --max-tokens 50
"""

import argparse
import json
import sys
import platform
from pathlib import Path
from typing import Optional, Dict, Any

# Configuration
DEFAULT_MODEL = "smollm2-360m"
MODELS_DIR = Path(__file__).parent.parent / "models"

def check_system() -> Dict[str, Any]:
    """Check if system supports Apple on-device inference."""
    info = {
        "available": False,
        "platform": platform.system(),
        "machine": platform.machine(),
        "processor": platform.processor(),
    }
    
    # Check if macOS on Apple Silicon
    if platform.system() != "Darwin":
        info["reason"] = "Apple on-device LLM requires macOS"
        return info
    
    if platform.machine() != "arm64":
        info["reason"] = "Apple Neural Engine requires Apple Silicon (M1/M2/M3/M4)"
        return info
    
    # Try to import Apple FM SDK
    try:
        import apple_fm_sdk
        info["sdk_version"] = getattr(apple_fm_sdk, "__version__", "unknown")
    except ImportError:
        info["reason"] = "Apple FM SDK not installed. Run: pip install apple-fm-sdk"
        return info
    
    # Check available memory (rough estimate)
    try:
        import psutil
        mem = psutil.virtual_memory()
        info["memoryGB"] = round(mem.total / (1024**3), 1)
        if info["memoryGB"] < 8:
            info["warning"] = "Limited RAM - larger models may not load"
    except ImportError:
        pass
    
    # Check for models
    if MODELS_DIR.exists():
        models = list(MODELS_DIR.glob("*.mlmodel")) + list(MODELS_DIR.glob("*.mlpackage"))
        info["installed_models"] = [m.name for m in models]
        if not models:
            info["warning"] = "No models found. Run: python scripts/download-model.py"
    
    info["available"] = True
    info["chip"] = "Apple Silicon"
    return info

def generate(
    prompt: str,
    max_tokens: int = 150,
    temperature: float = 0.7,
    top_p: Optional[float] = None,
    model_name: str = DEFAULT_MODEL
) -> Dict[str, Any]:
    """Generate text using Apple on-device LLM."""
    
    # Check system first
    sys_info = check_system()
    if not sys_info["available"]:
        return {
            "error": sys_info.get("reason", "System not available"),
            "fallback_required": True,
        }
    
    try:
        # Import here to avoid errors during --check
        from apple_fm_sdk import LocalInference
        
        # Find model path
        model_path = MODELS_DIR / model_name
        if not model_path.exists():
            # Try fallback models
            for fallback in ["smollm2-360m", "phi-3-mini", "gemma-2b"]:
                fallback_path = MODELS_DIR / fallback
                if fallback_path.exists():
                    model_path = fallback_path
                    model_name = fallback
                    break
            else:
                return {
                    "error": f"Model not found: {model_name}. Run: python scripts/download-model.py",
                    "fallback_required": True,
                }
        
        # Load model
        inference = LocalInference(model_path=str(model_path))
        
        # Generate
        result = inference.generate(
            prompt=prompt,
            max_tokens=max_tokens,
            temperature=temperature,
            top_p=top_p if top_p is not None else 0.9,
        )
        
        return {
            "text": result.text,
            "tokens_generated": result.tokens_generated,
            "model": model_name,
            "finish_reason": result.finish_reason,
        }
        
    except Exception as e:
        return {
            "error": str(e),
            "fallback_required": True,
        }

def main():
    parser = argparse.ArgumentParser(description="Apple On-Device LLM Bridge")
    parser.add_argument("--check", action="store_true", help="Check system availability")
    parser.add_argument("--prompt", type=str, help="Prompt for generation")
    parser.add_argument("--max-tokens", type=int, default=150)
    parser.add_argument("--temperature", type=float, default=0.7)
    parser.add_argument("--top-p", type=float, default=None)
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
            top_p=args.top_p,
            model_name=args.model,
        )
        print(json.dumps(result))
        sys.exit(0 if "error" not in result else 1)
    
    parser.print_help()
    sys.exit(1)

if __name__ == "__main__":
    main()
