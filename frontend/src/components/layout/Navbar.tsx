import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { NotificationBell } from '../common/NotificationBell';
import { BriefcaseIcon, HomeIcon, AcademicCapIcon, UserGroupIcon, UserIcon, CodeBracketIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/jobs', label: 'Job Matching', icon: BriefcaseIcon },
    { path: '/learning', label: 'Learning', icon: AcademicCapIcon },
    { path: '/portfolio', label: 'Portfolio', icon: UserIcon },
    { path: '/project-evaluation', label: 'Project Evaluation', icon: CodeBracketIcon },
    { path: '/career-simulator', label: 'Career Simulator', icon: ChartBarIcon },
    ...(user?.role === 'admin' || user?.role === 'super_admin' ? [
      { path: '/admin', label: 'Admin Dashboard', icon: CogIcon }
    ] : []),
    ...(user?.role === 'company_admin' || user?.role === 'hr_manager' ? [
      { path: '/company', label: 'Company', icon: UserGroupIcon }
    ] : []),
    ...(user?.role === 'recruiter' || user?.role === 'admin' || user?.role === 'company_admin' ? [
      { path: '/recruiter', label: 'Recruiter', icon: UserGroupIcon },
      { path: '/jobs/post', label: 'Post Job', icon: BriefcaseIcon }
    ] : [])
  ];

  return (
    <motion.nav 
      className="glass border-b border-gray-200/50 dark:border-white/10 sticky top-0 z-40 backdrop-blur-xl relative overflow-hidden"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-electric-500/5 via-violet-500/5 to-electric-500/5"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />
      
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-10">
        <motion.div 
          className="flex items-center gap-3"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link to="/" className="flex items-center gap-3">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-violet-600 flex items-center justify-center shadow-lg shadow-electric-500/30"
              whileHover={{ 
                scale: 1.1, 
                rotate: 360,
                boxShadow: "0 0 25px rgba(59, 130, 246, 0.6)"
              }}
              transition={{ duration: 0.6 }}
            >
              <motion.svg 
                className="w-6 h-6 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </motion.svg>
            </motion.div>
            <motion.h1 
              className="text-2xl font-bold bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              SkillNexus
            </motion.h1>
          </Link>
        </motion.div>
        
        {/* Navigation Links */}
        {isAuthenticated && (
          <motion.div 
            className="hidden md:flex items-center gap-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, staggerChildren: 0.1 }}
          >
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-electric-500 to-violet-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-electric-400 to-violet-500"
                        layoutId="activeNavItem"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <motion.div
                      className="relative z-10 flex items-center gap-2"
                      whileHover={{ x: 2 }}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
        
        <motion.div 
          className="flex items-center gap-4"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl glass glass-hover transition-all duration-300 relative overflow-hidden"
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: theme === 'light' ? 0 : 180 }}
              transition={{ duration: 0.5 }}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </motion.div>
          </motion.button>
          
          {isAuthenticated && user ? (
            <>
              <NotificationBell />
              <motion.div 
                className="flex items-center gap-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", bounce: 0.5 }}
              >
                <span className="text-sm font-medium hidden sm:block">{user.name}</span>
                <Badge variant="electric" size="sm">
                  {user.role?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'User'}
                </Badge>
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring", bounce: 0.5 }}
              >
                <Button onClick={logout} variant="ghost" size="sm">
                  Logout
                </Button>
              </motion.div>
            </>
          ) : null}
        </motion.div>
      </div>
    </motion.nav>
  );
};
