export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: SalaryRange;
  matchScore: number;
  matchReasons: string[];
  skillsMatch: SkillMatch[];
  requirements: string[];
  benefits: string[];
  description: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  experience: string;
  postedDate: Date;
  applicationDeadline?: Date;
  companyInfo: CompanyInfo;
  careerGrowth: CareerGrowthInfo;
  workCulture: WorkCultureInfo;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
  equity?: boolean;
  bonus?: string;
}

export interface SkillMatch {
  skill: string;
  required: boolean;
  userLevel: number;
  requiredLevel: number;
  match: 'perfect' | 'good' | 'partial' | 'missing';
}

export interface CompanyInfo {
  size: string;
  industry: string;
  founded: number;
  rating: number;
  reviews: number;
  logo: string;
  culture: string[];
  techStack: string[];
}

export interface CareerGrowthInfo {
  promotionRate: number;
  learningOpportunities: string[];
  mentorshipAvailable: boolean;
  careerPath: string[];
}

export interface WorkCultureInfo {
  workLifeBalance: number;
  diversity: number;
  innovation: number;
  collaboration: number;
  flexibility: number;
}

export interface JobSearchFilters {
  location?: string[];
  salary?: { min: number; max: number };
  experience?: string[];
  jobType?: string[];
  remote?: boolean;
  skills?: string[];
  company?: string[];
  industry?: string[];
}

export interface MarketInsights {
  averageSalary: number;
  salaryTrend: 'up' | 'down' | 'stable';
  demandLevel: 'high' | 'medium' | 'low';
  skillsInDemand: string[];
  topCompanies: string[];
  locationHotspots: string[];
  growthProjection: number;
}

export class AdvancedJobMatchingEngine {
  private userProfile: UserProfile | null = null;
  private marketData: Map<string, MarketInsights> = new Map();

  setUserProfile(profile: UserProfile): void {
    this.userProfile = profile;
  }

  findMatches(filters: JobSearchFilters = {}): JobMatch[] {
    const allJobs = this.getAllJobs();
    let filteredJobs = this.applyFilters(allJobs, filters);
    
    if (this.userProfile) {
      filteredJobs = this.calculateMatchScores(filteredJobs);
      filteredJobs.sort((a, b) => b.matchScore - a.matchScore);
    }

    return filteredJobs.slice(0, 20);
  }

  getPersonalizedRecommendations(): JobMatch[] {
    if (!this.userProfile) return [];

    const recommendations = this.getAllJobs()
      .map(job => this.calculateDetailedMatch(job))
      .filter(job => job.matchScore >= 70)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10);

