import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, ArrowLeft, TrendingUp, BookOpen, Briefcase, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, marks, questions } = location.state || {};

  if (!answers || !marks || !questions) {
    return <Navigate to="/quiz" replace />;
  }

  // Calculate subject scores
  const subjectScores = questions.map((q: any, index: number) => ({
    subject: q.subject,
    score: answers[index] || 0,
    percentage: ((answers[index] || 0) / 5) * 100
  }));

  // Find top interests
  const topInterests = [...subjectScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  // Mock recommendations (will be replaced with AI)
  const collegeRecommendations = [
    { name: "Indian Institute of Technology (IIT)", location: "Various Campuses", fit: 95 },
    { name: "National Institute of Technology (NIT)", location: "Various Campuses", fit: 90 },
    { name: "Indian Institute of Science (IISc)", location: "Bangalore", fit: 88 }
  ];

  const careerRecommendations = [
    { title: "Software Engineer", match: 92 },
    { title: "Data Scientist", match: 88 },
    { title: "Research Scientist", match: 85 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Your Career Profile
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Academic Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {marks}%
                </div>
                <p className="text-muted-foreground">Overall Score</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-secondary" />
                Top Interests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topInterests.map((interest, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{interest.subject}</span>
                  <Badge variant="secondary" className="bg-gradient-secondary">
                    {interest.score}/5
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle>Subject Interest Analysis</CardTitle>
            <CardDescription>Your interest levels across different subjects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectScores.map((subject: any, index: number) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{subject.subject}</span>
                  <span className="text-sm text-muted-foreground">{subject.score}/5</span>
                </div>
                <Progress value={subject.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5 text-accent" />
                Recommended Colleges
              </CardTitle>
              <CardDescription>Based on your marks and interests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {collegeRecommendations.map((college, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:shadow-card transition-smooth">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{college.name}</h4>
                    <Badge className="bg-gradient-primary">{college.fit}% Match</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{college.location}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Career Recommendations
              </CardTitle>
              <CardDescription>Careers aligned with your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {careerRecommendations.map((career, index) => (
                <div key={index} className="p-4 border border-border rounded-lg hover:shadow-card transition-smooth cursor-pointer">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">{career.title}</h4>
                    <Badge variant="secondary">{career.match}% Match</Badge>
                  </div>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary"
                    onClick={() => navigate("/pathways", { state: { career: career.title } })}
                  >
                    View Career Path →
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <Button variant="outline" size="lg" onClick={() => navigate("/quiz")}>
            Retake Quiz
          </Button>
          <Button variant="hero" size="lg" onClick={() => navigate("/pathways")}>
            Explore Career Pathways
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Results;
