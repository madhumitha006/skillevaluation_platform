// Mock data for interactive user experience
export const mockData = {
  // Dashboard stats
  dashboardStats: {
    totalTests: 24,
    completedTests: 18,
    averageScore: 87,
    skillsAssessed: 12,
    timeSpent: "45h 30m",
    rank: 3,
    totalUsers: 1247
  },

  // Job matching data
  jobMatching: {
    jobs: [
      {
        _id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        salary: '$120,000 - $150,000',
        experienceLevel: 'Senior',
        matchScore: 92,
        skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
        description: 'Join our innovative team building next-gen web applications.',
        postedDate: '2024-01-15',
        applicants: 45
      },
      {
        _id: '2',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'Remote',
        salary: '$90,000 - $120,000',
        experienceLevel: 'Mid',
        matchScore: 88,
        skills: ['JavaScript', 'Python', 'Docker', 'MongoDB'],
        description: 'Build scalable applications in a fast-paced startup environment.',
        postedDate: '2024-01-12',
        applicants: 23
      },
      {
        _id: '3',
        title: 'React Developer',
        company: 'Digital Solutions',
        location: 'New York, NY',
        salary: '$80,000 - $100,000',
        experienceLevel: 'Mid',
        matchScore: 85,
        skills: ['React', 'Redux', 'CSS', 'Jest'],
        description: 'Create beautiful user interfaces for enterprise clients.',
        postedDate: '2024-01-10',
        applicants: 67
      }
    ],
    skillGapAnalysis: {
      prioritizedSkills: [
        { skill: 'AWS', frequency: 15, totalWeight: 45, levels: new Set(['Intermediate', 'Advanced']) },
        { skill: 'Docker', frequency: 12, totalWeight: 38, levels: new Set(['Beginner', 'Intermediate']) },
        { skill: 'GraphQL', frequency: 8, totalWeight: 24, levels: new Set(['Beginner']) }
      ],
      recommendations: [
        'Focus on cloud technologies like AWS to increase job opportunities',
        'Learn containerization with Docker for modern development workflows',
        'Consider GraphQL for API development skills'
      ]
    }
  },

  // Career paths
  careerPaths: [
    {
      _id: '1',
      pathName: 'Frontend to Full Stack Developer',
      currentRole: 'Frontend Developer',
      targetRole: 'Full Stack Developer',
      simulationData: {
        confidenceScore: 85,
        timeToTarget: 2,
        totalGrowthPercentage: 45
      },
      requiredSkills: ['Node.js', 'Database Design', 'API Development', 'DevOps'],
      salaryProgression: [
        { year: 2024, salary: 75000 },
        { year: 2025, salary: 90000 },
        { year: 2026, salary: 110000 }
      ],
      milestones: [
        { year: 1, title: 'Master Node.js fundamentals', completed: true },
        { year: 1, title: 'Build first full-stack project', completed: false },
        { year: 2, title: 'Learn database optimization', completed: false }
      ]
    }
  ],

  // Learning courses
  learningCourses: [
    {
      _id: '1',
      title: 'Advanced React Patterns',
      instructor: 'Sarah Johnson',
      duration: '8 hours',
      level: 'Advanced',
      rating: 4.8,
      students: 1234,
      progress: 65,
      thumbnail: '/api/placeholder/300/200',
      skills: ['React', 'Hooks', 'Context API'],
      description: 'Master advanced React patterns and best practices'
    },
    {
      _id: '2',
      title: 'Node.js Masterclass',
      instructor: 'Mike Chen',
      duration: '12 hours',
      level: 'Intermediate',
      rating: 4.9,
      students: 2156,
      progress: 0,
      thumbnail: '/api/placeholder/300/200',
      skills: ['Node.js', 'Express', 'MongoDB'],
      description: 'Build scalable backend applications with Node.js'
    }
  ],

  // Test results
  testResults: [
    {
      _id: '1',
      testName: 'JavaScript Fundamentals',
      score: 92,
      maxScore: 100,
      completedAt: '2024-01-15T10:30:00Z',
      duration: 45,
      category: 'Programming',
      skills: ['JavaScript', 'ES6', 'Async/Await'],
      feedback: 'Excellent understanding of JavaScript concepts!'
    },
    {
      _id: '2',
      testName: 'React Components',
      score: 88,
      maxScore: 100,
      completedAt: '2024-01-12T14:20:00Z',
      duration: 60,
      category: 'Frontend',
      skills: ['React', 'JSX', 'Props'],
      feedback: 'Good grasp of React fundamentals, practice more with hooks.'
    }
  ],

  // Available roles for dropdowns
  availableRoles: [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager',
    'UI/UX Designer',
    'Mobile Developer',
    'Cloud Architect',
    'Security Engineer'
  ],

  // Notifications
  notifications: [
    {
      _id: '1',
      title: 'New job match found!',
      message: 'A Senior React Developer position matches your skills 95%',
      type: 'job_match',
      read: false,
      createdAt: '2024-01-15T09:00:00Z'
    },
    {
      _id: '2',
      title: 'Course completed',
      message: 'Congratulations! You completed "Advanced React Patterns"',
      type: 'achievement',
      read: false,
      createdAt: '2024-01-14T16:45:00Z'
    }
  ],

  // Skills data
  skills: [
    { name: 'JavaScript', level: 85, category: 'Programming' },
    { name: 'React', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 70, category: 'Backend' },
    { name: 'TypeScript', level: 75, category: 'Programming' },
    { name: 'AWS', level: 60, category: 'Cloud' },
    { name: 'Docker', level: 55, category: 'DevOps' }
  ]
};

// Mock API responses
export const mockApiResponses = {
  '/api/jobs/matching': { data: mockData.jobMatching.jobs },
  '/api/jobs/skill-gap-analysis': { data: mockData.jobMatching.skillGapAnalysis },
  '/api/jobs/bookmarked': { data: [] },
  '/api/career-paths': { data: mockData.careerPaths },
  '/api/career-paths/roles': { data: mockData.availableRoles },
  '/api/learning/courses': { data: mockData.learningCourses },
  '/api/tests/results': { data: mockData.testResults },
  '/api/dashboard/stats': { data: mockData.dashboardStats },
  '/api/notifications': { data: mockData.notifications },
  '/api/skills': { data: mockData.skills }
};