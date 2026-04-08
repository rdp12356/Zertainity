import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Sparkles, TrendingUp, ExternalLink, Lock, Loader2 } from "lucide-react";

interface SharedData {
  education_level: string;
  strengths: string;
  recommendations: Array<{
    stream: string;
    category: string;
    match: number;
    description: string;
    reasons: string[];
    careers: string[];
  }>;
  top_recommendation: string | null;
  top_match_percent: number | null;
  display_name: string | null;
  created_at: string;
}

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

  const recs = Array.isArray(data.recommendations) ? data.recommendations : [];

  /* ── Shared Result View ── */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
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
      <div className="gradient-hero animate-gradient py-10">
        <div className="container mx-auto px-4 text-center text-white space-y-2">
          <p className="text-sm font-medium uppercase tracking-widest text-white/60">Shared Career Assessment</p>
          <h1 className="text-3xl md:text-4xl font-bold">
            {data.display_name
              ? <>{data.display_name}'s Career Path</>
              : <>Career Assessment Results</>}
          </h1>
          {data.top_recommendation && (
            <p className="text-white/70 text-base">
              Top match: <span className="text-cyan-300 font-semibold">{data.top_recommendation}</span>
              {data.top_match_percent && (
                <span className="ml-2 text-white/50">({data.top_match_percent}%)</span>
              )}
            </p>
          )}
          <p className="text-xs text-white/40 pt-1">
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

        {/* Recommendations */}
        <div>
          <h2 className="text-2xl font-bold mb-5">Recommended Career Paths</h2>
          <div className="space-y-5">
            {recs.map((rec, i) => (
              <Card key={i} className="shadow-card border-2 hover:border-primary/50 transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{rec.stream}</CardTitle>
                      <CardDescription className="text-base">{rec.category}</CardDescription>
                    </div>
                    <Badge className="bg-gradient-primary text-lg px-4 py-1">{rec.match}% Match</Badge>
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
        <Card className="shadow-card gradient-hero animate-gradient border-0 text-center">
          <CardHeader>
            <CardTitle className="text-white text-2xl">Want Your Own Results?</CardTitle>
            <CardDescription className="text-white/70">
              Take the free Zertainity career assessment — no account needed to start.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to="/education-level"
              id="shared-result-cta-btn"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
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
        {" · "}AI-powered career guidance for Indian students
      </footer>
    </div>
  );
};

export default SharedResult;
