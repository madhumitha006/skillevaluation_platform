const express = require('express');
const { body } = require('express-validator');
const jobMatchingController = require('../controllers/jobMatchingController');
const { protect } = require('../middleware/auth');
const { roleAuth } = require('../middleware/roleAuth');
const { extractTenant, resolveTenant, validateTenantUser, requirePermission, trackUsage } = require('../middleware/tenant');

const router = express.Router();

// Apply tenant middleware to all routes
router.use(extractTenant);
router.use(resolveTenant);
router.use(protect);
router.use(validateTenantUser);

// Validation rules
const jobRoleValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('company').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be 2-100 characters'),
  body('location').trim().isLength({ min: 2, max: 100 }).withMessage('Location must be 2-100 characters'),
  body('experienceLevel').isIn(['Entry', 'Mid', 'Senior', 'Lead']).withMessage('Invalid experience level'),
  body('skillRequirements').isArray({ min: 1 }).withMessage('At least one skill requirement is needed'),
  body('skillRequirements.*.skill').trim().isLength({ min: 2 }).withMessage('Skill name is required'),
  body('skillRequirements.*.weight').isInt({ min: 1, max: 10 }).withMessage('Weight must be 1-10'),
  body('skillRequirements.*.level').isIn(['Beginner', 'Intermediate', 'Advanced', 'Expert']).withMessage('Invalid skill level')
];

// Job role management (Company users only)
router.post('/', 
  requirePermission('manage_jobs'),
  trackUsage('job'),
  jobRoleValidation, 
  jobMatchingController.createJobRole
);
router.get('/', jobMatchingController.getJobRoles);
router.get('/:id', jobMatchingController.getJobRole);

// Job matching (All authenticated users)
router.get('/matching/recommendations', jobMatchingController.getMatchingJobs);
router.post('/matching/:jobId', jobMatchingController.calculateJobMatch);
router.get('/matching/:jobId/details', jobMatchingController.getJobMatchDetails);

// Skill gap analysis
router.get('/analysis/skill-gaps', jobMatchingController.getSkillGapAnalysis);

// Bookmarks
router.post('/bookmarks/:jobId', jobMatchingController.toggleBookmark);
router.get('/bookmarks', jobMatchingController.getBookmarkedJobs);

module.exports = router;