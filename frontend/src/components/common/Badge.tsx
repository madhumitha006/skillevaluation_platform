import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'electric' | 'violet' | 'green' | 'orange' | 'blue' | 'purple' | 'yellow' | 'red' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge = ({ 
  children, 
  variant = 'electric', 
  size = 'md',
  className = '' 
}: BadgeProps) => {
  const variants = {
    electric: 'bg-gradient-to-r from-electric-500/20 to-electric-600/20 text-electric-600 border-electric-500/30',
    violet: 'bg-gradient-to-r from-violet-500/20 to-violet-600/20 text-violet-600 border-violet-500/30',
    green: 'bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-600 border-green-500/30',
    orange: 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-600 border-orange-500/30',
    blue: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-600 border-blue-500/30',
    purple: 'bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-600 border-purple-500/30',
    yellow: 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-600 border-yellow-500/30',
    red: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-600 border-red-500/30',
    gray: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-600 border-gray-500/30',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0, rotate: -180 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      whileHover={{ 
        scale: 1.1, 
        rotate: [0, -5, 5, 0],
        boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ 
        type: "spring", 
        bounce: 0.6, 
        duration: 0.5,
        rotate: { duration: 0.3 }
      }}
      className={`inline-flex items-center rounded-full border backdrop-blur-sm font-medium relative overflow-hidden ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/40 to-white/20 opacity-0"
        whileHover={{ 
          opacity: 1,
          x: ["-100%", "100%"]
        }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
};