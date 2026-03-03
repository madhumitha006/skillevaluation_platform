const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  requiredLevel: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  },
  currentLevel: {
    type: String,
    enum: ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'],
    default: 'None'
  },
  gap: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  }
});

const jobMatchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobRole',
    required: true
  },
  matchScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  skillGaps: [skillGapSchema],
  matchedSkills: [{
    skill: String,
    userLevel: String,
    requiredLevel: String,
    score: Number
  }],
  recommendations: [String],
  isBookmarked: {
    type: Boolean,
    default: false
  },
  hasApplied: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

jobMatchSchema.index({ user: 1, matchScore: -1 });
jobMatchSchema.index({ jobRole: 1, matchScore: -1 });
jobMatchSchema.index({ user: 1, jobRole: 1 }, { unique: true });

module.exports = mongoose.model('JobMatch', jobMatchSchema);