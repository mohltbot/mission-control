import { EventEmitter } from 'events';
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

// Note: screenshot-desktop is an optional dependency
// If not available, screenshots will be disabled
let screenshot: any = null;
try {
  screenshot = require('screenshot-desktop');
} catch (e) {
  console.warn('screenshot-desktop not available, screenshot feature disabled');
}

export class ScreenshotManager extends EventEmitter {
  private interval: number;
  private screenshotsPath: string;
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;

  constructor(interval: number = 0, customPath?: string) {
    super();
    this.interval = interval;
    this.screenshotsPath = customPath || path.join(app.getPath('pictures'), 'ArchTrack', 'Screenshots');
    
    // Ensure screenshots directory exists
    if (!fs.existsSync(this.screenshotsPath)) {
      fs.mkdirSync(this.screenshotsPath, { recursive: true });
    }
  }

  start(): void {
    if (this.isRunning || this.interval <= 0 || !screenshot) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      this.capture();
    }, this.interval);

    console.log(`Screenshot capture started with interval: ${this.interval}ms`);
  }

  stop(): void {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log('Screenshot capture stopped');
  }

  async capture(): Promise<{ path: string; thumbnailPath: string; timestamp: Date } | null> {
    if (!screenshot) {
      console.warn('Screenshot capture not available');
      return null;
    }

    try {
      const timestamp = new Date();
      const filename = `screenshot_${timestamp.getTime()}.png`;
      const filepath = path.join(this.screenshotsPath, filename);
      const thumbnailPath = path.join(this.screenshotsPath, `thumb_${filename}`);

      // Capture screenshot
      await screenshot({ filename: filepath });

      // Create thumbnail (simplified - in production, use sharp or similar)
      // For now, just copy as thumbnail
      fs.copyFileSync(filepath, thumbnailPath);

      const result = {
        path: filepath,
        thumbnailPath,
        timestamp,
      };

      this.emit('captured', result);
      return result;
    } catch (error) {
      console.error('Failed to capture screenshot:', error);
      return null;
    }
  }

  setInterval(interval: number): void {
    this.interval = interval;
    
    if (this.isRunning) {
      this.stop();
      this.start();
    }
  }

  getScreenshotsPath(): string {
    return this.screenshotsPath;
  }

  isCapturing(): boolean {
    return this.isRunning;
  }
}
