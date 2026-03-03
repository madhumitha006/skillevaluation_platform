import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/context/AuthStore';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, login, register, logout, loadUser } = useAuthStore();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      loadUser();
      hasLoadedRef.current = true;
    }
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};
