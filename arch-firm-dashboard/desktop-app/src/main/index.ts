import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, powerMonitor, screen } from 'electron';
import * as path from 'path';
import { DatabaseManager } from './database';
import { IdleDetector } from './idle-detector';
import { ScreenshotManager } from './screenshot-manager';
import { SocketClient } from './socket-client';
import { ConfigManager } from './config';
import { TimeTracker } from './time-tracker';

class ArchTrackApp {
  private mainWindow: BrowserWindow | null = null;
  private tray: Tray | null = null;
  private db: DatabaseManager;
  private idleDetector: IdleDetector;
  private screenshotManager: ScreenshotManager;
  private socketClient: SocketClient;
  private config: ConfigManager;
  private timeTracker: TimeTracker;
  private isQuitting = false;

  constructor() {
    this.config = new ConfigManager();
    this.db = new DatabaseManager();
    this.socketClient = new SocketClient(this.config.get('serverUrl'));
    this.timeTracker = new TimeTracker(this.db, this.socketClient);
    this.idleDetector = new IdleDetector(this.config.get('idleThreshold', 300000));
    this.screenshotManager = new ScreenshotManager(
      this.config.get('screenshotInterval', 0),
      this.config.get('screenshotsPath')
    );
  }

  async initialize(): Promise<void> {
    await app.whenReady();
    
    this.createMainWindow();
    this.createTray();
    this.setupIpcHandlers();
    this.setupPowerMonitor();
    this.setupIdleDetection();
    this.setupScreenshotCapture();
    this.connectToServer();

    app.on('window-all-closed', this.onWindowAllClosed.bind(this));
    app.on('activate', this.onActivate.bind(this));
    app.on('before-quit', () => { this.isQuitting = true; });
  }

