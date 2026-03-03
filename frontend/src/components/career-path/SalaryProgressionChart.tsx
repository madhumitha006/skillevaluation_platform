import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SalaryData } from '../../services/careerPathService';

interface SalaryProgressionChartProps {
  data: SalaryData[];
  color?: string;
  animated?: boolean;
}

const SalaryProgressionChart: React.FC<SalaryProgressionChartProps> = ({ 
  data, 
  color = '#3b82f6',
  animated = true 
}) => {
  const formatSalary = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">
            Year {label}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Role: {data.role}
          </p>
          <p className="text-sm font-medium" style={{ color }}>
            Salary: {formatSalary(data.salary)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={animated ? { opacity: 0, scale: 0.95 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5 }}
      className="w-full h-64"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            className="dark:stroke-gray-600"
          />
          <XAxis 
            dataKey="year" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            className="dark:fill-gray-400"
          />
          <YAxis 
            tickFormatter={formatSalary}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            className="dark:fill-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="salary"
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 6 }}
            activeDot={{ r: 8, stroke: color, strokeWidth: 2 }}
            animationDuration={animated ? 1500 : 0}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default SalaryProgressionChart;