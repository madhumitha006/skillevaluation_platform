import { useState, useEffect } from 'react';
import { useLeaderboard } from '../../hooks/useSocket';
import { motion } from 'framer-motion';

interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  totalTests: number;
  avgScore: number;
  maxScore: number;
  lastTestDate: string;
}

export const RealtimeLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { on, off } = useLeaderboard();

  useEffect(() => {
    fetchLeaderboard();

    const handleLeaderboardUpdate = (data: LeaderboardEntry[]) => {
      setLeaderboard(data);
    };

    on('leaderboard:update', handleLeaderboardUpdate);

    return () => {
      off('leaderboard:update', handleLeaderboardUpdate);
    };
  }, [on, off]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/realtime/leaderboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setLeaderboard(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          🏆 Leaderboard
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Live Updates
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl font-bold w-12 text-center">
                  {getMedalEmoji(index)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {entry.name}
                  </h3>
                  <p className="text-sm text-gray-500">{entry.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Tests</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {entry.totalTests}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500">Avg Score</div>
                  <div
                    className={`font-bold text-lg ${getScoreColor(
                      entry.avgScore
                    )}`}
                  >
                    {entry.avgScore}%
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-500">Best</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {entry.maxScore}%
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No leaderboard data available yet
        </div>
      )}
    </div>
  );
};
