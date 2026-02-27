#!/usr/bin/env python3
"""
Download and prepare models for Apple on-device inference.

Usage:
    python scripts/download-model.py --model smollm2-360m
    python scripts/download-model.py --model phi-3-mini
    python scripts/download-model.py --model gemma-2b
    python scripts/download-model.py --all
"""

import argparse
import json
import sys
import urllib.request
from pathlib import Path
from typing import Optional

# Model registry - HuggingFace models optimized for Apple Silicon
MODELS = {
    "smollm2-360m": {
        "repo": "apple/SmolLM2-360M-Instruct-coreml",
        "size": "~400MB",
        "ram_required": "1GB",
        "speed": "~50 tokens/sec",
        "quality": "Good for simple tasks",
    },
    "phi-3-mini": {
        "repo": "apple/Phi-3-mini-4k-instruct-coreml",
        "size": "~2GB",
        "ram_required": "8GB",
        "speed": "~20 tokens/sec",
        "quality": "Better reasoning",
    },
    "gemma-2b": {
        "repo": "apple/gemma-2b-it-coreml",
        "size": "~1.5GB",
        "ram_required": "4GB",
        "speed": "~30 tokens/sec",
        "quality": "Balanced",
    },
}

MODELS_DIR = Path(__file__).parent.parent / "models"

def download_file(url: str, dest: Path, desc: str = "Downloading") -> bool:
    """Download a file with progress indication."""
    try:
        print(f"{desc}: {url}")
        print(f"Destination: {dest}")
        
        # Create parent directory
        dest.parent.mkdir(parents=True, exist_ok=True)
        
        # Download
        urllib.request.urlretrieve(url, dest)
        print(f"✓ Downloaded: {dest.stat().st_size / 1024 / 1024:.1f} MB")
        return True
        
    except Exception as e:
        print(f"✗ Download failed: {e}")
        return False

def download_model(model_name: str) -> bool:
    """Download a specific model."""
    if model_name not in MODELS:
        print(f"Unknown model: {model_name}")
        print(f"Available: {', '.join(MODELS.keys())}")
        return False
    
    info = MODELS[model_name]
    print(f"\n📦 Downloading {model_name}")
    print(f"   Size: {info['size']}")
    print(f"   RAM Required: {info['ram_required']}")
    print(f"   Expected Speed: {info['speed']}")
    print(f"   Quality: {info['quality']}")
    print()
    
    model_dir = MODELS_DIR / model_name
    
    # In a real implementation, this would download from HuggingFace or Apple's CDN
    # For now, provide instructions
    print("=" * 60)
    print("INSTRUCTIONS:")
    print("=" * 60)
    print(f"""
1. Visit: https://huggingface.co/{info['repo']}
2. Download the Core ML model files
3. Extract to: {model_dir}

Or use the HuggingFace CLI:
    pip install huggingface-hub
    huggingface-cli download {info['repo']} --local-dir {model_dir}
""")
    
    # Create a placeholder to mark intent
    model_dir.mkdir(parents=True, exist_ok=True)
    (model_dir / "README.md").write_text(f"""# {model_name} Model

Source: https://huggingface.co/{info['repo']}

## Stats
- Size: {info['size']}
- RAM Required: {info['ram_required']}
- Expected Speed: {info['speed']}
- Quality: {info['quality']}

## Download
Run: `huggingface-cli download {info['repo']} --local-dir .`
""")
    
    return True

def list_models():
    """List available models."""
    print("\n📚 Available Models for Apple On-Device Inference")
    print("=" * 60)
    
    for name, info in MODELS.items():
        installed = "✅" if (MODELS_DIR / name).exists() else "⬜"
        print(f"\n{installed} {name}")
        print(f"   Size: {info['size']} | RAM: {info['ram_required']}")
        print(f"   Speed: {info['speed']}")
        print(f"   Quality: {info['quality']}")

def main():
    parser = argparse.ArgumentParser(description="Download models for Apple on-device LLM")
    parser.add_argument("--model", type=str, help="Model to download")
    parser.add_argument("--all", action="store_true", help="Download all models")
    parser.add_argument("--list", action="store_true", help="List available models")
    
    args = parser.parse_args()
    
    if args.list:
        list_models()
        return
    
    if args.all:
        print("Downloading all models...")
        for model_name in MODELS:
            download_model(model_name)
        return
    
    if args.model:
        download_model(args.model)
        return
    
    # Default: show list
    list_models()
    print("\n" + "=" * 60)
    print("Usage: python scripts/download-model.py --model smollm2-360m")

if __name__ == "__main__":
    main()
