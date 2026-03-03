import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PredictionProps {
  currentScore: number;
  predictedScore: number;
  confidence: number;
  timeframe: string;
}

export const PerformancePrediction = ({ currentScore, predictedScore, confidence, timeframe }: PredictionProps) => {
  const improvement = predictedScore - currentScore;
  const isPositive = improvement > 0;

  const chartData = [
    { month: 'Now', score: currentScore, predicted: null },
    { month: '1M', score: null, predicted: currentScore + (improvement * 0.3) },
    { month: '2M', score: null, predicted: currentScore + (improvement * 0.6) },
    { month: '3M', score: null, predicted: predictedScore },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-2">🔮 Performance Prediction</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          AI-powered forecast for next {timeframe}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentScore}%
          </div>
          <div className="text-xs text-gray-500">Current</div>
        </div>
        <div className="text-center">
          <div className={`text-2xl font-bold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '+' : ''}{improvement.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500">Expected Growth</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-electric-500">
            {predictedScore}%
          </div>
          <div className="text-xs text-gray-500">Predicted</div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
          <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 24, 39, 0.9)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#3a81ff"
            fill="#3a81ff"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="#9829ff"
            fill="#9829ff"
            fillOpacity={0.2}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Confidence Level</span>
        <div className="flex items-center gap-2">
          <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-electric-500 to-violet-600"
            />
          </div>
          <span className="font-semibold">{confidence}%</span>
        </div>
      </div>
    </motion.div>
  );
};
