const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

class NotificationController {
  constructor(realtimeService) {
    this.realtimeService = realtimeService;
  }

  getNotifications = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const notifications = await this.realtimeService.getUserNotifications(req.user.id, limit);
      
      res.json(ApiResponse.success(notifications, 'Notifications retrieved'));
    } catch (error) {
      next(error);
    }
  };

  getUnreadCount = async (req, res, next) => {
    try {
      const count = await this.realtimeService.getUnreadCount(req.user.id);
      res.json(ApiResponse.success({ count }, 'Unread count retrieved'));
    } catch (error) {
      next(error);
    }
  };

  getLeaderboard = async (req, res, next) => {
    try {
      const leaderboard = await this.realtimeService.updateLeaderboard();
      res.json(ApiResponse.success(leaderboard, 'Leaderboard retrieved'));
    } catch (error) {
      next(error);
    }
  };

  getDashboardStats = async (req, res, next) => {
    try {
      const stats = await this.realtimeService.getDashboardStats();
      res.json(ApiResponse.success(stats, 'Dashboard stats retrieved'));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = NotificationController;
