import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Layout } from '@/components/layout/Layout';
import { FileUpload } from '@/components/common/FileUpload';
import { Button } from '@/components/common/Button';
import { SkillDisplay } from '@/components/resume/SkillDisplay';
import { AISummary } from '@/components/resume/AISummary';
import { SkeletonCard } from '@/components/common/Skeleton';

export const ResumeUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError('');
    setAnalysisResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setIsAnalyzing(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setAnalysisResult(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };

  const handleDownloadReport = () => {
    if (!analysisResult) return;

    const reportData = {
      fileName: analysisResult.fileName,
      summary: analysisResult.analysis.summary,
      skills: analysisResult.profile.categorizedSkills,
      proficiency: analysisResult.profile.proficiencyLevels,
      analyzedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skill-analysis-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">
            AI-Powered Resume{' '}
            <span className="bg-gradient-to-r from-electric-500 to-violet-600 bg-clip-text text-transparent">
              Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Upload your resume and let AI extract your skills automatically
          </p>
        </motion.div>

        {/* Upload Section */}
        {!analysisResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <FileUpload onFileSelect={handleFileSelect} isUploading={isUploading} />

            {file && !isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-between glass rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500 to-violet-600 flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button onClick={handleUpload}>
                  Analyze Resume
                </Button>
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-600 dark:text-red-400"
              >
                {error}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-8 text-center"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-electric-500 to-violet-600 mb-4">
                <svg className="animate-spin w-10 h-10 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2">Analyzing Your Resume...</h3>
              <p className="text-gray-600 dark:text-gray-400">AI is extracting skills and generating insights</p>
            </motion.div>
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {/* Results */}
        {analysisResult && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">Analysis Results</h2>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => {
                  setAnalysisResult(null);
                  setFile(null);
                }}>
                  Upload New Resume
                </Button>
                <Button onClick={handleDownloadReport}>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Report
                </Button>
              </div>
            </div>

            <AISummary
              summary={analysisResult.analysis.summary}
              fileName={analysisResult.fileName}
            />

            <div>
              <h3 className="text-2xl font-bold mb-6">Extracted Skills</h3>
              <SkillDisplay
                skills={analysisResult.profile.categorizedSkills}
                proficiency={analysisResult.profile.proficiencyLevels}
              />
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
};
