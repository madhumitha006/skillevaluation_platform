import { motion } from 'framer-motion';
import { useState } from 'react';

interface SkillData {
  name: string;
  strength: number; // 0-100
  color: string;
}

interface SkillDNAProps {
  skills: SkillData[];
}

export const SkillDNA = ({ skills }: SkillDNAProps) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);

  return (
    <div className="glass rounded-2xl p-8 relative overflow-hidden">
      <h3 className="text-2xl font-bold mb-6 text-gradient">Skill DNA</h3>
      
      <div className="relative h-96 flex items-center justify-center">
        {/* DNA Helix */}
        <svg viewBox="0 0 200 400" className="w-full h-full">
          {/* Left Strand */}
          <motion.path
            d="M 50 0 Q 30 100 50 200 Q 70 300 50 400"
            stroke="url(#gradient1)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
          
          {/* Right Strand */}
          <motion.path
            d="M 150 0 Q 170 100 150 200 Q 130 300 150 400"
            stroke="url(#gradient2)"
            strokeWidth="3"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.2 }}
          />

          {/* Skill Connections */}
          {skills.map((skill, i) => {
            const y = (i / (skills.length - 1)) * 380 + 10;
            const leftX = 50 + Math.sin((i / skills.length) * Math.PI * 2) * 20;
            const rightX = 150 - Math.sin((i / skills.length) * Math.PI * 2) * 20;
            
            return (
              <g key={skill.name}>
                <motion.line
                  x1={leftX}
                  y1={y}
                  x2={rightX}
                  y2={y}
                  stroke={skill.color}
                  strokeWidth={skill.strength / 20}
                  opacity={hoveredSkill === skill.name ? 1 : 0.6}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  className="cursor-pointer"
                />
                
                {/* Skill Nodes */}
                <motion.circle
                  cx={leftX}
                  cy={y}
                  r={skill.strength / 15}
                  fill={skill.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.5 }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                />
                
                <motion.circle
                  cx={rightX}
                  cy={y}
                  r={skill.strength / 15}
                  fill={skill.color}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 + 0.1 }}
                  whileHover={{ scale: 1.5 }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                />
              </g>
            );
          })}

          {/* Gradients */}
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3a81ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9829ff" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9829ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3a81ff" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip */}
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 glass-strong rounded-xl p-4"
          >
            <div className="font-semibold">{hoveredSkill}</div>
            <div className="text-sm text-gray-400">
              Strength: {skills.find(s => s.name === hoveredSkill)?.strength}%
            </div>
          </motion.div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2"
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: skill.color }}
            />
            <span className="text-sm">{skill.name}</span>
            <span className="text-xs text-gray-400 ml-auto">{skill.strength}%</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
