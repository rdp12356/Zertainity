import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { SEO } from "@/components/SEO";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { questions } from "@/data/quizQuestions";
import { usePermission } from "@/hooks/usePermission";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = Next, -1 = Previous
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<number, string>>({});
  const [marks, setMarks] = useState("");
  const { hasPermission, isLoading, userRole } = usePermission("edit_quiz");

  const [isAdvancing, setIsAdvancing] = useState(false);
  const [advancingIndex, setAdvancingIndex] = useState<number | string | null>(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground animate-pulse font-medium">Loading Quiz...</p>
        </div>
      </div>
    );
  }

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

  const handleOptionClick = (optionValue: string | number) => {
    if (isAdvancing) return;

    const score = typeof optionValue === "number" ? optionValue : parseInt(optionValue);
    setAnswers({ ...answers, [currentQuestion]: score });

    // Clear custom answer if selecting a predefined option
    if (score !== 6) {
      const newCustomAnswers = { ...customAnswers };
      delete newCustomAnswers[currentQuestion];
      setCustomAnswers(newCustomAnswers);
    }

    // Trigger elegant Auto-Advance if not on "Other" and there's a next question
    if (score !== 6 && currentQuestion < questions.length - 1) {
      setIsAdvancing(true);
      setAdvancingIndex(optionValue);

      setTimeout(() => {
        setDirection(1);
        setCurrentQuestion((prev) => prev + 1);
        setIsAdvancing(false);
        setAdvancingIndex(null);
      }, 450);
    }
  };

  const handleCustomAnswer = (text: string) => {
    setCustomAnswers({ ...customAnswers, [currentQuestion]: text });
    setAnswers({ ...answers, [currentQuestion]: 6 });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setDirection(1);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1);
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

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 120 : -160,
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 320, damping: 26 },
        opacity: { duration: 0.25 },
        scale: { duration: 0.25 },
      },
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 120 : -160,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 320, damping: 26 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Decorative Mesh Glow */}
      <div className="absolute top-[-10%] right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

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

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/")} 
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-amber-500" />
              <span className="text-sm font-semibold tracking-tight text-white/90">
                Zertainity
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl relative z-10">
        {!hasPermission && userRole && (
          <Alert className="mb-6 bg-amber-500/10 border-amber-500/20 text-amber-400 rounded-2xl">
            <Lock className="h-4 w-4 text-amber-500" />
            <AlertDescription className="font-medium">
              You have view-only access. Contact an admin for editing permissions.
            </AlertDescription>
          </Alert>
        )}

        {/* Cinematic Progress Indicator */}
        <div className="mb-8 p-2 rounded-2xl border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md">
          <div className="flex items-center justify-between px-3 py-1.5">
            <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">
              Assessment Progress
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white/90 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span className="text-xs font-extrabold text-amber-400">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="relative w-full h-2 bg-white/5 rounded-full overflow-hidden mt-2">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 20 }}
            />
          </div>
        </div>

        {/* Question Sliding Deck container */}
        <div className="overflow-visible min-h-[450px] relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentQuestion}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full absolute"
            >
              <Card className="shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-3xl overflow-hidden text-white">
                <CardHeader className="pb-4 relative">
                  <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 mb-2.5 self-start shadow-sm shadow-purple-500/5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">
                      {questions[currentQuestion].subject}
                    </span>
                  </div>
                  <CardTitle 
                    className="text-3xl sm:text-4xl font-light leading-tight tracking-tight text-white"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {questions[currentQuestion].question}
                  </CardTitle>
                  <CardDescription className="text-white/60 text-sm mt-1">
                    Select the option that best matches your interest level:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5 pt-2">
                  <div className="grid gap-3">
                    {questions[currentQuestion].options.map((option, index) => {
                      const value = (index + 1).toString();
                      const isSelected = answers[currentQuestion]?.toString() === value;
                      const isAutoAdvancing = isSelected && isAdvancing && advancingIndex === value;

                      return (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.01, y: -1 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => handleOptionClick(value)}
                          className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                            isSelected
                              ? "border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(218,165,32,0.15)] ring-1 ring-amber-500/40 text-amber-300"
                              : "border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/80"
                          }`}
                        >
                          <div className="flex items-center gap-3.5 z-10">
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                isSelected
                                  ? "border-amber-500 bg-amber-500 text-black scale-110"
                                  : "border-white/20 group-hover:border-white/40"
                              }`}
                            >
                              {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-black" />}
                            </div>
                            <span
                              className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                                isSelected ? "text-white" : "text-white/70 group-hover:text-white"
                              }`}
                            >
                              {option}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all duration-300 z-10 ${
                              isSelected
                                ? "bg-amber-500 text-black shadow-sm"
                                : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/80"
                            }`}
                          >
                            {index + 1}
                          </span>

                          {/* Countdown active fill bar */}
                          {isAutoAdvancing && (
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.43, ease: "linear" }}
                              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 to-amber-500 pointer-events-none"
                            />
                          )}
                        </motion.div>
                      );
                    })}

                    {/* Not Applicable option (only on last question) */}
                    {currentQuestion === questions.length - 1 && (
                      <motion.div
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleOptionClick("not-applicable")}
                        className={`group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                          answers[currentQuestion] === "not-applicable"
                            ? "border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(218,165,32,0.15)] ring-1 ring-amber-500/40 text-amber-300"
                            : "border-white/10 bg-white/[0.01] hover:bg-white/[0.05] hover:border-white/20 text-white/80"
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                              answers[currentQuestion] === "not-applicable"
                                ? "border-amber-500 bg-amber-500 text-black scale-110"
                                : "border-white/20 group-hover:border-white/40"
                            }`}
                          >
                            {answers[currentQuestion] === "not-applicable" && (
                              <div className="h-1.5 w-1.5 rounded-full bg-black" />
                            )}
                          </div>
                          <span
                            className={`font-medium text-sm sm:text-base transition-colors duration-300 ${
                              answers[currentQuestion] === "not-applicable"
                                ? "text-white"
                                : "text-white/70 group-hover:text-white"
                            }`}
                          >
                            Not applicable
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Other / Custom explanation block */}
                    <div
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                        answers[currentQuestion] === 6
                          ? "border-amber-500 bg-amber-500/10 shadow-[0_0_25px_rgba(218,165,32,0.15)] ring-1 ring-amber-500/40"
                          : "border-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div
                          onClick={() => handleOptionClick(6)}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 mt-1 cursor-pointer transition-all duration-300 ${
                            answers[currentQuestion] === 6
                              ? "border-amber-500 bg-amber-500 text-black scale-110"
                              : "border-white/20 hover:border-white/40"
                          }`}
                        >
                          {answers[currentQuestion] === 6 && (
                            <div className="h-1.5 w-1.5 rounded-full bg-black" />
                          )}
                        </div>
                        <div className="flex-1">
                          <Label
                            onClick={() => handleOptionClick(6)}
                            className="cursor-pointer font-bold text-sm sm:text-base text-white mb-2 block"
                          >
                            Other (please specify)
                          </Label>
                          <input
                            type="text"
                            value={customAnswers[currentQuestion] || ""}
                            onChange={(e) => handleCustomAnswer(e.target.value)}
                            onFocus={() => handleOptionClick(6)}
                            placeholder="Type your own career/interest area here..."
                            className="w-full px-4 py-3 border border-white/10 rounded-xl bg-black/40 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 focus:outline-none text-sm placeholder:text-white/30"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Academic Marks Panel on Last Question */}
                  {currentQuestion === questions.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.4 }}
                      className="mt-6 p-5 border border-purple-500/20 rounded-2xl bg-purple-950/20 relative overflow-hidden shadow-lg"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl -mr-6 -mt-6 pointer-events-none" />
                      <Label
                        htmlFor="marks"
                        className="text-xs font-bold tracking-wider uppercase text-purple-300 mb-2.5 block"
                      >
                        Academic Performance Indicator
                      </Label>
                      <div className="text-xs text-white/60 leading-relaxed mb-3.5">
                        Please enter your current academic marks as a percentage (e.g., 85) or CGPA (e.g., 8.5). This allows our engine to gauge eligibility for specific streams.
                      </div>
                      <div className="relative">
                        <input
                          id="marks"
                          type="number"
                          step="0.01"
                          value={marks}
                          onChange={(e) => setMarks(e.target.value)}
                          placeholder="e.g., 85 or 8.5"
                          className="w-full px-4 py-3.5 pl-11 border border-white/10 rounded-xl bg-black/50 text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 focus:outline-none font-semibold text-base placeholder:text-white/30 shadow-inner"
                        />
                        <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Actions Row */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/10 relative">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            size="lg"
            className="rounded-full px-6 border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/20 font-semibold shadow-sm transition-all"
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
              className="rounded-full px-7 font-bold shadow-lg shadow-purple-500/10 hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-gradient-to-r from-purple-500 via-indigo-600 to-amber-500 text-white border-0 disabled:opacity-40 disabled:pointer-events-none"
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
              className="rounded-full px-8 font-bold shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 bg-gradient-to-r from-purple-500 via-indigo-600 to-amber-500 text-white border-0 disabled:opacity-40 disabled:pointer-events-none"
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
