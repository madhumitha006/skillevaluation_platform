export interface DashboardAnalytics {
  userId: string;
  careerScore: number;
  skillVelocity: number;
  marketPosition: MarketPosition;
  careerTrajectory: CareerTrajectory;
  skillGaps: SkillGap[];
  achievements: Achievement[];
  recommendations: CareerRecommendation[];
  predictiveInsights: PredictiveInsight[];
  competitiveAnalysis: CompetitiveAnalysis;
}

export interface MarketPosition {
  percentile: number;
  salaryBand: string;
  demandLevel: 'high' | 'medium' | 'low';
  competitiveness: number;
  marketTrend: 'rising' | 'stable' | 'declining';
}

export interface CareerTrajectory {
  currentLevel: string;
  nextLevel: string;
  progressToNext: number;
  timeToPromotion: string;
  salaryGrowthPotential: number;
  skillDevelopmentNeeded: string[];
}

export interface SkillGap {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeToClose: string;
  learningResources: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'skill' | 'career' | 'learning' | 'assessment';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedDate: Date;
  xpReward: number;
  badge: string;
}

export interface CareerRecommendation {
  type: 'skill-development' | 'job-opportunity' | 'networking' | 'certification';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeframe: string;
  expectedOutcome: string;
}

export interface PredictiveInsight {
  type: 'salary' | 'promotion' | 'skill-demand' | 'market-shift';
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  actionable: boolean;
  recommendations: string[];
}

export interface CompetitiveAnalysis {
  peerComparison: PeerComparison;
  industryBenchmark: IndustryBenchmark;
  strengthsVsMarket: string[];
  improvementAreas: string[];
}

export interface PeerComparison {
  skillsRanking: number;
  experienceRanking: number;
  learningVelocity: number;
  careerProgression: number;
}

export interface IndustryBenchmark {
  averageSkillLevel: number;
  averageSalary: number;
  averageExperience: number;
  topSkills: string[];
}

export interface ActivityMetrics {
  dailyActivity: DailyActivity[];
  weeklyProgress: WeeklyProgress;
  monthlyTrends: MonthlyTrend[];
  yearlyGrowth: YearlyGrowth;
}

export interface DailyActivity {
  date: Date;
  learningTime: number;
  assessmentsTaken: number;
  skillsImproved: number;
  xpGained: number;
}

export interface WeeklyProgress {
  currentWeek: {
    learningHours: number;
    completedCourses: number;
    skillsAdvanced: number;
    assessmentScore: number;
  };
  previousWeek: {
    learningHours: number;
    completedCourses: number;
    skillsAdvanced: number;
    assessmentScore: number;
  };
  improvement: {
    learningHours: number;
    completedCourses: number;
    skillsAdvanced: number;
    assessmentScore: number;
  };
}

export class AdvancedDashboardEngine {
  private userMetrics: Map<string, DashboardAnalytics> = new Map();
  private activityData: Map<string, ActivityMetrics> = new Map();

  generateDashboardAnalytics(userId: string, userProfile: any): DashboardAnalytics {
    const analytics: DashboardAnalytics = {
      userId,
      careerScore: this.calculateCareerScore(userProfile),
      skillVelocity: this.calculateSkillVelocity(userId),
      marketPosition: this.analyzeMarketPosition(userProfile),
      careerTrajectory: this.predictCareerTrajectory(userProfile),
      skillGaps: this.identifySkillGaps(userProfile),
      achievements: this.getRecentAchievements(userId),
      recommendations: this.generateRecommendations(userProfile),
      predictiveInsights: this.generatePredictiveInsights(userProfile),
      competitiveAnalysis: this.performCompetitiveAnalysis(userProfile)
    };

    this.userMetrics.set(userId, analytics);
    return analytics;
  }

  getActivityMetrics(userId: string): ActivityMetrics {
    return this.activityData.get(userId) || this.generateMockActivityData();
  }

  updateUserActivity(userId: string, activity: Partial<DailyActivity>): void {
    let metrics = this.activityData.get(userId);
    if (!metrics) {
      metrics = this.generateMockActivityData();
    }

    const today = new Date();
    const todayActivity = metrics.dailyActivity.find(a => 
      a.date.toDateString() === today.toDateString()
    );

    if (todayActivity) {
      Object.assign(todayActivity, activity);
    } else {
      metrics.dailyActivity.push({
        date: today,
        learningTime: activity.learningTime || 0,
        assessmentsTaken: activity.assessmentsTaken || 0,
        skillsImproved: activity.skillsImproved || 0,
        xpGained: activity.xpGained || 0
      });
    }

    this.activityData.set(userId, metrics);
  }

