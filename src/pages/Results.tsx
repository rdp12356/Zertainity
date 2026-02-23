import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, Mail, CheckCircle2, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useCareerAnalysis } from "@/hooks/useCareerAnalysis";
import { CareerResultCard } from "@/components/career/CareerResultCard";
import type { StudentProfile } from "@/lib/scoringEngine";

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

  // MarksEntry sends 'after-10th'/'after-12th'; scoring engine wants '10th'/'12th'/'graduate'
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
    emailSentTo, dailyCallsUsed, dailyCallLimit,
    run, reset,
  } = useCareerAnalysis();

  // Kick off analysis once on mount
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

  // Gate: if page was accessed without location state, send back to quiz flow
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
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-bold">Your Career Analysis</h1>
            </div>
            {dailyCallsUsed > 0 && (
              <span className="ml-auto text-xs text-muted-foreground">
                AI quota: {dailyCallsUsed}/{dailyCallLimit} today
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl">

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-muted flex items-center justify-center">
                <GraduationCap className="h-7 w-7 text-muted-foreground" />
              </div>
              <Loader2 className="absolute -top-1 -right-1 h-6 w-6 text-primary animate-spin" />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold">Analysing your profile…</h2>
              <p className="text-sm text-muted-foreground mt-1">Scoring {20} careers · Generating AI mentorship</p>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <Card className="border-destructive/30">
            <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
              <AlertCircle className="h-10 w-10 text-destructive/70" />
              <div>
                <h2 className="font-semibold text-lg">Analysis failed</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">{error}</p>
              </div>
              <Button onClick={handleRetry} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Try again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {!loading && !error && topCareers.length > 0 && (
          <div className="space-y-6">
            {/* Header text */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight">
                Your Top Career Matches
              </h2>
              <p className="text-muted-foreground text-sm">
                Based on your marks, interests, and education level —
                scored across 20 career domains.
              </p>
            </div>

            {/* Top career (with AI explanation) */}
            <CareerResultCard
              match={topCareers[0]}
              aiExplanation={aiExplanation}
              aiModelUsed={aiModelUsed}
              isTop
            />

            {/* Runner-up careers */}
            {topCareers.slice(1).map(c => (
              <CareerResultCard key={c.career} match={c} />
            ))}

            {/* Email confirmation */}
            {emailSentTo && !emailConfirmed && (
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="flex items-start gap-3 py-4">
                  <Mail className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-emerald-800">Report emailed to {emailSentTo}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Check your inbox for your full career report.</p>
                  </div>
                  <button
                    className="ml-auto text-emerald-600 hover:text-emerald-800"
                    onClick={() => setEmailConfirmed(true)}
                  >
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                </CardContent>
              </Card>
            )}

            {/* CTAs */}
            <Card className="bg-black text-white border-0">
              <CardHeader>
                <CardTitle className="text-white text-xl">Ready to start your journey?</CardTitle>
                <CardDescription className="text-gray-300">
                  Explore detailed roadmaps, course recommendations, and college options.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/pathways", { state: { topCareer: topCareers[0]?.career } })}
                >
                  View Detailed Roadmap
                </Button>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => navigate("/careers")}
                >
                  Browse All Careers
                </Button>
              </CardContent>
            </Card>

            {/* Restart */}
            <div className="text-center pb-4">
              <button
                onClick={() => navigate("/education-level")}
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
              >
                Start a new analysis
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Results;
