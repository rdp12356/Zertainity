



import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { GraduationCap, Sparkles, TrendingUp, ExternalLink, Lock, Loader2 } from "lucide-react";

import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface SharedData {
  education_level: string;
  strengths: string;
  recommendations: any;
  top_recommendation: string | null;
  top_match_percent: number | null;
  display_name: string | null;
  created_at: string;
}

export const DEFAULT_STREAMS = [
  {
    name: "Science (PCM)",
    subjects: ["Physics", "Chemistry", "Mathematics", "English", "Computer Science / Economics"],
    careers: ["Software Engineer", "Mechanical/Civil/Electrical Engineer", "Data Scientist", "Commercial Pilot", "Architect", "AI/ML Engineer"],
    analysis: "Science with Physics, Chemistry, and Mathematics (PCM) is highly recommended for you. Your analytical skills and interest in design, building, and problem-solving suggest a strong fit for engineering, technological, and architecture careers."
  },
  {
    name: "Science (PCB)",
    subjects: ["Physics", "Chemistry", "Biology", "English", "Psychology / Biotechnology"],
    careers: ["Doctor (MBBS)", "Dentist", "Biotechnologist", "Pharmacist", "Nurse", "Nutritionist / Dietitian"],
    analysis: "Science with Physics, Chemistry, and Biology (PCB) is the standard route for medical, biological, and health sciences. Your scientific curiosity and interest in helping others align perfectly with these fields."
  },
  {
    name: "Science (PCMB)",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology", "English"],
    careers: ["Biomedical Engineer", "Bioinformatician", "Biotechnologist", "Research Scientist", "Pharmaceutical Developer"],
    analysis: "Science with PCMB offers the maximum career flexibility, opening doors to both engineering and medical disciplines. This combination is challenging but highly rewarding for students showing high analytical ability across both maths and life sciences."
  },
  {
    name: "Commerce",
    subjects: ["Accountancy", "Business Studies", "Economics", "English", "Mathematics / Applied Mathematics"],
    careers: ["Chartered Accountant (CA)", "Financial Analyst", "Investment Banker", "Business Analyst", "Marketing Manager", "Entrepreneur"],
    analysis: "Commerce is the ideal stream for careers in finance, business management, and administration. Your numerical competence and interest in corporate structures, economics, and leadership indicate a strong potential for success in this path."
  },
  {
    name: "Arts & Humanities",
    subjects: ["History", "Geography", "Political Science", "Psychology", "Sociology", "English", "Legal Studies"],
    careers: ["Civil Services (IAS/IPS/IFS)", "Corporate Lawyer", "Psychologist / Counselor", "Graphic/UX Designer", "Journalist", "Writer / Editor"],
    analysis: "Arts and Humanities offer a rich path focusing on human society, literature, design, law, and administration. Your strong verbal reasoning, creative flair, and interest in human behaviour and society show an excellent fit for this stream."
  }
];

