import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Critical Routes (Loaded immediately)
import Index from "./pages/Index";
import Auth from "./pages/auth/Auth";

// Lazy-loaded Routes (Grouped by folder)
// Auth
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const Setup = lazy(() => import("./pages/auth/Setup"));

// Quiz
const Quiz = lazy(() => import("./pages/quiz/Quiz"));
const EducationLevel = lazy(() => import("./pages/quiz/EducationLevel"));
const GradeSelection = lazy(() => import("./pages/quiz/GradeSelection"));
const SubjectQuiz = lazy(() => import("./pages/quiz/SubjectQuiz"));
const SubjectSelection = lazy(() => import("./pages/quiz/SubjectSelection"));
const MarksEntry = lazy(() => import("./pages/quiz/MarksEntry"));

// Career
const Careers = lazy(() => import("./pages/career/Careers"));
const CareerComparison = lazy(() => import("./pages/career/CareerComparison"));
const Pathways = lazy(() => import("./pages/career/Pathways"));
const Results = lazy(() => import("./pages/career/Results"));
const CareerKanban = lazy(() => import("./pages/career/CareerKanban"));
const CollegeRecommendations = lazy(() => import("./pages/career/CollegeRecommendations"));

// Discovery
const Scholarships = lazy(() => import("./pages/discovery/Scholarships"));
const ExamTracker = lazy(() => import("./pages/discovery/ExamTracker"));
const EntranceExams = lazy(() => import("./pages/discovery/EntranceExams"));
const ExamFinder = lazy(() => import("./pages/discovery/ExamFinder"));
const RankPredictor = lazy(() => import("./pages/discovery/RankPredictor"));
const CareerReels = lazy(() => import("./pages/discovery/CareerReels"));

// Community
const AlumniConnect = lazy(() => import("./pages/community/AlumniConnect"));

// Account
const StudentDashboard = lazy(() => import("./pages/account/StudentDashboard"));
const Profile = lazy(() => import("./pages/account/Profile"));
const Bookmarks = lazy(() => import("./pages/account/Bookmarks"));
const AnalysisHistory = lazy(() => import("./pages/account/AnalysisHistory"));
const Settings = lazy(() => import("./pages/account/Settings"));
const PortfolioBuilder = lazy(() => import("./pages/account/PortfolioBuilder"));
const Premium = lazy(() => import("./pages/account/Premium"));

// Legal
const About = lazy(() => import("./pages/legal/About"));
const PrivacyPolicy = lazy(() => import("./pages/legal/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const Disclaimer = lazy(() => import("./pages/legal/Disclaimer"));

// Admin
const Admin = lazy(() => import("./pages/admin/Admin"));

const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10, // 10 minutes cache
      gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="zertainity-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="fixed bottom-24 right-6 z-[100] bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-border/50 p-1">
          <ThemeToggle />
        </div>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <div className="flex-1">
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/education-level" element={<EducationLevel />} />
                  <Route path="/grade-selection" element={<GradeSelection />} />
                  <Route path="/subject-selection" element={<SubjectSelection />} />
                  <Route path="/subject-quiz" element={<SubjectQuiz />} />
                  <Route path="/marks-entry" element={<MarksEntry />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/pathways" element={<Pathways />} />
                  <Route path="/career-kanban" element={<CareerKanban />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/setup" element={<Setup />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* Account / Dashboard */}
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  
                  {/* Phase 2 */}
                  <Route path="/career-comparison" element={<CareerComparison />} />
                  <Route path="/entrance-exams" element={<Navigate to="/exam-tracker" replace />} />
                  <Route path="/colleges" element={<CollegeRecommendations />} />
                  <Route path="/history" element={<AnalysisHistory />} />
                  <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/scholarships" element={<Scholarships />} />
                  <Route path="/exam-tracker" element={<ExamTracker />} />
                  <Route path="/exam-finder" element={<ExamFinder />} />
                  <Route path="/rank-predictor" element={<RankPredictor />} />
                  {/* Phase 3 */}
                  <Route path="/career-reels" element={<CareerReels />} />
                  <Route path="/alumni-connect" element={<AlumniConnect />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
            <Footer />
          </div>
          <Analytics />
          <SpeedInsights />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
