import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Target, Brain, TrendingUp, Sparkles, Settings, ChevronRight, User, Mail, MessageCircle } from "lucide-react";
import { SupportChatbot } from "@/components/SupportChatbot";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SEO } from "@/components/SEO";

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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background" role="main">
      <SEO
        title="Home - Discover Your Perfect Career"
        description="Start your journey to the perfect career with Zertainity's AI-powered guidance and personalized recommendations."
      />
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate("/")}>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <GraduationCap className="h-7 w-7 text-primary" />
              </motion.div>
              <h1 className="text-[22px] font-bold tracking-tighter text-foreground bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text">
                Zertainity
              </h1>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/college-predictor")}
                className="hidden lg:flex rounded-full px-5 font-medium text-muted-foreground hover:text-foreground"
              >
                College Predictor
              </Button>
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={() => navigate("/settings")} className="rounded-full px-4 sm:px-5 font-medium h-9 sm:h-10 text-xs sm:text-sm">
                  <User className="h-4 w-4 mr-0 sm:mr-2" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="rounded-full px-6 sm:px-5 font-medium h-9 sm:h-10 text-sm">
                  Sign In
                </Button>
              )}
              <div className="flex items-center gap-1">
                <ThemeToggle />
              </div>
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

        <motion.div
          className="container mx-auto px-6 py-28 relative z-10"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Text overlay */}
            <motion.p
              variants={fadeInUp}
              className="text-sm font-medium tracking-widest uppercase text-[hsl(185_60%_70%)]"
            >
              AI-Powered Career Guidance
            </motion.p>
            <motion.h2
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-extrabold leading-[1] tracking-tighter text-white"
            >
              Discover Your
              <motion.span
                initial={{ backgroundPosition: "0% 50%" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="block mt-4 bg-gradient-to-r from-[hsl(185_80%_65%)] via-[hsl(200_80%_75%)] to-[hsl(185_80%_65%)] bg-[length:200%_auto] bg-clip-text text-transparent"
              >
                Perfect Career Path
              </motion.span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light"
            >
              Personalized recommendations and detailed pathways from school to your dream career
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 pt-6 justify-center items-center"
            >
              <Button
                size="lg"
                onClick={() => navigate("/education-level")}
                className="text-base px-8 h-12 w-full sm:w-auto rounded-full font-medium bg-[hsl(190_70%_45%)] hover:bg-[hsl(190_70%_38%)] text-white shadow-lg motion-safe:hover:scale-105 transition-all duration-300"
              >
                Start Your Journey
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/careers")}
                className="text-base px-8 h-12 w-full sm:w-auto rounded-full font-medium border-white/20 text-white hover:bg-white/10 bg-transparent motion-safe:hover:scale-105 transition-all duration-300"
              >
                Explore Careers
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 sm:py-32 bg-muted/20 scroll-mt-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h3
              variants={fadeInUp}
              className="text-4xl font-semibold tracking-tight mb-4 text-foreground"
            >
              How It Works
            </motion.h3>
            <motion.p
              variants={fadeInUp}
              className="text-muted-foreground max-w-2xl mx-auto text-lg font-light"
            >
              Our intelligent platform guides you through a comprehensive assessment to unlock your potential
            </motion.p>
          </motion.div>
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full shadow-card hover:shadow-premium transition-all duration-300 border border-border/40 bg-card/50 backdrop-blur-sm group hover:-translate-y-2">
                  <CardHeader className="space-y-4">
                    <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <feature.icon className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                    <CardDescription className="text-base font-light leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose + CTA */}
      <section id="why-choose" className="py-24 sm:py-32 scroll-mt-20">
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
      <section id="support" className="py-24 sm:py-32 bg-muted/20 scroll-mt-20">
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
