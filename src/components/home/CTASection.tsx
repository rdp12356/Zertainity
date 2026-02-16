import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CTASection = () => {
  const navigate = useNavigate();

  return (
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
  );
};

export default CTASection;
