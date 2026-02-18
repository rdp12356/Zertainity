import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { educationLevel, class9Marks, class10Marks, class11Subjects, class12Subjects, interests } = location.state || {};

  if (!educationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  // Calculate results based on answers
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [topInterest, setTopInterest] = useState<string>("");

  useEffect(() => {
    if (location.state?.answers && location.state?.questions) {
      const qData = location.state.questions as any[];
      const userAnswers = location.state.answers as Record<string, number>;

      // Calculate average score per subject
      const subjectScores: Record<string, { total: number; count: number }> = {};

      Object.entries(userAnswers).forEach(([qIndex, score]) => {
        const q = qData[parseInt(qIndex)];
        if (q && typeof score === 'number') {
          if (!subjectScores[q.subject]) {
            subjectScores[q.subject] = { total: 0, count: 0 };
          }
          subjectScores[q.subject].total += score;
          subjectScores[q.subject].count += 1;
        }
      });

      // Find highest scoring subject
      let maxScore = -1;
      let bestSubject = "";

      Object.entries(subjectScores).forEach(([subject, data]) => {
        const avg = data.total / data.count;
        if (avg > maxScore) {
          maxScore = avg;
          bestSubject = subject;
        }
      });

      setTopInterest(bestSubject);

      // Generate recommendations based on best subject (Simulating DB logic)
      // in a real app, this would query 'career_paths' table
      const getRecs = (subject: string) => {
        switch (subject) {
          case "Mathematics":
          case "Technology":
            return [
              {
                stream: "Science (PCM + CS)",
                category: "Technology & Engineering",
                match: 95,
                description: "Perfect for analytical minds who love problem solving.",
                reasons: ["High interest in Math/Tech", "Strong analytical potential"],
                careers: ["Software Engineer", "Data Scientist", "AI Engineer"]
              },
              {
                stream: "Commerce with Maths",
                category: "Finance & Analytics",
                match: 85,
                description: "Great for applying numbers to business.",
                reasons: ["Mathematical aptitude", "Logical thinking"],
                careers: ["Investment Banker", "Actuary", "Economist"]
              }
            ];
          case "Science":
            return [
              {
                stream: "Science (PCB)",
                category: "Medical & Life Sciences",
                match: 90,
                description: "For those who want to understand life and help others.",
                reasons: ["Passion for Science", "Research oriented"],
                careers: ["Doctor", "Biotechnologist", "Pharmacist"]
              }
            ];
          case "Literature":
          case "History":
            return [
              {
                stream: "Humanities / Arts",
                category: "Social Sciences",
                match: 92,
                description: "Explore human culture, history, and society.",
                reasons: ["Strong verbal skills", "Critical thinking"],
                careers: ["Journalist", "Lawyer", "Psychologist", "Historian"]
              }
            ];
          case "Arts":
            return [
              {
                stream: "Design & Arts",
                category: "Creative Industries",
                match: 95,
                description: "Express your creativity visually.",
                reasons: ["Creative aptitude", "Visual thinking"],
                careers: ["Graphic Designer", "Architect", "Animator"]
              }
            ];
          default:
            return [
              {
                stream: "General Stream",
                category: "Exploratory",
                match: 70,
                description: "Explore various fields to find your specific niche.",
                reasons: ["Diverse interests"],
                careers: ["Management", "Public Service"]
              }
            ];
        }
      };

      setRecommendations(getRecs(bestSubject));
    }
  }, [location.state]);

  const strengths = topInterest
    ? `Your results indicate a strong inclination towards ${topInterest}. You show aptitude for fields that require dedication and specific skill sets related to this domain.`
    : "Your profile shows a balanced set of interests. Explore multiple pathways to find what suits you best.";


  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Assessment Results"
        description="View your personalized career recommendations and detailed pathways."
      />
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Assessment Complete
              </h1>
            </div>
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

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Recommended Career Paths</h3>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="shadow-card border-2 hover:border-primary/50 transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{rec.stream}</CardTitle>
                      <CardDescription className="text-base">{rec.category}</CardDescription>
                    </div>
                    <Badge className="bg-gradient-primary text-lg px-4 py-1">{rec.match}% Match</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{rec.description}</p>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Why this is great for you:
                    </h4>
                    <ul className="space-y-1 ml-6">
                      {rec.reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground list-disc">{reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Career Options:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.careers.map((career, idx) => (
                        <Badge key={idx} variant="secondary">{career}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

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
