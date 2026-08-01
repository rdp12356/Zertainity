



import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { GraduationCap, ArrowLeft, ArrowRight, Lock } from "lucide-react";

import { SEO } from "@/components/SEO";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { questions } from "@/data/quizQuestions";
import { usePermission } from "@/hooks/usePermission";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<number, string>>({});
  const [marks, setMarks] = useState("");
  const { hasPermission, isLoading, userRole } = usePermission('edit_quiz');

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  const handleAnswer = (value: string) => {
    const score = parseInt(value);
    setAnswers({ ...answers, [currentQuestion]: score });
    // Clear custom answer if selecting a predefined option
    if (score !== 6) {
      const newCustomAnswers = { ...customAnswers };
      delete newCustomAnswers[currentQuestion];
      setCustomAnswers(newCustomAnswers);
    }
  };

  const handleCustomAnswer = (text: string) => {
    setCustomAnswers({ ...customAnswers, [currentQuestion]: text });
    setAnswers({ ...answers, [currentQuestion]: 6 });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length === questions.length && marks) {
      const filteredAnswers = Object.fromEntries(
        Object.entries(answers).filter(([, value]) => value !== "not-applicable")
      );
      navigate("/results", {
        state: {
          answers: filteredAnswers,
          customAnswers,
          marks: parseFloat(marks),
          questions,
        },
      });
    }
  };

  const isAnswered = answers[currentQuestion] !== undefined;
  const allAnswered = Object.keys(answers).length === questions.length;

  // Keyboard navigation & shortcuts (1-5 to select, Enter/Right to next, Left to prev)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= "1" && e.key <= "5") {
        handleAnswer(e.key);
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        if (isAnswered) {
          if (currentQuestion < questions.length - 1) {
            handleNext();
          } else if (allAnswered && marks) {
            handleSubmit();
          }
        }
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestion, answers, isAnswered, allAnswered, marks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Free Career Aptitude Quiz"
        description="Take Zertainity's free career aptitude quiz built for Indian students. Discover your strengths, interests, and matching career options in just 10 minutes."
        canonical="/quiz"
        keywords="career aptitude test, free career quiz India, interest test, career assessment for students, aptitude test for class 10 12, what career suits me"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Quiz", path: "/quiz" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: "Zertainity Career Aptitude Quiz",
          description: "A short interest- and strength-based quiz that maps Indian students to suitable streams, exams, and careers.",
          inLanguage: "en-IN",
          educationalLevel: "Secondary, Higher Secondary, Undergraduate",
          about: { "@type": "Thing", name: "Career planning" },
          provider: {
            "@type": "Organization",
            name: "Zertainity",
            url: "https://www.zertainity.in",
          },
        }}
      />
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Zertainity
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {!hasPermission && userRole && (
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You have view-only access. Contact an admin for editing permissions.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="mb-8 space-y-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-primary font-semibold">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />

          {/* Question Dot Pagination Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {questions.map((_, idx) => {
              const isCurrent = idx === currentQuestion;
              const isAns = answers[idx] !== undefined;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-primary text-primary-foreground ring-2 ring-primary/40 shadow-sm scale-110"
                      : isAns
                      ? "bg-primary/20 text-primary border border-primary/40"
                      : "bg-muted text-muted-foreground border border-border/40 hover:bg-muted/80"
                  }`}
                  aria-label={`Jump to question ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        <Card className="shadow-card border-2">
          <CardHeader>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {questions[currentQuestion].subject}
                </span>
              </div>
              <Badge variant="outline" className="text-[11px] opacity-70">⌨️ Keys 1-5 • Enter ↵</Badge>
            </div>
            <CardTitle className="text-2xl">{questions[currentQuestion].question}</CardTitle>
            <CardDescription>Select the option that best describes your interest level</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup 
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option, index) => {
                const optVal = (index + 1).toString();
                const isSelected = answers[currentQuestion]?.toString() === optVal;
                return (
                  <div
                    key={index}
                    onClick={() => handleAnswer(optVal)}
                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-primary/10 border-primary shadow-sm text-primary font-semibold"
                        : "border-border/60 hover:border-primary/50 hover:bg-muted/40"
                    }`}
                  >
                    <RadioGroupItem value={optVal} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium text-foreground">
                      {option}
                    </Label>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-md ${isSelected ? "bg-primary text-primary-foreground" : "text-muted-foreground bg-muted"}`}>
                      {index + 1}
                    </span>
                  </div>
                );
              })}
              
              {currentQuestion === questions.length - 1 && (
                <div
                  onClick={() => handleAnswer("not-applicable")}
                  className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                    answers[currentQuestion]?.toString() === "not-applicable"
                      ? "bg-primary/10 border-primary shadow-sm text-primary font-semibold"
                      : "border-border/60 hover:border-primary/50 hover:bg-muted/40"
                  }`}
                >
                  <RadioGroupItem value="not-applicable" id="option-not-applicable" />
                  <Label htmlFor="option-not-applicable" className="flex-1 cursor-pointer font-medium text-foreground">
                    Not applicable
                  </Label>
                </div>
              )}

              <div
                className={`p-4 rounded-xl border transition-all ${
                  answers[currentQuestion]?.toString() === "6"
                    ? "bg-primary/10 border-primary shadow-sm"
                    : "border-border/60 bg-muted/30"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="6" id="option-custom" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="option-custom" className="cursor-pointer font-medium mb-2 block text-foreground">
                      Other (please specify)
                    </Label>
                    <input
                      type="text"
                      value={customAnswers[currentQuestion] || ""}
                      onChange={(e) => handleCustomAnswer(e.target.value)}
                      onFocus={() => handleAnswer("6")}
                      placeholder="Type your custom answer here..."
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-ring transition-smooth text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>
            </RadioGroup>

            {currentQuestion === questions.length - 1 && (
              <div className="mt-6 p-4 border border-primary/20 rounded-xl bg-primary/5 space-y-2">
                <Label htmlFor="marks" className="text-sm font-semibold text-foreground block">
                  Enter your academic marks (percentage or CGPA)
                </Label>
                <p className="text-xs text-muted-foreground">This helps calculate matching career pathways and eligibility.</p>
                <input
                  id="marks"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g., 85 or 8.5"
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-ring transition-smooth text-sm text-foreground"
                />
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            size="lg"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentQuestion < questions.length - 1 ? (
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={!isAnswered}
              size="lg"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="hero"
              onClick={handleSubmit}
              disabled={!allAnswered || !marks}
              size="lg"
            >
              Get Results
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default Quiz;
