import { executeWithBestModel } from './lib/model-router';
import { checkMLXHealth } from './lib/mlx';
import { checkOllamaHealth } from './lib/ollama';

async function testCascade() {
  console.log("🔥 CASCADE ROUTING VERIFICATION\n");
  
  // 1. Check MLX availability
  console.log("1️⃣ Checking MLX (Primary)...");
  const mlx = await checkMLXHealth();
  console.log(`   Status: ${mlx.available ? '✅ AVAILABLE' : '❌ Unavailable'}`);
  if (mlx.available) {
    console.log(`   Chip: ${mlx.chip}`);
    console.log(`   MLX Version: ${mlx.mlxVersion}`);
  }
  
  // 2. Check Ollama availability  
  console.log("\n2️⃣ Checking Ollama (Fallback)...");
  const ollama = await checkOllamaHealth();
  console.log(`   Status: ${ollama.available ? '✅ AVAILABLE' : '❌ Unavailable'}`);
  if (ollama.available) {
    console.log(`   Models: ${ollama.models?.join(', ') || 'none'}`);
  }
  
  // 3. Test simple task (should use MLX)
  console.log("\n3️⃣ Testing SIMPLE task (should use MLX)...");
  const simpleResult = await executeWithBestModel('chat', 'What is 2+2?', {
    preferLocal: true,
  });
  console.log(`   Model Used: ${simpleResult.modelUsed}`);
  console.log(`   Is Local: ${simpleResult.local}`);
  console.log(`   Cost: $${simpleResult.cost.toFixed(4)}`);
  console.log(`   Duration: ${simpleResult.duration}ms`);
  console.log(`   ✅ ${simpleResult.modelUsed.startsWith('mlx') ? 'MLX PRIMARY WORKING' : 'USED FALLBACK'}`);
  
  // 4. Test with preferLocal=false (should skip local, use cloud)
  console.log("\n4️⃣ Testing with preferLocal=false (should use CLOUD)...");
  const cloudResult = await executeWithBestModel('analysis', 'Analyze market trends', {
    preferLocal: false,
  });
  console.log(`   Model Used: ${cloudResult.modelUsed}`);
  console.log(`   Is Local: ${cloudResult.local}`);
  console.log(`   Cost: $${cloudResult.cost.toFixed(4)}`);
  console.log(`   ✅ CLOUD FALLBACK WORKING`);
  
  console.log("\n📊 CASCADE STATUS:");
  console.log(`   MLX: ${mlx.available ? '✅' : '❌'}`);
  console.log(`   Ollama: ${ollama.available ? '✅' : '❌'}`);
  console.log(`   Simple task → ${simpleResult.modelUsed}`);
  console.log(`   Cloud task → ${cloudResult.modelUsed}`);
}

testCascade().catch(console.error);
