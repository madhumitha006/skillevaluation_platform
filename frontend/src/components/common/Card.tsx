import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'electric' | 'violet' | 'none';
}

export const Card = ({ children, className = '', hover = false, glow = 'none' }: CardProps) => {
  const glowStyles = {
    electric: 'glow-electric hover:shadow-2xl hover:shadow-electric-500/40',
    violet: 'glow-violet hover:shadow-2xl hover:shadow-violet-500/40',
    none: 'shadow-lg shadow-gray-200/50 dark:shadow-navy-900/50 hover:shadow-xl',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, rotateX: -5 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={hover ? { 
        y: -12, 
        scale: 1.03,
        rotateY: 2,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      } : {
        scale: 1.01,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      className={`glass rounded-2xl p-6 ${hover ? 'cursor-pointer' : ''} ${glowStyles[glow]} transition-all duration-300 relative overflow-hidden ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.div
        className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-electric-400/20 to-violet-400/20 rounded-full blur-xl opacity-0"
        whileHover={{ opacity: 1, scale: 1.5 }}
        transition={{ duration: 0.5 }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
