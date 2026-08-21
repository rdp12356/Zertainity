import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSetCurves } from "@/components/CurvesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Share2,
  Check,
  Copy,
  Link2,
  Download,
  ArrowRight,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  Compass,
  Building2,
  BookOpen,
  Award,
  AlertTriangle,
  Lightbulb,
  Bookmark,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { AssessmentStepper } from "@/components/AssessmentStepper";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useSavedCareers } from "@/hooks/useSavedCareers";
import { downloadAssessmentReportPdf } from "@/utils/pdfGenerator";
import {
  analyzeStudentProfile,
  downloadAnalysisExcel,
  downloadAnalysisJson,
  type AnalysisInput,
  type AnalysisResult,
} from "@/analysis_engine";
import {
  buildInterestsFromQuizAnswers,
  buildInterestsFromSubjectRows,
} from "@/lib/assessmentEngine";

const generateSlug = (len = 12) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

type ResultsLocationState = {
  educationLevel?: string;
  board?: "cbse" | "icse" | "ib" | string;
  class9Marks?: unknown;
  class10Marks?: unknown;
  class11Subjects?: unknown;
  class12Subjects?: unknown;
  interests?: unknown;
  answers?: Record<string, number | string>;
  questions?: unknown[];
  marks?: number;
  customAnswers?: Record<number, string>;
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as ResultsLocationState;
  const {
    educationLevel,
    board = "cbse",
    class9Marks,
    class10Marks,
    class11Subjects,
    class12Subjects,
    interests,
    answers,
    questions,
    marks,
  } = state;

  const hasQuizPayload =
    !!answers &&
    !!questions &&
    Array.isArray(questions) &&
    questions.length > 0 &&
    typeof answers === "object" &&
    Object.keys(answers).length > 0;

  const effectiveEducationLevel = educationLevel ?? (hasQuizPayload ? "after-12th" : undefined);

  const savedRef = useRef(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const setCurves = useSetCurves();
  const { isSaved, toggleSaveCareer } = useSavedCareers();

  useEffect(() => {
    setCurves([
      { d: "M -160 200 C -40 140, 100 120, 300 160 S 580 260, 880 200", strokeOpacity: 0.13, strokeWidth: 5 },
      { d: "M -160 200 C -40 140, 100 120, 300 160 S 580 260, 880 200", strokeOpacity: 0.44, strokeWidth: 1.4 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

  // Derive Current and Historical Subject Rows
  const { currentSubjectRows, previousSubjectRows } = useMemo(() => {
    if (effectiveEducationLevel === "after-10th") {
      return {
        currentSubjectRows: Array.isArray(class10Marks) ? (class10Marks as any[]) : [],
        previousSubjectRows: Array.isArray(class9Marks) ? (class9Marks as any[]) : [],
      };
    } else {
      return {
        currentSubjectRows: Array.isArray(class12Subjects) ? (class12Subjects as any[]) : [],
        previousSubjectRows: Array.isArray(class11Subjects) ? (class11Subjects as any[]) : [],
      };
    }
  }, [class10Marks, class11Subjects, class12Subjects, class9Marks, effectiveEducationLevel]);

  // Execute Authoritative Analysis Engine
  const analysis: AnalysisResult = useMemo(() => {
    const activeSubjects = currentSubjectRows.length > 0
      ? currentSubjectRows
      : Array.isArray(class9Marks) && class9Marks.length > 0
        ? (class9Marks as any[])
        : Array.isArray(class11Subjects) && class11Subjects.length > 0
          ? (class11Subjects as any[])
          : [];

    const mappedSubjects = activeSubjects.map((r) => ({
      name: r.subject || "Subject",
      marks: typeof r.marks === "number" ? r.marks : parseFloat(String(r.marks || 0)),
      max_marks: typeof r.max_marks === "number" ? r.max_marks : 100,
      interest: r.interest,
    }));

    if (mappedSubjects.length === 0 && typeof marks === "number") {
      mappedSubjects.push(
        { name: "Mathematics", marks, max_marks: 100, interest: "high" },
        { name: "English", marks, max_marks: 100, interest: "mid" },
        { name: "Science", marks, max_marks: 100, interest: "high" }
      );
    }

    const previous_examinations = previousSubjectRows.length > 0
      ? [{
          label: effectiveEducationLevel === "after-10th" ? "Class 9" : "Class 11",
          grade: effectiveEducationLevel === "after-10th" ? 9 : 11,
          subjects: previousSubjectRows.map((r) => ({
            name: r.subject || "Subject",
            marks: typeof r.marks === "number" ? r.marks : parseFloat(String(r.marks || 0)),
            max_marks: typeof r.max_marks === "number" ? r.max_marks : 100,
          })),
        }]
      : undefined;

    const interestRatings = {
      ...buildInterestsFromSubjectRows(activeSubjects, typeof interests === "string" ? interests : undefined),
      ...buildInterestsFromQuizAnswers(answers),
    };

    const payload: AnalysisInput = {
      schema_version: "1.0",
      student: {
        grade: effectiveEducationLevel === "after-10th" ? 10 : 12,
        education_level: effectiveEducationLevel || "after-12th",
        board: board || "cbse",
      },
      subjects: mappedSubjects,
      previous_examinations,
      interests: interestRatings,
      quiz_answers: answers,
    };

    return analyzeStudentProfile(payload);
  }, [currentSubjectRows, previousSubjectRows, class9Marks, class11Subjects, effectiveEducationLevel, board, interests, answers, marks]);

  // Sync to Database & Generate Share Slug
  useEffect(() => {
    if (!effectiveEducationLevel || savedRef.current) return;
    savedRef.current = true;

    const slug = generateSlug();
    const top = analysis.career_matches[0];

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await supabase.from("career_history").insert({
          user_id: session.user.id,
          education_level: effectiveEducationLevel,
          top_recommendation: top?.career ?? null,
          top_match_percent: top?.compatibility_score ?? null,
          all_recommendations: {
            algorithm_version: analysis.algorithm_version,
            _strengths: analysis.academic_analysis?.strengths.join(", ") || "Solid academic foundation",
            _streams: analysis.recommended_streams,
            analysis_snapshot: analysis,
            careers: analysis.career_matches.map((r) => ({
              stream: r.career,
              match: r.compatibility_score,
              category: r.category,
              description: r.description,
              reasons: r.positive_factors,
              careers: [r.career, ...r.suggested_subjects],
              eligibility: r.eligibility,
            })),
          },
        });
      }

      const recommendationsPayload = effectiveEducationLevel === "after-10th"
        ? {
            careers: analysis.career_matches.map((r) => ({
              stream: r.career,
              match: r.compatibility_score,
              category: r.category,
              description: r.description,
              reasons: r.positive_factors,
              careers: [r.career, ...r.suggested_subjects],
              eligibility: r.eligibility,
            })),
            streams: analysis.recommended_streams,
            analysis: analysis,
          }
        : {
            careers: analysis.career_matches.map((r) => ({
              stream: r.career,
              match: r.compatibility_score,
              category: r.category,
              description: r.description,
              reasons: r.positive_factors,
              careers: [r.career, ...r.suggested_subjects],
              eligibility: r.eligibility,
            })),
            analysis: analysis,
          };

      const { error } = await supabase.from("shared_results").insert({
        slug,
        user_id: session?.user?.id ?? null,
        education_level: effectiveEducationLevel,
        strengths: analysis.academic_analysis?.strengths.join(", ") || "Balanced academic foundation",
        recommendations: recommendationsPayload as any,
        top_recommendation: top?.career ?? null,
        top_match_percent: top?.compatibility_score ?? null,
        display_name: session?.user?.user_metadata?.full_name ?? null,
      });

      if (!error) setShareSlug(slug);
    });
  }, [effectiveEducationLevel, analysis]);

  if (!effectiveEducationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  const shareUrl = shareSlug ? `${window.location.origin}/r/${shareSlug}` : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: <span className="flex items-center gap-1">Link copied! <Link2 className="w-4 h-4 ml-1 inline-block" /></span>,
      description: "Share your results with parents, teachers, or friends.",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const studentName = session?.user?.user_metadata?.full_name || analysis.student_summary?.name || "Student";
      const stageLabel = effectiveEducationLevel === "after-10th" ? "Class 10th Guidance" : "Class 12th Guidance";

      await downloadAssessmentReportPdf(analysis, {
        studentName,
        stageLabel,
        board: (board || "CBSE").toUpperCase(),
      });
    } catch (error) {
      console.error("PDF download error:", error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO
        title="Your Personalised Career Assessment Results"
        description="Comprehensive career analysis and academic recommendations powered by the Zertainity Analysis Engine."
        canonical="/results"
        noindex
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Assessment Results", path: "/results" },
        ]}
      />
      <header className="border-b border-border/60 bg-background/95 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-7 w-7 text-primary" />
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  Assessment Complete
                </h1>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <Button
                id="results-download-pdf-btn"
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="rounded-full gap-1.5"
              >
                <Download className="h-4 w-4" />
                {downloading ? "Generating..." : "PDF Report"}
              </Button>
              <Button
                id="results-download-excel-btn"
                variant="outline"
                size="sm"
                onClick={() => downloadAnalysisExcel(analysis)}
                className="rounded-full gap-1.5"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                Excel (.xlsx)
              </Button>
              <Button
                id="results-download-json-btn"
                variant="outline"
                size="sm"
                onClick={() => downloadAnalysisJson(analysis)}
                className="rounded-full gap-1.5"
              >
                <FileCode className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                JSON
              </Button>
              {shareUrl && (
                <Button
                  id="results-share-header-btn"
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="rounded-full gap-1.5"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                  {copied ? "Copied!" : "Share"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-5xl">
        <AssessmentStepper currentStep={5} totalSteps={5} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6 space-y-8"
        >
          {/* ── Top Hero Card ── */}
          <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Zertainity Analysis Engine v{analysis.algorithm_version}
                </p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mt-1">
                  Your Personalised Career & Academic Profile
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 font-semibold rounded-full">
                  Confidence: {Math.round(analysis.confidence * 100)}%
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground max-w-3xl leading-relaxed">
              Derived through multi-criteria evaluation of academic scores, historical trajectories, stated interests, and validated prerequisites.
            </p>

            {/* ── Metrics Grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Overall Academic</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                  {analysis.academic_analysis?.overall_percentage ?? 0}%
                </p>
                <span className="text-xs text-primary font-medium">{analysis.academic_analysis?.performance_category}</span>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Consistency</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
                  {analysis.academic_analysis?.consistency_score ?? 85}/100
                </p>
                <span className="text-xs text-muted-foreground">Variance control</span>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">RIASEC Code</span>
                <p className="text-2xl sm:text-3xl font-extrabold text-primary mt-1">
                  {analysis.riasec_profile?.code || "N/A"}
                </p>
                <span className="text-xs text-muted-foreground truncate block">
                  {analysis.riasec_profile?.primary ? analysis.riasec_profile.primary.split(" ")[0] : "Take Assessment"}
                </span>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Top Match</span>
                <p className="text-xl sm:text-2xl font-extrabold text-foreground mt-1 truncate">
                  {analysis.career_matches[0]?.career || "N/A"}
                </p>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  {analysis.career_matches[0]?.compatibility_score}% Match
                </span>
              </div>
            </div>
          </div>

          {/* ── Official Download Action Banner Card ── */}
          <Card className="rounded-3xl border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-card p-6 shadow-card">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Official Assessment Report</h3>
                  <Badge variant="outline" className="text-[11px] font-mono border-primary/40 text-primary">v{analysis.algorithm_version}</Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Download your real, authoritative assessment report containing official subject marks verification, RIASEC psychometrics, career match scores, and verified university pathways.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <Button
                  id="results-banner-download-pdf"
                  size="default"
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="rounded-2xl gap-2 font-bold shadow-md text-xs h-10 px-5 flex-1 sm:flex-initial"
                >
                  <Download className="h-4 w-4" />
                  {downloading ? "Generating PDF..." : "Download PDF Report"}
                </Button>
                <Button
                  id="results-banner-download-excel"
                  variant="outline"
                  size="default"
                  onClick={() => downloadAnalysisExcel(analysis)}
                  className="rounded-2xl gap-2 text-xs h-10 px-4 border-border/80 bg-background hover:bg-muted font-medium"
                >
                  <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  Excel (.xlsx)
                </Button>
                <Button
                  id="results-banner-download-json"
                  variant="outline"
                  size="default"
                  onClick={() => downloadAnalysisJson(analysis)}
                  className="rounded-2xl gap-2 text-xs h-10 px-4 border-border/80 bg-background hover:bg-muted font-medium"
                >
                  <FileCode className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  JSON Data
                </Button>
              </div>
            </div>
          </Card>

          {/* ── Tabs Navigation for Deep Analysis ── */}
          <Tabs defaultValue="careers" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1.5 bg-muted/50 rounded-2xl mb-6">
              <TabsTrigger value="careers" className="rounded-xl py-2.5 font-semibold text-xs sm:text-sm">
                Career Matches ({analysis.career_matches.length})
              </TabsTrigger>
              <TabsTrigger value="academic" className="rounded-xl py-2.5 font-semibold text-xs sm:text-sm">
                Academics & Trends
              </TabsTrigger>
              <TabsTrigger value="pathways" className="rounded-xl py-2.5 font-semibold text-xs sm:text-sm">
                Courses & Colleges
              </TabsTrigger>
              <TabsTrigger value="insights" className="rounded-xl py-2.5 font-semibold text-xs sm:text-sm">
                Diagnostic Insights ({analysis.insights.length})
              </TabsTrigger>
            </TabsList>

            {/* ── TAB 1: CAREER MATCHES ── */}
            <TabsContent value="careers" className="space-y-6">
              {/* 10th Grade Stream Recommendations if applicable */}
              {effectiveEducationLevel === "after-10th" && analysis.recommended_streams && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">Recommended Senior Secondary Streams</h3>
                    <p className="text-muted-foreground text-sm">Class 11 & 12 stream suitability based on 9th/10th marks vectors.</p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {analysis.recommended_streams.map((stream, idx) => {
                      const isTop = idx === 0;
                      return (
                        <Card
                          key={stream.stream_name}
                          className={`shadow-card border-border/60 ${
                            isTop
                              ? "border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 ring-1 ring-primary/20 md:col-span-2"
                              : ""
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center gap-2">
                                  <CardTitle className="text-xl font-bold">{stream.stream_name}</CardTitle>
                                  {isTop && <Badge className="bg-primary text-primary-foreground text-xs">Top Match</Badge>}
                                </div>
                                <CardDescription className="text-xs mt-1">{stream.subjects.join(" · ")}</CardDescription>
                              </div>
                              <div className="text-right">
                                <span className="text-lg font-extrabold text-primary">{stream.match_score}%</span>
                                <span className="text-xs block text-muted-foreground">{stream.match_level}</span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground leading-relaxed">{stream.suitability_analysis}</p>
                            <div className="text-xs text-muted-foreground">
                              <strong>Why this fits:</strong>
                              <ul className="list-disc pl-4 mt-1 space-y-0.5">
                                {stream.reasons.map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="text-xs text-primary font-semibold pt-2 border-t border-border/40">
                              Aligned Careers: {stream.careers.join(", ")}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Career Recommendations List */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">Ranked Career Compatibility</h3>
                    <p className="text-muted-foreground text-sm">Deterministic multi-factor score (Academics 40%, Interests 25%, Skills 20%, Aptitude 10%, Preferences 5%).</p>
                  </div>
                </div>

                {/* 4-Stage Transparent Recommendation Pipeline Visualizer */}
                <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Compass className="h-5 w-5 text-primary" />
                    <h4 className="font-bold text-sm sm:text-base text-foreground">
                      Transparent Recommendation Pipeline
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
                      <span className="font-bold text-primary block">1. INPUTS</span>
                      <p className="text-muted-foreground">
                        {analysis.academic_analysis?.subject_count ?? 0} Subjects ({analysis.academic_analysis?.overall_percentage ?? 0}%) + RIASEC {analysis.riasec_profile?.code || "Profile"}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
                      <span className="font-bold text-primary block">2. NORMALIZATION</span>
                      <p className="text-muted-foreground">
                        Standardized to continuous 0–100% scale; board variance normalized.
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
                      <span className="font-bold text-primary block">3. CAREER MATCH</span>
                      <p className="text-muted-foreground">
                        MCDA weighting (40% Acad, 25% Int, 20% Skill, 10% Apt, 5% Pref).
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-1">
                      <span className="font-bold text-primary block">4. PATHWAY</span>
                      <p className="text-muted-foreground">
                        Verified entrance exams, university options & multi-route timelines.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {analysis.career_matches.map((c, idx) => {
                    const careerSaved = isSaved(c.career_slug || c.career);
                    return (
                      <Card key={c.career} className="shadow-card border-border/60 hover:border-primary/40 transition-colors">
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-xl font-bold">{idx + 1}. {c.career}</CardTitle>
                                <Badge variant="outline" className="text-xs">{c.category}</Badge>
                              </div>
                              <CardDescription className="text-sm mt-1">{c.description}</CardDescription>
                            </div>
                            <div className="flex items-center sm:flex-col sm:items-end gap-2">
                              <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1 font-bold">
                                {c.compatibility_score}% Match
                              </Badge>
                              <Badge
                                variant="outline"
                                className={`text-xs ${
                                  c.eligibility.status === "verified"
                                    ? "text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                    : "text-amber-600 dark:text-amber-400 border-amber-500/30"
                                }`}
                              >
                                Eligibility: {c.eligibility.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Personalized Stream Guidance Callout */}
                          {c.personalized_stream_guidance && (
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                              <strong className="text-primary font-semibold flex items-center gap-1 mb-1">
                                <Compass className="h-3.5 w-3.5" />
                                Personalized Stream Alignment:
                              </strong>
                              {c.personalized_stream_guidance}
                            </div>
                          )}

                          {/* Factor Breakdown Trace Table */}
                          {c.explanations && c.explanations.length > 0 && (
                            <div className="rounded-xl border border-border/70 bg-muted/20 p-3.5 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                                  Factor Breakdown & Contribution (Why this career?)
                                </span>
                                <span className="text-[11px] text-muted-foreground font-mono">
                                  MCDA Trace
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-border/60 text-muted-foreground text-left">
                                      <th className="pb-1.5 font-semibold">Factor</th>
                                      <th className="pb-1.5 font-semibold">Your Score</th>
                                      <th className="pb-1.5 font-semibold">Weight</th>
                                      <th className="pb-1.5 font-semibold">Contribution</th>
                                      <th className="pb-1.5 font-semibold">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-border/40">
                                    {c.explanations.map((exp, expIdx) => (
                                      <tr key={expIdx} className="hover:bg-muted/40 transition-colors">
                                        <td className="py-1.5 font-medium text-foreground">{exp.factor}</td>
                                        <td className="py-1.5 text-muted-foreground font-mono">{exp.inputValue}</td>
                                        <td className="py-1.5 text-muted-foreground font-mono">{exp.weightPercentage}%</td>
                                        <td className="py-1.5 font-semibold text-primary font-mono">+{exp.weightedContribution}</td>
                                        <td className="py-1.5">
                                          <Badge
                                            variant="outline"
                                            className={cn(
                                              "text-[10px] px-1.5 py-0",
                                              exp.status === "Strong Positive"
                                                ? "text-emerald-700 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                                                : exp.status === "Positive"
                                                ? "text-primary border-primary/30 bg-primary/5"
                                                : exp.status === "Development Area"
                                                ? "text-amber-700 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
                                                : "text-muted-foreground"
                                            )}
                                          >
                                            {exp.status}
                                          </Badge>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div className="pt-2 border-t border-border/40 space-y-1 text-[11px] text-muted-foreground">
                                {c.explanations.slice(0, 3).map((exp, i) => (
                                  <p key={i} className="leading-snug">
                                    <strong className="text-foreground">{exp.factor}:</strong> {exp.explanation}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Positive & Development Factors */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                            <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-3">
                              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 mb-1.5">
                                <ShieldCheck className="h-4 w-4" /> Supporting Evidence & Strengths
                              </span>
                              <ul className="space-y-1 pl-4 list-disc text-muted-foreground">
                                {c.positive_factors.map((f, i) => (
                                  <li key={i}>{f}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                              <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-1.5">
                                <AlertTriangle className="h-4 w-4" /> Actionable Next Steps
                              </span>
                              <ul className="space-y-1 pl-4 list-disc text-muted-foreground">
                                {c.next_steps.slice(0, 2).map((s, i) => (
                                  <li key={i}>{s}</li>
                                ))}
                                {c.eligibility.missing_requirements.length > 0 && (
                                  <li className="text-amber-600 dark:text-amber-400">
                                    Verify prerequisite: {c.eligibility.missing_requirements.join(", ")}
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>

                          {/* Pathways & Courses Footer */}
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pt-3 border-t border-border/40">
                            <div className="text-xs text-muted-foreground">
                              <strong>Recommended Courses:</strong> {(c.recommended_courses || []).slice(0, 3).join(", ") || "Undergraduate degree in domain"}
                            </div>
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <Button
                                id={`results-save-career-${c.career_slug || idx}-btn`}
                                variant={careerSaved ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                  "rounded-full gap-1.5 text-xs shrink-0 transition-all h-8 px-3.5",
                                  careerSaved
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "border-border/70 hover:bg-muted text-foreground"
                                )}
                                onClick={() =>
                                  toggleSaveCareer({
                                    slug: c.career_slug,
                                    title: c.career,
                                    category: c.category,
                                  })
                                }
                              >
                                <Bookmark className={cn("h-3.5 w-3.5", careerSaved && "fill-current")} />
                                {careerSaved ? "Saved" : "Save Career"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full gap-1.5 text-xs shrink-0 h-8 px-3.5 border-border/70"
                                onClick={() => navigate(`/careers/${c.career_slug}`)}
                              >
                                Roadmap <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            {/* ── TAB 2: ACADEMICS & TRENDS ── */}
            <TabsContent value="academic" className="space-y-6">
              {/* Subject Breakdown Card */}
              <Card className="shadow-card border-border/60">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" /> Subject Scores & Rankings
                  </CardTitle>
                  <CardDescription>
                    Normalized scores, percentiles, and subject-level proficiency classification.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/60 text-muted-foreground text-left text-xs uppercase">
                          <th className="pb-3 font-semibold">Rank</th>
                          <th className="pb-3 font-semibold">Subject</th>
                          <th className="pb-3 font-semibold">Marks</th>
                          <th className="pb-3 font-semibold">Percentage</th>
                          <th className="pb-3 font-semibold">Classification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {analysis.subject_analysis.map((s) => (
                          <tr key={s.name} className="hover:bg-muted/20 transition-colors">
                            <td className="py-3 font-bold text-muted-foreground">#{s.rank}</td>
                            <td className="py-3 font-semibold text-foreground">{s.name}</td>
                            <td className="py-3 text-muted-foreground">{s.marks} / {s.max_marks}</td>
                            <td className="py-3 font-bold text-primary">{s.percentage}%</td>
                            <td className="py-3">
                              <Badge
                                variant="outline"
                                className={
                                  s.percentage >= 80
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : s.percentage >= 65
                                      ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                      : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                }
                              >
                                {s.category}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Historical Trend Card */}
              <Card className="shadow-card border-border/60">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" /> Historical Semester Trends
                  </CardTitle>
                  <CardDescription>
                    Tracking academic trajectory across examination periods.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {analysis.trend_analysis.trend_status === "available" ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                          <span className="text-xs text-muted-foreground">Overall Delta</span>
                          <p className="text-lg font-bold mt-0.5 text-foreground">
                            {analysis.trend_analysis.overall_change && analysis.trend_analysis.overall_change > 0 ? "+" : ""}
                            {analysis.trend_analysis.overall_change} pts
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                          <span className="text-xs text-muted-foreground">Trajectory</span>
                          <p className="text-lg font-bold mt-0.5 capitalize text-primary">
                            {analysis.trend_analysis.direction}
                          </p>
                        </div>
                        <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
                          <span className="text-xs text-muted-foreground">Consistency</span>
                          <p className="text-lg font-bold mt-0.5 text-foreground">
                            {analysis.trend_analysis.consistency}/100
                          </p>
                        </div>
                      </div>

                      <div className="divide-y divide-border/40 border border-border/60 rounded-xl overflow-hidden">
                        {(analysis.trend_analysis.subjects || []).map((t) => (
                          <div key={t.name} className="flex justify-between items-center p-3 text-sm">
                            <span className="font-semibold text-foreground">{t.name}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{t.earlier_score}% → {t.recent_score}%</span>
                              <Badge
                                variant="outline"
                                className={
                                  t.change > 0
                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                    : t.change < 0
                                      ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
                                      : "bg-muted text-muted-foreground"
                                }
                              >
                                {t.change > 0 ? `+${t.change}` : t.change} pts
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      Historical multi-semester comparison is available when marks from both Class 9 & 10 or Class 11 & 12 are recorded.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── TAB 3: COURSES & COLLEGES ── */}
            <TabsContent value="pathways" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Course Recommendations */}
                <Card className="shadow-card border-border/60">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Compass className="h-5 w-5 text-primary" /> Recommended Degrees & Courses
                    </CardTitle>
                    <CardDescription>
                      Degree programs derived from your top matching career pathways.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.course_recommendations.map((cr) => (
                      <div key={cr.course} className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
                        <span className="font-bold text-foreground block text-sm">{cr.course}</span>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          Aligned with: {cr.based_on_careers.join(", ")}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Verified Colleges */}
                <Card className="shadow-card border-border/60">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" /> Verified Premier Institutions
                    </CardTitle>
                    <CardDescription>
                      Accredited national institutions offering matched course programs.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {analysis.college_recommendations.map((col) => (
                      <div key={col.id} className="rounded-xl border border-border/60 bg-muted/20 p-3.5">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-foreground text-sm">{col.name}</span>
                          {col.rank && <Badge variant="outline" className="text-xs">{col.rank}</Badge>}
                        </div>
                        <span className="text-xs text-muted-foreground block mt-0.5">{col.location}</span>
                        <div className="text-xs text-primary mt-1.5 font-medium">
                          {col.matched_courses.slice(0, 2).join(" · ")}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ── TAB 4: DIAGNOSTIC INSIGHTS ── */}
            <TabsContent value="insights" className="space-y-6">
              <Card className="shadow-card border-border/60">
                <CardHeader>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" /> Evidence-Based Diagnostic Insights
                  </CardTitle>
                  <CardDescription>
                    Actionable insights computed from cross-correlations in your scores and declared interests.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analysis.insights.map((ins, idx) => (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-4 ${
                        ins.type === "strength"
                          ? "bg-emerald-500/5 border-emerald-500/20"
                          : ins.type === "alignment"
                            ? "bg-primary/5 border-primary/20"
                            : ins.type === "trend"
                              ? "bg-blue-500/5 border-blue-500/20"
                              : "bg-amber-500/5 border-amber-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary" />
                        <span className="font-bold text-sm text-foreground">{ins.title}</span>
                      </div>
                      <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                        {ins.evidence.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* ── Shareable Link Card ── */}
          {shareUrl && (
            <Card className="shadow-card border-primary/20 bg-primary/5 dark:bg-primary/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Link2 className="h-5 w-5 text-primary" />
                  Share Your Verified Results
                </CardTitle>
                <CardDescription>
                  Anyone with this link can view your career report — no login required.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 bg-background rounded-lg border border-border/60 px-3 py-2.5 text-sm">
                  <span className="text-muted-foreground flex-1 truncate font-mono text-xs">{shareUrl}</span>
                  <Button
                    id="results-copy-link-btn"
                    size="sm"
                    variant={copied ? "default" : "outline"}
                    onClick={handleCopy}
                    className={`shrink-0 rounded-md gap-1.5 transition-all ${
                      copied ? "bg-green-500 hover:bg-green-500 text-white border-green-500" : ""
                    }`}
                  >
                    {copied ? <><Check className="h-3.5 w-3.5" /> Copied!</> : <><Copy className="h-3.5 w-3.5" /> Copy Link</>}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <a
                    id="results-share-whatsapp"
                    href={`https://wa.me/?text=${encodeURIComponent(`🎓 Check out my Zertainity career analysis results! ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 hover:bg-muted/40 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <a
                    id="results-share-twitter"
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just discovered my career path with Zertainity! 🎓✨`)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 hover:bg-muted/40 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Twitter / X
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ── Bottom CTA Card ── */}
          <Card className="shadow-card bg-primary text-center border-0">
            <CardHeader>
              <CardTitle className="text-primary-foreground text-2xl">Ready to Start Your Journey?</CardTitle>
              <CardDescription className="text-primary-foreground/80">
                Export your analysis or explore career roadmap guides to take your next step.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 justify-center items-center">
              <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
                Back to Home
              </Button>
              <Button
                id="results-download-pdf-bottom"
                variant="outline"
                size="lg"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent gap-2"
              >
                <Download className="h-4 w-4" />
                {downloading ? "Preparing PDF..." : "Download PDF Report"}
              </Button>
              <Button
                id="results-download-excel-bottom"
                variant="outline"
                size="lg"
                onClick={() => downloadAnalysisExcel(analysis)}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent gap-2"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Download Excel (.xlsx)
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Results;
