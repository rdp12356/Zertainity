import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { educationLevel, class9Marks, class10Marks, class11Subjects, class12Subjects, interests } = location.state || {};
  const savedRef = useRef(false);
  const [isFinishing, setIsFinishing] = useState(false);

  // Architecture Scaffold: In a real app, this would call an Edge Function
  const fetchAIResults = async () => {
    // This is where the AI API integration would happen
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Mock AI-generated strengths analysis
  const strengths = educationLevel === 'after-10th'
    ? "The student exhibits strong foundational skills across core subjects, with particularly notable performance in Mathematics and Science. Their expressed interests in technology and problem-solving align well with analytical and computational fields. The combination of academic performance and stated passions indicates a natural aptitude for systematic thinking and creative problem-solving."
    : "The student exhibits exceptional academic performance across all subjects, particularly in English, Mathematics, and Science, indicating strong analytical and problem-solving abilities. Their stated interest in technology and cybersecurity is well-supported by their responses, which highlight a preference for software design, algorithmic thinking, and a foundational understanding of logic gates. While showing a desire for structured learning and deep mastery, their inclination towards creative problem-solving and contributing to cutting-edge research suggests a strong alignment between their interests and aptitudes for STEM fields, especially those involving computing and engineering.";

  // Mock recommended career paths
  const recommendations = educationLevel === 'after-10th' ? [
    {
      stream: "Science (PCM with Computer Science)",
      category: "Core Technology & Engineering",
      match: 95,
      description: "This stream directly aligns with strong performance in Math and Science, coupled with interests in technology. It provides a robust foundation for pursuing higher education in computer science, software engineering, or related fields.",
      reasons: [
        "Strong performance in Mathematics and Science",
        "Stated interest in technology and problem-solving",
        "Excellent foundation for engineering and technical careers",
        "Opens doors to IITs, NITs, and top engineering colleges"
      ],
      careers: [
        "Software Engineer",
        "Data Scientist",
        "AI/ML Engineer",
        "Computer Hardware Engineer",
        "Research Scientist"
      ]
    },
    {
      stream: "Science (PCB with Mathematics)",
      category: "Medical & Life Sciences",
      match: 85,
      description: "Strong Science fundamentals combined with mathematical aptitude create excellent preparation for medical sciences and biological research careers.",
      reasons: [
        "Excellent Science performance with analytical skills",
        "Mathematical foundation supports advanced medical studies",
        "Opens pathways to MBBS, BDS, and healthcare careers",
        "Research opportunities in biotechnology and pharmacology"
      ],
      careers: [
        "Doctor (MBBS)",
        "Dentist",
        "Biotechnologist",
        "Pharmacologist",
        "Medical Researcher"
      ]
    },
    {
      stream: "Commerce with Mathematics",
      category: "Business & Finance",
      match: 75,
      description: "Mathematical aptitude can be leveraged in commerce stream for careers in finance, accounting, and business analytics.",
      reasons: [
        "Strong mathematical foundation supports quantitative analysis",
        "Opens doors to CA, CS, and business management",
        "Growing demand for financial analysts and business strategists",
        "Entrepreneurship opportunities"
      ],
      careers: [
        "Chartered Accountant",
        "Financial Analyst",
        "Business Analyst",
        "Investment Banker",
        "Management Consultant"
      ]
    }
  ] : [
    {
      stream: "Science (PCM with Computer Science)",
      category: "Core Technology & Engineering",
      match: 95,
      description: "This stream directly aligns with the student's strong academic performance in Math and Science, coupled with their explicit interest in technology and cybersecurity, particularly software design and algorithms. It provides a robust foundation for pursuing higher education in computer science, software engineering, or related fields, preparing them for roles involving innovation and research.",
      reasons: [
        "Exceptional performance in Mathematics and Science, crucial for this stream",
        "Stated interest in designing new software, developing algorithms, and coding solutions",
        "Preference for learning new programming languages and contributing to cutting-edge research",
        "Direct alignment with their preferred subject combination for 11th-12th grade: Physics, Chemistry, Mathematics, Computer Science"
      ],
      careers: [
        "Software Engineer",
        "Cybersecurity Analyst (with further specialization)",
        "Data Scientist",
        "AI/ML Engineer",
        "Computer Hardware Engineer"
      ]
    },
    {
      stream: "Science (PCM with Electronics)",
      category: "Hardware & Systems Engineering",
      match: 88,
      description: "Given the student's interest in 'logic gates and circuit design' and their strong aptitude in Physics and Mathematics, this stream offers an excellent pathway. It allows for a deeper dive into the foundational hardware aspects of technology, which are integral to both computing and cybersecurity infrastructure, while still leveraging their problem-solving skills.",
      reasons: [
        "Strong performance in Physics and Mathematics, essential for electronics",
        "Specific interest in 'logic gates and circuit design' indicates an aptitude for hardware",
        "Provides a complementary understanding to software, crucial for a holistic view of technology",
        "Offers a different avenue for contributing to cutting-edge advancements beyond pure software"
      ],
      careers: [
        "Electronics Engineer",
        "Embedded Systems Engineer",
        "VLSI Design Engineer",
        "Robotics Engineer",
        "Network Hardware Engineer"
      ]
    },
    {
      stream: "Science (PCMB / with Biotechnology)",
      category: "Interdisciplinary Technology & Research",
      match: 75,
      description: "While not directly stated, the student's high performance in Science and interest in 'cutting-edge research' could be channeled into interdisciplinary fields like Bioinformatics or Computational Biology. This stream combines strong analytical skills with biological knowledge, opening doors to advanced research roles where technology is applied to solve complex biological problems.",
      reasons: [
        "Excellent performance in Science, providing a strong foundation for biology",
        "Interest in 'cutting-edge research and advancements' could extend to interdisciplinary fields",
        "High academic aptitude suggests an ability to master diverse scientific concepts",
        "Offers a unique application of technology and algorithmic thinking in a different scientific domain"
      ],
      careers: [
        "Bioinformatician",
        "Computational Biologist",
        "Biomedical Engineer (with software/hardware focus)",
        "Biotechnology Researcher",
        "Pharmaceutical Data Scientist"
      ]
    }
  ];

  // Save to career history once per session for logged-in users
  useEffect(() => {
    if (!educationLevel || savedRef.current) return;
    savedRef.current = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) return;
      const top = recommendations[0];
      await supabase.from("career_history").insert({
        user_id: session.user.id,
        education_level: educationLevel,
        top_recommendation: top?.stream ?? null,
        top_match_percent: top?.match ?? null,
        all_recommendations: recommendations.map(r => ({ stream: r.stream, match: r.match, category: r.category })),
      });
    });
  }, [educationLevel]);

  if (!educationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-7 w-7 text-primary" />
                <h1 className="text-[22px] font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Analysis Results
                </h1>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-full"
            >
              <Sparkles className="h-3 w-3 text-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">AI Powered</span>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Personalized Career Path</h2>
          <p className="text-muted-foreground">
            Based on your academic performance and assessment responses, here are our recommendations
          </p>
        </div>

        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{strengths}</p>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold mb-6 tracking-tight">Recommended Career Paths</h3>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Card className="shadow-premium border-border/40 hover:border-primary/40 transition-all duration-300 group overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors">{rec.stream}</CardTitle>
                        <CardDescription className="text-base font-light">{rec.category}</CardDescription>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5 rounded-full font-bold">
                        {rec.match}% Match
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-muted-foreground leading-relaxed font-light">{rec.description}</p>

                    <div className="p-4 bg-muted/20 rounded-2xl border border-border/40">
                      <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Strategic Alignment
                      </h4>
                      <ul className="space-y-2">
                        {rec.reasons.map((reason, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-sm">Career Horizons</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.careers.map((career, idx) => (
                          <Badge key={idx} variant="secondary" className="rounded-full px-3 py-1 text-[11px] font-medium bg-secondary/50 text-secondary-foreground">
                            {career}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <Card className="shadow-card bg-gradient-primary text-center">
          <CardHeader>
            <CardTitle className="text-primary-foreground text-2xl">Ready to Start Your Journey?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Take the next step towards your future. Research these paths and talk to your teachers and counselors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
