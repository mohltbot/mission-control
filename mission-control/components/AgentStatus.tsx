'use client';

import { Agent } from '@/lib/models';
import { Bot, Cpu, Sparkles } from 'lucide-react';

interface AgentStatusProps {
  agents: Agent[];
}

const statusConfig = {
  idle: { 
    icon: Bot, 
    color: 'text-slate-400', 
    bg: 'bg-slate-500/20',
    border: 'border-slate-500/30',
    label: 'Idle',
    pulse: false
  },
  running: { 
    icon: Cpu, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/30',
    label: 'Running',
    pulse: true
  },
  completed: { 
    icon: Sparkles, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/30',
    label: 'Completed',
    pulse: false
  },
  error: { 
    icon: Bot, 
    color: 'text-red-400', 
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
    label: 'Error',
    pulse: false
  },
};

export function AgentStatus({ agents }: AgentStatusProps) {
  const activeCount = agents.filter(a => a.status === 'running').length;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="w-5 h-5 text-purple-400" />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full status-pulse" />
            )}
          </div>
          <h2 className="text-lg font-semibold text-white">Sub-Agents</h2>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
          activeCount > 0 
            ? 'bg-blue-500/20 text-blue-400' 
            : 'bg-slate-700/50 text-slate-400'
        }`}>
          {activeCount} active
        </span>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
        {agents.length === 0 ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
              <Bot className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">No agents running</p>
            <p className="text-slate-600 text-xs mt-1">Sub-agents will appear here</p>
          </div>
        ) : (
          agents.map((agent, index) => {
            const config = statusConfig[agent.status];
            const StatusIcon = config.icon;
            
            return (
              <div 
                key={agent.id} 
                className={`group p-3 rounded-xl bg-slate-800/40 border border-transparent hover:bg-slate-800/60 transition-all duration-200 ${
                  agent.status === 'running' ? config.border : ''
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center shrink-0`}>
                    <StatusIcon className={`w-5 h-5 ${config.color} ${config.pulse ? 'animate-pulse' : ''}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-medium text-slate-200 text-sm truncate group-hover:text-white transition-colors">
                        {agent.name}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                    
                    <p className="text-slate-500 text-xs truncate">
                      {agent.task || 'Waiting for assignment...'}
                    </p>
                    
                    {agent.started_at && (
                      <p className="text-slate-600 text-[10px] mt-1">
                        Started {new Date(agent.started_at).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    )}
                  </div>
                </div>
                
                {agent.result && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50">
                    <p className="text-slate-400 text-xs line-clamp-2">{agent.result}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick stats */}
      {agents.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="grid grid-cols-4 gap-2 text-center">
            {(['idle', 'running', 'completed', 'error'] as const).map((status) => {
              const count = agents.filter(a => a.status === status).length;
              const config = statusConfig[status];
              return (
                <div key={status} className="p-2 rounded-lg bg-slate-800/30">
                  <p className={`text-lg font-bold ${config.color}`}>{count}</p>
                  <p className="text-[10px] text-slate-500 capitalize">{status}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
