const express = require('express');
const { query } = require('express-validator');
const analyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { roleAuth } = require('../middleware/roleAuth');

const router = express.Router();

// Validation rules
const periodValidation = [
  query('period')
    .optional()
    .isIn(['daily', 'weekly', 'monthly'])
    .withMessage('Invalid period. Must be daily, weekly, or monthly'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  
  query('months')
    .optional()
    .isInt({ min: 1, max: 24 })
    .withMessage('Months must be between 1 and 24')
];

// Apply authentication and admin authorization to all routes
router.use(protect);
router.use(roleAuth(['admin', 'super_admin']));

// Analytics routes
router.get('/dashboard', periodValidation, analyticsController.getDashboardData);
router.get('/historical', periodValidation, analyticsController.getHistoricalData);
router.get('/realtime', analyticsController.getRealTimeMetrics);
router.get('/trends/:metric', periodValidation, analyticsController.getMetricTrends);
router.get('/export', [
  ...periodValidation,
  query('format')
    .optional()
    .isIn(['json', 'csv'])
    .withMessage('Invalid format. Must be json or csv')
], analyticsController.exportReport);

module.exports = router;