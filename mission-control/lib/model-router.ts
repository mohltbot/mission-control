import { API_PRICING, logAPICall } from './expense-tracker';
import { 
  checkMLXHealth, 
  generateWithMLX, 
  shouldUseMLX,
  estimateMLXSavings,
} from './mlx';
import { 
  checkOllamaHealth, 
  generateLocal, 
  shouldUseLocalInference,
  getInferenceComparison,
  DEFAULT_OLLAMA_CONFIG 
} from './ollama';

export type ModelTier = 'fast' | 'balanced' | 'powerful' | 'local';
export type TaskType = 'coding' | 'writing' | 'analysis' | 'creative' | 'chat' | 'vision' | 'simple';

interface ModelRecommendation {
  provider: string;
  model: string;
  estimatedCost: number;
  confidence: number; // 0-1, how sure we are this model is appropriate
  reason: string;
}

// Model capabilities mapping
const MODEL_CAPABILITIES: Record<string, {
  tiers: ModelTier[];
  tasks: TaskType[];
  strengths: string[];
  weaknesses: string[];
}> = {
  // Cheap, fast models
  'deepseek-chat': {
    tiers: ['fast', 'balanced'],
    tasks: ['coding', 'writing', 'chat'],
    strengths: ['fast', 'cheap', 'good_at_coding'],
    weaknesses: ['complex_reasoning', 'creative_tasks'],
  },
  'minimax-m2.5': {
    tiers: ['fast', 'balanced'],
    tasks: ['coding', 'writing', 'chat', 'analysis'],
    strengths: ['fast', 'cheap', 'good_at_coding', 'chinese_language'],
    weaknesses: ['complex_reasoning'],
  },
  'glm-5': {
    tiers: ['balanced', 'powerful'],
    tasks: ['coding', 'writing', 'analysis', 'chat'],
    strengths: ['tool_calling', 'cheap', 'good_at_coding'],
    weaknesses: ['creative_writing'],
  },
  'gemini-1.5-flash': {
    tiers: ['fast'],
    tasks: ['writing', 'chat', 'vision'],
    strengths: ['very_cheap', 'fast', 'vision'],
    weaknesses: ['complex_coding', 'deep_analysis'],
  },
  
  // Mid-tier models
  'kimi-k2.5': {
    tiers: ['balanced', 'powerful'],
    tasks: ['coding', 'writing', 'analysis', 'chat', 'creative'],
    strengths: ['balanced', 'good_at_coding', 'context_window', 'chinese_language'],
    weaknesses: ['extremely_complex_reasoning'],
  },
  'claude-3-sonnet': {
    tiers: ['balanced', 'powerful'],
    tasks: ['coding', 'writing', 'analysis', 'chat', 'creative'],
    strengths: ['coding', 'analysis', 'safety'],
    weaknesses: ['cost'],
  },
  'gpt-4o-mini': {
    tiers: ['fast', 'balanced'],
    tasks: ['coding', 'writing', 'chat'],
    strengths: ['fast', 'cheap', 'vision'],
    weaknesses: ['complex_reasoning'],
  },
  
  // Premium models
  'claude-3-opus': {
    tiers: ['powerful'],
    tasks: ['coding', 'writing', 'analysis', 'creative'],
    strengths: ['complex_reasoning', 'coding', 'analysis', 'creative_writing'],
    weaknesses: ['cost', 'speed'],
  },
  'gpt-4o': {
    tiers: ['balanced', 'powerful'],
    tasks: ['coding', 'writing', 'analysis', 'chat', 'vision', 'creative'],
    strengths: ['versatile', 'vision', 'tool_use'],
    weaknesses: ['cost'],
  },
  'gemini-1.5-pro': {
    tiers: ['balanced', 'powerful'],
    tasks: ['coding', 'analysis', 'vision', 'creative'],
    strengths: ['context_window', 'vision', 'cheap_for_quality'],
    weaknesses: ['consistency'],
  },
};

// Cost per 1K tokens for comparison
function getModelCost(model: string): number {
  // Search through all providers for the model
  for (const providerModels of Object.values(API_PRICING)) {
    const pricing = providerModels[model.toLowerCase()];
    if (pricing) {
      return (pricing.input + pricing.output) / 2; // Average of input/output
    }
    // Try partial match
    const modelKey = Object.keys(providerModels).find(key => 
      model.toLowerCase().includes(key.toLowerCase()) ||
      key.toLowerCase().includes(model.toLowerCase())
    );
    if (modelKey) {
      const p = providerModels[modelKey];
      return (p.input + p.output) / 2;
    }
  }
  return 0.005; // Default to conservative estimate
}

