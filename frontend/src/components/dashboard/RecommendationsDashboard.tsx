import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LightBulbIcon, 
  ArrowTrendingUpIcon, 
  BriefcaseIcon,
  AcademicCapIcon,
  ChartBarIcon,
  StarIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export const RecommendationsDashboard: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    skills: ['JavaScript', 'React', 'CSS'],
    experience: 'Mid-level',
    goals: ['Career Growth', 'Salary Increase'],
    weakAreas: ['Backend Development', 'System Design']
  });

  const recommendations = {
    skillGaps: [
      {
        skill: 'Node.js',
        importance: 'High',
        reason: 'Required in 85% of Full Stack roles you\'re interested in',
        action: 'Take Node.js Fundamentals course',
        timeToComplete: '2 weeks',
        salaryImpact: '+$15k'
      },
      {
        skill: 'System Design',
        importance: 'High', 
        reason: 'Critical for senior developer positions',
        action: 'Study system design patterns',
        timeToComplete: '1 month',
        salaryImpact: '+$20k'
      },
      {
        skill: 'AWS',
        importance: 'Medium',
        reason: 'Cloud skills are in high demand',
        action: 'Get AWS Certified Developer certification',
        timeToComplete: '6 weeks',
        salaryImpact: '+$12k'
      }
    ],
    jobMatches: [
      {
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        match: 92,
        whyGoodFit: 'Your React and JavaScript skills are exactly what they need',
        missingSkills: ['TypeScript'],
        salaryRange: '$110k - $140k',
        action: 'Apply now - high match!'
      },
      {
        title: 'Full Stack Developer',
        company: 'StartupXYZ',
        match: 78,
        whyGoodFit: 'Great frontend skills, startup environment suits your profile',
        missingSkills: ['Node.js', 'MongoDB'],
        salaryRange: '$95k - $120k',
        action: 'Learn Node.js first, then apply'
      }
    ],
    careerPath: {
      currentLevel: 'Mid-level Frontend Developer',
      nextLevel: 'Senior Full Stack Developer',
      timeToPromotion: '8-12 months',
      keyMilestones: [
        { task: 'Master Node.js', completed: false, impact: 'High' },
        { task: 'Build 2 full-stack projects', completed: false, impact: 'High' },
        { task: 'Learn system design basics', completed: false, impact: 'Medium' },
        { task: 'Get AWS certification', completed: false, impact: 'Medium' }
      ],
      salaryIncrease: '$25k - $35k'
    },
    learningPlan: [
      {
        week: 1,
        focus: 'Node.js Basics',
        tasks: ['Complete Node.js tutorial', 'Build simple API'],
        hours: '10-12 hours'
      },
      {
        week: 2,
        focus: 'Database Integration', 
        tasks: ['Learn MongoDB', 'Connect API to database'],
        hours: '8-10 hours'
      },
      {
        week: 3,
        focus: 'Full Stack Project',
        tasks: ['Build complete CRUD app', 'Deploy to cloud'],
        hours: '12-15 hours'
      }
    ]
  };

  const SkillGapCard = ({ gap }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass p-6 rounded-2xl border-l-4 border-orange-500"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{gap.skill}</h3>
          <span className={`text-sm px-2 py-1 rounded-full ${
            gap.importance === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {gap.importance} Priority
          </span>
        </div>
        <div className="text-right">
          <div className="text-green-600 font-semibold">{gap.salaryImpact}</div>
          <div className="text-sm text-gray-500">{gap.timeToComplete}</div>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{gap.reason}</p>
      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        {gap.action}
      </button>
    </motion.div>
  );

  const JobMatchCard = ({ job }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass p-6 rounded-2xl"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{job.title}</h3>
          <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{job.match}%</div>
          <div className="text-sm text-gray-500">match</div>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
          <strong>Why it's a good fit:</strong> {job.whyGoodFit}
        </p>
        <p className="text-sm text-orange-600">
          <strong>Missing skills:</strong> {job.missingSkills.join(', ')}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-900 dark:text-white">{job.salaryRange}</span>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          {job.action}
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* AI Insights Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <LightBulbIcon className="w-8 h-8 text-yellow-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Career Insights
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Personalized recommendations based on your skills and career goals
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass p-4 rounded-xl text-center">
          <ArrowTrendingUpIcon className="w-6 h-6 mx-auto mb-2 text-green-500" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">+$25k</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Potential increase</div>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <ChartBarIcon className="w-6 h-6 mx-auto mb-2 text-blue-500" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">3</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Skills to learn</div>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <BriefcaseIcon className="w-6 h-6 mx-auto mb-2 text-purple-500" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">12</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Job matches</div>
        </div>
        <div className="glass p-4 rounded-xl text-center">
          <StarIcon className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
          <div className="text-lg font-bold text-gray-900 dark:text-white">8-12</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Months to promotion</div>
        </div>
      </div>

      {/* Priority Skills to Learn */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <AcademicCapIcon className="w-6 h-6 text-blue-500" />
          Priority Skills to Learn
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.skillGaps.map((gap, index) => (
            <SkillGapCard key={index} gap={gap} />
          ))}
        </div>
      </div>

      {/* Job Recommendations */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BriefcaseIcon className="w-6 h-6 text-green-500" />
          Smart Job Matches
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {recommendations.jobMatches.map((job, index) => (
            <JobMatchCard key={index} job={job} />
          ))}
        </div>
      </div>

      {/* Career Roadmap */}
      <div className="glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <ArrowTrendingUpIcon className="w-6 h-6 text-purple-500" />
          Your Career Roadmap
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Current Position</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {recommendations.careerPath.currentLevel}
              </div>
            </div>
            <div className="mb-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Next Level</div>
              <div className="text-lg font-semibold text-green-600">
                {recommendations.careerPath.nextLevel}
              </div>
              <div className="text-sm text-gray-500">
                {recommendations.careerPath.timeToPromotion} • {recommendations.careerPath.salaryIncrease}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Key Milestones</h3>
            <div className="space-y-3">
              {recommendations.careerPath.keyMilestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircleIcon className={`w-5 h-5 ${
                    milestone.completed ? 'text-green-500' : 'text-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm text-gray-900 dark:text-white">{milestone.task}</div>
                    <div className={`text-xs ${
                      milestone.impact === 'High' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {milestone.impact} Impact
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Learning Plan */}
      <div className="glass p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          3-Week Learning Plan
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {recommendations.learningPlan.map((week, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Week {week.week}: {week.focus}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {week.hours}
              </div>
              <ul className="space-y-1">
                {week.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ArrowRightIcon className="w-3 h-3" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};