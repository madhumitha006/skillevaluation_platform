import { useUserJourney } from '../context/UserJourneyStore';
import { useAuthStore } from '../context/AuthStore';

interface UserContext {
  userName: string;
  currentStep: string;
  totalScore: number;
  testScore?: number;
  interviewConfidence?: number;
  topSkills: string[];
  weakSkills: string[];
  completedSteps: string[];
  timeOnPlatform: number;
  level: number;
  xpPoints: number;
}

export class PersonalizedAIMentor {
  private getUserContext(): UserContext {
    const { user } = useAuthStore.getState();
    const { testResults, interviewResults, skillData, currentStep, steps, totalScore, level, xpPoints } = useUserJourney.getState();
    
    const completedSteps = steps.filter(s => s.completed).map(s => s.title);
    const topSkills = skillData?.skills?.slice(0, 3)?.map((s: any) => s.name) || [];
    const weakSkills = skillData?.skills?.slice(-2)?.map((s: any) => s.name) || [];
    
    return {
      userName: user?.name || 'there',
      currentStep: steps[currentStep]?.title || 'Getting Started',
      totalScore,
      testScore: testResults?.overallScore,
      interviewConfidence: interviewResults?.confidence,
      topSkills,
      weakSkills,
      completedSteps,
      timeOnPlatform: completedSteps.length,
      level,
      xpPoints
    };
  }

  generateResponse(userMessage: string): string {
    const context = this.getUserContext();
    const message = userMessage.toLowerCase();

    // Performance Analysis Requests
    if (message.includes('score') || message.includes('performance') || message.includes('how am i doing')) {
      return this.generatePerformanceAnalysis(context);
    }

    // Career Guidance Requests
    if (message.includes('career') || message.includes('job') || message.includes('next step')) {
      return this.generateCareerGuidance(context);
    }

    // Skill Improvement Requests
    if (message.includes('improve') || message.includes('learn') || message.includes('better')) {
      return this.generateSkillImprovement(context);
    }

    // Interview Preparation
    if (message.includes('interview') || message.includes('prepare')) {
      return this.generateInterviewGuidance(context);
    }

    // Salary/Compensation Questions
    if (message.includes('salary') || message.includes('pay') || message.includes('compensation')) {
      return this.generateSalaryInsights(context);
    }

    // Market Trends
    if (message.includes('market') || message.includes('trend') || message.includes('industry')) {
      return this.generateMarketInsights(context);
    }

    // Default personalized greeting
    return this.generatePersonalizedGreeting(context);
  }

