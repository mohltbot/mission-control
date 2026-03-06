/**
 * Example usage of pplx-embed for Mission Control
 */

import { initPplxEmbed, getPplxEmbed, searchMemory } from './pplx-embed';

async function main() {
  // Initialize with your API key
  initPplxEmbed({
    apiKey: process.env.PERPLEXITY_API_KEY || '',
    model: 'pplx-embed'
  });

  const client = getPplxEmbed();

  // Example 1: Embed a task description
  console.log('🔹 Example 1: Single embedding');
  const taskEmbedding = await client.embed(
    "Implement user authentication with JWT tokens and refresh mechanism"
  );
  console.log(`Embedding dimension: ${taskEmbedding.embedding.length}`);
  console.log(`Tokens used: ${taskEmbedding.usage.total_tokens}`);

  // Example 2: Batch embed multiple memories
  console.log('\n🔹 Example 2: Batch embeddings');
  const memories = [
    "Met with Sarah about the Q4 roadmap",
    "Fixed the database connection pool issue",
    "Need to review the new design mockups",
    "Deployed version 2.1 to production"
  ];
  
  const batchResults = await client.embedBatch(memories);
  console.log(`Embedded ${batchResults.length} memories`);

  // Example 3: Semantic similarity search
  console.log('\n🔹 Example 3: Similarity search');
  const query = "database performance issues";
  const corpus = [
    { text: "Optimized SQL queries for faster loading", metadata: { date: '2026-03-01' } },
    { text: "Fixed the database connection pool issue", metadata: { date: '2026-03-02' } },
    { text: "Updated the landing page copy", metadata: { date: '2026-03-03' } },
    { text: "Added caching layer for API responses", metadata: { date: '2026-03-04' } }
  ];

  const similar = await client.findSimilar(query, corpus, 2);
  console.log(`Query: "${query}"`);
  console.log('Top matches:');
  similar.forEach((result, i) => {
    console.log(`  ${i + 1}. "${result.text}" (score: ${result.score.toFixed(3)})`);
  });
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}
