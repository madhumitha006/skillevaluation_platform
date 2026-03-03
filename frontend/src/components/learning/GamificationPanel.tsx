import { motion } from 'framer-motion';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Gamification } from '@/types';

interface GamificationPanelProps {
  gamification: Gamification;
}

export const GamificationPanel = ({ gamification }: GamificationPanelProps) => {
  const levelProgress = (gamification.currentLevelXP / gamification.nextLevelXP) * 100;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Level & XP */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 text-center bg-gradient-to-br from-electric-500/10 to-violet-500/10">
          <div className="space-y-3">
            <div className="text-3xl font-bold text-electric-500">
              Level {gamification.level}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {gamification.totalXP.toLocaleString()} Total XP
            </div>
            <ProgressBar progress={levelProgress} className="h-2" />
            <div className="text-xs text-gray-500">
              {gamification.currentLevelXP} / {gamification.nextLevelXP} XP
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Streak */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 text-center">
          <div className="space-y-3">
            <div className="text-4xl">🔥</div>
            <div className="text-2xl font-bold text-orange-500">
              {gamification.streaks.current} Days
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current Streak
            </div>
            <div className="text-xs text-gray-500">
              Best: {gamification.streaks.longest} days
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Recent Badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-center">Recent Badges</h3>
            <div className="flex justify-center gap-2">
              {(gamification.badges || []).slice(0, 3).map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.1 }}
                  className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-white font-bold shadow-lg`}
                  title={badge.name}
                >
                  {badge.icon || '🏆'}
                </motion.div>
              ))}
              {(!gamification.badges || gamification.badges.length === 0) && (
                <div className="text-gray-500 text-sm">No badges yet</div>
              )}
            </div>
            <div className="text-center">
              <Badge variant="electric" size="sm">
                {(gamification.badges || []).length} Total
              </Badge>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-center">Quick Stats</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Courses</span>
                <Badge variant="green" size="sm">
                  {gamification.stats.coursesCompleted}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Modules</span>
                <Badge variant="blue" size="sm">
                  {gamification.stats.modulesCompleted}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Quizzes</span>
                <Badge variant="purple" size="sm">
                  {gamification.stats.quizzesCompleted}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Study Time</span>
                <Badge variant="orange" size="sm">
                  {Math.round(gamification.stats.totalStudyTime / 60)}h
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};