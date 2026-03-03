import api from './api';

export interface ProjectSubmission {
  projectName: string;
  description: string;
  githubUrl?: string;
  projectType: 'web' | 'mobile' | 'desktop' | 'api' | 'library' | 'other';
  technologies: string[];
}

export interface EvaluationCriteria {
  name: string;
  score: number;
  weight: number;
  feedback: string;
  suggestions: string[];
}

export interface AIAnalysis {
  codeQuality: {
    score: number;
    issues: string[];
    suggestions: string[];
  };
  documentation: {
    score: number;
    coverage: string;
    suggestions: string[];
  };
  structure: {
    score: number;
    patterns: string[];
    suggestions: string[];
  };
  scalability: {
    score: number;
    concerns: string[];
    suggestions: string[];
  };
}

export interface ProjectEvaluation {
  _id: string;
  user: string;
  projectName: string;
  description: string;
  githubUrl?: string;
  projectType: string;
  technologies: string[];
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  evaluationCriteria: EvaluationCriteria[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  aiAnalysis: AIAnalysis;
  evaluationStatus: 'pending' | 'analyzing' | 'completed' | 'failed';
  evaluatedAt: string;
  processingTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationStats {
  totalEvaluations: number;
  averageScore: number;
  gradeDistribution: { [key: string]: number };
  recentEvaluations: Array<{
    _id: string;
    projectName: string;
    overallScore: number;
    grade: string;
    evaluatedAt: string;
  }>;
  improvementTrend: {
    trend: 'improving' | 'declining' | 'stable' | 'insufficient_data' | 'error';
    change: number;
  };
}

export interface EvaluationReport {
  projectInfo: {
    name: string;
    description: string;
    githubUrl?: string;
    technologies: string[];
    type: string;
  };
  summary: {
    overallScore: number;
    grade: string;
    evaluatedAt: string;
    processingTime: number;
  };
  breakdown: EvaluationCriteria[];
  analysis: AIAnalysis;
  insights: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

class ProjectEvaluationService {
  async submitProject(projectData: ProjectSubmission) {
    const response = await api.post('/project-evaluation/submit', projectData);
    return response.data;
  }

  async getEvaluation(id: string) {
    const response = await api.get(`/project-evaluation/${id}`);
    return response.data;
  }

  async getEvaluationHistory(params?: {
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/project-evaluation/history', { params });
    return response.data;
  }

  async getEvaluationStats(): Promise<{ data: EvaluationStats }> {
    const response = await api.get('/project-evaluation/stats');
    return response.data;
  }

  async deleteEvaluation(id: string) {
    const response = await api.delete(`/project-evaluation/${id}`);
    return response.data;
  }

  async getEvaluationReport(id: string): Promise<{ data: EvaluationReport }> {
    const response = await api.get(`/project-evaluation/${id}/report`);
    return response.data;
  }
}

export default new ProjectEvaluationService();