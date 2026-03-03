const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { mongoSanitize, xss } = require('./middleware/sanitize');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const aiRoutes = require('./routes/aiRoutes');
const aiChatRoutes = require('./routes/aiChatRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adaptiveTestRoutes = require('./routes/adaptiveTestRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const learningRoutes = require('./routes/learningRoutes');
const aiAssistantRoutes = require('./routes/aiAssistantRoutes');
const jobMatchingRoutes = require('./routes/jobMatching');
const companyRoutes = require('./routes/company');
const portfolioRoutes = require('./routes/portfolio');
const projectEvaluationRoutes = require('./routes/projectEvaluation');
const careerPathRoutes = require('./routes/careerPath');
const adminAnalyticsRoutes = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./config/logger');

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Compression middleware - MUST be early
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  level: 6,
}));

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS with preflight
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Preflight

// Data sanitization
app.use(mongoSanitize());
app.use(xss());

// Response caching headers
app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

// Serve static files from frontend build
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: process.memoryUsage(),
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/adaptive', adaptiveTestRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/assistant', aiAssistantRoutes);
app.use('/api/tenant/:tenantSlug/jobs', jobMatchingRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/project-evaluation', projectEvaluationRoutes);
app.use('/api/career-path', careerPathRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);
app.use('/api/ai', aiChatRoutes);
app.use('/api/ai', aiRoutes);

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
