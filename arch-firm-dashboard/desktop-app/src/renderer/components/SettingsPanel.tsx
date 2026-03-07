import React, { useState, useEffect } from 'react';
import { Settings, Bell, Monitor, Shield, Save, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { useToast } from './ui/toaster';

interface AppSettings {
  serverUrl: string;
  idleThreshold: number;
  screenshotEnabled: boolean;
  screenshotInterval: number;
  theme: 'light' | 'dark' | 'system';
  minimizeToTray: boolean;
  startOnLogin: boolean;
  notificationsEnabled: boolean;
}

export function SettingsPanel() {
  const [settings, setSettings] = useState<AppSettings>({
    serverUrl: 'http://localhost:3000',
    idleThreshold: 5,
    screenshotEnabled: false,
    screenshotInterval: 10,
    theme: 'system',
    minimizeToTray: true,
    startOnLogin: false,
    notificationsEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const serverUrl = await window.electronAPI.getConfig('serverUrl');
      const idleThreshold = await window.electronAPI.getConfig('idleThreshold');
      const screenshotEnabled = await window.electronAPI.getConfig('screenshotEnabled');
      const screenshotInterval = await window.electronAPI.getConfig('screenshotInterval');
      const theme = await window.electronAPI.getConfig('theme');
      const minimizeToTray = await window.electronAPI.getConfig('minimizeToTray');
      const startOnLogin = await window.electronAPI.getConfig('startOnLogin');
      const notificationsEnabled = await window.electronAPI.getConfig('notificationsEnabled');

      setSettings({
        serverUrl: serverUrl || 'http://localhost:3000',
        idleThreshold: idleThreshold ? idleThreshold / 60000 : 5,
        screenshotEnabled: screenshotEnabled || false,
        screenshotInterval: screenshotInterval ? screenshotInterval / 60000 : 10,
        theme: theme || 'system',
        minimizeToTray: minimizeToTray !== false,
        startOnLogin: startOnLogin || false,
        notificationsEnabled: notificationsEnabled !== false,
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      await window.electronAPI.setConfig('serverUrl', settings.serverUrl);
      await window.electronAPI.setConfig('idleThreshold', settings.idleThreshold * 60000);
      await window.electronAPI.setConfig('screenshotEnabled', settings.screenshotEnabled);
      await window.electronAPI.setConfig('screenshotInterval', settings.screenshotInterval * 60000);
      await window.electronAPI.setConfig('theme', settings.theme);
      await window.electronAPI.setConfig('minimizeToTray', settings.minimizeToTray);
      await window.electronAPI.setConfig('startOnLogin', settings.startOnLogin);
      await window.electronAPI.setConfig('notificationsEnabled', settings.notificationsEnabled);

      // Apply idle threshold immediately
      await window.electronAPI.setIdleThreshold(settings.idleThreshold * 60000);

      addToast({
        title: 'Settings Saved',
        description: 'Your preferences have been updated successfully.',
      });
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to save settings',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure your ArchTrack preferences
          </p>
        </div>

        {/* Server Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Server Configuration
            </CardTitle>
            <CardDescription>
              Connect to your company's ArchTrack server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Server URL
              </label>
              <input
                type="url"
                value={settings.serverUrl}
                onChange={(e) => updateSetting('serverUrl', e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                placeholder="http://localhost:3000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                The URL of your ArchTrack admin dashboard server
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Idle Detection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Idle Detection
            </CardTitle>
            <CardDescription>
              Configure when you're considered idle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Idle Threshold (minutes)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={settings.idleThreshold}
                onChange={(e) => updateSetting('idleThreshold', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1 min</span>
                <span className="font-medium text-foreground">
                  {settings.idleThreshold} minutes
                </span>
                <span>30 min</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Time of inactivity before you're marked as idle
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Screenshots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="w-5 h-5" />
              Screenshots
            </CardTitle>
            <CardDescription>
              Automatic screenshot capture for accountability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Enable Screenshots</label>
                <p className="text-xs text-muted-foreground">
                  Capture periodic screenshots during work
                </p>
              </div>
              <button
                onClick={() => updateSetting('screenshotEnabled', !settings.screenshotEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.screenshotEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.screenshotEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {settings.screenshotEnabled && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Screenshot Interval (minutes)
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={settings.screenshotInterval}
                  onChange={(e) => updateSetting('screenshotInterval', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5 min</span>
                  <span className="font-medium text-foreground">
                    {settings.screenshotInterval} minutes
                  </span>
                  <span>60 min</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Application
            </CardTitle>
            <CardDescription>
              General application preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Minimize to Tray</label>
                <p className="text-xs text-muted-foreground">
                  Keep running in system tray when closed
                </p>
              </div>
              <button
                onClick={() => updateSetting('minimizeToTray', !settings.minimizeToTray)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.minimizeToTray ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.minimizeToTray ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Start on Login</label>
                <p className="text-xs text-muted-foreground">
                  Automatically start ArchTrack when you log in
                </p>
              </div>
              <button
                onClick={() => updateSetting('startOnLogin', !settings.startOnLogin)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.startOnLogin ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.startOnLogin ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium">Notifications</label>
                <p className="text-xs text-muted-foreground">
                  Show desktop notifications
                </p>
              </div>
              <button
                onClick={() => updateSetting('notificationsEnabled', !settings.notificationsEnabled)}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  settings.notificationsEnabled ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                    settings.notificationsEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <select
                value={settings.theme}
                onChange={(e) => updateSetting('theme', e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={saveSettings}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
