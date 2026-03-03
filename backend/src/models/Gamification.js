const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  icon: String,
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    current: { type: Number, default: 0 },
    target: { type: Number, required: true }
  }
});

const streakSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['daily_login', 'assessment', 'learning', 'project'],
    required: true
  },
  current: {
    type: Number,
    default: 0
  },
  longest: {
    type: Number,
    default: 0
  },
  lastActivity: Date
});

const skillMasterySchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    min: 1,
    max: 100,
    default: 1
  },
  xp: {
    type: Number,
    default: 0
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  masteryPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
});

const gamificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalXP: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  currentLevelXP: {
    type: Number,
    default: 0
  },
  nextLevelXP: {
    type: Number,
    default: 100
  },
  rank: {
    global: { type: Number, default: 0 },
    category: { type: Number, default: 0 },
    percentile: { type: Number, default: 0 }
  },
  achievements: [achievementSchema],
  streaks: [streakSchema],
  skillMastery: [skillMasterySchema],
  badges: [{
    id: String,
    name: String,
    category: String,
    earnedAt: { type: Date, default: Date.now },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    }
  }],
  stats: {
    assessmentsCompleted: { type: Number, default: 0 },
    projectsEvaluated: { type: Number, default: 0 },
    skillsLearned: { type: Number, default: 0 },
    hoursSpent: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    improvementRate: { type: Number, default: 0 }
  },
  preferences: {
    celebrationAnimations: { type: Boolean, default: true },
    soundEffects: { type: Boolean, default: true },
    notifications: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

gamificationSchema.index({ user: 1 });
gamificationSchema.index({ totalXP: -1 });
gamificationSchema.index({ level: -1 });

// Calculate level from XP
gamificationSchema.methods.calculateLevel = function() {
  const xp = this.totalXP;
  const level = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelXP = xp - (Math.pow(level - 1, 2) * 100);
  const nextLevelXP = Math.pow(level, 2) * 100 - Math.pow(level - 1, 2) * 100;
  
  this.level = level;
  this.currentLevelXP = currentLevelXP;
  this.nextLevelXP = nextLevelXP;
};

// Add XP and check for level up
gamificationSchema.methods.addXP = function(amount, source = 'general') {
  const oldLevel = this.level;
  this.totalXP += amount;
  this.calculateLevel();
  
  const leveledUp = this.level > oldLevel;
  
  return {
    xpGained: amount,
    totalXP: this.totalXP,
    level: this.level,
    leveledUp,
    source
  };
};

// Update streak
gamificationSchema.methods.updateStreak = function(type) {
  let streak = this.streaks.find(s => s.type === type);
  
  if (!streak) {
    streak = { type, current: 0, longest: 0, lastActivity: new Date() };
    this.streaks.push(streak);
  }
  
  const now = new Date();
  const lastActivity = streak.lastActivity || new Date(0);
  const daysDiff = Math.floor((now - lastActivity) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Continue streak
    streak.current += 1;
    streak.longest = Math.max(streak.longest, streak.current);
  } else if (daysDiff > 1) {
    // Streak broken
    streak.current = 1;
  }
  // Same day, no change
  
  streak.lastActivity = now;
  return streak;
};

module.exports = mongoose.model('Gamification', gamificationSchema);