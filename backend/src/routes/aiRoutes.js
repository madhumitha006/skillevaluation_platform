const express = require('express');
const { body, query } = require('express-validator');
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router.post(
  '/analyze-resume',
  [
    body('resumeText').notEmpty().withMessage('Resume text is required'),
    validate,
  ],
  aiController.analyzeResume
);

router.post(
  '/generate-test',
  [
    body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
    validate,
  ],
  aiController.generateTest
);

router.post(
  '/submit-test/:assessmentId',
  [
    body('responses').isArray({ min: 1 }).withMessage('Test responses are required'),
    validate,
  ],
  aiController.submitTest
);

router.get('/career-recommendations', aiController.getCareerRecommendations);

router.post(
  '/learning-roadmap',
  [
    body('targetRole').notEmpty().withMessage('Target role is required'),
    validate,
  ],
  aiController.getLearningRoadmap
);

router.get(
  '/certifications',
  [
    query('targetRole').notEmpty().withMessage('Target role is required'),
    validate,
  ],
  aiController.getCertifications
);

router.get('/skill-profile', aiController.getSkillProfile);

module.exports = router;
