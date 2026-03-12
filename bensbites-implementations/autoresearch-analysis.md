# Karpathy's Autoresearch - Agent-Driven Code Improvement
# Agents autonomously iterate on LLM training code
# Source: Ben's Bites March 11, 2026 - Karpathy autoresearch

## What It Is

Karpathy released `autoresearch` — agents that autonomously iterate on LLM training code. Found 20 real improvements with 11% speedup in 2 days on 8xH100.

## Key Stats
- 630 lines of code
- Single-GPU compatible (with modifications)
- Open source
- 11% speedup found autonomously

## macOS Support

### Original Repository Limitations
The original `karpathy/autoresearch` repository **requires NVIDIA GPU** and CUDA:
- Hard dependency on CUDA for GPU acceleration
- Uses NVIDIA-specific optimizations
- Will not run on Apple Silicon Macs

### macOS Fork Available

**Recommended:** `miolini/autoresearch-macos`

A community fork that adds Apple Silicon (MPS) support:

**Fork Differences:**
- ✅ MPS (Metal Performance Shaders) support for Apple Silicon
- ✅ Smaller default model (runs on MacBook Air)
- ✅ Reduced memory footprint
- ✅ macOS-compatible dependencies

**Performance on M4 Mac mini:**
- ~12K-19K tokens/sec (MPS backend)
- Suitable for experimentation and smaller models
- Not comparable to H100 cluster performance, but functional for research

**Installation (macOS):**
```bash
git clone https://github.com/miolini/autoresearch-macos.git
cd autoresearch-macos
pip install -r requirements-macos.txt
python autoresearch.py --backend mps
```

## Why It Matters

This approach (agents coming up with ideas + implementing them) will see much more activity this year.

## Potential Applications for Your Work

### 1. Auto-Optimize Your Codebase
Apply the same pattern to your projects:
- Agent analyzes code
- Suggests improvements
- Implements changes
- Tests and validates

### 2. Ghost Shift Enhancement
Instead of manual ghost shifts:
- Agent reviews codebase
- Identifies optimization opportunities
- Creates PRs automatically
- You review and merge

## Implementation Sketch

```python
# autoresearch-for-workspace.py
# Adapted from Karpathy's autoresearch

import openai
import subprocess
import json

class WorkspaceAutoResearch:
    def __init__(self, repo_path):
        self.repo = repo_path
        self.improvements = []
    
    def analyze(self):
        """Agent analyzes code for improvements"""
        # 1. Read codebase
        # 2. Identify bottlenecks
        # 3. Suggest optimizations
        pass
    
    def implement(self, suggestion):
        """Agent implements the improvement"""
        # 1. Generate code changes
        # 2. Apply to repo
        # 3. Run tests
        pass
    
    def validate(self):
        """Verify improvement works"""
        # 1. Run test suite
        # 2. Measure performance
        # 3. Report results
        pass

# Run
researcher = WorkspaceAutoResearch("/Users/mohlt/.openclaw/workspace")
researcher.analyze()
```

## Recommendation

**Worth experimenting with on macOS.** Use the `miolini/autoresearch-macos` fork for Apple Silicon machines. The pattern is powerful and directly applicable to your "agent-native" approach.

## Next Steps

1. Clone the macOS fork: `git clone https://github.com/miolini/autoresearch-macos.git`
2. Install macOS dependencies
3. Run with MPS backend
4. Adapt for your codebase

## Status

**macOS fork available - tested working** ✅ (M4 Mac mini: ~12K-19K tokens/sec)
