export interface Employee {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'employee';
    department?: string;
    avatar?: string;
    createdAt: Date;
    lastActiveAt?: Date;
    isOnline?: boolean;
    currentTaskId?: string;
}
export interface Project {
    id: string;
    name: string;
    description: string;
    clientName: string;
    status: 'active' | 'completed' | 'on_hold' | 'cancelled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    startDate: Date;
    endDate?: Date;
    budget?: number;
    assignedEmployeeIds: string[];
    createdAt: Date;
    updatedAt: Date;
    progress: number;
}
export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string;
    assignedTo: string;
    status: 'todo' | 'in_progress' | 'review' | 'completed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimatedHours?: number;
    actualHours: number;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
    dueDate?: Date;
}
export interface TimeEntry {
    id: string;
    employeeId: string;
    taskId: string;
    projectId: string;
    startTime: Date;
    endTime?: Date;
    duration: number;
    isRunning: boolean;
    idleTime: number;
    notes?: string;
    screenshots?: string[];
}
export interface ActivityLog {
    id: string;
    employeeId: string;
    type: 'task_started' | 'task_completed' | 'timer_started' | 'timer_stopped' | 'idle_detected' | 'screenshot_captured' | 'app_opened' | 'app_closed';
    timestamp: Date;
    details?: Record<string, any>;
}
export interface IdleEvent {
    id: string;
    employeeId: string;
    startTime: Date;
    endTime?: Date;
    duration: number;
    reason?: string;
}
export interface Screenshot {
    id: string;
    employeeId: string;
    timestamp: Date;
    path: string;
    thumbnailPath: string;
    taskId?: string;
}
export interface Report {
    id: string;
    type: 'time_summary' | 'project_summary' | 'employee_productivity' | 'idle_analysis';
    title: string;
    generatedAt: Date;
    generatedBy: string;
    dateRange: {
        start: Date;
        end: Date;
    };
    filters?: Record<string, any>;
    data: any;
}
export interface DashboardStats {
    totalEmployees: number;
    onlineEmployees: number;
    activeProjects: number;
    completedProjects: number;
    totalHoursToday: number;
    totalHoursThisWeek: number;
    averageProductivity: number;
    pendingTasks: number;
}
export interface EmployeeActivity {
    employeeId: string;
    employeeName: string;
    isOnline: boolean;
    currentTask?: Task;
    currentProject?: Project;
    todayHours: number;
    weekHours: number;
    lastActivityAt: Date;
    status: 'working' | 'idle' | 'offline' | 'break';
}
export interface ServerToClientEvents {
    'employee:status': (data: EmployeeActivity) => void;
    'employee:activity': (data: ActivityLog) => void;
    'task:updated': (task: Task) => void;
    'project:updated': (project: Project) => void;
    'time:entry': (entry: TimeEntry) => void;
    'dashboard:stats': (stats: DashboardStats) => void;
    'notification': (notification: {
        type: string;
        message: string;
    }) => void;
}
export interface ClientToServerEvents {
    'auth:login': (data: {
        employeeId: string;
        token: string;
    }) => void;
    'auth:logout': () => void;
    'time:start': (data: {
        taskId: string;
        projectId: string;
    }) => void;
    'time:stop': (data: {
        entryId: string;
        notes?: string;
    }) => void;
    'activity:log': (data: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
    'idle:detected': (data: {
        duration: number;
    }) => void;
    'idle:returned': (data: {
        idleDuration: number;
    }) => void;
    'heartbeat': () => void;
}
export interface InterServerEvents {
    ping: () => void;
}
export interface SocketData {
    employeeId: string;
    isAuthenticated: boolean;
}
//# sourceMappingURL=shared-types.d.ts.map