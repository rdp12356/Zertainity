import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles, TrendingUp, Share2, Check, Copy, Link2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { AdUnit } from "@/components/AdUnit";
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

  const assessment = useMemo(() => {
    const subjectRows = [
      ...(Array.isArray(class9Marks) ? class9Marks : []),
      ...(Array.isArray(class10Marks) ? class10Marks : []),
      ...(Array.isArray(class11Subjects) ? class11Subjects : []),
      ...(Array.isArray(class12Subjects) ? class12Subjects : []),
    ];
    const academicMarks = buildMarksFromSubjectRows(subjectRows);
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
  }, [answers, class10Marks, class11Subjects, class12Subjects, class9Marks, interests, marks]);

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
          all_recommendations: recommendations.map(r => ({ stream: r.stream, match: r.match, category: r.category })),
        });
      }

      // 2. Save shareable result (works for guests too)
      const { error } = await supabase.from("shared_results").insert({
        slug,
        user_id: session?.user?.id ?? null,
        education_level: effectiveEducationLevel,
        strengths,
        recommendations,
        top_recommendation: top?.stream ?? null,
        top_match_percent: top?.match ?? null,
        display_name: session?.user?.user_metadata?.full_name ?? null,
      });

      if (!error) setShareSlug(slug);
    });
  }, [effectiveEducationLevel, recommendations, strengths]);

  if (!effectiveEducationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  const shareUrl = shareSlug ? `${window.location.origin}/r/${shareSlug}` : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied! 🔗", description: "Share it with friends, parents or teachers." });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);

    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Zertainity Career Assessment Report</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1e293b; }
            .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; }
            .header h1 { margin: 0 0 10px 0; font-size: 24px; }
            .header p { margin: 5px 0; color: #ccfbf1; font-size: 14px; }
            .header .meta { color: #fb923c; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #0f172a; border-bottom: 2px solid #14b8a6; padding-bottom: 8px; font-size: 18px; }
            .recommendation { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
            .recommendation h3 { margin: 0 0 8px 0; color: #0f172a; }
            .recommendation .match { color: #14b8a6; font-weight: bold; float: right; }
            .recommendation .category { color: #64748b; font-size: 14px; margin-bottom: 10px; }
            .recommendation ul { margin: 10px 0; padding-left: 20px; }
            .recommendation li { margin: 5px 0; font-size: 14px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
            @page { margin: 2cm; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Zertainity Career Assessment Report</h1>
            <p>Personalised guidance report generated by Zertainity.in</p>
            <p class="meta">Education Level: ${effectiveEducationLevel}</p>
          </div>

          <div class="section">
            <h2>Your Strengths</h2>
            <p>${strengths}</p>
          </div>

          <div class="section">
            <h2>Recommended Career Paths</h2>
            ${recommendations.map((rec, index) => `
              <div class="recommendation">
                <h3>${index + 1}. ${rec.stream} <span class="match">${rec.match}% Match</span></h3>
                <p class="category">${rec.category}</p>
                <p>${rec.description}</p>
                <p><strong>Why this fits:</strong></p>
                <ul>
                  ${rec.reasons.map(r => `<li>${r}</li>`).join('')}
                </ul>
                <p><strong>Career options:</strong> ${rec.careers.join(', ')}</p>
              </div>
            `).join('')}
          </div>

          ${shareUrl ? `
          <div class="section">
            <h2>Shareable Result Link</h2>
            <p style="color: #14b8a6;">${shareUrl}</p>
          </div>
          ` : ''}

          <div class="section">
            <h2>Important Note</h2>
            <p>This report is guidance-oriented and should be used alongside discussions with parents, teachers, counsellors, and official admission or exam sources.</p>
          </div>

          <div class="footer">
            <p>Generated by Zertainity.in · ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
        </body>
        </html>
      `;

      const response = await fetch('http://localhost:8000/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: htmlContent }),
      });

      if (!response.ok) throw new Error('PDF generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zertainity-career-assessment-${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: "PDF downloaded", description: "Your assessment report has been saved." });
    } catch (error) {
      console.error("PDF generation failed:", error);
      toast({ title: "Download failed", description: "Unable to generate the PDF. Make sure the Python backend is running on localhost:8000.", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO 
        title="Your Career Results" 
        description="View your personalised career recommendations based on your quiz and education details."
        canonical="/results"
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
                  {/* Top Results Ad */}
                  <AdUnit slot="5555555555" className="!my-4" />
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
                      <h4 className="font-semibold mb-2">Suggested subjects</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.suggestedSubjects.map((subject) => (
                          <Badge key={subject} variant="outline">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/60 p-4">
                      <h4 className="font-semibold mb-2">Official pathway basis</h4>
                      <ul className="space-y-1 ml-5">
                        {rec.officialPathways.slice(0, 2).map((pathway) => (
                          <li key={pathway} className="text-sm text-muted-foreground list-disc">{pathway}</li>
                        ))}
                      </ul>
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
      </main>
    </div>
  );
};

export default Results;
