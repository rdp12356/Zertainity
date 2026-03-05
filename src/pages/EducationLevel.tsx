import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, BookOpen, School, Star } from "lucide-react";

const EducationLevel = () => {
  const navigate = useNavigate();

  const handleSelection = (level: 'after-10th' | 'after-12th') => {
    navigate("/marks-entry", { state: { educationLevel: level } });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Start Your Journey</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Where Are You Headed?</h2>
          <p className="text-lg text-muted-foreground">
            Select your current educational stage to get personalized guidance
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Currently in School */}
          <Card
            className="shadow-card hover:shadow-glow transition-smooth cursor-pointer border-2 hover:border-amber-500/50 group"
            onClick={() => navigate("/grade-selection")}
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500/20 transition-colors">
                <Star className="h-10 w-10 text-amber-600" />
              </div>
              <CardTitle className="text-xl">Currently in School</CardTitle>
              <CardDescription className="text-sm mt-2">
                Grade 1–12 · Discover your subject strengths and get stream guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="w-full rounded-full bg-amber-500 hover:bg-amber-600 text-white" onClick={() => navigate("/grade-selection")}>
                Select Grade
              </Button>
            </CardContent>
          </Card>

          {/* After 10th */}
          <Card
            className="shadow-card hover:shadow-glow transition-smooth cursor-pointer border-2 hover:border-primary/50 group"
            onClick={() => handleSelection('after-10th')}
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-secondary flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">After 10th Grade</CardTitle>
              <CardDescription className="text-sm mt-2">
                Planning to choose your stream for 11th and 12th
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="hero" size="lg" className="w-full rounded-full" onClick={() => handleSelection('after-10th')}>
                Continue
              </Button>
            </CardContent>
          </Card>

          {/* After 12th */}
          <Card
            className="shadow-card hover:shadow-glow transition-smooth cursor-pointer border-2 hover:border-primary/50 group"
            onClick={() => handleSelection('after-12th')}
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <School className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-xl">After 12th Grade</CardTitle>
              <CardDescription className="text-sm mt-2">
                Planning to choose your college course and career path
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="hero" size="lg" className="w-full rounded-full" onClick={() => handleSelection('after-12th')}>
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick access stage badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wide">Quick Access by Stage</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: "Foundation (Age 3–8)", stage: "foundation", grade: "Grade 2" },
              { label: "Preparatory (Grade 3–5)", stage: "preparatory", grade: "Grade 5" },
              { label: "Middle (Grade 6–8)", stage: "middle", grade: "Grade 8" },
              { label: "Classes (Grade 9–12)", stage: "classes", grade: "Grade 10" },
            ].map((item) => (
              <button
                key={item.stage}
                onClick={() => navigate("/grade-selection")}
                className="px-4 py-2 rounded-full text-sm font-medium border border-border/60 bg-card hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EducationLevel;
