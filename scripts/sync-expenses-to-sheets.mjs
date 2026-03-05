#!/usr/bin/env node
/**
 * Expense Tracking Automation - BUG FIX VERSION
 * Syncs API costs from local logs to Google Sheets for accurate budget tracking
 * Fixes the budget tracking bug by reconciling actual vs tracked spend
 * 
 * CHANGES (Mar 4, 2026):
 * - Fixed reconciliation loop accumulation bug
 * - Added data validation (alert if daily > $10)
 * - Added duplicate detection
 * - Added integrity checks
 * 
 * Usage: node scripts/sync-expenses-to-sheets.mjs
 * Cron: 0 */6 * * * (every 6 hours)
 */

import { google } from 'googleapis';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPENSE_LOG = path.join(__dirname, '../data/expenses.json');
const TOKEN_PATH = path.join(process.env.HOME, '.config/gog/tokens.json');

// Google Sheets config
const SPREADSHEET_ID = process.env.MISSION_CONTROL_SHEET_ID || '1YourSheetIDHere';
const SHEET_NAME = 'API Costs';

// Validation thresholds
const MAX_DAILY_SPEND = 10.00; // Alert if single day > $10
const MAX_SINGLE_EXPENSE = 5.00; // Alert if single expense > $5

async function loadExpenses() {
  try {
    const data = await fs.readFile(EXPENSE_LOG, 'utf8');
    const parsed = JSON.parse(data);
    
    // Validate structure
    if (!parsed.entries || !Array.isArray(parsed.entries)) {
      console.warn('⚠️  Invalid expense log structure, resetting');
      return { entries: [], totalTracked: 0, lastSync: null };
    }
    
    return parsed;
  } catch {
    return { entries: [], totalTracked: 0, lastSync: null };
  }
}

async function saveExpenses(expenses) {
  await fs.writeFile(EXPENSE_LOG, JSON.stringify(expenses, null, 2));
}

async function getAuth() {
  try {
    const tokens = JSON.parse(await fs.readFile(TOKEN_PATH, 'utf8'));
    const auth = new google.auth.OAuth2();
    auth.setCredentials(tokens);
    return auth;
  } catch (error) {
    throw new Error(`Google auth failed: ${error.message}. Run 'gog auth refresh'`);
  }
}

function validateExpense(expense, index) {
  const errors = [];
  
  // Check required fields
  if (!expense.timestamp) errors.push(`Entry ${index}: Missing timestamp`);
  if (!expense.provider) errors.push(`Entry ${index}: Missing provider`);
  if (typeof expense.cost !== 'number') errors.push(`Entry ${index}: Invalid cost`);
  if (expense.cost < 0) errors.push(`Entry ${index}: Negative cost`);
  
  // Check thresholds
  if (expense.cost > MAX_SINGLE_EXPENSE) {
    errors.push(`Entry ${index}: Single expense $${expense.cost.toFixed(4)} exceeds threshold ($${MAX_SINGLE_EXPENSE})`);
  }
  
  return errors;
}

function detectDuplicates(entries) {
  const seen = new Set();
  const duplicates = [];
  
  entries.forEach((entry, index) => {
    // Create unique key from timestamp + provider + cost + task
    const key = `${entry.timestamp}-${entry.provider}-${entry.cost}-${entry.task || 'unknown'}`;
    if (seen.has(key)) {
      duplicates.push({ index, entry });
    } else {
      seen.add(key);
    }
  });
  
  return duplicates;
}