export const computeStreamsFromCareers = (recs: any[]) => {
  const careerToStreamsMap: Record<string, string[]> = {
    "Software Engineer": ["Science (PCM)", "Science (PCMB)"],
    "Data Scientist": ["Science (PCM)", "Science (PCMB)"],
    "UI/UX Designer": ["Arts & Humanities", "Science (PCM)"],
    "Cybersecurity Analyst": ["Science (PCM)", "Science (PCMB)"],
    "AI/ML Engineer": ["Science (PCM)", "Science (PCMB)"],
    "Full Stack Developer": ["Science (PCM)", "Science (PCMB)"],
    "Mechanical Engineer": ["Science (PCM)", "Science (PCMB)"],
    "Civil Engineer": ["Science (PCM)", "Science (PCMB)"],
    "Electrical Engineer": ["Science (PCM)", "Science (PCMB)"],
    "Robotics Engineer": ["Science (PCM)", "Science (PCMB)"],
    "Doctor (MBBS)": ["Science (PCB)", "Science (PCMB)"],
    "Nurse": ["Science (PCB)", "Science (PCMB)"],
    "Psychologist / Therapist": ["Arts & Humanities", "Science (PCB)"],
    "Nutritionist / Dietitian": ["Science (PCB)", "Science (PCMB)"],
    "Chartered Accountant (CA)": ["Commerce"],
    "Financial Analyst": ["Commerce"],
    "Investment Banker": ["Commerce"],
    "Business Analyst": ["Commerce"],
    "Management Consultant": ["Commerce"],
    "Product Manager": ["Commerce", "Science (PCM)"],
    "Startup Founder / Entrepreneur": ["Commerce"],
    "Civil Services (IAS/IPS/IFS)": ["Arts & Humanities"],
    "Defense Services (Army/Navy/AF)": ["Science (PCM)", "Science (PCMB)"],
    "Corporate Lawyer": ["Arts & Humanities"],
    "Architect": ["Science (PCM)"],
    "Graphic Designer": ["Arts & Humanities"],
    "Commercial Pilot": ["Science (PCM)"]
  };

  const streamMatches: Record<string, { maxScore: number; sourceCareers: string[] }> = {
    "Science (PCM)": { maxScore: 40, sourceCareers: [] },
    "Science (PCB)": { maxScore: 40, sourceCareers: [] },
    "Science (PCMB)": { maxScore: 40, sourceCareers: [] },
    "Commerce": { maxScore: 40, sourceCareers: [] },
    "Arts & Humanities": { maxScore: 40, sourceCareers: [] },
  };

  recs.forEach(rec => {
    const careerName = rec?.stream || "";
    const mapped = careerToStreamsMap[careerName.trim()] || [];
    mapped.forEach(s => {
      if (streamMatches[s]) {
        if (rec.match > streamMatches[s].maxScore) {
          streamMatches[s].maxScore = rec.match;
        }
        streamMatches[s].sourceCareers.push(careerName);
      }
    });
  });

  const hasPcm = recs.some(rec => (careerToStreamsMap[rec?.stream || ""] || []).includes("Science (PCM)"));
  const hasPcb = recs.some(rec => (careerToStreamsMap[rec?.stream || ""] || []).includes("Science (PCB)"));
  if (hasPcm && hasPcb) {
    streamMatches["Science (PCMB)"].maxScore = Math.max(streamMatches["Science (PCM)"].maxScore, streamMatches["Science (PCB)"].maxScore);
  } else if (hasPcm || hasPcb) {
    streamMatches["Science (PCMB)"].maxScore = Math.max(40, Math.round(Math.max(streamMatches["Science (PCM)"].maxScore, streamMatches["Science (PCB)"].maxScore) * 0.9));
  }

  return DEFAULT_STREAMS.map(def => {
    const matchScore = streamMatches[def.name].maxScore;
    const matchLevel = matchScore >= 75
      ? "High Match"
      : matchScore >= 55
        ? "Moderate Match"
        : "Low Match";

    const uniqueSources = Array.from(new Set(streamMatches[def.name].sourceCareers));
    const reasons = uniqueSources.length > 0
      ? [`Strong alignment with recommended careers in this area: ${uniqueSources.join(", ")}.`]
      : ["General suitability based on career profile matches."];

    return {
      streamName: def.name,
      matchScore,
      matchLevel,
      reasons,
      subjects: def.subjects,
      careers: def.careers,
      suitabilityAnalysis: def.analysis
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

const SharedResult = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<SharedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    supabase
      .from("shared_results")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data: row, error }) => {
        if (error || !row) { setNotFound(true); }
        else { setData(row as unknown as SharedData); }
        setLoading(false);
      });
  }, [slug]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-sm">Loading shared results…</p>
        </div>
      </div>
    );
  }

  /* ── Not Found ── */
  if (notFound || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Results not found</h1>
          <p className="text-muted-foreground text-sm">
            This link may have expired or doesn't exist. Take the assessment yourself to get your personalised results.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <GraduationCap className="h-4 w-4" />
            Go to Zertainity
          </Link>
        </div>
      </div>
    );
  }

  let recs: Array<{
    stream: string;
    category: string;
    match: number;
    description: string;
    reasons: string[];
    careers: string[];
  }> = [];
  let streams: Array<{
    streamName: string;
    matchScore: number;
    matchLevel: "High Match" | "Moderate Match" | "Low Match";
    reasons: string[];
    subjects: string[];
    careers: string[];
    suitabilityAnalysis: string;
  }> = [];

  if (data) {
    if (Array.isArray(data.recommendations)) {
      recs = data.recommendations;
      if (data.education_level === "after-10th") {
        streams = computeStreamsFromCareers(recs);
      }
    } else if (data.recommendations && typeof data.recommendations === "object") {
      recs = (data.recommendations as any).careers || [];
      streams = (data.recommendations as any).streams || [];
      if (data.education_level === "after-10th" && streams.length === 0) {
        streams = computeStreamsFromCareers(recs);
      }
    }
  }

  /* ── Shared Result View ── */
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={data.top_recommendation ? `${data.display_name || "A student"}'s career match: ${data.top_recommendation}` : "Shared Career Result"}
        description={data.top_recommendation ? `${data.display_name || "A Zertainity user"}'s personalised career recommendation — top match ${data.top_recommendation} (${data.top_match_percent ?? 0}% fit). Take your own free assessment to see yours.` : "A shared Zertainity career assessment result."}
        canonical={`/share/${slug}`}
        ogType="article"
      />
      {/* Header */}
      <header className="border-b border-border/60 bg-background/95 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">Zertainity</span>
          </div>
          <Link
            to="/education-level"
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Take My Own Assessment
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      {/* Shared banner */}
      <div className="border-b border-border/60 bg-card py-10">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-primary">Shared career assessment</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
            {data.display_name
              ? <>{data.display_name}'s Career Path</>
              : <>Career Assessment Results</>}
          </h1>
          {data.top_recommendation && (
            <p className="text-muted-foreground text-base">
              Top match: <span className="text-primary font-semibold">{data.top_recommendation}</span>
              {data.top_match_percent && (
                <span className="ml-2">({data.top_match_percent}%)</span>
              )}
            </p>
          )}
          <p className="text-xs text-muted-foreground pt-1">
            {data.education_level === "after-10th" ? "After 10th Grade" : "After 12th Grade"} ·{" "}
            {formatDate(data.created_at)}
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 max-w-4xl space-y-8">

        {/* Read-only notice */}
        <div className="flex items-center gap-2 bg-muted/40 rounded-lg px-4 py-3 border border-border/40 text-sm text-muted-foreground">
          <Lock className="h-4 w-4 flex-shrink-0" />
          <span>This is a <strong>read-only</strong> shared view. Results belong to the original student.</span>
        </div>

        {/* Strengths */}
        {data.strengths && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Student Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{data.strengths}</p>
            </CardContent>
          </Card>
        )}

        {/* Recommended streams section for after-10th */}
        {data.education_level === "after-10th" && streams && streams.length > 0 && (
          <div className="mb-8 space-y-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-primary mb-2">Academic Guidance</p>
              <h3 className="text-2xl font-semibold tracking-tight text-foreground">Recommended high school streams</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Based on your Class 9 & 10 marks trend and interest mapping, here are the most suitable streams for your senior secondary education (Class 11 & 12).
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              {streams.map((stream, idx) => {
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

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold mb-5">Recommended Career Paths</h2>
          <div className="space-y-5">
            {recs.map((rec, i) => (
              <Card key={i} className="shadow-card border-border/60 transition-colors hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{rec.stream}</CardTitle>
                      <CardDescription className="text-base">{rec.category}</CardDescription>
                    </div>
                    <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10">
                      {rec.match}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{rec.description}</p>
                  {rec.reasons?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        Why this fits:
                      </h4>
                      <ul className="space-y-1 ml-6">
                        {rec.reasons.map((r, j) => (
                          <li key={j} className="text-sm text-muted-foreground list-disc">{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {rec.careers?.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Career Options:</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.careers.map((c, j) => (
                          <Badge key={j} variant="secondary">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA — take own assessment */}
        <Card className="shadow-card bg-primary border-0 text-center">
          <CardHeader>
            <CardTitle className="text-primary-foreground text-2xl">Want Your Own Results?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Take the free Zertainity career assessment — no account needed to start.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/education-level"
              id="shared-result-cta-btn"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-background text-foreground font-semibold text-sm hover:bg-background/90 transition-colors"
            >
              Start My Assessment
              <ExternalLink className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">Zertainity</Link>
        {" · "}Career guidance for Indian students
      </footer>
    </div>
  );
};

export default SharedResult;
