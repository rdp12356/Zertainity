import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-card border border-border/40 h-full">
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
                    <motion.div
                      key={idx}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0 mt-2" />
                      <span className="text-sm font-light leading-relaxed">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card className="shadow-card bg-foreground border-0 h-full flex flex-col justify-center">
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
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
