import api from './api';

export interface CareerPathData {
  pathName: string;
  currentRole: string;
  targetRole: string;
  industry: 'technology' | 'finance' | 'healthcare' | 'education' | 'marketing' | 'other';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
  location?: string;
}

export interface SalaryData {
  year: number;
  salary: number;
  role: string;
  level: string;
}

export interface Milestone {
  year: number;
  title: string;
  description: string;
  requiredSkills: string[];
  certifications: string[];
  completed: boolean;
}

export interface SkillRequirement {
  skill: string;
  currentLevel: 'None' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  targetLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  priority: 'High' | 'Medium' | 'Low';
}

export interface Certification {
  name: string;
  provider: string;
  estimatedCost: number;
  timeToComplete: string;
  priority: 'High' | 'Medium' | 'Low';
  year: number;
}

export interface SimulationData {
  totalGrowthPercentage: number;
  averageYearlyIncrease: number;
  skillGapScore: number;
  timeToTarget: number;
  confidenceScore: number;
}

export interface CareerPath {
  _id: string;
  user: string;
  pathName: string;
  currentRole: string;
  targetRole: string;
  industry: string;
  experienceLevel: string;
  location: string;
  simulationData: SimulationData;
  salaryProgression: SalaryData[];
  milestones: Milestone[];
  requiredSkills: SkillRequirement[];
  certifications: Certification[];
  isActive: boolean;
  lastSimulated: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareerComparison {
  paths: Array<{
    id: string;
    name: string;
    targetRole: string;
    timeToTarget: number;
    salaryGrowth: number;
    confidenceScore: number;
    finalSalary: number;
    skillsRequired: number;
    certificationsNeeded: number;
  }>;
  recommendations: string[];
}

class CareerPathService {
  async createSimulation(pathData: CareerPathData) {
    // Mock simulation creation with realistic data
    const mockCareerPath: CareerPath = {
      _id: `path_${Date.now()}`,
      user: 'current_user',
      pathName: pathData.pathName,
      currentRole: pathData.currentRole,
      targetRole: pathData.targetRole,
      industry: pathData.industry,
      experienceLevel: pathData.experienceLevel,
      location: pathData.location || 'Remote',
      simulationData: {
        totalGrowthPercentage: Math.floor(Math.random() * 50) + 30, // 30-80%
        averageYearlyIncrease: Math.floor(Math.random() * 15) + 10, // 10-25%
        skillGapScore: Math.floor(Math.random() * 30) + 70, // 70-100
        timeToTarget: Math.floor(Math.random() * 2) + 2, // 2-4 years
        confidenceScore: Math.floor(Math.random() * 20) + 75 // 75-95%
      },
      salaryProgression: [
        { year: 1, salary: 80000, role: pathData.currentRole, level: pathData.experienceLevel },
        { year: 2, salary: 95000, role: pathData.currentRole, level: pathData.experienceLevel },
        { year: 3, salary: 120000, role: pathData.targetRole, level: 'senior' }
      ],
      milestones: [
        {
          year: 1,
          title: 'Skill Development Phase',
          description: 'Focus on building core technical skills',
          requiredSkills: ['JavaScript', 'React', 'Node.js'],
          certifications: ['AWS Certified Developer'],
          completed: false
        },
        {
          year: 2,
          title: 'Leadership & Project Management',
          description: 'Take on leadership responsibilities',
          requiredSkills: ['Team Leadership', 'Project Management'],
          certifications: ['PMP Certification'],
          completed: false
        },
        {
          year: 3,
          title: 'Role Transition',
          description: 'Transition to target role',
          requiredSkills: ['System Architecture', 'Strategic Planning'],
          certifications: ['Solution Architect Certification'],
          completed: false
        }
      ],
      requiredSkills: [
        {
          skill: 'JavaScript',
          currentLevel: 'Intermediate',
          targetLevel: 'Advanced',
          priority: 'High'
        },
        {
          skill: 'System Design',
          currentLevel: 'Beginner',
          targetLevel: 'Advanced',
          priority: 'High'
        },
        {
          skill: 'Leadership',
          currentLevel: 'None',
          targetLevel: 'Intermediate',
          priority: 'Medium'
        }
      ],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          provider: 'Amazon Web Services',
          estimatedCost: 300,
          timeToComplete: '3 months',
          priority: 'High',
          year: 1
        }
      ],
      isActive: true,
      lastSimulated: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      success: true,
      data: mockCareerPath,
      message: 'Career path simulation created successfully'
    };
  }

  async getCareerPaths() {
    // Mock career paths data
    const mockPaths: CareerPath[] = [
      {
        _id: 'path_1',
        user: 'current_user',
        pathName: 'Frontend to Full Stack Developer',
        currentRole: 'Frontend Developer',
        targetRole: 'Full Stack Developer',
        industry: 'technology',
        experienceLevel: 'mid',
        location: 'Remote',
        simulationData: {
          totalGrowthPercentage: 65,
          averageYearlyIncrease: 18,
          skillGapScore: 82,
          timeToTarget: 3,
          confidenceScore: 87
        },
        salaryProgression: [
          { year: 1, salary: 85000, role: 'Frontend Developer', level: 'mid' },
          { year: 2, salary: 100000, role: 'Frontend Developer', level: 'senior' },
          { year: 3, salary: 125000, role: 'Full Stack Developer', level: 'senior' }
        ],
        milestones: [
          {
            year: 1,
            title: 'Backend Skills Development',
            description: 'Learn Node.js, databases, and API development',
            requiredSkills: ['Node.js', 'MongoDB', 'REST APIs'],
            certifications: ['Node.js Certification'],
            completed: true
          },
          {
            year: 2,
            title: 'Full Stack Project Leadership',
            description: 'Lead a full stack project from conception to deployment',
            requiredSkills: ['Project Management', 'DevOps', 'System Architecture'],
            certifications: ['AWS Solutions Architect'],
            completed: false
          },
          {
            year: 3,
            title: 'Senior Full Stack Role',
            description: 'Transition to senior full stack developer position',
            requiredSkills: ['Mentoring', 'Code Review', 'Technical Leadership'],
            certifications: [],
            completed: false
          }
        ],
        requiredSkills: [
          {
            skill: 'Node.js',
            currentLevel: 'Beginner',
            targetLevel: 'Advanced',
            priority: 'High'
          },
          {
            skill: 'Database Design',
            currentLevel: 'None',
            targetLevel: 'Intermediate',
            priority: 'High'
          },
          {
            skill: 'System Architecture',
            currentLevel: 'Beginner',
            targetLevel: 'Intermediate',
            priority: 'Medium'
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Developer',
            provider: 'Amazon Web Services',
            estimatedCost: 150,
            timeToComplete: '2 months',
            priority: 'High',
            year: 1
          }
        ],
        isActive: true,
        lastSimulated: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    return {
      success: true,
      data: mockPaths
    };
  }

  async getCareerPath(id: string) {
    const response = await api.get(`/career-path/${id}`);
    return response.data;
  }

  async compareCareerPaths(pathIds: string[]): Promise<{ data: CareerComparison }> {
    const response = await api.post('/career-path/compare', { pathIds });
    return response.data;
  }

  async updateMilestone(pathId: string, milestoneIndex: number, completed: boolean) {
    const response = await api.patch(`/career-path/${pathId}/milestones/${milestoneIndex}`, {
      completed
    });
    return response.data;
  }

  async deleteCareerPath(id: string) {
    const response = await api.delete(`/career-path/${id}`);
    return response.data;
  }

  async getCareerRoles(industry = 'technology') {
    // Mock data for roles based on industry
    const rolesByIndustry = {
      technology: [
        'Frontend Developer',
        'Backend Developer', 
        'Full Stack Developer',
        'DevOps Engineer',
        'Data Scientist',
        'Machine Learning Engineer',
        'Product Manager',
        'UI/UX Designer',
        'Software Architect',
        'Technical Lead',
        'Engineering Manager',
        'CTO'
      ],
      finance: [
        'Financial Analyst',
        'Investment Banker',
        'Portfolio Manager',
        'Risk Analyst',
        'Quantitative Analyst',
        'Financial Advisor',
        'Credit Analyst',
        'Treasury Analyst',
        'Finance Manager',
        'CFO'
      ],
      healthcare: [
        'Registered Nurse',
        'Physician Assistant',
        'Medical Doctor',
        'Healthcare Administrator',
        'Medical Researcher',
        'Clinical Data Manager',
        'Healthcare IT Specialist',
        'Medical Device Engineer',
        'Hospital Administrator',
        'Chief Medical Officer'
      ],
      education: [
        'Teacher',
        'Curriculum Developer',
        'Educational Consultant',
        'School Administrator',
        'Academic Advisor',
        'Instructional Designer',
        'Education Technology Specialist',
        'Principal',
        'Superintendent',
        'Education Director'
      ],
      marketing: [
        'Marketing Coordinator',
        'Digital Marketing Specialist',
        'Content Marketing Manager',
        'Social Media Manager',
        'SEO Specialist',
        'Brand Manager',
        'Marketing Analyst',
        'Growth Hacker',
        'Marketing Director',
        'CMO'
      ],
      other: [
        'Project Manager',
        'Business Analyst',
        'Operations Manager',
        'Sales Representative',
        'Customer Success Manager',
        'HR Specialist',
        'Consultant',
        'Account Manager',
        'General Manager',
        'CEO'
      ]
    };

    return {
      data: rolesByIndustry[industry as keyof typeof rolesByIndustry] || rolesByIndustry.other
    };
  }
}

export default new CareerPathService();