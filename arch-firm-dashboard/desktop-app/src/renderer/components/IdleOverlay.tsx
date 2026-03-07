import React from 'react';
import { Clock, Coffee, MousePointer } from 'lucide-react';

interface IdleOverlayProps {
  duration: number;
}

export function IdleOverlay({ duration }: IdleOverlayProps) {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="fixed inset-0 idle-overlay z-50 flex items-center justify-center">
      <div className="bg-card rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Coffee className="w-10 h-10 text-yellow-600" />
        </div>
        
        <h2 className="text-2xl font-bold mb-2">You're Idle</h2>
        <p className="text-muted-foreground mb-6">
          No activity detected for {formatDuration(duration)}
        </p>

        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Timer is paused</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MousePointer className="w-4 h-4" />
          <span>Move your mouse or press any key to resume</span>
        </div>
      </div>
    </div>
  );
}
