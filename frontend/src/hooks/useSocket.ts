import { useEffect, useCallback } from 'react';
import socketService from '../services/socketService';
import { useAuthStore } from '../context/AuthStore';

export const useSocket = () => {
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token);
    }

    return () => {
      if (!isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  const on = useCallback((event: string, callback: Function) => {
    socketService.on(event, callback);
  }, []);

  const off = useCallback((event: string, callback?: Function) => {
    socketService.off(event, callback);
  }, []);

  const emit = useCallback((event: string, data?: any) => {
    socketService.emit(event, data);
  }, []);

  return {
    socket: socketService,
    on,
    off,
    emit,
    isConnected: socketService.isConnected(),
  };
};

export const useTestSocket = (testId?: string) => {
  const { socket, on, off } = useSocket();

  useEffect(() => {
    if (testId) {
      socket.joinTest(testId);
      return () => socket.leaveTest(testId);
    }
  }, [testId, socket]);

  const sendProgress = useCallback(
    (questionIndex: number, totalQuestions: number) => {
      if (testId) {
        socket.sendTestProgress(testId, questionIndex, totalQuestions);
      }
    },
    [testId, socket]
  );

  return { on, off, sendProgress };
};

export const useLeaderboard = () => {
  const { socket, on, off } = useSocket();

  useEffect(() => {
    socket.joinLeaderboard();
    return () => socket.leaveLeaderboard();
  }, [socket]);

  return { on, off };
};

export const useDashboard = () => {
  const { socket, on, off } = useSocket();

  useEffect(() => {
    socket.joinDashboard();
    return () => socket.leaveDashboard();
  }, [socket]);

  return { on, off };
};

export const useNotifications = () => {
  const { socket, on, off } = useSocket();

  const markAsRead = useCallback(
    (notificationId: string) => {
      socket.markNotificationRead(notificationId);
    },
    [socket]
  );

  const markAllAsRead = useCallback(() => {
    socket.markAllNotificationsRead();
  }, [socket]);

  return { on, off, markAsRead, markAllAsRead };
};
