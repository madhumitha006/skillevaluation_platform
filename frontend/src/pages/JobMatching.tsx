import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  BookmarkIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const jobs = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120,000 - $150,000',
    type: 'Full-time',
    remote: true,
    matchScore: 95,
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    description: 'Join our innovative team building next-generation web applications with cutting-edge technologies.',
    posted: '2 days ago',
    applicants: 45,
    experience: 'Senior',
    industry: 'Technology'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$90,000 - $120,000',
    type: 'Full-time',
    remote: true,
    matchScore: 88,
    skills: ['JavaScript', 'Python', 'Docker', 'MongoDB'],
    description: 'Build scalable applications in a fast-paced startup environment with modern tech stack.',
    posted: '1 week ago',
    applicants: 23,
    experience: 'Mid-level',
    industry: 'Startup'
  },
  {
    id: '3',
    title: 'Frontend Developer',
    company: 'Digital Solutions',
    location: 'New York, NY',
    salary: '$80,000 - $100,000',
    type: 'Full-time',
    remote: false,
    matchScore: 82,
    skills: ['React', 'CSS', 'JavaScript', 'Figma'],
    description: 'Create beautiful user interfaces for enterprise clients using modern frontend technologies.',
    posted: '3 days ago',
    applicants: 67,
    experience: 'Mid-level',
    industry: 'Consulting'
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Austin, TX',
    salary: '$110,000 - $140,000',
    type: 'Full-time',
    remote: true,
    matchScore: 78,
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    description: 'Manage cloud infrastructure and deployment pipelines for high-traffic applications.',
    posted: '5 days ago',
    applicants: 34,
    experience: 'Senior',
    industry: 'Cloud Services'
  },
  {
    id: '5',
    title: 'Junior Web Developer',
    company: 'WebStudio',
    location: 'Chicago, IL',
    salary: '$60,000 - $75,000',
    type: 'Full-time',
    remote: false,
    matchScore: 85,
    skills: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
    description: 'Perfect entry-level position for new developers to grow their skills in web development.',
    posted: '1 day ago',
    applicants: 89,
    experience: 'Entry-level',
    industry: 'Digital Agency'
  },
  {
    id: '6',
    title: 'Mobile App Developer',
    company: 'AppInnovate',
    location: 'Seattle, WA',
    salary: '$95,000 - $125,000',
    type: 'Contract',
    remote: true,
    matchScore: 73,
    skills: ['React Native', 'iOS', 'Android', 'Firebase'],
    description: 'Develop cross-platform mobile applications for various client projects.',
    posted: '4 days ago',
    applicants: 56,
    experience: 'Mid-level',
    industry: 'Mobile Development'
  }
];

export const JobMatching = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    type: '',
    remote: '',
    industry: '',
    salaryRange: ''
  });
  const [sortBy, setSortBy] = useState('match');

  const experienceLevels = ['Entry-level', 'Mid-level', 'Senior'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];
  const industries = ['Technology', 'Startup', 'Consulting', 'Cloud Services', 'Digital Agency', 'Mobile Development'];
  const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Chicago, IL', 'Seattle, WA'];
  const salaryRanges = [
    { label: 'Under $75k', value: '0-75000' },
    { label: '$75k - $100k', value: '75000-100000' },
    { label: '$100k - $125k', value: '100000-125000' },
    { label: '$125k+', value: '125000+' }
  ];

  useEffect(() => {
    let filtered = jobs.filter(job => {
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = !filters.location || job.location === filters.location;
      const matchesExperience = !filters.experience || job.experience === filters.experience;
      const matchesType = !filters.type || job.type === filters.type;
      const matchesRemote = !filters.remote || (filters.remote === 'remote' ? job.remote : !job.remote);
      const matchesIndustry = !filters.industry || job.industry === filters.industry;
      
      return matchesSearch && matchesLocation && matchesExperience && matchesType && matchesRemote && matchesIndustry;
    });

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match':
          return b.matchScore - a.matchScore;
        case 'salary':
          const aSalary = parseInt(a.salary.split(' - ')[1].replace(/[^0-9]/g, ''));
          const bSalary = parseInt(b.salary.split(' - ')[1].replace(/[^0-9]/g, ''));
          return bSalary - aSalary;
        case 'date':
          return new Date(b.posted).getTime() - new Date(a.posted).getTime();
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [searchTerm, filters, sortBy]);

  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev =>
      prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
    );
  };

  const applyToJob = (jobId: string) => {
    alert(`Applied to job ${jobId}! You'll receive a confirmation email shortly.`);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      experience: '',
      type: '',
      remote: '',
      industry: '',
      salaryRange: ''
    });
  };

  const JobCard = ({ job }: { job: any }) => (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className="glass p-6 rounded-2xl cursor-pointer transition-all duration-300"
      onClick={() => setSelectedJob(job)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {job.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            job.matchScore >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
            job.matchScore >= 80 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          }`}>
            {job.matchScore}% match
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleBookmark(job.id);
            }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
          >
            {bookmarkedJobs.includes(job.id) ? (
              <BookmarkSolidIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <BookmarkIcon className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-1">
          <MapPinIcon className="w-4 h-4" />
          {job.location}
        </div>
        <div className="flex items-center gap-1">
          <CurrencyDollarIcon className="w-4 h-4" />
          {job.salary}
        </div>
        {job.remote && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full text-xs">
            Remote
          </span>
        )}
        <span className="px-2 py-1 bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full text-xs">
          {job.experience}
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.slice(0, 3).map((skill: string) => (
          <span
            key={skill}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded text-xs">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{job.posted}</span>
        <span>{job.applicants} applicants</span>
      </div>
    </motion.div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Find Your Perfect Job
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredJobs.length} jobs match your criteria
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <FunnelIcon className="w-5 h-5" />
                Filters
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                >
                  <option value="match">Best Match</option>
                  <option value="salary">Highest Salary</option>
                  <option value="date">Most Recent</option>
                </select>
              </div>
              {Object.values(filters).some(f => f) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="glass p-6 rounded-lg grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Experience</label>
                  <select
                    value={filters.experience}
                    onChange={(e) => setFilters({...filters, experience: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">All Levels</option>
                    {experienceLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">All Types</option>
                    {jobTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Remote</label>
                  <select
                    value={filters.remote}
                    onChange={(e) => setFilters({...filters, remote: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">All</option>
                    <option value="remote">Remote Only</option>
                    <option value="onsite">On-site Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry</label>
                  <select
                    value={filters.industry}
                    onChange={(e) => setFilters({...filters, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">All Industries</option>
                    {industries.map(industry => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Salary Range</label>
                  <select
                    value={filters.salaryRange}
                    onChange={(e) => setFilters({...filters, salaryRange: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  >
                    <option value="">All Ranges</option>
                    {salaryRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Jobs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <BriefcaseIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}

          {/* Job Detail Modal */}
          {selectedJob && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedJob.title}
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      {selectedJob.company}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <MapPinIcon className="w-5 h-5" />
                    {selectedJob.location}
                  </div>
                  <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <CurrencyDollarIcon className="w-5 h-5" />
                    {selectedJob.salary}
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full text-sm">
                      {selectedJob.type}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-400 rounded-full text-sm">
                      {selectedJob.experience}
                    </span>
                    {selectedJob.remote && (
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 rounded-full text-sm">
                        Remote
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Job Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    {selectedJob.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => applyToJob(selectedJob.id)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => toggleBookmark(selectedJob.id)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {bookmarkedJobs.includes(selectedJob.id) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};