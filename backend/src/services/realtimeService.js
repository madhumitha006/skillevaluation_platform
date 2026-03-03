const Notification = require('../models/Notification');
const Assessment = require('../models/Assessment');
const User = require('../models/User');
const logger = require('../config/logger');

class RealtimeService {
  constructor(socketHandlers) {
    this.socketHandlers = socketHandlers;
  }

  // Create and emit notification
  async createNotification(userId, type, title, message, data = {}, priority = 'medium') {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        message,
        data,
        priority,
      });

      await this.socketHandlers.emitNotification(userId, notification);
      return notification;
    } catch (error) {
      logger.error(`Create notification error: ${error.message}`);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(userId, limit = 50) {
    try {
      return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
    } catch (error) {
      logger.error(`Get notifications error: ${error.message}`);
      throw error;
    }
  }

  // Get unread count
  async getUnreadCount(userId) {
    try {
      return await Notification.countDocuments({ userId, read: false });
    } catch (error) {
      logger.error(`Get unread count error: ${error.message}`);
      throw error;
    }
  }

  // Handle test started
  async handleTestStarted(userId, testData) {
    try {
      await this.createNotification(
        userId,
        'test_started',
        'Test Started',
        `You have started the ${testData.skills?.join(', ')} assessment`,
        testData,
        'medium'
      );

      this.socketHandlers.emitTestStarted(userId, testData);
    } catch (error) {
      logger.error(`Handle test started error: ${error.message}`);
    }
  }

  // Handle test completed
  async handleTestCompleted(userId, results) {
    try {
      await this.createNotification(
        userId,
        'test_completed',
        'Test Completed',
        `Your test has been completed with ${results.evaluation?.percentage}% score`,
        results,
        'high'
      );

      this.socketHandlers.emitTestCompleted(userId, results);
      await this.updateLeaderboard();
    } catch (error) {
      logger.error(`Handle test completed error: ${error.message}`);
    }
  }

  // Update and broadcast leaderboard
  async updateLeaderboard() {
    try {
      const leaderboard = await Assessment.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: '$userId',
            totalTests: { $sum: 1 },
            avgScore: { $avg: '$evaluation.percentage' },
            maxScore: { $max: '$evaluation.percentage' },
            lastTestDate: { $max: '$completedAt' },
          },
        },
        { $sort: { avgScore: -1 } },
        { $limit: 100 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: '$user' },
        {
          $project: {
            userId: '$_id',
            name: '$user.name',
            email: '$user.email',
            totalTests: 1,
            avgScore: { $round: ['$avgScore', 2] },
            maxScore: { $round: ['$maxScore', 2] },
            lastTestDate: 1,
          },
        },
      ]);

      await this.socketHandlers.emitLeaderboardUpdate(leaderboard);
      return leaderboard;
    } catch (error) {
      logger.error(`Update leaderboard error: ${error.message}`);
      throw error;
    }
  }

  // Get dashboard stats for recruiters
  async getDashboardStats() {
    try {
      const [totalUsers, activeTests, completedTests, avgScore] = await Promise.all([
        User.countDocuments({ role: 'student', isActive: true }),
        Assessment.countDocuments({ status: 'in-progress' }),
        Assessment.countDocuments({ status: 'completed' }),
        Assessment.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, avg: { $avg: '$evaluation.percentage' } } },
        ]),
      ]);

      return {
        totalUsers,
        activeTests,
        completedTests,
        avgScore: avgScore[0]?.avg ? Math.round(avgScore[0].avg * 100) / 100 : 0,
      };
    } catch (error) {
      logger.error(`Get dashboard stats error: ${error.message}`);
      throw error;
    }
  }

  // Notify recruiters of new test activity
  async notifyRecruiters(type, data) {
    try {
      const recruiters = await User.find({ role: 'recruiter', isActive: true });
      
      for (const recruiter of recruiters) {
        await this.createNotification(
          recruiter._id,
          'recruiter_alert',
          `New ${type}`,
          `A student has ${type}`,
          data,
          'medium'
        );
      }
    } catch (error) {
      logger.error(`Notify recruiters error: ${error.message}`);
    }
  }
}

module.exports = RealtimeService;
