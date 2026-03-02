/**
 * MLX LLM Integration - Production Primary Local Inference
 * 
 * Uses Apple's MLX framework for fastest local inference on Apple Silicon.
 * This is the PRIMARY local method - 5-7x faster than Ollama.
 * Ollama serves as fallback when MLX fails.
 * 
 * Requirements:
 *   - macOS on Apple Silicon (M1/M2/M3/M4)
 *   - Python venv with: pip install mlx-lm transformers
 * 
 * Performance:
 *   - Load time: ~0.3s
 *   - Inference: 100-400 tokens/sec
 *   - Cost: $0.00 (completely free)
 */

import { spawn } from 'child_process';
import { join } from 'path';

interface MLXOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

interface MLXResponse {
  text: string;
  tokensGenerated: number;
  latencyMs: number;
  model: string;
  tokensPerSec: number;
  fromCache: boolean;
  fallback?: boolean;
  fallbackReason?: string;
}

interface SystemInfo {
  available: boolean;
  reason?: string;
  platform?: string;
  chip?: string;
  mlxVersion?: string;
  transformersVersion?: string;
}

const PYTHON_BRIDGE = join(process.cwd(), 'python', 'mlx_bridge.py');
// Venv is at workspace root, not inside mission-control
const VENV_PYTHON = join(process.cwd(), '..', 'venv', 'bin', 'python3');
const DEFAULT_MODEL = 'mlx-community/SmolLM2-360M-Instruct';

/**
 * Check if MLX inference is available
 */
export async function checkMLXHealth(): Promise<SystemInfo> {
  return new Promise((resolve) => {
    const pythonPath = require('fs').existsSync(VENV_PYTHON) ? VENV_PYTHON : 'python3';
    const proc = spawn(pythonPath, [PYTHON_BRIDGE, '--check']);
    let output = '';
    
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(output);
          resolve({
            available: info.available,
            reason: info.reason,
            platform: info.platform,
            chip: info.chip,
            mlxVersion: info.mlx_version,
            transformersVersion: info.transformers_version,
          });
        } catch {
          resolve({ available: false, reason: 'Invalid response from MLX bridge' });
        }
      } else {
        resolve({ 
          available: false, 
          reason: 'MLX bridge not available or dependencies not installed' 
        });
      }
    });
    
    proc.on('error', () => {
      resolve({ available: false, reason: 'Failed to spawn MLX bridge' });
    });
  });
}

/**
 * Generate text using MLX (PRIMARY local method)
 */
export async function generateWithMLX(options: MLXOptions): Promise<MLXResponse> {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const args = [
      PYTHON_BRIDGE,
      '--prompt', options.prompt,
      '--max-tokens', String(options.maxTokens || 150),
      '--temperature', String(options.temperature || 0.7),
      '--model', options.model || DEFAULT_MODEL,
    ];
    
    const pythonPath = require('fs').existsSync(VENV_PYTHON) ? VENV_PYTHON : 'python3';
    const proc = spawn(pythonPath, args, {
      env: {
        ...process.env,
        PYTHONPATH: join(process.cwd(), 'venv', 'lib', 'python3.14', 'site-packages'),
      }
    });
    
    let output = '';
    let errorOutput = '';
    
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    proc.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    proc.on('close', (code) => {
      const latencyMs = Date.now() - startTime;
      
      if (code === 0) {
        try {
          const result = JSON.parse(output);
          
          if (result.error) {
            resolve({
              text: '',
              tokensGenerated: 0,
              latencyMs,
              model: 'mlx-fallback',
              tokensPerSec: 0,
              fromCache: false,
              fallback: true,
              fallbackReason: result.error,
            });
            return;
          }
          
          resolve({
            text: result.text,
            tokensGenerated: result.tokens_generated,
            latencyMs,
            model: result.model,
            tokensPerSec: result.tokens_per_sec,
            fromCache: result.from_cache,
          });
        } catch (e) {
          resolve({
            text: '',
            tokensGenerated: 0,
            latencyMs,
            model: 'mlx-fallback',
            tokensPerSec: 0,
            fromCache: false,
            fallback: true,
            fallbackReason: `Failed to parse response: ${output}`,
          });
        }
      } else {
        resolve({
          text: '',
          tokensGenerated: 0,
          latencyMs,
          model: 'mlx-fallback',
          tokensPerSec: 0,
          fromCache: false,
          fallback: true,
          fallbackReason: errorOutput || `Process exited with code ${code}`,
        });
      }
    });
    
    proc.on('error', (err) => {
      resolve({
        text: '',
        tokensGenerated: 0,
        latencyMs: Date.now() - startTime,
        model: 'mlx-fallback',
        tokensPerSec: 0,
        fromCache: false,
        fallback: true,
        fallbackReason: err.message,
      });
    });
  });
}

/**
 * Quick synchronous check
 */
export function isMLXAvailable(): boolean {
  try {
    return process.platform === 'darwin' && process.arch === 'arm64';
  } catch {
    return false;
  }
}

/**
 * Determine if a task should use MLX based on characteristics
 */
export function shouldUseMLX(task: {
  type: string;
  promptLength: number;
  complexity: 'simple' | 'standard' | 'complex';
}): { useMLX: boolean; reason: string } {
  // MLX excels at simple, short tasks
  if (task.complexity !== 'simple') {
    return { useMLX: false, reason: 'Task complexity requires cloud model' };
  }
  
  if (task.promptLength > 1000) {
    return { useMLX: false, reason: 'Prompt too long for local model' };
  }
  
  // Good task types for MLX
  const goodTypes = [
    'summarization',
    'extraction',
    'classification',
    'formatting',
    'simple_qa',
    'sentiment',
    'entity_recognition',
    'chat',  // Simple chat/queries work well locally
  ];
  
  if (!goodTypes.includes(task.type)) {
    return { useMLX: false, reason: 'Task type better suited for cloud model' };
  }
  
  return { useMLX: true, reason: 'Simple task ideal for MLX fast inference' };
}

/**
 * Cost savings estimate
 */
export function estimateMLXSavings(tokensGenerated: number): {
  cloudCost: number;
  mlxCost: number;
  savings: number;
  savingsPercent: number;
} {
  // Cloud cost: ~$0.0015 per 1K tokens (average)
  const cloudCost = (tokensGenerated / 1000) * 0.0015;
  
  return {
    cloudCost,
    mlxCost: 0,
    savings: cloudCost,
    savingsPercent: 100,
  };
}

// Export singleton
export const mlxLLM = {
  generate: generateWithMLX,
  checkHealth: checkMLXHealth,
  isAvailable: isMLXAvailable,
  shouldUseMLX,
  estimateSavings: estimateMLXSavings,
};

export default mlxLLM;
