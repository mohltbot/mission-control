import { EventEmitter } from 'events';
import { powerMonitor } from 'electron';

export class IdleDetector extends EventEmitter {
  private threshold: number;
  private checkInterval: number;
  private isCurrentlyIdle: boolean = false;
  private idleStartTime: number = 0;
  private intervalId: NodeJS.Timeout | null = null;

  constructor(threshold: number = 5 * 60 * 1000, checkInterval: number = 1000) {
    super();
    this.threshold = threshold;
    this.checkInterval = checkInterval;
  }

  start(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.checkIdleState();
    }, this.checkInterval);

    console.log(`Idle detector started with threshold: ${this.threshold}ms`);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private checkIdleState(): void {
    try {
      const idleTime = powerMonitor.getSystemIdleTime() * 1000; // Convert to ms

      if (!this.isCurrentlyIdle && idleTime >= this.threshold) {
        // User just became idle
        this.isCurrentlyIdle = true;
        this.idleStartTime = Date.now();
        this.emit('idle', idleTime);
      } else if (this.isCurrentlyIdle && idleTime < this.checkInterval) {
        // User just became active
        const idleDuration = Date.now() - this.idleStartTime;
        this.isCurrentlyIdle = false;
        this.idleStartTime = 0;
        this.emit('active', idleDuration);
      }
    } catch (error) {
      console.error('Error checking idle state:', error);
    }
  }

  isIdle(): boolean {
    return this.isCurrentlyIdle;
  }

  getIdleTime(): number {
    if (!this.isCurrentlyIdle) return 0;
    return Date.now() - this.idleStartTime;
  }

  getThreshold(): number {
    return this.threshold;
  }

  setThreshold(threshold: number): void {
    this.threshold = threshold;
    console.log(`Idle threshold updated to: ${threshold}ms`);
  }
}
