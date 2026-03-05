import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { GraduationCap, Target, Brain, TrendingUp, Sparkles, Settings, ChevronRight, User, Mail, MessageCircle, CalendarDays, Scale, School, BookOpen, Trophy, Zap } from "lucide-react";
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
    { icon: Target, title: "Interest Assessment", description: "Discover your true passions across various subjects and domains", color: "from-blue-500 to-cyan-400", glow: "group-hover:shadow-blue-500/25" },
    { icon: Brain, title: "AI-Powered Analysis", description: "Get personalized recommendations based on advanced AI algorithms", color: "from-purple-500 to-pink-400", glow: "group-hover:shadow-purple-500/25" },
    { icon: TrendingUp, title: "Career Pathways", description: "Explore detailed roadmaps from school to your dream career", color: "from-emerald-500 to-teal-400", glow: "group-hover:shadow-emerald-500/25" },
    { icon: Sparkles, title: "Smart Recommendations", description: "Find the best colleges and professions matching your profile", color: "from-amber-500 to-orange-400", glow: "group-hover:shadow-amber-500/25" },
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
    "Comprehensive subject interest analysis",
    "Academic performance evaluation",
    "AI-driven career matching",
    "College recommendations tailored to you",
    "Detailed career progression roadmaps",
    "From school to job guidance",
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
      <section className="relative overflow-hidden gradient-hero animate-gradient min-h-[560px] flex items-center">
        {/* Animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[hsl(190_80%_40%/0.18)] blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(210_70%_50%/0.12)] blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[hsl(185_60%_45%/0.09)] blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          {/* Floating orbs */}
          <div className="absolute top-1/4 right-1/4 w-4 h-4 rounded-full bg-cyan-300/40 blur-sm animate-bounce" style={{ animationDelay: "0.5s" }} />
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 rounded-full bg-blue-300/40 blur-sm animate-bounce" style={{ animationDelay: "1.2s" }} />
        </div>

        <div className="container mx-auto px-6 py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/90 text-xs font-semibold tracking-widest uppercase animate-float-up">
              <Zap className="h-3 w-3 text-cyan-300" />
              AI-Powered Career Guidance
            </div>

            {/* Headline with shimmer gradient */}
            <h1 className="animate-float-up-delay-1 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-white">
              Discover Your
              <span className="block mt-2 bg-gradient-to-r from-cyan-300 via-blue-200 to-teal-300 bg-clip-text text-transparent drop-shadow-lg">
                Perfect Career Path
              </span>
            </h1>

            <p className="animate-float-up-delay-2 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
              Personalized recommendations and detailed pathways —{" "}
              <span className="text-cyan-200 font-medium">from school to your dream career</span>
            </p>

            {/* CTA Buttons */}
            <div className="animate-float-up-delay-3 flex gap-4 pt-2 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate("/education-level")}
                className="text-base px-8 h-13 rounded-full font-semibold bg-white text-blue-900 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 group"
              >
                Start Your Journey
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/careers")}
                className="text-base px-8 h-13 rounded-full font-semibold border-white/25 text-white hover:bg-white/15 bg-transparent hover:scale-105 transition-all duration-200 backdrop-blur-sm"
              >
                Explore Careers
              </Button>
            </div>

            {/* Stats row */}
            <div className="animate-float-up-delay-3 flex flex-wrap items-center justify-center gap-8 pt-4 opacity-80">
              {[["200+", "Colleges"], ["120+", "Schools"], ["50+", "Careers"], ["100%", "Free"]].map(([num, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-white">{num}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wide">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tools Strip (Glassmorphism) ── */}
      <section className="relative py-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2Nmgtdi02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-7">
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <span className="bg-gradient-to-r from-yellow-200 to-amber-300 bg-clip-text text-transparent">Explore Our Tools</span>
            </h2>
            <p className="text-white/60 text-sm mt-1">Everything you need to plan your future in one place</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {tools.map(({ icon: Icon, label, path, color }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className="group flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm text-white text-sm font-semibold hover:bg-white/20 hover:border-white/30 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
              >
                <span className={`w-7 h-7 rounded-xl ${color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="h-3.5 w-3.5 text-white" />
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">The Process</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
              Our intelligent platform guides you through a comprehensive assessment to unlock your potential
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative p-6 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm cursor-default hover:-translate-y-2 hover:shadow-2xl ${feature.glow} transition-all duration-300 overflow-hidden`}
              >
                {/* Glow bg */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`} />
                {/* Step number */}
                <span className="absolute top-4 right-4 text-5xl font-black text-foreground/5 group-hover:text-foreground/8 transition-colors select-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose + CTA ── */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Why card */}
            <div className="lg:col-span-2 rounded-2xl border border-border/40 bg-card p-8 shadow-card hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Why Choose Zertainity?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {whyItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 group cursor-default">
                    <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-primary/20 transition-colors">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <span className="text-sm font-light leading-relaxed group-hover:text-foreground transition-colors">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl group cursor-pointer" onClick={() => navigate("/quiz")}>
              <div className="absolute inset-0 gradient-hero animate-gradient" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              {/* Shimmer overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" style={{ transition: "opacity 0.3s, transform 0.7s" }} />
              <div className="relative z-10 p-8 h-full flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-white text-xl font-bold mb-2">Ready to Begin?</h3>
                  <p className="text-white/70 text-sm font-light">Take the first step towards your future — it only takes 5 minutes</p>
                </div>
                <Button variant="secondary" size="lg" className="w-full rounded-full h-11 font-semibold mt-6 group-hover:scale-[1.02] transition-transform">
                  Take the Quiz
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
