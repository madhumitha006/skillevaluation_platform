const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['starter', 'professional', 'enterprise'],
    required: true
  },
  maxUsers: {
    type: Number,
    required: true
  },
  maxJobPostings: {
    type: Number,
    required: true
  },
  features: [{
    type: String,
    enum: ['basic_matching', 'advanced_analytics', 'ai_interviews', 'custom_branding', 'api_access', 'priority_support']
  }],
  price: {
    monthly: Number,
    yearly: Number
  }
});

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  logo: String,
  description: String,
  industry: String,
  size: {
    type: String,
    enum: ['1-10', '11-50', '51-200', '201-1000', '1000+']
  },
  subscription: {
    plan: subscriptionPlanSchema,
    status: {
      type: String,
      enum: ['active', 'suspended', 'cancelled', 'trial'],
      default: 'trial'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date,
    trialEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days trial
    }
  },
  settings: {
    allowedDomains: [String],
    requireEmailVerification: {
      type: Boolean,
      default: true
    },
    customBranding: {
      primaryColor: String,
      secondaryColor: String,
      logoUrl: String
    }
  },
  usage: {
    currentUsers: {
      type: Number,
      default: 0
    },
    currentJobPostings: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

companySchema.index({ slug: 1 });
companySchema.index({ domain: 1 });
companySchema.index({ 'subscription.status': 1 });

// Pre-save middleware to generate slug
companySchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  }
  next();
});

// Methods
companySchema.methods.hasFeature = function(feature) {
  return this.subscription.plan.features.includes(feature);
};

companySchema.methods.canAddUser = function() {
  return this.usage.currentUsers < this.subscription.plan.maxUsers;
};

companySchema.methods.canAddJobPosting = function() {
  return this.usage.currentJobPostings < this.subscription.plan.maxJobPostings;
};

companySchema.methods.isSubscriptionActive = function() {
  return this.subscription.status === 'active' || 
         (this.subscription.status === 'trial' && new Date() < this.subscription.trialEndsAt);
};

module.exports = mongoose.model('Company', companySchema);