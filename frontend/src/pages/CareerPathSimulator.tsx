import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusIcon, 
  ChartBarIcon, 
  ArrowsRightLeftIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import careerPathService, { CareerPathData, CareerPath, CareerComparison } from '../services/careerPathService';
import SalaryProgressionChart from '../components/career-path/SalaryProgressionChart';
import CareerPathComparison from '../components/career-path/CareerPathComparison';

const CareerPathSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'paths' | 'compare'>('create');
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [comparison, setComparison] = useState<CareerComparison | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [formData, setFormData] = useState<CareerPathData>({
    pathName: '',
    currentRole: '',
    targetRole: '',
    industry: 'technology',
    experienceLevel: 'mid',
    location: 'Remote'
  });

  useEffect(() => {
    if (activeTab === 'paths') {
      loadCareerPaths();
    }
    loadAvailableRoles();
  }, [activeTab]);

  const loadCareerPaths = async () => {
    try {
      setLoading(true);
      const response = await careerPathService.getCareerPaths();
      setCareerPaths(response.data);
    } catch (error) {
      console.error('Failed to load career paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableRoles = async () => {
    try {
      const response = await careerPathService.getCareerRoles(formData.industry);
      setAvailableRoles(response.data);
    } catch (error) {
      console.error('Failed to load roles:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'industry') {
      loadAvailableRoles();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setCreating(true);
      const response = await careerPathService.createSimulation(formData);
      
      // Reset form
      setFormData({
        pathName: '',
        currentRole: '',
        targetRole: '',
        industry: 'technology',
        experienceLevel: 'mid',
        location: 'Remote'
      });

      // Switch to paths tab and reload
      setActiveTab('paths');
      loadCareerPaths();
    } catch (error) {
      console.error('Failed to create simulation:', error);
    } finally {
      setCreating(false);
    }
  };

  const handleCompareSelection = (pathId: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(pathId)) {
        return prev.filter(id => id !== pathId);
      } else if (prev.length < 3) {
        return [...prev, pathId];
      }
      return prev;
    });
  };

  const handleCompare = async () => {
    if (selectedForComparison.length < 2) return;
    
    try {
      setLoading(true);
      const response = await careerPathService.compareCareerPaths(selectedForComparison);
      setComparison(response.data);
      setActiveTab('compare');
    } catch (error) {
      console.error('Failed to compare career paths:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneToggle = async (pathId: string, milestoneIndex: number, completed: boolean) => {
    try {
      await careerPathService.updateMilestone(pathId, milestoneIndex, completed);
      loadCareerPaths();
    } catch (error) {
      console.error('Failed to update milestone:', error);
    }
  };

  const formatSalary = (salary: number) => {
    return `$${(salary / 1000).toFixed(0)}k`;
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
            AI Career Path Simulator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Simulate your 3-year career growth trajectory with AI-powered insights
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'create', label: 'Create Simulation', icon: PlusIcon },
            { key: 'paths', label: 'My Career Paths', icon: ChartBarIcon },
            { key: 'compare', label: 'Compare Paths', icon: ArrowsRightLeftIcon }
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
          {activeTab === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="premium-card p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Career Path Name *
                    </label>
                    <input
                      type="text"
                      name="pathName"
                      value={formData.pathName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Frontend to Full Stack Developer"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Industry
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="technology">Technology</option>
                      <option value="finance">Finance</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="education">Education</option>
                      <option value="marketing">Marketing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Role *
                    </label>
                    <select
                      name="currentRole"
                      value={formData.currentRole}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select current role</option>
                      {(availableRoles || []).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Target Role *
                    </label>
                    <select
                      name="targetRole"
                      value={formData.targetRole}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select target role</option>
                      {(availableRoles || []).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Experience Level
                    </label>
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="lead">Lead Level</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., San Francisco, Remote"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                  >
                    <RocketLaunchIcon className="w-5 h-5" />
                    {creating ? 'Simulating...' : 'Create Career Path'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'paths' && (
            <motion.div
              key="paths"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : careerPaths.length === 0 ? (
                <div className="text-center py-12">
                  <ChartBarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Career Paths Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Create your first career path simulation to get started.
                  </p>
                </div>
              ) : (
                <>
                  {/* Comparison Controls */}
                  {selectedForComparison.length > 0 && (
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <span className="text-sm text-blue-800 dark:text-blue-300">
                        {selectedForComparison.length} path{selectedForComparison.length !== 1 ? 's' : ''} selected for comparison
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedForComparison([])}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={handleCompare}
                          disabled={selectedForComparison.length < 2}
                          className="px-4 py-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm transition-colors"
                        >
                          Compare
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Career Paths Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {careerPaths.map((path, index) => (
                      <motion.div
                        key={path._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`premium-card p-6 cursor-pointer transition-all ${
                          selectedForComparison.includes(path._id) 
                            ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : ''
                        }`}
                        onClick={() => handleCompareSelection(path._id)}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {path.pathName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-blue-600">
                              {path.simulationData.confidenceScore}%
                            </span>
                            <input
                              type="checkbox"
                              checked={selectedForComparison.includes(path._id)}
                              onChange={() => handleCompareSelection(path._id)}
                              className="w-4 h-4 text-blue-600 rounded"
                            />
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {path.currentRole} → {path.targetRole}
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          <div className="text-center">
                            <ClockIcon className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {path.simulationData.timeToTarget}y
                            </div>
                            <div className="text-xs text-gray-500">Time</div>
                          </div>
                          <div className="text-center">
                            <CurrencyDollarIcon className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              +{path.simulationData.totalGrowthPercentage}%
                            </div>
                            <div className="text-xs text-gray-500">Growth</div>
                          </div>
                          <div className="text-center">
                            <AcademicCapIcon className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {path.requiredSkills.length}
                            </div>
                            <div className="text-xs text-gray-500">Skills</div>
                          </div>
                        </div>

                        {/* Salary Chart */}
                        <div className="mb-4">
                          <SalaryProgressionChart 
                            data={path.salaryProgression} 
                            color="#3b82f6"
                            animated={false}
                          />
                        </div>

                        {/* Milestones */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Milestones
                          </h4>
                          <div className="space-y-2">
                            {path.milestones.slice(0, 2).map((milestone, mIndex) => (
                              <div key={mIndex} className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMilestoneToggle(path._id, mIndex, !milestone.completed);
                                  }}
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                    milestone.completed 
                                      ? 'bg-green-500 border-green-500' 
                                      : 'border-gray-300 dark:border-gray-600'
                                  }`}
                                >
                                  {milestone.completed && (
                                    <CheckCircleIcon className="w-3 h-3 text-white" />
                                  )}
                                </button>
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  Year {milestone.year}: {milestone.title}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {comparison ? (
                <CareerPathComparison comparison={comparison} />
              ) : (
                <div className="text-center py-12">
                  <ArrowsRightLeftIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No Comparison Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select at least 2 career paths from the "My Career Paths" tab to compare them.
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

export default CareerPathSimulator;