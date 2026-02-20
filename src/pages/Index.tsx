import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Target, Brain, TrendingUp, Sparkles, Settings, ChevronRight, User, Mail, MessageCircle } from "lucide-react";
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
    { icon: Target, title: "Interest Assessment", description: "Discover your true passions across various subjects and domains" },
    { icon: Brain, title: "AI-Powered Analysis", description: "Get personalized recommendations based on advanced AI algorithms" },
    { icon: TrendingUp, title: "Career Pathways", description: "Explore detailed roadmaps from school to your dream career" },
    { icon: Sparkles, title: "Smart Recommendations", description: "Find the best colleges and professions matching your profile" },
  ];

  return (
    <div className="min-h-screen bg-background" role="main">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
                Zertainity
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={() => navigate("/settings")} className="rounded-full px-5 font-medium">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="rounded-full px-5 font-medium">
                  Sign In
                </Button>
              )}
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} aria-label="Settings" className="text-muted-foreground hover:text-foreground hover:bg-muted/50">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero with animated ocean gradient */}
      <section className="relative overflow-hidden gradient-hero animate-gradient min-h-[520px] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[hsl(190_80%_40%/0.12)] blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[hsl(210_70%_50%/0.08)] blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-[hsl(185_60%_45%/0.06)] blur-3xl" />
        </div>

        <div className="container mx-auto px-6 py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Text overlay */}
            <p className="animate-float-up text-sm font-medium tracking-widest uppercase text-[hsl(185_60%_70%)]">
              AI-Powered Career Guidance
            </p>
            <h2 className="animate-float-up-delay-1 text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
              Discover Your
              <span className="block mt-2 bg-gradient-to-r from-[hsl(185_80%_65%)] to-[hsl(200_80%_75%)] bg-clip-text text-transparent">
                Perfect Career Path
              </span>
            </h2>
            <p className="animate-float-up-delay-2 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light">
              Personalized recommendations and detailed pathways from school to your dream career
            </p>
            <div className="animate-float-up-delay-3 flex gap-4 pt-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate("/education-level")}
                className="text-base px-8 h-12 rounded-full font-medium bg-[hsl(190_70%_45%)] hover:bg-[hsl(190_70%_38%)] text-white shadow-lg"
              >
                Start Your Journey
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/careers")}
                className="text-base px-8 h-12 rounded-full font-medium border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                Explore Careers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-semibold tracking-tight mb-4 text-foreground">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
              Our intelligent platform guides you through a comprehensive assessment to unlock your potential
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-premium transition-smooth border border-border/40 bg-card/50 backdrop-blur-sm">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-base font-light leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section >

      {/* Why Choose + CTA */}
      < section className="py-24" >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-card lg:col-span-2 border border-border/40">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">Why Choose Zertainity?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Comprehensive subject interest analysis",
                    "Academic performance evaluation",
                    "AI-driven career matching",
                    "College recommendations tailored to you",
                    "Detailed career progression roadmaps",
                    "From school to job guidance",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2" />
                      <span className="text-sm font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card gradient-hero animate-gradient border-0">
              <CardHeader>
                <CardTitle className="text-white">Ready to Begin?</CardTitle>
                <CardDescription className="text-white/70 font-light">
                  Take the first step towards your future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/quiz")}
                  className="w-full rounded-full h-12 font-medium"
                >
                  Take the Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section >
      {/* Support Section */}
      < section className="py-24 bg-muted/20" >
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-4xl font-semibold tracking-tight text-foreground">Need Help?</h3>
            <p className="text-muted-foreground text-lg font-light max-w-xl mx-auto">
              Have questions about your career path, our platform, or need personalized guidance? We're here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:zertainity@gmail.com"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 border border-border bg-card text-foreground hover:bg-muted/30 transition-smooth font-medium text-sm"
              >
                <Mail className="h-4 w-4" />
                zertainity@gmail.com
              </a>
              <Button
                variant="default"
                size="lg"
                className="rounded-full px-6 font-medium"
                onClick={() => {
                  const chatBtn = document.querySelector('[aria-label="Open support chat"]') as HTMLButtonElement;
                  if (chatBtn) chatBtn.click();
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat with AI Assistant
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              For problems and suggestions, email us at <a href="mailto:zertainity@gmail.com" className="text-primary underline">zertainity@gmail.com</a>
            </p>
          </div>
        </div>
      </section >
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm font-light">© 2026 Zertainity. Empowering students to find their path.</p>
          <p className="text-sm text-muted-foreground mt-2">Created by Viney Ragesh & Johan Manoj</p>
        </div>
      </footer>
      <SupportChatbot />
    </div >
  );
};

export default Index;
