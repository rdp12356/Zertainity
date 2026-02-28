import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";

// Critical Routes (Loaded immediately)
import Index from "./pages/Index";
import Auth from "./pages/Auth";

// Lazy-loaded Routes
const EducationLevel = lazy(() => import("./pages/EducationLevel"));
const GradeSelection = lazy(() => import("./pages/GradeSelection"));
const SubjectQuiz = lazy(() => import("./pages/SubjectQuiz"));
const SubjectSelection = lazy(() => import("./pages/SubjectSelection"));
const MarksEntry = lazy(() => import("./pages/MarksEntry"));
const Quiz = lazy(() => import("./pages/Quiz"));
const Results = lazy(() => import("./pages/Results"));
const Pathways = lazy(() => import("./pages/Pathways"));
const Careers = lazy(() => import("./pages/Careers"));
const Admin = lazy(() => import("./pages/Admin"));
const Setup = lazy(() => import("./pages/Setup"));
const Settings = lazy(() => import("./pages/Settings"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Profile = lazy(() => import("./pages/Profile"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const CareerComparison = lazy(() => import("./pages/CareerComparison"));
const EntranceExams = lazy(() => import("./pages/EntranceExams"));
const CollegeRecommendations = lazy(() => import("./pages/CollegeRecommendations"));
const AnalysisHistory = lazy(() => import("./pages/AnalysisHistory"));

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
                  <Route path="/contact" element={<Contact />} />
                  {/* Phase 2 */}
                  <Route path="/career-comparison" element={<CareerComparison />} />
                  <Route path="/entrance-exams" element={<EntranceExams />} />
                  <Route path="/colleges" element={<CollegeRecommendations />} />
                  <Route path="/history" element={<AnalysisHistory />} />
                  {/* Phase 4 */}
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
