import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSetCurves } from "@/components/CurvesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles, TrendingUp, Share2, Check, Copy, Link2, Download, Gamepad2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { AssessmentStepper } from "@/components/AssessmentStepper";
import { motion } from "framer-motion";
import {
  assessCareer,
  buildInterestsFromQuizAnswers,
  buildInterestsFromSubjectRows,
  buildMarksFromSubjectRows,
} from "@/lib/assessmentEngine";

/* ── Share slug: cryptographically stronger than Math.random (unguessable links) ── */
const generateSlug = (len = 12) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

type ResultsLocationState = {
  educationLevel?: string;
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
  
  useEffect(() => {
    setCurves([
      { d: "M -160 200 C -40 140, 100 120, 300 160 S 580 260, 880 200", strokeOpacity: 0.13, strokeWidth: 5 },
      { d: "M -160 200 C -40 140, 100 120, 300 160 S 580 260, 880 200", strokeOpacity: 0.44, strokeWidth: 1.4 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

  const subjectRows = useMemo(() => [
    ...(Array.isArray(class9Marks) ? class9Marks : []),
    ...(Array.isArray(class10Marks) ? class10Marks : []),
    ...(Array.isArray(class11Subjects) ? class11Subjects : []),
    ...(Array.isArray(class12Subjects) ? class12Subjects : []),
  ], [class10Marks, class11Subjects, class12Subjects, class9Marks]);

  const assessment = useMemo(() => {
    const academicMarks = buildMarksFromSubjectRows(subjectRows, board);
    const interestRatings = {
      ...buildInterestsFromSubjectRows(subjectRows, typeof interests === "string" ? interests : undefined),
      ...buildInterestsFromQuizAnswers(answers),
    };

    if (typeof marks === "number" && !Object.keys(academicMarks).length) {
      academicMarks.Mathematics = marks;
      academicMarks.English = marks;
      academicMarks["General Knowledge"] = marks;
    }

    return assessCareer({
      marks: academicMarks,
      interests: interestRatings,
      topN: 5,
    });
  }, [answers, subjectRows, interests, marks]);

  const strengths = assessment.strengths;
  const recommendations = assessment.recommendations;

  useEffect(() => {
    if (!effectiveEducationLevel || savedRef.current) return;
    savedRef.current = true;

    const slug = generateSlug();
    const top = recommendations[0];

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // 1. Save career history (logged-in users only)
      if (session?.user) {
        await supabase.from("career_history").insert({
          user_id: session.user.id,
          education_level: effectiveEducationLevel,
          top_recommendation: top?.stream ?? null,
          top_match_percent: top?.match ?? null,
          all_recommendations: {
            _strengths: strengths,
            _streams: effectiveEducationLevel === "after-10th" ? assessment.recommendedStreams : undefined,
            careers: recommendations.map(r => ({
              stream: r.stream,
              match: r.match,
              category: r.category,
              description: r.description,
              reasons: r.reasons,
              careers: r.careers,
            })),
          },
        });
      }

      // 2. Save shareable result (works for guests too)
      const recommendationsPayload = effectiveEducationLevel === "after-10th"
        ? { careers: recommendations, streams: assessment.recommendedStreams }
        : recommendations;

      const { error } = await supabase.from("shared_results").insert({
        slug,
        user_id: session?.user?.id ?? null,
        education_level: effectiveEducationLevel,
        strengths,
        recommendations: recommendationsPayload as any,
        top_recommendation: top?.stream ?? null,
        top_match_percent: top?.match ?? null,
        display_name: session?.user?.user_metadata?.full_name ?? null,
      });

      if (!error) setShareSlug(slug);
    });
  }, [effectiveEducationLevel, recommendations, strengths, assessment]);

  if (!effectiveEducationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  const shareUrl = shareSlug ? `${window.location.origin}/r/${shareSlug}` : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: <span className="flex items-center gap-1">Link copied! <Link2 className="w-4 h-4 ml-1 inline-block" /></span>, description: "Share it with friends, parents or teachers." });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const studentName = session?.user?.user_metadata?.full_name || "Student";
      const dateString = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const educationLabel = effectiveEducationLevel === "after-10th" ? "After 10th" : "After 12th";
      const validSubjectRows = subjectRows.filter(row => row.subject && row.marks);

      let faviconBase64 = '';
      try {
        const favResp = await fetch('/favicon.png');
        if (favResp.ok) {
          const favBlob = await favResp.blob();
          faviconBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(favBlob);
          });
        }
      } catch (e) {
        console.warn('Failed to load favicon', e);
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="author" content="Zertainity">
          <meta name="description" content="Career Assessment Report - ${studentName}">
          <meta name="keywords" content="career, assessment, guidance, zertainity, student, ${educationLabel}">
          <meta name="generator" content="Zertainity Assessment Engine">
          <title>Zertainity Career Assessment Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
            
            :root {
              --brand: #0ea5a4;
              --muted: #6b7280;
            }
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
              color: #111827;
              margin: 0;
              padding: 0;
              position: relative;
            }
            
            /* Watermark CSS styling */
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-30deg);
              font-size: 72px;
              font-weight: 900;
              color: rgba(14, 165, 164, 0.05); /* Brand color at 5% opacity */
              z-index: -1000;
              pointer-events: none;
              white-space: nowrap;
              user-select: none;
              letter-spacing: 4px;
            }

            header {
              border-bottom: 2px solid var(--brand);
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            
            /* Using table for header layout to ensure 100% WeasyPrint compatibility */
            .header-table {
              width: 100%;
              border-collapse: collapse;
              border: none;
            }
            .header-table td {
              border: none;
              padding: 0;
              vertical-align: middle;
            }
            
            .logo-container {
              display: inline-block;
            }
            .logo-img {
              width: 40px;
              height: 40px;
              border-radius: 8px;
              display: inline-block;
              vertical-align: middle;
              margin-right: 12px;
            }
            .logo-text-wrapper {
              display: inline-block;
              vertical-align: middle;
            }
            .logo-title {
              font-size: 24px;
              color: var(--brand);
              font-weight: 700;
              margin: 0;
              line-height: 1.2;
            }
            .logo-sub {
              color: var(--muted);
              font-size: 12px;
              margin: 0;
            }
            
            .header-right {
              text-align: right;
            }
            .header-right h1 {
              margin: 0;
              font-size: 18px;
              color: #374151;
            }
            .header-right .meta {
              color: var(--muted);
              font-size: 12px;
              margin-top: 4px;
            }

            .section {
              margin-top: 24px;
            }
            .section-title {
              font-weight: bold;
              font-size: 14px;
              color: #111827;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 10px;
            }
            
            .student-info {
              font-size: 14px;
              margin-bottom: 16px;
            }
            
            /* Cards layout using table for reliability in PDF engines */
            .cards-table {
              width: 100%;
              border-collapse: collapse;
              border: none;
              margin-top: 12px;
            }
            .cards-table td {
              border: none;
              padding: 0;
              width: 50%;
            }
            .card {
              border: 1px solid #e5e7eb;
              padding: 16px;
              border-radius: 8px;
              min-height: 90px;
              background: #ffffff;
            }
            .card-left {
              margin-right: 10px;
            }
            .card-right {
              margin-left: 10px;
            }
            .card strong {
              font-size: 13px;
              color: #374151;
            }
            .card-score {
              font-size: 28px;
              font-weight: bold;
              margin-top: 8px;
              color: var(--brand);
            }
            .card-meta {
              color: var(--muted);
              font-size: 12px;
              margin-top: 6px;
            }

            /* Score Table styling */
            .scores-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            .scores-table th {
              text-align: left;
              padding: 8px 12px;
              border-bottom: 2px solid #e5e7eb;
              color: #4b5563;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              background: #f9fafb;
            }
            .scores-table td {
              text-align: left;
              padding: 10px 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
            }

            /* Recommendation list styling */
            .recommendations-wrapper {
              margin-top: 12px;
            }
            .rec {
              background: #f8fafc;
              border-left: 4px solid var(--brand);
              padding: 14px;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 13.5px;
              line-height: 1.5;
              page-break-inside: avoid;
            }
            .rec-title {
              font-weight: bold;
              color: #111827;
              margin-bottom: 4px;
            }
            .rec-match {
              color: var(--brand);
              font-weight: bold;
              float: right;
            }
            .rec-category {
              color: var(--muted);
              font-size: 12px;
              margin-bottom: 6px;
            }
            .rec ul {
              margin: 8px 0;
              padding-left: 18px;
            }
            .rec li {
              margin: 4px 0;
              font-size: 12.5px;
              color: #374151;
            }
            
            footer {
              margin-top: 40px;
              font-size: 11px;
              color: var(--muted);
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="watermark">zertainity.in</div>

          <header>
            <table class="header-table">
              <tr>
                <td>
                  <div class="logo-container">
                    ${faviconBase64 ? `<img src="${faviconBase64}" class="logo-img" alt="Logo" />` : '<div class="logo-img" style="background:#0ea5a4;"></div>'}
                    <div class="logo-text-wrapper">
                      <h1 class="logo-title">Zertainity</h1>
                      <p class="logo-sub">zertainity.in</p>
                    </div>
                  </div>
                </td>
                <td class="header-right">
                  <h1>Assessment Report</h1>
                  <div class="meta">Generated: ${dateString}</div>
                </td>
              </tr>
            </table>
          </header>

          <div class="student-info">
            <strong>Student:</strong> ${studentName} &nbsp; | &nbsp; <strong>Level:</strong> ${educationLabel}
          </div>

          <div class="section">
            <table class="cards-table">
              <tr>
                <td>
                  <div class="card card-left">
                    <strong>Overall Match</strong>
                    <div class="card-score">${recommendations[0]?.match || 0}%</div>
                    <div class="card-meta">Top suggested career: ${recommendations[0]?.stream || 'N/A'}</div>
                  </div>
                </td>
                <td>
                  <div class="card card-right">
                    <strong>${effectiveEducationLevel === 'after-10th' ? 'Recommended Streams' : 'Top Career Paths'}</strong>
                    <ul style="margin: 8px 0 0 16px; padding: 0; color: #4b5563; font-size: 12.5px; line-height: 1.4;">
                      ${effectiveEducationLevel === 'after-10th'
                        ? (assessment.recommendedStreams || []).slice(0, 2).map(s => `<li>${s.streamName} (${s.matchScore}% Match)</li>`).join('')
                        : recommendations.slice(0, 2).map(r => `<li>${r.stream} (${r.match}% Match)</li>`).join('')
                      }
                    </ul>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Your Strengths</div>
            <p style="font-size: 13.5px; line-height: 1.5; margin: 6px 0;">${strengths}</p>
          </div>

          ${validSubjectRows.length > 0 ? `
          <div class="section">
            <div class="section-title">Subject Scores & Interests</div>
            <table class="scores-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Interest Level</th>
                </tr>
              </thead>
              <tbody>
                ${validSubjectRows.map(row => `
                  <tr>
                    <td>${row.subject}</td>
                    <td>${row.marks}</td>
                    <td style="text-transform: capitalize;">${row.interest || 'Medium'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${effectiveEducationLevel === "after-10th" && assessment.recommendedStreams ? `
          <div class="section">
            <div class="section-title">Recommended High School Streams (Class 11 & 12)</div>
            <div class="recommendations-wrapper">
              ${assessment.recommendedStreams.map((stream, idx) => `
                <div class="rec" style="${idx === 0 ? 'border-left-color: #0ea5a4; background: #f0fdfa;' : 'border-left-color: #6b7280;'}">
                  <div class="rec-title">
                    ${stream.streamName}
                    <span class="rec-match">${stream.matchScore}% Match (${stream.matchLevel})</span>
                  </div>
                  <div class="rec-category">Core Subjects: ${stream.subjects.join(' · ')}</div>
                  <p style="margin: 6px 0;">${stream.suitabilityAnalysis}</p>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Why this fits:</strong></div>
                  <ul style="margin: 4px 0; padding-left: 18px;">
                    ${stream.reasons.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Potential Careers:</strong> ${stream.careers.join(', ')}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Recommended Career Paths</div>
            <div class="recommendations-wrapper">
              ${recommendations.map((rec, index) => `
                <div class="rec" style="${index === 0 ? 'border-left-color: #0ea5a4; background: #f8fafc;' : 'border-left-color: #6b7280;'}">
                  <div class="rec-title">
                    ${index + 1}. ${rec.stream}
                    <span class="rec-match">${rec.match}% Match</span>
                  </div>
                  <div class="rec-category">${rec.category}</div>
                  <p style="margin: 6px 0;">${rec.description}</p>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Why this fits:</strong></div>
                  <ul style="margin: 4px 0; padding-left: 18px;">
                    ${(rec.reasons || []).map(r => `<li>${r}</li>`).join('')}
                  </ul>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Career options:</strong> ${(rec.careers || []).join(', ')}</div>
                </div>
              `).join('')}
            </div>
          </div>

          ${shareUrl ? `
          <div class="section">
            <div class="section-title">Shareable Result Link</div>
            <p style="color: #0ea5a4; font-size: 13.5px; word-break: break-all; margin: 4px 0;">${shareUrl}</p>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Important Note</div>
            <p style="font-size: 13px; line-height: 1.5; color: #4b5563; margin: 6px 0;">This report is guidance-oriented and should be used alongside discussions with parents, teachers, counsellors, and official admission or exam sources.</p>
          </div>

          <footer>
            This report is generated by Zertainity's assessment engine. Use it as guidance alongside counselling and academic advice.
          </footer>
        </body>
        </html>
      `;

      const pdfFilename = `zertainity-career-assessment-${new Date().toISOString().slice(0, 10)}.pdf`;
      
      const { data: blob, error: functionError } = await supabase.functions.invoke('generate-pdf', {
        body: {
          html: htmlContent,
          author: 'Zertainity',
          subject: `Career Assessment Report - ${studentName}`,
          keywords: `career, assessment, guidance, zertainity, student, ${educationLabel}`,
          producer: 'Zertainity PDF Engine v1.0',
          filename: pdfFilename,
        }
      });

      if (functionError || !blob) {
        throw new Error(functionError?.message || 'PDF generation service failed');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: "PDF downloaded", description: "Your assessment report has been saved." });
    } catch (error) {
      console.error("PDF service failed, trying client-side fallback:", error);
      try {
        const { generatePdfFallback } = await import('@/utils/pdfGenerator');
        await generatePdfFallback(htmlContent, pdfFilename);
      } catch (fallbackError) {
        console.error("Client-side fallback PDF generation failed:", fallbackError);
        toast({ title: "Download failed", description: "Unable to generate the PDF. Make sure a backend service is running or check browser capabilities.", variant: "destructive" });
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO 
        title="Your Personalised Career Results"
        description="Personalised career recommendations based on your subjects, interests, and assessment responses."
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
                id="results-download-header-btn"
                variant="outline"
                size="sm"
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="rounded-full gap-2"
              >
                <Download className="h-4 w-4" />
                {downloading ? "Preparing..." : "Download PDF"}
              </Button>
              {shareUrl && (
              <Button
                id="results-share-header-btn"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-full gap-2"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Results"}
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
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="mt-6"
        >
        <div className="mb-8 rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-card">
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Career assessment report</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">Your personalised career path</h2>
          <p className="text-muted-foreground max-w-2xl">
            Based on your academic performance and assessment responses, here are our recommendations
          </p>
        </div>

        <Card className="shadow-card mb-8 border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{strengths}</p>
          </CardContent>
        </Card>

        {effectiveEducationLevel === "after-10th" && assessment.recommendedStreams && (
          <div className="mb-8 space-y-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary mb-2">Academic Guidance</p>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">Recommended high school streams</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Based on your Class 9 & 10 marks trend and interest mapping, here are the most suitable streams for your senior secondary education (Class 11 & 12).
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {assessment.recommendedStreams.map((stream, idx) => {
                const isTop = idx === 0;
                return (
                  <Card 
                    key={stream.streamName} 
                    className={`shadow-card border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      isTop 
                        ? "border-primary/40 bg-gradient-to-br from-card via-card to-primary/5 ring-1 ring-primary/20 md:col-span-2" 
                        : "hover:border-primary/30"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-xl leading-none font-semibold tracking-tight">
                              {stream.streamName}
                            </CardTitle>
                            {isTop && (
                              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full font-medium">
                                Best Match
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-1.5 text-xs text-muted-foreground">
                            {stream.subjects.join(" · ")}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            stream.matchLevel === "High Match" 
                              ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                              : stream.matchLevel === "Moderate Match"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-muted text-muted-foreground"
                          }`}>
                            {stream.matchLevel}
                          </span>
                          <span className="text-lg font-bold text-primary">{stream.matchScore}%</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {stream.suitabilityAnalysis}
                      </p>
                      
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Why this stream fits you
                        </h4>
                        <ul className="space-y-1.5 pl-4">
                          {stream.reasons.map((reason, rIdx) => (
                            <li key={rIdx} className="text-xs text-muted-foreground list-disc leading-normal">
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-border/40">
                        <span className="text-xs font-medium text-foreground">Opens careers like:</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {stream.careers.map((career) => (
                            <Badge key={career} variant="secondary" className="text-xs font-normal">
                              {career}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-semibold tracking-tight mb-6">Recommended career paths</h3>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="shadow-card border-border/60 transition-colors hover:border-primary/40">
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1 leading-snug">{rec.stream}</CardTitle>
                      <CardDescription className="text-base">{rec.category}</CardDescription>
                    </div>
                    <Badge className="w-fit rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10">
                      {rec.match}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{rec.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Why this fits you
                    </h4>
                    <ul className="space-y-1 ml-6">
                      {rec.reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground list-disc">{reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Career options</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.careers.map((career, idx) => (
                        <Badge key={idx} variant="secondary">{career}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                    <h4 className="font-semibold mb-2">Recommended next steps</h4>
                    <ul className="space-y-1 ml-6">
                      {rec.nextSteps.slice(0, 3).map((step, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground list-disc">{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Best Colleges Nearby</h4>
                      <ul className="space-y-1 ml-5">
                        {(rec.topColleges || []).map((college: string) => (
                          <li key={college} className="text-sm text-muted-foreground list-disc">{college}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Recommended Courses</h4>
                      <ul className="space-y-1 ml-5">
                        {(rec.recommendedCourses || []).map((course: string) => (
                          <li key={course} className="text-sm text-muted-foreground list-disc">{course}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Suggested subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.suggestedSubjects.map((subject: string) => (
                          <Badge key={subject} variant="outline">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4 flex flex-col justify-between items-start">
                      <div>
                        <h4 className="font-semibold mb-2">Official pathway basis</h4>
                        <ul className="space-y-1 ml-5 mb-4">
                          {rec.officialPathways.slice(0, 2).map((pathway: string) => (
                            <li key={pathway} className="text-sm text-muted-foreground list-disc">{pathway}</li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        variant="default"
                        size="sm"
                        className="mt-2 w-full gap-2"
                        onClick={() => navigate(`/careers/${rec.stream.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
                      >
                        View Career Roadmap <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Shareable Link Card ── */}
        {shareUrl && (
          <Card className="shadow-card mb-6 border-primary/20 bg-primary/5 dark:bg-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-5 w-5 text-primary" />
                Share Your Results
              </CardTitle>
              <CardDescription>
                Anyone with this link can view your career recommendations — no login required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* URL display box */}
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
                  {copied ? (
                    <><Check className="h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy Link</>
                  )}
                </Button>
              </div>
              {/* Share via buttons */}
              <div className="flex flex-wrap gap-2">
                <a
                  id="results-share-whatsapp"
                  href={`https://wa.me/?text=${encodeURIComponent(`🎓 Check out my Zertainity career results! ${shareUrl}`)}`}
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

        <Card className="shadow-card bg-primary text-center border-0">
          <CardHeader>
            <CardTitle className="text-primary-foreground text-2xl">Ready to Start Your Journey?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Take the next step towards your future. Research these paths and talk to your teachers and counselors.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button
              id="results-download-mobile-btn"
              variant="outline"
              size="lg"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="border-white/30 text-white hover:bg-white/10 bg-transparent gap-2"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Preparing PDF..." : "Download PDF"}
            </Button>
            {shareUrl && (
              <Button
                id="results-share-mobile-btn"
                variant="outline"
                size="lg"
                onClick={handleCopy}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Results"}
              </Button>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Results;
