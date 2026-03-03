const mongoose = require('mongoose');

const platformAnalyticsSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    index: true
  },
  period: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: true
  },
  userMetrics: {
    totalUsers: { type: Number, default: 0 },
    newUsers: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    usersByRole: {
      students: { type: Number, default: 0 },
      recruiters: { type: Number, default: 0 },
      company_admins: { type: Number, default: 0 },
      hr_managers: { type: Number, default: 0 }
    },
    userGrowthRate: { type: Number, default: 0 }
  },
  skillMetrics: {
    totalSkillAssessments: { type: Number, default: 0 },
    topSkills: [{
      skill: String,
      count: Number,
      averageScore: Number
    }],
    skillTrends: [{
      skill: String,
      growth: Number,
      popularity: Number
    }]
  },
  testMetrics: {
    totalTests: { type: Number, default: 0 },
    completedTests: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    testsByType: {
      adaptive: { type: Number, default: 0 },
      interviews: { type: Number, default: 0 },
      projects: { type: Number, default: 0 }
    }
  },
  aiMetrics: {
    totalAIRequests: { type: Number, default: 0 },
    aiFeatureUsage: {
      bioGeneration: { type: Number, default: 0 },
      projectEvaluation: { type: Number, default: 0 },
      careerSimulation: { type: Number, default: 0 },
      chatAssistant: { type: Number, default: 0 }
    },
    averageResponseTime: { type: Number, default: 0 }
  },
  revenueMetrics: {
    totalRevenue: { type: Number, default: 0 },
    subscriptionRevenue: { type: Number, default: 0 },
    revenueByPlan: {
      starter: { type: Number, default: 0 },
      professional: { type: Number, default: 0 },
      enterprise: { type: Number, default: 0 }
    },
    mrr: { type: Number, default: 0 }, // Monthly Recurring Revenue
    churnRate: { type: Number, default: 0 }
  },
  platformMetrics: {
    totalCompanies: { type: Number, default: 0 },
    activeCompanies: { type: Number, default: 0 },
    totalJobPostings: { type: Number, default: 0 },
    portfolioViews: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

platformAnalyticsSchema.index({ date: -1, period: 1 });
platformAnalyticsSchema.index({ period: 1, createdAt: -1 });

module.exports = mongoose.model('PlatformAnalytics', platformAnalyticsSchema);