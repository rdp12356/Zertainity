import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Target, Brain, TrendingUp, Sparkles, Settings, ChevronRight, User, MousePointerClick } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, useScroll, useTransform } from "framer-motion";
import { SEO } from "@/components/SEO";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

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
    { icon: Target, title: "Interest Assessment", description: "Discover your true passions across various subjects and domains with our adaptive quiz." },
    { icon: Brain, title: "AI-Powered Analysis", description: "Get personalized recommendations based on advanced AI algorithms that understand your unique profile." },
    { icon: TrendingUp, title: "Career Pathways", description: "Explore detailed roadmaps from school to your dream career, including college & course suggestions." },
    { icon: Sparkles, title: "Smart Recommendations", description: "Find the best colleges and professions matching your profile with real-time data." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden" role="main">
      <SEO
        title="Home"
        description="Discover your perfect career path with AI-powered guidance. Take our assessment and get personalized recommendations for colleges and careers."
        keywords={["career guidance", "AI career counselor", "college finder", "student career path"]}
      />

      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl transition-all duration-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
                <GraduationCap className="h-8 w-8 text-primary relative z-10" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Zertainity
              </h1>
            </motion.div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={() => navigate("/setup")} className="rounded-full px-5 font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate("/auth")} className="rounded-full px-5 font-medium hover:bg-primary/10 hover:text-primary transition-colors">
                  Sign In
                </Button>
              )}
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero with animated background */}
      <section className="relative overflow-hidden min-h-[600px] flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
          <motion.div
            style={{ y: y1 }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/10 blur-[100px]"
          />
          <motion.div
            style={{ y: y2 }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]"
          />
        </div>

        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 border border-primary/20">
                AI-Powered Career Guidance
              </span>
              <h2 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                Discover Your
                <span className="block mt-2 bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x">
                  Perfect Career Path
                </span>
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
            >
              Navigating your future doesn't have to be confusing. Get personalized recommendations, detailed roadmaps, and college suggestions powered by advanced AI.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-8 justify-center items-center"
            >
              <Button
                size="lg"
                onClick={() => navigate("/education-level")}
                className="text-lg px-8 h-14 rounded-full font-semibold shadow-lg hover:shadow-primary/25 hover:scale-105 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                Start Your Journey
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/careers")}
                className="text-lg px-8 h-14 rounded-full font-medium border-2 hover:bg-secondary/50 hover:border-primary/50 transition-all duration-300"
              >
                Explore Careers
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-secondary/20 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl font-bold tracking-tight mb-4">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our intelligent platform guides you through a comprehensive assessment to unlock your potential using state-of-the-art technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="h-full"
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors duration-300 hover:shadow-xl hover:shadow-primary/5 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <CardHeader className="space-y-4 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600 opacity-90" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay" />

            <div className="relative z-10 px-6 py-20 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Shape Your Future?</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light">
                Join thousands of students who have found their perfect career path with Zertainity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/quiz")}
                  className="text-lg px-10 h-14 rounded-full font-bold shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <MousePointerClick className="mr-2 h-5 w-5" />
                  Take the Free Quiz
                </Button>
              </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-md py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6 opacity-80">
            <GraduationCap className="h-6 w-6" />
            <span className="text-lg font-bold">Zertainity</span>
          </div>
          <p className="text-sm text-muted-foreground font-light mb-4">
            &copy; 2026 Zertainity. Empowering the next generation of leaders.
          </p>
          <div className="text-xs text-muted-foreground/60">
            Created by Viney Ragesh & Johan Manoj
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
