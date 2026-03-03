import { motion } from 'framer-motion';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

interface SummaryData {
  totalSkills: number;
  technicalSkills: number;
  softSkills: number;
  expertSkills: string[];
  topCategories: Array<{ name: string; count: number }>;
  overallLevel: string;
}

interface AISummaryProps {
  summary: SummaryData;
  fileName: string;
}

export const AISummary = ({ summary, fileName }: AISummaryProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card glow="electric" className="mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">AI Analysis Summary</h2>
            <p className="text-gray-600 dark:text-gray-400">Resume: {fileName}</p>
          </div>
          <Badge variant="electric" size="lg">{summary.overallLevel}</Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center p-4 glass rounded-xl"
          >
            <p className="text-4xl font-bold bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent mb-2">
              {summary.totalSkills}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Skills</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center p-4 glass rounded-xl"
          >
            <p className="text-4xl font-bold text-electric-500 mb-2">{summary.technicalSkills}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Technical Skills</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center p-4 glass rounded-xl"
          >
            <p className="text-4xl font-bold text-violet-500 mb-2">{summary.softSkills}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Soft Skills</p>
          </motion.div>
        </div>

        {summary.expertSkills.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Expert Level Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {summary.expertSkills.map((skill, idx) => (
                <motion.div
                  key={skill}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + idx * 0.05 }}
                >
                  <Badge variant="electric">{skill}</Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-bold mb-3">Top Skill Categories</h3>
          <div className="space-y-3">
            {summary.topCategories.map((category, idx) => (
              <div key={category.name}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium capitalize">{category.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">{category.count} skills</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-navy-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-electric-500 to-violet-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${(category.count / summary.totalSkills) * 100}%` }}
                    transition={{ duration: 1, delay: 0.7 + idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
};