  getCareerInsights(userId: string): CareerInsight[] {
    const analytics = this.userMetrics.get(userId);
    if (!analytics) return [];

    return [
      {
        type: 'skill-velocity',
        title: 'Learning Acceleration',
        insight: `Your skill development is ${analytics.skillVelocity > 1.2 ? 'accelerating' : 'steady'}`,
        recommendation: analytics.skillVelocity < 1.0 ? 'Consider increasing daily learning time' : 'Maintain current pace',
        impact: analytics.skillVelocity > 1.5 ? 'high' : 'medium'
      },
      {
        type: 'market-position',
        title: 'Market Competitiveness',
        insight: `You're in the ${analytics.marketPosition.percentile}th percentile of professionals`,
        recommendation: analytics.marketPosition.percentile < 70 ? 'Focus on high-demand skills' : 'Consider leadership roles',
        impact: 'high'
      },
      {
        type: 'career-trajectory',
        title: 'Promotion Readiness',
        insight: `${analytics.careerTrajectory.progressToNext}% ready for next level`,
        recommendation: `Focus on: ${analytics.careerTrajectory.skillDevelopmentNeeded.slice(0, 2).join(', ')}`,
        impact: 'high'
      }
    ];
  }

  private calculateCareerScore(userProfile: any): number {
    let score = 0;
    
    // Skills contribution (40%)
    const skillsScore = Object.values(userProfile.skillLevels || {}).reduce((sum: number, level: any) => sum + level, 0) / Object.keys(userProfile.skillLevels || {}).length;
    score += (skillsScore / 5) * 40;

    // Experience contribution (30%)
    const expScore = Math.min(userProfile.experience || 0, 10) / 10;
    score += expScore * 30;

    // Learning activity (20%)
    const activityScore = 0.8; // Mock activity score
    score += activityScore * 20;

    // Market demand (10%)
    const demandScore = 0.9; // Mock demand score
    score += demandScore * 10;

    return Math.round(score);
  }

  private calculateSkillVelocity(userId: string): number {
    // Mock calculation - in real app, would analyze skill improvement over time
    return 1.3; // 30% above average learning rate
  }

  private analyzeMarketPosition(userProfile: any): MarketPosition {
    return {
      percentile: 78,
      salaryBand: '$90k - $130k',
      demandLevel: 'high',
      competitiveness: 85,
      marketTrend: 'rising'
    };
  }

  private predictCareerTrajectory(userProfile: any): CareerTrajectory {
    return {
      currentLevel: 'Mid-Level Developer',
      nextLevel: 'Senior Developer',
      progressToNext: 72,
      timeToPromotion: '8-12 months',
      salaryGrowthPotential: 25,
      skillDevelopmentNeeded: ['System Design', 'Leadership', 'Architecture']
    };
  }

  private identifySkillGaps(userProfile: any): SkillGap[] {
    return [
      {
        skill: 'System Design',
        currentLevel: 2,
        targetLevel: 4,
        priority: 'critical',
        timeToClose: '3-4 months',
        learningResources: ['System Design Course', 'Architecture Patterns', 'Case Studies']
      },
      {
        skill: 'Leadership',
        currentLevel: 1,
        targetLevel: 3,
        priority: 'high',
        timeToClose: '6-8 months',
        learningResources: ['Leadership Training', 'Mentoring Program', 'Team Projects']
      },
      {
        skill: 'DevOps',
        currentLevel: 2,
        targetLevel: 3,
        priority: 'medium',
        timeToClose: '2-3 months',
        learningResources: ['Docker Course', 'Kubernetes Training', 'CI/CD Pipeline']
      }
    ];
  }

  private getRecentAchievements(userId: string): Achievement[] {
    return [
      {
        id: '1',
        title: 'JavaScript Master',
        description: 'Achieved expert level in JavaScript',
        category: 'skill',
        rarity: 'epic',
        earnedDate: new Date('2024-01-15'),
        xpReward: 500,
        badge: '🏆'
      },
      {
        id: '2',
        title: 'Learning Streak Champion',
        description: '30-day learning streak',
        category: 'learning',
        rarity: 'rare',
        earnedDate: new Date('2024-01-10'),
        xpReward: 300,
        badge: '🔥'
      },
      {
        id: '3',
        title: 'Assessment Ace',
        description: 'Scored 95%+ on 5 assessments',
        category: 'assessment',
        rarity: 'rare',
        earnedDate: new Date('2024-01-08'),
        xpReward: 250,
        badge: '🎯'
      }
    ];
  }

