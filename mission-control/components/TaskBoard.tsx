'use client';

import { Task } from '@/lib/models';
import { CheckCircle2, Circle, Clock, AlertCircle, Calendar } from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
}

const statusConfig = {
  pending: { icon: Circle, color: 'text-slate-400', bg: 'bg-slate-500/20', label: 'Pending' },
  in_progress: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/20', label: 'In Progress' },
  completed: { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Completed' },
  blocked: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Blocked' },
};

const priorityConfig = {
  low: { color: 'text-slate-400', bg: 'bg-slate-500/10', label: 'Low' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Medium' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'High' },
  critical: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Critical' },
};

export function TaskBoard({ tasks }: TaskBoardProps) {
  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Tasks</h2>
        </div>
        <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-full">
          {tasks.length} total
        </span>
      </div>

      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-800/50 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-slate-500 text-sm">No tasks yet</p>
            <p className="text-slate-600 text-xs mt-1">Add tasks via the API</p>
          </div>
        ) : (
          tasks.map((task, index) => {
            const status = statusConfig[task.status];
            const priority = priorityConfig[task.priority];
            const StatusIcon = status.icon;
            
            return (
              <div 
                key={task.id} 
                className="group p-4 rounded-xl bg-slate-800/40 border border-white/5 hover:bg-slate-800/60 hover:border-white/10 transition-all duration-200 slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full ${status.bg.replace('/20', '')} ${status.color}`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-slate-200 text-sm leading-tight group-hover:text-white transition-colors">
                        {task.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${priority.bg} ${priority.color}`}>
                        {priority.label}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-slate-500 text-xs mb-2 line-clamp-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <StatusIcon className={`w-3 h-3 ${status.color}`} />
                        <span className={status.color}>{status.label}</span>
                      </div>
                      
                      {task.category && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-700/50 text-slate-400">
                          {task.category}
                        </span>
                      )}
                      
                      <div className="flex items-center gap-1 ml-auto">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
