import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Calendar, TrendingUp, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface DailyStats {
  date: string;
  hours: number;
  tasksCompleted: number;
}

interface ProjectStats {
  projectName: string;
  hours: number;
  percentage: number;
}

export function StatsPanel() {
  const [todayHours, setTodayHours] = useState(0);
  const [weekHours, setWeekHours] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([]);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Load today's hours
      const today = await window.electronAPI.getTodayTotal();
      setTodayHours(today);

      // Load mock data for other stats (would come from API in production)
      setWeekHours(today + 24.5); // Mock week total
      setTasksCompleted(12);

      // Mock daily stats
      setDailyStats([
        { date: 'Mon', hours: 7.5, tasksCompleted: 3 },
        { date: 'Tue', hours: 8.0, tasksCompleted: 4 },
        { date: 'Wed', hours: 6.5, tasksCompleted: 2 },
        { date: 'Thu', hours: 8.5, tasksCompleted: 5 },
        { date: 'Fri', hours: today, tasksCompleted: 2 },
      ]);

      // Mock project stats
      setProjectStats([
        { projectName: 'Downtown Office Building', hours: 18.5, percentage: 40 },
        { projectName: 'Residential Complex', hours: 12.0, percentage: 26 },
        { projectName: 'Park Renovation', hours: 8.5, percentage: 18 },
        { projectName: 'Other Tasks', hours: 7.5, percentage: 16 },
      ]);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const maxDailyHours = Math.max(...dailyStats.map((d) => d.hours), 8);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Statistics</h1>
          <p className="text-muted-foreground mt-1">
            Track your productivity and time allocation
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatHours(todayHours)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {todayHours >= 8 ? 'Goal reached!' : `${(8 - todayHours).toFixed(1)}h to goal`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatHours(weekHours)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {weekHours >= 40 ? 'Weekly goal reached!' : `${(40 - weekHours).toFixed(1)}h to goal`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Tasks Done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{tasksCompleted}</div>
              <p className="text-xs text-muted-foreground mt-1">
                This week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Avg. Daily
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {formatHours(weekHours / 5)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Hours per day
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Daily Hours Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Daily Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyStats.map((day) => (
                  <div key={day.date} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{day.date}</span>
                      <span className="text-muted-foreground">
                        {formatHours(day.hours)} • {day.tasksCompleted} tasks
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all rounded-full"
                        style={{
                          width: `${(day.hours / maxDailyHours) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Project Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Time by Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projectStats.map((project) => (
                  <div key={project.projectName} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium truncate max-w-[200px]">
                        {project.projectName}
                      </span>
                      <span className="text-muted-foreground">
                        {formatHours(project.hours)} ({project.percentage}%)
                      </span>
                    </div>
                    <Progress value={project.percentage} />
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Tracked</span>
                  <span className="font-semibold">
                    {formatHours(projectStats.reduce((acc, p) => acc + p.hours, 0))}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Goal Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Goal Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Target: 40 hours/week</span>
                <span className="font-semibold">
                  {((weekHours / 40) * 100).toFixed(0)}% complete
                </span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${
                    weekHours >= 40 ? 'bg-green-500' : 'bg-primary'
                  }`}
                  style={{
                    width: `${Math.min((weekHours / 40) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {weekHours >= 40
                  ? 'Congratulations! You\'ve reached your weekly goal.'
                  : `${(40 - weekHours).toFixed(1)} hours remaining to reach your goal.`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
