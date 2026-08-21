import { useState } from "react";
import { Link } from "react-router-dom";
import {
  GitCompare,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  IndianRupee,
  Clock,
  Layers,
} from "lucide-react";

import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEGREE_COMPARISONS } from "@/data/degreeComparisons";
import { cn } from "@/lib/utils";

const CompareDegrees = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(DEGREE_COMPARISONS[0].id);

  const currentGroup = DEGREE_COMPARISONS.find((g) => g.id === selectedGroupId) || DEGREE_COMPARISONS[0];

  const canonical = "/compare";

  const comparisonSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Indian Degree & Career Pathway Comparisons — Zertainity",
    description: "Compare B.Tech vs BCA, B.Com vs BBA vs CA, MBBS vs BDS vs BAMS, and BA LLB vs 3-Yr LLB with verified syllabus, entrances, and career outcomes.",
    author: { "@type": "Organization", name: "Zertainity", url: "https://www.zertainity.in" },
    publisher: {
      "@type": "Organization",
      name: "Zertainity",
      url: "https://www.zertainity.in",
      logo: { "@type": "ImageObject", url: "https://www.zertainity.in/favicon.png" },
    },
    mainEntityOfPage: "https://www.zertainity.in/compare",
    inLanguage: "en-IN",
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEO
        title="Compare Degrees & Educational Pathways in India — Zertainity"
        description="Side-by-side comparison of Indian degrees: B.Tech vs BCA, B.Com vs CA vs CFA, MBBS vs BDS, and Law pathways with eligibility, entrance exams, and fee ranges."
        canonical={canonical}
        ogType="article"
        keywords="B.Tech vs BCA, B.Com vs BBA, CA vs MBA Finance, MBBS vs BDS, BA LLB vs LLB, degree comparison India, college degree guide"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
          { name: "Compare Degrees", path: canonical },
        ]}
        jsonLd={comparisonSchema}
      />

      {/* Header */}
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" asChild aria-label="Back to careers">
              <Link to="/careers">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <Badge variant="secondary" className="gap-1 text-xs">
              <GitCompare className="h-3 w-3" />
              Side-by-Side Analysis
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                Compare Higher Education Degrees & Pathways
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Factual, verified comparisons across India's most popular educational crossroads to help you choose with clarity.
              </p>
            </div>
          </div>

          {/* Group Selector Pills */}
          <div className="flex flex-wrap gap-2 mt-6">
            {DEGREE_COMPARISONS.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedGroupId(group.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all border",
                  selectedGroupId === group.id
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/40 hover:bg-muted text-muted-foreground border-border"
                )}
              >
                {group.title.split(":")[0]}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Comparison Body */}
      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
        <div className="space-y-2">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">{currentGroup.title}</h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{currentGroup.description}</p>
        </div>

        {/* Comparison Cards Grid */}
        <div className={cn(
          "grid gap-6",
          currentGroup.degrees.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        )}>
          {currentGroup.degrees.map((deg, idx) => (
            <Card key={deg.shortName} className="shadow-card border-border flex flex-col justify-between">
              <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    Option {String.fromCharCode(65 + idx)}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {deg.duration}
                  </span>
                </div>
                <CardTitle className="text-base md:text-lg font-bold text-foreground mt-2 leading-tight">
                  {deg.name}
                </CardTitle>
                <CardDescription className="text-xs font-medium text-primary">
                  {deg.shortName}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 text-xs md:text-sm flex-1">
                {/* Eligibility */}
                <div>
                  <span className="font-semibold text-foreground block mb-1 flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                    Eligibility:
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{deg.eligibility}</p>
                </div>

                {/* Core Subjects */}
                <div>
                  <span className="font-semibold text-foreground block mb-1 flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5 text-primary" />
                    Core Subjects:
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
                    {deg.coreSubjects.slice(0, 4).map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* Key Entrances */}
                <div>
                  <span className="font-semibold text-foreground block mb-1 flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-primary" />
                    Key Entrances:
                  </span>
                  <p className="text-muted-foreground font-medium">{deg.entranceExams.join(", ")}</p>
                </div>

                {/* Approximate Fees */}
                <div>
                  <span className="font-semibold text-foreground block mb-1 flex items-center gap-1">
                    <IndianRupee className="h-3.5 w-3.5 text-emerald-600" />
                    Approximate Fees:
                  </span>
                  <p className="text-muted-foreground">{deg.approximateFees}</p>
                </div>

                {/* Who It Suits */}
                <div className="pt-2 border-t border-border/50">
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400 block mb-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Who This Suits:
                  </span>
                  <p className="text-muted-foreground leading-relaxed text-xs">{deg.whoItSuits}</p>
                </div>

                {/* Who May Not Enjoy */}
                <div>
                  <span className="font-semibold text-amber-700 dark:text-amber-400 block mb-1 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Who May Not Enjoy:
                  </span>
                  <p className="text-muted-foreground leading-relaxed text-xs">{deg.whoMayNotEnjoy}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Verdict & Neutral Guidance Box */}
        <Card className="border-primary/30 bg-primary/5 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base md:text-lg font-bold text-foreground">
              <Sparkles className="h-5 w-5 text-primary" />
              Zertainity Recommendation & Decision Framework
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {currentGroup.verdictGuidance}
          </CardContent>
        </Card>

        {/* Assessment CTA */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-foreground">Unsure which degree aligns with your unique profile?</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Take Zertainity's free, explainable academic and interest evaluation to receive personalized match scores.
            </p>
          </div>
          <Button asChild className="rounded-full shrink-0">
            <Link to="/quiz">Take Free Assessment</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default CompareDegrees;
