import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Target, Brain, TrendingUp, Sparkles, ChevronRight, User, CheckCircle2, Star, Quote } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SEO } from "@/components/SEO";
import { AdUnit } from "@/components/AdUnit";
import { useSupportChat } from "@/contexts/SupportChatContext";

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

  const flowSteps = [
    { number: "01", icon: Target, title: "Assess Interests", description: "Take our comprehensive subject interest and aptitude evaluation." },
    { number: "02", icon: Brain, title: "AI Analysis", description: "Our advanced algorithm maps your profile to ideal career domains." },
    { number: "03", icon: Sparkles, title: "Smart Matches", description: "Discover personalized college and profession recommendations." },
    { number: "04", icon: TrendingUp, title: "Career Roadmap", description: "Follow detailed pathways from your current grade to your dream job." },
  ];

  const testimonials = [
    { name: "Rahul S.", stream: "Engineering Aspirant", quote: "Zertainity completely cleared my confusion between engineering branches. The AI roadmap gave me a precise timeline for JEE preparation." },
    { name: "Priya M.", stream: "Commerce Student", quote: "I didn't know what to pursue after 12th commerce. The assessment highlighted my aptitude for data analytics, which I had never considered!" },
    { name: "Aditya V.", stream: "Medical Aspirant", quote: "The detailed breakdown of alternate career paths in biology (besides MBBS) was an eye-opener. Highly recommended for every 10th grader." },
  ];

  const benefits = [
    "Comprehensive subject interest analysis",
    "Academic performance evaluation",
    "AI-driven career matching",
    "Targeted college recommendations",
    "Detailed career progression roadmaps",
    "From school to job guidance",
  ];

  return (
    <div className="min-h-screen bg-background" role="main">
      <SEO 
        title="India's Best AI Career Guidance Platform" 
        description="Discover your perfect career path with India's most advanced AI career aptitude test. Tailored for Class 10, 12, and college students."
        canonical="/"
      />
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <GraduationCap className="h-7 w-7 text-primary" />
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
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center border-b border-border/40 bg-muted/10 pt-24 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-2">
              <Sparkles className="h-4 w-4 mr-2" />
              India's Most Advanced Career AI
            </div>
            <h2 className="text-5xl md:text-7xl font-semibold leading-[1.1] tracking-tight text-foreground">
              Discover Your
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-hero">
                Perfect Career Path
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
              Personalized recommendations and detailed pathways from school to your dream career, tailored specifically for Indian students.
            </p>
            
            <div className="flex gap-4 pt-6 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => navigate("/education-level")}
                className="text-base px-10 h-14 rounded-full font-medium shadow-premium hover:scale-105 transition-transform"
              >
                Start Your Journey
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/careers")}
                className="text-base px-8 h-14 rounded-full font-medium bg-background hover:bg-muted/50 transition-colors"
              >
                Explore Careers
              </Button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16 border-t border-border/40 mt-16 text-center">
              <div>
                <p className="text-3xl font-semibold text-foreground">10,000+</p>
                <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Students Guided</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-foreground">50+</p>
                <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Career Paths</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-foreground">98%</p>
                <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Satisfaction</p>
              </div>
              <div>
                <p className="text-3xl font-semibold text-foreground">12+</p>
                <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">Major Exams</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Flow Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h3 className="text-4xl font-semibold tracking-tight mb-4 text-foreground">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
              Our intelligent platform guides you through a comprehensive assessment to unlock your true potential.
            </p>
          </div>
          
          <div className="relative">
            {/* Desktop connecting line */}
            <div className="hidden lg:block absolute top-[45px] left-[10%] right-[10%] h-[2px] bg-border/60 z-0" />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
              {flowSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-full bg-card border-4 border-background flex items-center justify-center shadow-md mb-6 relative transition-transform group-hover:scale-110">
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-sm">
                      {step.number}
                    </div>
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                  <p className="text-muted-foreground font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Primary Landing Page Ad */}
      <div className="container mx-auto px-6 mb-12">
        <AdUnit slot="1111111111" />
      </div>

      {/* Why Choose Zertainity */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div className="space-y-8">
              <h3 className="text-4xl font-semibold tracking-tight text-foreground">
                Why Choose Zertainity?
              </h3>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                We combine psychological aptitude testing with advanced AI matching to ensure you don't just find a job, but discover a fulfilling career.
              </p>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 pt-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-hero flex items-center justify-center p-8">
               <div className="text-center space-y-6 relative z-10">
                 <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-md mb-4">
                   <Target className="w-12 h-12 text-white" />
                 </div>
                 <h4 className="text-3xl font-semibold text-white">Data-Driven Clarity</h4>
                 <p className="text-white/80 font-light text-lg max-w-md">Eliminate the guesswork from your career planning with precise, actionable insights.</p>
               </div>
               {/* Decorative background elements */}
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-semibold tracking-tight mb-4 text-foreground">Hear From Our Students</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
              Join thousands of students who have found their true calling.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="bg-card border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                   <div className="flex items-center gap-1 mb-4">
                     {[1,2,3,4,5].map((star) => <Star key={star} className="w-4 h-4 fill-primary text-primary" />)}
                   </div>
                   <Quote className="w-8 h-8 text-primary/20 mb-2" />
                   <CardDescription className="text-base text-foreground font-light leading-relaxed italic">
                     "{testimonial.quote}"
                   </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                  <div className="flex items-center gap-4 mt-6">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.stream}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto bg-primary rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary mix-blend-multiply" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
            
            <div className="relative z-10 px-6 py-20 md:py-24 text-center">
              <h3 className="text-4xl md:text-5xl font-semibold text-primary-foreground mb-6 tracking-tight">
                Ready to Map Your Future?
              </h3>
              <p className="text-primary-foreground/80 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">
                Take the first step towards a confident and fulfilling career. The assessment takes just 10 minutes.
              </p>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate("/quiz")}
                className="rounded-full h-14 px-10 font-semibold text-primary hover:scale-105 transition-transform bg-white hover:bg-gray-50"
              >
                Take the Free Assessment
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
