import { useState, useEffect } from 'react';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingState = ({ 
  type = 'spinner', 
  size = 'md', 
  text, 
  className = '' 
}: LoadingStateProps) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (type === 'dots' && text) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [type, text]);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  if (type === 'spinner') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        {text && <span className="ml-3 text-gray-600 dark:text-gray-300">{text}</span>}
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-3/4 mb-2"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-1/2 mb-2"></div>
        <div className="bg-gray-200 dark:bg-gray-700 rounded h-4 w-5/6"></div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${sizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}></div>
        {text && <span className="ml-3 text-gray-600 dark:text-gray-300">{text}</span>}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="text-gray-600 dark:text-gray-300">{text}{dots}</span>
      </div>
    );
  }

  return null;
};

export const SkeletonCard = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 ${className}`}>
    <div className="flex items-center space-x-4 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

export const ProgressBar = ({ 
  progress, 
  className = '',
  animated = true,
  color = 'blue'
}: { 
  progress: number;
  className?: string;
  animated?: boolean;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`}>
      <div 
        className={`h-2 rounded-full ${colorClasses[color]} ${animated ? 'transition-all duration-1000 ease-out' : ''}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  );
};

export const FadeIn = ({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const SlideIn = ({ 
  children, 
  direction = 'left',
  delay = 0,
  className = ''
}: { 
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  className?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translate-x-0 translate-y-0';
    
    switch (direction) {
      case 'left': return '-translate-x-8';
      case 'right': return 'translate-x-8';
      case 'up': return '-translate-y-8';
      case 'down': return 'translate-y-8';
      default: return '-translate-x-8';
    }
  };

  return (
    <div 
      className={`transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${getTransform()} ${className}`}
    >
      {children}
    </div>
  );
};