const express = require('express');
const { body } = require('express-validator');
const companyController = require('../controllers/companyController');
const { protect } = require('../middleware/auth');
const { extractTenant, resolveTenant, validateTenantUser, requirePermission, trackUsage } = require('../middleware/tenant');

const router = express.Router();

// Company registration (no tenant required)
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Company name must be 2-100 characters'),
  body('domain').isEmail().withMessage('Valid email domain required'),
  body('adminUser.name').trim().isLength({ min: 2, max: 50 }).withMessage('Admin name must be 2-50 characters'),
  body('adminUser.email').isEmail().withMessage('Valid admin email required'),
  body('adminUser.password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('plan').optional().isIn(['starter', 'professional', 'enterprise']).withMessage('Invalid plan')
], companyController.createCompany);

// Get subscription plans (no auth required)
router.get('/plans', companyController.getSubscriptionPlans);

// Tenant-aware routes
router.use(extractTenant);
router.use(resolveTenant);
router.use(protect);
router.use(validateTenantUser);

// Company management
router.get('/', companyController.getCompany);
router.put('/', requirePermission('manage_settings'), companyController.updateCompany);

// User management
router.post('/users/invite', 
  requirePermission('manage_users'),
  trackUsage('user'),
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('role').isIn(['hr_manager', 'recruiter']).withMessage('Invalid role'),
    body('permissions').optional().isArray().withMessage('Permissions must be an array')
  ],
  companyController.inviteUser
);

router.get('/users', requirePermission('manage_users'), companyController.getCompanyUsers);

// Subscription management
router.put('/subscription', 
  requirePermission('manage_billing'),
  [body('plan').isIn(['starter', 'professional', 'enterprise']).withMessage('Invalid plan')],
  companyController.updateSubscription
);

// Dashboard
router.get('/dashboard/stats', companyController.getDashboardStats);

module.exports = router;