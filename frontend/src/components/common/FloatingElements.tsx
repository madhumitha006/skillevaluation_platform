import { motion } from 'framer-motion';

export const FloatingElements = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Floating geometric shapes */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute ${
            i % 3 === 0 ? 'w-4 h-4 bg-electric-500/10 rounded-full' :
            i % 3 === 1 ? 'w-6 h-6 bg-violet-500/10 rotate-45' :
            'w-3 h-8 bg-gradient-to-b from-electric-500/10 to-violet-500/10 rounded-full'
          }`}
          initial={{
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0,
            y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
            rotate: 0,
            scale: 0
          }}
          animate={{
            y: -100,
            rotate: 360,
            scale: [0, 1, 0.8, 1, 0],
            x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 0
          }}
          transition={{
            duration: Math.random() * 10 + 15,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}
      
      {/* Pulsing orbs */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute w-32 h-32 rounded-full bg-gradient-radial from-electric-500/5 to-transparent blur-xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: Math.random() * 4 + 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
};