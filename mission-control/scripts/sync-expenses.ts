#!/usr/bin/env node
/**
 * Expense Sync Automation
 * 
 * Syncs API expenses from Mission Control to a CSV/JSONL log
 * Can be extended to sync to Google Sheets when OAuth is restored
 * 
 * Usage: node scripts/sync-expenses.ts
 * Cron: Runs daily at 11:55 PM to log daily spend
 */

import * as fs from 'fs';
import * as path from 'path';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  provider: string;
  model?: string;
  tokens_in?: number;
  tokens_out?: number;
  timestamp: string;
}

interface DailySummary {
  date: string;
  totalSpend: number;
  callCount: number;
  byProvider: Record<string, number>;
  byModel: Record<string, number>;
}

const EXPENSES_FILE = path.join(process.cwd(), 'data', 'expenses.jsonl');
const DAILY_SUMMARY_FILE = path.join(process.cwd(), 'data', 'daily-summaries.jsonl');
const CSV_FILE = path.join(process.cwd(), 'data', 'expenses.csv');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Load all expenses from JSONL
function loadExpenses(): Expense[] {
  if (!fs.existsSync(EXPENSES_FILE)) return [];
  
  const lines = fs.readFileSync(EXPENSES_FILE, 'utf-8').trim().split('\n');
  return lines
    .filter(line => line.trim())
    .map(line => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

// Calculate daily summary
function calculateDailySummary(expenses: Expense[], date: string): DailySummary {
  const dayExpenses = expenses.filter(e => e.timestamp.startsWith(date));
  
  const byProvider: Record<string, number> = {};
  const byModel: Record<string, number> = {};
  
  let totalSpend = 0;
  
  for (const expense of dayExpenses) {
    totalSpend += expense.amount;
    
    byProvider[expense.provider] = (byProvider[expense.provider] || 0) + expense.amount;
    
    if (expense.model) {
      const modelKey = `${expense.provider}/${expense.model}`;
      byModel[modelKey] = (byModel[modelKey] || 0) + expense.amount;
    }
  }
  
  return {
    date,
    totalSpend,
    callCount: dayExpenses.length,
    byProvider,
    byModel,
  };
}

// Export to CSV
function exportToCSV(expenses: Expense[]) {
  const headers = ['timestamp', 'description', 'amount', 'category', 'provider', 'model', 'tokens_in', 'tokens_out'];
  const rows = expenses.map(e => [
    e.timestamp,
    `"${e.description?.replace(/"/g, '""') || ''}"`,
    e.amount.toFixed(6),
    e.category,
    e.provider,
    e.model || '',
    e.tokens_in || '',
    e.tokens_out || '',
  ]);
  
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  fs.writeFileSync(CSV_FILE, csv);
}

// Generate daily report
function generateReport(summary: DailySummary): string {
  const lines = [
    `📊 Daily API Expense Report - ${summary.date}`,
    ``,
    `Total Spend: $${summary.totalSpend.toFixed(4)}`,
    `API Calls: ${summary.callCount}`,
    ``,
    `By Provider:`,
    ...Object.entries(summary.byProvider)
      .sort((a, b) => b[1] - a[1])
      .map(([provider, amount]) => `  • ${provider}: $${amount.toFixed(4)}`),
    ``,
    `By Model:`,
    ...Object.entries(summary.byModel)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([model, amount]) => `  • ${model}: $${amount.toFixed(4)}`),
  ];
  
  return lines.join('\n');
}

// Main function
async function main() {
  console.log('🤖 Expense Sync Automation\n');
  
  ensureDataDir();
  
  const today = new Date().toISOString().split('T')[0];
  const expenses = loadExpenses();
  
  console.log(`📁 Loaded ${expenses.length} total expenses`);
  
  // Calculate today's summary
  const summary = calculateDailySummary(expenses, today);
  
  // Export to CSV
  exportToCSV(expenses);
  console.log(`✅ Exported to ${CSV_FILE}`);
  
  // Save daily summary
  const summaryLine = JSON.stringify(summary);
  fs.appendFileSync(DAILY_SUMMARY_FILE, summaryLine + '\n');
  console.log(`✅ Saved daily summary`);
  
  // Generate and display report
  const report = generateReport(summary);
  console.log('\n' + report);
  
  // Write report for Discord notification
  const reportFile = path.join(process.cwd(), 'data', 'daily-report.txt');
  fs.writeFileSync(reportFile, report);
  console.log(`\n✅ Report saved to ${reportFile}`);
}

main().catch(console.error);
