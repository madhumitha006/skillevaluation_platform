import api from './api';

export interface SkillRequirement {
  skill: string;
  weight: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface JobRole {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead';
  skillRequirements: SkillRequirement[];
  postedBy: {
    _id: string;
    name: string;
    company?: string;
  };
  isActive: boolean;
  applicationDeadline?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  matchScore?: number;
  skillGaps?: SkillGap[];
  recommendations?: string[];
}

export interface SkillGap {
  skill: string;
  requiredLevel: string;
  currentLevel: string;
  gap: number;
  weight: number;
}

export interface JobMatch {
  _id: string;
  user: string;
  jobRole: JobRole;
  matchScore: number;
  skillGaps: SkillGap[];
  matchedSkills: Array<{
    skill: string;
    userLevel: string;
    requiredLevel: string;
    score: number;
  }>;
  recommendations: string[];
  isBookmarked: boolean;
  hasApplied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SkillGapAnalysis {
  prioritizedSkills: Array<{
    skill: string;
    frequency: number;
    totalWeight: number;
    levels: string[];
  }>;
  recommendations: string[];
  totalJobsAnalyzed: number;
}

class JobMatchingService {
  async createJobRole(jobData: Partial<JobRole>) {
    const response = await api.post('/jobs', jobData);
    return response.data;
  }

  async getJobRoles(params?: {
    page?: number;
    limit?: number;
    search?: string;
    experienceLevel?: string;
  }) {
    const response = await api.get('/jobs', { params });
    return response.data;
  }

  async getJobRole(id: string) {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  }

  async getMatchingJobs(limit = 10) {
    const response = await api.get('/jobs/matching/recommendations', {
      params: { limit }
    });
    return response.data;
  }

  async calculateJobMatch(jobId: string) {
    const response = await api.post(`/jobs/matching/${jobId}`);
    return response.data;
  }

  async getJobMatchDetails(jobId: string) {
    const response = await api.get(`/jobs/matching/${jobId}/details`);
    return response.data;
  }

  async getSkillGapAnalysis(): Promise<{ data: SkillGapAnalysis }> {
    const response = await api.get('/jobs/analysis/skill-gaps');
    return response.data;
  }

  async toggleBookmark(jobId: string) {
    const response = await api.post(`/jobs/bookmarks/${jobId}`);
    return response.data;
  }

  async getBookmarkedJobs() {
    const response = await api.get('/jobs/bookmarks');
    return response.data;
  }
}

export default new JobMatchingService();