  private generateRecommendations(userProfile: any): CareerRecommendation[] {
    return [
      {
        type: 'skill-development',
        title: 'Master System Design',
        description: 'Critical skill for senior roles',
        impact: 'high',
        effort: 'high',
        timeframe: '3-4 months',
        expectedOutcome: '25% salary increase potential'
      },
      {
        type: 'certification',
        title: 'AWS Solutions Architect',
        description: 'High-demand cloud certification',
        impact: 'high',
        effort: 'medium',
        timeframe: '2-3 months',
        expectedOutcome: 'Increased job opportunities'
      },
      {
        type: 'networking',
        title: 'Join Tech Meetups',
        description: 'Expand professional network',
        impact: 'medium',
        effort: 'low',
        timeframe: 'Ongoing',
        expectedOutcome: 'Better job referrals'
      }
    ];
  }

  private generatePredictiveInsights(userProfile: any): PredictiveInsight[] {
    return [
      {
        type: 'salary',
        title: 'Salary Growth Prediction',
        prediction: '30% increase within 18 months',
        confidence: 85,
        timeframe: '12-18 months',
        actionable: true,
        recommendations: ['Complete system design course', 'Lead a major project', 'Get AWS certification']
      },
      {
        type: 'skill-demand',
        title: 'AI/ML Skills Rising',
        prediction: 'AI skills demand will increase 40%',
        confidence: 92,
        timeframe: '6-12 months',
        actionable: true,
        recommendations: ['Start ML fundamentals course', 'Build AI projects', 'Join AI communities']
      },
      {
        type: 'promotion',
        title: 'Senior Role Readiness',
        prediction: 'Ready for senior role in 8 months',
        confidence: 78,
        timeframe: '6-10 months',
        actionable: true,
        recommendations: ['Improve system design skills', 'Take on leadership tasks', 'Mentor junior developers']
      }
    ];
  }

  private performCompetitiveAnalysis(userProfile: any): CompetitiveAnalysis {
    return {
      peerComparison: {
        skillsRanking: 78,
        experienceRanking: 65,
        learningVelocity: 85,
        careerProgression: 72
      },
      industryBenchmark: {
        averageSkillLevel: 3.2,
        averageSalary: 95000,
        averageExperience: 4.5,
        topSkills: ['React', 'Node.js', 'AWS', 'TypeScript']
      },
      strengthsVsMarket: [
        'Above-average learning velocity',
        'Strong technical skills',
        'High assessment scores'
      ],
      improvementAreas: [
        'System design knowledge',
        'Leadership experience',
        'Industry networking'
      ]
    };
  }

  private generateMockActivityData(): ActivityMetrics {
    const dailyActivity: DailyActivity[] = [];
    const today = new Date();
    
    // Generate last 30 days of activity
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      dailyActivity.push({
        date,
        learningTime: Math.floor(Math.random() * 120) + 30, // 30-150 minutes
        assessmentsTaken: Math.floor(Math.random() * 3),
        skillsImproved: Math.floor(Math.random() * 2),
        xpGained: Math.floor(Math.random() * 200) + 50
      });
    }

    return {
      dailyActivity,
      weeklyProgress: {
        currentWeek: {
          learningHours: 8.5,
          completedCourses: 2,
          skillsAdvanced: 3,
          assessmentScore: 87
        },
        previousWeek: {
          learningHours: 6.2,
          completedCourses: 1,
          skillsAdvanced: 2,
          assessmentScore: 82
        },
        improvement: {
          learningHours: 2.3,
          completedCourses: 1,
          skillsAdvanced: 1,
          assessmentScore: 5
        }
      },
      monthlyTrends: [
        { month: 'Jan', learningHours: 32, skillsGained: 8, assessmentAvg: 85 },
        { month: 'Dec', learningHours: 28, skillsGained: 6, assessmentAvg: 82 },
        { month: 'Nov', learningHours: 25, skillsGained: 5, assessmentAvg: 79 }
      ],
      yearlyGrowth: {
        totalLearningHours: 380,
        skillsAcquired: 24,
        coursesCompleted: 18,
        averageAssessmentScore: 84,
        careerProgressionScore: 78
      }
    };
  }
}

interface CareerInsight {
  type: string;
  title: string;
  insight: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}

interface MonthlyTrend {
  month: string;
  learningHours: number;
  skillsGained: number;
  assessmentAvg: number;
}

interface YearlyGrowth {
  totalLearningHours: number;
  skillsAcquired: number;
  coursesCompleted: number;
  averageAssessmentScore: number;
  careerProgressionScore: number;
}

export const dashboardEngine = new AdvancedDashboardEngine();