import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SkillGrowthChartProps {
  data: Array<{ date: string; score: number; skill: string }>;
}

export const SkillGrowthChart = ({ data }: SkillGrowthChartProps) => {
  const skills = [...new Set(data.map(d => d.skill))];
  const colors = ['#3a81ff', '#9829ff', '#10b981', '#f59e0b', '#ef4444'];

  const chartData = data.reduce((acc: any[], item) => {
    const existing = acc.find(d => d.date === item.date);
    if (existing) {
      existing[item.skill] = item.score;
    } else {
      acc.push({ date: item.date, [item.skill]: item.score });
    }
    return acc;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">📈 Skill Growth Over Time</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track your progress across different skills
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Legend />
          {skills.map((skill, idx) => (
            <Line
              key={skill}
              type="monotone"
              dataKey={skill}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
