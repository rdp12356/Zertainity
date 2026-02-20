import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import Index from "./pages/Index";
import EducationLevel from "./pages/EducationLevel";
import GradeSelection from "./pages/GradeSelection";
import SubjectQuiz from "./pages/SubjectQuiz";
import SubjectSelection from "./pages/SubjectSelection";
import MarksEntry from "./pages/MarksEntry";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import Pathways from "./pages/Pathways";
import Careers from "./pages/Careers";
import Admin from "./pages/Admin";
import Setup from "./pages/Setup";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import ResetPassword from "./pages/ResetPassword";
import CollegePredictor from "./pages/CollegePredictor";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";

import { Footer } from "@/components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";
import Contact from "./pages/Contact";

import { HelmetProvider } from "react-helmet-async";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
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
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/education-level" element={<EducationLevel />} />
                  <Route path="/grade-selection" element={<GradeSelection />} />
                  <Route path="/subject-selection" element={<SubjectSelection />} />
                  <Route path="/subject-quiz" element={<SubjectQuiz />} />
                  <Route path="/marks-entry" element={<MarksEntry />} />
                  <Route path="/quiz" element={<Quiz />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/pathways" element={<Pathways />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/college-predictor" element={<CollegePredictor />} />
                  <Route path="/dashboard" element={<StudentDashboard />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/setup" element={<Setup />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </HelmetProvider>
);

export default App;
