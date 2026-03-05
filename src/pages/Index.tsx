import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { GraduationCap, Target, Brain, TrendingUp, Sparkles, Settings, ChevronRight, User, Mail, MessageCircle, CalendarDays, Scale, School, BookOpen, Trophy, Zap, ArrowRight } from "lucide-react";
import { SupportChatbot } from "@/components/SupportChatbot";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { HeroScene3D } from "@/components/HeroScene3D";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Scroll-reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('animate-fade-in')),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.scroll-reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: Target, title: "Answer 8 questions", description: "Tell us what subjects you enjoy. No trick questions, no jargon.", color: "from-blue-500 to-cyan-400", glow: "group-hover:shadow-blue-500/25" },
    { icon: Brain, title: "Smart Matching", description: "We cross-reference your interests with real career data — not generic suggestions.", color: "from-purple-500 to-pink-400", glow: "group-hover:shadow-purple-500/25" },
    { icon: TrendingUp, title: "Career Roadmaps", description: "See exactly what you'd study, which exams to clear, and where you could end up in 5 years.", color: "from-emerald-500 to-teal-400", glow: "group-hover:shadow-emerald-500/25" },
    { icon: Sparkles, title: "College Finder", description: "Search 200+ colleges with real cutoffs, fees, and rankings — no affiliate bias.", color: "from-amber-500 to-orange-400", glow: "group-hover:shadow-amber-500/25" },
  ];

  const tools = [
    { icon: BookOpen, label: "Find Scholarships", path: "/scholarships", color: "bg-gradient-to-br from-yellow-400 to-amber-500" },
    { icon: CalendarDays, label: "Exam Tracker", path: "/exam-tracker", color: "bg-gradient-to-br from-indigo-400 to-blue-600" },
    { icon: Scale, label: "Compare Colleges", path: "/college-compare", color: "bg-gradient-to-br from-emerald-400 to-teal-600" },
    { icon: TrendingUp, label: "Salary Trends", path: "/salary-trends", color: "bg-gradient-to-br from-pink-400 to-rose-600" },
    { icon: School, label: "School Finder", path: "/schools", color: "bg-gradient-to-br from-violet-400 to-purple-600" },
    { icon: GraduationCap, label: "College Finder", path: "/colleges", color: "bg-gradient-to-br from-cyan-400 to-sky-600" },
  ];

  const whyItems = [
    "Takes just 8 minutes to complete",
    "No account needed to try the quiz",
    "Real cutoffs and fees — not guesses",
    "Covers all major streams: Science, Commerce, Arts",
    "Built specifically for the Indian education system",
    "Completely free, no paywalls",
  ];

  return (
    <div className="min-h-screen bg-background" role="main">
      <PageSEO
        title="AI-Powered Career Guidance"
        description="Discover your true passions and explore detailed career roadmaps. Zertainity provides intelligent, AI-powered career matching for students."
        keywords="career guidance, AI career advice, college recommendations, career quiz, student career planning, career assessment, career roadmap, best colleges India"
        canonical="/"
      />

      {/* ── Header ── */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground cursor-pointer" onClick={() => navigate("/")}>
              <Logo className="h-10 w-auto px-1" />
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={() => navigate("/profile")} className="rounded-full px-5 font-medium hover:scale-105 transition-transform">
                  <User className="h-4 w-4 mr-2" />Account
                </Button>
              ) : (
                <Button size="sm" onClick={() => navigate("/auth")} className="rounded-full px-5 font-medium bg-gradient-to-r from-cyan-500 to-blue-600 border-0 hover:opacity-90 hover:scale-105 transition-all text-white">
                  Sign In
                </Button>
              )}
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => navigate("/profile")} aria-label="Settings" className="text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:rotate-45 transition-all duration-300">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden gradient-hero animate-gradient min-h-[580px] flex items-center noise-overlay">
        <HeroScene3D />
        {/* Morphing blob backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="blob absolute -top-32 -left-32 w-[480px] h-[480px] bg-[hsl(190_80%_40%/0.2)] blur-3xl" />
          <div className="blob-slow absolute -bottom-16 -right-16 w-[560px] h-[560px] bg-[hsl(210_70%_50%/0.15)] blur-3xl" />
          <div className="blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[320px] bg-[hsl(185_60%_45%/0.1)] blur-3xl" />
          {/* Floating particles */}
          <div className="particle absolute top-1/4 right-[15%] w-2.5 h-2.5 rounded-full bg-cyan-300/60" />
          <div className="particle-slow absolute top-[35%] right-[30%] w-1.5 h-1.5 rounded-full bg-blue-200/50" />
          <div className="particle-fast absolute bottom-[28%] left-[20%] w-2 h-2 rounded-full bg-teal-300/50" />
          <div className="particle absolute bottom-[40%] right-[20%] w-1 h-1 rounded-full bg-white/60" />
          <div className="particle-slow absolute top-[60%] left-[35%] w-1.5 h-1.5 rounded-full bg-cyan-200/40" />
          {/* Grid dot overlay */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="container mx-auto px-6 py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold tracking-widest uppercase animate-float-up animate-pop">
              <Zap className="h-3 w-3 text-cyan-300" />
              For Indian Students · Free, Always
            </div>

            {/* Headline with shimmer gradient */}
            <h1 className="animate-float-up-delay-1 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-cyan-50 drop-shadow-2xl">
              Discover Your
              <span className="block mt-2 text-shimmer filter drop-shadow-[0_0_15px_rgba(125,211,252,0.4)]">
                Perfect Career Path
              </span>
            </h1>

            <p className="animate-float-up-delay-2 text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed typewriter-cursor">
              Not sure what to do after 10th or 12th?{" "}
              <span className="text-cyan-300 font-bold">You're in the right place.</span>
            </p>

            {/* CTA Buttons */}
            <div className="animate-float-up-delay-3 flex gap-4 pt-2 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate("/education-level")}
                className="text-base px-8 h-13 rounded-full font-semibold bg-white text-blue-900 shadow-xl hover:shadow-2xl transition-all duration-300 group neon-glow ripple-container magnetic-button"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/careers")}
                className="text-base px-8 h-13 rounded-full font-semibold border-white/40 text-white hover:bg-white/10 bg-transparent transition-all duration-300 backdrop-blur-sm magnetic-button"
              >
                Explore Careers
              </Button>
            </div>

            {/* Stats row */}
            <div className="animate-float-up-delay-4 flex flex-wrap items-center justify-center gap-8 pt-4">
              {[["200+", "Colleges"], ["120+", "Schools"], ["40+", "Scholarships"], ["100%", "Free"]].map(([num, label]) => (
                <div key={label} className="text-center group cursor-default">
                  <p className="text-2xl font-black text-white group-hover:text-cyan-300 group-hover:scale-110 transition-all duration-300 drop-shadow-sm">{num}</p>
                  <p className="text-xs text-white/60 uppercase tracking-widest mt-0.5 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools Strip (Glassmorphism) ── */}
      <section className="relative py-12 overflow-hidden scroll-reveal opacity-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-indigo-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2Nmgtdi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-9">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400 group-hover:animate-bounce" />
              <span className="text-shimmer bg-gradient-to-r from-yellow-200 via-white to-amber-300">Explore Our Tools</span>
            </h2>
            <p className="text-white/50 text-xs mt-1 uppercase tracking-widest font-semibold">Everything you need in one place</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {tools.map(({ icon: Icon, label, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="group flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-white text-sm font-bold hover:bg-white/15 hover:border-cyan-500/30 hover:-translate-y-1 transition-all duration-300 shadow-2xl glass-panel-3d"
              >
                <span className={`w-8 h-8 rounded-xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                  <Icon className="h-4 w-4 text-white" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-muted/10 relative overflow-hidden section-reveal">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 scroll-reveal opacity-0">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-3">The Process</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 text-3d">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light leading-relaxed">
              We ditched the complex forms. Our platform learns about you through <span className="text-foreground font-semibold">conversational matching.</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto stagger-children">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`card-3d-wrapper scroll-reveal opacity-0`}
              >
                <div
                  className={`card-3d-light group relative p-8 rounded-3xl border border-border/40 bg-card/40 backdrop-blur-sm cursor-default overflow-hidden min-h-[220px] transition-all duration-500`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  <span className="absolute -bottom-4 -right-2 text-8xl font-black text-foreground/5 group-hover:text-primary/10 transition-all duration-700 select-none">
                    {index + 1}
                  </span>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors underline-offset-4 decoration-primary/30">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose + CTA ── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
            {/* Why card */}
            <div className="lg:col-span-2 rounded-[2rem] border border-border/40 bg-card/30 p-10 shadow-2xl glass-panel-3d scroll-reveal opacity-0">
              <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                Why students actually use this
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {whyItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 group cursor-default">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                      <Zap className="w-3 h-3 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-sm font-medium leading-relaxed text-muted-foreground group-hover:text-foreground transition-all duration-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl group cursor-pointer scroll-reveal opacity-0 card-3d magnetic-button" onClick={() => navigate("/education-level")}>
              <div className="absolute inset-0 gradient-hero animate-gradient" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="relative z-10 p-10 h-full flex flex-col justify-between min-h-[280px]">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-[15deg] transition-all duration-500">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white text-2xl font-black mb-3 text-3d-white tracking-tight">Give it a shot?</h3>
                  <p className="text-white/80 text-sm font-medium leading-relaxed">The quiz takes about 8 minutes. No account needed to start your career discovery.</p>
                </div>
                <Button variant="secondary" size="lg" className="w-full rounded-2xl h-14 font-bold mt-8 shadow-2xl group-hover:shadow-white/20 transition-all duration-500">
                  Start the Quiz
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Support ── */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto shadow-lg">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">Need Help?</h2>
            <p className="text-muted-foreground text-lg font-light max-w-xl mx-auto">
              Have questions about your career path? We're here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:zertainity@gmail.com"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 border border-border bg-card text-foreground hover:bg-muted/30 hover:border-primary/40 hover:scale-105 transition-all duration-200 font-medium text-sm shadow-sm"
              >
                <Mail className="h-4 w-4 text-primary" />
                zertainity@gmail.com
              </a>
              <Button
                size="lg"
                className="rounded-full px-6 font-semibold bg-gradient-to-r from-primary to-primary/80 hover:scale-105 transition-transform shadow-lg"
                onClick={() => {
                  const chatBtn = document.querySelector('[aria-label="Open support chat"]') as HTMLButtonElement;
                  if (chatBtn) chatBtn.click();
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 bg-background py-10">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm font-light">© 2026 <span className="text-foreground font-medium">Zertainity</span>. Empowering students to find their path.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Created by Viney Ragesh & Johan Manoj</p>
        </div>
      </footer>
      <SupportChatbot />
    </div>
  );
};

export default Index;
