import React from 'react';
import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

interface SkillRadarProps {
  data: Array<{
    category: string;
    score: number;
    fullMark: number;
  }>;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const SkillRadarChart: React.FC<SkillRadarProps> = ({ 
  data, 
  size = 'md',
  animated = true 
}) => {
  const sizeConfig = {
    sm: { height: 200, fontSize: 10 },
    md: { height: 300, fontSize: 12 },
    lg: { height: 400, fontSize: 14 }
  };

  const config = sizeConfig[size];

  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.8 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full"
    >
      <ResponsiveContainer width="100%" height={config.height}>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid 
            stroke="#e5e7eb" 
            className="dark:stroke-gray-600"
          />
          <PolarAngleAxis 
            dataKey="category" 
            tick={{ 
              fontSize: config.fontSize, 
              fill: '#6b7280',
              className: 'dark:fill-gray-400'
            }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ 
              fontSize: config.fontSize - 2, 
              fill: '#9ca3af',
              className: 'dark:fill-gray-500'
            }}
          />
          <Radar
            name="Skills"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ 
              fill: '#3b82f6', 
              strokeWidth: 2, 
              r: 4 
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SkillRadarChart;