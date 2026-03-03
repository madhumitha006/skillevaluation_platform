import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillDNAData {
  skill: string;
  category: string;
  layers: {
    core: { level: string; score: number; confidence: number };
    advanced: { level: string; score: number; confidence: number };
    expert: { level: string; score: number; confidence: number };
  };
  dependencies: Array<{ prerequisite: string; strength: number }>;
  marketDemand: {
    trend: 'rising' | 'stable' | 'declining';
    demandScore: number;
  };
  aiInsights: {
    strengthAreas: string[];
    improvementAreas: string[];
    nextSteps: string[];
  };
}

interface SkillDNAVisualizationProps {
  data: SkillDNAData[];
  selectedSkill?: string;
  onSkillSelect: (skill: string) => void;
  animated?: boolean;
}

const SkillDNAVisualization: React.FC<SkillDNAVisualizationProps> = ({
  data,
  selectedSkill,
  onSkillSelect,
  animated = true
}) => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'radial' | 'timeline' | 'dependencies'>('radial');

  const width = 600;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 50;

  const categoryColors = {
    'Technical': '#3b82f6',
    'Soft Skills': '#10b981',
    'Languages': '#f59e0b',
    'Tools': '#8b5cf6',
    'Frameworks': '#ef4444',
    'Domain': '#06b6d4'
  };

  const getSkillPosition = (index: number, total: number, layer: 'core' | 'advanced' | 'expert') => {
    const layerRadius = layer === 'core' ? maxRadius * 0.4 : 
                      layer === 'advanced' ? maxRadius * 0.7 : maxRadius * 0.9;
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    
    return {
      x: centerX + Math.cos(angle) * layerRadius,
      y: centerY + Math.sin(angle) * layerRadius,
      angle
    };
  };

  const renderRadialView = () => {
    return (
      <svg width={width} height={height} className="skill-dna-svg">
        {/* Background circles */}
        {[0.4, 0.7, 0.9].map((ratio, index) => (
          <circle
            key={index}
            cx={centerX}
            cy={centerY}
            r={maxRadius * ratio}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={1}
            strokeDasharray="5,5"
            className="dark:stroke-gray-600"
          />
        ))}

        {/* Layer labels */}
        <text x={centerX} y={centerY - maxRadius * 0.4 + 15} textAnchor="middle" className="text-xs fill-gray-500">
          Core
        </text>
        <text x={centerX} y={centerY - maxRadius * 0.7 + 15} textAnchor="middle" className="text-xs fill-gray-500">
          Advanced
        </text>
        <text x={centerX} y={centerY - maxRadius * 0.9 + 15} textAnchor="middle" className="text-xs fill-gray-500">
          Expert
        </text>

        {/* Skill nodes */}
        {data.map((skill, index) => {
          const corePos = getSkillPosition(index, data.length, 'core');
          const advancedPos = getSkillPosition(index, data.length, 'advanced');
          const expertPos = getSkillPosition(index, data.length, 'expert');
          
          const isSelected = selectedSkill === skill.skill;
          const isHovered = hoveredSkill === skill.skill;

          return (
            <g key={skill.skill}>
              {/* Connection lines */}
              <line
                x1={corePos.x}
                y1={corePos.y}
                x2={advancedPos.x}
                y2={advancedPos.y}
                stroke={categoryColors[skill.category as keyof typeof categoryColors]}
                strokeWidth={2}
                opacity={0.3}
              />
              <line
                x1={advancedPos.x}
                y1={advancedPos.y}
                x2={expertPos.x}
                y2={expertPos.y}
                stroke={categoryColors[skill.category as keyof typeof categoryColors]}
                strokeWidth={2}
                opacity={0.3}
              />

              {/* Core layer */}
              <motion.circle
                cx={corePos.x}
                cy={corePos.y}
                r={8 + (skill.layers.core.score / 100) * 12}
                fill={categoryColors[skill.category as keyof typeof categoryColors]}
                opacity={skill.layers.core.confidence}
                initial={animated ? { scale: 0 } : {}}
                animate={animated ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer"
                onClick={() => onSkillSelect(skill.skill)}
                onMouseEnter={() => setHoveredSkill(skill.skill)}
                onMouseLeave={() => setHoveredSkill(null)}
              />

              {/* Advanced layer */}
              <motion.circle
                cx={advancedPos.x}
                cy={advancedPos.y}
                r={6 + (skill.layers.advanced.score / 100) * 10}
                fill={categoryColors[skill.category as keyof typeof categoryColors]}
                opacity={skill.layers.advanced.confidence * 0.8}
                initial={animated ? { scale: 0 } : {}}
                animate={animated ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer"
                onClick={() => onSkillSelect(skill.skill)}
                onMouseEnter={() => setHoveredSkill(skill.skill)}
                onMouseLeave={() => setHoveredSkill(null)}
              />

              {/* Expert layer */}
              <motion.circle
                cx={expertPos.x}
                cy={expertPos.y}
                r={4 + (skill.layers.expert.score / 100) * 8}
                fill={categoryColors[skill.category as keyof typeof categoryColors]}
                opacity={skill.layers.expert.confidence * 0.6}
                initial={animated ? { scale: 0 } : {}}
                animate={animated ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
                whileHover={{ scale: 1.2 }}
                className="cursor-pointer"
                onClick={() => onSkillSelect(skill.skill)}
                onMouseEnter={() => setHoveredSkill(skill.skill)}
                onMouseLeave={() => setHoveredSkill(null)}
              />

              {/* Skill label */}
              {(isSelected || isHovered) && (
                <motion.text
                  x={expertPos.x}
                  y={expertPos.y - 25}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-900 dark:fill-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {skill.skill}
                </motion.text>
              )}

              {/* Market trend indicator */}
              {skill.marketDemand.trend === 'rising' && (
                <motion.polygon
                  points={`${expertPos.x},${expertPos.y - 15} ${expertPos.x - 4},${expertPos.y - 8} ${expertPos.x + 4},${expertPos.y - 8}`}
                  fill="#10b981"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                />
              )}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="skill-dna-container">
      {/* View Mode Selector */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'radial', label: 'Radial View' },
          { key: 'timeline', label: 'Timeline' },
          { key: 'dependencies', label: 'Dependencies' }
        ].map(mode => (
          <button
            key={mode.key}
            onClick={() => setViewMode(mode.key as any)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              viewMode === mode.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>

      {/* Main Visualization */}
      <div className="relative">
        {viewMode === 'radial' && renderRadialView()}
        
        {/* Tooltip */}
        <AnimatePresence>
          {hoveredSkill && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-w-xs"
            >
              {(() => {
                const skill = data.find(s => s.skill === hoveredSkill);
                if (!skill) return null;
                
                return (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {skill.skill}
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Core:</span>
                        <span className="font-medium">{skill.layers.core.score}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Advanced:</span>
                        <span className="font-medium">{skill.layers.advanced.score}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Expert:</span>
                        <span className="font-medium">{skill.layers.expert.score}%</span>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-1">Market Trend:</div>
                        <div className={`text-xs font-medium ${
                          skill.marketDemand.trend === 'rising' ? 'text-green-600' :
                          skill.marketDemand.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {skill.marketDemand.trend.toUpperCase()}
                        </div>
                      </div>
                      {skill.aiInsights.nextSteps.length > 0 && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 mb-1">AI Insight:</div>
                          <div className="text-xs text-gray-700 dark:text-gray-300">
                            {skill.aiInsights.nextSteps[0]}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        {Object.entries(categoryColors).map(([category, color]) => (
          <div key={category} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillDNAVisualization;