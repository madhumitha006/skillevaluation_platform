import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full`}
      />
    </div>
  );
};

export const ErrorMessage = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="text-center p-8">
    <div className="text-red-500 mb-4">⚠️</div>
    <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Try Again
      </button>
    )}
  </div>
);

export const EmptyState = ({ title, description, action }: { 
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) => (
  <div className="text-center p-12">
    <div className="text-6xl mb-4">📭</div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
    {action}
  </div>
);