import { EventEmitter } from 'events';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '../shared-types';

export class SocketClient extends EventEmitter {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;
  private serverUrl: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectDelay: number = 5000;

  constructor(serverUrl: string) {
    super();
    this.serverUrl = serverUrl;
  }

  connect(employeeId: string, token: string): void {
    if (this.socket?.connected) {
      console.log('Already connected to server');
      return;
    }

    this.socket = io(this.serverUrl, {
      auth: { token },
      query: { employeeId },
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
    });

    this.setupEventHandlers();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.reconnectAttempts = 0;
      this.emit('connect');
    });

    this.socket.on('disconnect', (reason) => {
      console.log(`Disconnected from server: ${reason}`);
      this.emit('disconnect', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.emit('max_reconnect_attempts');
      }
    });

    // Server-to-client events
    this.socket.on('employee:status', (data) => {
      this.emit('employee:status', data);
    });

    this.socket.on('task:updated', (task) => {
      this.emit('task:updated', task);
    });

    this.socket.on('project:updated', (project) => {
      this.emit('project:updated', project);
    });

    this.socket.on('notification', (notification) => {
      this.emit('notification', notification);
    });
  }

  // Emit to server via socket.io
  emitToServer<K extends keyof ClientToServerEvents>(
    event: K,
    ...args: Parameters<ClientToServerEvents[K]>
  ): boolean {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot emit:', event);
      return false;
    }

    this.socket.emit(event, ...args);
    return true;
  }

  // Override EventEmitter emit for local events
  emit(event: string | symbol, ...args: any[]): boolean {
    return super.emit(event, ...args);
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}