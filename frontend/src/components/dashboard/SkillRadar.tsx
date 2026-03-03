import { motion } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface SkillRadarProps {
  data: Array<{ skill: string; score: number; fullMark: number }>;
}

export const SkillRadar = ({ data }: SkillRadarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold mb-6">Skill Assessment</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid stroke="#3a81ff" strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'currentColor' }} />
          <Radar 
            name="Score" 
            dataKey="score" 
            stroke="#3a81ff" 
            fill="#3a81ff" 
            fillOpacity={0.6}
            animationDuration={1000}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
