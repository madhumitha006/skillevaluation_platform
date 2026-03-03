const Company = require('../models/Company');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const subscriptionPlans = {
  starter: {
    name: 'starter',
    maxUsers: 10,
    maxJobPostings: 5,
    features: ['basic_matching'],
    price: { monthly: 29, yearly: 290 }
  },
  professional: {
    name: 'professional',
    maxUsers: 50,
    maxJobPostings: 25,
    features: ['basic_matching', 'advanced_analytics', 'ai_interviews'],
    price: { monthly: 99, yearly: 990 }
  },
  enterprise: {
    name: 'enterprise',
    maxUsers: 500,
    maxJobPostings: 100,
    features: ['basic_matching', 'advanced_analytics', 'ai_interviews', 'custom_branding', 'api_access', 'priority_support'],
    price: { monthly: 299, yearly: 2990 }
  }
};

const companyController = {
  // Create new company (signup)
  async createCompany(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { name, domain, adminUser, plan = 'starter' } = req.body;

      // Check if domain already exists
      const existingCompany = await Company.findOne({ domain: domain.toLowerCase() });
      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: 'Domain already registered'
        });
      }

      // Check if admin email exists
      const existingUser = await User.findOne({ email: adminUser.email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered'
        });
      }

      // Create company
      const company = new Company({
        name,
        domain: domain.toLowerCase(),
        subscription: {
          plan: subscriptionPlans[plan],
          status: 'trial'
        }
      });

      await company.save();

      // Create admin user
      const admin = new User({
        ...adminUser,
        role: 'company_admin',
        company: company._id,
        permissions: ['manage_users', 'manage_jobs', 'view_analytics', 'manage_billing', 'manage_settings']
      });

      await admin.save();

      // Update company usage
      await Company.findByIdAndUpdate(company._id, {
        $inc: { 'usage.currentUsers': 1 }
      });

      res.status(201).json({
        success: true,
        message: 'Company created successfully',
        data: {
          company: {
            id: company._id,
            name: company.name,
            slug: company.slug,
            domain: company.domain,
            subscription: company.subscription
          },
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create company',
        error: error.message
      });
    }
  },

  // Get company details
  async getCompany(req, res) {
    try {
      const company = await Company.findById(req.tenant._id)
        .populate('usage');

      res.json({
        success: true,
        data: company
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get company details',
        error: error.message
      });
    }
  },

  // Update company settings
  async updateCompany(req, res) {
    try {
      const updates = req.body;
      delete updates.subscription; // Prevent direct subscription updates

      const company = await Company.findByIdAndUpdate(
        req.tenant._id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Company updated successfully',
        data: company
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update company',
        error: error.message
      });
    }
  },

  // Invite user to company
  async inviteUser(req, res) {
    try {
      const { email, role, permissions } = req.body;

      if (!req.tenant.canAddUser()) {
        return res.status(403).json({
          success: false,
          message: 'User limit reached for current plan'
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists'
        });
      }

      // Generate invite token
      const inviteToken = crypto.randomBytes(32).toString('hex');
      const inviteExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      // Create user with invite
      const user = new User({
        email,
        name: email.split('@')[0], // Temporary name
        password: crypto.randomBytes(16).toString('hex'), // Temporary password
        role,
        company: req.tenant._id,
        permissions: permissions || [],
        invitedBy: req.user.id,
        inviteToken,
        inviteExpires,
        isActive: false
      });

      await user.save();

      // TODO: Send invite email with token

      res.status(201).json({
        success: true,
        message: 'User invited successfully',
        data: {
          email,
          inviteToken,
          expiresAt: inviteExpires
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to invite user',
        error: error.message
      });
    }
  },

  // Get company users
  async getCompanyUsers(req, res) {
    try {
      const { page = 1, limit = 10, role } = req.query;
      const query = { company: req.tenant._id };
      
      if (role) query.role = role;

      const users = await User.find(query)
        .select('-password -refreshToken')
        .populate('invitedBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await User.countDocuments(query);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get company users',
        error: error.message
      });
    }
  },

  // Update subscription
  async updateSubscription(req, res) {
    try {
      const { plan } = req.body;

      if (!subscriptionPlans[plan]) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subscription plan'
        });
      }

      const company = await Company.findByIdAndUpdate(
        req.tenant._id,
        {
          'subscription.plan': subscriptionPlans[plan],
          'subscription.status': 'active',
          'subscription.startDate': new Date()
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Subscription updated successfully',
        data: company.subscription
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update subscription',
        error: error.message
      });
    }
  },

  // Get subscription plans
  async getSubscriptionPlans(req, res) {
    res.json({
      success: true,
      data: subscriptionPlans
    });
  },

  // Company dashboard stats
  async getDashboardStats(req, res) {
    try {
      const [userCount, jobCount] = await Promise.all([
        User.countDocuments({ company: req.tenant._id, isActive: true }),
        // Add job count query when JobRole model is updated
        0 // Placeholder
      ]);

      const stats = {
        users: {
          current: userCount,
          limit: req.tenant.subscription.plan.maxUsers,
          percentage: Math.round((userCount / req.tenant.subscription.plan.maxUsers) * 100)
        },
        jobs: {
          current: jobCount,
          limit: req.tenant.subscription.plan.maxJobPostings,
          percentage: Math.round((jobCount / req.tenant.subscription.plan.maxJobPostings) * 100)
        },
        subscription: {
          plan: req.tenant.subscription.plan.name,
          status: req.tenant.subscription.status,
          trialEndsAt: req.tenant.subscription.trialEndsAt,
          features: req.tenant.subscription.plan.features
        }
      };

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard stats',
        error: error.message
      });
    }
  }
};

module.exports = companyController;