  private generatePerformanceAnalysis(context: UserContext): string {
    const performanceLevel = context.totalScore >= 80 ? 'exceptional' : 
                           context.totalScore >= 65 ? 'strong' : 
                           context.totalScore >= 50 ? 'developing' : 'foundational';

    return `**Performance Analysis for ${context.userName}**

📊 **Current Standing:**
Your ${context.totalScore}% talent score places you in the ${performanceLevel} category. Based on your ${context.completedSteps.length} completed assessments, here's what I see:

🎯 **Strengths Analysis:**
${context.topSkills.length > 0 ? 
  `Your expertise in ${context.topSkills.join(', ')} is clearly your competitive advantage. ${context.testScore ? `Your ${context.testScore}% test performance` : 'Your assessment results'} show you're operating at a ${context.testScore >= 80 ? 'senior' : context.testScore >= 65 ? 'mid-level' : 'junior'} proficiency.` :
  'I need more assessment data to identify your key strengths. Complete the skill test to unlock detailed insights.'
}

⚠️ **Growth Opportunities:**
${context.weakSkills.length > 0 ? 
  `Focus areas: ${context.weakSkills.join(' and ')}. These gaps could be limiting your advancement to senior roles. Industry data shows professionals who address these areas see 23% faster career progression.` :
  'Complete more assessments to identify specific improvement areas.'
}

📈 **Next Milestone:**
${context.totalScore < 70 ? 
  'Target: 70% talent score. This typically unlocks mid-level opportunities with 15-25% salary increases.' :
  context.totalScore < 85 ?
  'Target: 85% talent score. This positions you for senior roles with significant leadership responsibilities.' :
  'You\'re in the top tier! Focus on specialization and thought leadership to command premium compensation.'
}`;
  }

  private generateCareerGuidance(context: UserContext): string {
    const careerStage = context.totalScore >= 80 ? 'Senior/Lead' : 
                       context.totalScore >= 65 ? 'Mid-Level' : 'Junior/Entry';

    return `**Career Strategy for ${context.userName}**

🎯 **Your Career Position:**
Based on your ${context.totalScore}% talent score and ${context.topSkills.join(', ')} expertise, you're positioned for ${careerStage} roles.

💼 **Recommended Path:**
${context.totalScore >= 80 ? 
  `**Senior Track:** Target Staff Engineer, Tech Lead, or Principal roles. Your strong foundation suggests you're ready for architectural decisions and team leadership. Expected salary range: $120K-180K+` :
  context.totalScore >= 65 ?
  `**Growth Track:** Focus on Senior Developer positions. Your skills in ${context.topSkills[0] || 'core technologies'} are solid. Bridge gaps in ${context.weakSkills.join(' and ')} to accelerate promotion. Expected range: $80K-120K` :
  `**Foundation Track:** Target mid-level positions while strengthening core skills. Your ${context.completedSteps.length} completed assessments show commitment to growth. Expected range: $60K-85K`
}

🚀 **Strategic Actions:**
1. **Immediate (Next 30 days):** ${context.currentStep !== 'Learning Plan' ? `Complete your ${context.currentStep} to unlock personalized opportunities` : 'Focus on your identified skill gaps'}
2. **Short-term (3 months):** ${context.weakSkills.length > 0 ? `Achieve proficiency in ${context.weakSkills[0]} through targeted learning` : 'Build portfolio projects showcasing your expertise'}
3. **Medium-term (6 months):** Apply to ${careerStage.toLowerCase()} positions at companies matching your skill profile

🎖️ **Competitive Edge:**
Your Level ${context.level} status with ${context.xpPoints} XP demonstrates continuous learning - a key differentiator in today's market.`;
  }

  private generateSkillImprovement(context: UserContext): string {
    return `**Personalized Learning Plan for ${context.userName}**

📚 **Priority Skills (Based on Your Assessment):**
${context.weakSkills.length > 0 ? 
  context.weakSkills.map((skill, index) => 
    `${index + 1}. **${skill}** - ${this.getSkillImportance(skill, context.topSkills)}`
  ).join('\n') :
  'Complete your skill assessment to get targeted recommendations.'
}

🎯 **Learning Strategy:**
${context.testScore ? 
  context.testScore >= 70 ?
    `Your ${context.testScore}% test score shows strong fundamentals. Focus on advanced concepts and real-world application. Recommended: Build 2-3 portfolio projects demonstrating expertise.` :
    `Your ${context.testScore}% score indicates knowledge gaps. Prioritize structured learning with hands-on practice. Recommended: 2-3 hours daily focused study for 8-12 weeks.` :
  'Take the skill assessment first to get a personalized learning roadmap.'
}

📈 **Expected Outcomes:**
- **4 weeks:** Noticeable improvement in weak areas
- **8 weeks:** Ready for practical application in projects  
- **12 weeks:** Confident enough to discuss in interviews
- **Impact:** 15-30% increase in job compatibility score

🏆 **Success Metrics:**
Track progress through our platform assessments. Your current Level ${context.level} shows you're committed to growth - maintain this momentum!`;
  }

  private generateInterviewGuidance(context: UserContext): string {
    return `**Interview Preparation for ${context.userName}**

🎯 **Your Interview Profile:**
${context.interviewConfidence ? 
  `Your ${context.interviewConfidence}% confidence score suggests ${context.interviewConfidence >= 75 ? 'strong interview readiness' : 'room for improvement in interview skills'}.` :
  'Complete the AI interview simulation to assess your readiness.'
}

💪 **Leverage Your Strengths:**
${context.topSkills.length > 0 ? 
  `Emphasize your expertise in ${context.topSkills.join(', ')}. Prepare 2-3 specific examples demonstrating these skills in action. Your ${context.totalScore}% talent score indicates solid technical foundation.` :
  'Complete assessments to identify your key selling points.'
}

⚠️ **Address Potential Concerns:**
${context.weakSkills.length > 0 ? 
  `Be prepared to discuss ${context.weakSkills.join(' and ')}. Frame as growth areas: "I'm actively developing my ${context.weakSkills[0]} skills through [specific learning approach]."` :
  'Your skill profile appears well-rounded based on current data.'
}

🗣️ **Talking Points:**
- "I've completed ${context.completedSteps.length} professional assessments, achieving a ${context.totalScore}% talent score"
- "My continuous learning approach is evidenced by reaching Level ${context.level} on the platform"
- ${context.testScore ? `"My technical assessment score of ${context.testScore}% demonstrates my proficiency"` : '"I regularly validate my skills through structured assessments"'}

📋 **Interview Action Plan:**
1. **Technical Prep:** Review ${context.topSkills[0] || 'core concepts'} - expect deep-dive questions
2. **Behavioral Prep:** Prepare STAR method examples showcasing problem-solving
3. **Questions to Ask:** Inquire about growth opportunities in your development areas`;
  }

  private generateSalaryInsights(context: UserContext): string {
    const salaryRange = context.totalScore >= 80 ? '$100K-150K+' : 
                       context.totalScore >= 65 ? '$75K-110K' : '$55K-80K';

    return `**Compensation Analysis for ${context.userName}**

💰 **Your Market Value:**
Based on your ${context.totalScore}% talent score and ${context.topSkills.join(', ')} skills, your market range is approximately **${salaryRange}**.

📊 **Factors Influencing Your Range:**
- **Skill Proficiency:** Your ${context.topSkills[0] || 'primary skill'} expertise positions you ${context.totalScore >= 75 ? 'above' : 'at'} market average
- **Assessment Performance:** ${context.testScore ? `${context.testScore}% technical score` : 'Pending technical validation'} ${context.testScore >= 80 ? 'supports premium positioning' : 'indicates standard market rates'}
- **Growth Trajectory:** Level ${context.level} status demonstrates continuous improvement

🚀 **Salary Optimization Strategy:**
${context.totalScore >= 75 ? 
  `You're in a strong negotiating position. Focus on total compensation including equity, benefits, and growth opportunities.` :
  `Increase your talent score by 10-15 points to unlock the next salary tier. Focus on ${context.weakSkills[0] || 'key skill gaps'}.`
}

