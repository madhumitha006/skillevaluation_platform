import { motion } from 'framer-motion';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';

interface SkillComparisonProps {
  candidates: Array<{
    name: string;
    skills: Record<string, number>;
  }>;
}

export const SkillComparison = ({ candidates }: SkillComparisonProps) => {
  const allSkills = Array.from(
    new Set(candidates.flatMap(c => Object.keys(c.skills)))
  );

  const chartData = allSkills.map(skill => {
    const dataPoint: any = { skill };
    candidates.forEach(candidate => {
      dataPoint[candidate.name] = candidate.skills[skill] || 0;
    });
    return dataPoint;
  });

  const colors = ['#3a81ff', '#9829ff', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-xl font-bold mb-6">Skill Comparison</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#3a81ff" strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'currentColor' }} />
          {candidates.map((candidate, idx) => (
            <Radar
              key={candidate.name}
              name={candidate.name}
              dataKey={candidate.name}
              stroke={colors[idx % colors.length]}
              fill={colors[idx % colors.length]}
              fillOpacity={0.3}
              animationDuration={1000}
            />
          ))}
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
