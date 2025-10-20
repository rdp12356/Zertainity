import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, BookOpen, School } from "lucide-react";

const EducationLevel = () => {
  const navigate = useNavigate();

  const handleSelection = (level: 'after-10th' | 'after-12th') => {
    navigate("/marks-entry", { state: { educationLevel: level } });
  };

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
                Zertainity
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Where Are You Headed?</h2>
          <p className="text-xl text-muted-foreground">
            Select your current educational stage to get personalized guidance
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card 
            className="shadow-card hover:shadow-glow transition-smooth cursor-pointer border-2 hover:border-primary/50"
            onClick={() => handleSelection('after-10th')}
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-secondary flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">After 10th Grade</CardTitle>
              <CardDescription className="text-base mt-3">
                I'm planning to choose my stream for 11th and 12th
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="hero" size="lg" className="w-full" onClick={() => handleSelection('after-10th')}>
                Continue
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="shadow-card hover:shadow-glow transition-smooth cursor-pointer border-2 hover:border-primary/50"
            onClick={() => handleSelection('after-12th')}
          >
            <CardHeader className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4">
                <School className="h-10 w-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">After 12th Grade</CardTitle>
              <CardDescription className="text-base mt-3">
                I'm planning to choose my college course
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="hero" size="lg" className="w-full" onClick={() => handleSelection('after-12th')}>
                Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default EducationLevel;
