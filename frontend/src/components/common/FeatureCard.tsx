import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient: 'electric' | 'violet' | 'green';
  delay?: number;
}

export const FeatureCard = ({ icon, title, description, gradient, delay = 0 }: FeatureCardProps) => {
  const gradients = {
    electric: 'from-electric-500 to-electric-600',
    violet: 'from-violet-500 to-violet-600',
    green: 'from-green-500 to-green-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -5 }}
      className="glass rounded-2xl p-8 relative overflow-hidden group"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[gradient]}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[gradient]} flex items-center justify-center mb-6`}>
          {icon}
        </div>
        
        <h3 className="text-2xl font-bold mb-4">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};