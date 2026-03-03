import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  MinusIcon 
} from '@heroicons/react/24/outline';

interface KPICardProps {
  title: string;
  value: number | string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  suffix?: string;
  prefix?: string;
  animated?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  color,
  suffix = '',
  prefix = '',
  animated = true
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      light: 'bg-blue-50 dark:bg-blue-900/20'
    },
    green: {
      bg: 'from-green-500 to-green-600',
      text: 'text-green-600',
      light: 'bg-green-50 dark:bg-green-900/20'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      light: 'bg-purple-50 dark:bg-purple-900/20'
    },
    orange: {
      bg: 'from-orange-500 to-orange-600',
      text: 'text-orange-600',
      light: 'bg-orange-50 dark:bg-orange-900/20'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      light: 'bg-red-50 dark:bg-red-900/20'
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />;
      default:
        return <MinusIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  useEffect(() => {
    if (animated && typeof value === 'number') {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      setDisplayValue(typeof value === 'number' ? value : 0);
    }
  }, [value, animated]);

  const formatValue = (val: number | string) => {
    if (typeof val === 'string') return val;
    
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toLocaleString();
  };

  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 20, scale: 0.95 } : {}}
      animate={animated ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="premium-card p-6 relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className={`w-full h-full bg-gradient-to-br ${colorClasses[color].bg} rounded-full transform translate-x-8 -translate-y-8`} />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color].light}`}>
            <div className={colorClasses[color].text}>
              {icon}
            </div>
          </div>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={`text-sm font-medium ${getTrendColor()}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <motion.div
            initial={animated ? { scale: 0.8 } : {}}
            animate={animated ? { scale: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            {prefix}{typeof value === 'string' ? value : formatValue(displayValue)}{suffix}
          </motion.div>
        </div>

        {/* Title */}
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {title}
        </div>

        {/* Progress Bar (if trend exists) */}
        {trend && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.abs(change || 0)}%` }}
                transition={{ delay: 0.5, duration: 1 }}
                className={`h-1 rounded-full ${
                  trend === 'up' ? 'bg-green-500' : 
                  trend === 'down' ? 'bg-red-500' : 'bg-gray-500'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default KPICard;