import { motion } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PerformanceTrendProps {
  data: Array<{ date: string; score: number }>;
}

export const PerformanceTrend = ({ data }: PerformanceTrendProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6 shadow-lg"
    >
      <h3 className="text-xl font-bold mb-6">Performance Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3a81ff" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3a81ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3a81ff" strokeOpacity={0.1} />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'currentColor', fontSize: 12 }}
            stroke="currentColor"
            strokeOpacity={0.3}
          />
          <YAxis 
            tick={{ fill: 'currentColor', fontSize: 12 }}
            stroke="currentColor"
            strokeOpacity={0.3}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 28, 84, 0.9)', 
              border: '1px solid rgba(58, 129, 255, 0.3)',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#3a81ff" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScore)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
