#!/usr/bin/env node
/**
 * Agent Diagnostics Integration
 * 
 * This script wires the self-diagnostics module to actual agent execution.
 * To be fully activated once PR #11 (Self-Diagnostics Module) is merged.
 * 
 * Features:
 * - Wraps agent execution with diagnostics tracking
 * - Captures errors, performance metrics, and budget usage
 * - Sends critical alerts to Discord
 */

import * as fs from 'fs';
import * as path from 'path';

interface DiagnosticEvent {
  timestamp: string;
  agent: string;
  task: string;
  status: 'started' | 'completed' | 'failed';
  duration?: number;
  error?: string;
  tokensUsed?: number;
  cost?: number;
}

const DIAGNOSTICS_FILE = path.join(process.cwd(), 'data', 'diagnostics.jsonl');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Log diagnostic event
function logEvent(event: DiagnosticEvent) {
  const line = JSON.stringify(event);
  fs.appendFileSync(DIAGNOSTICS_FILE, line + '\n');
  
  // Log to console for visibility
  const icon = event.status === 'completed' ? '✅' : event.status === 'failed' ? '❌' : '🔄';
  console.log(`${icon} [${event.agent}] ${event.task} - ${event.status}`);
  
  // Critical error alerting
  if (event.status === 'failed' && event.error) {
    console.error(`🚨 CRITICAL: ${event.agent} failed on "${event.task}"`);
    console.error(`   Error: ${event.error}`);
    // Discord webhook would be called here
  }
}

// Execute with diagnostics wrapper
export async function withDiagnostics<T>(
  agentName: string,
  taskName: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  // Log start
  logEvent({
    timestamp: new Date().toISOString(),
    agent: agentName,
    task: taskName,
    status: 'started',
  });
  
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    
    // Log completion
    logEvent({
      timestamp: new Date().toISOString(),
      agent: agentName,
      task: taskName,
      status: 'completed',
      duration,
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Log failure
    logEvent({
      timestamp: new Date().toISOString(),
      agent: agentName,
      task: taskName,
      status: 'failed',
      duration,
      error: errorMessage,
    });
    
    throw error;
  }
}

// Budget check with diagnostics
export function checkBudgetAlert(budgetUsed: number, budgetTotal: number = 200): void {
  const percentUsed = (budgetUsed / budgetTotal) * 100;
  
  if (percentUsed >= 90) {
    console.error(`🚨 CRITICAL BUDGET ALERT: ${percentUsed.toFixed(1)}% used ($${budgetUsed.toFixed(2)} / $${budgetTotal})`);
    logEvent({
      timestamp: new Date().toISOString(),
      agent: 'budget-monitor',
      task: 'budget-check',
      status: 'failed',
      error: `Budget critical: ${percentUsed.toFixed(1)}% used`,
    });
  } else if (percentUsed >= 75) {
    console.warn(`⚠️  BUDGET WARNING: ${percentUsed.toFixed(1)}% used ($${budgetUsed.toFixed(2)} / $${budgetTotal})`);
    logEvent({
      timestamp: new Date().toISOString(),
      agent: 'budget-monitor',
      task: 'budget-check',
      status: 'completed',
    });
  }
}

// Get diagnostic summary
export function getDiagnosticSummary(hours: number = 24): {
  total: number;
  completed: number;
  failed: number;
  averageDuration: number;
  byAgent: Record<string, { completed: number; failed: number }>;
} {
  if (!fs.existsSync(DIAGNOSTICS_FILE)) {
    return { total: 0, completed: 0, failed: 0, averageDuration: 0, byAgent: {} };
  }
  
  const cutoff = Date.now() - (hours * 60 * 60 * 1000);
  const lines = fs.readFileSync(DIAGNOSTICS_FILE, 'utf-8').trim().split('\n');
  
  const events: DiagnosticEvent[] = lines
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter((e): e is DiagnosticEvent => e && new Date(e.timestamp).getTime() > cutoff);
  
  const completed = events.filter(e => e.status === 'completed');
  const failed = events.filter(e => e.status === 'failed');
  
  const durations = completed
    .map(e => e.duration || 0)
    .filter(d => d > 0);
  
  const byAgent: Record<string, { completed: number; failed: number }> = {};
  for (const event of events) {
    if (!byAgent[event.agent]) {
      byAgent[event.agent] = { completed: 0, failed: 0 };
    }
    if (event.status === 'completed') {
      byAgent[event.agent].completed++;
    } else if (event.status === 'failed') {
      byAgent[event.agent].failed++;
    }
  }
  
  return {
    total: events.length,
    completed: completed.length,
    failed: failed.length,
    averageDuration: durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0,
    byAgent,
  };
}

// CLI execution
if (require.main === module) {
  ensureDataDir();
  
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (command === 'summary') {
    const hours = parseInt(args[1]) || 24;
    const summary = getDiagnosticSummary(hours);
    
    console.log(`\n📊 Diagnostic Summary (Last ${hours}h)\n`);
    console.log(`Total Events: ${summary.total}`);
    console.log(`Completed: ${summary.completed} ✅`);
    console.log(`Failed: ${summary.failed} ❌`);
    console.log(`Success Rate: ${summary.total > 0 ? ((summary.completed / summary.total) * 100).toFixed(1) : 0}%`);
    console.log(`Avg Duration: ${summary.averageDuration.toFixed(0)}ms`);
    
    if (Object.keys(summary.byAgent).length > 0) {
      console.log(`\nBy Agent:`);
      for (const [agent, stats] of Object.entries(summary.byAgent)) {
        console.log(`  ${agent}: ${stats.completed}✅ ${stats.failed}❌`);
      }
    }
  } else if (command === 'test') {
    // Test the diagnostics wrapper
    withDiagnostics('test-agent', 'sample-task', async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      return 'success';
    }).then(() => {
      console.log('\n✅ Diagnostics test completed');
    });
  } else {
    console.log(`
Usage: npx ts-node scripts/diagnostics.ts <command>

Commands:
  summary [hours]  - Show diagnostic summary (default: 24h)
  test             - Run a test to verify diagnostics work
    `);
  }
}
