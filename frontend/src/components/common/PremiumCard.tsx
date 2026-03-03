import { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'premium' | 'glass' | 'glow';
  hover?: boolean;
}

export const Card = ({ 
  children, 
  variant = 'default', 
  hover = true,
  className = '', 
  ...props 
}: CardProps) => {
  const baseStyles = 'relative overflow-hidden transition-all duration-500';
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg',
    premium: 'card-premium',
    glass: 'glass rounded-3xl',
    glow: 'glass rounded-3xl glow-electric',
  };

  const hoverStyles = hover ? 'hover:-translate-y-2 hover:shadow-2xl cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseStyles} ${variants[variant]} ${hoverStyles} ${className}`}
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
      {...props}
    >
      {/* Shimmer Effect on Hover */}
      {variant === 'premium' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.8 }}
        />
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Glow Effect */}
      {variant === 'glow' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-electric-500/20 to-violet-500/20 rounded-3xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </motion.div>
  );
};