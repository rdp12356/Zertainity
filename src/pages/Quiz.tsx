import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { usePermission } from "@/hooks/usePermission";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  subject: string;
  question_text: string; // Changed from question
  order_index: number;
  options?: Option[];
}

interface Option {
  id: number;
  option_text: string;
  score_value: number;
}

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<number, string>>({});
  const [marks, setMarks] = useState("");
  const { hasPermission, isLoading: isPermissionLoading, userRole } = usePermission('edit_quiz');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  // Fetch questions from Supabase
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select(`
            *,
            options (*)
          `)
          .order('order_index', { ascending: true });

        if (questionsError) throw questionsError;

        if (questionsData) {
          // Sort options by score_value standard
          const formattedQuestions = questionsData.map(q => ({
            ...q,
            options: q.options ? q.options.sort((a: any, b: any) => a.score_value - b.score_value) : []
          }));
          setQuestions(formattedQuestions);
        }
      } catch (error: any) {
        console.error('Error fetching quiz:', error);
        toast({
          title: "Error",
          description: "Failed to load quiz questions. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [toast]);

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  if (isPermissionLoading || loadingQuestions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading assessment...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <SEO title="Quiz Error" description="Unable to load quiz." />
        <p className="text-muted-foreground">No questions available at the moment.</p>
        <Button onClick={() => navigate("/")}>Return Home</Button>
      </div>
    );
  }

  const handleAnswer = (value: string) => {
    const score = parseInt(value);
    setAnswers({ ...answers, [currentQuestion]: score });
    // Clear custom answer if selecting a predefined option
    if (score !== 6) { // Assuming '6' is still the value for custom answer
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

  const handleSubmit = async () => {
    if (Object.keys(answers).length === questions.length && marks) {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const responsesToInsert = Object.entries(answers).map(([questionIndex, answerValue]) => {
            const qIndex = parseInt(questionIndex);
            const question = questions[qIndex];
            const isCustom = answerValue === 6;

            // Find selected option based on score_value (if not custom/not-applicable)
            // Note: This logic assumes unique scores or standard options. 
            // Better to track option_id in state, but working with current structure:
            let selectedOptionId = null;
            if (!isCustom && answerValue !== 'not-applicable') {
              const opt = question.options?.find(o => o.score_value === answerValue);
              if (opt) selectedOptionId = opt.id;
            }

            return {
              user_id: user.id,
              question_id: question.id,
              selected_option_id: selectedOptionId,
              custom_answer: isCustom ? customAnswers[qIndex] : null,
              score_value: typeof answerValue === 'number' ? answerValue : null
            };
          });

          const { error } = await supabase.from('user_responses').insert(responsesToInsert);

          if (error) {
            console.error('Error saving responses:', error);
            toast({
              title: "Warning",
              description: "Could not save your progress to account, but showing results.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Success",
              description: "Assessment saved to your profile!",
            });
          }
        }
      } catch (err) {
        console.error("Auth check failed", err);
      }

      const filteredAnswers = Object.fromEntries(
        Object.entries(answers).filter(([, value]) => value !== "not-applicable")
      );

      navigate("/results", {
        state: {
          answers: filteredAnswers,
          customAnswers,
          marks: parseFloat(marks),
          questions, // Pass the fetched questions structure
        },
      });
    }
  };

  const isAnswered = answers[currentQuestion] !== undefined;
  const allAnswered = Object.keys(answers).length === questions.length;
  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Career Assessment Quiz"
        description="Take our AI-powered career assessment to discover your strengths and interests."
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

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="shadow-card border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-3 w-fit">
              <span className="text-sm font-semibold text-primary">
                {currentQ.subject}
              </span>
            </div>
            <CardTitle className="text-2xl leading-tight">{currentQ.question_text}</CardTitle>
            <CardDescription>Select the option that best describes your interest level</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[currentQuestion]?.toString() || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQ.options?.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer group">
                  <RadioGroupItem value={option.score_value.toString()} id={`option-${option.id}`} />
                  <Label htmlFor={`option-${option.id}`} className="flex-1 cursor-pointer font-medium group-hover:text-primary transition-colors">
                    {option.option_text}
                  </Label>
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary">{index + 1}</span>
                </div>
              ))}

              {currentQuestion === questions.length - 1 && (
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer">
                  <RadioGroupItem value="not-applicable" id="option-not-applicable" />
                  <Label htmlFor="option-not-applicable" className="flex-1 cursor-pointer font-medium">
                    Not applicable
                  </Label>
                </div>
              )}

              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="6" id="option-custom" className="mt-3" />
                  <div className="flex-1">
                    <Label htmlFor="option-custom" className="cursor-pointer font-medium mb-2 block">
                      Other (please specify)
                    </Label>
                    <input
                      type="text"
                      value={customAnswers[currentQuestion] || ""}
                      onChange={(e) => handleCustomAnswer(e.target.value)}
                      onFocus={() => handleAnswer("6")}
                      placeholder="Type your answer here..."
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                    />
                  </div>
                </div>
              </div>
            </RadioGroup>

            {currentQuestion === questions.length - 1 && (
              <div className="mt-6 p-6 border border-border rounded-lg bg-muted/30">
                <Label htmlFor="marks" className="text-base font-medium mb-3 block">
                  Enter your academic marks (percentage or CGPA)
                </Label>
                <input
                  id="marks"
                  type="number"
                  step="0.01"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g., 85 or 8.5"
                  className="w-full px-4 py-3 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none text-lg"
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
            className="w-32"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          {currentQuestion < questions.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              size="lg"
              className="w-32 shadow-lg hover:shadow-primary/25 transition-all"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered || !marks}
              size="lg"
              className="w-40 shadow-lg hover:shadow-primary/25 transition-all bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 border-0"
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
