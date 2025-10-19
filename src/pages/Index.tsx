import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Target, Brain, TrendingUp, Sparkles, Settings } from "lucide-react";
import heroImage from "@/assets/hero-pathway.jpg";

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
      <header className="border-b border-border bg-card shadow-card sticky top-0 z-50 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Career Pathfinder
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold leading-tight">
                Discover Your
                <span className="block bg-gradient-hero bg-clip-text text-transparent">
                  Perfect Career Path
                </span>
              </h2>
              <p className="text-xl text-muted-foreground">
                AI-powered platform to guide students from school to their dream career with personalized recommendations and detailed pathways
              </p>
              <div className="flex gap-4 pt-4">
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => navigate("/education-level")}
                  className="text-lg px-8"
                >
                  Start Your Journey
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/careers")}
                >
                  Explore Careers
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary blur-3xl opacity-20 rounded-full" />
              <img
                src={heroImage}
                alt="Career pathways visualization"
                className="rounded-2xl shadow-glow relative z-10 w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our intelligent platform guides you through a comprehensive assessment to unlock your potential
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-glow transition-smooth border-2 border-transparent hover:border-primary/20">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="shadow-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-2xl">Why Choose Career Pathfinder?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Comprehensive subject interest analysis",
                    "Academic performance evaluation",
                    "AI-driven career matching",
                    "College recommendations tailored to you",
                    "Detailed career progression roadmaps",
                    "From school to job guidance"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-primary flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card bg-gradient-primary">
              <CardHeader>
                <CardTitle className="text-primary-foreground">Ready to Begin?</CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Take the first step towards your future
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate("/quiz")}
                  className="w-full"
                >
                  Take the Quiz
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Career Pathfinder. Empowering students to find their path.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
