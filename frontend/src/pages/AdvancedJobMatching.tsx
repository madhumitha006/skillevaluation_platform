import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  LightBulbIcon,
  HeartIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { jobMatchingEngine, JobMatch, MarketInsights } from '../services/jobMatchingEngine';
import { useNavigate } from 'react-router-dom';

export const AdvancedJobMatching = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [recommendations, setRecommendations] = useState<JobMatch[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null);
  const [activeTab, setActiveTab] = useState<'matches' | 'recommendations' | 'insights' | 'salary'>('matches');
  const [filters, setFilters] = useState({
    location: '',
    salary: { min: 0, max: 200000 },
    experience: '',
    remote: false
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadJobData();
  }, []);

  const loadJobData = async () => {
    try {
      setIsLoading(true);
      
      // Set user profile for personalized matching
      jobMatchingEngine.setUserProfile({
        skills: ['React', 'TypeScript', 'Node.js', 'JavaScript'],
        skillLevels: { 'React': 4, 'TypeScript': 3, 'Node.js': 3, 'JavaScript': 5 },
        experience: 5,
        preferredLocations: ['San Francisco', 'Remote'],
        remotePreference: true,
        salaryExpectation: 120000,
        culturePreferences: ['Innovation', 'Work-Life Balance', 'Growth']
      });

      // Get job matches
      const jobMatches = jobMatchingEngine.findMatches(filters);
      setJobs(jobMatches);

      // Get personalized recommendations
      const recs = jobMatchingEngine.getPersonalizedRecommendations();
      setRecommendations(recs);

      // Get market insights
      const insights = jobMatchingEngine.getMarketInsights('Frontend Developer');
      setMarketInsights(insights);

    } catch (error) {
      console.error('Failed to load job data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatSalary = (salary: any) => {
    return `$${(salary.min / 1000).toFixed(0)}k - $${(salary.max / 1000).toFixed(0)}k`;
  };

  const renderJobCard = (job: JobMatch, index: number) => (
    <motion.div
      key={job.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={job.companyInfo.logo} 
              alt={job.company}
              className="w-12 h-12 rounded-lg"
            />
            <div>
              <h3 className="text-lg font-semibold">{job.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getMatchScoreColor(job.matchScore)}`}>
            {job.matchScore}% Match
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPinIcon className="w-4 h-4 text-gray-500" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CurrencyDollarIcon className="w-4 h-4 text-gray-500" />
            <span>{formatSalary(job.salary)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon className="w-4 h-4 text-gray-500" />
            <span>{job.experience}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <StarIcon className="w-4 h-4 text-gray-500" />
            <span>{job.companyInfo.rating}/5</span>
          </div>
        </div>

        {/* Match Reasons */}
        {job.matchReasons.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-green-600 mb-2">Why this matches:</div>
            <div className="flex flex-wrap gap-1">
              {job.matchReasons.slice(0, 3).map((reason, idx) => (
                <Badge key={idx} variant="green" size="sm">{reason}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Skills Match */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Skills Match:</div>
          <div className="flex flex-wrap gap-1">
            {job.skillsMatch.slice(0, 4).map((skill, idx) => (
              <Badge 
                key={idx} 
                variant={
                  skill.match === 'perfect' ? 'green' :
                  skill.match === 'good' ? 'blue' :
                  skill.match === 'partial' ? 'yellow' : 'red'
                } 
                size="sm"
              >
                {skill.skill} ({skill.userLevel}/{skill.requiredLevel})
              </Badge>
            ))}
          </div>
        </div>

        {/* Company Culture */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">Company Culture:</div>
          <div className="grid grid-cols-5 gap-2 text-xs">
            <div className="text-center">
              <div className="font-medium">{job.workCulture.workLifeBalance}</div>
              <div className="text-gray-500">Work-Life</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{job.workCulture.innovation}</div>
              <div className="text-gray-500">Innovation</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{job.workCulture.diversity}</div>
              <div className="text-gray-500">Diversity</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{job.workCulture.collaboration}</div>
              <div className="text-gray-500">Team</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{job.workCulture.flexibility}</div>
              <div className="text-gray-500">Flexible</div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Posted {Math.floor((Date.now() - job.postedDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">
              <HeartIcon className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button size="sm" onClick={() => navigate(`/job/${job.id}`)}>
              View Details
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const renderMarketInsights = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Market Insights</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time job market analysis and trends
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${(marketInsights?.averageSalary || 0) / 1000}k
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Average Salary</div>
            <div className="flex items-center justify-center mt-1">
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600">+12% YoY</span>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <div className="text-3xl font-bold text-blue-600 mb-2 capitalize">
              {marketInsights?.demandLevel}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Job Demand</div>
            <div className="text-xs text-blue-600 mt-1">15% growth projected</div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {marketInsights?.skillsInDemand.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Hot Skills</div>
            <div className="text-xs text-purple-600 mt-1">In high demand</div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {marketInsights?.locationHotspots.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Top Cities</div>
            <div className="text-xs text-orange-600 mt-1">Hiring actively</div>
          </Card>
        </motion.div>
      </div>

      {/* Skills in Demand */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-green-500" />
            Most In-Demand Skills
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketInsights?.skillsInDemand.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
              >
                <span className="font-medium">{skill}</span>
                <Badge variant="green" size="sm">Hot</Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Top Companies */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BuildingOfficeIcon className="w-5 h-5 mr-2 text-blue-500" />
            Top Hiring Companies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketInsights?.topCompanies.map((company, index) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {company[0]}
                  </div>
                  <span className="font-medium">{company}</span>
                </div>
                <Badge variant="blue" size="sm">Hiring</Badge>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Location Hotspots */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPinIcon className="w-5 h-5 mr-2 text-red-500" />
            Location Hotspots
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marketInsights?.locationHotspots.map((location, index) => (
              <motion.div
                key={location}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="text-center p-4 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg"
              >
                <div className="font-semibold text-lg">{location}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">High demand</div>
                <div className="text-xs text-red-600 mt-1">+{Math.floor(Math.random() * 20 + 10)}% jobs</div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );

  const renderSalaryInsights = () => {
    const salaryInsights = jobMatchingEngine.getSalaryInsights('Frontend Developer', 'San Francisco', 'senior');
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Salary Intelligence</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized salary insights and negotiation guidance
          </p>
        </div>

        {/* Salary Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              ${(salaryInsights.averageSalary / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Your Market Value</div>
            <div className="text-xs text-green-600 mt-1">Based on your profile</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${(salaryInsights.salaryRange.min / 1000).toFixed(0)}k - ${(salaryInsights.salaryRange.max / 1000).toFixed(0)}k
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Salary Range</div>
            <div className="text-xs text-blue-600 mt-1">25th - 75th percentile</div>
          </Card>

          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {(salaryInsights.experienceMultiplier * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Experience Premium</div>
            <div className="text-xs text-purple-600 mt-1">Above base level</div>
          </Card>
        </div>

        {/* Skill Premiums */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AcademicCapIcon className="w-5 h-5 mr-2 text-blue-500" />
            Skill Premiums
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(salaryInsights.skillPremiums).map(([skill, premium]) => (
              <div key={skill} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-medium">{skill}</span>
                <Badge variant="green" size="sm">+${(premium / 1000).toFixed(0)}k</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Negotiation Tips */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <LightBulbIcon className="w-5 h-5 mr-2 text-yellow-500" />
            Negotiation Tips
          </h3>
          <div className="space-y-3">
            {salaryInsights.negotiationTips.map((tip, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
              >
                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-sm">{tip}</span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Job Matching
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Find your perfect job with intelligent matching and market insights
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center"
        >
          <div className="glass rounded-xl p-1 flex gap-1">
            {[
              { key: 'matches', label: 'Job Matches', icon: '🎯' },
              { key: 'recommendations', label: 'AI Picks', icon: '🤖' },
              { key: 'insights', label: 'Market Intel', icon: '📊' },
              { key: 'salary', label: 'Salary Intel', icon: '💰' },
            ].map((tab) => (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-electric-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'matches' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Your Job Matches</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {jobs.length} jobs found based on your profile
                </p>
              </div>
              <div className="space-y-6">
                {jobs.map((job, index) => renderJobCard(job, index))}
              </div>
            </div>
          )}
          
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">AI Recommendations</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Handpicked opportunities based on your career goals
                </p>
              </div>
              <div className="space-y-6">
                {recommendations.map((job, index) => renderJobCard(job, index))}
              </div>
            </div>
          )}
          
          {activeTab === 'insights' && renderMarketInsights()}
          {activeTab === 'salary' && renderSalaryInsights()}
        </motion.div>
      </div>
    </Layout>
  );
};