// Recommend best model for task
export function recommendModel(
  task: TaskType,
  tier: ModelTier = 'balanced',
  requiredCapabilities: string[] = [],
  maxCost?: number
): ModelRecommendation[] {
  const candidates: ModelRecommendation[] = [];
  
  for (const [model, capabilities] of Object.entries(MODEL_CAPABILITIES)) {
    // Check if model supports the task type
    if (!capabilities.tasks.includes(task)) continue;
    
    // Check if model is in the requested tier
    if (!capabilities.tiers.includes(tier)) continue;
    
    // Check required capabilities
    const hasAllCapabilities = requiredCapabilities.every(cap => 
      capabilities.strengths.includes(cap)
    );
    if (!hasAllCapabilities) continue;
    
    // Calculate cost
    const cost = getModelCost(model);
    if (maxCost && cost > maxCost) continue;
    
    // Calculate confidence score
    let confidence = 0.5;
    if (capabilities.tiers.includes(tier)) confidence += 0.2;
    if (capabilities.tasks.includes(task)) confidence += 0.2;
    confidence += (requiredCapabilities.filter(cap => 
      capabilities.strengths.includes(cap)
    ).length / Math.max(requiredCapabilities.length, 1)) * 0.1;
    
    // Find provider
    let provider = 'unknown';
    for (const [provName, models] of Object.entries(API_PRICING)) {
      if (models[model.toLowerCase()]) {
        provider = provName;
        break;
      }
      // Try partial match
      const modelKey = Object.keys(models).find(key => 
        model.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(model.toLowerCase())
      );
      if (modelKey) {
        provider = provName;
        break;
      }
    }
    
    candidates.push({
      provider,
      model,
      estimatedCost: cost,
      confidence: Math.min(confidence, 1),
      reason: generateReason(model, capabilities, task),
    });
  }
  
  // Sort by cost (cheapest first), then by confidence
  return candidates.sort((a, b) => {
    if (Math.abs(a.confidence - b.confidence) > 0.2) {
      return b.confidence - a.confidence; // Confidence matters more if big difference
    }
    return a.estimatedCost - b.estimatedCost;
  });
}

function generateReason(model: string, capabilities: any, task: TaskType): string {
  const reasons: string[] = [];
  
  if (capabilities.strengths.includes('cheap') || getModelCost(model) < 0.001) {
    reasons.push('very cost-effective');
  }
  
  if (capabilities.strengths.includes('fast')) {
    reasons.push('fast response time');
  }
  
  if (capabilities.strengths.includes('good_at_coding') && task === 'coding') {
    reasons.push('excellent at coding');
  }
  
  if (capabilities.tiers.includes('powerful')) {
    reasons.push('high quality output');
  }
  
  return reasons.join(', ') || 'balanced performance';
}

