import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { GraduationCap, ArrowLeft, ArrowRight } from "lucide-react";

interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    subject: "Mathematics",
    question: "How interested are you in solving complex mathematical problems?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 2,
    subject: "Science",
    question: "How much do you enjoy conducting experiments and understanding scientific concepts?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 3,
    subject: "Literature",
    question: "How passionate are you about reading, writing, and analyzing texts?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 4,
    subject: "History",
    question: "How interested are you in learning about past events and their impact on society?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 5,
    subject: "Arts",
    question: "How creative do you feel when expressing yourself through art, music, or design?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  },
  {
    id: 6,
    subject: "Technology",
    question: "How enthusiastic are you about working with computers and emerging technologies?",
    options: ["Not interested", "Slightly interested", "Moderately interested", "Very interested", "Extremely interested"]
  }
];

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<number, string>>({});
  const [marks, setMarks] = useState("");

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
      navigate("/results", { 
        state: { 
          answers, 
          customAnswers,
          marks: parseFloat(marks),
          questions 
        } 
      });
    }
  };

  const isAnswered = answers[currentQuestion] !== undefined;
  const allAnswered = Object.keys(answers).length === questions.length;

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

      <main className="container mx-auto px-4 py-12 max-w-3xl">
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

        <Card className="shadow-card border-2">
          <CardHeader>
            <div className="inline-block px-3 py-1 bg-gradient-secondary rounded-full mb-3">
              <span className="text-sm font-semibold text-primary-foreground">
                {questions[currentQuestion].subject}
              </span>
            </div>
            <CardTitle className="text-2xl">{questions[currentQuestion].question}</CardTitle>
            <CardDescription>Select the option that best describes your interest level</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={answers[currentQuestion]?.toString()} 
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted transition-smooth cursor-pointer">
                  <RadioGroupItem value={(index + 1).toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-medium">
                    {option}
                  </Label>
                  <span className="text-sm font-semibold text-primary">{index + 1}</span>
                </div>
              ))}
              
              {currentQuestion === 5 && (
                <div className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted transition-smooth cursor-pointer">
                  <RadioGroupItem value="0" id="option-no-subject" />
                  <Label htmlFor="option-no-subject" className="flex-1 cursor-pointer font-medium">
                    No 6th subject
                  </Label>
                </div>
              )}

              <div className="p-4 rounded-lg border border-border bg-muted/50">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="6" id="option-custom" className="mt-1" />
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
                      className="w-full px-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
                    />
                  </div>
                </div>
              </div>
            </RadioGroup>

            {currentQuestion === questions.length - 1 && (
              <div className="mt-6 p-4 border border-border rounded-lg bg-muted/50">
                <Label htmlFor="marks" className="text-sm font-medium mb-2 block">
                  Enter your academic marks (percentage or CGPA)
                </Label>
                <input
                  id="marks"
                  type="number"
                  step="0.01"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value)}
                  placeholder="e.g., 85 or 8.5"
                  className="w-full px-4 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
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