async function syncToSheets(expenses, dryRun = false) {
  // Filter out already-synced entries
  const unsyncedEntries = expenses.entries.filter(e => !e.synced);
  
  if (unsyncedEntries.length === 0) {
    console.log('ℹ️ No new expenses to sync');
    return { synced: 0, rows: [] };
  }
  
  console.log(`📤 Syncing ${unsyncedEntries.length} expense entries...`);
  
  // Validate all entries
  const validationErrors = [];
  unsyncedEntries.forEach((entry, idx) => {
    const errors = validateExpense(entry, idx);
    validationErrors.push(...errors);
  });
  
  if (validationErrors.length > 0) {
    console.error('\n❌ Validation errors found:');
    validationErrors.forEach(err => console.error(`  - ${err}`));
    throw new Error('Validation failed - fix errors before syncing');
  }
  
  // Check for duplicates
  const duplicates = detectDuplicates(expenses.entries);
  if (duplicates.length > 0) {
    console.warn(`\n⚠️  Found ${duplicates.length} potential duplicate entries`);
    duplicates.forEach(({ index, entry }) => {
      console.warn(`  - Entry ${index}: ${entry.provider} $${entry.cost} at ${entry.timestamp}`);
    });
  }
  
  // Prepare data rows (FIXED: don't accumulate, just map individual entries)
  const rows = unsyncedEntries.map(e => [
    new Date(e.timestamp).toISOString(),
    e.provider,
    e.model || 'unknown',
    e.tokensIn || 0,
    e.tokensOut || 0,
    e.cost, // FIXED: Use actual cost, not running total
    e.task || 'unknown',
    e.sessionId?.slice(0, 8) || 'N/A'
  ]);
  
  if (dryRun) {
    console.log('\n🔍 DRY RUN - Would sync:');
    rows.forEach(row => console.log(`  ${row[0]} | ${row[1]} | $${row[5]}`));
    return { synced: 0, rows };
  }
  
  // Sync to Google Sheets
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:H`,
    valueInputOption: 'USER_ENTERED',
    resource: { values: rows }
  });
  
  // Mark entries as synced
  const now = new Date().toISOString();
  unsyncedEntries.forEach(entry => {
    entry.synced = true;
    entry.syncedAt = now;
  });
  
  console.log(`✅ Synced ${rows.length} expense entries to Google Sheets`);
  
  return { synced: rows.length, rows };
}

async function reconcileBudget(expenses) {
  // FIXED: Calculate actual spend correctly (sum of individual costs, no accumulation)
  const actualSpend = expenses.entries.reduce((sum, e) => sum + (e.cost || 0), 0);
  
  // Update totalTracked to match actual (fix the bug)
  const previousTracked = expenses.totalTracked || 0;
  expenses.totalTracked = actualSpend;
  
  const discrepancy = previousTracked - actualSpend;
  
  console.log('\n🔍 Budget Reconciliation:');
  console.log(`  Previous tracked: $${previousTracked.toFixed(2)}`);
  console.log(`  Actual spend:     $${actualSpend.toFixed(2)}`);
  console.log(`  Correction:       $${discrepancy.toFixed(2)} ${discrepancy > 0 ? '(removed overcount)' : '(added undercount)'}`);
  
  // Daily threshold check
  const today = new Date().toISOString().split('T')[0];
  const todaySpend = expenses.entries
    .filter(e => e.timestamp?.startsWith(today))
    .reduce((sum, e) => sum + e.cost, 0);
  
  console.log(`\n📅 Today's spend: $${todaySpend.toFixed(2)}`);
  
  if (todaySpend > MAX_DAILY_SPEND) {
    console.warn(`⚠️  ALERT: Daily spend $${todaySpend.toFixed(2)} exceeds threshold ($${MAX_DAILY_SPEND})`);
    // TODO: Send Discord alert
  }
  
  return { actualSpend, discrepancy, todaySpend };
}

async function generateReport(expenses) {
  const providerTotals = expenses.entries.reduce((acc, e) => {
    acc[e.provider] = (acc[e.provider] || 0) + e.cost;
    return acc;
  }, {});
  
  const modelTotals = expenses.entries.reduce((acc, e) => {
    const key = `${e.provider}/${e.model || 'unknown'}`;
    acc[key] = (acc[key] || 0) + e.cost;
    return acc;
  }, {});
  
  console.log('\n📊 Spend Report:');
  console.log('  By Provider:');
  Object.entries(providerTotals)
    .sort(([,a], [,b]) => b - a)
    .forEach(([provider, cost]) => {
      console.log(`    ${provider}: $${cost.toFixed(4)}`);
    });
  
  console.log('\n  By Model:');
  Object.entries(modelTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .forEach(([model, cost]) => {
      console.log(`    ${model}: $${cost.toFixed(4)}`);
    });
  
  // Budget status
  const MONTHLY_BUDGET = 200;
  const percentUsed = (expenses.totalTracked / MONTHLY_BUDGET) * 100;
  console.log(`\n💰 Budget Status: $${expenses.totalTracked.toFixed(2)} / $${MONTHLY_BUDGET} (${percentUsed.toFixed(1)}%)`);
  
  if (percentUsed > 90) {
    console.error('🔴 CRITICAL: Budget over 90%!');
  } else if (percentUsed > 70) {
    console.warn('🟡 WARNING: Budget over 70%');
  } else {
    console.log('🟢 Healthy');
  }
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const reset = process.argv.includes('--reset');
  
  console.log('💰 Expense Tracking Automation');
  console.log('==============================\n');
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }
  
  try {
    let expenses = await loadExpenses();
    
    if (reset) {
      console.log('🔄 Resetting tracked amounts to match actual...');
      await reconcileBudget(expenses);
      await saveExpenses(expenses);
      console.log('✅ Reset complete');
      return;
    }
    
    if (expenses.entries.length === 0) {
      console.log('ℹ️ No expenses logged yet');
      return;
    }
    
    // Sync to sheets
    const { synced } = await syncToSheets(expenses, dryRun);
    
    // Reconcile budget
    const { actualSpend, discrepancy } = await reconcileBudget(expenses);
    
    // Generate report
    await generateReport(expenses);
    
    // Save updated expenses (with synced flags and corrected totals)
    if (!dryRun) {
      await saveExpenses(expenses);
      
      if (Math.abs(discrepancy) > 0.01) {
        console.log('\n✅ Budget corrected and saved');
      }
    }
    
    console.log('\n✅ Expense sync complete');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.message.includes('invalid_grant')) {
      console.log('\n🔧 Fix: Run "gog auth refresh" to renew Google tokens');
    }
    process.exit(1);
  }
}

main();
