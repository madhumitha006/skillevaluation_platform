const logger = require('../config/logger');
const Assessment = require('../models/Assessment');
const Notification = require('../models/Notification');

class SocketHandlers {
  constructor(io) {
    this.io = io;
    this.setupHandlers();
  }

  setupHandlers() {
    this.io.on('connection', (socket) => {
      // Test progress tracking
      socket.on('test:join', (testId) => {
        socket.join(`test:${testId}`);
        logger.info(`User ${socket.userId} joined test room: ${testId}`);
      });

      socket.on('test:leave', (testId) => {
        socket.leave(`test:${testId}`);
        logger.info(`User ${socket.userId} left test room: ${testId}`);
      });

      socket.on('test:progress', async (data) => {
        try {
          const { testId, questionIndex, totalQuestions } = data;
          const progress = Math.round((questionIndex / totalQuestions) * 100);

          // Emit to recruiters
          this.io.to('role:recruiter').emit('test:progress:update', {
            userId: socket.userId,
            testId,
            progress,
            questionIndex,
            totalQuestions,
            timestamp: new Date(),
          });

          logger.info(`Test progress: ${socket.userId} - ${progress}%`);
        } catch (error) {
          logger.error(`Test progress error: ${error.message}`);
        }
      });

      // Leaderboard updates
      socket.on('leaderboard:join', () => {
        socket.join('leaderboard');
        logger.info(`User ${socket.userId} joined leaderboard room`);
      });

      socket.on('leaderboard:leave', () => {
        socket.leave('leaderboard');
      });

      // Notification handling
      socket.on('notification:read', async (notificationId) => {
        try {
          await Notification.findByIdAndUpdate(notificationId, { read: true });
          logger.info(`Notification marked as read: ${notificationId}`);
        } catch (error) {
          logger.error(`Notification read error: ${error.message}`);
        }
      });

      socket.on('notification:read:all', async () => {
        try {
          await Notification.updateMany(
            { userId: socket.userId, read: false },
            { read: true }
          );
          logger.info(`All notifications marked as read for user: ${socket.userId}`);
        } catch (error) {
          logger.error(`Mark all read error: ${error.message}`);
        }
      });

      // Recruiter dashboard
      socket.on('dashboard:join', () => {
        if (socket.userRole === 'recruiter' || socket.userRole === 'admin') {
          socket.join('dashboard');
          logger.info(`User ${socket.userId} joined dashboard room`);
        }
      });

      socket.on('dashboard:leave', () => {
        socket.leave('dashboard');
      });
    });
  }

  // Emit test started event
  emitTestStarted(userId, testData) {
    this.io.to(`user:${userId}`).emit('test:started', testData);
    this.io.to('role:recruiter').emit('test:started:recruiter', {
      userId,
      ...testData,
    });
    logger.info(`Test started event emitted for user: ${userId}`);
  }

  // Emit test completed event
  emitTestCompleted(userId, results) {
    this.io.to(`user:${userId}`).emit('test:completed', results);
    this.io.to('role:recruiter').emit('test:completed:recruiter', {
      userId,
      ...results,
    });
    this.io.to('dashboard').emit('dashboard:refresh', { type: 'test_completed', userId });
    logger.info(`Test completed event emitted for user: ${userId}`);
  }

  // Emit leaderboard update
  async emitLeaderboardUpdate(leaderboardData) {
    this.io.to('leaderboard').emit('leaderboard:update', leaderboardData);
    logger.info('Leaderboard update emitted');
  }

  // Emit notification
  async emitNotification(userId, notification) {
    this.io.to(`user:${userId}`).emit('notification:new', notification);
    logger.info(`Notification emitted to user: ${userId}`);
  }

  // Emit dashboard update
  emitDashboardUpdate(data) {
    this.io.to('dashboard').emit('dashboard:update', data);
    logger.info('Dashboard update emitted');
  }

  // Broadcast to role
  broadcastToRole(role, event, data) {
    this.io.to(`role:${role}`).emit(event, data);
    logger.info(`Broadcast to role ${role}: ${event}`);
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.io.sockets.sockets.size;
  }
}

module.exports = SocketHandlers;
