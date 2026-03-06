# Perplexity pplx-embed Integration

**Source:** Ben's Bites Newsletter (March 3, 2026)  
**Research:** https://research.perplexity.ai/articles/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval

## Overview

Perplexity's `pplx-embed` models are state-of-the-art embedding models specifically trained for large-scale retrieval tasks. They outperform OpenAI's `text-embedding-3-large` on many benchmarks.

## Why This Fits Your Stack

- **Better Memory Retrieval**: Superior embeddings = more accurate memory recall
- **Cost Effective**: Competitive pricing vs OpenAI embeddings
- **Web-Scale**: Designed for large document collections
- **Mission Control Integration**: Powers the memory/RAG system

## Installation

```bash
# Add to .env
PERPLEXITY_API_KEY=your_api_key_here
```

## Usage

```typescript
import { initPplxEmbed, searchMemory } from './lib/embeddings/pplx-embed';

// Initialize
initPplxEmbed({
  apiKey: process.env.PERPLEXITY_API_KEY!,
  model: 'pplx-embed'
});

// Generate embeddings
const result = await getPplxEmbed().embed("Your text here");
console.log(result.embedding); // float[] vector

// Find similar texts
const similar = await getPplxEmbed().findSimilar(
  "query text",
  [
    { text: "Document 1", metadata: { source: "memory" } },
    { text: "Document 2", metadata: { source: "notes" } }
  ],
  3 // top 3 results
);
```

## Models

| Model | Dimensions | Best For |
|-------|------------|----------|
| `pplx-embed` | 1024 | High-accuracy retrieval |
| `pplx-embed-lite` | 512 | Faster, lower latency |

## Integration with Mission Control

This module integrates with:
- **Memory Search**: Powering semantic search across daily notes
- **Task Matching**: Finding related tasks from history
- **Knowledge Base**: RAG for the knowledge management system
- **Ghost Shift**: Context retrieval for autonomous work sessions

## Cost Comparison

| Provider | Model | Price per 1M tokens |
|----------|-------|---------------------|
| Perplexity | pplx-embed | ~$0.10 |
| OpenAI | text-embedding-3-small | $0.02 |
| OpenAI | text-embedding-3-large | $0.13 |

*pplx-embed offers better quality at competitive pricing*

## Benchmarks

pplx-embed achieves SOTA results on:
- **MTEB** (Massive Text Embedding Benchmark)
- **BEIR** (Information Retrieval benchmark)
- **Long-context retrieval** tasks

---
*Auto-implemented from Ben's Bites scan on 2026-03-06*
