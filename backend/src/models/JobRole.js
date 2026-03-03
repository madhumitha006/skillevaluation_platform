const mongoose = require('mongoose');

const skillRequirementSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    trim: true
  },
  weight: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    default: 5
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  }
});

const jobRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Mid', 'Senior', 'Lead'],
    required: true
  },
  skillRequirements: [skillRequirementSchema],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicationDeadline: Date,
  tags: [String]
}, {
  timestamps: true
});

jobRoleSchema.index({ title: 'text', description: 'text' });
jobRoleSchema.index({ experienceLevel: 1, isActive: 1 });
jobRoleSchema.index({ 'skillRequirements.skill': 1 });
jobRoleSchema.index({ company: 1, isActive: 1 });

module.exports = mongoose.model('JobRole', jobRoleSchema);