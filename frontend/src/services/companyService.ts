import api from './api';

export interface Company {
  _id: string;
  name: string;
  slug: string;
  domain: string;
  logo?: string;
  description?: string;
  industry?: string;
  size?: string;
  subscription: {
    plan: {
      name: string;
      maxUsers: number;
      maxJobPostings: number;
      features: string[];
      price: {
        monthly: number;
        yearly: number;
      };
    };
    status: 'active' | 'suspended' | 'cancelled' | 'trial';
    startDate: string;
    endDate?: string;
    trialEndsAt?: string;
  };
  settings: {
    allowedDomains: string[];
    requireEmailVerification: boolean;
    customBranding?: {
      primaryColor?: string;
      secondaryColor?: string;
      logoUrl?: string;
    };
  };
  usage: {
    currentUsers: number;
    currentJobPostings: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  isActive: boolean;
  lastLogin?: string;
  invitedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface DashboardStats {
  users: {
    current: number;
    limit: number;
    percentage: number;
  };
  jobs: {
    current: number;
    limit: number;
    percentage: number;
  };
  subscription: {
    plan: string;
    status: string;
    trialEndsAt?: string;
    features: string[];
  };
}

class CompanyService {
  private getTenantHeaders() {
    const tenant = localStorage.getItem('currentTenant');
    return tenant ? { 'X-Tenant': tenant } : {};
  }

  async createCompany(companyData: {
    name: string;
    domain: string;
    adminUser: {
      name: string;
      email: string;
      password: string;
    };
    plan?: string;
  }) {
    const response = await api.post('/company/register', companyData);
    return response.data;
  }

  async getCompany() {
    const response = await api.get('/company', {
      headers: this.getTenantHeaders()
    });
    return response.data;
  }

  async updateCompany(updates: Partial<Company>) {
    const response = await api.put('/company', updates, {
      headers: this.getTenantHeaders()
    });
    return response.data;
  }

  async inviteUser(userData: {
    email: string;
    role: string;
    permissions?: string[];
  }) {
    const response = await api.post('/company/users/invite', userData, {
      headers: this.getTenantHeaders()
    });
    return response.data;
  }

  async getCompanyUsers(params?: {
    page?: number;
    limit?: number;
    role?: string;
  }) {
    const response = await api.get('/company/users', {
      params,
      headers: this.getTenantHeaders()
    });
    return response.data;
  }

  async updateSubscription(plan: string) {
    const response = await api.put('/company/subscription', { plan }, {
      headers: this.getTenantHeaders()
    });
    return response.data;
  }

  async getSubscriptionPlans() {
    const response = await api.get('/company/plans');
    return response.data;
  }

  async getDashboardStats(): Promise<{ data: DashboardStats }> {
    const response = await api.get('/company/dashboard/stats', {
      headers: this.getTenantHeaders()
    });
    return response.data;
  }

  setCurrentTenant(tenantSlug: string) {
    localStorage.setItem('currentTenant', tenantSlug);
  }

  getCurrentTenant(): string | null {
    return localStorage.getItem('currentTenant');
  }

  clearCurrentTenant() {
    localStorage.removeItem('currentTenant');
  }
}

export default new CompanyService();