// Auto-select and use best model
// STRATEGY: MLX (primary) → Ollama (fallback) → Cloud (final fallback)
export async function executeWithBestModel(
  task: TaskType,
  prompt: string,
  options: {
    tier?: ModelTier;
    maxCost?: number;
    requiredCapabilities?: string[];
    fallbackToPremium?: boolean;
    preferLocal?: boolean; // Prefer local inference when possible
  } = {}
): Promise<{
  result: string;
  modelUsed: string;
  cost: number;
  confidence: number;
  local: boolean;
  duration: number;
}> {
  
  const preferLocal = options.preferLocal ?? true;
  const estimatedTokens = Math.ceil(prompt.length / 4);
  
  // === STEP 1: Try MLX (PRIMARY local method - fastest) ===
  if (preferLocal) {
    const mlxDecision = shouldUseMLX({
      type: task,
      promptLength: prompt.length,
      complexity: 'simple',
    });
    
    if (mlxDecision.useMLX) {
      const mlxHealth = await checkMLXHealth();
      
      if (mlxHealth.available) {
        console.log(`🚀 Using MLX (PRIMARY local inference)`);
        console.log(`   Reason: ${mlxDecision.reason}`);
        console.log(`   Expected: 100-400 tokens/sec`);
        
        const mlxStart = Date.now();
        const mlxResult = await generateWithMLX({
          prompt,
          maxTokens: 150,
          temperature: 0.7,
        });
        const mlxDuration = Date.now() - mlxStart;
        
        if (!mlxResult.fallback && mlxResult.text) {
          const savings = estimateMLXSavings(mlxResult.tokensGenerated);
          
          logAPICall({
            provider: 'mlx',
            model: mlxResult.model,
            tokensIn: estimatedTokens,
            tokensOut: mlxResult.tokensGenerated,
            description: `MLX inference for ${task} (${mlxResult.tokensPerSec} t/s, saved $${savings.savings.toFixed(4)})`,
          });
          
          console.log(`   ✅ MLX success: ${mlxResult.tokensPerSec} tokens/sec`);
          console.log(`   💰 Saved: $${savings.savings.toFixed(4)}`);
          
          return {
            result: mlxResult.text,
            modelUsed: `mlx/${mlxResult.model}`,
            cost: 0,
            confidence: 0.75,
            local: true,
            duration: mlxDuration,
          };
        }
        
        console.log(`   ⚠️  MLX failed: ${mlxResult.fallbackReason}, trying Ollama...`);
      }
    }
  }
  
  // === STEP 2: Try Ollama (FALLBACK local method) ===
  if (preferLocal && DEFAULT_OLLAMA_CONFIG.enabled) {
    const ollamaDecision = shouldUseLocalInference(task, prompt.length);
    
    if (ollamaDecision.useLocal) {
      const ollamaHealth = await checkOllamaHealth();
      
      if (ollamaHealth.available) {
        console.log(`🦙 Using Ollama (FALLBACK local inference)`);
        console.log(`   Reason: ${ollamaDecision.reason}`);
        
        const ollamaStart = Date.now();
        const ollamaResult = await generateLocal(prompt, {
          model: ollamaDecision.recommendedModel,
          maxTokens: 150,
        });
        const ollamaDuration = Date.now() - ollamaStart;
        
        if (!ollamaResult.fallbackRequired && ollamaResult.text) {
          const comparison = getInferenceComparison(estimatedTokens);
          
          logAPICall({
            provider: 'ollama',
            model: ollamaResult.model,
            tokensIn: estimatedTokens,
            tokensOut: ollamaResult.tokens,
            description: `Ollama fallback for ${task} (saved $${comparison.savings.toFixed(4)})`,
          });
          
          console.log(`   ✅ Ollama success (slower but working)`);
          console.log(`   💰 Saved: $${comparison.savings.toFixed(4)}`);
          
          return {
            result: ollamaResult.text,
            modelUsed: `ollama/${ollamaResult.model}`,
            cost: 0,
            confidence: 0.7,
            local: true,
            duration: ollamaDuration,
          };
        }
        
        console.log(`   ⚠️  Ollama failed, falling back to cloud...`);
      }
    }
  }
  
  // === STEP 3: Cloud models (FINAL fallback) ===
  const recommendations = recommendModel(
    task,
    options.tier || 'balanced',
    options.requiredCapabilities || [],
    options.maxCost
  );
  
  if (recommendations.length === 0) {
    throw new Error('No suitable model found for task');
  }
  
  const bestModel = recommendations[0];
  
  console.log(`☁️  Using CLOUD model: ${bestModel.model}`);
  console.log(`   Provider: ${bestModel.provider}`);
  console.log(`   Reason: ${bestModel.reason}`);
  console.log(`   Est. cost: $${bestModel.estimatedCost.toFixed(4)} per 1K tokens`);
  
  const actualCost = (estimatedTokens / 1000) * bestModel.estimatedCost;
  
  logAPICall({
    provider: bestModel.provider,
    model: bestModel.model,
    tokensIn: estimatedTokens,
    tokensOut: Math.ceil(estimatedTokens * 0.5),
    description: `Cloud model for ${task} task`,
  });
  
  return {
    result: `[Simulated output from ${bestModel.model}]`,
    modelUsed: bestModel.model,
    cost: actualCost,
    confidence: bestModel.confidence,
    local: false,
    duration: 1000, // Simulated 1s latency
  };
}

// Get cost comparison for a task across all suitable models
export function getCostComparison(
  task: TaskType,
  estimatedTokens: number = 1000
): Array<{
  model: string;
  cost: number;
  tier: ModelTier;
  recommended: boolean;
}> {
  const recommendations = recommendModel(task, 'fast');
  
  return recommendations.map((rec, index) => ({
    model: rec.model,
    cost: rec.estimatedCost * (estimatedTokens / 1000),
    tier: MODEL_CAPABILITIES[rec.model]?.tiers[0] || 'balanced',
    recommended: index === 0,
  }));
}

// Get local inference status and savings report
export async function getLocalInferenceReport(): Promise<{
  mlx: { available: boolean; model: string; speed: string };
  ollama: { available: boolean; models: string[] };
  strategy: string;
  estimatedMonthlySavings: number;
}> {
  const [mlxHealth, ollamaHealth] = await Promise.all([
    checkMLXHealth(),
    checkOllamaHealth(),
  ]);
  
  // Estimate savings: assume 60% of tasks under 150 tokens use local
  const monthlyLocalTasks = 900;
  const avgTokensPerTask = 500;
  const avgCloudCostPer1K = 0.0015;
  
  const hasLocal = mlxHealth.available || ollamaHealth.available;
  const estimatedMonthlySavings = hasLocal
    ? monthlyLocalTasks * (avgTokensPerTask / 1000) * avgCloudCostPer1K
    : 0;
  
  return {
    mlx: {
      available: mlxHealth.available,
      model: 'mlx-community/SmolLM2-360M-Instruct',
      speed: '100-400 tokens/sec',
    },
    ollama: {
      available: ollamaHealth.available,
      models: ollamaHealth.models || [],
    },
    strategy: 'MLX (primary) → Ollama (fallback) → Cloud (final)',
    estimatedMonthlySavings,
  };
}

// Export local inference utilities for external use
export { checkMLXHealth, generateWithMLX, shouldUseMLX, estimateMLXSavings } from './mlx';
export { checkOllamaHealth, generateLocal, shouldUseLocalInference, getInferenceComparison };