📈 **Negotiation Leverage:**
- Your ${context.completedSteps.length} completed assessments show commitment to excellence
- ${context.interviewConfidence ? `${context.interviewConfidence}% interview confidence` : 'Strong technical foundation'} supports your asking range
- Continuous learning (evidenced by platform engagement) justifies growth-oriented compensation

💡 **Pro Tip:** Companies value validated skills. Your platform assessments provide concrete evidence of capabilities during salary discussions.`;
  }

  private generateMarketInsights(context: UserContext): string {
    return `**Market Intelligence for ${context.userName}**

📈 **Industry Trends (${context.topSkills[0] || 'Your Field'}):**
${context.topSkills.includes('React') || context.topSkills.includes('JavaScript') ? 
  'Frontend development remains hot with 23% YoY growth. React expertise is particularly valuable with average salaries up 18% this year.' :
  context.topSkills.includes('Python') ?
  'Python developers see strong demand in AI/ML sectors. Data engineering roles show 31% growth with premium compensation.' :
  'Tech sector continues strong hiring despite market fluctuations. Full-stack capabilities command premium rates.'
}

🎯 **Opportunity Analysis:**
Your ${context.totalScore}% talent score positions you for ${context.totalScore >= 80 ? 'senior opportunities in high-growth companies' : context.totalScore >= 65 ? 'mid-level roles with advancement potential' : 'solid entry-level positions with learning opportunities'}.

🏢 **Company Targets:**
${context.totalScore >= 80 ? 
  'Consider: Scale-ups (equity upside), established tech companies (stability + growth), or consulting (premium rates)' :
  context.totalScore >= 65 ?
  'Target: Growing companies needing your skill mix, established firms with mentorship programs' :
  'Focus: Companies with strong training programs, startups offering rapid skill development'
}

⚡ **Competitive Positioning:**
Your Level ${context.level} continuous learning approach sets you apart. ${context.completedSteps.length} completed assessments demonstrate commitment beyond typical candidates.

🔮 **6-Month Outlook:**
${context.weakSkills.length > 0 ? 
  `Address ${context.weakSkills[0]} skills to capitalize on emerging opportunities. Market demand for this combination is projected to grow 25%.` :
  'Your skill profile aligns well with market trends. Focus on deepening expertise for premium positioning.'
}`;
  }

  private generatePersonalizedGreeting(context: UserContext): string {
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening';
    
    return `Good ${timeOfDay}, ${context.userName}! 👋

I see you're at **${context.totalScore}% talent score** with strong progress in your journey. ${context.completedSteps.length > 0 ? `Impressive work completing ${context.completedSteps.join(', ')}!` : 'Ready to start your assessment journey?'}

**Quick Status Check:**
${context.currentStep !== 'Learning Plan' ? `🎯 Next step: ${context.currentStep}` : '✅ All assessments complete!'}
${context.topSkills.length > 0 ? `💪 Your strengths: ${context.topSkills.join(', ')}` : '📊 Complete assessments to identify strengths'}
🏆 Level ${context.level} • ${context.xpPoints} XP

**How can I help you advance today?**
- Analyze your performance and growth opportunities
- Provide personalized career guidance  
- Suggest specific skill improvements
- Prepare you for interviews
- Share market insights and salary data

What would be most valuable for your career right now?`;
  }

  private getSkillImportance(skill: string, topSkills: string[]): string {
    const skillInsights: { [key: string]: string } = {
      'JavaScript': 'Foundation for 78% of web development roles. Critical for career advancement.',
      'React': 'Most in-demand frontend framework. 45% salary premium over vanilla JS.',
      'Node.js': 'Enables full-stack development. Opens backend opportunities.',
      'Python': 'Gateway to AI/ML roles. Fastest growing language in enterprise.',
      'SQL': 'Essential for data-driven roles. Required by 89% of backend positions.',
      'AWS': 'Cloud skills command 25% salary premium. Industry standard.',
      'TypeScript': 'Increasingly required for senior roles. Shows code quality focus.',
      'Docker': 'DevOps essential. Required for modern deployment practices.'
    };

    return skillInsights[skill] || `Complements your ${topSkills[0] || 'existing'} expertise. Valuable for role diversification.`;
  }
}

export const personalizedAI = new PersonalizedAIMentor();