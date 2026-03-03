import { create } from 'zustand';
import { User, LoginCredentials, RegisterData } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (credentials) => {
    // Mock login - always succeed with any credentials
    const mockUser = {
      id: '1',
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: 'student'
    };
    const mockToken = 'mock-access-token';
    const mockRefreshToken = 'mock-refresh-token';
    
    localStorage.setItem('accessToken', mockToken);
    localStorage.setItem('refreshToken', mockRefreshToken);
    set({ user: mockUser, isAuthenticated: true });
  },

  register: async (data) => {
    const { user, accessToken, refreshToken } = await authService.register(data);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await authService.logout();
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const user = await authService.getProfile();
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      localStorage.clear();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
