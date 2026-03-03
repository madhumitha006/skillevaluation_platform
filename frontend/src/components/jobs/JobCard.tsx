import React from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, BuildingOfficeIcon, BookmarkIcon, EyeIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import MatchScore from './MatchScore';
import { JobRole } from '../../services/jobMatchingService';

interface JobCardProps {
  job: JobRole;
  onViewDetails: (job: JobRole) => void;
  onToggleBookmark?: (jobId: string) => void;
  isBookmarked?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ 
  job, 
  onViewDetails, 
  onToggleBookmark,
  isBookmarked = false 
}) => {
  const formatSalary = (salaryRange?: { min: number; max: number; currency: string }) => {
    if (!salaryRange) return 'Salary not disclosed';
    return `${salaryRange.currency} ${salaryRange.min.toLocaleString()} - ${salaryRange.max.toLocaleString()}`;
  };

  const getExperienceBadgeColor = (level: string) => {
    const colors = {
      Entry: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Mid: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Senior: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      Lead: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[level as keyof typeof colors] || colors.Entry;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="premium-card p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {job.title}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceBadgeColor(job.experienceLevel)}`}>
              {job.experienceLevel}
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <BuildingOfficeIcon className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPinIcon className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
            {job.description}
          </p>
          
          <div className="text-sm font-medium text-gray-900 dark:text-white mb-4">
            {formatSalary(job.salaryRange)}
          </div>
        </div>
        
        {job.matchScore !== undefined && (
          <div className="ml-4">
            <MatchScore score={job.matchScore} size="sm" />
          </div>
        )}
      </div>

      {/* Skill Requirements Preview */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {job.skillRequirements.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded-full"
            >
              {skill.skill} ({skill.level})
            </span>
          ))}
          {job.skillRequirements.length > 4 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{job.skillRequirements.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Skill Gaps */}
      {job.skillGaps && job.skillGaps.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Missing Skills:
          </h4>
          <div className="flex flex-wrap gap-2">
            {job.skillGaps.slice(0, 3).map((gap, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 text-xs rounded-full"
              >
                {gap.skill}
              </span>
            ))}
            {job.skillGaps.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                +{job.skillGaps.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onViewDetails(job)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          View Details
        </button>
        
        {onToggleBookmark && (
          <button
            onClick={() => onToggleBookmark(job._id)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isBookmarked ? (
              <BookmarkSolidIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <BookmarkIcon className="w-5 h-5 text-gray-500" />
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default JobCard;