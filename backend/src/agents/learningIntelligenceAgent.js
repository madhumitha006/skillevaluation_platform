const logger = require('../config/logger');
const Course = require('../models/Course');

class LearningIntelligenceAgent {
  constructor() {
    this.skillLevels = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3
    };
  }

  async detectSkillGaps(userSkills, targetSkills) {
    try {
      const gaps = [];
      
      for (const targetSkill of targetSkills) {
        const userSkill = userSkills.find(s => s.skill === targetSkill.skill);
        const currentLevel = userSkill ? userSkill.level : 0;
        const targetLevel = targetSkill.level;
        
        if (currentLevel < targetLevel) {
          const gap = targetLevel - currentLevel;
          gaps.push({
            skill: targetSkill.skill,
            currentLevel,
            targetLevel,
            priority: this.calculatePriority(gap, targetSkill.importance || 1),
          });
        }
      }
      
      return gaps.sort((a, b) => this.getPriorityWeight(b.priority) - this.getPriorityWeight(a.priority));
    } catch (error) {
      logger.error(`Error detecting skill gaps: ${error.message}`);
      throw error;
    }
  }

  calculatePriority(gap, importance) {
    const score = gap * importance;
    if (score >= 3) return 'critical';
    if (score >= 2) return 'high';
    if (score >= 1) return 'medium';
    return 'low';
  }

  getPriorityWeight(priority) {
    const weights = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    return weights[priority] || 1;
  }

  async generateLearningPath(skillGaps, userPreferences = {}) {
    try {
      const courses = [];
      const processedSkills = new Set();
      
      for (const gap of skillGaps) {
        if (processedSkills.has(gap.skill)) continue;
        
        const skillCourses = await this.findCoursesForSkill(gap.skill, gap.currentLevel, gap.targetLevel);
        courses.push(...skillCourses);
        processedSkills.add(gap.skill);
      }
      
      // Remove duplicates and sort by difficulty and dependencies
      const uniqueCourses = this.removeDuplicateCourses(courses);
      const orderedCourses = this.orderCoursesByDependencies(uniqueCourses);
      
      return {
        courses: orderedCourses.map((course, index) => ({
          courseId: course._id,
          order: index + 1,
          status: 'not-started',
          progress: 0,
        })),
        estimatedDuration: this.calculateTotalDuration(orderedCourses),
        difficulty: this.calculateOverallDifficulty(orderedCourses),
      };
    } catch (error) {
      logger.error(`Error generating learning path: ${error.message}`);
      throw error;
    }
  }

  async findCoursesForSkill(skill, currentLevel, targetLevel) {
    try {
      const difficulties = [];
      
      if (currentLevel === 0) difficulties.push('beginner');
      if (currentLevel <= 1 && targetLevel >= 2) difficulties.push('intermediate');
      if (currentLevel <= 2 && targetLevel >= 3) difficulties.push('advanced');
      
      const courses = await Course.find({
        skills: { $in: [skill] },
        difficulty: { $in: difficulties },
        isPublished: true,
      }).sort({ difficulty: 1 });
      
      return courses;
    } catch (error) {
      logger.error(`Error finding courses for skill ${skill}: ${error.message}`);
      return [];
    }
  }

  removeDuplicateCourses(courses) {
    const seen = new Set();
    return courses.filter(course => {
      if (seen.has(course._id.toString())) return false;
      seen.add(course._id.toString());
      return true;
    });
  }

  orderCoursesByDependencies(courses) {
    // Simple ordering by difficulty for now
    const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
    return courses.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
  }

  calculateTotalDuration(courses) {
    return courses.reduce((total, course) => total + (course.totalDuration || 0), 0);
  }

  calculateOverallDifficulty(courses) {
    if (courses.length === 0) return 'beginner';
    
    const difficulties = courses.map(c => this.skillLevels[c.difficulty] || 1);
    const avgDifficulty = difficulties.reduce((sum, d) => sum + d, 0) / difficulties.length;
    
    if (avgDifficulty >= 2.5) return 'advanced';
    if (avgDifficulty >= 1.5) return 'intermediate';
    return 'beginner';
  }

  generateQuiz(topic, difficulty = 'medium', questionCount = 5) {
    try {
      const questionBank = this.getQuestionBank(topic, difficulty);
      const selectedQuestions = this.selectRandomQuestions(questionBank, questionCount);
      
      return selectedQuestions.map((q, index) => ({
        id: `q_${Date.now()}_${index}`,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty,
        topic,
      }));
    } catch (error) {
      logger.error(`Error generating quiz: ${error.message}`);
      throw error;
    }
  }

  getQuestionBank(topic, difficulty) {
    // Simplified question bank - in production, this would be much larger
    const questions = {
      javascript: {
        beginner: [
          {
            question: "What is the correct way to declare a variable in JavaScript?",
            options: ["var x = 5;", "variable x = 5;", "v x = 5;", "declare x = 5;"],
            correctAnswer: 0,
            explanation: "The 'var' keyword is used to declare variables in JavaScript."
          },
          {
            question: "Which method is used to add an element to the end of an array?",
            options: ["push()", "add()", "append()", "insert()"],
            correctAnswer: 0,
            explanation: "The push() method adds elements to the end of an array."
          }
        ],
        medium: [
          {
            question: "What is a closure in JavaScript?",
            options: [
              "A function that has access to variables in its outer scope",
              "A way to close a program",
              "A type of loop",
              "A method to hide variables"
            ],
            correctAnswer: 0,
            explanation: "A closure gives you access to an outer function's scope from an inner function."
          }
        ]
      }
    };
    
    return questions[topic.toLowerCase()]?.[difficulty] || [];
  }

  selectRandomQuestions(questions, count) {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  calculateSpacedRepetition(difficulty, reviewCount) {
    // SM-2 algorithm simplified
    const intervals = [1, 6, 1, 6]; // days
    const easeFactor = Math.max(1.3, difficulty + (0.1 - (5 - difficulty) * (0.08 + (5 - difficulty) * 0.02)));
    
    let interval;
    if (reviewCount === 0) {
      interval = 1;
    } else if (reviewCount === 1) {
      interval = 6;
    } else {
      interval = Math.round(intervals[Math.min(reviewCount - 1, intervals.length - 1)] * easeFactor);
    }
    
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);
    
    return {
      nextReviewDate,
      newDifficulty: easeFactor,
    };
  }

  calculateXPReward(moduleType, difficulty, performance = 1) {
    const baseXP = {
      'video': 10,
      'text': 8,
      'quiz': 15,
      'coding': 25,
    };
    
    const difficultyMultiplier = {
      'beginner': 1,
      'intermediate': 1.5,
      'advanced': 2,
    };
    
    const base = baseXP[moduleType] || 10;
    const multiplier = difficultyMultiplier[difficulty] || 1;
    
    return Math.round(base * multiplier * performance);
  }

  checkAchievements(userStats, currentAchievements) {
    const achievements = [
      {
        id: 'first_course',
        name: 'Getting Started',
        description: 'Complete your first course',
        target: 1,
        check: (stats) => stats.coursesCompleted >= 1,
        xpReward: 50,
      },
      {
        id: 'quiz_master',
        name: 'Quiz Master',
        description: 'Complete 10 quizzes',
        target: 10,
        check: (stats) => stats.quizzesCompleted >= 10,
        xpReward: 100,
      },
      {
        id: 'coding_ninja',
        name: 'Coding Ninja',
        description: 'Complete 5 coding challenges',
        target: 5,
        check: (stats) => stats.codingChallengesCompleted >= 5,
        xpReward: 150,
      },
    ];
    
    const newAchievements = [];
    
    for (const achievement of achievements) {
      const existing = currentAchievements.find(a => a.id === achievement.id);
      if (!existing && achievement.check(userStats)) {
        newAchievements.push({
          ...achievement,
          completed: true,
          completedAt: new Date(),
        });
      }
    }
    
    return newAchievements;
  }
}

module.exports = LearningIntelligenceAgent;