const logger = require('../config/logger');

class InterviewIntelligenceAgent {
  constructor() {
    this.questionBank = {
      javascript: {
        easy: [
          { q: "What is the difference between let, const, and var?", type: "technical" },
          { q: "Explain what a closure is in JavaScript", type: "technical" },
          { q: "What is the difference between == and ===?", type: "technical" },
        ],
        medium: [
          { q: "How does event delegation work in JavaScript?", type: "technical" },
          { q: "Explain the concept of hoisting", type: "technical" },
          { q: "What are Promises and how do they work?", type: "technical" },
        ],
        hard: [
          { q: "Implement a debounce function from scratch", type: "technical" },
          { q: "Explain the JavaScript event loop and call stack", type: "technical" },
          { q: "How would you implement a custom Promise?", type: "technical" },
        ]
      },
      react: {
        easy: [
          { q: "What is JSX and why is it used?", type: "technical" },
          { q: "Explain the difference between props and state", type: "technical" },
          { q: "What are React components?", type: "technical" },
        ],
        medium: [
          { q: "How do React hooks work? Explain useState and useEffect", type: "technical" },
          { q: "What is the virtual DOM and how does it work?", type: "technical" },
          { q: "Explain React component lifecycle methods", type: "technical" },
        ],
        hard: [
          { q: "How would you optimize a React application's performance?", type: "technical" },
          { q: "Implement a custom hook for data fetching", type: "technical" },
          { q: "Explain React's reconciliation algorithm", type: "technical" },
        ]
      },
      behavioral: {
        easy: [
          { q: "Tell me about yourself and your background", type: "behavioral" },
          { q: "Why are you interested in this role?", type: "behavioral" },
          { q: "What are your greatest strengths?", type: "behavioral" },
        ],
        medium: [
          { q: "Describe a challenging project you worked on", type: "behavioral" },
          { q: "How do you handle tight deadlines?", type: "behavioral" },
          { q: "Tell me about a time you had to learn something new quickly", type: "behavioral" },
        ],
        hard: [
          { q: "Describe a time you had to make a difficult decision with limited information", type: "behavioral" },
          { q: "How do you handle conflicts with team members?", type: "behavioral" },
          { q: "Tell me about a time you failed and what you learned", type: "behavioral" },
        ]
      }
    };
  }

  generateQuestions(skills, difficulty = 'medium', count = 5) {
    try {
      const questions = [];
      const usedQuestions = new Set();

      // Add technical questions based on skills
      skills.forEach(skill => {
        const skillKey = skill.toLowerCase();
        if (this.questionBank[skillKey]) {
          const skillQuestions = this.questionBank[skillKey][difficulty] || this.questionBank[skillKey].medium;
          skillQuestions.forEach(q => {
            if (!usedQuestions.has(q.q) && questions.length < count - 1) {
              questions.push({
                id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                question: q.q,
                skill: skill,
                difficulty,
                type: q.type,
                followUp: this.generateFollowUpQuestions(q.q, skill),
              });
              usedQuestions.add(q.q);
            }
          });
        }
      });

      // Add behavioral question
      const behavioralQuestions = this.questionBank.behavioral[difficulty];
      if (behavioralQuestions.length > 0 && questions.length < count) {
        const randomBehavioral = behavioralQuestions[Math.floor(Math.random() * behavioralQuestions.length)];
        questions.push({
          id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          question: randomBehavioral.q,
          skill: 'behavioral',
          difficulty,
          type: randomBehavioral.type,
          followUp: this.generateFollowUpQuestions(randomBehavioral.q, 'behavioral'),
        });
      }

      logger.info(`Generated ${questions.length} questions for skills: ${skills.join(', ')}`);
      return questions;
    } catch (error) {
      logger.error(`Error generating questions: ${error.message}`);
      throw error;
    }
  }

  generateFollowUpQuestions(originalQuestion, skill) {
    const followUps = {
      javascript: [
        "Can you provide a code example?",
        "How would you handle edge cases?",
        "What are the performance implications?",
      ],
      react: [
        "How would you test this?",
        "What are the best practices here?",
        "How does this relate to other React concepts?",
      ],
      behavioral: [
        "What was the outcome?",
        "What would you do differently?",
        "How did this experience change your approach?",
      ]
    };

    const skillKey = skill.toLowerCase();
    const skillFollowUps = followUps[skillKey] || followUps.behavioral;
    return skillFollowUps.slice(0, 2);
  }

  adjustDifficulty(currentDifficulty, performance) {
    const difficultyLevels = ['easy', 'medium', 'hard'];
    const currentIndex = difficultyLevels.indexOf(currentDifficulty);

    if (performance >= 0.8 && currentIndex < 2) {
      return difficultyLevels[currentIndex + 1];
    } else if (performance <= 0.4 && currentIndex > 0) {
      return difficultyLevels[currentIndex - 1];
    }

    return currentDifficulty;
  }

  calculateConfidenceScore(transcript, responseTime) {
    try {
      let score = 0.5; // Base score

      // Analyze transcript length and content
      const wordCount = transcript.split(' ').length;
      if (wordCount > 10) score += 0.1;
      if (wordCount > 30) score += 0.1;

      // Check for filler words (reduces confidence)
      const fillerWords = ['um', 'uh', 'like', 'you know', 'actually'];
      const fillerCount = fillerWords.reduce((count, word) => {
        return count + (transcript.toLowerCase().match(new RegExp(word, 'g')) || []).length;
      }, 0);
      score -= Math.min(fillerCount * 0.05, 0.2);

      // Response time factor (optimal range: 5-30 seconds)
      const timeInSeconds = responseTime / 1000;
      if (timeInSeconds >= 5 && timeInSeconds <= 30) {
        score += 0.1;
      } else if (timeInSeconds > 60) {
        score -= 0.1;
      }

      // Technical keywords boost
      const technicalKeywords = ['function', 'variable', 'object', 'array', 'method', 'class', 'component'];
      const keywordMatches = technicalKeywords.filter(keyword => 
        transcript.toLowerCase().includes(keyword)
      ).length;
      score += Math.min(keywordMatches * 0.05, 0.2);

      return Math.max(0, Math.min(1, score));
    } catch (error) {
      logger.error(`Error calculating confidence score: ${error.message}`);
      return 0.5;
    }
  }

  analyzeSentiment(text) {
    try {
      // Simple sentiment analysis based on keywords
      const positiveWords = ['good', 'great', 'excellent', 'confident', 'sure', 'definitely', 'absolutely'];
      const negativeWords = ['bad', 'difficult', 'hard', 'unsure', 'maybe', 'probably', 'not sure'];

      const words = text.toLowerCase().split(' ');
      let positiveCount = 0;
      let negativeCount = 0;

      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
      });

      const totalSentimentWords = positiveCount + negativeCount;
      if (totalSentimentWords === 0) {
        return { score: 0, label: 'neutral' };
      }

      const score = (positiveCount - negativeCount) / totalSentimentWords;
      let label = 'neutral';
      if (score > 0.2) label = 'positive';
      else if (score < -0.2) label = 'negative';

      return { score, label };
    } catch (error) {
      logger.error(`Error analyzing sentiment: ${error.message}`);
      return { score: 0, label: 'neutral' };
    }
  }

  generateEvaluationReport(interview) {
    try {
      const responses = interview.responses || [];
      if (responses.length === 0) {
        return {
          overallScore: 0,
          skillScores: new Map(),
          strengths: [],
          improvements: ['Complete the interview to receive evaluation'],
          feedback: 'Interview not completed',
          recommendation: 'Please complete the interview for detailed feedback'
        };
      }

      // Calculate overall metrics
      const avgConfidence = responses.reduce((sum, r) => sum + (r.confidence || 0), 0) / responses.length;
      const avgResponseTime = responses.reduce((sum, r) => sum + (r.responseTime || 0), 0) / responses.length;
      
      // Calculate skill-specific scores
      const skillScores = new Map();
      interview.skills.forEach(skill => {
        const skillResponses = responses.filter(r => {
          const question = interview.questions.find(q => q.id === r.questionId);
          return question && question.skill === skill;
        });
        
        if (skillResponses.length > 0) {
          const skillAvg = skillResponses.reduce((sum, r) => sum + (r.confidence || 0), 0) / skillResponses.length;
          skillScores.set(skill, Math.round(skillAvg * 100));
        }
      });

      // Generate strengths and improvements
      const strengths = [];
      const improvements = [];

      if (avgConfidence > 0.7) {
        strengths.push('Strong communication skills');
        strengths.push('Confident in responses');
      }
      if (avgResponseTime < 30000) {
        strengths.push('Quick thinking and response time');
      }

      if (avgConfidence < 0.5) {
        improvements.push('Work on building confidence in responses');
      }
      if (avgResponseTime > 60000) {
        improvements.push('Practice answering questions more concisely');
      }

      const overallScore = Math.round(avgConfidence * 100);
      
      return {
        overallScore,
        skillScores,
        strengths,
        improvements,
        feedback: this.generateDetailedFeedback(overallScore, skillScores),
        recommendation: this.generateRecommendation(overallScore)
      };
    } catch (error) {
      logger.error(`Error generating evaluation report: ${error.message}`);
      throw error;
    }
  }

  generateDetailedFeedback(overallScore, skillScores) {
    let feedback = `Your overall interview performance scored ${overallScore}/100. `;
    
    if (overallScore >= 80) {
      feedback += "Excellent performance! You demonstrated strong technical knowledge and communication skills.";
    } else if (overallScore >= 60) {
      feedback += "Good performance with room for improvement in some areas.";
    } else {
      feedback += "There are several areas that need improvement to strengthen your interview performance.";
    }

    return feedback;
  }

  generateRecommendation(overallScore) {
    if (overallScore >= 80) {
      return "You're well-prepared for technical interviews. Continue practicing to maintain your skills.";
    } else if (overallScore >= 60) {
      return "Focus on improving weak areas and practice more technical questions.";
    } else {
      return "Dedicate more time to studying fundamentals and practicing interview questions.";
    }
  }
}

module.exports = InterviewIntelligenceAgent;