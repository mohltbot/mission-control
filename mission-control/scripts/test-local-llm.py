#!/usr/bin/env python3
"""
Test Apple on-device LLM inference.

Usage:
    python scripts/test-local-llm.py
"""

import json
import sys
from pathlib import Path

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent / "python"))

try:
    from apple_llm_bridge import check_system, generate
except ImportError as e:
    print(f"❌ Failed to import bridge: {e}")
    sys.exit(1)

def main():
    print("🧪 Testing Apple On-Device LLM")
    print("=" * 50)
    
    # 1. System check
    print("\n1. Checking system compatibility...")
    sys_info = check_system()
    
    if sys_info["available"]:
        print(f"✅ System compatible")
        print(f"   Platform: {sys_info.get('platform', 'unknown')}")
        print(f"   Chip: {sys_info.get('chip', 'unknown')}")
        if "memoryGB" in sys_info:
            print(f"   Memory: {sys_info['memoryGB']} GB")
        if "sdk_version" in sys_info:
            print(f"   SDK Version: {sys_info['sdk_version']}")
        if "installed_models" in sys_info:
            print(f"   Models: {', '.join(sys_info['installed_models']) or 'None'}")
    else:
        print(f"❌ System not compatible: {sys_info.get('reason', 'Unknown')}")
        print("\nTo use Apple on-device LLM:")
        print("  - Use an Apple Silicon Mac (M1/M2/M3/M4)")
        print("  - Install Apple FM SDK: pip install apple-fm-sdk")
        sys.exit(1)
    
    # 2. Test generation
    print("\n2. Testing text generation...")
    test_prompts = [
        "List three benefits of local AI inference.",
        "Summarize: The quick brown fox jumps over the lazy dog.",
        "What is 2 + 2?",
    ]
    
    for prompt in test_prompts:
        print(f"\n   Prompt: {prompt[:50]}...")
        result = generate(prompt=prompt, max_tokens=50, temperature=0.7)
        
        if "error" in result:
            print(f"   ❌ Error: {result['error']}")
            if result.get("fallback_required"):
                print("   → Would fallback to cloud API")
        else:
            print(f"   ✅ Response: {result['text'][:80]}...")
            print(f"   Tokens: {result.get('tokens_generated', 'unknown')}")
    
    # 3. Performance estimate
    print("\n3. Performance Estimate")
    print("   Expected: 20-50 tokens/sec (depending on model)")
    print("   Latency: 50-200ms first token")
    print("   Cost: $0 (completely free!)")
    
    # 4. Budget impact
    print("\n4. Budget Impact")
    print("   With 60% of simple tasks using on-device:")
    print("   → Estimated savings: $40-80/month")
    print("   → Current budget: $200/month")
    print("   → New effective budget: $120-160/month")
    
    print("\n" + "=" * 50)
    print("✅ Test complete!")
    print("\nNext steps:")
    print("  1. Download a model: python scripts/download-model.py --model smollm2-360m")
    print("  2. Update .env: Add APPLE_ONDEVICE_ENABLED=true")
    print("  3. Restart Mission Control to enable on-device routing")

if __name__ == "__main__":
    main()
