const Company = require('../models/Company');
const User = require('../models/User');

// Extract tenant from subdomain or header
const extractTenant = (req, res, next) => {
  let tenantSlug = null;

  // Method 1: Subdomain (e.g., company.skillnexus.com)
  const host = req.get('host');
  if (host) {
    const subdomain = host.split('.')[0];
    if (subdomain && subdomain !== 'www' && subdomain !== 'api') {
      tenantSlug = subdomain;
    }
  }

  // Method 2: Custom header (for API clients)
  if (!tenantSlug && req.headers['x-tenant']) {
    tenantSlug = req.headers['x-tenant'];
  }

  // Method 3: URL path (e.g., /api/tenant/company-slug/...)
  if (!tenantSlug && req.path.startsWith('/api/tenant/')) {
    const pathParts = req.path.split('/');
    if (pathParts[3]) {
      tenantSlug = pathParts[3];
    }
  }

  req.tenantSlug = tenantSlug;
  next();
};

// Resolve tenant company
const resolveTenant = async (req, res, next) => {
  try {
    if (!req.tenantSlug) {
      return res.status(400).json({
        success: false,
        message: 'Tenant not specified'
      });
    }

    const company = await Company.findOne({ 
      slug: req.tenantSlug,
      isActive: true 
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (!company.isSubscriptionActive()) {
      return res.status(403).json({
        success: false,
        message: 'Company subscription is not active'
      });
    }

    req.tenant = company;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resolving tenant',
      error: error.message
    });
  }
};

// Ensure user belongs to tenant
const validateTenantUser = async (req, res, next) => {
  try {
    if (!req.user || !req.tenant) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admin can access any tenant
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Students don't need company association
    if (req.user.role === 'student') {
      return next();
    }

    // Company users must belong to the tenant
    if (!req.user.company || req.user.company.toString() !== req.tenant._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied for this company'
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error validating tenant user',
      error: error.message
    });
  }
};

// Add tenant filter to database queries
const addTenantFilter = (req, res, next) => {
  if (req.tenant) {
    // Store original query methods
    const originalFind = req.model?.find;
    const originalFindOne = req.model?.findOne;
    const originalFindOneAndUpdate = req.model?.findOneAndUpdate;

    // Override query methods to include tenant filter
    if (req.model) {
      req.model.find = function(filter = {}) {
        if (this.schema.paths.company) {
          filter.company = req.tenant._id;
        }
        return originalFind.call(this, filter);
      };

      req.model.findOne = function(filter = {}) {
        if (this.schema.paths.company) {
          filter.company = req.tenant._id;
        }
        return originalFindOne.call(this, filter);
      };

      req.model.findOneAndUpdate = function(filter = {}, update, options) {
        if (this.schema.paths.company) {
          filter.company = req.tenant._id;
        }
        return originalFindOneAndUpdate.call(this, filter, update, options);
      };
    }
  }
  next();
};

// Check feature access
const requireFeature = (feature) => {
  return (req, res, next) => {
    if (!req.tenant) {
      return res.status(400).json({
        success: false,
        message: 'Tenant required'
      });
    }

    if (!req.tenant.hasFeature(feature)) {
      return res.status(403).json({
        success: false,
        message: `Feature '${feature}' not available in current plan`
      });
    }

    next();
  };
};

// Check user permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Super admin has all permissions
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Company admin has all permissions within their company
    if (req.user.role === 'company_admin' && req.user.company?.toString() === req.tenant?._id.toString()) {
      return next();
    }

    // Check specific permission
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required`
      });
    }

    next();
  };
};

// Usage tracking middleware
const trackUsage = (type) => {
  return async (req, res, next) => {
    if (req.tenant && req.method === 'POST') {
      try {
        if (type === 'user' && !req.tenant.canAddUser()) {
          return res.status(403).json({
            success: false,
            message: 'User limit reached for current plan'
          });
        }

        if (type === 'job' && !req.tenant.canAddJobPosting()) {
          return res.status(403).json({
            success: false,
            message: 'Job posting limit reached for current plan'
          });
        }

        // Track usage after successful creation
        res.on('finish', async () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const updateField = type === 'user' ? 'usage.currentUsers' : 'usage.currentJobPostings';
            await Company.findByIdAndUpdate(req.tenant._id, {
              $inc: { [updateField]: 1 }
            });
          }
        });
      } catch (error) {
        console.error('Usage tracking error:', error);
      }
    }
    next();
  };
};

module.exports = {
  extractTenant,
  resolveTenant,
  validateTenantUser,
  addTenantFilter,
  requireFeature,
  requirePermission,
  trackUsage
};