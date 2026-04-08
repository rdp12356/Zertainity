import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SupportChatbot } from "@/components/SupportChatbot";
import { useTheme } from "@/components/ThemeProvider";
import { Sun, Moon } from "lucide-react";
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
import NotFound from "./pages/NotFound";

import { Footer } from "@/components/Footer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Disclaimer from "./pages/Disclaimer";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const FloatingThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-[100px] right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
    </button>
  );
};


const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="zertainity-ui-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          {/* Maximum Client Execution Defense - Hardblock Context Menus and Copy Commands */}
          <div 
            className="flex flex-col min-h-screen selection:bg-transparent selection:text-transparent"
            onCopy={(e) => { e.preventDefault(); return false; }}
            onCut={(e) => { e.preventDefault(); return false; }}
            onPaste={(e) => { e.preventDefault(); return false; }}
            onDragStart={(e) => { e.preventDefault(); return false; }}
            onDrop={(e) => { e.preventDefault(); return false; }}
          >
            {/* Universal Floating Widgets */}
            <SupportChatbot />
            <FloatingThemeToggle />

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
);

export default App;
