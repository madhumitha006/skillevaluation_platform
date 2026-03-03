import { motion } from 'framer-motion';
import { Badge } from '../common/Badge';

interface Candidate {
  id: string;
  name: string;
  email: string;
  overallScore: number;
  skills: string[];
  experience: number;
  rank: number;
}

interface LeaderboardProps {
  candidates: Candidate[];
}

export const CandidateLeaderboard = ({ candidates }: LeaderboardProps) => {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-electric-500 to-violet-600';
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return (
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return <span className="text-white font-bold text-lg">{rank}</span>;
  };

  return (
    <div className="space-y-4">
      {candidates.map((candidate, idx) => (
        <motion.div
          key={candidate.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          whileHover={{ scale: 1.02, x: 5 }}
          className="glass rounded-xl p-4 flex items-center gap-4 hover:shadow-lg transition-all duration-300"
        >
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getRankColor(candidate.rank)} flex items-center justify-center shadow-lg flex-shrink-0`}>
            {getRankIcon(candidate.rank)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg truncate">{candidate.name}</h3>
              {candidate.rank <= 3 && (
                <Badge variant="electric" size="sm">Top {candidate.rank}</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{candidate.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">{candidate.experience} years exp</span>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{candidate.skills.length} skills</span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">
              {candidate.overallScore}
            </p>
            <p className="text-xs text-gray-500">Score</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
