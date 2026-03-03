import { Question } from './questionBank';

export interface AssessmentResult {
  overallScore: number;
  skillBreakdown: SkillAssessment[];
  weakAreas: string[];
  strongAreas: string[];
  recommendations: Recommendation[];
  nextSteps: NextStep[];
  competencyLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  industryComparison: IndustryComparison;
  learningPath: string[];
}

export interface SkillAssessment {
  skill: string;
  score: number;
  level: string;
  questionsAttempted: number;
  timeSpent: number;
  accuracy: number;
  improvementAreas: string[];
  masteryIndicators: string[];
}

export interface Recommendation {
  type: 'course' | 'practice' | 'project' | 'certification';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  skillsImproved: string[];
}

export interface NextStep {
  action: string;
  description: string;
  timeframe: string;
  difficulty: string;
}

export interface IndustryComparison {
  percentile: number;
  averageScore: number;
  topPerformerScore: number;
  skillDemand: { [skill: string]: number };
}

export class AdvancedAssessmentEngine {
  private skillWeights = {
    'javascript': 1.2,
    'react': 1.1,
    'algorithms': 1.3,
    'system-design': 1.4,
    'databases': 1.0,
    'nodejs': 1.0,
    'python': 1.0,
    'security': 1.2,
    'devops': 1.1,
    'testing': 0.9
  };

  private industryBenchmarks = {
    'javascript': { beginner: 65, intermediate: 78, advanced: 88, expert: 95 },
    'react': { beginner: 60, intermediate: 75, advanced: 85, expert: 93 },
    'algorithms': { beginner: 55, intermediate: 70, advanced: 82, expert: 92 },
    'system-design': { beginner: 50, intermediate: 68, advanced: 80, expert: 90 },
    'databases': { beginner: 62, intermediate: 76, advanced: 86, expert: 94 }
  };

  analyzePerformance(
    questions: Question[],
    answers: number[],
    timeSpent: number,
    selectedSkills: string[]
  ): AssessmentResult {
    const skillBreakdown = this.calculateSkillBreakdown(questions, answers, timeSpent);
    const overallScore = this.calculateWeightedScore(skillBreakdown);
    const competencyLevel = this.determineCompetencyLevel(overallScore, skillBreakdown);
    
    return {
      overallScore,
      skillBreakdown,
      weakAreas: this.identifyWeakAreas(skillBreakdown),
      strongAreas: this.identifyStrongAreas(skillBreakdown),
      recommendations: this.generateRecommendations(skillBreakdown, competencyLevel),
      nextSteps: this.generateNextSteps(skillBreakdown, competencyLevel),
      competencyLevel,
      industryComparison: this.compareWithIndustry(skillBreakdown),
      learningPath: this.generateLearningPath(skillBreakdown, selectedSkills)
    };
  }

  private calculateSkillBreakdown(questions: Question[], answers: number[], timeSpent: number): SkillAssessment[] {
    const skillGroups = questions.reduce((acc, question, index) => {
      if (!acc[question.skill]) {
        acc[question.skill] = {
          questions: [],
          answers: [],
          timeSpent: 0
        };
      }
      acc[question.skill].questions.push(question);
      acc[question.skill].answers.push(answers[index]);
      acc[question.skill].timeSpent += timeSpent / questions.length; // Approximate
      return acc;
    }, {} as any);

    return Object.entries(skillGroups).map(([skill, data]: [string, any]) => {
      const correct = data.answers.filter((answer: number, idx: number) => 
        answer === data.questions[idx].correct
      ).length;
      
      const score = Math.round((correct / data.questions.length) * 100);
      const accuracy = correct / data.questions.length;
      
      return {
        skill: skill.charAt(0).toUpperCase() + skill.slice(1).replace('-', ' '),
        score,
        level: this.getSkillLevel(score),
        questionsAttempted: data.questions.length,
        timeSpent: Math.round(data.timeSpent),
        accuracy,
        improvementAreas: this.getImprovementAreas(skill, score, data.questions, data.answers),
        masteryIndicators: this.getMasteryIndicators(skill, score, accuracy)
      };
    });
  }

  private calculateWeightedScore(skillBreakdown: SkillAssessment[]): number {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    skillBreakdown.forEach(skill => {
      const skillKey = skill.skill.toLowerCase().replace(' ', '-');
      const weight = this.skillWeights[skillKey as keyof typeof this.skillWeights] || 1.0;
      totalWeightedScore += skill.score * weight;
      totalWeight += weight;
    });

    return Math.round(totalWeightedScore / totalWeight);
  }

  private determineCompetencyLevel(overallScore: number, skillBreakdown: SkillAssessment[]): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' {
    const avgAccuracy = skillBreakdown.reduce((sum, skill) => sum + skill.accuracy, 0) / skillBreakdown.length;
    
