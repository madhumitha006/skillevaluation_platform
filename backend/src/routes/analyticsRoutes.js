const express = require('express');
const { protect } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.use(protect);

router.get('/dashboard', analyticsController.getDashboardData);
router.get('/historical', analyticsController.getHistoricalData);
router.get('/export', analyticsController.exportReport);
router.get('/realtime', analyticsController.getRealTimeMetrics);
router.get('/trends', analyticsController.getMetricTrends);

module.exports = router;
