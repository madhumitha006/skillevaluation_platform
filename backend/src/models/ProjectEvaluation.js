const mongoose = require('mongoose');

const evaluationCriteriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  feedback: String,
  suggestions: [String]
});

const projectEvaluationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  githubUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/.test(v);
      },
      message: 'Invalid GitHub URL format'
    }
  },
  projectType: {
    type: String,
    enum: ['web', 'mobile', 'desktop', 'api', 'library', 'other'],
    default: 'web'
  },
  technologies: [String],
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
    required: true
  },
  evaluationCriteria: [evaluationCriteriaSchema],
  strengths: [String],
  weaknesses: [String],
  recommendations: [String],
  aiAnalysis: {
    codeQuality: {
      score: Number,
      issues: [String],
      suggestions: [String]
    },
    documentation: {
      score: Number,
      coverage: String,
      suggestions: [String]
    },
    structure: {
      score: Number,
      patterns: [String],
      suggestions: [String]
    },
    scalability: {
      score: Number,
      concerns: [String],
      suggestions: [String]
    }
  },
  evaluationStatus: {
    type: String,
    enum: ['pending', 'analyzing', 'completed', 'failed'],
    default: 'pending'
  },
  evaluatedAt: Date,
  processingTime: Number // in seconds
}, {
  timestamps: true
});

projectEvaluationSchema.index({ user: 1, createdAt: -1 });
projectEvaluationSchema.index({ overallScore: -1 });
projectEvaluationSchema.index({ evaluationStatus: 1 });

// Calculate grade based on score
projectEvaluationSchema.pre('save', function(next) {
  if (this.isModified('overallScore')) {
    const score = this.overallScore;
    if (score >= 95) this.grade = 'A+';
    else if (score >= 90) this.grade = 'A';
    else if (score >= 85) this.grade = 'B+';
    else if (score >= 80) this.grade = 'B';
    else if (score >= 75) this.grade = 'C+';
    else if (score >= 70) this.grade = 'C';
    else if (score >= 60) this.grade = 'D';
    else this.grade = 'F';
  }
  next();
});

module.exports = mongoose.model('ProjectEvaluation', projectEvaluationSchema);