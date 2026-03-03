const express = require('express');
const { body } = require('express-validator');
const projectEvaluationController = require('../controllers/projectEvaluationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Input validation rules
const projectValidation = [
  body('projectName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Project name must be 3-100 characters')
    .escape(),
  
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be 50-2000 characters')
    .escape(),
  
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('Invalid GitHub URL')
    .custom((value) => {
      if (value && !value.includes('github.com')) {
        throw new Error('URL must be a GitHub repository');
      }
      return true;
    }),
  
  body('projectType')
    .optional()
    .isIn(['web', 'mobile', 'desktop', 'api', 'library', 'other'])
    .withMessage('Invalid project type'),
  
  body('technologies')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Technologies must be an array with max 20 items'),
  
  body('technologies.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each technology must be 1-50 characters')
    .escape()
];

// Apply authentication to all routes
router.use(protect);

// Project evaluation routes
router.post('/submit', projectValidation, projectEvaluationController.submitProject);
router.get('/history', projectEvaluationController.getEvaluationHistory);
router.get('/stats', projectEvaluationController.getEvaluationStats);
router.get('/:id', projectEvaluationController.getEvaluation);
router.get('/:id/report', projectEvaluationController.getEvaluationReport);
router.delete('/:id', projectEvaluationController.deleteEvaluation);

module.exports = router;