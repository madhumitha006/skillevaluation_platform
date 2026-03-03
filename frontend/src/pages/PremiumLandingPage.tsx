import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';

export const LandingPage = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <Layout>
      <div className="bg-mesh min-h-screen">
        <div className="space-y-32 py-12 overflow-hidden relative">
          {/* Hero Section */}
          <section className="relative min-h-[90vh] flex items-center justify-center">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-center space-y-12 relative z-10 px-4 max-w-6xl mx-auto"
            >
              <motion.div variants={itemVariants}>
                <Badge variant="electric" size="lg" className="animate-pulse-premium">
                  🚀 SkillNexus - AI-Powered Assessment Platform
                </Badge>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-7xl md:text-9xl font-bold leading-tight text-gradient-premium"
              >
                Master Your Skills with{' '}
                <motion.span
                  className="text-glow-premium"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 40px rgba(139, 92, 246, 0.8)',
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  AI Precision
                </motion.span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-2xl md:text-3xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
              >
                Transform your learning journey with intelligent assessments, real-time feedback, and personalized growth paths powered by cutting-edge AI
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row justify-center gap-6"
              >
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.95 }}
                  className="relative"
                >
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/register')} 
                    className="btn-premium px-12 py-6 text-xl relative overflow-hidden group"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-violet-600 to-electric-600 opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10 flex items-center gap-3">
                      Start Free Trial
                      <motion.svg 
                        className="w-6 h-6" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    onClick={() => navigate('/login')}
                    className="btn-glass px-12 py-6 text-xl"
                  >
                    Sign In
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center justify-center gap-12 pt-12"
              >
                {[
                  { value: '10K+', label: 'Active Users', color: 'electric' },
                  { value: '50K+', label: 'Assessments', color: 'violet' },
                  { value: '95%', label: 'Satisfaction', color: 'pink' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <motion.p
                      className={`text-5xl font-bold bg-gradient-to-r ${
                        stat.color === 'electric' ? 'from-electric-400 to-electric-600' :
                        stat.color === 'violet' ? 'from-violet-400 to-violet-600' :
                        'from-pink-400 to-pink-600'
                      } bg-clip-text text-transparent`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.2, duration: 0.8, type: "spring" }}
                    >
                      {stat.value}
                    </motion.p>
                    <p className="text-lg text-gray-400 mt-2">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </section>

          {/* Features Section */}
          <section className="relative px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-20"
            >
              <Badge variant="violet" size="lg" className="mb-6 animate-float">
                ✨ Features
              </Badge>
              <h2 className="text-6xl font-bold mb-6 text-gradient-premium">
                Everything You Need to{' '}
                <span className="text-glow-premium">
                  Excel
                </span>
              </h2>
              <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
                Powerful features designed to accelerate your learning and skill development
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[
                {
                  icon: "⚡",
                  title: "AI-Powered Analysis",
                  description: "Advanced algorithms evaluate your skills with precision and provide actionable insights for improvement",
                  gradient: "electric",
                },
                {
                  icon: "🎯",
                  title: "Real-time Feedback",
                  description: "Get instant, detailed feedback on your performance and areas for improvement as you progress",
                  gradient: "violet",
                },
                {
                  icon: "📊",
                  title: "Track Progress",
                  description: "Monitor your improvement over time with detailed analytics and personalized insights",
                  gradient: "pink",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="card-premium group cursor-pointer"
                >
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gradient-premium">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="relative px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="card-premium text-center relative overflow-hidden max-w-5xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-electric-500/20 to-violet-500/20" />
              <motion.div
                className="absolute inset-0 bg-animated opacity-10"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              
              <div className="relative z-10 py-8">
                <h2 className="text-6xl font-bold mb-8 text-gradient-premium">
                  Ready to{' '}
                  <span className="text-glow-premium">
                    Transform
                  </span>{' '}
                  Your Skills?
                </h2>
                <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
                  Join thousands of learners who are already mastering their skills with AI-powered assessments
                </p>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -5 }} 
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/register')} 
                    className="btn-premium px-16 py-8 text-2xl shadow-3xl"
                  >
                    Get Started for Free
                  </Button>
                </motion.div>
                <p className="text-gray-400 mt-6">
                  No credit card required • 14-day free trial
                </p>
              </div>
            </motion.div>
          </section>
        </div>
      </div>
    </Layout>
  );
};