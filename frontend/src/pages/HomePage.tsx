import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SparklesEffect } from '../components/common/SparklesEffect';

export const HomePage = () => {
  return (
    <Layout>
      <SparklesEffect />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-12 relative z-10"
      >
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-bold mb-6 bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent"
            animate={{
              textShadow: [
                "0 0 20px rgba(59, 130, 246, 0.3)",
                "0 0 40px rgba(139, 92, 246, 0.4)",
                "0 0 20px rgba(59, 130, 246, 0.3)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Welcome to SkillNexus
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Your AI-powered skill evaluation platform
          </motion.p>
        </div>
      </motion.div>
    </Layout>
  );
};