import { motion } from 'framer-motion';

interface HeatmapData {
  skill: string;
  score: number;
  category: 'strength' | 'weakness' | 'neutral';
}

interface SkillHeatmapProps {
  strengths: HeatmapData[];
  weaknesses: HeatmapData[];
}

export const SkillHeatmap = ({ strengths, weaknesses }: SkillHeatmapProps) => {
  const getColorClass = (score: number) => {
    if (score >= 80) return 'bg-green-500/80';
    if (score >= 60) return 'bg-electric-500/80';
    if (score >= 40) return 'bg-yellow-500/80';
    return 'bg-red-500/80';
  };

  const renderSkillBar = (item: HeatmapData, index: number) => (
    <motion.div
      key={item.skill}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-4"
    >
      <div className="flex justify-between mb-2">
        <span className="font-semibold text-sm">{item.skill}</span>
        <span className="text-sm text-gray-600 dark:text-gray-400">{item.score}%</span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-navy-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColorClass(item.score)} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${item.score}%` }}
          transition={{ duration: 1, delay: index * 0.1 }}
        />
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold mb-6">Strengths & Weaknesses</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h4 className="font-semibold text-green-600 dark:text-green-400">Strengths</h4>
          </div>
          {strengths.length > 0 ? (
            strengths.map((item, idx) => renderSkillBar(item, idx))
          ) : (
            <p className="text-sm text-gray-500">No strengths identified yet</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <h4 className="font-semibold text-red-600 dark:text-red-400">Areas to Improve</h4>
          </div>
          {weaknesses.length > 0 ? (
            weaknesses.map((item, idx) => renderSkillBar(item, idx))
          ) : (
            <p className="text-sm text-gray-500">No weaknesses identified yet</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};
