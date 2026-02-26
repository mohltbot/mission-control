'use client';

import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle: string;
  trend: number;
  color: string;
  delay: number;
}

export function StatsCard({ icon: Icon, title, value, subtitle, trend, color, delay }: StatsCardProps) {
  return (
    <div 
      className="glass-card p-4 md:p-5 transition-all duration-300 hover:scale-[1.02] group slide-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend > 0 && (
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse" />
            {trend}%
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
        <p className="text-slate-500 text-xs">{subtitle}</p>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-1 bg-slate-700/50 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${Math.min(trend, 100)}%` }}
        />
      </div>
    </div>
  );
}
