import React, { useState, useEffect } from 'react';
import { Timer, ListTodo, BarChart3, Settings, User, LogOut } from 'lucide-react';
import { TimerPanel } from './components/TimerPanel';
import { TasksPanel } from './components/TasksPanel';
import { StatsPanel } from './components/StatsPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { IdleOverlay } from './components/IdleOverlay';
import { Toaster } from './components/ui/toaster';

type Tab = 'timer' | 'tasks' | 'stats' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [isIdle, setIsIdle] = useState(false);
  const [idleDuration, setIdleDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [employeeName, setEmployeeName] = useState('Employee');

  useEffect(() => {
    // Setup idle detection listeners
    window.electronAPI.onIdleStarted((idleTime) => {
      setIsIdle(true);
      setIdleDuration(idleTime);
    });

    window.electronAPI.onIdleEnded((duration) => {
      setIsIdle(false);
      setIdleDuration(0);
    });

    window.electronAPI.onServerConnected(() => {
      setIsConnected(true);
    });

    window.electronAPI.onServerDisconnected(() => {
      setIsConnected(false);
    });

    // Load employee info
    loadEmployeeInfo();

    return () => {
      window.electronAPI.removeAllListeners('idle:started');
      window.electronAPI.removeAllListeners('idle:ended');
      window.electronAPI.removeAllListeners('server:connected');
      window.electronAPI.removeAllListeners('server:disconnected');
    };
  }, []);

  const loadEmployeeInfo = async () => {
    try {
      const name = await window.electronAPI.getConfig('employeeName');
      if (name) setEmployeeName(name);
    } catch (error) {
      console.error('Failed to load employee info:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'timer':
        return <TimerPanel />;
      case 'tasks':
        return <TasksPanel />;
      case 'stats':
        return <StatsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <TimerPanel />;
    }
  };

  const tabs = [
    { id: 'timer' as Tab, label: 'Timer', icon: Timer },
    { id: 'tasks' as Tab, label: 'Tasks', icon: ListTodo },
    { id: 'stats' as Tab, label: 'Stats', icon: BarChart3 },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="font-semibold text-lg">ArchTrack</h1>
              <p className="text-xs text-muted-foreground">Employee Tracker</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{employeeName}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-xs text-muted-foreground">
                  {isConnected ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {renderContent()}
      </main>

      {/* Idle Overlay */}
      {isIdle && <IdleOverlay duration={idleDuration} />}

      {/* Toaster */}
      <Toaster />
    </div>
  );
}

export default App;
