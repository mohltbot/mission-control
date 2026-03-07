import Store from 'electron-store';

interface ConfigSchema {
  serverUrl: string;
  employeeId: string;
  authToken: string;
  idleThreshold: number;
  screenshotEnabled: boolean;
  screenshotInterval: number;
  screenshotsPath: string;
  theme: 'light' | 'dark' | 'system';
  minimizeToTray: boolean;
  startOnLogin: boolean;
  notificationsEnabled: boolean;
}

const defaults: ConfigSchema = {
  serverUrl: 'http://localhost:3001',
  employeeId: '',
  authToken: '',
  idleThreshold: 5 * 60 * 1000, // 5 minutes
  screenshotEnabled: false,
  screenshotInterval: 10 * 60 * 1000, // 10 minutes
  screenshotsPath: '',
  theme: 'system',
  minimizeToTray: true,
  startOnLogin: false,
  notificationsEnabled: true,
};

export class ConfigManager {
  private store: Store<ConfigSchema>;

  constructor() {
    this.store = new Store<ConfigSchema>({
      defaults,
      name: 'archtrack-config',
    });
  }

  get(key: string, defaultValue?: any): any {
    const value = this.store.get(key as keyof ConfigSchema);
    return value !== undefined ? value : defaultValue;
  }

  set(key: string, value: any): void {
    this.store.set(key as keyof ConfigSchema, value);
  }

  getAll(): ConfigSchema {
    return this.store.store;
  }

  reset(): void {
    this.store.clear();
    this.store.set(defaults);
  }

  has(key: keyof ConfigSchema): boolean {
    return this.store.has(key);
  }
}
