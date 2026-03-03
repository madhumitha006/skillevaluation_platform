const mongoose = require('mongoose');

const skillProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resumeText: String,
    extractedSkills: [String],
    categorizedSkills: {
      technical: {
        programming: [String],
        frameworks: [String],
        databases: [String],
        cloud: [String],
        tools: [String],
      },
      soft: [String],
    },
    proficiencyLevels: {
      type: Map,
      of: {
        level: {
          type: String,
          enum: ['beginner', 'intermediate', 'expert'],
        },
        confidence: Number,
      },
    },
    careerRecommendations: [{
      role: String,
      matchScore: Number,
      strengthAlignment: Number,
      missingSkills: [String],
      salary: String,
      priority: String,
    }],
    learningRoadmap: {
      targetRole: String,
      phases: Array,
      timeline: Object,
    },
    lastAnalyzedAt: Date,
  },
  {
    timestamps: true,
  }
);

skillProfileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('SkillProfile', skillProfileSchema);
