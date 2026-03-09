#!/usr/bin/env node
/**
 * Budget Reconciliation Script
 * 
 * Fixes the budget tracking bug where expense #9 ($21.85 "correction")
 * caused 7x over-reporting of actual Moonshot API costs.
 * 
 * Actual spend: ~$3.49
 * Tracked spend: $33.49 (with erroneous correction)
 * 
 * Usage: node scripts/reconcile-budget.mjs
 */

import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '..', 'data', 'db.json');

async function reconcileBudget() {
  console.log('🔍 Budget Reconciliation Tool');
  console.log('=============================\n');

  try {
    // Read current database
    const data = JSON.parse(await readFile(DB_PATH, 'utf8'));
    const expenses = data.expenses || [];

    console.log(`📊 Found ${expenses.length} expense entries`);

    // Find the erroneous correction
    const erroneousExpense = expenses.find(e => e.id === 9);
    if (!erroneousExpense) {
      console.log('✅ No erroneous expense #9 found - budget already clean');
      return;
    }

    console.log(`\n⚠️  Found erroneous expense:`);
    console.log(`   ID: ${erroneousExpense.id}`);
    console.log(`   Description: ${erroneousExpense.description}`);
    console.log(`   Amount: $${erroneousExpense.amount}`);
    console.log(`   Created: ${erroneousExpense.created_at}`);

    // Calculate actual totals
    const moonshotExpenses = expenses.filter(e => e.provider === 'moonshot' && e.id !== 9);
    const actualMoonshotSpend = moonshotExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
    const correctedSpend = totalSpend - erroneousExpense.amount;

    console.log(`\n📈 Spend Analysis:`);
    console.log(`   Moonshot expenses (excluding #9): ${moonshotExpenses.length} entries`);
    console.log(`   Actual Moonshot spend: $${actualMoonshotSpend.toFixed(4)}`);
    console.log(`   Total tracked (with error): $${totalSpend.toFixed(4)}`);
    console.log(`   Corrected total: $${correctedSpend.toFixed(4)}`);
    console.log(`   Over-reporting: $${erroneousExpense.amount.toFixed(2)} (${((erroneousExpense.amount / correctedSpend) * 100).toFixed(0)}%)`);

    // Fix: Remove the erroneous expense
    console.log(`\n🔧 Fixing...`);
    data.expenses = expenses.filter(e => e.id !== 9);
    
    // Add a correction entry to document the fix
    data.expenses.push({
      id: Date.now(),
      description: "Budget reconciliation: Removed erroneous $21.85 correction (expense #9)",
      amount: 0,
      category: "reconciliation",
      provider: "system",
      model: "n/a",
      tokens_in: 0,
      tokens_out: 0,
      created_at: new Date().toISOString(),
      metadata: {
        action: "removed_erroneous_expense",
        removed_expense_id: 9,
        removed_amount: erroneousExpense.amount,
        previous_total: totalSpend,
        corrected_total: correctedSpend
      }
    });

    // Write back to database
    await writeFile(DB_PATH, JSON.stringify(data, null, 2));

    console.log(`✅ Budget reconciled successfully!`);
    console.log(`\n📋 Summary:`);
    console.log(`   • Removed erroneous expense #9 ($21.85)`);
    console.log(`   • Added reconciliation record`);
    console.log(`   • New expense count: ${data.expenses.length}`);
    console.log(`   • Corrected total spend: $${correctedSpend.toFixed(4)}`);
    console.log(`\n💡 Budget is now accurate. Future tracking should use:`);
    console.log(`   - Real-time API cost logging`);
    console.log(`   - Validation before adding corrections`);
    console.log(`   - Weekly reconciliation checks`);

  } catch (error) {
    console.error('❌ Error reconciling budget:', error.message);
    process.exit(1);
  }
}

reconcileBudget();
