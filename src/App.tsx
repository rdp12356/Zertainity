// ─── Third-party providers & utilities ───────────────────────────────────────
import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { HelmetProvider } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

// ─── UI primitives ────────────────────────────────────────────────────────────
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

// ─── App-level components ─────────────────────────────────────────────────────
import { Footer } from "@/components/Footer";
import { SupportChatbot } from "@/components/SupportChatbot";
import { SupportChatProvider } from "@/contexts/SupportChatContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { FloatingThemeToggle } from "@/components/FloatingThemeToggle";

// ─── Pages (alphabetical) ─────────────────────────────────────────────────────
import About from "./pages/About";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Careers from "./pages/Careers";
import CareerRolePage from "./pages/CareerRolePage";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
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
import SharedResult from "./pages/SharedResult";
import SubjectQuiz from "./pages/SubjectQuiz";
import SubjectSelection from "./pages/SubjectSelection";
import TermsOfService from "./pages/TermsOfService";

const queryClient = new QueryClient();
const routerBasename = import.meta.env.BASE_URL === "/" ? undefined : import.meta.env.BASE_URL;

const loadAdSense = (client: string) => {
  const scriptId = "zertainity-adsbygoogle";
  if (document.getElementById(scriptId)) return;
  const script = document.createElement("script");
  script.id = scriptId;
  script.async = true;
  script.crossOrigin = "anonymous";
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
  document.head.appendChild(script);

  try {
    (window as any).adsbygoogle = (window as any).adsbygoogle || [];
  } catch (e) {
    console.warn("AdSense initializer error", e);
  }
};

const cleanupAdSense = () => {
  const script = document.getElementById("zertainity-adsbygoogle");
  if (script) {
    script.remove();
  }

  const selectors = [
    ".google-auto-placed",
    "ins.adsbygoogle",
    "iframe[id^='aswift_']",
    "iframe[name^='aswift_']",
    "iframe[id^='google_ads_']",
    "iframe[name^='google_ads_']",
    ".adsbygoogle",
    "iframe[src*='googleads']"
  ];
  
  selectors.forEach(selector => {
    try {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    } catch (e) {
      console.error("Error removing AdSense element:", e);
    }
  });
};

/** Loads AdSense only on content-rich allowed public pages and cleans it up completely on other routes. */
const AdSenseLoader = () => {
  const location = useLocation();

  useEffect(() => {
    const client = import.meta.env.VITE_ADSENSE_CLIENT_ID?.trim();
    if (!client || !/^ca-pub-\d{10,20}$/i.test(client)) return;

    const pathname = location.pathname;
    const isAllowed = 
      pathname === "/" ||
      pathname === "/about" ||
      pathname === "/careers" ||
      pathname.startsWith("/careers/");

    if (isAllowed) {
      loadAdSense(client);
    } else {
      cleanupAdSense();
    }
  }, [location.pathname]);

  return null;
};

const ScrollToTopOnNavigation = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

import { CurvesProvider, useCurves } from "./components/CurvesContext";
import DecorativeCurves from "./components/DecorativeCurves";

const AppShell = () => {
  const location = useLocation();
  const curves = useCurves();

  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);
  const [impersonatedEmail, setImpersonatedEmail] = useState<string | null>(null);
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUserRoleAndImpersonation = async () => {
      const impId = localStorage.getItem('z_impersonate_user_id');
      const impEmail = localStorage.getItem('z_impersonate_user_email');
      setImpersonatedUserId(impId);
      setImpersonatedEmail(impEmail);

      if (!impId) {
        setIsCurrentUserAdmin(false);
        return;
      }

      // We have an impersonation active. Check if current logged-in user is admin/owner
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsCurrentUserAdmin(false);
        return;
      }

      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .in('role', ['admin', 'owner']);

      setIsCurrentUserAdmin(!!(roles && roles.length > 0));
    };

    checkUserRoleAndImpersonation();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkUserRoleAndImpersonation();
    });

    const handleStorage = () => {
      checkUserRoleAndImpersonation();
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleStopImpersonation = () => {
    localStorage.removeItem('z_impersonate_user_id');
    localStorage.removeItem('z_impersonate_user_email');
    localStorage.removeItem('z_impersonate_profile');
    window.location.reload();
  };

  const isAdminSubdomain = window.location.hostname.startsWith("admin.");
  const isAdminRoute = location.pathname.startsWith("/admin");

  if (isAdminSubdomain) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.08),transparent_32%),radial-gradient(circle_at_top_right,hsl(var(--curve-accent)/0.08),transparent_24%)]" />
        </div>
        <FloatingThemeToggle />
        <div className="flex-1 animate-fade-in">
          <Routes>
            <Route path="/" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {isCurrentUserAdmin && impersonatedUserId && (
        <div className="sticky top-0 z-[100] flex items-center justify-between bg-amber-500 px-6 py-2.5 text-white shadow-md select-none dark:bg-amber-600">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="animate-pulse inline-block h-2.5 w-2.5 rounded-full bg-red-500 border border-white" />
            <span>Impersonating Student: {impersonatedEmail || impersonatedUserId}</span>
          </div>
          <button
            onClick={handleStopImpersonation}
            className="rounded bg-white/20 px-3 py-1 text-xs font-bold uppercase transition hover:bg-white/30 active:scale-95"
          >
            Stop Impersonating
          </button>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <DecorativeCurves curves={curves} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.06),transparent_34%),radial-gradient(circle_at_top_right,hsl(var(--curve-accent)/0.08),transparent_26%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.04),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.08),transparent_32%),radial-gradient(circle_at_top_right,hsl(var(--curve-accent)/0.08),transparent_24%),radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.05),transparent_30%)]" />
      </div>
      <AdSenseLoader />
      <ScrollToTopOnNavigation />
      {!isAdminRoute && <SupportChatbot />}
      {!isAdminRoute && <FloatingThemeToggle />}
      <SpeedInsights />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={isAdminSubdomain ? <Admin /> : <Index />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
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
          <Route path="/auth" element={<Auth />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/about" element={<About />} />
          <Route path="/platform" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/r/:slug" element={<SharedResult />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );

};

const App = () => (
  <ThemeProvider defaultTheme="system" storageKey="zertainity-ui-theme">
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SupportChatProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter basename={routerBasename} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <CurvesProvider>
                <AppShell />
              </CurvesProvider>
            </BrowserRouter>
          </TooltipProvider>
        </SupportChatProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ThemeProvider>
);

export default App;
