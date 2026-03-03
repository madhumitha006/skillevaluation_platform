const skillAnalyzerAgent = require('../agents/skillAnalyzerAgent');
const adaptiveTestAgent = require('../agents/adaptiveTestAgent');
const performanceEvaluatorAgent = require('../agents/performanceEvaluatorAgent');
const careerAdvisorAgent = require('../agents/careerAdvisorAgent');
const SkillProfile = require('../models/SkillProfile');
const Assessment = require('../models/Assessment');
const AppError = require('../utils/AppError');

class AIService {
  async analyzeResume(userId, resumeText) {
    const analysis = await skillAnalyzerAgent.analyzeResume(resumeText);

    const skillProfile = await SkillProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        resumeText,
        extractedSkills: analysis.extractedSkills,
        categorizedSkills: analysis.categorizedSkills,
        proficiencyLevels: analysis.proficiencyEstimate,
        lastAnalyzedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    return {
      profile: skillProfile,
      analysis,
    };
  }

  async generateAdaptiveTest(userId, skills, realtimeService) {
    const skillProfile = await SkillProfile.findOne({ userId });
    const userPerformance = await this._getUserPerformance(userId);

    const test = await adaptiveTestAgent.generateTest(skills, userPerformance);

    const assessment = await Assessment.create({
      userId,
      testId: test.testId,
      skills,
      questions: test.questions,
      status: 'pending',
    });

    // Emit real-time event
    if (realtimeService) {
      await realtimeService.handleTestStarted(userId, {
        assessmentId: assessment._id,
        testId: test.testId,
        skills,
        totalQuestions: test.totalQuestions,
      });
    }

    return {
      assessmentId: assessment._id,
      testId: test.testId,
      questions: test.questions.map(q => ({
        id: q.id,
        skill: q.skill,
        difficulty: q.difficulty,
        type: q.type,
        question: q.question,
        options: q.options,
      })),
      totalQuestions: test.totalQuestions,
      estimatedDuration: test.estimatedDuration,
    };
  }

  async submitTestResponses(assessmentId, responses, realtimeService) {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      throw new AppError('Assessment not found', 404);
    }

    assessment.responses = responses.map(r => ({
      ...r,
      submittedAt: new Date(),
    }));
    assessment.status = 'in-progress';
    await assessment.save();

    const evaluation = await performanceEvaluatorAgent.evaluateTest(
      responses,
      assessment.questions
    );

    const strengthsWeaknesses = await performanceEvaluatorAgent.identifyStrengthsWeaknesses(
      evaluation.results
    );

    assessment.evaluation = evaluation;
    assessment.strengths = strengthsWeaknesses.strengths;
    assessment.weaknesses = strengthsWeaknesses.weaknesses;
    assessment.status = 'completed';
    assessment.completedAt = new Date();
    await assessment.save();

    // Emit real-time event
    if (realtimeService) {
      await realtimeService.handleTestCompleted(assessment.userId.toString(), {
        assessmentId: assessment._id,
        testId: assessment.testId,
        evaluation,
        strengths: strengthsWeaknesses.strengths,
        weaknesses: strengthsWeaknesses.weaknesses,
      });
    }

    return {
      evaluation,
      strengths: strengthsWeaknesses.strengths,
      weaknesses: strengthsWeaknesses.weaknesses,
    };
  }

  async generateCareerRecommendations(userId) {
    const skillProfile = await SkillProfile.findOne({ userId });
    if (!skillProfile) {
      throw new AppError('Skill profile not found. Please analyze your resume first.', 404);
    }

    const assessments = await Assessment.find({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(5);

    const strengths = assessments.length > 0 ? assessments[0].strengths : [];

    const recommendations = await careerAdvisorAgent.recommendCareerPaths(
      skillProfile.extractedSkills,
      strengths
    );

    skillProfile.careerRecommendations = recommendations;
    await skillProfile.save();

    return recommendations;
  }

  async generateLearningRoadmap(userId, targetRole) {
    const skillProfile = await SkillProfile.findOne({ userId });
    if (!skillProfile) {
      throw new AppError('Skill profile not found. Please analyze your resume first.', 404);
    }

    const roadmap = await careerAdvisorAgent.generateLearningRoadmap(
      skillProfile.extractedSkills,
      targetRole
    );

    if (roadmap.error) {
      throw new AppError(roadmap.error, 400);
    }

    skillProfile.learningRoadmap = roadmap;
    await skillProfile.save();

    return roadmap;
  }

  async getCertificationRecommendations(userId, targetRole) {
    const skillProfile = await SkillProfile.findOne({ userId });
    if (!skillProfile) {
      throw new AppError('Skill profile not found', 404);
    }

    return await careerAdvisorAgent.suggestCertifications(
      skillProfile.extractedSkills,
      targetRole
    );
  }

  async getUserSkillProfile(userId) {
    const profile = await SkillProfile.findOne({ userId });
    const assessments = await Assessment.find({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(10);

    return {
      profile,
      recentAssessments: assessments,
      totalAssessments: assessments.length,
    };
  }

  async _getUserPerformance(userId) {
    const assessments = await Assessment.find({ userId, status: 'completed' })
      .sort({ completedAt: -1 })
      .limit(5);

    const performance = {};
    assessments.forEach(assessment => {
      assessment.skills.forEach(skill => {
        if (!performance[skill]) {
          performance[skill] = { score: 0, level: 'beginner', count: 0 };
        }
        if (assessment.evaluation) {
          performance[skill].score += assessment.evaluation.percentage;
          performance[skill].count++;
        }
      });
    });

    Object.keys(performance).forEach(skill => {
      performance[skill].score = performance[skill].score / performance[skill].count;
      performance[skill].level = this._determineLevel(performance[skill].score);
    });

    return performance;
  }

  _determineLevel(score) {
    if (score >= 80) return 'expert';
    if (score >= 50) return 'intermediate';
    return 'beginner';
  }
}

module.exports = new AIService();
