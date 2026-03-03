import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface SkillGapProps {
  data: Array<{
    skill: string;
    current: number;
    required: number;
    gap: number;
  }>;
}

export const SkillGapVisualization = ({ data }: SkillGapProps) => {
  const getGapColor = (gap: number) => {
    if (gap <= 10) return '#10b981';
    if (gap <= 30) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">🎯 Skill Gap Analysis</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compare your skills with industry requirements
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} domain={[0, 100]} />
          <YAxis dataKey="skill" type="category" stroke="#6b7280" style={{ fontSize: '12px' }} width={100} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          <Bar dataKey="current" fill="#3a81ff" name="Your Level" radius={[0, 4, 4, 0]} />
          <Bar dataKey="required" fill="#9829ff" name="Required Level" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-3">
        {data.slice(0, 3).map((item, idx) => (
          <motion.div
            key={item.skill}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-navy-800/50"
          >
            <div className="flex-1">
              <div className="font-medium">{item.skill}</div>
              <div className="text-xs text-gray-500">Gap: {item.gap}%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - item.gap}%` }}
                  transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                  className="h-full"
                  style={{ backgroundColor: getGapColor(item.gap) }}
                />
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: getGapColor(item.gap) }}
              >
                {item.gap > 0 ? `-${item.gap}%` : '✓'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
