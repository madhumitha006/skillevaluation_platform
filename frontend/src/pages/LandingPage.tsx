import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { FloatingShapes } from '../components/common/FloatingShapes';
import { FeatureCard } from '../components/common/FeatureCard';
import { TestimonialCard } from '../components/common/TestimonialCard';

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Layout>
      <div className="space-y-32 py-12 overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center">
          <FloatingShapes />
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center space-y-8 relative z-10 px-4"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="electric" size="lg">
                🚀 SkillNexus - AI-Powered Assessment Platform
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-8xl font-bold leading-tight"
            >
              Master Your Skills with{' '}
              <motion.span
                className="bg-gradient-to-r from-electric-500 via-violet-500 to-electric-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                AI Precision
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            >
              Transform your learning journey with intelligent assessments, real-time feedback, and personalized growth paths powered by cutting-edge AI
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" onClick={() => navigate('/register')} className="relative overflow-hidden group">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-electric-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Start Free Trial</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="secondary" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-8 pt-8"
            >
              <div className="text-center">
                <motion.p
                  className="text-4xl font-bold bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  10K+
                </motion.p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              </div>
              <div className="text-center">
                <motion.p
                  className="text-4xl font-bold bg-gradient-to-r from-violet-500 to-electric-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  50K+
                </motion.p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Assessments</p>
              </div>
              <div className="text-center">
                <motion.p
                  className="text-4xl font-bold bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  95%
                </motion.p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="violet" size="lg" className="mb-4">
              ✨ Features
            </Badge>
            <h2 className="text-5xl font-bold mb-4">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">
                Excel
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features designed to accelerate your learning and skill development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="AI-Powered Analysis"
              description="Advanced algorithms evaluate your skills with precision and provide actionable insights for improvement"
              gradient="electric"
              delay={0}
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Real-time Feedback"
              description="Get instant, detailed feedback on your performance and areas for improvement as you progress"
              gradient="violet"
              delay={0.1}
            />
            <FeatureCard
              icon={
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              }
              title="Track Progress"
              description="Monitor your improvement over time with detailed analytics and personalized insights"
              gradient="green"
              delay={0.2}
            />
          </div>
        </section>

        {/* Analytics Preview Section */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-electric-500/10 to-violet-500/10" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Badge variant="electric" size="lg" className="mb-4">
                  📊 Analytics
                </Badge>
                <h2 className="text-4xl font-bold mb-6">
                  Powerful Analytics at Your{' '}
                  <span className="bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">
                    Fingertips
                  </span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  Gain deep insights into your performance with AI-powered analytics. Track your progress, identify strengths, and discover areas for improvement.
                </p>
                <ul className="space-y-4">
                  {['Skill progression tracking', 'Performance benchmarking', 'Personalized recommendations', 'Detailed reports'].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-electric-500 to-violet-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="glass rounded-2xl p-6 space-y-4">
                  {[
                    { label: 'JavaScript', value: 92, color: 'electric' },
                    { label: 'Python', value: 85, color: 'violet' },
                    { label: 'React', value: 88, color: 'green' },
                  ].map((skill, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.2 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">{skill.label}</span>
                        <span className="text-gray-600 dark:text-gray-400">{skill.value}%</span>
                      </div>
                      <div className="h-3 bg-gray-200 dark:bg-navy-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${
                            skill.color === 'electric' ? 'from-electric-500 to-electric-600' :
                            skill.color === 'violet' ? 'from-violet-500 to-violet-600' :
                            'from-green-500 to-green-600'
                          }`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="electric" size="lg" className="mb-4">
              💬 Testimonials
            </Badge>
            <h2 className="text-5xl font-bold mb-4">
              Loved by{' '}
              <span className="bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">
                Thousands
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See what our users have to say about their experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Software Engineer"
              avatar="SJ"
              content="This platform transformed how I approach skill development. The AI feedback is incredibly accurate and helpful!"
              delay={0}
            />
            <TestimonialCard
              name="Michael Chen"
              role="Data Scientist"
              avatar="MC"
              content="The analytics are mind-blowing. I can see exactly where I need to improve and track my progress in real-time."
              delay={0.1}
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Product Manager"
              avatar="ER"
              content="Best investment in my career. The personalized learning paths helped me land my dream job!"
              delay={0.2}
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-electric-500/20 to-violet-500/20" />
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(58, 129, 255, 0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(152, 41, 255, 0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(58, 129, 255, 0.2) 0%, transparent 50%)',
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <h2 className="text-5xl font-bold mb-6">
                Ready to{' '}
                <span className="bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">
                  Transform
                </span>{' '}
                Your Skills?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are already mastering their skills with AI-powered assessments
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" onClick={() => navigate('/register')} className="shadow-2xl">
                  Get Started for Free
                </Button>
              </motion.div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                No credit card required • 14-day free trial
              </p>
            </div>
          </motion.div>
        </section>
      </div>
    </Layout>
  );
};
