import { Link } from "react-router-dom";
import {
  Calculator,
  Layers,
  Scale,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Methodology = () => {
  const canonical = "/methodology";

  const methodologySchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Zertainity Career Analysis Engine — Scoring & Evaluation Methodology",
    description: "Detailed documentation of Zertainity's deterministic multi-criteria career recommendation methodology, normalization formulas, and ethical limitations.",
    author: { "@type": "Organization", name: "Zertainity", url: "https://www.zertainity.in" },
    publisher: {
      "@type": "Organization",
      name: "Zertainity",
      url: "https://www.zertainity.in",
      logo: { "@type": "ImageObject", url: "https://www.zertainity.in/favicon.png" },
    },
    mainEntityOfPage: "https://www.zertainity.in/methodology",
    inLanguage: "en-IN",
  };

  return (
    <div className="min-h-screen bg-background relative">
      <SEO
        title="Analysis Engine Methodology & Mathematical Scoring Model — Zertainity"
        description="Understand how Zertainity evaluates student academics, normalizes board marks, maps RIASEC Holland interests, and computes career compatibility scores."
        canonical={canonical}
        ogType="article"
        keywords="Zertainity methodology, career recommendation algorithm, MCDA scoring, academic normalization, RIASEC mapping, career guidance algorithm"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
          { name: "Methodology", path: canonical },
        ]}
        jsonLd={methodologySchema}
      />

      {/* Header */}
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="gap-1 text-xs">
              <Calculator className="h-3 w-3" />
              Algorithm Documentation v1.0
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
            Zertainity Analysis Engine Methodology
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mt-3 leading-relaxed">
            A transparent, deterministic mathematical framework for evaluating academic strength, career interest alignment, and educational pathways in India.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-10">
        {/* Core Principles */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            1. Core Architectural Principles
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
            Zertainity operates as a <strong>Deterministic Multi-Criteria Decision Analysis (MCDA) System</strong>. We believe that career decisions should never be governed by opaque, unpredictable black-box algorithms. Every recommendation is mathematically traceable back to the student's verified input data.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Card className="shadow-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">100% Deterministic</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                The identical input payload always yields identical scores and factor traces. No probabilistic randomness.
              </CardContent>
            </Card>
            <Card className="shadow-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">Fully Explainable</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Every score is decomposed into explicit contributing factors (Academic Core, Subject Weights, RIASEC Interest).
              </CardContent>
            </Card>
            <Card className="shadow-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold text-foreground">Honest Completeness</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground leading-relaxed">
                Missing data is dynamically re-normalized across available dimensions without injecting synthetic placeholder numbers.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Input Normalization */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            2. Data Normalization Architecture
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Before evaluating compatibility, all inputs undergo rigorous mathematical standardization to eliminate board and grading discrepancies.
          </p>

          <Card className="shadow-card border-border">
            <CardContent className="pt-6 space-y-4 text-sm">
              <div className="border-b border-border/60 pb-3">
                <h3 className="font-semibold text-foreground">Academic Marks Normalization:</h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">
                  Marks are converted to standard continuous percentages:
                </p>
                <div className="bg-muted/50 p-2.5 rounded-md font-mono text-xs mt-2 text-foreground">
                  Percentage = (Raw Marks / Maximum Marks) * 100
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  For International Baccalaureate (IB) 1–7 point scales: <code className="bg-muted px-1.5 py-0.5 rounded text-foreground">Percentage = (Grade / 7) * 100</code>.
                </p>
              </div>

              <div className="border-b border-border/60 pb-3">
                <h3 className="font-semibold text-foreground">Interest Scaling:</h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">
                  Qualitative declared interest levels map to standardized continuous scores:
                </p>
                <ul className="list-disc pl-5 text-xs text-muted-foreground mt-1.5 space-y-0.5">
                  <li><strong>High Interest:</strong> 90% normalized score</li>
                  <li><strong>Moderate / Mid Interest:</strong> 60% normalized score</li>
                  <li><strong>Low Interest:</strong> 30% normalized score</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground">RIASEC Holland Themes Mapping:</h3>
                <p className="text-muted-foreground text-xs md:text-sm mt-1">
                  Student interests and psychometric answers map to the six standard vocational psychology themes:
                  Realistic (R), Investigative (I), Artistic (A), Social (S), Enterprising (E), and Conventional (C).
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Compatibility Formula */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            3. Multi-Criteria Career Compatibility Formula
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            The overall Career Compatibility Score (S_composite) represents a weighted multi-criteria aggregation:
          </p>

          <Card className="shadow-card border-primary/20 bg-muted/20">
            <CardContent className="pt-6 font-mono text-xs md:text-sm space-y-2 text-foreground">
              <div className="p-3 bg-card border rounded-md font-semibold text-center text-primary">
                S = (w_acad × S_acad + w_int × S_int + w_skill × S_skill + w_apt × S_apt + w_pref × S_pref) / W_total
              </div>
              <div className="pt-2 text-xs text-muted-foreground font-sans space-y-1">
                <p><strong>Baseline Weight Distribution:</strong></p>
                <ul className="list-disc pl-5 space-y-0.5">
                  <li><strong>Academic Domain Weighted Score (w_acad = 0.40):</strong> Calculated using specific career-subject weight vectors.</li>
                  <li><strong>Interest & RIASEC Alignment (w_int = 0.25):</strong> Congruence between declared interest and career domain.</li>
                  <li><strong>Demonstrated Skills (w_skill = 0.15):</strong> Match against required core technical competencies.</li>
                  <li><strong>Aptitude Dimension (w_apt = 0.10):</strong> Numerical, logical, and verbal aptitude indicators.</li>
                  <li><strong>Stated Preferences (w_pref = 0.10):</strong> Alignment with explicit student goal preferences.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Real-World Limitations & Disclaimers */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
            4. System Limitations & Ethical Guidance
          </h2>
          <Card className="shadow-card border-amber-500/30 bg-amber-500/5">
            <CardContent className="pt-6 space-y-3 text-xs md:text-sm text-foreground leading-relaxed">
              <p>
                <strong>Decision-Support Tool, Not a Guarantee:</strong> Zertainity is designed strictly as an educational exploration aid. A high compatibility score (e.g. 92% in Software Engineering) reflects strong analytical alignment with typical admission and performance prerequisites—it is <em>not</em> a guarantee of admission or future employment.
              </p>
              <p>
                <strong>Human Context Matters:</strong> Personal perseverance, institutional quality, changing economic trends, and unforeseen passion discovery cannot be captured fully by quantitative inputs alone. We strongly encourage students to discuss their Zertainity reports with qualified school counselors, parents, and industry practitioners.
              </p>
              <p>
                <strong>Independent Verification Required:</strong> Entrance examination eligibility criteria, age limits, and reservation quotas change across regulatory cycles. Always verify official notifications with the respective testing agency (NTA, UPSC, ICAI, COA, NMC).
              </p>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <div className="rounded-xl border border-border bg-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-lg text-foreground">Explore your personalized career analysis</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Test our explainable recommendation engine with your academic profile.
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="rounded-full">
              <Link to="/quiz">Start Assessment</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/careers">Browse Careers</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Methodology;
