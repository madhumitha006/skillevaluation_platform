const Gamification = require('../models/Gamification');

class GamificationAgent {
  constructor() {
    this.xpRewards = {
      assessment_complete: 50,
      perfect_score: 100,
      first_attempt: 25,
      improvement: 30,
      streak_milestone: 75,
      skill_mastery: 200,
      project_submission: 100,
      certification_earned: 300,
      daily_login: 10,
      profile_complete: 50
    };

    this.achievements = {
      first_steps: {
        name: 'First Steps',
        description: 'Complete your first assessment',
        icon: '🎯',
        rarity: 'common',
        trigger: 'assessment_complete',
        target: 1
      },
      perfectionist: {
        name: 'Perfectionist',
        description: 'Score 100% on an assessment',
        icon: '💯',
        rarity: 'rare',
        trigger: 'perfect_score',
        target: 1
      },
      streak_master: {
        name: 'Streak Master',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        rarity: 'epic',
        trigger: 'streak',
        target: 7
      },
      skill_collector: {
        name: 'Skill Collector',
        description: 'Master 10 different skills',
        icon: '🏆',
        rarity: 'legendary',
        trigger: 'skills_mastered',
        target: 10
      },
      early_bird: {
        name: 'Early Bird',
        description: 'Complete assessments before 9 AM for 5 days',
        icon: '🌅',
        rarity: 'rare',
        trigger: 'early_completion',
        target: 5
      }
    };

    this.badges = {
      javascript_ninja: { name: 'JavaScript Ninja', category: 'Technical', rarity: 'epic' },
      react_master: { name: 'React Master', category: 'Framework', rarity: 'rare' },
      problem_solver: { name: 'Problem Solver', category: 'Soft Skills', rarity: 'common' },
      team_player: { name: 'Team Player', category: 'Collaboration', rarity: 'common' },
      innovation_champion: { name: 'Innovation Champion', category: 'Leadership', rarity: 'legendary' }
    };
  }

  async initializeGamification(userId) {
    try {
      let gamification = await Gamification.findOne({ user: userId });
      
      if (!gamification) {
        gamification = new Gamification({
          user: userId,
          totalXP: 0,
          level: 1,
          achievements: [],
          streaks: [],
          skillMastery: [],
          badges: []
        });
        
        await gamification.save();
      }
      
      return gamification;
    } catch (error) {
      throw new Error(`Gamification initialization failed: ${error.message}`);
    }
  }

  async awardXP(userId, action, metadata = {}) {
    try {
      const gamification = await this.initializeGamification(userId);
      const xpAmount = this.xpRewards[action] || 0;
      
      if (xpAmount === 0) return null;

      const result = gamification.addXP(xpAmount, action);
      
      // Check for achievements
      const newAchievements = await this.checkAchievements(gamification, action, metadata);
      
      // Update streaks
      if (['assessment_complete', 'daily_login', 'learning'].includes(action)) {
        const streakType = action === 'daily_login' ? 'daily_login' : 'assessment';
        gamification.updateStreak(streakType);
      }

      await gamification.save();

      return {
        ...result,
        newAchievements,
        currentStreak: this.getCurrentStreak(gamification, 'assessment')
      };
    } catch (error) {
      throw new Error(`XP award failed: ${error.message}`);
    }
  }

  async checkAchievements(gamification, action, metadata) {
    const newAchievements = [];
    
    for (const [achievementId, achievement] of Object.entries(this.achievements)) {
      const existing = gamification.achievements.find(a => a.id === achievementId);
      
      if (existing) continue; // Already unlocked
      
      let progress = 0;
      let shouldUnlock = false;

      switch (achievement.trigger) {
        case 'assessment_complete':
          progress = gamification.stats.assessmentsCompleted + 1;
          shouldUnlock = progress >= achievement.target;
          break;
        case 'perfect_score':
          if (metadata.score === 100) {
            progress = achievement.target;
            shouldUnlock = true;
          }
          break;
        case 'streak':
          const streak = this.getCurrentStreak(gamification, 'assessment');
          progress = streak.current;
          shouldUnlock = progress >= achievement.target;
          break;
        case 'skills_mastered':
          progress = gamification.skillMastery.filter(s => s.masteryPercentage >= 80).length;
          shouldUnlock = progress >= achievement.target;
          break;
      }

      if (shouldUnlock) {
        const newAchievement = {
          id: achievementId,
          name: achievement.name,
          description: achievement.description,
          icon: achievement.icon,
          rarity: achievement.rarity,
          progress: { current: progress, target: achievement.target }
        };
        
        gamification.achievements.push(newAchievement);
        newAchievements.push(newAchievement);
      }
    }

    return newAchievements;
  }

