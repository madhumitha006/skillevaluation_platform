const mongoose = require('mongoose');
const JobRole = require('../models/JobRole');
const User = require('../models/User');
const logger = require('../config/logger');

const sampleJobRoles = [
  {
    title: 'Senior Full Stack Developer',
    description: 'We are looking for an experienced Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies. The ideal candidate should have strong experience in both frontend and backend development.',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    experienceLevel: 'Senior',
    salaryRange: {
      min: 120000,
      max: 160000,
      currency: 'USD'
    },
    skillRequirements: [
      { skill: 'JavaScript', weight: 9, level: 'Advanced' },
      { skill: 'React', weight: 8, level: 'Advanced' },
      { skill: 'Node.js', weight: 8, level: 'Advanced' },
      { skill: 'TypeScript', weight: 7, level: 'Intermediate' },
      { skill: 'MongoDB', weight: 6, level: 'Intermediate' },
      { skill: 'AWS', weight: 6, level: 'Intermediate' },
      { skill: 'Docker', weight: 5, level: 'Beginner' }
    ],
    tags: ['Remote', 'Full-time', 'Benefits', 'Stock Options']
  },
  {
    title: 'Frontend React Developer',
    description: 'Join our frontend team to build beautiful and responsive user interfaces. We are looking for a React specialist who can create engaging user experiences and work closely with our design team.',
    company: 'StartupXYZ',
    location: 'New York, NY',
    experienceLevel: 'Mid',
    salaryRange: {
      min: 80000,
      max: 110000,
      currency: 'USD'
    },
    skillRequirements: [
      { skill: 'React', weight: 10, level: 'Advanced' },
      { skill: 'JavaScript', weight: 9, level: 'Advanced' },
      { skill: 'CSS', weight: 8, level: 'Advanced' },
      { skill: 'HTML', weight: 7, level: 'Advanced' },
      { skill: 'TypeScript', weight: 6, level: 'Intermediate' },
      { skill: 'Redux', weight: 6, level: 'Intermediate' },
      { skill: 'Webpack', weight: 4, level: 'Beginner' }
    ],
    tags: ['Hybrid', 'Full-time', 'Health Insurance']
  },
  {
    title: 'Python Data Scientist',
    description: 'We are seeking a talented Data Scientist to analyze complex datasets and build machine learning models. You will work with large-scale data to derive insights and create predictive models.',
    company: 'DataTech Inc',
    location: 'Austin, TX',
    experienceLevel: 'Mid',
    salaryRange: {
      min: 95000,
      max: 130000,
      currency: 'USD'
    },
    skillRequirements: [
      { skill: 'Python', weight: 10, level: 'Advanced' },
      { skill: 'Machine Learning', weight: 9, level: 'Advanced' },
      { skill: 'SQL', weight: 8, level: 'Advanced' },
      { skill: 'Pandas', weight: 7, level: 'Advanced' },
      { skill: 'NumPy', weight: 7, level: 'Intermediate' },
      { skill: 'TensorFlow', weight: 6, level: 'Intermediate' },
      { skill: 'R', weight: 4, level: 'Beginner' }
    ],
    tags: ['Remote', 'Full-time', 'Research']
  },
  {
    title: 'DevOps Engineer',
    description: 'Looking for a DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will be responsible for automating deployments and ensuring system reliability.',
    company: 'CloudFirst Ltd',
    location: 'Seattle, WA',
    experienceLevel: 'Senior',
    salaryRange: {
      min: 110000,
      max: 145000,
      currency: 'USD'
    },
    skillRequirements: [
      { skill: 'AWS', weight: 10, level: 'Advanced' },
      { skill: 'Docker', weight: 9, level: 'Advanced' },
      { skill: 'Kubernetes', weight: 8, level: 'Advanced' },
      { skill: 'Linux', weight: 8, level: 'Advanced' },
      { skill: 'Terraform', weight: 7, level: 'Intermediate' },
      { skill: 'Jenkins', weight: 6, level: 'Intermediate' },
      { skill: 'Python', weight: 5, level: 'Intermediate' }
    ],
    tags: ['Remote', 'Full-time', 'On-call']
  },
  {
    title: 'Junior Web Developer',
    description: 'Great opportunity for a junior developer to start their career. You will work on various web projects and learn from experienced developers in a supportive environment.',
    company: 'WebDev Academy',
    location: 'Chicago, IL',
    experienceLevel: 'Entry',
    salaryRange: {
      min: 55000,
      max: 70000,
      currency: 'USD'
    },
    skillRequirements: [
      { skill: 'HTML', weight: 8, level: 'Intermediate' },
      { skill: 'CSS', weight: 8, level: 'Intermediate' },
      { skill: 'JavaScript', weight: 7, level: 'Intermediate' },
      { skill: 'React', weight: 6, level: 'Beginner' },
      { skill: 'Git', weight: 5, level: 'Beginner' },
      { skill: 'Node.js', weight: 4, level: 'Beginner' }
    ],
    tags: ['On-site', 'Full-time', 'Training', 'Mentorship']
  },
  {
    title: 'Mobile App Developer (React Native)',
    description: 'We need a mobile developer to build cross-platform applications using React Native. You will work on both iOS and Android applications.',
    company: 'MobileFirst Solutions',
    location: 'Los Angeles, CA',
    experienceLevel: 'Mid',
    salaryRange: {
      min: 85000,
      max: 115000,
      currency: 'USD'
    },
    skillRequirements: [
      { skill: 'React Native', weight: 10, level: 'Advanced' },
      { skill: 'JavaScript', weight: 9, level: 'Advanced' },
      { skill: 'React', weight: 8, level: 'Advanced' },
      { skill: 'iOS Development', weight: 6, level: 'Intermediate' },
      { skill: 'Android Development', weight: 6, level: 'Intermediate' },
      { skill: 'Redux', weight: 5, level: 'Intermediate' }
    ],
    tags: ['Hybrid', 'Full-time', 'Mobile']
  }
];

async function seedJobRoles() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillnexus');
    logger.info('Connected to MongoDB for seeding');

    // Find a recruiter user to assign as job poster
    let recruiterUser = await User.findOne({ role: 'recruiter' });
    
    if (!recruiterUser) {
      // Create a sample recruiter if none exists
      recruiterUser = new User({
        name: 'Sample Recruiter',
        email: 'recruiter@skillnexus.com',
        password: 'hashedpassword', // In real scenario, this would be properly hashed
        role: 'recruiter',
        isVerified: true
      });
      await recruiterUser.save();
      logger.info('Created sample recruiter user');
    }

    // Clear existing job roles
    await JobRole.deleteMany({});
    logger.info('Cleared existing job roles');

    // Add postedBy field to each job role
    const jobRolesWithPoster = sampleJobRoles.map(job => ({
      ...job,
      postedBy: recruiterUser._id,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    // Insert sample job roles
    const insertedJobs = await JobRole.insertMany(jobRolesWithPoster);
    logger.info(`Successfully seeded ${insertedJobs.length} job roles`);

    // Log the inserted jobs
    insertedJobs.forEach(job => {
      logger.info(`Created job: ${job.title} at ${job.company}`);
    });

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding job roles:', error);
    process.exit(1);
  }
}

// Run the seeding function
if (require.main === module) {
  seedJobRoles();
}

module.exports = { seedJobRoles, sampleJobRoles };