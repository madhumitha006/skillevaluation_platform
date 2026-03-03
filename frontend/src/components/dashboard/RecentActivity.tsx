import { motion } from 'framer-motion';
import { Badge } from '../common/Badge';

interface Activity {
  id: string;
  title: string;
  date: string;
  score: number;
  status: 'completed' | 'in-progress' | 'pending';
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'info';
      default: return 'info';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              <th className="text-left py-3 px-4 font-semibold text-sm">Assessment</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Score</th>
              <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, idx) => (
              <motion.tr
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(58, 129, 255, 0.05)' }}
                className="border-b border-gray-200 dark:border-white/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-violet-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-medium">{activity.title}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {activity.date}
                </td>
                <td className="py-4 px-4">
                  <span className="font-bold text-lg">{activity.score}%</span>
                </td>
                <td className="py-4 px-4">
                  <Badge variant={getStatusVariant(activity.status)} size="sm">
                    {activity.status}
                  </Badge>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
