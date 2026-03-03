class AdaptiveTestAgent {
  constructor() {
    this.questionBank = {
      JavaScript: {
        easy: [
          { question: 'What is a variable in JavaScript?', type: 'multiple-choice', options: ['A storage container', 'A function', 'A loop', 'An object'], answer: 0, points: 10 },
          { question: 'How do you declare a constant?', type: 'multiple-choice', options: ['var', 'let', 'const', 'define'], answer: 2, points: 10 },
          { question: 'What does console.log() do?', type: 'multiple-choice', options: ['Prints to console', 'Creates variable', 'Defines function', 'Loops array'], answer: 0, points: 10 },
        ],
        medium: [
          { question: 'Explain closures in JavaScript', type: 'text', keywords: ['function', 'scope', 'lexical'], points: 20 },
          { question: 'What is the difference between == and ===?', type: 'multiple-choice', options: ['No difference', 'Type coercion', 'Performance', 'Syntax'], answer: 1, points: 20 },
          { question: 'How does async/await work?', type: 'text', keywords: ['promise', 'asynchronous', 'await'], points: 20 },
        ],
        hard: [
          { question: 'Implement a debounce function', type: 'code', testCases: [], points: 30 },
          { question: 'Explain event loop and microtasks', type: 'text', keywords: ['callback', 'promise', 'queue', 'stack'], points: 30 },
          { question: 'Implement a deep clone function', type: 'code', testCases: [], points: 30 },
        ],
      },
      Python: {
        easy: [
          { question: 'What is a list in Python?', type: 'multiple-choice', options: ['Ordered collection', 'Dictionary', 'Set', 'Tuple'], answer: 0, points: 10 },
          { question: 'How do you create a function?', type: 'multiple-choice', options: ['def name():', 'function name():', 'func name():', 'create name():'], answer: 0, points: 10 },
        ],
        medium: [
          { question: 'Explain list comprehension', type: 'text', keywords: ['syntax', 'iteration', 'filter'], points: 20 },
          { question: 'What are decorators?', type: 'text', keywords: ['function', 'wrapper', 'syntax'], points: 20 },
        ],
        hard: [
          { question: 'Implement a decorator for caching', type: 'code', testCases: [], points: 30 },
          { question: 'Explain metaclasses', type: 'text', keywords: ['class', 'type', 'creation'], points: 30 },
        ],
      },
    };

    // Difficulty scoring thresholds
    this.difficultyScores = {
      easy: { min: 0, max: 40, basePoints: 10 },
      medium: { min: 40, max: 75, basePoints: 20 },
      hard: { min: 75, max: 100, basePoints: 30 },
    };

    // Adaptive parameters
    this.adaptiveConfig = {
      streakThreshold: 3,
      fastResponseTime: 30, // seconds
      slowResponseTime: 120, // seconds
      confidenceWeight: 0.3,
      streakWeight: 0.4,
      timeWeight: 0.3,
    };
  }

  async generateTest(skills, userPerformance = {}) {
    const questions = [];
    
    for (const skill of skills) {
      if (this.questionBank[skill]) {
        const difficulty = this._determineDifficulty(skill, userPerformance);
        const skillQuestions = this._selectQuestions(skill, difficulty, 3);
        questions.push(...skillQuestions);
      }
    }

    return {
      testId: this._generateTestId(),
      questions,
      totalQuestions: questions.length,
      estimatedDuration: questions.length * 5,
      adaptiveLevel: this._getAverageLevel(userPerformance),
      adaptiveState: {
        currentDifficulty: 'medium',
        correctStreak: 0,
        incorrectStreak: 0,
        averageResponseTime: 0,
        adjustmentHistory: [],
      },
    };
  }

  calculateDifficultyScore(responseData) {
    const { correct, responseTime, confidence, streak, pastPerformance } = responseData;
    
    // Streak factor (-1 to 1)
    const streakFactor = this._calculateStreakFactor(streak);
    
    // Time factor (-1 to 1)
    const timeFactor = this._calculateTimeFactor(responseTime);
    
    // Confidence factor (0 to 1)
    const confidenceFactor = (confidence || 50) / 100;
    
    // Past performance factor (0 to 1)
    const performanceFactor = (pastPerformance || 50) / 100;
    
    // Weighted score
    const score = (
      streakFactor * this.adaptiveConfig.streakWeight +
      timeFactor * this.adaptiveConfig.timeWeight +
      confidenceFactor * this.adaptiveConfig.confidenceWeight
    );
    
    return {
      score,
      streakFactor,
      timeFactor,
      confidenceFactor,
      performanceFactor,
      recommendation: this._getDifficultyRecommendation(score, correct),
    };
  }

  async adjustDifficulty(adaptiveState, responseData) {
    const { correct, responseTime, confidence } = responseData;
    
    // Update streaks
    if (correct) {
      adaptiveState.correctStreak++;
      adaptiveState.incorrectStreak = 0;
    } else {
      adaptiveState.incorrectStreak++;
      adaptiveState.correctStreak = 0;
    }
    
    // Calculate difficulty score
    const difficultyScore = this.calculateDifficultyScore({
      correct,
      responseTime,
      confidence,
      streak: { correct: adaptiveState.correctStreak, incorrect: adaptiveState.incorrectStreak },
      pastPerformance: adaptiveState.averageScore || 50,
    });
    
    // Determine new difficulty
    const oldDifficulty = adaptiveState.currentDifficulty;
    const newDifficulty = this._selectNewDifficulty(oldDifficulty, difficultyScore);
    
    // Record adjustment
    const adjustment = {
      timestamp: new Date(),
      oldDifficulty,
      newDifficulty,
      reason: this._getAdjustmentReason(difficultyScore, correct),
      difficultyScore: difficultyScore.score,
      correctStreak: adaptiveState.correctStreak,
      incorrectStreak: adaptiveState.incorrectStreak,
    };
    
    adaptiveState.currentDifficulty = newDifficulty;
    adaptiveState.adjustmentHistory.push(adjustment);
    
    return {
      newDifficulty,
      adjusted: oldDifficulty !== newDifficulty,
      adjustment,
      nextQuestionDifficulty: newDifficulty,
      feedback: this._generateFeedback(adjustment),
    };
  }

  getNextQuestion(skill, difficulty, usedQuestionIds = []) {
    const questions = this.questionBank[skill]?.[difficulty] || [];
    const available = questions.filter(q => {
      const qId = `${skill}_${difficulty}_${questions.indexOf(q)}`;
      return !usedQuestionIds.includes(qId);
    });
    
    if (available.length === 0) return null;
    
    const question = available[Math.floor(Math.random() * available.length)];
    const qId = `${skill}_${difficulty}_${questions.indexOf(question)}`;
    
    return {
      id: qId,
      skill,
      difficulty,
      ...question,
    };
  }

  calculateFinalScore(responses, adaptiveState) {
    let totalPoints = 0;
    let earnedPoints = 0;
    
    responses.forEach(response => {
      const questionDifficulty = response.difficulty || 'medium';
      const basePoints = this.difficultyScores[questionDifficulty].basePoints;
      
      totalPoints += basePoints;
      if (response.correct) {
        // Bonus for fast response
        const timeBonus = response.responseTime < this.adaptiveConfig.fastResponseTime ? 1.2 : 1.0;
        earnedPoints += basePoints * timeBonus;
      }
    });
    
    const rawScore = (earnedPoints / totalPoints) * 100;
    
    // Normalize score based on difficulty distribution
    const normalizedScore = this._normalizeScore(rawScore, adaptiveState);
    
    return {
      rawScore: Math.round(rawScore),
      normalizedScore: Math.round(normalizedScore),
      totalPoints,
      earnedPoints: Math.round(earnedPoints),
      difficultyDistribution: this._getDifficultyDistribution(responses),
      adaptiveMetrics: {
        averageDifficulty: this._getAverageDifficulty(responses),
        adjustmentCount: adaptiveState.adjustmentHistory.length,
        finalDifficulty: adaptiveState.currentDifficulty,
      },
    };
  }

  _calculateStreakFactor(streak) {
    const { correct, incorrect } = streak;
    
    if (correct >= this.adaptiveConfig.streakThreshold) {
      return Math.min(1, correct / (this.adaptiveConfig.streakThreshold * 2));
    }
    if (incorrect >= this.adaptiveConfig.streakThreshold) {
      return Math.max(-1, -incorrect / (this.adaptiveConfig.streakThreshold * 2));
    }
    return 0;
  }

  _calculateTimeFactor(responseTime) {
    if (responseTime < this.adaptiveConfig.fastResponseTime) {
      return 0.5; // Fast response suggests easier question
    }
    if (responseTime > this.adaptiveConfig.slowResponseTime) {
      return -0.5; // Slow response suggests harder question
    }
    return 0;
  }

  _getDifficultyRecommendation(score, correct) {
    if (!correct) return 'maintain';
    
    if (score > 0.5) return 'increase';
    if (score < -0.5) return 'decrease';
    return 'maintain';
  }

  _selectNewDifficulty(currentDifficulty, difficultyScore) {
    const recommendation = difficultyScore.recommendation;
    
    if (recommendation === 'increase') {
      if (currentDifficulty === 'easy') return 'medium';
      if (currentDifficulty === 'medium') return 'hard';
      return 'hard';
    }
    
    if (recommendation === 'decrease') {
      if (currentDifficulty === 'hard') return 'medium';
      if (currentDifficulty === 'medium') return 'easy';
      return 'easy';
    }
    
    return currentDifficulty;
  }

  _getAdjustmentReason(difficultyScore, correct) {
    if (!correct) {
      return 'Incorrect answer - maintaining difficulty for reinforcement';
    }
    
    const { streakFactor, timeFactor, score } = difficultyScore;
    
    if (score > 0.5) {
      if (streakFactor > 0.5) return 'Strong correct streak - increasing difficulty';
      if (timeFactor > 0) return 'Fast response time - increasing difficulty';
      return 'Consistent performance - increasing difficulty';
    }
    
    if (score < -0.5) {
      return 'Struggling with current level - decreasing difficulty';
    }
    
    return 'Performance stable - maintaining difficulty';
  }

  _generateFeedback(adjustment) {
    const { oldDifficulty, newDifficulty, reason, correctStreak } = adjustment;
    
    if (oldDifficulty === newDifficulty) {
      return {
        message: 'Keep going! You\'re doing well at this level.',
        type: 'maintain',
        icon: '👍',
      };
    }
    
    if (newDifficulty === 'hard' && oldDifficulty === 'medium') {
      return {
        message: `Excellent! ${correctStreak} correct in a row. Moving to harder questions.`,
        type: 'increase',
        icon: '🚀',
      };
    }
    
    if (newDifficulty === 'medium' && oldDifficulty === 'easy') {
      return {
        message: 'Great progress! Advancing to medium difficulty.',
        type: 'increase',
        icon: '📈',
      };
    }
    
    if (newDifficulty === 'easy') {
      return {
        message: 'Let\'s reinforce the fundamentals.',
        type: 'decrease',
        icon: '🎯',
      };
    }
    
    return {
      message: reason,
      type: 'adjust',
      icon: '⚡',
    };
  }

  _normalizeScore(rawScore, adaptiveState) {
    // Adjust score based on difficulty progression
    const adjustments = adaptiveState.adjustmentHistory || [];
    const difficultyProgression = adjustments.filter(a => a.newDifficulty !== a.oldDifficulty).length;
    
    // Bonus for adaptive progression
    const progressionBonus = Math.min(10, difficultyProgression * 2);
    
    return Math.min(100, rawScore + progressionBonus);
  }

  _getDifficultyDistribution(responses) {
    const distribution = { easy: 0, medium: 0, hard: 0 };
    responses.forEach(r => {
      const diff = r.difficulty || 'medium';
      distribution[diff]++;
    });
    return distribution;
  }

  _getAverageDifficulty(responses) {
    const difficultyValues = { easy: 1, medium: 2, hard: 3 };
    const sum = responses.reduce((acc, r) => acc + (difficultyValues[r.difficulty] || 2), 0);
    return sum / responses.length;
  }

  _determineDifficulty(skill, userPerformance) {
    if (!userPerformance[skill]) return 'easy';

    const score = userPerformance[skill].score || 0;
    
    if (score >= this.difficultyScores.hard.min) return 'hard';
    if (score >= this.difficultyScores.medium.min) return 'medium';
    return 'easy';
  }

  _selectQuestions(skill, difficulty, count) {
    const questions = this.questionBank[skill][difficulty] || [];
    const selected = questions.slice(0, Math.min(count, questions.length));
    
    return selected.map((q, idx) => ({
      id: `${skill}_${difficulty}_${idx}`,
      skill,
      difficulty,
      ...q,
    }));
  }

  _generateTestId() {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  _getAverageLevel(userPerformance) {
    const levels = Object.values(userPerformance).map(p => p.level || 'easy');
    if (levels.length === 0) return 'easy';
    
    const levelScores = { easy: 1, medium: 2, hard: 3 };
    const avgScore = levels.reduce((sum, level) => sum + levelScores[level], 0) / levels.length;
    
    if (avgScore >= 2.5) return 'hard';
    if (avgScore >= 1.5) return 'medium';
    return 'easy';
  }
}

module.exports = new AdaptiveTestAgent();
