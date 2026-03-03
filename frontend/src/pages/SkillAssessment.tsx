import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { 
  ChartBarIcon, 
  LightBulbIcon, 
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const skillAssessments = [
  {
    category: 'Frontend Development',
    skills: [
      { name: 'HTML/CSS', level: 85, market_demand: 'High', avg_salary: '$75k' },
      { name: 'JavaScript', level: 78, market_demand: 'Very High', avg_salary: '$85k' },
      { name: 'React', level: 82, market_demand: 'Very High', avg_salary: '$95k' },
      { name: 'TypeScript', level: 45, market_demand: 'High', avg_salary: '$90k' }
    ]
  },
  {
    category: 'Backend Development', 
    skills: [
      { name: 'Node.js', level: 35, market_demand: 'Very High', avg_salary: '$90k' },
      { name: 'Python', level: 25, market_demand: 'Very High', avg_salary: '$95k' },
      { name: 'Database Design', level: 40, market_demand: 'High', avg_salary: '$85k' },
      { name: 'API Development', level: 50, market_demand: 'High', avg_salary: '$88k' }
    ]
  },
  {
    category: 'DevOps & Cloud',
    skills: [
      { name: 'AWS', level: 20, market_demand: 'Very High', avg_salary: '$110k' },
      { name: 'Docker', level: 30, market_demand: 'High', avg_salary: '$95k' },
      { name: 'CI/CD', level: 25, market_demand: 'High', avg_salary: '$100k' },
      { name: 'Kubernetes', level: 15, market_demand: 'High', avg_salary: '$120k' }
    ]
  }
];

export const SkillAssessment = () => {
  const [selectedCategory, setSelectedCategory] = useState(0);
  
  const getRecommendations = (skills: any[]) => {
    const lowSkills = skills.filter(skill => skill.level < 60);
    const highDemandLowSkills = lowSkills.filter(skill => 
      skill.market_demand === 'Very High' || skill.market_demand === 'High'
    );
    
    return highDemandLowSkills.map(skill => ({
      skill: skill.name,
      priority: skill.market_demand === 'Very High' ? 'Critical' : 'High',
      reason: `${skill.market_demand} market demand, average salary ${skill.avg_salary}`,
      action: `Learn ${skill.name} - could increase your salary by ${
        parseInt(skill.avg_salary.replace(/[^0-9]/g, '')) - 75
      }k`,
      timeEstimate: skill.level < 30 ? '2-3 months' : '1-2 months'
    }));
  };

  const SkillBar = ({ skill }: { skill: any }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <span className="font-medium text-gray-900 dark:text-white">{skill.name}</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            skill.market_demand === 'Very High' ? 'bg-red-100 text-red-800' :
            skill.market_demand === 'High' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {skill.market_demand} Demand
          </span>
        </div>
        <div className="text-right">
          <div className="font-semibold text-gray-900 dark:text-white">{skill.level}%</div>
          <div className="text-sm text-gray-500">{skill.avg_salary}</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-3 rounded-full ${
            skill.level >= 70 ? 'bg-green-500' :
            skill.level >= 50 ? 'bg-yellow-500' :
            'bg-red-500'
          }`}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>Beginner</span>
        <span>Expert</span>
      </div>
    </div>
  );

  const RecommendationCard = ({ rec }: { rec: any }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`glass p-6 rounded-2xl border-l-4 ${
        rec.priority === 'Critical' ? 'border-red-500' : 'border-orange-500'
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{rec.skill}</h3>
          <span className={`text-sm px-2 py-1 rounded-full ${
            rec.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {rec.priority} Priority
          </span>
        </div>
        <LightBulbIcon className="w-6 h-6 text-yellow-500" />
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{rec.reason}</p>
      <div className="mb-4">
        <div className="font-medium text-gray-900 dark:text-white text-sm">{rec.action}</div>
        <div className="text-sm text-gray-500">Estimated time: {rec.timeEstimate}</div>
      </div>
      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Start Learning Path
      </button>
    </motion.div>
  );

  const allSkills = skillAssessments.flatMap(cat => cat.skills);
  const averageLevel = Math.round(allSkills.reduce((sum, skill) => sum + skill.level, 0) / allSkills.length);
  const strongSkills = allSkills.filter(skill => skill.level >= 70);
  const weakSkills = allSkills.filter(skill => skill.level < 50);
  const allRecommendations = skillAssessments.flatMap(cat => getRecommendations(cat.skills));

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              AI Skill Assessment
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Comprehensive analysis of your technical skills with personalized recommendations
            </p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass p-4 rounded-xl text-center">
              <ChartBarIcon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{averageLevel}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <CheckCircleIcon className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{strongSkills.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Strong Skills</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <XCircleIcon className="w-6 h-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{weakSkills.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Skills to Improve</div>
            </div>
            <div className="glass p-4 rounded-xl text-center">
              <ArrowTrendingUpIcon className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">+$35k</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Potential Increase</div>
            </div>
          </div>

          {/* Skill Categories */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Category Tabs */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Skill Categories
              </h2>
              <div className="space-y-2">
                {skillAssessments.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedCategory(index)}
                    className={`w-full text-left p-4 rounded-lg transition-colors ${
                      selectedCategory === index
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="font-medium">{category.category}</div>
                    <div className="text-sm text-gray-500">
                      {category.skills.length} skills assessed
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Category Skills */}
            <div className="lg:col-span-2">
              <div className="glass p-6 rounded-2xl">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {skillAssessments[selectedCategory].category}
                </h3>
                {skillAssessments[selectedCategory].skills.map((skill, index) => (
                  <SkillBar key={index} skill={skill} />
                ))}
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <LightBulbIcon className="w-6 h-6 text-yellow-500" />
              AI-Powered Recommendations
            </h2>
            {allRecommendations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allRecommendations.slice(0, 6).map((rec, index) => (
                  <RecommendationCard key={index} rec={rec} />
                ))}
              </div>
            ) : (
              <div className="glass p-8 rounded-2xl text-center">
                <CheckCircleIcon className="w-16 h-16 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Great job! Your skills are well-rounded.
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Consider exploring advanced topics or new technologies to stay ahead.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};