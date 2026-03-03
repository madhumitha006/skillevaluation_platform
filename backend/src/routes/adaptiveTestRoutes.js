const express = require('express');
const { protect } = require('../middleware/auth');
const adaptiveTestController = require('../controllers/adaptiveTestController');

const router = express.Router();

router.use(protect);

router.post('/assessment/:assessmentId/answer', adaptiveTestController.submitAnswer);
router.get('/assessment/:assessmentId/metrics', adaptiveTestController.getAdaptiveMetrics);

module.exports = router;
