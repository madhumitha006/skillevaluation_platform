import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserIcon, 
  CogIcon, 
  EyeIcon, 
  ShareIcon,
  DocumentArrowDownIcon,
  SparklesIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import portfolioService, { Portfolio, SkillInsights } from '../services/portfolioService';
import SkillRadarChart from '../components/portfolio/SkillRadarChart';

const PortfolioBuilder: React.FC = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [insights, setInsights] = useState<SkillInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'analytics'>('edit');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const [portfolioResponse, insightsResponse] = await Promise.all([
        portfolioService.getPortfolio(),
        portfolioService.getSkillInsights()
      ]);

      setPortfolio(portfolioResponse.data);
      setInsights(insightsResponse.data);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePortfolio = async (updates: Partial<Portfolio>) => {
    try {
      const response = await portfolioService.updatePortfolio(updates);
      setPortfolio(response.data);
    } catch (error) {
      console.error('Failed to update portfolio:', error);
    }
  };

  const handleGenerateAIBio = async () => {
    try {
      setIsGeneratingBio(true);
      const response = await portfolioService.generateAIBio();
      
      if (portfolio) {
        setPortfolio({
          ...portfolio,
          personalInfo: {
            ...portfolio.personalInfo,
            aiGeneratedBio: response.data.aiGeneratedBio
          }
        });
      }
    } catch (error) {
      console.error('Failed to generate AI bio:', error);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const response = await portfolioService.toggleVisibility();
      if (portfolio) {
        setPortfolio({
          ...portfolio,
          isPublic: response.data.isPublic
        });
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    }
  };

  const handleExportPDF = async () => {
    try {
      await portfolioService.exportPDF();
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const getPublicUrl = () => {
    if (!portfolio?.isPublic) return null;
    return `${window.location.origin}/portfolio/${portfolio.slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Portfolio Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Create your AI-powered professional portfolio
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleToggleVisibility}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  portfolio?.isPublic
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                <GlobeAltIcon className="w-4 h-4" />
                {portfolio?.isPublic ? 'Public' : 'Private'}
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <DocumentArrowDownIcon className="w-4 h-4" />
                Export PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'edit', label: 'Edit Portfolio', icon: UserIcon },
            { key: 'preview', label: 'Preview', icon: EyeIcon },
            { key: 'analytics', label: 'Analytics', icon: ChartBarIcon }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'edit' && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Personal Info */}
              <div className="premium-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Personal Information
                  </h3>
                  <button
                    onClick={handleGenerateAIBio}
                    disabled={isGeneratingBio}
                    className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
                  >
                    <SparklesIcon className="w-4 h-4" />
                    {isGeneratingBio ? 'Generating...' : 'AI Bio'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={portfolio?.personalInfo.displayName || ''}
                      onChange={(e) => handleUpdatePortfolio({
                        personalInfo: {
                          ...portfolio?.personalInfo,
                          displayName: e.target.value
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Professional Title
                    </label>
                    <input
                      type="text"
                      value={portfolio?.personalInfo.title || ''}
                      onChange={(e) => handleUpdatePortfolio({
                        personalInfo: {
                          ...portfolio?.personalInfo,
                          title: e.target.value
                        }
                      })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Professional Bio
                  </label>
                  <textarea
                    value={portfolio?.personalInfo.bio || portfolio?.personalInfo.aiGeneratedBio || ''}
                    onChange={(e) => handleUpdatePortfolio({
                      personalInfo: {
                        ...portfolio?.personalInfo,
                        bio: e.target.value
                      }
                    })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div className="premium-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Skills & Expertise
                </h3>
                
                {insights && (
                  <div className="mb-6">
                    <SkillRadarChart data={insights.radarData} size="md" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio?.skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.level} • {skill.score}%
                        </div>
                      </div>
                      <div className="w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
                        <div 
                          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="premium-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Achievements & Certifications
                </h3>
                
                <div className="space-y-4">
                  {portfolio?.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {achievement.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {achievement.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {achievement.type} • {new Date(achievement.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'preview' && portfolio && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="premium-card p-8"
            >
              {/* Portfolio Preview */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {portfolio.personalInfo.displayName?.charAt(0) || 'U'}
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {portfolio.personalInfo.displayName}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  {portfolio.personalInfo.title}
                </p>
                <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                  {portfolio.personalInfo.bio || portfolio.personalInfo.aiGeneratedBio}
                </p>
              </div>

              {/* Skills Preview */}
              {insights && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                    Skills Overview
                  </h2>
                  <div className="max-w-md mx-auto">
                    <SkillRadarChart data={insights.radarData} size="lg" />
                  </div>
                </div>
              )}

              {/* Public URL */}
              {portfolio.isPublic && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded-lg">
                    <ShareIcon className="w-4 h-4" />
                    <span className="text-sm">
                      Public URL: <a href={getPublicUrl()} target="_blank" rel="noopener noreferrer" className="underline">
                        {getPublicUrl()}
                      </a>
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-card p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {portfolio?.analytics.views || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Total Views
                  </div>
                </div>

                <div className="premium-card p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {insights?.totalSkills || 0}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Skills Listed
                  </div>
                </div>

                <div className="premium-card p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {insights?.averageScore || 0}%
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    Avg Skill Score
                  </div>
                </div>
              </div>

              {insights && (
                <div className="premium-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    AI Recommendations
                  </h3>
                  <div className="space-y-2">
                    {insights.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PortfolioBuilder;