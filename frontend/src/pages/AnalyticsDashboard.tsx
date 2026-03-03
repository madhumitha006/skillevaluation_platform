import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { SkillGrowthChart } from '@/components/dashboard/SkillGrowthChart';
import { PerformancePrediction } from '@/components/dashboard/PerformancePrediction';
import { SkillGapVisualization } from '@/components/dashboard/SkillGapVisualization';
import { RoleComparisonRadar } from '@/components/dashboard/RoleComparisonRadar';
import analyticsService from '@/services/analyticsService';
import { useAuthStore } from '@/context/AuthStore';

export const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [skillGrowth, setSkillGrowth] = useState([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [skillGaps, setSkillGaps] = useState([]);
  const [roleComparison, setRoleComparison] = useState<any>(null);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      analyticsService.setToken(token);
      loadAnalytics();
    }
  }, [token, targetRole]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [growth, pred, gaps, comparison] = await Promise.all([
        analyticsService.getSkillGrowth(),
        analyticsService.getPerformancePrediction(),
        analyticsService.getSkillGaps(targetRole),
        analyticsService.getRoleComparison(targetRole),
      ]);

      setSkillGrowth(growth);
      setPrediction(pred);
      setSkillGaps(gaps);
      setRoleComparison(comparison);
    } catch (error) {
      console.error('Analytics load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    'Full Stack Developer',
    'Frontend Developer',
    'Backend Developer',
    'DevOps Engineer',
    'Data Scientist',
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-electric-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              AI-powered insights and predictions
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Target Role:</label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="px-4 py-2 glass rounded-xl focus:ring-2 focus:ring-electric-500 outline-none"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Top Row - Prediction & Role Comparison */}
        <div className="grid lg:grid-cols-2 gap-6">
          {prediction && (
            <PerformancePrediction
              currentScore={prediction.currentScore}
              predictedScore={prediction.predictedScore}
              confidence={prediction.confidence}
              timeframe={prediction.timeframe}
            />
          )}

          {roleComparison && (
            <RoleComparisonRadar
              userSkills={roleComparison.userSkills}
              idealSkills={roleComparison.idealSkills}
              roleName={targetRole}
            />
          )}
        </div>

        {/* Middle Row - Skill Growth */}
        {skillGrowth.length > 0 && <SkillGrowthChart data={skillGrowth} />}

        {/* Bottom Row - Skill Gaps */}
        {skillGaps.length > 0 && <SkillGapVisualization data={skillGaps} />}

        {/* Insights Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500 to-violet-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Growth Trajectory</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your skills are improving at an average rate of 12% per month
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Strengths Identified</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You excel in {skillGrowth[0]?.skill || 'multiple areas'} with consistent high scores
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Focus Areas</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {skillGaps.length > 0 ? `${skillGaps[0].skill} needs attention` : 'Keep up the great work!'}
            </p>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};
