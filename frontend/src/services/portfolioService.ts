import api from './api';

export interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  score: number;
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Tools' | 'Frameworks';
  yearsOfExperience?: number;
  isVisible: boolean;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  logo?: string;
  isVisible: boolean;
}

export interface Achievement {
  title: string;
  description?: string;
  date: string;
  type: 'Award' | 'Competition' | 'Project' | 'Recognition' | 'Publication';
  organization?: string;
  url?: string;
  isVisible: boolean;
}

export interface Portfolio {
  _id: string;
  user: string;
  slug: string;
  isPublic: boolean;
  personalInfo: {
    displayName?: string;
    title?: string;
    bio?: string;
    aiGeneratedBio?: string;
    location?: string;
    website?: string;
    avatar?: string;
    contactEmail?: string;
    phone?: string;
    socialLinks?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      portfolio?: string;
    };
  };
  skills: Skill[];
  certifications: Certification[];
  achievements: Achievement[];
  experience: any[];
  projects: any[];
  theme: {
    primaryColor: string;
    layout: 'modern' | 'classic' | 'minimal' | 'creative';
  };
  analytics: {
    views: number;
    uniqueViews: number;
    lastViewed?: string;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface SkillInsights {
  totalSkills: number;
  strongestCategory: {
    category: string;
    avgScore: number;
  };
  averageScore: number;
  recommendations: string[];
  radarData: Array<{
    category: string;
    score: number;
    fullMark: number;
  }>;
}

class PortfolioService {
  async getPortfolio() {
    const response = await api.get('/portfolio');
    return response.data;
  }

  async updatePortfolio(portfolioData: Partial<Portfolio>) {
    const response = await api.put('/portfolio', portfolioData);
    return response.data;
  }

  async getPublicPortfolio(slug: string) {
    const response = await api.get(`/portfolio/public/${slug}`);
    return response.data;
  }

  async generateAIBio() {
    const response = await api.post('/portfolio/generate-bio');
    return response.data;
  }

  async getSkillInsights(): Promise<{ data: SkillInsights }> {
    const response = await api.get('/portfolio/insights');
    return response.data;
  }

  async toggleVisibility() {
    const response = await api.post('/portfolio/toggle-visibility');
    return response.data;
  }

  async getAnalytics() {
    const response = await api.get('/portfolio/analytics');
    return response.data;
  }

  async exportPDF() {
    const response = await api.get('/portfolio/export/pdf', {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'portfolio.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  }
}

export default new PortfolioService();