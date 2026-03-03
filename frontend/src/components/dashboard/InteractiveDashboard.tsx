import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  TrophyIcon, 
  ClockIcon, 
  StarIcon,
  BriefcaseIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { mockData } from '../services/mockData';

export const InteractiveDashboard: React.FC = () => {
  const [stats, setStats] = useState(mockData.dashboardStats);
  const [recentTests, setRecentTests] = useState(mockData.testResults);
  const [skills, setSkills] = useState(mockData.skills);
  const [notifications, setNotifications] = useState(mockData.notifications);

  const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className={`premium-card p-6 cursor-pointer border-l-4 border-${color}-500`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )}
        </div>
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </div>
    </motion.div>
  );

  const SkillProgress = ({ skill }: any) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
    >
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-900 dark:text-white">{skill.name}</span>
          <span className="text-sm text-gray-600 dark:text-gray-400">{skill.level}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${skill.level}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gradient-premium mb-2">
          Welcome back! 🚀
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          You're ranked #{stats.rank} out of {stats.totalUsers} users
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={ChartBarIcon}
          title="Tests Completed"
          value={`${stats.completedTests}/${stats.totalTests}`}
          change={12}
          color="blue"
        />
        <StatCard
          icon={TrophyIcon}
          title="Average Score"
          value={`${stats.averageScore}%`}
          change={5}
          color="yellow"
        />
        <StatCard
          icon={ClockIcon}
          title="Time Spent"
          value={stats.timeSpent}
          change={8}
          color="green"
        />
        <StatCard
          icon={StarIcon}
          title="Skills Assessed"
          value={stats.skillsAssessed}
          change={15}
          color="purple"
        />
      </div>

      {/* Skills Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="premium-card p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <AcademicCapIcon className="w-6 h-6 text-blue-500" />
          Your Skills Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {skills.map((skill, index) => (
            <SkillProgress key={skill.name} skill={skill} />
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tests */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-green-500" />
            Recent Test Results
          </h3>
          <div className="space-y-4">
            {recentTests.map((test, index) => (
              <motion.div
                key={test._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{test.testName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{test.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{test.score}%</p>
                  <p className="text-xs text-gray-500">{test.duration}min</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-6"
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BriefcaseIcon className="w-6 h-6 text-purple-500" />
            Recent Notifications
          </h3>
          <div className="space-y-3">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`p-3 rounded-lg border-l-4 ${
                  notification.type === 'job_match' 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                }`}
              >
                <p className="font-medium text-gray-900 dark:text-white text-sm">
                  {notification.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {notification.message}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};