import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import projectEvaluationService, { ProjectSubmission, ProjectEvaluation, EvaluationStats } from '../services/projectEvaluationService';
import EvaluationScore from '../components/project-evaluation/EvaluationScore';

const ProjectEvaluationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'submit' | 'history' | 'stats'>('submit');
  const [evaluations, setEvaluations] = useState<ProjectEvaluation[]>([]);
  const [stats, setStats] = useState<EvaluationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<ProjectSubmission>({
    projectName: '',
    description: '',
    githubUrl: '',
    projectType: 'web',
    technologies: []
  });

  const [newTechnology, setNewTechnology] = useState('');

  useEffect(() => {
    if (activeTab === 'history') {
      loadEvaluationHistory();
    } else if (activeTab === 'stats') {
      loadStats();
    }
  }, [activeTab]);

  const loadEvaluationHistory = async () => {
    try {
      setLoading(true);
      const response = await projectEvaluationService.getEvaluationHistory();
      setEvaluations(response.data.evaluations);
    } catch (error) {
      console.error('Failed to load evaluation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await projectEvaluationService.getEvaluationStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !formData.technologies.includes(newTechnology.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await projectEvaluationService.submitProject(formData);
      
      // Reset form
      setFormData({
        projectName: '',
        description: '',
        githubUrl: '',
        projectType: 'web',
        technologies: []
      });

      // Switch to history tab to show result
      setActiveTab('history');
      loadEvaluationHistory();
    } catch (error) {
      console.error('Failed to submit project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'analyzing':
        return <ClockIcon className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getGradeColor = (grade: string) => {
    if (['A+', 'A'].includes(grade)) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (['B+', 'B'].includes(grade)) return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    if (['C+', 'C'].includes(grade)) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (grade === 'D') return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Project Evaluation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get comprehensive AI-powered analysis of your projects
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'submit', label: 'Submit Project', icon: PlusIcon },
            { key: 'history', label: 'Evaluation History', icon: DocumentTextIcon },
            { key: 'stats', label: 'Statistics', icon: ChartBarIcon }
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
          {activeTab === 'submit' && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="premium-card p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Type
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="web">Web Application</option>
                      <option value="mobile">Mobile App</option>
                      <option value="desktop">Desktop Application</option>
                      <option value="api">API/Backend</option>
                      <option value="library">Library/Package</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username/repository"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Describe your project, its features, architecture, and technologies used..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Minimum 50 characters. Be detailed for better AI analysis.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technologies Used
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newTechnology}
                      onChange={(e) => setNewTechnology(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      placeholder="Add technology (e.g., React, Node.js)"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map(tech => (
                      <span
                        key={tech}
                        className="flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                  >
                    <CodeBracketIcon className="w-5 h-5" />
                    {submitting ? 'Analyzing...' : 'Submit for Evaluation'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : evaluations.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Evaluations Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Submit your first project to get started with AI evaluation.
                  </p>
                </div>
              ) : (
                evaluations.map((evaluation, index) => (
                  <motion.div
                    key={evaluation._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="premium-card p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {evaluation.projectName}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          {getStatusIcon(evaluation.evaluationStatus)}
                          <span className="capitalize">{evaluation.evaluationStatus}</span>
                          {evaluation.evaluatedAt && (
                            <>
                              <span>•</span>
                              <span>{new Date(evaluation.evaluatedAt).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {evaluation.evaluationStatus === 'completed' && (
                        <div className="flex items-center gap-4">
                          <EvaluationScore 
                            score={evaluation.overallScore} 
                            grade={evaluation.grade}
                            size="sm"
                          />
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(evaluation.grade)}`}>
                            Grade {evaluation.grade}
                          </span>
                        </div>
                      )}
                    </div>

                    {evaluation.evaluationStatus === 'completed' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                            Strengths
                          </h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {evaluation.strengths.slice(0, 2).map((strength, i) => (
                              <li key={i}>• {strength}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                            <ExclamationTriangleIcon className="w-4 h-4 text-orange-500" />
                            Areas to Improve
                          </h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {evaluation.weaknesses.slice(0, 2).map((weakness, i) => (
                              <li key={i}>• {weakness}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center gap-1">
                            <LightBulbIcon className="w-4 h-4 text-blue-500" />
                            Recommendations
                          </h4>
                          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            {evaluation.recommendations.slice(0, 2).map((rec, i) => (
                              <li key={i}>• {rec}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div
              key="stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : stats ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="premium-card p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {stats.totalEvaluations}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Total Evaluations
                      </div>
                    </div>

                    <div className="premium-card p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {stats.averageScore}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Average Score
                      </div>
                    </div>

                    <div className="premium-card p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {stats.improvementTrend.change > 0 ? '+' : ''}{stats.improvementTrend.change}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Score Trend
                      </div>
                    </div>

                    <div className="premium-card p-6 text-center">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {Object.keys(stats.gradeDistribution).length}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Grade Types
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="premium-card p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Grade Distribution
                      </h3>
                      <div className="space-y-3">
                        {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
                          <div key={grade} className="flex items-center justify-between">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(grade)}`}>
                              Grade {grade}
                            </span>
                            <span className="text-gray-600 dark:text-gray-400">
                              {count} project{count !== 1 ? 's' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="premium-card p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Evaluations
                      </h3>
                      <div className="space-y-3">
                        {stats.recentEvaluations.map((evaluation) => (
                          <div key={evaluation._id} className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900 dark:text-white">
                                {evaluation.projectName}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(evaluation.evaluatedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900 dark:text-white">
                                {evaluation.overallScore}
                              </div>
                              <div className={`text-sm font-medium ${getGradeColor(evaluation.grade).split(' ')[1]}`}>
                                {evaluation.grade}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Statistics Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Complete some project evaluations to see your statistics.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectEvaluationPage;