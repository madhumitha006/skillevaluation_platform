import { motion } from 'framer-motion';
import { Badge } from '../common/Badge';

interface CategorizedSkills {
  technical: {
    programming: string[];
    frameworks: string[];
    databases: string[];
    cloud: string[];
    tools: string[];
  };
  soft: string[];
}

interface SkillDisplayProps {
  skills: CategorizedSkills;
  proficiency?: Record<string, { level: string; confidence: number }>;
}

export const SkillDisplay = ({ skills, proficiency }: SkillDisplayProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'electric';
      case 'intermediate': return 'violet';
      default: return 'info';
    }
  };

  const renderSkillCategory = (title: string, skillList: string[], icon: React.ReactNode, delay: number) => {
    if (skillList.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-500 to-violet-600 flex items-center justify-center text-white">
            {icon}
          </div>
          <h3 className="text-lg font-bold">{title}</h3>
          <Badge variant="info" size="sm">{skillList.length}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {skillList.map((skill, idx) => (
            <motion.div
              key={skill}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: delay + idx * 0.05 }}
            >
              <Badge
                variant={proficiency?.[skill] ? getLevelColor(proficiency[skill].level) as any : 'info'}
                size="md"
              >
                {skill}
                {proficiency?.[skill] && (
                  <span className="ml-1 text-xs opacity-75">
                    ({proficiency[skill].level})
                  </span>
                )}
              </Badge>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {renderSkillCategory(
        'Programming Languages',
        skills.technical.programming,
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>,
        0
      )}

      {renderSkillCategory(
        'Frameworks & Libraries',
        skills.technical.frameworks,
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>,
        0.1
      )}

      {renderSkillCategory(
        'Databases',
        skills.technical.databases,
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>,
        0.2
      )}

      {renderSkillCategory(
        'Cloud & DevOps',
        skills.technical.cloud,
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>,
        0.3
      )}

      {renderSkillCategory(
        'Tools',
        skills.technical.tools,
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>,
        0.4
      )}

      {renderSkillCategory(
        'Soft Skills',
        skills.soft,
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>,
        0.5
      )}
    </div>
  );
};
