const express = require('express');
const { body } = require('express-validator');
const portfolioController = require('../controllers/portfolioController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes (no auth required)
router.get('/public/:slug', portfolioController.getPublicPortfolio);

// Protected routes
router.use(protect);

// Portfolio CRUD
router.get('/', portfolioController.getPortfolio);
router.put('/', [
  body('personalInfo.displayName').optional().trim().isLength({ min: 2, max: 100 }),
  body('personalInfo.title').optional().trim().isLength({ max: 100 }),
  body('personalInfo.bio').optional().trim().isLength({ max: 500 }),
  body('personalInfo.location').optional().trim().isLength({ max: 100 }),
  body('personalInfo.website').optional().isURL(),
  body('personalInfo.contactEmail').optional().isEmail(),
  body('skills').optional().isArray(),
  body('skills.*.name').optional().trim().isLength({ min: 1, max: 50 }),
  body('skills.*.level').optional().isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']),
  body('skills.*.score').optional().isInt({ min: 0, max: 100 }),
  body('certifications').optional().isArray(),
  body('achievements').optional().isArray(),
  body('theme.primaryColor').optional().matches(/^#[0-9A-F]{6}$/i),
  body('theme.layout').optional().isIn(['modern', 'classic', 'minimal', 'creative'])
], portfolioController.updatePortfolio);

// AI features
router.post('/generate-bio', portfolioController.generateAIBio);
router.get('/insights', portfolioController.getSkillInsights);

// Visibility and sharing
router.post('/toggle-visibility', portfolioController.toggleVisibility);
router.get('/analytics', portfolioController.getAnalytics);

// Export
router.get('/export/pdf', portfolioController.exportPDF);

module.exports = router;