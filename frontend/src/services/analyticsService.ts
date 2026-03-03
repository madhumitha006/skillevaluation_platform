import api from './api';

export interface UserMetrics {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  usersByRole: {
    students: number;
    recruiters: number;
    company_admins: number;
    hr_managers: number;
  };
  userGrowthRate: number;
  activeUserRate: number;
}

export interface SkillMetrics {
  totalSkillAssessments: number;
  topSkills: Array<{
    skill: string;
    count: number;
    averageScore: number;
    growth?: number;
  }>;
  skillTrends: Array<{
    skill: string;
    growth: number;
    popularity: number;
  }>;
}

export interface TestMetrics {
  totalTests: number;
  completedTests: number;
  completionRate: number;
  averageScore: number;
  testsByType: {
    adaptive: number;
    interviews: number;
    projects: number;
  };
}

export interface AIMetrics {
  totalAIRequests: number;
  aiFeatureUsage: {
    bioGeneration: number;
    projectEvaluation: number;
    careerSimulation: number;
    chatAssistant: number;
  };
  averageResponseTime: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  subscriptionRevenue: number;
  revenueByPlan: {
    starter: number;
    professional: number;
    enterprise: number;
  };
  mrr: number;
  churnRate: number;
}

export interface PlatformMetrics {
  totalCompanies: number;
  activeCompanies: number;
  totalJobPostings: number;
  portfolioViews: number;
}

export interface DashboardData {
  period: string;
  dateRange: {
    start: string;
    end: string;
  };
  userMetrics: UserMetrics;
  skillMetrics: SkillMetrics;
  testMetrics: TestMetrics;
  aiMetrics: AIMetrics;
  revenueMetrics: RevenueMetrics;
  platformMetrics: PlatformMetrics;
  lastUpdated: string;
}

export interface HistoricalDataPoint {
  date: string;
  userMetrics: UserMetrics;
  revenueMetrics: RevenueMetrics;
  aiMetrics: AIMetrics;
  testMetrics: TestMetrics;
}

export interface MetricTrend {
  metric: string;
  trend: Array<{
    date: string;
    value: number;
    period: string;
  }>;
  summary: {
    current: number;
    previous: number;
    change: number;
    direction: 'up' | 'down' | 'stable';
  };
}

class AnalyticsService {
  async getDashboardData(params?: {
    period?: 'daily' | 'weekly' | 'monthly';
    startDate?: string;
    endDate?: string;
  }): Promise<{ data: DashboardData }> {
    const response = await api.get('/admin/analytics/dashboard', { params });
    return response.data;
  }

  async getHistoricalData(params?: {
    period?: 'daily' | 'weekly' | 'monthly';
    months?: number;
  }): Promise<{ data: HistoricalDataPoint[] }> {
    const response = await api.get('/admin/analytics/historical', { params });
    return response.data;
  }

  async getRealTimeMetrics(): Promise<{ data: DashboardData }> {
    const response = await api.get('/admin/analytics/realtime');
    return response.data;
  }

  async getMetricTrends(metric: string, params?: {
    period?: 'daily' | 'weekly' | 'monthly';
    months?: number;
  }): Promise<{ data: MetricTrend }> {
    const response = await api.get(`/admin/analytics/trends/${metric}`, { params });
    return response.data;
  }

  async exportReport(format: 'json' | 'csv' = 'json', period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    const response = await api.get('/admin/analytics/export', {
      params: { format, period },
      responseType: format === 'csv' ? 'blob' : 'json'
    });

    if (format === 'csv') {
      // Create download link for CSV
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return { success: true };
    }

    return response.data;
  }
}

export default new AnalyticsService();