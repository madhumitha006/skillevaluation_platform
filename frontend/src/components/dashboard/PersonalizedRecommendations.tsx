import { useUserJourney } from '../../context/UserJourneyStore';
import { useAuthStore } from '../../context/AuthStore';
import { personalizedAI } from '../../services/PersonalizedAIMentor';
import { GlassCard } from '../common/GlassCard';
import { GradientButton } from '../common/GradientButton';
import { Link } from 'react-router-dom';
import { 
  TrophyIcon, 
  ChartBarIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export const PersonalizedRecommendations = () => {
  const { user } = useAuthStore();
  const { testResults, skillData, totalScore, level } = useUserJourney();

  const getPersonalizedInsights = () => {
    const insights = [];
    
    if (totalScore >= 80) {
      insights.push({
        type: 'success',
        icon: TrophyIcon,
        title: 'Elite Performance Tier',
        message: `${user?.name}, your ${totalScore}% talent score places you in the top 15% of professionals. You're ready for senior/lead positions with significant impact potential.`,
        action: 'Explore Leadership Roles',
        link: '/jobs?level=senior'
      });
    } else if (totalScore >= 65) {
      insights.push({
        type: 'progress',
        icon: ChartBarIcon,
        title: 'Strong Growth Trajectory',
        message: `Your ${totalScore}% score shows solid competency. Focus on closing skill gaps to reach the 80% threshold for premium opportunities.`,
        action: 'View Improvement Plan',
        link: '/learning'
      });
    } else {
      insights.push({
        type: 'warning',
        icon: ExclamationTriangleIcon,
        title: 'Foundation Building Phase',
        message: `At ${totalScore}%, you're building strong fundamentals. Targeted skill development can accelerate your career progression significantly.`,
        action: 'Start Skill Assessment',
        link: '/test'
      });
    }

    if (testResults?.skillBreakdown) {
      const topSkill = testResults.skillBreakdown[0];
      const weakSkill = testResults.skillBreakdown[testResults.skillBreakdown.length - 1];
      
      insights.push({
        type: 'info',
        icon: AcademicCapIcon,
        title: 'Skill Portfolio Analysis',
        message: `Your ${topSkill?.skill} expertise (${topSkill?.score}%) is a key differentiator. Consider strengthening ${weakSkill?.skill} (${weakSkill?.score}%) to become more well-rounded.`,
        action: 'Personalized Learning',
        link: '/learning'
      });
    }

    if (level >= 3) {
      insights.push({
        type: 'success',
        icon: CheckCircleIcon,
        title: 'Continuous Learner Recognition',
        message: `Your Level ${level} status demonstrates commitment to growth - a trait highly valued by employers. This sets you apart from 70% of candidates.`,
        action: 'Showcase Achievement',
        link: '/portfolio'
      });
    }

    return insights;
  };

  const getCareerRecommendations = () => {
    const recommendations = [];
    
    if (totalScore >= 75) {
      recommendations.push({
        title: 'Senior Developer Positions',
        description: 'Your skill level qualifies you for senior roles with 25-40% salary increases',
        salaryRange: '$90K - $130K',
        companies: ['Tech Startups', 'Mid-size Companies', 'Consulting Firms'],
        probability: 85
      });
    }
    
    if (skillData?.skills?.some((s: any) => s.name.includes('React') || s.name.includes('JavaScript'))) {
      recommendations.push({
        title: 'Frontend Specialist Roles',
        description: 'Your frontend expertise aligns with high-demand market needs',
        salaryRange: '$75K - $110K',
        companies: ['E-commerce', 'SaaS Companies', 'Digital Agencies'],
        probability: 78
      });
    }

    if (testResults?.overallScore >= 70) {
      recommendations.push({
        title: 'Full-Stack Development',
        description: 'Strong technical foundation supports versatile full-stack opportunities',
        salaryRange: '$80K - $120K',
        companies: ['Startups', 'Product Companies', 'Enterprise'],
        probability: 72
      });
    }

    return recommendations;
  };

  const insights = getPersonalizedInsights();
  const careerRecs = getCareerRecommendations();

  return (
    <div className="space-y-8">
      {/* Personalized Insights */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Personalized Insights for {user?.name}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${
                  insight.type === 'success' ? 'bg-green-100 dark:bg-green-900/20' :
                  insight.type === 'warning' ? 'bg-orange-100 dark:bg-orange-900/20' :
                  insight.type === 'progress' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <insight.icon className={`h-6 w-6 ${
                    insight.type === 'success' ? 'text-green-600 dark:text-green-400' :
                    insight.type === 'warning' ? 'text-orange-600 dark:text-orange-400' :
                    insight.type === 'progress' ? 'text-blue-600 dark:text-blue-400' :
                    'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {insight.message}
                  </p>
                  <Link to={insight.link}>
                    <GradientButton size="sm">
                      {insight.action}
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </GradientButton>
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Career Recommendations */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Tailored Career Opportunities
        </h3>
        <div className="space-y-4">
          {careerRecs.map((rec, index) => (
            <GlassCard key={index} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {rec.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {rec.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {rec.probability}%
                  </div>
                  <div className="text-xs text-gray-500">Match</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary Range</div>
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{rec.salaryRange}</div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Companies</div>
                  <div className="flex flex-wrap gap-2">
                    {rec.companies.map((company, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                        {company}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <Link to="/jobs">
                <GradientButton size="sm">
                  View Matching Jobs
                  <BriefcaseIcon className="ml-2 h-4 w-4" />
                </GradientButton>
              </Link>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recommended Next Steps
        </h3>
        <div className="space-y-3">
          {totalScore < 70 && (
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Complete skill assessments to reach 70% talent score threshold
              </span>
            </div>
          )}
          {!testResults && (
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Take the adaptive skill test for detailed performance analysis
              </span>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">
              Build portfolio projects showcasing your {skillData?.skills?.[0]?.name || 'key'} skills
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-700 dark:text-gray-300">
              Network with professionals in your target companies
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};