import { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { StatCard } from '@/components/dashboard/StatCard';
import { CandidateLeaderboard } from '@/components/recruiter/CandidateLeaderboard';
import { SkillComparison } from '@/components/recruiter/SkillComparison';
import { CandidateTable } from '@/components/recruiter/CandidateTable';
import { RealtimeRecruiterDashboard } from '@/components/dashboard/RealtimeRecruiterDashboard';
import { RealtimeLeaderboard } from '@/components/common/RealtimeLeaderboard';

export const RecruiterDashboard = () => {
  const [skillFilter, setSkillFilter] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [minExperience, setMinExperience] = useState(0);
  const [showRealtime, setShowRealtime] = useState(true);

  // Mock data
  const mockCandidates = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', overallScore: 95, skills: ['JavaScript', 'React', 'Node.js'], experience: 5, rank: 1, assessmentDate: '2024-01-15' },
    { id: '2', name: 'Bob Smith', email: 'bob@example.com', overallScore: 88, skills: ['Python', 'Django', 'PostgreSQL'], experience: 4, rank: 2, assessmentDate: '2024-01-14' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', overallScore: 82, skills: ['Java', 'Spring', 'MySQL'], experience: 6, rank: 3, assessmentDate: '2024-01-13' },
    { id: '4', name: 'David Brown', email: 'david@example.com', overallScore: 78, skills: ['Go', 'Docker', 'Kubernetes'], experience: 3, rank: 4, assessmentDate: '2024-01-12' },
    { id: '5', name: 'Eve Davis', email: 'eve@example.com', overallScore: 75, skills: ['TypeScript', 'Angular', 'MongoDB'], experience: 4, rank: 5, assessmentDate: '2024-01-11' },
  ];

  const comparisonData = [
    { name: 'Alice', skills: { JavaScript: 95, React: 90, 'Node.js': 88, Python: 70, SQL: 75 } },
    { name: 'Bob', skills: { JavaScript: 75, React: 70, 'Node.js': 72, Python: 92, SQL: 88 } },
    { name: 'Carol', skills: { JavaScript: 80, React: 75, 'Node.js': 78, Python: 85, SQL: 90 } },
  ];

  const filteredCandidates = mockCandidates.filter(c => 
    c.overallScore >= minScore &&
    c.experience >= minExperience &&
    (skillFilter === '' || c.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase())))
  );

  const handleDownloadReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      totalCandidates: filteredCandidates.length,
      candidates: filteredCandidates.map(c => ({
        name: c.name,
        email: c.email,
        score: c.overallScore,
        skills: c.skills,
        experience: c.experience,
        rank: c.rank,
      })),
      aiRanking: {
        methodology: 'Candidates are ranked based on overall assessment score, skill proficiency, and experience level',
        topPerformers: filteredCandidates.slice(0, 3).map(c => c.name),
      },
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `candidate-evaluation-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Recruiter <span className="bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Evaluate and compare candidates</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setShowRealtime(!showRealtime)} variant="ghost">
              {showRealtime ? '📊 Classic View' : '🔴 Live View'}
            </Button>
            <Button onClick={handleDownloadReport}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Report
            </Button>
          </div>
        </div>

        {/* Real-time Dashboard */}
        {showRealtime && <RealtimeRecruiterDashboard />}

        {/* Real-time Leaderboard */}
        {showRealtime && (
          <Card>
            <RealtimeLeaderboard />
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            title="Total Candidates"
            value={mockCandidates.length}
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            gradient="electric"
            delay={0}
          />
          <StatCard
            title="Avg Score"
            value={85}
            suffix="%"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            gradient="violet"
            trend={5}
            delay={0.1}
          />
          <StatCard
            title="Top Performer"
            value={95}
            suffix="%"
            icon={
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            }
            gradient="green"
            delay={0.2}
          />
          <StatCard
            title="Avg Experience"
            value={4}
            suffix=" yrs"
            icon={
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            gradient="electric"
            delay={0.3}
          />
        </div>

        {/* Filters */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Filters</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Skill</label>
              <input
                type="text"
                placeholder="Search by skill..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="w-full px-4 py-2 glass rounded-xl focus:ring-2 focus:ring-electric-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Min Score: {minScore}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Min Experience: {minExperience} years</label>
              <input
                type="range"
                min="0"
                max="10"
                value={minExperience}
                onChange={(e) => setMinExperience(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* AI Ranking Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 border-l-4 border-electric-500"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">AI Ranking Methodology</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Candidates are ranked using our proprietary AI algorithm that evaluates: <strong>Overall Assessment Score (40%)</strong>, <strong>Skill Proficiency Levels (35%)</strong>, <strong>Years of Experience (15%)</strong>, and <strong>Skill Diversity (10%)</strong>. The system continuously learns from hiring outcomes to improve accuracy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Leaderboard & Comparison */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-2xl font-bold mb-6">Top Candidates</h3>
            <CandidateLeaderboard candidates={filteredCandidates.slice(0, 5)} />
          </Card>
          <SkillComparison candidates={comparisonData} />
        </div>

        {/* Candidate Table */}
        <div>
          <h3 className="text-2xl font-bold mb-6">All Candidates</h3>
          <CandidateTable candidates={filteredCandidates} />
        </div>
      </div>
    </Layout>
  );
};
