import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '../common/Badge';

interface Candidate {
  id: string;
  name: string;
  email: string;
  overallScore: number;
  skills: string[];
  experience: number;
  assessmentDate: string;
}

interface CandidateTableProps {
  candidates: Candidate[];
  onSelectCandidate?: (candidate: Candidate) => void;
}

export const CandidateTable = ({ candidates, onSelectCandidate }: CandidateTableProps) => {
  const [sortField, setSortField] = useState<keyof Candidate>('overallScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof Candidate) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    if (Array.isArray(aVal) && Array.isArray(bVal)) {
      return sortDirection === 'asc' ? aVal.length - bVal.length : bVal.length - aVal.length;
    }
    
    return sortDirection === 'asc' 
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });

  const totalPages = Math.ceil(sortedCandidates.length / itemsPerPage);
  const paginatedCandidates = sortedCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const SortIcon = ({ field }: { field: keyof Candidate }) => {
    if (sortField !== field) return null;
    return (
      <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
      </svg>
    );
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              <th 
                className="text-left py-4 px-4 font-semibold cursor-pointer hover:text-electric-500 transition-colors"
                onClick={() => handleSort('name')}
              >
                Name <SortIcon field="name" />
              </th>
              <th 
                className="text-left py-4 px-4 font-semibold cursor-pointer hover:text-electric-500 transition-colors"
                onClick={() => handleSort('overallScore')}
              >
                Score <SortIcon field="overallScore" />
              </th>
              <th 
                className="text-left py-4 px-4 font-semibold cursor-pointer hover:text-electric-500 transition-colors"
                onClick={() => handleSort('skills')}
              >
                Skills <SortIcon field="skills" />
              </th>
              <th 
                className="text-left py-4 px-4 font-semibold cursor-pointer hover:text-electric-500 transition-colors"
                onClick={() => handleSort('experience')}
              >
                Experience <SortIcon field="experience" />
              </th>
              <th className="text-left py-4 px-4 font-semibold">Date</th>
              <th className="text-left py-4 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCandidates.map((candidate, idx) => (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ backgroundColor: 'rgba(58, 129, 255, 0.05)' }}
                className="border-b border-gray-200 dark:border-white/5 transition-colors cursor-pointer"
                onClick={() => onSelectCandidate?.(candidate)}
              >
                <td className="py-4 px-4">
                  <div>
                    <p className="font-semibold">{candidate.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{candidate.email}</p>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">
                    {candidate.overallScore}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="info" size="sm">{candidate.skills.length} skills</Badge>
                </td>
                <td className="py-4 px-4">
                  <span className="font-medium">{candidate.experience} years</span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                  {candidate.assessmentDate}
                </td>
                <td className="py-4 px-4">
                  <button className="text-electric-500 hover:text-electric-600 font-semibold text-sm">
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, candidates.length)} of {candidates.length} candidates
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 glass rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === page
                  ? 'bg-gradient-to-r from-electric-500 to-violet-600 text-white shadow-lg'
                  : 'glass hover:shadow-md'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 glass rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
