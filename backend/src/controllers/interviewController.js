const Interview = require('../models/Interview');
const InterviewIntelligenceAgent = require('../agents/interviewIntelligenceAgent');
const ApiResponse = require('../utils/ApiResponse');
const logger = require('../config/logger');

class InterviewController {
  constructor() {
    this.intelligenceAgent = new InterviewIntelligenceAgent();
  }

  async createInterview(req, res) {
    try {
      const { title, skills, difficulty = 'medium' } = req.body;
      const userId = req.user.id;

      // Generate questions using AI agent
      const questions = this.intelligenceAgent.generateQuestions(skills, difficulty, 5);

      const interview = new Interview({
        userId,
        title,
        skills,
        difficulty,
        questions,
        status: 'pending'
      });

      await interview.save();
      logger.info(`Interview created: ${interview._id} for user: ${userId}`);

      return ApiResponse.created(res, interview, 'Interview created successfully');
    } catch (error) {
      logger.error(`Create interview error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to create interview', 500);
    }
  }

  async startInterview(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return ApiResponse.error(res, 'Interview not found', 404);
      }

      interview.status = 'in-progress';
      interview.startedAt = new Date();
      await interview.save();

      logger.info(`Interview started: ${interviewId}`);
      return ApiResponse.success(res, interview, 'Interview started successfully');
    } catch (error) {
      logger.error(`Start interview error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to start interview', 500);
    }
  }

  async submitResponse(req, res) {
    try {
      const { interviewId } = req.params;
      const { questionId, answer, transcript, responseTime } = req.body;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return ApiResponse.error(res, 'Interview not found', 404);
      }

      // Calculate confidence and sentiment
      const confidence = this.intelligenceAgent.calculateConfidenceScore(transcript, responseTime);
      const sentiment = this.intelligenceAgent.analyzeSentiment(transcript);

      const response = {
        questionId,
        answer,
        transcript,
        confidence,
        sentiment,
        responseTime,
        submittedAt: new Date()
      };

      interview.responses.push(response);
      await interview.save();

      // Check if we need to adjust difficulty for next questions
      const avgConfidence = interview.responses.reduce((sum, r) => sum + r.confidence, 0) / interview.responses.length;
      const newDifficulty = this.intelligenceAgent.adjustDifficulty(interview.difficulty, avgConfidence);
      
      if (newDifficulty !== interview.difficulty) {
        interview.difficulty = newDifficulty;
        await interview.save();
        logger.info(`Difficulty adjusted to ${newDifficulty} for interview: ${interviewId}`);
      }

      logger.info(`Response submitted for interview: ${interviewId}, question: ${questionId}`);
      return ApiResponse.success(res, { confidence, sentiment, newDifficulty }, 'Response submitted successfully');
    } catch (error) {
      logger.error(`Submit response error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to submit response', 500);
    }
  }

  async completeInterview(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return ApiResponse.error(res, 'Interview not found', 404);
      }

      interview.status = 'completed';
      interview.completedAt = new Date();
      interview.duration = interview.completedAt - interview.startedAt;

      // Generate evaluation report
      const evaluation = this.intelligenceAgent.generateEvaluationReport(interview);
      interview.evaluation = evaluation;

      await interview.save();

      logger.info(`Interview completed: ${interviewId}`);
      return ApiResponse.success(res, { interview, evaluation }, 'Interview completed successfully');
    } catch (error) {
      logger.error(`Complete interview error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to complete interview', 500);
    }
  }

  async getInterview(req, res) {
    try {
      const { interviewId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return ApiResponse.error(res, 'Interview not found', 404);
      }

      return ApiResponse.success(res, interview, 'Interview retrieved successfully');
    } catch (error) {
      logger.error(`Get interview error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to retrieve interview', 500);
    }
  }

  async getUserInterviews(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const query = { userId };
      if (status) query.status = status;

      const interviews = await Interview.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Interview.countDocuments(query);

      return ApiResponse.success(res, {
        interviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }, 'Interviews retrieved successfully');
    } catch (error) {
      logger.error(`Get user interviews error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to retrieve interviews', 500);
    }
  }

  async getFollowUpQuestion(req, res) {
    try {
      const { interviewId, questionId } = req.params;
      const userId = req.user.id;

      const interview = await Interview.findOne({ _id: interviewId, userId });
      if (!interview) {
        return ApiResponse.error(res, 'Interview not found', 404);
      }

      const question = interview.questions.find(q => q.id === questionId);
      if (!question) {
        return ApiResponse.error(res, 'Question not found', 404);
      }

      const followUpQuestions = question.followUp || [];
      const randomFollowUp = followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)];

      return ApiResponse.success(res, { followUpQuestion: randomFollowUp }, 'Follow-up question retrieved');
    } catch (error) {
      logger.error(`Get follow-up question error: ${error.message}`);
      return ApiResponse.error(res, 'Failed to get follow-up question', 500);
    }
  }
}

module.exports = new InterviewController();