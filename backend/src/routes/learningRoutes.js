const express = require('express');
const { body } = require('express-validator');
const learningController = require('../controllers/learningController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get courses
router.get('/courses', learningController.getCourses);

// Get specific course
router.get('/courses/:courseId', learningController.getCourse);

// Generate personalized learning path
router.post(
  '/learning-paths/generate',
  [
    body('targetSkills').isArray({ min: 1 }).withMessage('Target skills are required'),
    body('currentSkills').isArray().withMessage('Current skills must be an array'),
    validate,
  ],
  learningController.generateLearningPath
);

// Get user's learning paths
router.get('/learning-paths', learningController.getUserLearningPaths);

// Start a module
router.post('/courses/:courseId/modules/:moduleId/start', learningController.startModule);

// Complete a module
router.post(
  '/courses/:courseId/modules/:moduleId/complete',
  [
    body('timeSpent').isNumeric().withMessage('Time spent must be a number'),
    body('score').optional().isNumeric().withMessage('Score must be a number'),
    validate,
  ],
  learningController.completeModule
);

// Generate quiz
router.post(
  '/quiz/generate',
  [
    body('topic').notEmpty().withMessage('Topic is required'),
    body('difficulty').optional().isIn(['beginner', 'medium', 'advanced']).withMessage('Invalid difficulty'),
    body('questionCount').optional().isInt({ min: 1, max: 20 }).withMessage('Question count must be between 1 and 20'),
    validate,
  ],
  learningController.generateQuiz
);

// Get user progress for a course
router.get('/progress/:courseId', learningController.getUserProgress);

// Get gamification data
router.get('/gamification', learningController.getGamificationData);

// Get revision items
router.get('/revision', learningController.getRevisionItems);

module.exports = router;