  private createMainWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      minWidth: 900,
      minHeight: 600,
      title: 'ArchTrack - Employee Tracker',
      icon: this.getIconPath(),
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
      show: false,
      titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    });

    // Load the renderer
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.loadURL('http://localhost:5173');
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
    }

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on('close', (event) => {
      if (!this.isQuitting) {
        event.preventDefault();
        this.mainWindow?.hide();
      }
    });
  }

  private createTray(): void {
    const iconPath = this.getIconPath();
    this.tray = new Tray(iconPath);
    
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show ArchTrack',
        click: () => this.mainWindow?.show(),
      },
      {
        label: 'Start Timer',
        click: () => this.timeTracker.startTimer(),
        enabled: !this.timeTracker.isRunning(),
      },
      {
        label: 'Stop Timer',
        click: () => this.timeTracker.stopTimer(),
        enabled: this.timeTracker.isRunning(),
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => {
          this.mainWindow?.show();
          this.mainWindow?.webContents.send('navigate', '/settings');
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          this.isQuitting = true;
          app.quit();
        },
      },
    ]);

    this.tray.setToolTip('ArchTrack - Employee Tracker');
    this.tray.setContextMenu(contextMenu);
    this.tray.on('click', () => {
      this.mainWindow?.show();
    });

    // Update tray menu periodically
    setInterval(() => {
      this.updateTrayMenu();
    }, 1000);
  }

  private updateTrayMenu(): void {
    if (!this.tray) return;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Show ArchTrack',
        click: () => this.mainWindow?.show(),
      },
      {
        label: this.timeTracker.isRunning() ? `Stop Timer (${this.timeTracker.getCurrentDuration()})` : 'Start Timer',
        click: () => {
          if (this.timeTracker.isRunning()) {
            this.timeTracker.stopTimer();
          } else {
            this.timeTracker.startTimer();
          }
        },
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => {
          this.mainWindow?.show();
          this.mainWindow?.webContents.send('navigate', '/settings');
        },
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          this.isQuitting = true;
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  private getIconPath(): string {
    const iconName = process.platform === 'win32' ? 'icon.ico' : 
                     process.platform === 'darwin' ? 'icon.icns' : 'icon.png';
    return path.join(__dirname, '../../assets', iconName);
  }

  private setupIpcHandlers(): void {
    // Database operations
    ipcMain.handle('db:getTasks', async () => {
      return this.db.getTasks();
    });

    ipcMain.handle('db:getProjects', async () => {
      return this.db.getProjects();
    });

    ipcMain.handle('db:updateTask', async (_, taskId: string, updates: any) => {
      return this.db.updateTask(taskId, updates);
    });

    // Time tracking
    ipcMain.handle('time:start', async (_, taskId: string, projectId: string) => {
      return this.timeTracker.startTimer(taskId, projectId);
    });

    ipcMain.handle('time:stop', async (_, notes?: string) => {
      return this.timeTracker.stopTimer(notes);
    });

    ipcMain.handle('time:status', async () => {
      return {
        isRunning: this.timeTracker.isRunning(),
        currentEntry: this.timeTracker.getCurrentEntry(),
        duration: this.timeTracker.getCurrentDuration(),
      };
    });

    ipcMain.handle('time:getTodayTotal', async () => {
      return this.timeTracker.getTodayTotal();
    });

    // Idle detection
    ipcMain.handle('idle:getStatus', async () => {
      return {
        isIdle: this.idleDetector.isIdle(),
        idleTime: this.idleDetector.getIdleTime(),
        threshold: this.idleDetector.getThreshold(),
      };
    });

    ipcMain.handle('idle:setThreshold', async (_, threshold: number) => {
      this.idleDetector.setThreshold(threshold);
      this.config.set('idleThreshold', threshold);
    });

    // Screenshots
    ipcMain.handle('screenshot:capture', async () => {
      return this.screenshotManager.capture();
    });

    ipcMain.handle('screenshot:setEnabled', async (_, enabled: boolean) => {
      this.config.set('screenshotEnabled', enabled);
      if (enabled) {
        this.screenshotManager.start();
      } else {
        this.screenshotManager.stop();
      }
    });

    // Config
    ipcMain.handle('config:get', async (_, key: string) => {
      return this.config.get(key);
    });

    ipcMain.handle('config:set', async (_, key: string, value: any) => {
      this.config.set(key, value);
    });

    // Window control
    ipcMain.handle('window:minimize', () => {
      this.mainWindow?.minimize();
    });

    ipcMain.handle('window:hide', () => {
      this.mainWindow?.hide();
    });

    // System info
    ipcMain.handle('system:getInfo', async () => {
      return {
        platform: process.platform,
        arch: process.arch,
        version: app.getVersion(),
        screens: screen.getAllDisplays().map(d => ({
          id: d.id,
          bounds: d.bounds,
          workArea: d.workArea,
          scaleFactor: d.scaleFactor,
        })),
      };
    });
  }

  private setupPowerMonitor(): void {
    powerMonitor.on('suspend', () => {
      console.log('System suspended');
      if (this.timeTracker.isRunning()) {
        this.timeTracker.pauseTimer('system_suspend');
      }
      this.socketClient.emitToServer('activity:log', {
        employeeId: this.config.get('employeeId'),
        type: 'app_closed',
        details: { reason: 'system_suspend' },
      });
    });

    powerMonitor.on('resume', () => {
      console.log('System resumed');
      this.socketClient.emitToServer('activity:log', {
        employeeId: this.config.get('employeeId'),
        type: 'app_opened',
        details: { reason: 'system_resume' },
      });
    });

    powerMonitor.on('lock-screen', () => {
      console.log('Screen locked');
      if (this.timeTracker.isRunning()) {
        this.timeTracker.pauseTimer('screen_locked');
      }
    });

    powerMonitor.on('unlock-screen', () => {
      console.log('Screen unlocked');
      if (this.timeTracker.isPaused()) {
        this.timeTracker.resumeTimer();
      }
    });
  }

  private setupIdleDetection(): void {
    this.idleDetector.on('idle', (idleTime: number) => {
      console.log(`User idle for ${idleTime}ms`);
      this.mainWindow?.webContents.send('idle:started', idleTime);
      
      if (this.timeTracker.isRunning()) {
        this.timeTracker.addIdleTime(idleTime);
      }

      this.socketClient.emitToServer('idle:detected', { duration: idleTime });
      this.socketClient.emitToServer('activity:log', {
        employeeId: this.config.get('employeeId'),
        type: 'idle_detected',
        details: { duration: idleTime },
      });
    });

    this.idleDetector.on('active', (idleDuration: number) => {
      console.log(`User returned after ${idleDuration}ms idle`);
      this.mainWindow?.webContents.send('idle:ended', idleDuration);
      
      this.socketClient.emitToServer('idle:returned', { idleDuration });
    });

    this.idleDetector.start();
  }

  private setupScreenshotCapture(): void {
    if (this.config.get('screenshotEnabled', false)) {
      this.screenshotManager.start();
    }

    this.screenshotManager.on('captured', (screenshot: any) => {
      this.socketClient.emitToServer('activity:log', {
        employeeId: this.config.get('employeeId'),
        type: 'screenshot_captured',
        details: screenshot,
      });
    });
  }

  private connectToServer(): void {
    const employeeId = this.config.get('employeeId');
    const token = this.config.get('authToken');

    if (employeeId && token) {
      this.socketClient.connect(employeeId, token);
    }

    this.socketClient.on('connect', () => {
      console.log('Connected to server');
      this.mainWindow?.webContents.send('server:connected');
    });

    this.socketClient.on('disconnect', () => {
      console.log('Disconnected from server');
      this.mainWindow?.webContents.send('server:disconnected');
    });

    this.socketClient.on('task:assigned', (task: any) => {
      this.mainWindow?.webContents.send('task:assigned', task);
    });
  }

  private onWindowAllClosed(): void {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  private onActivate(): void {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createMainWindow();
    } else {
      this.mainWindow?.show();
    }
  }
}

// Initialize the app
const archTrackApp = new ArchTrackApp();
archTrackApp.initialize().catch(console.error);
