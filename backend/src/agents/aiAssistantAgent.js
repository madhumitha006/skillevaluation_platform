const logger = require('../config/logger');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const Gamification = require('../models/Gamification');
const Interview = require('../models/Interview');

class AIAssistantAgent {
  constructor() {
    this.conversationMemory = new Map(); // In production, use Redis
    this.systemPrompt = `You are SkillNexus AI, an intelligent learning assistant for a skill evaluation and learning platform. You help users with:

1. Learning guidance and recommendations
2. Skill development advice
3. Career path suggestions
4. Technical questions and explanations
5. Study planning and motivation

You have access to user's:
- Current skill levels and progress
- Learning history and performance
- Gamification data (XP, level, badges)
- Interview results and feedback

Be helpful, encouraging, and provide actionable advice. Keep responses concise but informative.`;
  }

  async generateResponse(userId, message, conversationId) {
    try {
      // Get user context
      const userContext = await this.getUserContext(userId);
      
      // Get conversation history
      const conversationHistory = this.getConversationHistory(conversationId);
      
      // Build context-aware prompt
      const contextPrompt = this.buildContextPrompt(userContext, conversationHistory, message);
      
      // Generate AI response (simulated - replace with actual AI service)
      const response = await this.callAIService(contextPrompt);
      
      // Store conversation
      this.storeConversation(conversationId, message, response);
      
      return response;
    } catch (error) {
      logger.error(`AI Assistant error: ${error.message}`);
      return this.getFallbackResponse(message);
    }
  }

  async getUserContext(userId) {
    try {
      const [user, gamification, recentProgress, recentInterviews] = await Promise.all([
        User.findById(userId).select('name role'),
        Gamification.findOne({ userId }),
        UserProgress.find({ userId }).sort({ lastAccessed: -1 }).limit(5).populate('courseId', 'title'),
        Interview.find({ userId }).sort({ createdAt: -1 }).limit(3).select('title evaluation.overallScore')
      ]);

      return {
        user,
        gamification,
        recentProgress,
        recentInterviews,
      };
    } catch (error) {
      logger.error(`Error getting user context: ${error.message}`);
      return null;
    }
  }

  buildContextPrompt(userContext, history, message) {
    let prompt = this.systemPrompt + '\n\n';
    
    if (userContext) {
      prompt += `User Context:\n`;
      prompt += `- Name: ${userContext.user?.name}\n`;
      prompt += `- Role: ${userContext.user?.role}\n`;
      
      if (userContext.gamification) {
        prompt += `- Level: ${userContext.gamification.level}\n`;
        prompt += `- Total XP: ${userContext.gamification.totalXP}\n`;
        prompt += `- Courses Completed: ${userContext.gamification.stats.coursesCompleted}\n`;
        prompt += `- Current Streak: ${userContext.gamification.streaks.current} days\n`;
      }
      
      if (userContext.recentProgress?.length > 0) {
        prompt += `- Recent Courses: ${userContext.recentProgress.map(p => p.courseId?.title).join(', ')}\n`;
      }
      
      if (userContext.recentInterviews?.length > 0) {
        const avgScore = userContext.recentInterviews.reduce((sum, i) => sum + (i.evaluation?.overallScore || 0), 0) / userContext.recentInterviews.length;
        prompt += `- Recent Interview Average: ${Math.round(avgScore)}%\n`;
      }
    }
    
    if (history.length > 0) {
      prompt += '\nConversation History:\n';
      history.slice(-6).forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
    }
    
    prompt += `\nUser: ${message}\nAssistant:`;
    
    return prompt;
  }

  async callAIService(prompt) {
    // Simulated AI response - replace with actual AI service (OpenAI, Claude, etc.)
    const responses = this.getSmartResponses();
    
    // Simple keyword matching for demo
    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('learn') || lowerPrompt.includes('course')) {
      return responses.learning[Math.floor(Math.random() * responses.learning.length)];
    } else if (lowerPrompt.includes('interview') || lowerPrompt.includes('practice')) {
      return responses.interview[Math.floor(Math.random() * responses.interview.length)];
    } else if (lowerPrompt.includes('skill') || lowerPrompt.includes('improve')) {
      return responses.skills[Math.floor(Math.random() * responses.skills.length)];
    } else if (lowerPrompt.includes('career') || lowerPrompt.includes('job')) {
      return responses.career[Math.floor(Math.random() * responses.career.length)];
    } else if (lowerPrompt.includes('motivation') || lowerPrompt.includes('help')) {
      return responses.motivation[Math.floor(Math.random() * responses.motivation.length)];
    }
    
