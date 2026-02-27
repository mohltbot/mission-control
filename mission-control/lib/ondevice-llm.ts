/**
 * Apple On-Device LLM Integration
 * 
 * Bridges to Apple's local Foundation Model inference on Apple Silicon.
 * Provides FREE, fast, private LLM execution for simple tasks.
 * 
 * Source: Ben's Bites Feb 26, 2026
 * @see https://github.com/apple/python-apple-fm-sdk
 */

import { spawn } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';

interface OnDeviceOptions {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
}

interface OnDeviceResponse {
  text: string;
  tokensGenerated: number;
  latencyMs: number;
  model: string;
  fallback?: boolean;
  fallbackReason?: string;
}

interface SystemInfo {
  available: boolean;
  reason?: string;
  platform?: string;
  chip?: string;
  memoryGB?: number;
}

const PYTHON_BRIDGE = join(process.cwd(), 'python', 'apple_llm_bridge.py');

/**
 * Check if Apple on-device inference is available
 */
export async function checkAvailability(): Promise<SystemInfo> {
  return new Promise((resolve) => {
    const proc = spawn('python3', [PYTHON_BRIDGE, '--check']);
    let output = '';
    
    proc.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        try {
          const info = JSON.parse(output);
          resolve(info);
        } catch {
          resolve({ available: false, reason: 'Invalid response from bridge' });
        }
      } else {
        resolve({ 
          available: false, 
          reason: 'Python bridge not available or Apple FM SDK not installed' 
        });
      }
    });
    
    proc.on('error', () => {
      resolve({ available: false, reason: 'Failed to spawn Python bridge' });
    });
  });
}

/**
 * Generate text using Apple on-device LLM
 * Falls back to cloud API if local inference fails
 */
export async function generate(options: OnDeviceOptions): Promise<OnDeviceResponse> {
  const startTime = Date.now();
  
  return new Promise((resolve, reject) => {
    const args = [
      PYTHON_BRIDGE,
      '--prompt', options.prompt,
      '--max-tokens', String(options.maxTokens || 150),
      '--temperature', String(options.temperature || 0.7),
    ];
    
    if (options.topP) {
      args.push('--top-p', String(options.topP));
    }
    
    const proc = spawn('python3', args);
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
          resolve({
            text: result.text,
            tokensGenerated: result.tokens_generated || 0,
            latencyMs,
            model: result.model || 'apple-ondevice-smollm2',
          });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${output}`));
        }
      } else {
        // Return a fallback indication rather than hard failing
        resolve({
          text: '',
          tokensGenerated: 0,
          latencyMs,
          model: 'fallback-required',
          fallback: true,
          fallbackReason: errorOutput || `Process exited with code ${code}`,
        });
      }
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Quick check if system supports on-device inference
 */
export function isAvailable(): boolean {
  // Synchronous check - use checkAvailability() for detailed info
  try {
    const isDarwin = process.platform === 'darwin';
    const isArm64 = process.arch === 'arm64';
    return isDarwin && isArm64;
  } catch {
    return false;
  }
}

/**
 * Estimate cost savings from using on-device LLM
 */
export function estimateSavings(tokensGenerated: number): {
  cloudCost: number;
  localCost: number;
  savings: number;
  savingsPercent: number;
} {
  // Cloud API cost: $0.0015 per 1K tokens (Kimi-k2.5)
  const cloudCost = (tokensGenerated / 1000) * 0.0015;
  
  // Local cost: $0 (just electricity, negligible)
  const localCost = 0;
  
  return {
    cloudCost,
    localCost,
    savings: cloudCost - localCost,
    savingsPercent: 100,
  };
}

/**
 * Middleware for Model Router integration
 * Returns true if this task should use on-device inference
 */
export function shouldUseOnDevice(task: {
  complexity: 'simple' | 'standard' | 'complex' | 'critical';
  type: string;
  requiresReasoning?: boolean;
}): boolean {
  // Only for simple tasks without complex reasoning
  if (task.complexity !== 'simple') return false;
  if (task.requiresReasoning) return false;
  
  // Good task types for on-device
  const goodTypes = [
    'summarization',
    'extraction',
    'classification',
    'formatting',
    'simple_qa',
    'sentiment',
  ];
  
  return goodTypes.includes(task.type);
}

// Export singleton for easy importing
export const onDeviceLLM = {
  generate,
  checkAvailability,
  isAvailable,
  estimateSavings,
  shouldUseOnDevice,
};

export default onDeviceLLM;