    if (overallScore >= 90 && avgAccuracy >= 0.9) return 'Expert';
    if (overallScore >= 80 && avgAccuracy >= 0.8) return 'Advanced';
    if (overallScore >= 65 && avgAccuracy >= 0.65) return 'Intermediate';
    return 'Beginner';
  }

  private identifyWeakAreas(skillBreakdown: SkillAssessment[]): string[] {
    return skillBreakdown
      .filter(skill => skill.score < 70)
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(skill => skill.skill);
  }

  private identifyStrongAreas(skillBreakdown: SkillAssessment[]): string[] {
    return skillBreakdown
      .filter(skill => skill.score >= 80)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(skill => skill.skill);
  }

  private generateRecommendations(skillBreakdown: SkillAssessment[], level: string): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Weak areas recommendations
    skillBreakdown
      .filter(skill => skill.score < 70)
      .forEach(skill => {
        recommendations.push({
          type: 'course',
          title: `${skill.skill} Fundamentals Course`,
          description: `Strengthen your ${skill.skill.toLowerCase()} foundation with comprehensive lessons and practice`,
          priority: 'high',
          estimatedTime: '2-3 weeks',
          skillsImproved: [skill.skill]
        });
      });

    // Practice recommendations
    if (level === 'Beginner' || level === 'Intermediate') {
      recommendations.push({
        type: 'practice',
        title: 'Daily Coding Challenges',
        description: 'Solve 2-3 coding problems daily to improve problem-solving skills',
        priority: 'high',
        estimatedTime: '30 min/day',
        skillsImproved: ['Algorithms', 'Problem Solving']
      });
    }

    // Project recommendations
    if (level === 'Intermediate' || level === 'Advanced') {
      recommendations.push({
        type: 'project',
        title: 'Build a Full-Stack Application',
        description: 'Create a complete web application to demonstrate your skills',
        priority: 'medium',
        estimatedTime: '4-6 weeks',
        skillsImproved: ['JavaScript', 'React', 'Node.js', 'Databases']
      });
    }

    // Certification recommendations
    if (level === 'Advanced' || level === 'Expert') {
      recommendations.push({
        type: 'certification',
        title: 'Professional Developer Certification',
        description: 'Validate your expertise with industry-recognized certifications',
        priority: 'medium',
        estimatedTime: '2-4 weeks prep',
        skillsImproved: ['Professional Credibility']
      });
    }

    return recommendations.slice(0, 4);
  }

  private generateNextSteps(skillBreakdown: SkillAssessment[], level: string): NextStep[] {
    const steps: NextStep[] = [];
    
    if (level === 'Beginner') {
      steps.push(
        {
          action: 'Complete JavaScript Fundamentals',
          description: 'Master variables, functions, and basic programming concepts',
          timeframe: '2-3 weeks',
          difficulty: 'Easy'
        },
        {
          action: 'Practice Daily Coding',
          description: 'Solve simple algorithms and data structure problems',
          timeframe: 'Ongoing',
          difficulty: 'Easy'
        }
      );
    } else if (level === 'Intermediate') {
      steps.push(
        {
          action: 'Build Portfolio Projects',
          description: 'Create 2-3 projects showcasing different technologies',
          timeframe: '4-6 weeks',
          difficulty: 'Medium'
        },
        {
          action: 'Learn Advanced Concepts',
          description: 'Study design patterns, system architecture, and best practices',
          timeframe: '3-4 weeks',
          difficulty: 'Medium'
        }
      );
    } else {
      steps.push(
        {
          action: 'Contribute to Open Source',
          description: 'Make meaningful contributions to popular repositories',
          timeframe: 'Ongoing',
          difficulty: 'Hard'
        },
        {
          action: 'Mentor Others',
          description: 'Share knowledge through teaching and code reviews',
          timeframe: 'Ongoing',
          difficulty: 'Medium'
        }
      );
    }

    return steps;
  }

  private compareWithIndustry(skillBreakdown: SkillAssessment[]): IndustryComparison {
    const avgScore = skillBreakdown.reduce((sum, skill) => sum + skill.score, 0) / skillBreakdown.length;
    
    // Mock industry data - in real app, this would come from database
    return {
      percentile: Math.min(95, Math.max(5, Math.round(avgScore * 1.2))),
      averageScore: 72,
      topPerformerScore: 94,
      skillDemand: {
        'JavaScript': 95,
        'React': 88,
        'Python': 82,
        'Algorithms': 78,
        'System Design': 85
      }
    };
  }

  private generateLearningPath(skillBreakdown: SkillAssessment[], selectedSkills: string[]): string[] {
    const weakSkills = skillBreakdown
      .filter(skill => skill.score < 70)
      .sort((a, b) => a.score - b.score)
      .map(skill => skill.skill);

    const path = [];
    
    // Start with weakest areas
    if (weakSkills.includes('JavaScript')) {
      path.push('JavaScript Fundamentals', 'ES6+ Features', 'Async Programming');
    }
    
    if (weakSkills.includes('Algorithms')) {
      path.push('Data Structures', 'Algorithm Complexity', 'Problem Solving Patterns');
    }
    
    if (weakSkills.includes('React')) {
      path.push('React Basics', 'State Management', 'React Hooks', 'Performance Optimization');
    }
    
    // Add advanced topics
    path.push('System Design Principles', 'Testing Best Practices', 'Security Fundamentals');
    
    return path.slice(0, 8);
  }

  private getSkillLevel(score: number): string {
    if (score >= 90) return 'Expert';
    if (score >= 80) return 'Advanced';
    if (score >= 65) return 'Intermediate';
    return 'Beginner';
  }

  private getImprovementAreas(skill: string, score: number, questions: Question[], answers: number[]): string[] {
    const areas: string[] = [];
    
    // Analyze wrong answers by tags
    const wrongQuestions = questions.filter((q, idx) => answers[idx] !== q.correct);
    const tagCounts = wrongQuestions.reduce((acc, q) => {
      q.tags?.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as {[key: string]: number});
    
    // Get top 3 problematic areas
    return Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag.charAt(0).toUpperCase() + tag.slice(1));
  }

  private getMasteryIndicators(skill: string, score: number, accuracy: number): string[] {
    const indicators: string[] = [];
    
    if (accuracy >= 0.9) indicators.push('High accuracy rate');
    if (score >= 85) indicators.push('Strong conceptual understanding');
    if (accuracy >= 0.8 && score >= 80) indicators.push('Consistent performance');
    
    return indicators;
  }
}

export const assessmentEngine = new AdvancedAssessmentEngine();