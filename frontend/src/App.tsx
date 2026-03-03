import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';
import { AnimatedBackground } from './components/common/AnimatedBackground';
import { AnimatedRoutes } from './components/common/AnimatedRoutes';
import { RouteLoadingIndicator } from './components/common/RouteLoadingIndicator';
import { LoadingSpinner } from './components/common/RouteLoadingIndicator';
import { PageTransition } from './components/common/PageTransition';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AdvancedDashboard = lazy(() => import('./pages/AdvancedDashboard').then(m => ({ default: m.AdvancedDashboard })));
const TestPage = lazy(() => import('./pages/EnhancedTestPage').then(m => ({ default: m.TestPage })));
const ResumeUploadPage = lazy(() => import('./pages/ResumeUploadPage').then(m => ({ default: m.ResumeUploadPage })));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard').then(m => ({ default: m.RecruiterDashboard })));
const InterviewPage = lazy(() => import('./pages/InterviewPage').then(m => ({ default: m.InterviewPage })));
const AdvancedLearningDashboard = lazy(() => import('./pages/AdvancedLearningDashboard').then(m => ({ default: m.AdvancedLearningDashboard })));
const CourseDetailPage = lazy(() => import('./pages/CourseDetailPage').then(m => ({ default: m.CourseDetailPage })));
const LessonPage = lazy(() => import('./pages/LessonPage').then(m => ({ default: m.LessonPage })));
const AdvancedJobMatching = lazy(() => import('./pages/AdvancedJobMatching').then(m => ({ default: m.AdvancedJobMatching })));
const JobPostingForm = lazy(() => import('./pages/JobPostingForm'));
const CompanyDashboard = lazy(() => import('./pages/CompanyDashboard'));
const PortfolioBuilder = lazy(() => import('./pages/PortfolioBuilder'));
const PublicPortfolio = lazy(() => import('./pages/PublicPortfolio'));
const ProjectEvaluationPage = lazy(() => import('./pages/ProjectEvaluationPage'));
const CareerPathSimulator = lazy(() => import('./pages/CareerPathSimulator'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

const LoadingFallback = () => <LoadingSpinner />;

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AnimatedBackground />
        <BrowserRouter>
          <RouteLoadingIndicator />
          <AnimatedRoutes>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
              <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
              <Route path="/home" element={<PageTransition><HomePage /></PageTransition>} />
              <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
              <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <PageTransition><AdvancedDashboard /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/test"
                element={
                  <ProtectedRoute>
                    <PageTransition><TestPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resume"
                element={
                  <ProtectedRoute>
                    <PageTransition><ResumeUploadPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter"
                element={
                  <RoleProtectedRoute allowedRoles={['admin', 'recruiter']}>
                    <PageTransition><RecruiterDashboard /></PageTransition>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/interviews/:interviewId"
                element={
                  <ProtectedRoute>
                    <PageTransition><InterviewPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learning"
                element={
                  <ProtectedRoute>
                    <PageTransition><AdvancedLearningDashboard /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:courseId"
                element={
                  <ProtectedRoute>
                    <PageTransition><CourseDetailPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/course/:courseId/module/:moduleId/lesson/:lessonId"
                element={
                  <ProtectedRoute>
                    <PageTransition><LessonPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <PageTransition><AdvancedJobMatching /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs/post"
                element={
                  <RoleProtectedRoute allowedRoles={['admin', 'recruiter']}>
                    <PageTransition><JobPostingForm /></PageTransition>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/company"
                element={
                  <RoleProtectedRoute allowedRoles={['company_admin', 'hr_manager']}>
                    <PageTransition><CompanyDashboard /></PageTransition>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="/portfolio"
                element={
                  <ProtectedRoute>
                    <PageTransition><PortfolioBuilder /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/portfolio/:slug"
                element={<PageTransition><PublicPortfolio /></PageTransition>}
              />
              <Route
                path="/project-evaluation"
                element={
                  <ProtectedRoute>
                    <PageTransition><ProjectEvaluationPage /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/career-simulator"
                element={
                  <ProtectedRoute>
                    <PageTransition><CareerPathSimulator /></PageTransition>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <RoleProtectedRoute allowedRoles={['admin', 'super_admin']}>
                    <PageTransition><AdminDashboard /></PageTransition>
                  </RoleProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Suspense>
        </AnimatedRoutes>
      </BrowserRouter>
    </ThemeProvider>
  </ErrorBoundary>
  );
}

export default App;
