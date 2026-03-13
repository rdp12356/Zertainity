import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Brain, 
  TrendingUp, 
  Sparkles, 
  Settings, 
  User, 
  Mail, 
  MessageCircle, 
  CalendarDays, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  ArrowUpRight 
} from "lucide-react";
import { SupportChatbot } from "@/components/SupportChatbot";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const features = [
    { icon: Target, title: "Precision Assessment", description: "Answer 8 calibrated questions. No trick phrasing, no industry jargon." },
    { icon: Brain, title: "Algorithmic Synthesis", description: "Your preferences are cross-referenced with real-world sector data." },
    { icon: TrendingUp, title: "Strategic Roadmaps", description: "Visual timelines detailing the exact courses and examinations required." },
    { icon: Sparkles, title: "Market Insights", description: "Authoritative data on emerging trends and career longevity." },
  ];

  const tools = [
    { icon: BookOpen, label: "Scholarships", path: "/scholarships" },
    { icon: CalendarDays, label: "Exam tracker", path: "/exam-tracker" },
    { icon: Zap, label: "Exam finder", path: "/exam-finder" },
  ];

  const whyItems = [
    "Takes just 8 minutes",
    "No account needed",
    "Real, verifiable data",
    "Coverage of all fields",
    "Tailored to Indian standards",
    "Always un-paywalled",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground" role="main">
      <PageSEO
        title="Zertainity — Refined Career Guidance"
        description="Discover your true passions and explore detailed career roadmaps. Zertainity helps you find the right path for your future."
        keywords="career guidance, career advice, career quiz, student career planning, career assessment, career roadmap"
        canonical="/"
      />

      {/* ── Header ── */}
      <header className="border-b border-border bg-background sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer focus-ring outline-none rounded-sm" 
              tabIndex={0} 
              onClick={() => navigate("/")} 
              onKeyDown={(e) => e.key === 'Enter' && navigate("/")}
              aria-label="Home"
            >
              {/* Desaturate logo to fit editorial style */}
              <Logo className="h-8 w-auto grayscale contrast-125 hover:grayscale-0 transition-all duration-500" />
            </div>
            
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate("/dashboard")} 
                  className="rounded-none px-6 font-medium border-foreground hover:bg-foreground hover:text-background transition-colors focus-ring"
                >
                  <User className="h-4 w-4 mr-2" aria-hidden="true" />
                  Account
                </Button>
              ) : (
                <Button 
                  size="sm" 
                  onClick={() => navigate("/auth")} 
                  className="rounded-none px-6 font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors focus-ring"
                >
                  Sign In
                </Button>
              )}
              <ThemeToggle />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate("/profile")} 
                aria-label="Settings" 
                className="text-muted-foreground hover:text-foreground focus-ring rounded-none"
              >
                <Settings className="h-5 w-5" aria-hidden="true" />
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Hero section (Editorial grid) ── */}
      <section className="relative min-h-[75vh] flex items-center border-b border-border">
        {/* Subtle noise texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          aria-hidden="true"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")', backgroundRepeat: 'repeat' }} 
        />
        
        <div className="container mx-auto px-6 py-20 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-10">
            {/* Tagline */}
            <div className="inline-flex items-center relative before:absolute before:-left-16 before:top-1/2 before:-translate-y-1/2 before:w-12 before:h-[1px] before:bg-accent ml-16" aria-hidden="true">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-accent">
                For Indian Students
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tighter text-foreground font-heading">
              Find the right <br />
              <span className="italic font-light text-muted-foreground mr-4">path </span>
              for your future.
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl font-medium leading-relaxed" style={{ textWrap: 'balance' }}>
              Unsure of what to pursue after 10th or 12th? Leverage data to make authoritative decisions about your education and career.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 pt-4 flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate("/education-level")}
                className="text-base px-8 h-14 rounded-none font-semibold bg-foreground text-background hover:bg-accent hover:text-accent-foreground transition-all duration-300 focus-ring group shadow-none"
              >
                Commence Assessment
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/careers")}
                className="text-base px-8 h-14 rounded-none font-semibold border-border bg-transparent text-foreground hover:border-foreground transition-all duration-300 focus-ring group shadow-none"
              >
                Browse Careers
                <ArrowUpRight className="ml-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5 hidden lg:flex justify-end">
            {/* Geometric Artpiece */}
            <div className="relative w-full max-w-[420px] aspect-[4/5] bg-secondary border border-border flex items-center justify-center overflow-hidden" aria-hidden="true">
               <div className="absolute inset-0 bg-border/30" style={{ backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
               <div className="absolute w-64 h-64 border-l border-b border-foreground/20 -rotate-12 translate-x-12 translate-y-12" />
               <div className="absolute w-48 h-48 border-t border-r border-accent/40 rotate-45 -translate-x-8 -translate-y-8" />
               <div className="text-[12rem] font-heading italic text-foreground/5 pointer-events-none select-none -translate-x-6">
                 Z.
               </div>
               
               <div className="absolute bottom-6 right-6 text-xs font-mono text-muted-foreground uppercase tracking-widest bg-background/80 px-2 py-1 backdrop-blur-sm border border-border/50">
                 Fig. 1 — Clarity
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools Menu / Ticker ── */}
      <section className="border-b border-border bg-secondary/50 py-6">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-foreground flex items-center gap-3">
              <span className="w-8 h-[1px] bg-foreground hidden md:inline-block" aria-hidden="true" />
              Directory
            </h2>
            <nav className="flex flex-wrap items-center gap-8 justify-center aria-label='Secondary tools'">
              {tools.map(({ icon: Icon, label, path }) => (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className="group flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors focus-ring outline-none"
                >
                  <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors" aria-hidden="true" />
                  <span className="group-hover:underline underline-offset-4 decoration-accent/30">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* ── Process section ── */}
      <section className="py-24 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-bold tracking-[0.2em] uppercase text-accent mb-4">Methodology</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight font-heading">
                Structured <br /> 
                <span className="italic font-light text-muted-foreground">inquiry.</span>
              </h2>
            </div>
            <p className="text-muted-foreground text-sm font-medium max-w-sm" style={{ textWrap: 'balance' }}>
              We abandoned convoluted forms in favor of conversational, evidence-based matching.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-background flex flex-col h-full min-h-[280px]"
              >
                 <div className="flex justify-between items-start mb-8">
                   <feature.icon className="h-6 w-6 text-foreground group-hover:text-accent transition-colors duration-300" aria-hidden="true" />
                   <span className="text-sm font-mono text-muted-foreground/50">0{index + 1}</span>
                 </div>
                 <div className="mt-auto">
                   <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
                   <p className="text-sm text-muted-foreground font-medium leading-relaxed">{feature.description}</p>
                 </div>
                 
                 {/* Hover line indicator */}
                 <div className="absolute bottom-0 left-0 h-[2px] bg-accent w-0 group-hover:w-full transition-all duration-500 ease-out" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Value proposition / CTA ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-stretch">
            {/* Why list */}
            <div className="lg:col-span-7 border border-border bg-background p-10 md:p-14">
              <h2 className="text-3xl lg:text-4xl font-black mb-10 font-heading">
                Built on transparency.
              </h2>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
                {whyItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="text-accent mt-0.5" aria-hidden="true">—</span>
                    <span className="text-sm font-medium leading-relaxed text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="lg:col-span-5 relative overflow-hidden group border border-border">
              <div className="absolute inset-0 bg-foreground transition-transform duration-700 ease-out" />
              <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[320px] text-background">
                <div>
                  <div className="w-10 h-10 border border-background/20 flex items-center justify-center mb-6">
                    <Sparkles className="h-4 w-4 text-background" aria-hidden="true" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 font-heading">Ready to begin?</h3>
                  <p className="text-background/70 text-sm font-medium leading-relaxed">
                    The initial evaluation requires approximately eight minutes. Account creation is strictly optional.
                  </p>
                </div>
                <Button 
                  onClick={() => navigate("/education-level")}
                  className="w-full rounded-none h-14 font-semibold mt-8 bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus-ring outline-none"
                >
                  Initiate Evaluation
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Support & Footer ── */}
      <footer className="border-t border-border bg-secondary/30 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mb-20">
            <h2 className="text-2xl font-black mb-4 font-heading">Inquiries.</h2>
            <p className="text-muted-foreground text-sm font-medium mb-6" style={{ textWrap: 'balance' }}>
              Require clarification regarding your career trajectory? Our support intelligence is available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="rounded-none px-6 font-semibold bg-foreground text-background transition-transform focus-ring outline-none"
                onClick={() => {
                  const chatBtn = document.querySelector('[aria-label="Open support chat"]') as HTMLButtonElement;
                  if (chatBtn) chatBtn.click();
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" aria-hidden="true" />
                Engage Assistant
              </Button>
              <a
                href="mailto:zertainity@gmail.com"
                className="inline-flex items-center justify-center gap-2 rounded-none px-6 py-3 border border-border bg-background text-foreground hover:bg-secondary hover:text-accent transition-colors font-medium text-sm focus-ring outline-none"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                zertainity@gmail.com
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/50 text-xs font-mono text-muted-foreground">
            <p>
              © 2026 <span className="font-semibold text-foreground">Zertainity.</span> All rights reserved.
            </p>
            <p className="opacity-60">Architected by V. Ragesh & J. Manoj</p>
          </div>
        </div>
      </footer>
      <SupportChatbot />
    </div>
  );
};

export default Index;
