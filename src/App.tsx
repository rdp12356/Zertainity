// ─── Third-party providers & utilities ───────────────────────────────────────
import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Moon, Sun } from "lucide-react";
import { HelmetProvider } from "react-helmet-async";

// ─── UI primitives ────────────────────────────────────────────────────────────
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// ─── App-level components ─────────────────────────────────────────────────────
import { Footer } from "@/components/Footer";
import { SupportChatbot } from "@/components/SupportChatbot";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

// ─── Pages (alphabetical) ─────────────────────────────────────────────────────
import About from "./pages/About";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Careers from "./pages/Careers";
import CareerRolePage from "./pages/CareerRolePage";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import EducationLevel from "./pages/EducationLevel";
import Exams from "./pages/Exams";
import GradeSelection from "./pages/GradeSelection";
import Index from "./pages/Index";
import MarksEntry from "./pages/MarksEntry";
import NotFound from "./pages/NotFound";
import Pathways from "./pages/Pathways";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Quiz from "./pages/Quiz";
import ResetPassword from "./pages/ResetPassword";
import Results from "./pages/Results";
import Settings from "./pages/Settings";
import Setup from "./pages/Setup";
import SharedResult from "./pages/SharedResult";
import SubjectQuiz from "./pages/SubjectQuiz";
import SubjectSelection from "./pages/SubjectSelection";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();

/** Loads AdSense only when a real publisher ID is set (avoids third-party script on placeholder configs). */
const AdSenseLoader = () => {
  useEffect(() => {
    const client = import.meta.env.VITE_ADSENSE_CLIENT_ID?.trim();
    if (!client || !/^ca-pub-\d{10,20}$/i.test(client)) return;
    const scriptId = "zertainity-adsbygoogle";
    if (document.getElementById(scriptId)) return;
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    document.head.appendChild(script);
  }, []);
  return null;
};

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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <AdSenseLoader />
            {/* Universal Floating Widgets */}
            <SupportChatbot />
            <FloatingThemeToggle />
            <SpeedInsights />

            <div className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/education-level" element={<EducationLevel />} />
                <Route path="/exams" element={<Exams />} />
                <Route path="/grade-selection" element={<GradeSelection />} />
                <Route path="/subject-selection" element={<SubjectSelection />} />
                <Route path="/subject-quiz" element={<SubjectQuiz />} />
                <Route path="/marks-entry" element={<MarksEntry />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/results" element={<Results />} />
                <Route path="/pathways" element={<Pathways />} />
                <Route path="/careers/:slug" element={<CareerRolePage />} />
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
                <Route path="/r/:slug" element={<SharedResult />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
    </HelmetProvider>
  </ThemeProvider>
);

export default App;
