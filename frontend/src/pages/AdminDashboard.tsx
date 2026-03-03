import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CpuChipIcon,
  BuildingOfficeIcon,
  DocumentArrowDownIcon,
  ClockIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import analyticsService, { DashboardData, HistoricalDataPoint } from '../services/analyticsService';
import KPICard from '../components/admin/KPICard';

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'ai'>('overview');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [realTime, setRealTime] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadHistoricalData();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      if (realTime) {
        loadRealTimeData();
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [period, realTime]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getDashboardData({ period });
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHistoricalData = async () => {
    try {
      const response = await analyticsService.getHistoricalData({ period, months: 12 });
      setHistoricalData(response.data);
    } catch (error) {
      console.error('Failed to load historical data:', error);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const response = await analyticsService.getRealTimeMetrics();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load real-time data:', error);
    }
  };

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      await analyticsService.exportReport(format, period);
    } catch (error) {
      console.error('Failed to export report:', error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const pieColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Platform Intelligence Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Real-time analytics and insights for SkillNexus platform
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Real-time Toggle */}
              <div className="flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-gray-500" />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={realTime}
                    onChange={(e) => setRealTime(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Real-time</span>
                </label>
              </div>

              {/* Period Selector */}
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              {/* Export Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleExport('csv')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  CSV
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                >
                  <DocumentArrowDownIcon className="w-4 h-4" />
                  JSON
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
        {dashboardData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Total Users"
              value={dashboardData.userMetrics.totalUsers}
              change={dashboardData.userMetrics.userGrowthRate}
              trend={dashboardData.userMetrics.userGrowthRate > 0 ? 'up' : 'down'}
              icon={<UsersIcon className="w-6 h-6" />}
              color="blue"
            />
            
            <KPICard
              title="Monthly Revenue"
              value={dashboardData.revenueMetrics.mrr}
              change={15}
              trend="up"
              icon={<CurrencyDollarIcon className="w-6 h-6" />}
              color="green"
              prefix="$"
            />
            
            <KPICard
              title="AI Requests"
              value={dashboardData.aiMetrics.totalAIRequests}
              change={28}
              trend="up"
              icon={<CpuChipIcon className="w-6 h-6" />}
              color="purple"
            />
            
            <KPICard
              title="Active Companies"
              value={dashboardData.platformMetrics.activeCompanies}
              change={12}
              trend="up"
              icon={<BuildingOfficeIcon className="w-6 h-6" />}
              color="orange"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Overview', icon: ChartBarIcon },
            { key: 'users', label: 'Users', icon: UsersIcon },
            { key: 'revenue', label: 'Revenue', icon: CurrencyDollarIcon },
            { key: 'ai', label: 'AI Analytics', icon: CpuChipIcon }
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
          {activeTab === 'overview' && dashboardData && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <div className="premium-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    User Growth Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <Tooltip 
                        labelFormatter={(value) => formatDate(value)}
                        formatter={(value: number) => [value.toLocaleString(), 'Users']}
                      />
                      <Area
                        type="monotone"
                        dataKey="userMetrics.totalUsers"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Revenue Chart */}
                <div className="premium-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Revenue Growth
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-600" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <YAxis 
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                      />
                      <Tooltip 
                        labelFormatter={(value) => formatDate(value)}
                        formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenueMetrics.totalRevenue"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Test Completion Rates */}
                <div className="premium-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Test Completion Rate
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {dashboardData.testMetrics.completionRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {dashboardData.testMetrics.completedTests} of {dashboardData.testMetrics.totalTests} tests completed
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${dashboardData.testMetrics.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* AI Feature Usage */}
                <div className="premium-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    AI Feature Usage
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={Object.entries(dashboardData.aiMetrics.aiFeatureUsage).map(([key, value]) => ({
                          name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {Object.entries(dashboardData.aiMetrics.aiFeatureUsage).map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Skills */}
                <div className="premium-card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Trending Skills
                  </h3>
                  <div className="space-y-3">
                    {dashboardData.skillMetrics.topSkills.slice(0, 5).map((skill, index) => (
                      <div key={skill.skill} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-600">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {skill.skill}
                            </div>
                            <div className="text-sm text-gray-500">
                              Avg: {skill.averageScore}%
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <ArrowTrendingUpIcon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {skill.growth || 0}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Other tab contents would go here */}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;