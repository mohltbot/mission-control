import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database
  getTasks: () => ipcRenderer.invoke('db:getTasks'),
  getProjects: () => ipcRenderer.invoke('db:getProjects'),
  updateTask: (taskId: string, updates: any) => ipcRenderer.invoke('db:updateTask', taskId, updates),

  // Time tracking
  startTimer: (taskId: string, projectId: string) => ipcRenderer.invoke('time:start', taskId, projectId),
  stopTimer: (notes?: string) => ipcRenderer.invoke('time:stop', notes),
  getTimeStatus: () => ipcRenderer.invoke('time:status'),
  getTodayTotal: () => ipcRenderer.invoke('time:getTodayTotal'),

  // Idle detection
  getIdleStatus: () => ipcRenderer.invoke('idle:getStatus'),
  setIdleThreshold: (threshold: number) => ipcRenderer.invoke('idle:setThreshold', threshold),

  // Screenshots
  captureScreenshot: () => ipcRenderer.invoke('screenshot:capture'),
  setScreenshotEnabled: (enabled: boolean) => ipcRenderer.invoke('screenshot:setEnabled', enabled),

  // Config
  getConfig: (key: string) => ipcRenderer.invoke('config:get', key),
  setConfig: (key: string, value: any) => ipcRenderer.invoke('config:set', key, value),

  // Window control
  minimizeWindow: () => ipcRenderer.invoke('window:minimize'),
  hideWindow: () => ipcRenderer.invoke('window:hide'),

  // System info
  getSystemInfo: () => ipcRenderer.invoke('system:getInfo'),

  // Event listeners
  onIdleStarted: (callback: (idleTime: number) => void) => {
    ipcRenderer.on('idle:started', (_, idleTime) => callback(idleTime));
  },
  onIdleEnded: (callback: (idleDuration: number) => void) => {
    ipcRenderer.on('idle:ended', (_, idleDuration) => callback(idleDuration));
  },
  onServerConnected: (callback: () => void) => {
    ipcRenderer.on('server:connected', callback);
  },
  onServerDisconnected: (callback: () => void) => {
    ipcRenderer.on('server:disconnected', callback);
  },
  onTaskAssigned: (callback: (task: any) => void) => {
    ipcRenderer.on('task:assigned', (_, task) => callback(task));
  },
  onNavigate: (callback: (path: string) => void) => {
    ipcRenderer.on('navigate', (_, path) => callback(path));
  },

  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getTasks: () => Promise<any[]>;
      getProjects: () => Promise<any[]>;
      updateTask: (taskId: string, updates: any) => Promise<any>;
      startTimer: (taskId: string, projectId: string) => Promise<any>;
      stopTimer: (notes?: string) => Promise<any>;
      getTimeStatus: () => Promise<any>;
      getTodayTotal: () => Promise<number>;
      getIdleStatus: () => Promise<any>;
      setIdleThreshold: (threshold: number) => Promise<void>;
      captureScreenshot: () => Promise<any>;
      setScreenshotEnabled: (enabled: boolean) => Promise<void>;
      getConfig: (key: string) => Promise<any>;
      setConfig: (key: string, value: any) => Promise<void>;
      minimizeWindow: () => Promise<void>;
      hideWindow: () => Promise<void>;
      getSystemInfo: () => Promise<any>;
      onIdleStarted: (callback: (idleTime: number) => void) => void;
      onIdleEnded: (callback: (idleDuration: number) => void) => void;
      onServerConnected: (callback: () => void) => void;
      onServerDisconnected: (callback: () => void) => void;
      onTaskAssigned: (callback: (task: any) => void) => void;
      onNavigate: (callback: (path: string) => void) => void;
      removeAllListeners: (channel: string) => void;
    };
  }
}
