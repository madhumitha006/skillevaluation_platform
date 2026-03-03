const mongoose = require('mongoose');

const skillDependencySchema = new mongoose.Schema({
  prerequisite: {
    type: String,
    required: true
  },
  strength: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.5
  }
});

const skillEvolutionSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  trigger: {
    type: String,
    enum: ['assessment', 'project', 'certification', 'manual'],
    required: true
  }
});

const skillDNASchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skill: {
    type: String,
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Frameworks', 'Domain'],
    required: true
  },
  layers: {
    core: {
      level: {
        type: String,
        enum: ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'None'
      },
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      }
    },
    advanced: {
      level: {
        type: String,
        enum: ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'None'
      },
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      }
    },
    expert: {
      level: {
        type: String,
        enum: ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'None'
      },
      score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      confidence: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.5
      }
    }
  },
  dependencies: [skillDependencySchema],
  evolution: [skillEvolutionSchema],
  marketDemand: {
    trend: {
      type: String,
      enum: ['rising', 'stable', 'declining'],
      default: 'stable'
    },
    demandScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    salaryImpact: {
      type: Number,
      default: 1.0
    }
  },
  aiInsights: {
    strengthAreas: [String],
    improvementAreas: [String],
    nextSteps: [String],
    confidenceExplanation: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

skillDNASchema.index({ user: 1, skill: 1 }, { unique: true });
skillDNASchema.index({ category: 1, 'marketDemand.trend': 1 });
skillDNASchema.index({ 'layers.core.score': -1 });

module.exports = mongoose.model('SkillDNA', skillDNASchema);