import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  Activity,
  AlertCircle,
} from 'lucide-react';

interface DashboardStats {
  totalEmployees: number;
  onlineEmployees: number;
  activeProjects: number;
  todayHours: number;
  weekHours: number;
  activeTimers: number;
  productivityScore: number;
}

interface RecentActivity {
  id: string;
  employeeName: string;
  action: string;
  timestamp: string;
  details?: string;
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    onlineEmployees: 0,
    activeProjects: 0,
    todayHours: 0,
    weekHours: 0,
    activeTimers: 0,
    productivityScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Fetch stats
      const statsRes = await fetch('/api/time-entries/stats/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats((prev) => ({ ...prev, ...statsData }));
      }

      // Fetch employees count
      const employeesRes = await fetch('/api/employees', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (employeesRes.ok) {
        const employees = await employeesRes.json();
        setStats((prev) => ({
          ...prev,
          totalEmployees: employees.length,
          onlineEmployees: employees.filter((e: any) => e.isActive).length,
        }));
      }

      // Fetch projects count
      const projectsRes = await fetch('/api/projects?status=active', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (projectsRes.ok) {
        const projects = await projectsRes.json();
        setStats((prev) => ({ ...prev, activeProjects: projects.length }));
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setIsLoading(false);
    }
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Online Now',
      value: stats.onlineEmployees,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: "Today's Hours",
      value: formatHours(stats.todayHours),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Timers',
      value: stats.activeTimers,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your team's activity and productivity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-card rounded-xl p-6 border shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{card.title}</p>
                    <p className="text-3xl font-bold mt-2">{card.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Weekly Hours Chart */}
          <div className="col-span-2 bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">This Week</span>
                <span className="font-semibold">{formatHours(stats.weekHours)}</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all rounded-full"
                  style={{ width: `${Math.min((stats.weekHours / 40) * 100, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">0h</span>
                <span className="text-muted-foreground">Target: 40h</span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Productivity Score</span>
                <span className="font-semibold">{stats.productivityScore}%</span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${
                    stats.productivityScore >= 80 ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${stats.productivityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl border shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Add Employee</p>
                  <p className="text-sm text-muted-foreground">Create new team member</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">New Project</p>
                  <p className="text-sm text-muted-foreground">Start a new project</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors text-left">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">View Reports</p>
                  <p className="text-sm text-muted-foreground">Generate time reports</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-card rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Active Projects</h3>
            <span className="text-sm text-muted-foreground">
              {stats.activeProjects} active
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Project {i}</span>
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                    Active
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${Math.random() * 60 + 20}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {Math.floor(Math.random() * 10 + 2)} tasks in progress
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
