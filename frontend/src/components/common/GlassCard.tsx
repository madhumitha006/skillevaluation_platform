interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard = ({ children, className = '', hover = true }: GlassCardProps) => {
  return (
    <div className={`
      backdrop-blur-lg bg-white/10 dark:bg-gray-800/10 
      border border-white/20 dark:border-gray-700/20 
      rounded-2xl shadow-xl
      ${hover ? 'hover:bg-white/20 dark:hover:bg-gray-800/20 hover:scale-105 transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;
export { GlassCard };


