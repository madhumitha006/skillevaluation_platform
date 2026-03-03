const express = require('express');
const { body } = require('express-validator');
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create new interview
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Interview title is required'),
    body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
    body('difficulty').optional().isIn(['easy', 'medium', 'hard']).withMessage('Invalid difficulty level'),
    validate,
  ],
  interviewController.createInterview
);

// Start interview
router.patch('/:interviewId/start', interviewController.startInterview);

// Submit response
router.post(
  '/:interviewId/responses',
  [
    body('questionId').notEmpty().withMessage('Question ID is required'),
    body('answer').trim().notEmpty().withMessage('Answer is required'),
    body('transcript').trim().notEmpty().withMessage('Transcript is required'),
    body('responseTime').isNumeric().withMessage('Response time must be a number'),
    validate,
  ],
  interviewController.submitResponse
);

// Complete interview
router.patch('/:interviewId/complete', interviewController.completeInterview);

// Get specific interview
router.get('/:interviewId', interviewController.getInterview);

// Get follow-up question
router.get('/:interviewId/questions/:questionId/followup', interviewController.getFollowUpQuestion);

// Get user's interviews
router.get('/', interviewController.getUserInterviews);

module.exports = router;