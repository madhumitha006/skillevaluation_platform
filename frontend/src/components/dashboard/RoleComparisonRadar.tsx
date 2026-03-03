import { motion } from 'framer-motion';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

interface RoleComparisonProps {
  userSkills: Array<{ skill: string; level: number }>;
  idealSkills: Array<{ skill: string; level: number }>;
  roleName: string;
}

export const RoleComparisonRadar = ({ userSkills, idealSkills, roleName }: RoleComparisonProps) => {
  const chartData = userSkills.map((us, idx) => ({
    skill: us.skill,
    'Your Level': us.level,
    'Ideal Level': idealSkills[idx]?.level || 0,
  }));

  const overallMatch = Math.round(
    (userSkills.reduce((sum, us, idx) => {
      const ideal = idealSkills[idx]?.level || 0;
      return sum + Math.min(us.level / ideal, 1);
    }, 0) / userSkills.length) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold">🎯 Role Fit Analysis</h3>
          <div className="px-3 py-1 rounded-full bg-gradient-to-r from-electric-500 to-violet-600 text-white text-sm font-semibold">
            {overallMatch}% Match
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Compare your skills with ideal {roleName} profile
        </p>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="#374151" opacity={0.2} />
          <PolarAngleAxis
            dataKey="skill"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            stroke="#6b7280"
            style={{ fontSize: '10px' }}
          />
          <Radar
            name="Your Level"
            dataKey="Your Level"
            stroke="#3a81ff"
            fill="#3a81ff"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Radar
            name="Ideal Level"
            dataKey="Ideal Level"
            stroke="#9829ff"
            fill="#9829ff"
            fillOpacity={0.2}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Legend />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-3 rounded-lg bg-electric-500/10">
          <div className="text-2xl font-bold text-electric-500">
            {userSkills.filter((s, idx) => s.level >= (idealSkills[idx]?.level || 0)).length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Skills Met</div>
        </div>
        <div className="text-center p-3 rounded-lg bg-violet-500/10">
          <div className="text-2xl font-bold text-violet-500">
            {userSkills.filter((s, idx) => s.level < (idealSkills[idx]?.level || 0)).length}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400">Skills to Improve</div>
        </div>
      </div>
    </motion.div>
  );
};
