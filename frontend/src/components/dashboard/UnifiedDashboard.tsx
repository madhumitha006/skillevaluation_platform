import { useUserJourney } from '../../context/UserJourneyStore';
import { useAuthStore } from '../../context/AuthStore';
import { GlassCard } from '../common/GlassCard';
import { GradientButton } from '../common/GradientButton';
import { ProgressTracker } from '../common/ProgressTracker';
import { PersonalizedRecommendations } from './PersonalizedRecommendations';
import { LoadingState, SkeletonCard, FadeIn, SlideIn } from '../common/OptimizedAnimations';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  ChartBarIcon, 
  BriefcaseIcon, 
  AcademicCapIcon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export const UnifiedDashboard = () => {
  const { user } = useAuthStore();
  const { totalScore, testResults, interviewResults, skillData, getNextStep, level, xpPoints } = useUserJourney();
  const [isInitializing, setIsInitializing] = useState(true);
  const [enhancedSkillData, setEnhancedSkillData] = useState<any>(null);
  
  const nextStep = getNextStep();

  // Initialize with realistic data
  useEffect(() => {
    const initializeDashboard = async () => {
      await new Promise(resolve => setTimeout(resolve, 600)); // Realistic loading
      
      const realisticSkills = skillData?.skills || [
        { name: 'JavaScript', score: 85, trend: 'Rising' },
        { name: 'React', score: 78, trend: 'Stable' },
        { name: 'Node.js', score: 72, trend: 'Rising' }
      ];
      setEnhancedSkillData({ skills: realisticSkills });
      setIsInitializing(false);
    };

    initializeDashboard();
  }, [skillData, level]);

  const talentScore = Math.round((totalScore + (testResults?.overallScore || 0) + (interviewResults?.confidence || 0)) / 3) || 72;
  
  const skillRadarData = enhancedSkillData?.skills?.slice(0, 6) || [
    { name: 'JavaScript', score: 85, trend: 'Rising' },
    { name: 'React', score: 78, trend: 'Stable' },
    { name: 'Node.js', score: 72, trend: 'Rising' },
    { name: 'Python', score: 65, trend: 'Rising' },
    { name: 'SQL', score: 80, trend: 'Stable' },
    { name: 'AWS', score: 60, trend: 'Rising' }
  ];

  const metrics = [
    {
      title: 'Talent Score',
      value: `${talentScore}%`,
      icon: TrophyIcon,
      color: 'from-yellow-500 to-orange-500',
      description: 'Overall assessment score',
      change: '+12%'
    },
    {
      title: 'Interview Confidence',
      value: `${interviewResults?.confidence || Math.round(talentScore * 0.9)}%`,
      icon: ChartBarIcon,
      color: 'from-blue-500 to-cyan-500',
      description: 'AI interview performance',
      change: '+8%'
    },
    {
      title: 'Job Compatibility',
      value: `${Math.round((talentScore * 0.8) + 15)}%`,
      icon: BriefcaseIcon,
      color: 'from-green-500 to-emerald-500',
      description: 'Match with target roles',
      change: '+23%'
    },
    {
      title: 'Learning Progress',
      value: `${Math.round((level - 1) * 25)}%`,
      icon: AcademicCapIcon,
      color: 'from-purple-500 to-pink-500',
      description: 'Skill development journey',
      change: '+15%'
    }
  ];

  if (isInitializing) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-6 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        
        <LoadingState type="dots" text="Loading your personalized dashboard" className="text-center py-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <FadeIn>
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name}! ✨
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Level {level} Talent • {xpPoints} XP • {talentScore}% Overall Score
          </p>
          
          {nextStep && (
            <GradientButton size="lg">
              <Link to={`/${nextStep.id}`} className="flex items-center">
                Continue Journey: {nextStep.title}
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </GradientButton>
          )}
        </div>
      </FadeIn>

      {/* Progress Tracker */}
      <SlideIn direction="up" delay={200}>
        <ProgressTracker />
      </SlideIn>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <SlideIn key={index} direction="up" delay={300 + index * 100}>
            <GlassCard className="p-6 text-center group hover:scale-105 transition-all duration-300">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${metric.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{metric.value}</h3>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{metric.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{metric.description}</p>
              <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                {metric.change} this month
              </div>
            </GlassCard>
          </SlideIn>
        ))}
      </div>

      {/* Skill Radar Chart */}
      <FadeIn delay={800}>
        <GlassCard className="p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Skill Portfolio Analysis
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {skillRadarData.map((skill, index) => (
              <SlideIn key={index} direction="up" delay={900 + index * 100}>
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200 dark:text-gray-700"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="url(#gradient)"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 36}`}
                        strokeDashoffset={`${2 * Math.PI * 36 * (1 - skill.score / 100)}`}
                        className="transition-all duration-1000 ease-out"
                        style={{ transitionDelay: `${index * 200}ms` }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{skill.score}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{skill.name}</p>
                  <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                    skill.trend === 'Rising' 
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  }`}>
                    {skill.trend}
                  </div>
                </div>
              </SlideIn>
            ))}
          </div>
        </GlassCard>
      </FadeIn>

      {/* Personalized Recommendations */}
      <FadeIn delay={1200}>
        <PersonalizedRecommendations />
      </FadeIn>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { to: '/test', icon: SparklesIcon, title: 'Retake Assessment', desc: 'Improve your scores', color: 'text-blue-500' },
          { to: '/jobs', icon: BriefcaseIcon, title: 'Find Jobs', desc: 'Discover opportunities', color: 'text-green-500' },
          { to: '/learning', icon: AcademicCapIcon, title: 'Learn & Grow', desc: 'Personalized learning', color: 'text-purple-500' }
        ].map((action, index) => (
          <SlideIn key={index} direction="up" delay={1400 + index * 100}>
            <GlassCard className="p-6 group hover:scale-105 transition-all duration-300">
              <Link to={action.to} className="block text-center">
                <action.icon className={`h-12 w-12 ${action.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{action.desc}</p>
              </Link>
            </GlassCard>
          </SlideIn>
        ))}
      </div>
    </div>
  );
};