import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';
import { Task, Project, TimeEntry, ActivityLog } from '../shared-types';

interface DatabaseSchema {
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  activityLogs: ActivityLog[];
  settings: Record<string, string>;
}

const defaultData: DatabaseSchema = {
  projects: [],
  tasks: [],
  timeEntries: [],
  activityLogs: [],
  settings: {},
};

export class DatabaseManager {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor() {
    const userDataPath = app ? app.getPath('userData') : path.join(process.cwd(), 'data');
    this.dbPath = path.join(userDataPath, 'archtrack-data.json');
    this.data = this.loadData();
    this.seedTestData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(this.dbPath)) {
        const content = fs.readFileSync(this.dbPath, 'utf-8');
        return { ...defaultData, ...JSON.parse(content) };
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
    return { ...defaultData };
  }

  private saveData(): void {
    try {
      const dir = path.dirname(this.dbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error('Error saving database:', error);
    }
  }

  private seedTestData(): void {
    // Only seed if no data exists
    if (this.data.projects.length === 0 && this.data.tasks.length === 0) {
      // Add sample projects
      this.data.projects = [
        {
          id: 'proj-1',
          name: 'Downtown Office Tower',
          description: 'A 45-story commercial office building in the financial district',
          clientName: 'Metro Development Corp',
          status: 'active',
          priority: 'high',
          startDate: new Date('2024-01-15'),
          endDate: new Date('2025-06-30'),
          budget: 12500000,
          assignedEmployeeIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          progress: 35,
        },
        {
          id: 'proj-2',
          name: 'Riverside Residential Complex',
          description: 'Luxury waterfront apartments with 120 units',
          clientName: 'Riverside Properties LLC',
          status: 'active',
          priority: 'urgent',
          startDate: new Date('2024-02-01'),
          endDate: new Date('2025-03-15'),
          budget: 8500000,
          assignedEmployeeIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          progress: 22,
        },
        {
          id: 'proj-3',
          name: 'Community Cultural Center',
          description: 'Multi-purpose cultural facility with theater and gallery',
          clientName: 'City Arts Council',
          status: 'active',
          priority: 'medium',
          startDate: new Date('2024-03-01'),
          endDate: new Date('2025-08-31'),
          budget: 4200000,
          assignedEmployeeIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          progress: 15,
        },
      ];

      // Add sample tasks
      this.data.tasks = [
        {
          id: 'task-1',
          projectId: 'proj-1',
          title: 'Complete structural analysis',
          description: 'Finalize load calculations and structural framework',
          assignedTo: '',
          status: 'in_progress',
          priority: 'high',
          estimatedHours: 80,
          actualHours: 45,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: new Date('2024-04-15'),
        },
        {
          id: 'task-2',
          projectId: 'proj-1',
          title: 'Design facade mockups',
          description: 'Create 3D visualizations of exterior facade options',
          assignedTo: '',
          status: 'in_progress',
          priority: 'medium',
          estimatedHours: 60,
          actualHours: 30,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: new Date('2024-04-30'),
        },
        {
          id: 'task-3',
          projectId: 'proj-2',
          title: 'Unit layout finalization',
          description: 'Finalize apartment layouts and floor plans',
          assignedTo: '',
          status: 'todo',
          priority: 'urgent',
          estimatedHours: 100,
          actualHours: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: new Date('2024-04-01'),
        },
        {
          id: 'task-4',
          projectId: 'proj-2',
          title: 'Amenity space design',
          description: 'Design gym, pool, and common areas',
          assignedTo: '',
          status: 'todo',
          priority: 'high',
          estimatedHours: 50,
          actualHours: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          dueDate: new Date('2024-04-20'),
        },
      ];

      this.saveData();
      console.log('✅ Sample data seeded to desktop app database');
    }
  }

  // Project operations
  async getProjects(): Promise<Project[]> {
    return this.data.projects;
  }

  async getProject(id: string): Promise<Project | null> {
    return this.data.projects.find(p => p.id === id) || null;
  }

  async saveProject(project: Project): Promise<void> {
    const index = this.data.projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      this.data.projects[index] = { ...project, updatedAt: new Date() };
    } else {
      this.data.projects.push(project);
    }
    this.saveData();
  }

  // Task operations
  async getTasks(employeeId?: string): Promise<Task[]> {
    if (employeeId) {
      return this.data.tasks.filter(t => t.assignedTo === employeeId);
    }
    return this.data.tasks;
  }

  async getTask(id: string): Promise<Task | null> {
    return this.data.tasks.find(t => t.id === id) || null;
  }

  async saveTask(task: Task): Promise<void> {
    const index = this.data.tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      this.data.tasks[index] = { ...task, updatedAt: new Date() };
    } else {
      this.data.tasks.push(task);
    }
    this.saveData();
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    const index = this.data.tasks.findIndex(t => t.id === id);
    if (index >= 0) {
      this.data.tasks[index] = { ...this.data.tasks[index], ...updates, updatedAt: new Date() };
      this.saveData();
    }
  }

  // Time entry operations
  async getTimeEntries(employeeId?: string, startDate?: Date, endDate?: Date): Promise<TimeEntry[]> {
    let entries = this.data.timeEntries;
    
    if (employeeId) {
      entries = entries.filter(e => e.employeeId === employeeId);
    }
    
    if (startDate) {
      entries = entries.filter(e => new Date(e.startTime) >= startDate);
    }
    
    if (endDate) {
      entries = entries.filter(e => new Date(e.startTime) <= endDate);
    }
    
    return entries.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  }

  async getRunningTimeEntry(employeeId: string): Promise<TimeEntry | null> {
    return this.data.timeEntries.find(e => e.employeeId === employeeId && e.isRunning) || null;
  }

  async saveTimeEntry(entry: TimeEntry): Promise<void> {
    const index = this.data.timeEntries.findIndex(e => e.id === entry.id);
    if (index >= 0) {
      this.data.timeEntries[index] = entry;
    } else {
      this.data.timeEntries.push(entry);
    }
    this.saveData();
  }

  // Activity log operations
  async logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
    const newLog: ActivityLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    this.data.activityLogs.push(newLog);
    this.saveData();
  }

  async getActivityLogs(employeeId?: string, limit: number = 100): Promise<ActivityLog[]> {
    let logs = this.data.activityLogs;
    
    if (employeeId) {
      logs = logs.filter(l => l.employeeId === employeeId);
    }
    
    return logs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  // Statistics
  async getTodayTotalHours(employeeId: string): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const entries = this.data.timeEntries.filter(
      e => e.employeeId === employeeId && new Date(e.startTime) >= today
    );
    
    return entries.reduce((total, e) => total + (e.duration || 0), 0) / 3600;
  }

  async getWeekTotalHours(employeeId: string): Promise<number> {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const entries = this.data.timeEntries.filter(
      e => e.employeeId === employeeId && new Date(e.startTime) >= weekStart
    );
    
    return entries.reduce((total, e) => total + (e.duration || 0), 0) / 3600;
  }

  // Settings
  async getSetting(key: string): Promise<string | null> {
    return this.data.settings[key] ?? null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    this.data.settings[key] = value;
    this.saveData();
  }
}