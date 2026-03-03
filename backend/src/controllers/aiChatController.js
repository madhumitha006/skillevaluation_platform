const Assessment = require('../models/Assessment');
const SkillProfile = require('../models/SkillProfile');
const ApiResponse = require('../utils/ApiResponse');

class AIChatController {
  async chat(req, res, next) {
    try {
      const { message, context } = req.body;
      const userId = req.user.id;

      const response = await this.generateResponse(message, userId, context);

      res.json(ApiResponse.success({ response }, 'Response generated'));
    } catch (error) {
      next(error);
    }
  }

  async chatStream(req, res, next) {
    try {
      const { message, context } = req.body;
      const userId = req.user.id;

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const response = await this.generateResponse(message, userId, context);
      
      // Simulate streaming
      const words = response.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
        res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async getContext(req, res, next) {
    try {
      const userId = req.user.id;

      const [skillProfile, recentAssessments] = await Promise.all([
        SkillProfile.findOne({ userId }),
        Assessment.find({ userId, status: 'completed' })
          .sort({ completedAt: -1 })
          .limit(5),
      ]);

      res.json(
        ApiResponse.success(
          {
            userId,
            skillProfile,
            recentAssessments,
          },
          'Context retrieved'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async generateResponse(message, userId, context) {
    const lowerMessage = message.toLowerCase();

    // Performance-related queries
    if (lowerMessage.includes('improve') || lowerMessage.includes('better')) {
      return this.getImprovementAdvice(context);
    }

    // Skills-related queries
    if (lowerMessage.includes('skill') || lowerMessage.includes('focus')) {
      return this.getSkillAdvice(context);
    }

    // Performance queries
    if (lowerMessage.includes('performance') || lowerMessage.includes('recent')) {
      return this.getPerformanceSummary(context);
    }

    // Career advice
    if (lowerMessage.includes('career') || lowerMessage.includes('job')) {
      return this.getCareerAdvice(context);
    }

    // Default response
    return `I'm here to help you with your skill development! I can provide insights on:
    
• Your recent test performance
• Skills you should focus on
• Career advice based on your profile
• Tips to improve your scores

What would you like to know?`;
  }

  getImprovementAdvice(context) {
    const assessments = context?.recentAssessments || [];
    
    if (assessments.length === 0) {
      return "Take some assessments first, and I'll provide personalized improvement advice based on your performance!";
    }

    const avgScore = assessments.reduce((sum, a) => sum + (a.evaluation?.percentage || 0), 0) / assessments.length;
    const weaknesses = assessments[0]?.weaknesses || [];

    let advice = `Based on your recent performance (avg: ${avgScore.toFixed(1)}%), here's how to improve:\n\n`;

    if (avgScore < 60) {
      advice += `• Focus on fundamentals - your scores suggest you need to strengthen core concepts\n`;
      advice += `• Practice regularly - consistency is key to improvement\n`;
      advice += `• Review incorrect answers to understand your mistakes\n`;
    } else if (avgScore < 80) {
      advice += `• You're doing well! Focus on advanced topics to reach the next level\n`;
      advice += `• Work on time management during tests\n`;
      advice += `• Deep dive into complex scenarios\n`;
    } else {
      advice += `• Excellent work! Maintain your momentum\n`;
      advice += `• Challenge yourself with expert-level questions\n`;
      advice += `• Consider mentoring others to reinforce your knowledge\n`;
    }

    if (weaknesses.length > 0) {
      advice += `\n📌 Priority areas: ${weaknesses.slice(0, 3).map(w => w.skill).join(', ')}`;
    }

    return advice;
  }

  getSkillAdvice(context) {
    const profile = context?.skillProfile;
    const assessments = context?.recentAssessments || [];

    if (!profile && assessments.length === 0) {
      return "Upload your resume or take assessments to get personalized skill recommendations!";
    }

    const skills = profile?.extractedSkills || [];
    const weakSkills = assessments[0]?.weaknesses || [];

    let advice = `🎯 Skill Development Roadmap:\n\n`;

    if (weakSkills.length > 0) {
      advice += `**Immediate Focus:**\n`;
      weakSkills.slice(0, 3).forEach((w, i) => {
        advice += `${i + 1}. ${w.skill} - Current accuracy: ${w.accuracy}%\n`;
      });
      advice += `\n`;
    }

    if (skills.length > 0) {
      advice += `**Your Strengths:**\n`;
      skills.slice(0, 5).forEach((s, i) => {
        advice += `${i + 1}. ${s}\n`;
      });
      advice += `\n`;
    }

    advice += `**Recommendations:**\n`;
    advice += `• Dedicate 30 minutes daily to practice\n`;
    advice += `• Build projects to apply your knowledge\n`;
    advice += `• Join coding communities for peer learning\n`;
    advice += `• Take regular assessments to track progress`;

    return advice;
  }

  getPerformanceSummary(context) {
    const assessments = context?.recentAssessments || [];

    if (assessments.length === 0) {
      return "You haven't completed any assessments yet. Take your first test to see your performance metrics!";
    }

    const avgScore = assessments.reduce((sum, a) => sum + (a.evaluation?.percentage || 0), 0) / assessments.length;
    const latest = assessments[0];
    const strengths = latest?.strengths || [];
    const weaknesses = latest?.weaknesses || [];

    let summary = `📊 Performance Summary:\n\n`;
    summary += `**Overall Average:** ${avgScore.toFixed(1)}%\n`;
    summary += `**Tests Completed:** ${assessments.length}\n`;
    summary += `**Latest Score:** ${latest.evaluation?.percentage || 0}%\n\n`;

    if (strengths.length > 0) {
      summary += `**Top Strengths:**\n`;
      strengths.slice(0, 3).forEach((s, i) => {
        summary += `${i + 1}. ${s.skill} - ${s.accuracy}% accuracy\n`;
      });
      summary += `\n`;
    }

    if (weaknesses.length > 0) {
      summary += `**Areas to Improve:**\n`;
      weaknesses.slice(0, 3).forEach((w, i) => {
        summary += `${i + 1}. ${w.skill} - ${w.accuracy}% accuracy\n`;
      });
    }

    const trend = assessments.length >= 2 
      ? assessments[0].evaluation.percentage - assessments[1].evaluation.percentage
      : 0;

    if (trend > 0) {
      summary += `\n📈 Great! You're improving by ${trend.toFixed(1)}% from your last test!`;
    } else if (trend < 0) {
      summary += `\n📉 Your score dropped by ${Math.abs(trend).toFixed(1)}%. Let's work on getting back on track!`;
    }

    return summary;
  }

  getCareerAdvice(context) {
    const profile = context?.skillProfile;
    const assessments = context?.recentAssessments || [];

    if (!profile && assessments.length === 0) {
      return "Complete your profile and take assessments to get personalized career advice!";
    }

    const avgScore = assessments.length > 0
      ? assessments.reduce((sum, a) => sum + (a.evaluation?.percentage || 0), 0) / assessments.length
      : 0;

    let advice = `💼 Career Guidance:\n\n`;

    if (avgScore >= 80) {
      advice += `**Your Level:** Senior/Expert\n`;
      advice += `**Suitable Roles:**\n`;
      advice += `• Senior Developer\n`;
      advice += `• Tech Lead\n`;
      advice += `• Solutions Architect\n\n`;
      advice += `**Next Steps:**\n`;
      advice += `• Build a strong portfolio with complex projects\n`;
      advice += `• Contribute to open source\n`;
      advice += `• Consider leadership roles\n`;
      advice += `• Mentor junior developers`;
    } else if (avgScore >= 60) {
      advice += `**Your Level:** Mid-Level\n`;
      advice += `**Suitable Roles:**\n`;
      advice += `• Software Developer\n`;
      advice += `• Full Stack Developer\n`;
      advice += `• Backend/Frontend Specialist\n\n`;
      advice += `**Next Steps:**\n`;
      advice += `• Deepen expertise in your tech stack\n`;
      advice += `• Work on end-to-end projects\n`;
      advice += `• Learn system design\n`;
      advice += `• Build your professional network`;
    } else {
      advice += `**Your Level:** Entry-Level/Junior\n`;
      advice += `**Suitable Roles:**\n`;
      advice += `• Junior Developer\n`;
      advice += `• Intern\n`;
      advice += `• Associate Developer\n\n`;
      advice += `**Next Steps:**\n`;
      advice += `• Master programming fundamentals\n`;
      advice += `• Build personal projects\n`;
      advice += `• Complete online courses\n`;
      advice += `• Practice coding challenges daily`;
    }

    return advice;
  }
}

module.exports = new AIChatController();
