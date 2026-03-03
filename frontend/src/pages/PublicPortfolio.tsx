import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPinIcon, 
  GlobeAltIcon, 
  EnvelopeIcon,
  CalendarIcon,
  TrophyIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import portfolioService, { Portfolio } from '../services/portfolioService';
import SkillRadarChart from '../components/portfolio/SkillRadarChart';

const PublicPortfolio: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPortfolio(slug);
    }
  }, [slug]);

  useEffect(() => {
    // Update document title and meta tags for SEO
    if (portfolio) {
      document.title = portfolio.seoSettings?.metaTitle || 
        `${portfolio.personalInfo.displayName} - Portfolio | SkillNexus`;
      
      // Update meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 
          portfolio.seoSettings?.metaDescription || 
          `Professional portfolio of ${portfolio.personalInfo.displayName}`
        );
      }

      // Update meta keywords
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords && portfolio.seoSettings?.keywords) {
        metaKeywords.setAttribute('content', portfolio.seoSettings.keywords.join(', '));
      }
    }

    return () => {
      // Reset title when component unmounts
      document.title = 'SkillNexus - AI-Powered Skill Evaluation Platform';
    };
  }, [portfolio]);

  const loadPortfolio = async (portfolioSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await portfolioService.getPublicPortfolio(portfolioSlug);
      setPortfolio(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Portfolio not found');
    } finally {
      setLoading(false);
    }
  };

  const generateRadarData = (skills: any[]) => {
    const categories: { [key: string]: number[] } = {};
    
    skills.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill.score);
    });

    return Object.entries(categories).map(([category, scores]) => ({
      category,
      score: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
      fullMark: 100
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Portfolio Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {error || 'The portfolio you\'re looking for doesn\'t exist or is private.'}
          </p>
        </div>
      </div>
    );
  }

  const radarData = generateRadarData(portfolio.skills);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <div 
              className="w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white shadow-2xl"
              style={{ backgroundColor: portfolio.theme.primaryColor }}
            >
              {portfolio.personalInfo.displayName?.charAt(0) || 'U'}
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900"></div>
          </div>

          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3"
          >
            {portfolio.personalInfo.displayName}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6"
          >
            {portfolio.personalInfo.title}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8"
          >
            {portfolio.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                {portfolio.personalInfo.location}
              </div>
            )}
            {portfolio.personalInfo.website && (
              <div className="flex items-center gap-1">
                <GlobeAltIcon className="w-4 h-4" />
                <a href={portfolio.personalInfo.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  Website
                </a>
              </div>
            )}
            {portfolio.personalInfo.contactEmail && (
              <div className="flex items-center gap-1">
                <EnvelopeIcon className="w-4 h-4" />
                <a href={`mailto:${portfolio.personalInfo.contactEmail}`} className="hover:text-blue-600">
                  Contact
                </a>
              </div>
            )}
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            {portfolio.personalInfo.bio || portfolio.personalInfo.aiGeneratedBio}
          </motion.p>
        </motion.div>

        {/* Skills Section */}
        {portfolio.skills.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Skills & Expertise
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="premium-card p-6">
                <SkillRadarChart data={radarData} size="lg" />
              </div>
              
              <div className="space-y-4">
                {portfolio.skills.slice(0, 8).map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-4 premium-card"
                  >
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {skill.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.level} • {skill.category}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.score}%` }}
                          transition={{ delay: 0.8 + index * 0.1, duration: 0.8 }}
                          className="h-2 rounded-full"
                          style={{ backgroundColor: portfolio.theme.primaryColor }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                        {skill.score}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* Certifications Section */}
        {portfolio.certifications.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Certifications
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {portfolio.certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="premium-card p-6"
                >
                  <div className="flex items-start gap-4">
                    <AcademicCapIcon className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {cert.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {cert.issuer}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                        <CalendarIcon className="w-4 h-4" />
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Achievements Section */}
        {portfolio.achievements.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              Achievements
            </h2>
            
            <div className="space-y-6">
              {portfolio.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 + index * 0.1 }}
                  className="premium-card p-6"
                >
                  <div className="flex items-start gap-4">
                    <TrophyIcon className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {achievement.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">
                          {achievement.type}
                        </span>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {new Date(achievement.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center py-8 border-t border-gray-200 dark:border-gray-700"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Powered by <span className="font-semibold text-blue-600">SkillNexus</span>
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default PublicPortfolio;