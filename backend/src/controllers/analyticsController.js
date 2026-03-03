const AnalyticsAgent = require('../agents/AnalyticsAgent');
const { validationResult } = require('express-validator');

const analyticsController = {
  // Get dashboard overview data
  async getDashboardData(req, res) {
    try {
      const { period = 'monthly', startDate, endDate } = req.query;
      
      const dashboardData = await AnalyticsAgent.generateDashboardData(
        period, 
        startDate, 
        endDate
      );

      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get dashboard data',
        error: error.message
      });
    }
  },

  // Get historical analytics data
  async getHistoricalData(req, res) {
    try {
      const { period = 'monthly', months = 12 } = req.query;
      
      const historicalData = await AnalyticsAgent.getHistoricalData(
        period, 
        parseInt(months)
      );

      res.json({
        success: true,
        data: historicalData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get historical data',
        error: error.message
      });
    }
  },

  // Export analytics report
  async exportReport(req, res) {
    try {
      const { format = 'json', period = 'monthly' } = req.query;
      
      const report = await AnalyticsAgent.exportAnalyticsReport(format, period);

      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="analytics-report.csv"');
        res.send(report);
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="analytics-report.json"');
        res.json({
          success: true,
          data: report
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to export report',
        error: error.message
      });
    }
  },

  // Get real-time metrics
  async getRealTimeMetrics(req, res) {
    try {
      // Get current day metrics
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      const realTimeData = await AnalyticsAgent.generateDashboardData(
        'daily',
        startOfDay,
        today
      );

      res.json({
        success: true,
        data: {
          ...realTimeData,
          timestamp: new Date(),
          isRealTime: true
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get real-time metrics',
        error: error.message
      });
    }
  },

  // Get specific metric trends
  async getMetricTrends(req, res) {
    try {
      const { metric, period = 'monthly', months = 6 } = req.query;
      
      if (!metric) {
        return res.status(400).json({
          success: false,
          message: 'Metric parameter is required'
        });
      }

      const historicalData = await AnalyticsAgent.getHistoricalData(period, parseInt(months));
      
      // Extract specific metric trend
      const trendData = historicalData.map(item => {
        const value = this.extractMetricValue(item, metric);
        return {
          date: item.date,
          value,
          period: item.period
        };
      });

      res.json({
        success: true,
        data: {
          metric,
          trend: trendData,
          summary: {
            current: trendData[trendData.length - 1]?.value || 0,
            previous: trendData[trendData.length - 2]?.value || 0,
            change: this.calculateChange(trendData),
            direction: this.getTrendDirection(trendData)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get metric trends',
        error: error.message
      });
    }
  },

  // Helper method to extract metric value from data
  extractMetricValue(data, metric) {
    const metricPaths = {
      'users': data.userMetrics?.totalUsers || 0,
      'revenue': data.revenueMetrics?.totalRevenue || 0,
      'ai_requests': data.aiMetrics?.totalAIRequests || 0,
      'test_completion': data.testMetrics?.completionRate || 0,
      'active_companies': data.platformMetrics?.activeCompanies || 0
    };

    return metricPaths[metric] || 0;
  },

  // Helper method to calculate percentage change
  calculateChange(trendData) {
    if (trendData.length < 2) return 0;
    
    const current = trendData[trendData.length - 1].value;
    const previous = trendData[trendData.length - 2].value;
    
    if (previous === 0) return current > 0 ? 100 : 0;
    
    return Math.round(((current - previous) / previous) * 100);
  },

  // Helper method to determine trend direction
  getTrendDirection(trendData) {
    if (trendData.length < 2) return 'stable';
    
    const recent = trendData.slice(-3);
    const increases = recent.reduce((count, item, index) => {
      if (index === 0) return count;
      return item.value > recent[index - 1].value ? count + 1 : count;
    }, 0);
    
    if (increases >= 2) return 'up';
    if (increases === 0) return 'down';
    return 'stable';
  }
};

module.exports = analyticsController;