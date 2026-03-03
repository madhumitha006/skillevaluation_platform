import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  gradient: 'electric' | 'violet' | 'green';
  trend?: number;
  delay?: number;
}

export const StatCard = ({ title, value, suffix = '', icon, gradient, trend, delay = 0 }: StatCardProps) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, delay });
    return controls.stop;
  }, [value, delay]);

  const gradients = {
    electric: 'from-electric-500 to-electric-600',
    violet: 'from-violet-500 to-violet-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradients[gradient]} shadow-lg`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={trend >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
            </svg>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
      <div className="flex items-baseline gap-1">
        <motion.p className="text-4xl font-bold text-gray-900 dark:text-white">
          {rounded}
        </motion.p>
        {suffix && <span className="text-xl text-gray-600 dark:text-gray-400">{suffix}</span>}
      </div>
    </motion.div>
  );
};
