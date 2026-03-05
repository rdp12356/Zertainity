import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowLeft, Star, BookOpen, Layers, School } from "lucide-react";

const stages = [
  {
    id: "foundation",
    label: "Foundation",
    subtitle: "Age 3–8 • Pre-Primary & Grade 1–2",
    icon: Star,
    grades: ["Pre-K", "KG", "Grade 1", "Grade 2"],
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    iconBg: "bg-amber-500/10",
    description: "Early learning & foundational skills",
  },
  {
    id: "preparatory",
    label: "Preparatory",
    subtitle: "Grade 3–5",
    icon: BookOpen,
    grades: ["Grade 3", "Grade 4", "Grade 5"],
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    iconBg: "bg-emerald-500/10",
    description: "Building core academic competencies",
  },
  {
    id: "middle",
    label: "Middle",
    subtitle: "Grade 6–8",
    icon: Layers,
    grades: ["Grade 6", "Grade 7", "Grade 8"],
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    iconBg: "bg-blue-500/10",
    description: "Subject exploration & critical thinking",
  },
  {
    id: "classes",
    label: "Classes",
    subtitle: "Grade 9–12",
    icon: School,
    grades: ["Grade 9", "Grade 10", "Grade 11", "Grade 12"],
    color: "bg-primary/10 text-primary border-primary/20",
    iconBg: "bg-primary/10",
    description: "Board exams, streams & career prep",
  },
];

const GradeSelection = () => {
  const navigate = useNavigate();

  const handleGradeSelect = (stageId: string, grade: string) => {
    // Route all grades through the Subject Selection step first
    navigate("/subject-selection", { state: { grade, stage: stageId } });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/education-level")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Select Your Stage</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-foreground">Which stage are you in?</h2>
          <p className="text-muted-foreground text-lg">
            Select your stage to get personalized subject and career guidance
          </p>
        </div>

        <div className="space-y-6">
          {stages.map((stage) => {
            const Icon = stage.icon;
            return (
              <Card key={stage.id} className="border border-border/40 hover:border-border transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${stage.iconBg} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{stage.label}</CardTitle>
                      <CardDescription>{stage.subtitle} • {stage.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {stage.grades.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => handleGradeSelect(stage.id, grade)}
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all hover:scale-105 active:scale-95 cursor-pointer ${stage.color}`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default GradeSelection;
