import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  ClockIcon, 
  StarIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const SimpleDashboard: React.FC = () => {
  const quickActions = [
    { title: 'Take a Test', icon: ChartBarIcon, color: 'blue', href: '/test' },
    { title: 'Find Jobs', icon: BriefcaseIcon, color: 'green', href: '/jobs' },
    { title: 'Learn Skills', icon: AcademicCapIcon, color: 'purple', href: '/learning' },
    { title: 'View Resume', icon: StarIcon, color: 'yellow', href: '/resume' }
  ];

  const stats = [
    { label: 'Tests Taken', value: '12', change: '+3 this week' },
    { label: 'Average Score', value: '87%', change: '+5% improvement' },
    { label: 'Skills', value: '8', change: '2 new skills' },
    { label: 'Job Matches', value: '24', change: '6 new matches' }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Ready to advance your career?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.a
            key={action.title}
            href={action.href}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`glass p-6 rounded-2xl text-center hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/20 transition-colors group cursor-pointer`}
          >
            <action.icon className={`w-8 h-8 mx-auto mb-3 text-${action.color}-500`} />
            <h3 className="font-semibold text-gray-900 dark:text-white">{action.title}</h3>
            <ArrowRightIcon className="w-4 h-4 mx-auto mt-2 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </motion.a>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-4 rounded-xl text-center"
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {stat.label}
            </div>
            <div className="text-xs text-green-600">
              {stat.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Tests
          </h3>
          <div className="space-y-3">
            {[
              { name: 'JavaScript Basics', score: 92, date: '2 days ago' },
              { name: 'React Components', score: 88, date: '1 week ago' },
              { name: 'Node.js APIs', score: 85, date: '2 weeks ago' }
            ].map((test, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{test.name}</div>
                  <div className="text-sm text-gray-500">{test.date}</div>
                </div>
                <div className="text-lg font-bold text-green-600">{test.score}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6 rounded-2xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Job Recommendations
          </h3>
          <div className="space-y-3">
            {[
              { title: 'Senior React Developer', company: 'TechCorp', match: '95%' },
              { title: 'Full Stack Engineer', company: 'StartupXYZ', match: '88%' },
              { title: 'Frontend Developer', company: 'WebCo', match: '82%' }
            ].map((job, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.company}</div>
                </div>
                <div className="text-sm font-bold text-blue-600">{job.match} match</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};