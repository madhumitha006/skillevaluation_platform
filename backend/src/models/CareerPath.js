const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  requiredSkills: [String],
  certifications: [String],
  completed: {
    type: Boolean,
    default: false
  }
});

const salaryDataSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  role: String,
  level: String
});

const careerPathSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pathName: {
    type: String,
    required: true,
    trim: true
  },
  currentRole: {
    type: String,
    required: true
  },
  targetRole: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    enum: ['technology', 'finance', 'healthcare', 'education', 'marketing', 'other'],
    default: 'technology'
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'lead'],
    required: true
  },
  location: {
    type: String,
    default: 'Remote'
  },
  simulationData: {
    totalGrowthPercentage: Number,
    averageYearlyIncrease: Number,
    skillGapScore: Number,
    timeToTarget: Number,
    confidenceScore: Number
  },
  salaryProgression: [salaryDataSchema],
  milestones: [milestoneSchema],
  requiredSkills: [{
    skill: String,
    currentLevel: {
      type: String,
      enum: ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'None'
    },
    targetLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      required: true
    },
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    }
  }],
  certifications: [{
    name: String,
    provider: String,
    estimatedCost: Number,
    timeToComplete: String,
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium'
    },
    year: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastSimulated: Date
}, {
  timestamps: true
});

careerPathSchema.index({ user: 1, isActive: 1 });
careerPathSchema.index({ targetRole: 1, industry: 1 });

module.exports = mongoose.model('CareerPath', careerPathSchema);