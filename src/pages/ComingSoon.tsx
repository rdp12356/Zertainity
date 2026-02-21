import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, GraduationCap, Target, Brain, TrendingUp, Sparkles, ChevronRight, Calendar, Users, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const features = [
    { icon: Target, title: "Interest Assessment", description: "Discover your true passions across various subjects and domains" },
    { icon: Brain, title: "AI-Powered Analysis", description: "Get personalized recommendations based on advanced AI algorithms" },
    { icon: TrendingUp, title: "Career Pathways", description: "Explore detailed roadmaps from school to your dream career" },
    { icon: Sparkles, title: "Smart Recommendations", description: "Find the best colleges and professions matching your profile" },
  ];

  const { theme } = useTheme();

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30); // 30 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };


  return (
    <div className="min-h-screen bg-background" role="main">
      {/* Header */}
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
              <Button variant="outline" size="sm" className="rounded-full px-5 font-medium">
                Sign In
              </Button>
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

        <div className="container mx-auto px-6 py-28 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Text overlay */}
            <p className="animate-float-up text-sm font-medium tracking-widest uppercase text-[hsl(185_60%_70%)]">
              Coming Soon
            </p>
            <h2 className="animate-float-up-delay-1 text-5xl md:text-6xl font-semibold leading-[1.1] tracking-tight text-white">
              The Future of
              <span className="block mt-2 bg-gradient-to-r from-[hsl(185_80%_65%)] to-[hsl(200_80%_75%)] bg-clip-text text-transparent">
                Career Guidance
              </span>
            </h2>
            <p className="animate-float-up-delay-2 text-lg md:text-xl text-white/70 max-w-2xl mx-auto font-light">
              We're building something amazing. Get ready to discover your perfect career path with AI-powered guidance.
            </p>
            
            {/* Countdown Timer */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-8"
            >
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Minutes" },
                { value: timeLeft.seconds, label: "Seconds" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20"
                >
                  <motion.div
                    key={item.value}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl md:text-4xl font-bold text-white"
                  >
                    {item.value}
                  </motion.div>
                  <div className="text-sm mt-1 text-white/70">
                    {item.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Email Subscription */}
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              onSubmit={handleSubscribe}
              className="w-full max-w-md mx-auto"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-4 py-3 rounded-full bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-md focus:ring-2 focus:ring-white/30 transition-all duration-300"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 h-12 rounded-full font-medium bg-[hsl(190_70%_45%)] hover:bg-[hsl(190_70%_38%)] text-white shadow-lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Notify Me
                </Button>
              </div>
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-white/80 text-center"
                >
                  🎉 Thanks for subscribing!
                </motion.p>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-semibold tracking-tight mb-4 text-foreground">What's Coming</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-light">
              Get ready for powerful features that will transform your career discovery journey
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -4 }}
              >
                <Card className="shadow-card hover:shadow-premium transition-smooth border border-border/40 bg-card/50 backdrop-blur-sm h-full">
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-4xl font-semibold tracking-tight text-foreground">Have Questions?</h3>
            <p className="text-muted-foreground text-lg font-light max-w-xl mx-auto">
              Want to know more about our upcoming launch? We'd love to hear from you.
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
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-12">
        <div className="container mx-auto px-6 text-center text-muted-foreground">
          <p className="text-sm font-light">© 2026 Zertainity. Empowering students to find their path.</p>
          <p className="text-sm text-muted-foreground mt-2">Created by Viney Ragesh & Johan Manoj</p>
        </div>
      </footer>
    </div>
  );
};

export default ComingSoon;
