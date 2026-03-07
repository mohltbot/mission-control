import { EventEmitter } from 'events';
import { DatabaseManager } from './database';
import { SocketClient } from './socket-client';
import { TimeEntry, Task } from '../shared-types';
import { v4 as uuidv4 } from 'uuid';

export class TimeTracker extends EventEmitter {
  private db: DatabaseManager;
  private socketClient: SocketClient;
  private currentEntry: TimeEntry | null = null;
  private isPausedState: boolean = false;
  private pauseStartTime: number = 0;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor(db: DatabaseManager, socketClient: SocketClient) {
    super();
    this.db = db;
    this.socketClient = socketClient;
  }

  async startTimer(taskId?: string, projectId?: string): Promise<TimeEntry> {
    if (this.currentEntry) {
      throw new Error('Timer is already running');
    }

    const entry: TimeEntry = {
      id: uuidv4(),
      employeeId: this.getEmployeeId(),
      taskId: taskId ?? '',
      projectId: projectId ?? '',
      startTime: new Date(),
      duration: 0,
      isRunning: true,
      idleTime: 0,
    };

    this.currentEntry = entry;
    await this.db.saveTimeEntry(entry);

    // Start duration update interval
    this.updateInterval = setInterval(() => {
      this.updateDuration();
    }, 1000);

    // Notify server
    this.socketClient.emitToServer('time:start', { taskId: taskId ?? '', projectId: projectId ?? '' });
    this.socketClient.emitToServer('activity:log', {
      employeeId: this.getEmployeeId(),
      type: 'timer_started',
      details: { taskId, projectId, entryId: entry.id },
    });

    this.emit('started', entry);
    return entry;
  }

  async stopTimer(notes?: string): Promise<TimeEntry | null> {
    if (!this.currentEntry) {
      return null;
    }

    // Stop update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - this.currentEntry.startTime.getTime()) / 1000);

    this.currentEntry.endTime = endTime;
    this.currentEntry.duration = duration;
    this.currentEntry.isRunning = false;
    this.currentEntry.notes = notes;

    await this.db.saveTimeEntry(this.currentEntry);

    // Update task actual hours if taskId exists
    if (this.currentEntry.taskId) {
      const task = await this.db.getTask(this.currentEntry.taskId);
      if (task) {
        task.actualHours += duration / 3600;
        await this.db.saveTask(task);
      }
    }

    // Notify server
    this.socketClient.emitToServer('time:stop', { 
      entryId: this.currentEntry.id, 
      notes 
    });
    this.socketClient.emitToServer('activity:log', {
      employeeId: this.getEmployeeId(),
      type: 'timer_stopped',
      details: { 
        entryId: this.currentEntry.id, 
        duration: this.currentEntry.duration,
        notes 
      },
    });

    const entry = this.currentEntry;
    this.currentEntry = null;
    this.isPausedState = false;

    this.emit('stopped', entry);
    return entry;
  }

  pauseTimer(reason?: string): void {
    if (!this.currentEntry || this.isPausedState) return;

    this.isPausedState = true;
    this.pauseStartTime = Date.now();

    // Stop duration updates
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.socketClient.emitToServer('activity:log', {
      employeeId: this.getEmployeeId(),
      type: 'timer_paused',
      details: { reason, entryId: this.currentEntry.id },
    });

    this.emit('paused', reason);
  }

  resumeTimer(): void {
    if (!this.currentEntry || !this.isPausedState) return;

    const pauseDuration = Date.now() - this.pauseStartTime;
    this.isPausedState = false;
    this.pauseStartTime = 0;

    // Resume duration updates
    this.updateInterval = setInterval(() => {
      this.updateDuration();
    }, 1000);

    this.socketClient.emitToServer('activity:log', {
      employeeId: this.getEmployeeId(),
      type: 'timer_resumed',
      details: { entryId: this.currentEntry.id, pauseDuration },
    });

    this.emit('resumed');
  }

  async addIdleTime(idleTimeMs: number): Promise<void> {
    if (!this.currentEntry) return;

    this.currentEntry.idleTime += Math.floor(idleTimeMs / 1000);
    await this.db.saveTimeEntry(this.currentEntry);
  }

  private updateDuration(): void {
    if (!this.currentEntry) return;

    const now = new Date();
    this.currentEntry.duration = Math.floor((now.getTime() - this.currentEntry.startTime.getTime()) / 1000);
    
    // Emit update for UI
    this.emit('tick', this.currentEntry.duration);
  }

  isRunning(): boolean {
    return this.currentEntry !== null && !this.isPausedState;
  }

  isPaused(): boolean {
    return this.isPausedState;
  }

  getCurrentEntry(): TimeEntry | null {
    return this.currentEntry;
  }

  getCurrentDuration(): string {
    if (!this.currentEntry) return '00:00:00';

    const totalSeconds = this.currentEntry.duration;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  async getTodayTotal(): Promise<number> {
    return this.db.getTodayTotalHours(this.getEmployeeId());
  }

  async getWeekTotal(): Promise<number> {
    return this.db.getWeekTotalHours(this.getEmployeeId());
  }

  private getEmployeeId(): string {
    // This would typically come from config
    return 'current-employee-id';
  }
}