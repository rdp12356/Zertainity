import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Brain, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

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
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-semibold tracking-tight mb-4 text-foreground">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
            Our intelligent platform guides you through a comprehensive assessment to unlock your potential
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="shadow-card hover:shadow-premium transition-smooth border border-border/40 bg-card/50 backdrop-blur-sm h-full group">
                <CardHeader className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                    <feature.icon className="h-6 w-6 text-foreground" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-base font-light leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
