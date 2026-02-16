import { Target, Brain, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Target,
    title: "Interest Assessment",
    description: "Discover your true passions across various subjects and domains",
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Get personalized recommendations based on advanced AI algorithms",
  },
  {
    icon: TrendingUp,
    title: "Career Pathways",
    description: "Explore detailed roadmaps from school to your dream career",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description: "Find the best colleges and professions matching your profile",
  },
];

const FeaturesSection = () => {
  return (
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
            <Card
              key={index}
              className="shadow-card hover:shadow-premium transition-smooth border border-border/40 bg-card/50 backdrop-blur-sm group hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-smooth">
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
  );
};

export default FeaturesSection;
