const express = require('express');
const { protect } = require('../middleware/auth');

const createNotificationRoutes = (notificationController) => {
  const router = express.Router();

  router.use(protect);

  router.get('/notifications', notificationController.getNotifications);
  router.get('/notifications/unread-count', notificationController.getUnreadCount);
  router.get('/leaderboard', notificationController.getLeaderboard);
  router.get('/dashboard/stats', notificationController.getDashboardStats);

  return router;
};

module.exports = createNotificationRoutes;