    return recommendations;
  }

  getMarketInsights(role: string): MarketInsights {
    return this.marketData.get(role) || this.generateMarketInsights(role);
  }

  getSalaryInsights(role: string, location: string, experience: string): SalaryInsights {
    const baseInsights = this.getMarketInsights(role);
    
    return {
      averageSalary: this.adjustSalaryForLocation(baseInsights.averageSalary, location),
      salaryRange: {
        min: Math.round(baseInsights.averageSalary * 0.8),
        max: Math.round(baseInsights.averageSalary * 1.4)
      },
      experienceMultiplier: this.getExperienceMultiplier(experience),
      locationFactor: this.getLocationFactor(location),
      skillPremiums: this.getSkillPremiums(role),
      negotiationTips: this.getNegotiationTips(role, experience)
    };
  }

  getCareerPath(currentRole: string, targetRole: string): CareerPathSuggestion {
    return {
      steps: this.generateCareerSteps(currentRole, targetRole),
      timeframe: this.estimateTimeframe(currentRole, targetRole),
      skillsToAcquire: this.getRequiredSkills(targetRole),
      certifications: this.getRecommendedCertifications(targetRole),
      salaryProgression: this.getSalaryProgression(currentRole, targetRole)
    };
  }

  private calculateDetailedMatch(job: JobMatch): JobMatch {
    if (!this.userProfile) return { ...job, matchScore: 0 };

    let score = 0;
    const reasons: string[] = [];
    const skillsMatch: SkillMatch[] = [];

    // Skills matching (40% weight)
    const skillScore = this.calculateSkillMatch(job, skillsMatch, reasons);
    score += skillScore * 0.4;

    // Experience matching (25% weight)
    const expScore = this.calculateExperienceMatch(job, reasons);
    score += expScore * 0.25;

    // Location preference (15% weight)
    const locationScore = this.calculateLocationMatch(job, reasons);
    score += locationScore * 0.15;

    // Salary expectations (10% weight)
    const salaryScore = this.calculateSalaryMatch(job, reasons);
    score += salaryScore * 0.1;

    // Company culture fit (10% weight)
    const cultureScore = this.calculateCultureMatch(job, reasons);
    score += cultureScore * 0.1;

    return {
      ...job,
      matchScore: Math.round(score),
      matchReasons: reasons,
      skillsMatch
    };
  }

  private calculateSkillMatch(job: JobMatch, skillsMatch: SkillMatch[], reasons: string[]): number {
    if (!this.userProfile) return 0;

    const userSkills = this.userProfile.skills;
    const requiredSkills = job.requirements.filter(req => 
      userSkills.some(skill => req.toLowerCase().includes(skill.toLowerCase()))
    );

    let totalScore = 0;
    let matchedSkills = 0;

    requiredSkills.forEach(reqSkill => {
      const userSkill = userSkills.find(skill => 
        reqSkill.toLowerCase().includes(skill.toLowerCase())
      );
      
      if (userSkill) {
        const userLevel = this.userProfile!.skillLevels[userSkill] || 1;
        const requiredLevel = this.estimateRequiredLevel(reqSkill);
        
        let match: 'perfect' | 'good' | 'partial' | 'missing' = 'missing';
        let score = 0;

        if (userLevel >= requiredLevel) {
          match = userLevel > requiredLevel ? 'perfect' : 'good';
          score = userLevel >= requiredLevel + 1 ? 100 : 85;
        } else if (userLevel >= requiredLevel - 1) {
          match = 'partial';
          score = 60;
        }

        skillsMatch.push({
          skill: userSkill,
          required: true,
          userLevel,
          requiredLevel,
          match
        });

        totalScore += score;
        matchedSkills++;

        if (match === 'perfect') {
          reasons.push(`Strong match in ${userSkill}`);
        }
      }
    });

    if (matchedSkills > 0) {
      const avgScore = totalScore / matchedSkills;
      if (avgScore >= 85) {
        reasons.push(`Excellent skills alignment (${matchedSkills} key skills)`);
      }
      return avgScore;
    }

    return 0;
  }

  private calculateExperienceMatch(job: JobMatch, reasons: string[]): number {
    if (!this.userProfile) return 0;

    const userExp = this.userProfile.experience;
    const requiredExp = this.parseExperienceRequirement(job.experience);

    if (userExp >= requiredExp.min && userExp <= requiredExp.max + 2) {
      if (userExp >= requiredExp.min && userExp <= requiredExp.max) {
        reasons.push('Perfect experience match');
        return 100;
      } else {
        reasons.push('Good experience level');
        return 80;
      }
    } else if (userExp >= requiredExp.min - 1) {
      reasons.push('Close experience match');
      return 60;
    }

    return 30;
  }

  private calculateLocationMatch(job: JobMatch, reasons: string[]): number {
    if (!this.userProfile) return 50;

    const userLocation = this.userProfile.preferredLocations;
    
    if (job.type === 'remote' && this.userProfile.remotePreference) {
      reasons.push('Remote work available');
      return 100;
    }

    if (userLocation.includes(job.location)) {
      reasons.push('Preferred location');
      return 100;
    }

    return 30;
  }

  private calculateSalaryMatch(job: JobMatch, reasons: string[]): number {
    if (!this.userProfile) return 50;

    const userExpectation = this.userProfile.salaryExpectation;
    const jobSalary = (job.salary.min + job.salary.max) / 2;

    if (jobSalary >= userExpectation) {
      if (jobSalary >= userExpectation * 1.2) {
        reasons.push('Excellent salary package');
        return 100;
      } else {
        reasons.push('Competitive salary');
        return 85;
      }
    } else if (jobSalary >= userExpectation * 0.9) {
      return 60;
    }

    return 30;
  }

  private calculateCultureMatch(job: JobMatch, reasons: string[]): number {
    if (!this.userProfile) return 50;

    const userPreferences = this.userProfile.culturePreferences;
    const companyCulture = job.companyInfo.culture;

    const matches = userPreferences.filter(pref => 
      companyCulture.some(culture => 
        culture.toLowerCase().includes(pref.toLowerCase())
      )
    );

    if (matches.length >= userPreferences.length * 0.7) {
      reasons.push('Great culture fit');
      return 90;
    } else if (matches.length >= userPreferences.length * 0.5) {
      return 70;
    }

    return 40;
  }

  private getAllJobs(): JobMatch[] {
    // Mock job data - in real app, this would come from API
    return [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: { min: 120000, max: 160000, currency: 'USD', period: 'yearly', equity: true },
        matchScore: 0,
        matchReasons: [],
        skillsMatch: [],
        requirements: ['React', 'TypeScript', 'Node.js', '5+ years experience'],
        benefits: ['Health Insurance', 'Stock Options', 'Flexible Hours', 'Remote Work'],
        description: 'Join our team to build cutting-edge web applications...',
        type: 'full-time',
        experience: '5-8 years',
        postedDate: new Date('2024-01-15'),
        companyInfo: {
          size: '500-1000',
          industry: 'Technology',
          founded: 2015,
          rating: 4.5,
          reviews: 234,
          logo: '/api/placeholder/100/100',
          culture: ['Innovation', 'Work-Life Balance', 'Growth'],
          techStack: ['React', 'Node.js', 'AWS', 'Docker']
        },
        careerGrowth: {
          promotionRate: 85,
          learningOpportunities: ['Conferences', 'Internal Training', 'Mentorship'],
          mentorshipAvailable: true,
          careerPath: ['Senior Developer', 'Tech Lead', 'Engineering Manager']
        },
        workCulture: {
          workLifeBalance: 4.2,
          diversity: 4.0,
          innovation: 4.8,
          collaboration: 4.3,
          flexibility: 4.5
        }
      }
      // Add more mock jobs...
    ];
  }

  private applyFilters(jobs: JobMatch[], filters: JobSearchFilters): JobMatch[] {
    return jobs.filter(job => {
      if (filters.location?.length && !filters.location.includes(job.location)) return false;
      if (filters.jobType?.length && !filters.jobType.includes(job.type)) return false;
      if (filters.remote && job.type !== 'remote') return false;
      if (filters.salary && (job.salary.max < filters.salary.min || job.salary.min > filters.salary.max)) return false;
      return true;
    });
  }

  private calculateMatchScores(jobs: JobMatch[]): JobMatch[] {
    return jobs.map(job => this.calculateDetailedMatch(job));
  }

  private generateMarketInsights(role: string): MarketInsights {
    // Mock market data
    const insights: MarketInsights = {
      averageSalary: 95000,
      salaryTrend: 'up',
      demandLevel: 'high',
      skillsInDemand: ['React', 'TypeScript', 'Node.js', 'AWS'],
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta'],
      locationHotspots: ['San Francisco', 'Seattle', 'New York', 'Austin'],
      growthProjection: 15
    };

    this.marketData.set(role, insights);
    return insights;
  }

  private adjustSalaryForLocation(baseSalary: number, location: string): number {
    const locationMultipliers: { [key: string]: number } = {
      'San Francisco': 1.4,
      'New York': 1.3,
      'Seattle': 1.2,
      'Austin': 1.0,
      'Remote': 1.1
    };

    return Math.round(baseSalary * (locationMultipliers[location] || 1.0));
  }

  private getExperienceMultiplier(experience: string): number {
    const multipliers: { [key: string]: number } = {
      'entry': 0.8,
      'junior': 0.9,
      'mid': 1.0,
      'senior': 1.3,
      'lead': 1.6,
      'principal': 2.0
    };

    return multipliers[experience.toLowerCase()] || 1.0;
  }

  private getLocationFactor(location: string): number {
    return this.adjustSalaryForLocation(1, location);
  }

  private getSkillPremiums(role: string): { [skill: string]: number } {
    return {
      'React': 5000,
      'TypeScript': 8000,
      'AWS': 12000,
      'Docker': 6000,
      'Kubernetes': 15000
    };
  }

  private getNegotiationTips(role: string, experience: string): string[] {
    return [
      'Research market rates for your location and experience level',
      'Highlight your unique skills and achievements',
      'Consider total compensation, not just base salary',
      'Be prepared to discuss your value proposition'
    ];
  }

  private generateCareerSteps(current: string, target: string): CareerStep[] {
    return [
      {
        title: 'Skill Development',
        description: 'Acquire missing technical skills',
        duration: '3-6 months',
        priority: 'high'
      },
      {
        title: 'Portfolio Building',
        description: 'Create projects showcasing target role skills',
        duration: '2-4 months',
        priority: 'high'
      },
      {
        title: 'Networking',
        description: 'Connect with professionals in target role',
        duration: 'Ongoing',
        priority: 'medium'
      }
    ];
  }

  private estimateTimeframe(current: string, target: string): string {
    return '6-12 months';
  }

  private getRequiredSkills(role: string): string[] {
    const skillMap: { [key: string]: string[] } = {
      'Senior Frontend Developer': ['React', 'TypeScript', 'Testing', 'Performance Optimization'],
      'Full Stack Developer': ['React', 'Node.js', 'Databases', 'DevOps'],
      'Tech Lead': ['Leadership', 'Architecture', 'Mentoring', 'Project Management']
    };

    return skillMap[role] || [];
  }

  private getRecommendedCertifications(role: string): string[] {
    return ['AWS Certified Developer', 'React Professional', 'Scrum Master'];
  }

  private getSalaryProgression(current: string, target: string): SalaryProgression {
    return {
      currentRange: { min: 80000, max: 120000 },
      targetRange: { min: 120000, max: 160000 },
      growthPotential: 40,
      timeToTarget: '12-18 months'
    };
  }

  private parseExperienceRequirement(exp: string): { min: number; max: number } {
    const match = exp.match(/(\d+)[-+]?\s*(?:to\s*(\d+))?\s*years?/i);
    if (match) {
      const min = parseInt(match[1]);
      const max = match[2] ? parseInt(match[2]) : min + 2;
      return { min, max };
    }
    return { min: 0, max: 10 };
  }

  private estimateRequiredLevel(skill: string): number {
    // Estimate skill level based on context
    if (skill.toLowerCase().includes('senior') || skill.toLowerCase().includes('lead')) return 4;
    if (skill.toLowerCase().includes('experience')) return 3;
    return 2;
  }
}

interface UserProfile {
  skills: string[];
  skillLevels: { [skill: string]: number };
  experience: number;
  preferredLocations: string[];
  remotePreference: boolean;
  salaryExpectation: number;
  culturePreferences: string[];
}

interface SalaryInsights {
  averageSalary: number;
  salaryRange: { min: number; max: number };
  experienceMultiplier: number;
  locationFactor: number;
  skillPremiums: { [skill: string]: number };
  negotiationTips: string[];
}

interface CareerPathSuggestion {
  steps: CareerStep[];
  timeframe: string;
  skillsToAcquire: string[];
  certifications: string[];
  salaryProgression: SalaryProgression;
}

interface CareerStep {
  title: string;
  description: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
}

interface SalaryProgression {
  currentRange: { min: number; max: number };
  targetRange: { min: number; max: number };
  growthPotential: number;
  timeToTarget: string;
}

export const jobMatchingEngine = new AdvancedJobMatchingEngine();