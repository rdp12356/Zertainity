import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, Mail, CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useCareerAnalysis } from "@/hooks/useCareerAnalysis";
import { CareerResultCard } from "@/components/career/CareerResultCard";
import { AskMentor } from "@/components/career/AskMentor";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import type { StudentProfile } from "@/lib/scoringEngine";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const calledRef = useRef(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);

  const {
    educationLevel: rawEduLevel,
    marks,
    normalisedMarks,
    interestScores,
  } = location.state || {};

  const EDU_MAP: Record<string, string> = {
    'after-10th': '10th',
    'after-12th': '12th',
    '10th': '10th',
    '12th': '12th',
    'graduate': 'graduate',
  };
  const educationLevel = EDU_MAP[rawEduLevel] ?? rawEduLevel;

  const {
    loading, error, topCareers, aiExplanation, aiModelUsed,
    emailSentTo, dailyCallsUsed, dailyCallLimit, resultId,
    run, reset,
  } = useCareerAnalysis();

  useEffect(() => {
    if (!educationLevel || calledRef.current) return;
    calledRef.current = true;

    const profile: StudentProfile = {
      educationLevel: (educationLevel ?? '12th') as StudentProfile['educationLevel'],
      marks: normalisedMarks ?? marks ?? {},
      interestScores: interestScores ?? {},
    };
    run(profile);
  }, [educationLevel]);

  if (!rawEduLevel) {
    return <Navigate to="/education-level" replace />;
  }

  const handleRetry = () => {
    reset();
    calledRef.current = false;
    const profile: StudentProfile = {
      educationLevel: (educationLevel ?? '12th') as StudentProfile['educationLevel'],
      marks: normalisedMarks ?? marks ?? {},
      interestScores: interestScores ?? {},
    };
    calledRef.current = true;
    run(profile);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{topCareers.length > 0 ? `Career Match: ${topCareers[0].career} | Zertainity` : 'Your Career Analysis | Zertainity'}</title>
        <meta name="description" content="Review your personalized AI career analysis results. Discover domain matches, detailed roadmaps, and college prerequisites." />
      </Helmet>

      <header className="border-b border-border bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-muted rounded-none">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-foreground" />
              <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">
                Career Analysis
              </h1>
            </div>
            {dailyCallsUsed > 0 && (
              <span className="ml-auto text-xs text-muted-foreground font-sans tracking-widest uppercase bg-muted px-3 py-1 border border-border">
                AI quota: {dailyCallsUsed}/{dailyCallLimit} today
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl">

        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 gap-6"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center shadow-inner">
                <GraduationCap className="h-10 w-10 text-primary/80" />
              </div>
              <Loader2 className="absolute -top-1 -right-1 h-7 w-7 text-primary animate-spin" />
            </div>

            <div className="text-center space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold tracking-tight"
              >
                Synthesizing Profile Data
              </motion.h2>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.8, delayChildren: 0.5 } }
                }}
                className="h-6 overflow-hidden relative w-full flex justify-center"
              >
                <div className="flex flex-col absolute">
                  <motion.p variants={{ hidden: { y: 24, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="text-muted-foreground h-6 font-medium">Evaluating {Object.keys(marks || {}).length} subjects...</motion.p>
                  <motion.p variants={{ hidden: { y: 24, opacity: 0 }, visible: { y: -24, opacity: 1 } }} className="text-muted-foreground h-6 font-medium">Cross-referencing 20+ career domains...</motion.p>
                  <motion.p variants={{ hidden: { y: 24, opacity: 0 }, visible: { y: -48, opacity: 1 } }} className="text-muted-foreground h-6 font-medium">Generating AI mentorship insights...</motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {!loading && error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-destructive/30 shadow-sm">
              <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                <div className="h-16 w-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h2 className="font-bold text-xl tracking-tight">Analysis Interrupted</h2>
                  <p className="text-muted-foreground mt-2 max-w-md mx-auto">{error}</p>
                </div>
                <Button onClick={handleRetry} className="gap-2 mt-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                  <RefreshCw className="h-4 w-4" /> Attempt Recovery
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!loading && !error && topCareers.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="text-center space-y-4 mb-12 border-b border-border pb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-foreground">
                Data-Driven Career Matches
              </h2>
              <p className="text-lg text-muted-foreground font-sans max-w-xl mx-auto">
                Algorithmic scoring across 20 distinct domains based on your reported academics and verified interests.
              </p>
            </motion.div>

            {/* Top Career */}
            <motion.div variants={itemVariants}>
              <CareerResultCard
                match={topCareers[0]}
                aiExplanation={aiExplanation}
                aiModelUsed={aiModelUsed}
                isTop
                index={0}
              />
            </motion.div>

            {/* Sub-Careers Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topCareers.slice(1, 3).map((c, i) => (
                <CareerResultCard key={c.career} match={c} index={i + 1} />
              ))}
            </motion.div>

            {topCareers.slice(3).map((c, i) => (
              <motion.div variants={itemVariants} key={c.career}>
                <CareerResultCard match={c} index={i + 3} />
              </motion.div>
            ))}

            <motion.div variants={itemVariants}>
              {resultId && (
                <AskMentor resultId={resultId} topCareer={topCareers[0]} />
              )}
            </motion.div>

            {emailSentTo && !emailConfirmed && (
              <motion.div variants={itemVariants}>
                <Card className="border-emerald-200/50 bg-emerald-50/30 dark:bg-emerald-950/20 backdrop-blur-sm">
                  <CardContent className="flex items-start gap-4 py-5">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                      <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Formal Report Dispatched to {emailSentTo}</p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">Please retain this report for your records and future path planning.</p>
                    </div>
                    <button
                      className="ml-auto text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors p-2"
                      onClick={() => setEmailConfirmed(true)}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="pt-8">
              <Card className="rounded-none border border-border bg-foreground text-background shadow-none overflow-hidden relative">
                <CardHeader className="relative z-10 text-center pb-6 md:pb-8">
                  <CardTitle className="text-4xl font-serif font-bold tracking-tight mt-6">Initiate Path Execution</CardTitle>
                  <CardDescription className="text-background/80 font-sans text-lg max-w-xl mx-auto mt-4">
                    Review comprehensive roadmaps, certification requirements, and higher-education prerequisites.
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10 flex flex-wrap justify-center gap-4 pt-4 pb-8">
                  <Button
                    size="lg"
                    className="font-sans font-bold rounded-none bg-background text-foreground hover:bg-muted transition-colors px-8"
                    onClick={() => navigate("/pathways", { state: { topCareer: topCareers[0]?.career } })}
                  >
                    View Execution Roadmap
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="font-sans font-medium rounded-none border-background border text-background hover:bg-background hover:text-foreground transition-colors px-8 bg-transparent"
                    onClick={() => navigate("/careers")}
                  >
                    Explore Alternatives
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center pb-8 pt-4">
              <button
                onClick={() => navigate("/education-level")}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                Perform New Recalibration
              </button>
            </motion.div>

          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Results;
