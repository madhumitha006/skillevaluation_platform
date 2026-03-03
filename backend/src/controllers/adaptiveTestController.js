const adaptiveTestAgent = require('../agents/adaptiveTestAgent');
const Assessment = require('../models/Assessment');
const ApiResponse = require('../utils/ApiResponse');

class AdaptiveTestController {
  async submitAnswer(req, res, next) {
    try {
      const { assessmentId } = req.params;
      const { questionId, answer, responseTime, confidence } = req.body;

      const assessment = await Assessment.findById(assessmentId);
      if (!assessment) {
        return res.status(404).json(ApiResponse.error('Assessment not found', 404));
      }

      // Find the question
      const question = assessment.questions.find(q => q.id === questionId);
      if (!question) {
        return res.status(404).json(ApiResponse.error('Question not found', 404));
      }

      // Check if correct
      const correct = this._checkAnswer(question, answer);

      // Get or initialize adaptive state
      if (!assessment.adaptiveState) {
        assessment.adaptiveState = {
          currentDifficulty: 'medium',
          correctStreak: 0,
          incorrectStreak: 0,
          averageResponseTime: 0,
          adjustmentHistory: [],
        };
      }

      // Calculate difficulty adjustment
      const adjustmentResult = await adaptiveTestAgent.adjustDifficulty(
        assessment.adaptiveState,
        {
          correct,
          responseTime,
          confidence,
        }
      );

      // Save response
      assessment.responses.push({
        questionId,
        answer,
        correct,
        responseTime,
        confidence,
        difficulty: question.difficulty,
        submittedAt: new Date(),
      });

      // Update adaptive state
      assessment.adaptiveState = {
        ...assessment.adaptiveState,
        averageResponseTime: this._updateAverageResponseTime(
          assessment.adaptiveState.averageResponseTime,
          responseTime,
          assessment.responses.length
        ),
      };

      await assessment.save();

      // Get next question if needed
      let nextQuestion = null;
      if (assessment.responses.length < assessment.questions.length) {
        const usedQuestionIds = assessment.responses.map(r => r.questionId);
        nextQuestion = adaptiveTestAgent.getNextQuestion(
          question.skill,
          adjustmentResult.newDifficulty,
          usedQuestionIds
        );
      }

      res.json(ApiResponse.success({
        correct,
        adjustment: adjustmentResult.adjusted ? adjustmentResult.adjustment : null,
        feedback: adjustmentResult.feedback,
        nextQuestion,
        progress: {
          answered: assessment.responses.length,
          total: assessment.questions.length,
          correctStreak: assessment.adaptiveState.correctStreak,
          currentDifficulty: assessment.adaptiveState.currentDifficulty,
        },
      }));
    } catch (error) {
      next(error);
    }
  }

  async getAdaptiveMetrics(req, res, next) {
    try {
      const { assessmentId } = req.params;

      const assessment = await Assessment.findById(assessmentId);
      if (!assessment) {
        return res.status(404).json(ApiResponse.error('Assessment not found', 404));
      }

      const metrics = {
        currentDifficulty: assessment.adaptiveState?.currentDifficulty || 'medium',
        correctStreak: assessment.adaptiveState?.correctStreak || 0,
        incorrectStreak: assessment.adaptiveState?.incorrectStreak || 0,
        adjustmentCount: assessment.adaptiveState?.adjustmentHistory?.length || 0,
        averageResponseTime: assessment.adaptiveState?.averageResponseTime || 0,
        difficultyDistribution: this._getDifficultyDistribution(assessment.responses),
        performanceByDifficulty: this._getPerformanceByDifficulty(assessment.responses),
      };

      res.json(ApiResponse.success(metrics));
    } catch (error) {
      next(error);
    }
  }

  _checkAnswer(question, answer) {
    if (question.type === 'multiple-choice') {
      return question.answer === answer;
    }
    if (question.type === 'text') {
      const keywords = question.keywords || [];
      const answerLower = (answer || '').toLowerCase();
      return keywords.some(keyword => answerLower.includes(keyword.toLowerCase()));
    }
    return false;
  }

  _updateAverageResponseTime(currentAvg, newTime, count) {
    return ((currentAvg * (count - 1)) + newTime) / count;
  }

  _getDifficultyDistribution(responses) {
    const distribution = { easy: 0, medium: 0, hard: 0 };
    responses.forEach(r => {
      const diff = r.difficulty || 'medium';
      if (distribution[diff] !== undefined) {
        distribution[diff]++;
      }
    });
    return distribution;
  }

  _getPerformanceByDifficulty(responses) {
    const performance = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
    
    responses.forEach(r => {
      const diff = r.difficulty || 'medium';
      if (performance[diff]) {
        performance[diff].total++;
        if (r.correct) performance[diff].correct++;
      }
    });

    return {
      easy: performance.easy.total > 0 ? Math.round((performance.easy.correct / performance.easy.total) * 100) : 0,
      medium: performance.medium.total > 0 ? Math.round((performance.medium.correct / performance.medium.total) * 100) : 0,
      hard: performance.hard.total > 0 ? Math.round((performance.hard.correct / performance.hard.total) * 100) : 0,
    };
  }
}

module.exports = new AdaptiveTestController();
