const Portfolio = require('../models/Portfolio');
const PortfolioAgent = require('../agents/PortfolioAgent');
const { validationResult } = require('express-validator');
const puppeteer = require('puppeteer');

const portfolioController = {
  // Get or create user portfolio
  async getPortfolio(req, res) {
    try {
      let portfolio = await Portfolio.findOne({ user: req.user.id }).populate('user', 'name email');
      
      if (!portfolio) {
        // Create default portfolio
        portfolio = new Portfolio({
          user: req.user.id,
          personalInfo: {
            displayName: req.user.name,
            contactEmail: req.user.email
          }
        });
        await portfolio.save();
      }

      res.json({
        success: true,
        data: portfolio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get portfolio',
        error: error.message
      });
    }
  },

  // Update portfolio
  async updatePortfolio(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const portfolio = await Portfolio.findOneAndUpdate(
        { user: req.user.id },
        { $set: req.body },
        { new: true, upsert: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Portfolio updated successfully',
        data: portfolio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update portfolio',
        error: error.message
      });
    }
  },

  // Get public portfolio by slug
  async getPublicPortfolio(req, res) {
    try {
      const { slug } = req.params;
      
      const portfolio = await Portfolio.findOne({ 
        slug, 
        isPublic: true 
      }).populate('user', 'name');

      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message: 'Portfolio not found or not public'
        });
      }

      // Update analytics
      await Portfolio.findByIdAndUpdate(portfolio._id, {
        $inc: { 'analytics.views': 1 },
        'analytics.lastViewed': new Date()
      });

      // Filter visible items only
      const publicPortfolio = {
        ...portfolio.toObject(),
        skills: portfolio.skills.filter(s => s.isVisible),
        certifications: portfolio.certifications.filter(c => c.isVisible),
        achievements: portfolio.achievements.filter(a => a.isVisible),
        experience: portfolio.experience.filter(e => e.isVisible),
        projects: portfolio.projects.filter(p => p.isVisible)
      };

      res.json({
        success: true,
        data: publicPortfolio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get public portfolio',
        error: error.message
      });
    }
  },

  // Generate AI bio
  async generateAIBio(req, res) {
    try {
      const aiGeneratedBio = await PortfolioAgent.generateAIBio(req.user.id);

      res.json({
        success: true,
        message: 'AI bio generated successfully',
        data: { aiGeneratedBio }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI bio',
        error: error.message
      });
    }
  },

  // Get skill insights
  async getSkillInsights(req, res) {
    try {
      const insights = await PortfolioAgent.generateSkillInsights(req.user.id);

      res.json({
        success: true,
        data: insights
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get skill insights',
        error: error.message
      });
    }
  },

  // Export portfolio as PDF
  async exportPDF(req, res) {
    try {
      const portfolio = await Portfolio.findOne({ user: req.user.id });
      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message: 'Portfolio not found'
        });
      }

      // Generate PDF using puppeteer (simplified version)
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      
      const html = this.generatePortfolioHTML(portfolio);
      await page.setContent(html);
      
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' }
      });
      
      await browser.close();

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${portfolio.slug}-portfolio.pdf"`);
      res.send(pdf);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to export PDF',
        error: error.message
      });
    }
  },

  // Toggle portfolio visibility
  async toggleVisibility(req, res) {
    try {
      const portfolio = await Portfolio.findOne({ user: req.user.id });
      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message: 'Portfolio not found'
        });
      }

      portfolio.isPublic = !portfolio.isPublic;
      
      // Generate SEO settings if making public
      if (portfolio.isPublic) {
        await PortfolioAgent.optimizePortfolioSEO(portfolio._id);
      }
      
      await portfolio.save();

      res.json({
        success: true,
        message: `Portfolio is now ${portfolio.isPublic ? 'public' : 'private'}`,
        data: { isPublic: portfolio.isPublic }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to toggle visibility',
        error: error.message
      });
    }
  },

  // Get portfolio analytics
  async getAnalytics(req, res) {
    try {
      const portfolio = await Portfolio.findOne({ user: req.user.id });
      if (!portfolio) {
        return res.status(404).json({
          success: false,
          message: 'Portfolio not found'
        });
      }

      res.json({
        success: true,
        data: {
          analytics: portfolio.analytics,
          isPublic: portfolio.isPublic,
          publicUrl: portfolio.isPublic ? `/portfolio/${portfolio.slug}` : null
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get analytics',
        error: error.message
      });
    }
  },

  // Helper method to generate HTML for PDF
  generatePortfolioHTML(portfolio) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${portfolio.personalInfo.displayName} - Portfolio</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 25px; }
          .skill-item { display: inline-block; margin: 5px; padding: 5px 10px; background: #f0f0f0; border-radius: 5px; }
          h1 { color: ${portfolio.theme.primaryColor}; }
          h2 { color: #333; border-bottom: 2px solid ${portfolio.theme.primaryColor}; padding-bottom: 5px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${portfolio.personalInfo.displayName}</h1>
          <p>${portfolio.personalInfo.title}</p>
          <p>${portfolio.personalInfo.bio || portfolio.personalInfo.aiGeneratedBio}</p>
        </div>
        
        <div class="section">
          <h2>Skills</h2>
          ${portfolio.skills.filter(s => s.isVisible).map(skill => 
            `<span class="skill-item">${skill.name} (${skill.level})</span>`
          ).join('')}
        </div>
        
        <div class="section">
          <h2>Certifications</h2>
          ${portfolio.certifications.filter(c => c.isVisible).map(cert => 
            `<p><strong>${cert.name}</strong> - ${cert.issuer}</p>`
          ).join('')}
        </div>
        
        <div class="section">
          <h2>Achievements</h2>
          ${portfolio.achievements.filter(a => a.isVisible).map(achievement => 
            `<p><strong>${achievement.title}</strong> - ${achievement.description}</p>`
          ).join('')}
        </div>
      </body>
      </html>
    `;
  }
};

module.exports = portfolioController;