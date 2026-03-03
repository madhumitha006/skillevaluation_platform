import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      console.log('✅ WebSocket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error.message);
    });

    this.setupEventListeners();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('WebSocket disconnected');
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Re-attach all registered listeners
    this.listeners.forEach((callbacks, event) => {
      callbacks.forEach((callback) => {
        this.socket?.on(event, callback as any);
      });
    });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      this.listeners.get(event)?.delete(callback);
      if (this.socket) {
        this.socket.off(event, callback as any);
      }
    } else {
      this.listeners.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected. Cannot emit:', event);
    }
  }

  // Test-specific methods
  joinTest(testId: string) {
    this.emit('test:join', testId);
  }

  leaveTest(testId: string) {
    this.emit('test:leave', testId);
  }

  sendTestProgress(testId: string, questionIndex: number, totalQuestions: number) {
    this.emit('test:progress', { testId, questionIndex, totalQuestions });
  }

  // Leaderboard methods
  joinLeaderboard() {
    this.emit('leaderboard:join');
  }

  leaveLeaderboard() {
    this.emit('leaderboard:leave');
  }

  // Dashboard methods
  joinDashboard() {
    this.emit('dashboard:join');
  }

  leaveDashboard() {
    this.emit('dashboard:leave');
  }

  // Notification methods
  markNotificationRead(notificationId: string) {
    this.emit('notification:read', notificationId);
  }

  markAllNotificationsRead() {
    this.emit('notification:read:all');
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
