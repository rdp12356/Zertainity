import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-pathway.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden min-h-[600px] flex items-center">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Students discovering their career pathway"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-6xl font-semibold leading-[1.1] tracking-tight text-foreground animate-fade-in-up">
            Discover Your
            <span className="block mt-2 animate-fade-in-up animation-delay-200">
              Perfect Career Path
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light animate-fade-in-up animation-delay-400">
            AI-powered platform to guide students from school to their dream career with personalized recommendations and detailed pathways
          </p>
          <div className="flex gap-4 pt-6 justify-center animate-fade-in-up animation-delay-600">
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
              className="text-base px-8 h-12 rounded-full font-medium border-border/60 hover:bg-muted/50 backdrop-blur-sm"
            >
              Explore Careers
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
