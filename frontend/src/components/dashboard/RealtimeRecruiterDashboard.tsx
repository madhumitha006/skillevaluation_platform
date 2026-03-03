import { useState, useEffect } from 'react';
import { useDashboard } from '../../hooks/useSocket';
import { motion } from 'framer-motion';
import { LiveTestMonitor } from '../common/TestProgressTracker';

interface DashboardStats {
  totalUsers: number;
  activeTests: number;
  completedTests: number;
  avgScore: number;
}

export const RealtimeRecruiterDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeTests: 0,
    completedTests: 0,
    avgScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const { on, off } = useDashboard();

  useEffect(() => {
    fetchDashboardStats();

    const handleDashboardUpdate = (data: any) => {
      if (data.type === 'test_completed') {
        fetchDashboardStats();
        addRecentActivity({
          type: 'test_completed',
          message: 'A student completed a test',
          timestamp: new Date(),
        });
      }
    };

    const handleDashboardRefresh = () => {
      fetchDashboardStats();
    };

    on('dashboard:update', handleDashboardUpdate);
    on('dashboard:refresh', handleDashboardRefresh);

    return () => {
      off('dashboard:update', handleDashboardUpdate);
      off('dashboard:refresh', handleDashboardRefresh);
    };
  }, [on, off]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/realtime/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    }
  };

  const addRecentActivity = (activity: any) => {
    setRecentActivity((prev) => [activity, ...prev.slice(0, 9)]);
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Tests',
      value: stats.activeTests,
      icon: '📝',
      color: 'bg-green-500',
    },
    {
      title: 'Completed Tests',
      value: stats.completedTests,
      icon: '✅',
      color: 'bg-purple-500',
    },
    {
      title: 'Average Score',
      value: `${stats.avgScore}%`,
      icon: '📊',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Live Test Monitor */}
      <LiveTestMonitor role="recruiter" />

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent activity
            </div>
          ) : (
            recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
