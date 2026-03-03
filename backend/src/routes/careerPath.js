const express = require('express');
const { body } = require('express-validator');
const careerPathController = require('../controllers/careerPathController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const careerPathValidation = [
  body('pathName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Path name must be 3-100 characters')
    .escape(),
  
  body('currentRole')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Current role is required')
    .escape(),
  
  body('targetRole')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Target role is required')
    .escape(),
  
  body('industry')
    .optional()
    .isIn(['technology', 'finance', 'healthcare', 'education', 'marketing', 'other'])
    .withMessage('Invalid industry'),
  
  body('experienceLevel')
    .isIn(['entry', 'mid', 'senior', 'lead'])
    .withMessage('Invalid experience level'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters')
    .escape()
];

// Apply authentication to all routes
router.use(protect);

// Career path routes
router.post('/simulate', careerPathValidation, careerPathController.createSimulation);
router.get('/', careerPathController.getCareerPaths);
router.get('/roles', careerPathController.getCareerRoles);
router.get('/:id', careerPathController.getCareerPath);
router.post('/compare', careerPathController.compareCareerPaths);
router.patch('/:id/milestones/:milestoneIndex', careerPathController.updateMilestone);
router.delete('/:id', careerPathController.deleteCareerPath);

module.exports = router;