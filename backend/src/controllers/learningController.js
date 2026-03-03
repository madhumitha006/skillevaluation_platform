const Course = require('../models/Course');
const LearningPath = require('../models/LearningPath');
const UserProgress = require('../models/UserProgress');
const Gamification = require('../models/Gamification');
const LearningIntelligenceAgent = require('../agents/learningIntelligenceAgent');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../config/logger');

class LearningController {
  constructor() {
    this.intelligenceAgent = new LearningIntelligenceAgent();
  }

  async getCourses(req, res) {
    try {
      const { category, difficulty, skills, page = 1, limit = 12 } = req.query;
      
      const query = { isPublished: true };
      if (category) query.category = category;
      if (difficulty) query.difficulty = difficulty;
      if (skills) query.skills = { $in: skills.split(',') };
      
      const courses = await Course.find(query)
        .populate('createdBy', 'name')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      
      const total = await Course.countDocuments(query);
      
      return ApiResponse.success(res, {
        courses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error(`Get courses error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to fetch courses', 500);
    }
  }

  async getCourse(req, res) {
    try {
      const { courseId } = req.params;
      const userId = req.user.id;
      
      const course = await Course.findById(courseId).populate('createdBy', 'name');
      if (!course) {
        return ApiResponse.error(res, 'Course not found', 404);
      }
      
      // Get user progress for this course
      const progress = await UserProgress.findOne({ userId, courseId });
      
      return ApiResponse.success(res, { course, progress });
    } catch (error) {
      logger.error(`Get course error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to fetch course', 500);
    }
  }

  async generateLearningPath(req, res) {
    try {
      const { targetSkills, currentSkills } = req.body;
      const userId = req.user.id;
      
      // Detect skill gaps
      const skillGaps = await this.intelligenceAgent.detectSkillGaps(currentSkills, targetSkills);
      
      // Generate learning path
      const pathData = await this.intelligenceAgent.generateLearningPath(skillGaps);
      
      // Create learning path
      const learningPath = new LearningPath({
        userId,
        title: `Personalized Learning Path - ${new Date().toLocaleDateString()}`,
        targetSkills: targetSkills.map(s => s.skill),
        skillGaps,
        courses: pathData.courses,
        estimatedDuration: pathData.estimatedDuration,
        difficulty: pathData.difficulty,
        lastUpdated: new Date(),
      });
      
      await learningPath.save();
      await learningPath.populate('courses.courseId');
      
      logger.info(`Learning path generated for user: ${userId}`);
      return ApiResponse.success(res, learningPath, 'Learning path generated successfully');
    } catch (error) {
      logger.error(`Generate learning path error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to generate learning path', 500);
    }
  }

  async getUserLearningPaths(req, res) {
    try {
      const userId = req.user.id;
      
      const learningPaths = await LearningPath.find({ userId })
        .populate('courses.courseId', 'title description difficulty totalDuration')
        .sort({ createdAt: -1 });
      
      return ApiResponse.success(res, learningPaths);
    } catch (error) {
      logger.error(`Get learning paths error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to fetch learning paths', 500);
    }
  }

  async startModule(req, res) {
    try {
      const { courseId, moduleId } = req.params;
      const userId = req.user.id;
      
      let progress = await UserProgress.findOne({ userId, courseId });
      if (!progress) {
        progress = new UserProgress({
          userId,
          courseId,
          moduleProgress: [],
          status: 'in-progress',
          startedAt: new Date(),
        });
      }
      
      const moduleProgress = progress.moduleProgress.find(m => m.moduleId === moduleId);
      if (moduleProgress) {
        moduleProgress.status = 'in-progress';
        moduleProgress.lastAccessed = new Date();
        if (!moduleProgress.startedAt) {
          moduleProgress.startedAt = new Date();
        }
      } else {
        progress.moduleProgress.push({
          moduleId,
          status: 'in-progress',
          startedAt: new Date(),
          lastAccessed: new Date(),
        });
      }
      
      await progress.save();
      
      return ApiResponse.success(res, progress, 'Module started successfully');
    } catch (error) {
      logger.error(`Start module error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to start module', 500);
    }
  }

  async completeModule(req, res) {
    try {
      const { courseId, moduleId } = req.params;
      const { timeSpent, score } = req.body;
      const userId = req.user.id;
      
      const course = await Course.findById(courseId);
      if (!course) {
        return ApiResponse.error(res, 'Course not found', 404);
      }
      
      const module = course.modules.find(m => m.id === moduleId);
      if (!module) {
        return ApiResponse.error(res, 'Module not found', 404);
      }
      
      let progress = await UserProgress.findOne({ userId, courseId });
      if (!progress) {
        return ApiResponse.error(res, 'Progress not found', 404);
      }
      
      const moduleProgress = progress.moduleProgress.find(m => m.moduleId === moduleId);
      if (moduleProgress) {
        moduleProgress.status = 'completed';
        moduleProgress.completedAt = new Date();
        moduleProgress.timeSpent = (moduleProgress.timeSpent || 0) + timeSpent;
        moduleProgress.score = score;
      }
      
      // Calculate overall progress
      const completedModules = progress.moduleProgress.filter(m => m.status === 'completed').length;
      progress.overallProgress = (completedModules / course.modules.length) * 100;
      progress.totalTimeSpent = (progress.totalTimeSpent || 0) + timeSpent;
      
      // Award XP
      const xpReward = this.intelligenceAgent.calculateXPReward(module.type, course.difficulty, score || 1);
      progress.xpEarned = (progress.xpEarned || 0) + xpReward;
      
      // Update gamification
      await this.updateGamification(userId, {
        xpGained: xpReward,
        moduleCompleted: true,
        moduleType: module.type,
        timeSpent,
      });
      
      // Check if course is completed
      if (progress.overallProgress === 100) {
        progress.status = 'completed';
        progress.completedAt = new Date();
        
        await this.updateGamification(userId, {
          courseCompleted: true,
        });
      }
      
      await progress.save();
      
      return ApiResponse.success(res, { progress, xpReward }, 'Module completed successfully');
    } catch (error) {
      logger.error(`Complete module error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to complete module', 500);
    }
  }

  async generateQuiz(req, res) {
    try {
      const { topic, difficulty = 'medium', questionCount = 5 } = req.body;
      
      const quiz = this.intelligenceAgent.generateQuiz(topic, difficulty, questionCount);
      
      return ApiResponse.success(res, quiz, 'Quiz generated successfully');
    } catch (error) {
      logger.error(`Generate quiz error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to generate quiz', 500);
    }
  }

  async getUserProgress(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      
      const progress = await UserProgress.findOne({ userId, courseId })
        .populate('courseId', 'title modules');
      
      if (!progress) {
        return ApiResponse.error(res, 'Progress not found', 404);
      }
      
      return ApiResponse.success(res, progress);
    } catch (error) {
      logger.error(`Get user progress error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to fetch progress', 500);
    }
  }

  async getGamificationData(req, res) {
    try {
      const userId = req.user.id;
      
      let gamification = await Gamification.findOne({ userId });
      if (!gamification) {
        gamification = new Gamification({ userId });
        await gamification.save();
      }
      
      return ApiResponse.success(res, gamification);
    } catch (error) {
      logger.error(`Get gamification data error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to fetch gamification data', 500);
    }
  }

  async getRevisionItems(req, res) {
    try {
      const userId = req.user.id;
      const today = new Date();
      
      const progressItems = await UserProgress.find({
        userId,
        'revisionSchedule.nextReviewDate': { $lte: today }
      }).populate('courseId', 'title modules');
      
      const revisionItems = [];
      for (const progress of progressItems) {
        for (const revision of progress.revisionSchedule) {
          if (revision.nextReviewDate <= today) {
            const module = progress.courseId.modules.find(m => m.id === revision.moduleId);
            if (module) {
              revisionItems.push({
                courseId: progress.courseId._id,
                courseTitle: progress.courseId.title,
                moduleId: revision.moduleId,
                moduleTitle: module.title,
                reviewCount: revision.reviewCount,
                difficulty: revision.difficulty,
              });
            }
          }
        }
      }
      
      return ApiResponse.success(res, revisionItems);
    } catch (error) {
      logger.error(`Get revision items error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to fetch revision items', 500);
    }
  }

  async updateGamification(userId, data) {
    try {
      let gamification = await Gamification.findOne({ userId });
      if (!gamification) {
        gamification = new Gamification({ userId });
      }
      
      // Update XP and level
      if (data.xpGained) {
        gamification.totalXP += data.xpGained;
        gamification.currentLevelXP += data.xpGained;
        
        // Check for level up
        while (gamification.currentLevelXP >= gamification.nextLevelXP) {
          gamification.currentLevelXP -= gamification.nextLevelXP;
          gamification.level += 1;
          gamification.nextLevelXP = Math.floor(gamification.nextLevelXP * 1.2);
        }
      }
      
      // Update stats
      if (data.moduleCompleted) {
        gamification.stats.modulesCompleted += 1;
        if (data.moduleType === 'quiz') {
          gamification.stats.quizzesCompleted += 1;
        } else if (data.moduleType === 'coding') {
          gamification.stats.codingChallengesCompleted += 1;
        }
      }
      
      if (data.courseCompleted) {
        gamification.stats.coursesCompleted += 1;
      }
      
      if (data.timeSpent) {
        gamification.stats.totalStudyTime += data.timeSpent;
      }
      
      // Update streak
      const today = new Date().toDateString();
      const lastActivity = gamification.streaks.lastActivityDate?.toDateString();
      
      if (lastActivity !== today) {
        if (lastActivity === new Date(Date.now() - 86400000).toDateString()) {
          gamification.streaks.current += 1;
        } else {
          gamification.streaks.current = 1;
        }
        
        if (gamification.streaks.current > gamification.streaks.longest) {
          gamification.streaks.longest = gamification.streaks.current;
        }
        
        gamification.streaks.lastActivityDate = new Date();
      }
      
      // Check for new achievements
      const newAchievements = this.intelligenceAgent.checkAchievements(
        gamification.stats,
        gamification.achievements
      );
      
      if (newAchievements.length > 0) {
        gamification.achievements.push(...newAchievements);
        const totalXPFromAchievements = newAchievements.reduce((sum, a) => sum + a.xpReward, 0);
        gamification.totalXP += totalXPFromAchievements;
        gamification.currentLevelXP += totalXPFromAchievements;
      }
      
      await gamification.save();
      return gamification;
    } catch (error) {
      logger.error(`Update gamification error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new LearningController();