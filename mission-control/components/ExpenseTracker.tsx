'use client';

import { Expense } from '@/lib/models';
import { Wallet, TrendingUp, AlertTriangle } from 'lucide-react';

interface ExpenseTrackerProps {
  expenses: Expense[];
}

export function ExpenseTracker({ expenses }: ExpenseTrackerProps) {
  const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = 200;
  const percentUsed = (totalSpend / budget) * 100;
  
  const getBudgetColor = () => {
    if (percentUsed > 90) return 'from-red-500 to-red-600';
    if (percentUsed > 75) return 'from-amber-500 to-orange-600';
    return 'from-emerald-500 to-emerald-600';
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Budget Tracker</h2>
        </div>
        {percentUsed > 90 && (
          <div className="flex items-center gap-1 text-red-400 text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Critical</span>
          </div>
        )}
      </div>

      {/* Main budget display */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Monthly Spend</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">${totalSpend.toFixed(2)}</span>
              <span className="text-slate-500 text-sm">/ ${budget}</span>
            </div>
          </div>
          <div className={`text-right ${percentUsed > 90 ? 'text-red-400' : percentUsed > 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
            <span className="text-2xl font-bold">{percentUsed.toFixed(1)}%</span>
            <p className="text-xs opacity-70">used</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getBudgetColor()} rounded-full transition-all duration-1000 relative`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          >
            {percentUsed > 0 && <div className="absolute inset-0 shimmer" />}
          </div>
        </div>
        
        {/* Budget markers */}
        <div className="flex justify-between mt-2 text-[10px] text-slate-500">
          <span>0%</span>
          <span className="text-amber-400">75% warning</span>
          <span className="text-red-400">90% critical</span>
          <span>100%</span>
        </div>
      </div>

      {/* Recent expenses */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-medium text-slate-300">Recent Activity</h3>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {expenses.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-4">No expenses yet</p>
          ) : (
            expenses.slice(0, 5).map((expense, index) => (
              <div 
                key={expense.id} 
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 hover:bg-slate-800/60 transition-colors"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-medium text-slate-400">
                      {expense.provider?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-slate-300 text-xs font-medium truncate">{expense.description}</p>
                    <p className="text-slate-500 text-[10px]">{expense.model || expense.category}</p>
                  </div>
                </div>
                <span className="text-slate-400 text-xs font-mono shrink-0">
                  ${expense.amount.toFixed(4)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
