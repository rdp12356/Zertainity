import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Target, Brain, TrendingUp, Sparkles, Settings, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Interest Assessment",
      description: "Discover your true passions across various subjects and domains"
    },
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Get personalized recommendations based on advanced AI algorithms"
    },
    {
      icon: TrendingUp,
      title: "Career Pathways",
      description: "Explore detailed roadmaps from school to your dream career"
    },
    {
      icon: Sparkles,
      title: "Smart Recommendations",
      description: "Find the best colleges and professions matching your profile"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-foreground" />
              <h1 className="text-[22px] font-semibold tracking-tight text-foreground">
                Zertainity
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="rounded-full px-5 font-medium"
              >
                Sign In
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-6 py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-6xl font-semibold leading-[1.1] tracking-tight text-foreground">
              Discover Your
              <span className="block mt-2">Perfect Career Path</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
              AI-powered platform to guide students from school to their dream career with personalized recommendations and detailed pathways
            </p>
            <div className="flex gap-4 pt-6 justify-center">
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate("/education-level")}
                className="text-base px-8 h-12 rounded-full font-medium shadow-premium hover:shadow-glow"
              >
                Start Your Journey
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/careers")}
                className="text-base px-8 h-12 rounded-full font-medium border-border/60 hover:bg-muted/50"
              >
                Explore Careers
              </Button>
            </div>
          </div>
        </div>
      </section>

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
      </section>

      <section className="py-24">
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
                    "From school to job guidance"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2" />
                      <span className="text-sm font-light leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card bg-foreground border-0">
              <CardHeader>
                <CardTitle className="text-background">Ready to Begin?</CardTitle>
                <CardDescription className="text-background/70 font-light">
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
      </section>

      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm font-light">© 2025 Zertainity. Empowering students to find their path.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
