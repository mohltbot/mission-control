import { shouldUseMLX } from './lib/mlx';

const task = {
  type: 'chat',
  promptLength: 10,
  complexity: 'simple' as const,
};

const decision = shouldUseMLX(task);
console.log("MLX Decision for 'chat' task:");
console.log(`  useMLX: ${decision.useMLX}`);
console.log(`  reason: ${decision.reason}`);

// Also test other task types
const types = ['summarization', 'extraction', 'classification', 'chat', 'coding', 'analysis'];
console.log("\nAll task types:");
for (const type of types) {
  const d = shouldUseMLX({ type, promptLength: 50, complexity: 'simple' });
  console.log(`  ${type}: ${d.useMLX ? '✅' : '❌'} - ${d.reason}`);
}