    return responses.general[Math.floor(Math.random() * responses.general.length)];
  }

  getSmartResponses() {
    return {
      learning: [
        "Based on your current progress, I'd recommend focusing on **intermediate-level courses** to build upon your foundation. Would you like me to suggest some specific courses?",
        "Great question! Learning is most effective when you combine **theory with practice**. Try implementing what you learn in small projects. What topic are you currently studying?",
        "I notice you've been consistent with your learning streak! 🔥 To maximize retention, consider using the **spaced repetition** feature for reviewing completed modules.",
      ],
      interview: [
        "Interview preparation is key! I recommend practicing with our **AI Interview System** regularly. Focus on areas where your recent scores were lower. Would you like to start a practice session?",
        "For technical interviews, make sure to **think out loud** and explain your reasoning. Practice coding problems and review fundamental concepts. What specific area would you like to focus on?",
        "Your recent interview performance shows improvement! 📈 Keep practicing **behavioral questions** alongside technical ones. Confidence comes with preparation.",
      ],
      skills: [
        "Skill development is a journey! Based on your profile, I see opportunities to strengthen your **foundational concepts**. Consistent daily practice, even 15-30 minutes, makes a huge difference.",
        "I've analyzed your skill gaps and learning patterns. Consider focusing on **one skill at a time** for deeper mastery rather than spreading too thin. What's your priority skill right now?",
        "Your progress shows you're a dedicated learner! 🌟 To accelerate growth, try teaching concepts to others or contributing to open-source projects.",
      ],
      career: [
        "Career growth requires both **technical skills** and **soft skills**. Based on your current level, I'd suggest focusing on leadership and communication alongside your technical development.",
        "The job market values **continuous learners** like you! Consider building a portfolio showcasing your projects and contributing to the developer community.",
        "Your learning trajectory is impressive! For career advancement, focus on **solving real problems** and building projects that demonstrate your skills to potential employers.",
      ],
      motivation: [
        "You're doing great! 🚀 Remember, every expert was once a beginner. Your consistency in learning shows real dedication. What's one thing you're proud of achieving recently?",
        "Learning can be challenging, but you're making progress! 💪 Break down complex topics into smaller, manageable pieces. Celebrate small wins along the way!",
        "I believe in your potential! Your learning data shows steady improvement. Stay curious, keep practicing, and don't hesitate to ask questions. What would you like to explore next?",
      ],
      general: [
        "I'm here to help you succeed in your learning journey! Whether you need study advice, career guidance, or just want to chat about technology, I'm ready to assist. What's on your mind?",
        "Hello! 👋 I'm your AI learning companion. I can help with course recommendations, skill development, interview prep, and more. How can I support your growth today?",
        "Great to chat with you! I have access to your learning progress and can provide personalized advice. What would you like to discuss or improve?",
      ]
    };
  }

  getConversationHistory(conversationId) {
    return this.conversationMemory.get(conversationId) || [];
  }

  storeConversation(conversationId, userMessage, assistantResponse) {
    const history = this.getConversationHistory(conversationId);
    history.push(
      { role: 'user', content: userMessage, timestamp: new Date() },
      { role: 'assistant', content: assistantResponse, timestamp: new Date() }
    );
    
    // Keep only last 20 messages
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
    
    this.conversationMemory.set(conversationId, history);
  }

  getFallbackResponse(message) {
    const fallbacks = [
      "I'm having trouble processing that right now. Could you try rephrasing your question?",
      "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment.",
      "I'm not sure I understand completely. Could you provide more details about what you'd like help with?",
      "Let me help you with that! Could you be more specific about what you're looking for?",
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  async streamResponse(userId, message, conversationId) {
    try {
      const response = await this.generateResponse(userId, message, conversationId);
      
      // Simulate streaming by breaking response into chunks
      const words = response.split(' ');
      const chunks = [];
      
      for (let i = 0; i < words.length; i += 3) {
        chunks.push(words.slice(i, i + 3).join(' ') + ' ');
      }
      
      return chunks;
    } catch (error) {
      logger.error(`Streaming error: ${error.message}`);
      return [this.getFallbackResponse(message)];
    }
  }

  clearConversation(conversationId) {
    this.conversationMemory.delete(conversationId);
  }
}

module.exports = AIAssistantAgent;