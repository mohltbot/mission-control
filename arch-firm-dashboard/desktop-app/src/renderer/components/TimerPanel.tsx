import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, Square, Clock, Briefcase, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useToast } from './ui/toaster';

interface Task {
  id: string;
  title: string;
  projectName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export function TimerPanel() {
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [todayTotal, setTodayTotal] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const { addToast } = useToast();

  useEffect(() => {
    loadTasks();
    loadTimerStatus();
    loadTodayTotal();

    // Update timer display every second
    const interval = setInterval(() => {
      if (isRunning) {
        setDuration((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const loadTasks = async () => {
    try {
      const tasksData = await window.electronAPI.getTasks();
      const formattedTasks = tasksData.map((t: any) => ({
        id: t.id,
        title: t.title,
        projectName: t.projectName || 'General',
        priority: t.priority,
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadTimerStatus = async () => {
    try {
      const status = await window.electronAPI.getTimeStatus();
      setIsRunning(status.isRunning);
      setDuration(status.duration || 0);
      if (status.currentEntry?.taskId) {
        const task = tasks.find((t) => t.id === status.currentEntry.taskId);
        if (task) setCurrentTask(task);
      }
    } catch (error) {
      console.error('Failed to load timer status:', error);
    }
  };

  const loadTodayTotal = async () => {
    try {
      const total = await window.electronAPI.getTodayTotal();
      setTodayTotal(total);
    } catch (error) {
      console.error('Failed to load today total:', error);
    }
  };

  const startTimer = async () => {
    try {
      const task = tasks.find((t) => t.id === selectedTaskId);
      await window.electronAPI.startTimer(selectedTaskId, task?.projectName || '');
      setIsRunning(true);
      setCurrentTask(task || null);
      addToast({
        title: 'Timer Started',
        description: task ? `Working on: ${task.title}` : 'General timer started',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to start timer',
        variant: 'destructive',
      });
    }
  };

  const stopTimer = async () => {
    try {
      await window.electronAPI.stopTimer();
      setIsRunning(false);
      setDuration(0);
      setCurrentTask(null);
      loadTodayTotal();
      addToast({
        title: 'Timer Stopped',
        description: 'Time entry saved successfully',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to stop timer',
        variant: 'destructive',
      });
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Time Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Track your work time and productivity
            </p>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5" />
            <span>Today: {formatHours(todayTotal)}</span>
          </div>
        </div>

        {/* Timer Card */}
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-6">
              {/* Timer Display */}
              <div className="relative">
                <div
                  className={`text-7xl font-mono font-bold tracking-wider ${
                    isRunning ? 'text-primary timer-pulse' : 'text-muted-foreground'
                  }`}
                >
                  {formatDuration(duration)}
                </div>
              </div>

              {/* Current Task */}
              {currentTask && (
                <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{currentTask.title}</span>
                  <Badge variant={getPriorityColor(currentTask.priority)}>
                    {currentTask.priority}
                  </Badge>
                </div>
              )}

              {/* Task Selection */}
              {!isRunning && (
                <div className="w-full max-w-md">
                  <label className="text-sm font-medium mb-2 block">
                    Select Task (Optional)
                  </label>
                  <select
                    value={selectedTaskId}
                    onChange={(e) => setSelectedTaskId(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  >
                    <option value="">General work (no specific task)</option>
                    {tasks.map((task) => (
                      <option key={task.id} value={task.id}>
                        {task.title} - {task.projectName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex items-center gap-4">
                {!isRunning ? (
                  <Button
                    size="lg"
                    onClick={startTimer}
                    className="px-8 py-6 text-lg"
                  >
                    <Play className="w-6 h-6 mr-2" />
                    Start Timer
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    variant="destructive"
                    onClick={stopTimer}
                    className="px-8 py-6 text-lg"
                  >
                    <Square className="w-6 h-6 mr-2" />
                    Stop Timer
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today's Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatHours(todayTotal)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <>
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium text-green-600">Working</span>
                  </>
                ) : (
                  <>
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <span className="font-medium text-muted-foreground">Idle</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
