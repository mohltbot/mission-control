/**
 * Perplexity pplx-embed Integration
 * SOTA embedding models for web-scale retrieval
 * 
 * Source: Ben's Bites (March 3, 2026)
 * https://research.perplexity.ai/articles/pplx-embed-state-of-the-art-embedding-models-for-web-scale-retrieval
 */

export interface EmbeddingConfig {
  apiKey: string;
  model?: 'pplx-embed' | 'pplx-embed-lite';
  baseUrl?: string;
}

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  usage: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface SimilarityResult {
  text: string;
  score: number;
  metadata?: Record<string, any>;
}

export class PplxEmbedClient {
  private apiKey: string;
  private model: string;
  private baseUrl: string;

  constructor(config: EmbeddingConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model || 'pplx-embed';
    this.baseUrl = config.baseUrl || 'https://api.perplexity.ai';
  }

  /**
   * Generate embeddings for a single text
   */
  async embed(text: string): Promise<EmbeddingResult> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      embedding: data.data[0].embedding,
      model: data.model,
      usage: data.usage,
    };
  }

  /**
   * Generate embeddings for multiple texts (batch)
   */
  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.data.map((item: any, index: number) => ({
      embedding: item.embedding,
      model: data.model,
      usage: {
        prompt_tokens: Math.floor(data.usage.prompt_tokens / texts.length),
        total_tokens: Math.floor(data.usage.total_tokens / texts.length),
      },
    }));
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }

  /**
   * Find most similar texts from a corpus
   */
  async findSimilar(
    query: string,
    corpus: Array<{ text: string; metadata?: Record<string, any> }>,
    topK: number = 5
  ): Promise<SimilarityResult[]> {
    // Embed query and all corpus texts
    const queryEmbedding = await this.embed(query);
    const corpusEmbeddings = await this.embedBatch(corpus.map(c => c.text));

    // Calculate similarities
    const similarities = corpusEmbeddings.map((result, index) => ({
      text: corpus[index].text,
      score: this.cosineSimilarity(queryEmbedding.embedding, result.embedding),
      metadata: corpus[index].metadata,
    }));

    // Sort by similarity and return top K
    return similarities
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }
}

/**
 * Singleton instance for Mission Control integration
 */
let pplxClient: PplxEmbedClient | null = null;

export function initPplxEmbed(config: EmbeddingConfig): PplxEmbedClient {
  pplxClient = new PplxEmbedClient(config);
  return pplxClient;
}

export function getPplxEmbed(): PplxEmbedClient {
  if (!pplxClient) {
    throw new Error('PplxEmbed not initialized. Call initPplxEmbed first.');
  }
  return pplxClient;
}

/**
 * Integration with Mission Control memory system
 */
export async function searchMemory(query: string, options?: { topK?: number }): Promise<SimilarityResult[]> {
  const client = getPplxEmbed();
  
  // This would integrate with the actual memory store
  // For now, placeholder that shows the pattern
  const memoryCorpus = await loadMemoryCorpus();
  
  return client.findSimilar(query, memoryCorpus, options?.topK || 5);
}

async function loadMemoryCorpus(): Promise<Array<{ text: string; metadata: any }>> {
  // Integration point: Load from Mission Control memory store
  // This would connect to the actual memory database
  return [];
}