  async updateSkillMastery(userId, skill, newScore) {
    try {
      const gamification = await this.initializeGamification(userId);
      
      let skillMastery = gamification.skillMastery.find(s => s.skill === skill);
      
      if (!skillMastery) {
        skillMastery = {
          skill,
          level: 1,
          xp: 0,
          tier: 'bronze',
          masteryPercentage: 0
        };
        gamification.skillMastery.push(skillMastery);
      }

      // Calculate XP gain based on score improvement
      const oldScore = skillMastery.masteryPercentage;
      const improvement = Math.max(0, newScore - oldScore);
      const xpGain = Math.round(improvement * 2);

      skillMastery.xp += xpGain;
      skillMastery.masteryPercentage = newScore;
      skillMastery.level = Math.floor(skillMastery.xp / 100) + 1;
      skillMastery.tier = this.calculateSkillTier(skillMastery.level);

      // Award badge if mastery threshold reached
      if (newScore >= 80 && oldScore < 80) {
        await this.awardSkillBadge(gamification, skill);
      }

      await gamification.save();
      return skillMastery;
    } catch (error) {
      throw new Error(`Skill mastery update failed: ${error.message}`);
    }
  }

  calculateSkillTier(level) {
    if (level >= 50) return 'diamond';
    if (level >= 30) return 'platinum';
    if (level >= 20) return 'gold';
    if (level >= 10) return 'silver';
    return 'bronze';
  }

  async awardSkillBadge(gamification, skill) {
    const badgeKey = `${skill.toLowerCase().replace(/[^a-z0-9]/g, '_')}_master`;
    const badge = this.badges[badgeKey] || {
      name: `${skill} Master`,
      category: 'Technical',
      rarity: 'rare'
    };

    const existingBadge = gamification.badges.find(b => b.id === badgeKey);
    if (!existingBadge) {
      gamification.badges.push({
        id: badgeKey,
        ...badge
      });
    }
  }

  getCurrentStreak(gamification, type) {
    const streak = gamification.streaks.find(s => s.type === type);
    return streak || { type, current: 0, longest: 0 };
  }

  async getLeaderboard(category = 'global', limit = 100) {
    try {
      const pipeline = [
        { $match: {} },
        { $sort: { totalXP: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        {
          $project: {
            user: { $arrayElemAt: ['$userInfo.name', 0] },
            totalXP: 1,
            level: 1,
            rank: 1,
            badges: { $size: '$badges' },
            achievements: { $size: '$achievements' }
          }
        }
      ];

      const leaderboard = await Gamification.aggregate(pipeline);
      
      // Add rank numbers
      leaderboard.forEach((entry, index) => {
        entry.position = index + 1;
      });

      return leaderboard;
    } catch (error) {
      throw new Error(`Leaderboard generation failed: ${error.message}`);
    }
  }

  async getUserRanking(userId) {
    try {
      const userGamification = await Gamification.findOne({ user: userId });
      if (!userGamification) return null;

      const totalUsers = await Gamification.countDocuments({});
      const usersAbove = await Gamification.countDocuments({
        totalXP: { $gt: userGamification.totalXP }
      });

      const rank = usersAbove + 1;
      const percentile = Math.round(((totalUsers - rank) / totalUsers) * 100);

      return {
        rank,
        totalUsers,
        percentile,
        level: userGamification.level,
        totalXP: userGamification.totalXP,
        nextLevelXP: userGamification.nextLevelXP,
        currentLevelXP: userGamification.currentLevelXP
      };
    } catch (error) {
      throw new Error(`User ranking calculation failed: ${error.message}`);
    }
  }

  async getGamificationSummary(userId) {
    try {
      const gamification = await this.initializeGamification(userId);
      const ranking = await this.getUserRanking(userId);
      
      return {
        level: gamification.level,
        totalXP: gamification.totalXP,
        currentLevelXP: gamification.currentLevelXP,
        nextLevelXP: gamification.nextLevelXP,
        achievements: gamification.achievements.length,
        badges: gamification.badges.length,
        streaks: gamification.streaks,
        skillMastery: gamification.skillMastery,
        ranking,
        recentAchievements: gamification.achievements
          .sort((a, b) => new Date(b.unlockedAt) - new Date(a.unlockedAt))
          .slice(0, 3)
      };
    } catch (error) {
      throw new Error(`Gamification summary failed: ${error.message}`);
    }
  }
}

module.exports = new GamificationAgent();