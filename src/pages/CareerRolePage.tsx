import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  GraduationCap,
  ArrowLeft,
  BookOpen,
  School,
  ClipboardList,
  Bookmark,
  ShieldCheck,
  Calendar,
  ExternalLink,
  CheckCircle2,
  GitCompare,
  Building2,
  FileCheck2,
} from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import DecorativeCurves from "@/components/DecorativeCurves";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCareerDetailBySlug } from "@/data/careerRoleDetails";
import { useSavedCareers } from "@/hooks/useSavedCareers";
import { cn } from "@/lib/utils";

import NotFound from "./NotFound";

const CareerRolePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const detail = slug ? getCareerDetailBySlug(slug) : undefined;
  const { isSaved, toggleSaveCareer } = useSavedCareers();

  const setCurves = useSetCurves();

  useEffect(() => {
    if (!detail) return;
    setCurves([
      { d: "M -80 420 C 30 360, 220 340, 420 380 S 680 460, 920 420", strokeOpacity: 0.14, strokeWidth: 5 },
      { d: "M -80 420 C 30 360, 220 340, 420 380 S 680 460, 920 420", strokeOpacity: 0.42, strokeWidth: 1.3 },
    ]);
    return () => setCurves([]);
  }, [setCurves, detail]);

  if (!detail) {
    return <NotFound />;
  }

  const canonical = `/careers/${slug}`;
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${detail.title} — Career Guide for Indian Students`,
    description: detail.metaDescription,
    author: { "@type": "Organization", name: "Zertainity", url: "https://www.zertainity.in" },
    publisher: {
      "@type": "Organization",
      name: "Zertainity",
      url: "https://www.zertainity.in",
      logo: { "@type": "ImageObject", url: "https://www.zertainity.in/favicon.png" },
    },
    mainEntityOfPage: `https://www.zertainity.in${canonical}`,
    inLanguage: "en-IN",
    image: "https://www.zertainity.in/favicon.png",
    articleSection: "Career Guidance",
    keywords: [detail.title, detail.listName, "career India", "career path", detail.ncoCode || ""].filter(Boolean).join(", "),
  };

  const actionSteps = [
    `Verify Class 11-12 subject eligibility requirements for ${detail.listName}`,
    `Review latest entrance exam syllabus and previous year question papers (${detail.keyExams[0]?.split("(")[0] || "relevant entrance"})`,
    `Explore target colleges, admission cutoffs, and verified placement records`,
    `Build core foundational skills in ${detail.typicalSubjects[0] || "relevant subject areas"}`,
    `Compare educational degree alternatives with Zertainity's Career Comparison Tool`,
  ];

  return (
    <div className="min-h-screen bg-background relative">
      <DecorativeCurves />
      <SEO
        title={`${detail.title} — Career in India`}
        description={detail.metaDescription}
        canonical={canonical}
        ogType="article"
        keywords={`${detail.title}, ${detail.listName}, career India, how to become ${detail.title.toLowerCase()}, ${detail.title.toLowerCase()} eligibility`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
          { name: detail.title, path: canonical },
        ]}
        jsonLd={articleSchema}
      />

      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/careers")} aria-label="Back to careers">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Badge variant="secondary">{detail.listName}</Badge>
              {detail.ncoCode && (
                <Badge variant="outline" className="text-xs font-mono">
                  NCO: {detail.ncoCode}
                </Badge>
              )}
            </div>
            <Button
              id="career-detail-save-btn"
              variant={isSaved(slug || detail.title) ? "default" : "outline"}
              size="sm"
              className={cn(
                "rounded-full gap-1.5 text-xs h-8 px-4 font-medium transition-all",
                isSaved(slug || detail.title)
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "border-border/80 hover:bg-muted"
              )}
              onClick={() =>
                toggleSaveCareer({
                  slug: slug || detail.title.toLowerCase().replace(/\s+/g, "-"),
                  title: detail.title,
                  category: detail.listName,
                })
              }
            >
              <Bookmark className={cn("h-3.5 w-3.5", isSaved(slug || detail.title) && "fill-current")} />
              {isSaved(slug || detail.title) ? "Saved Career" : "Save Career"}
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary shrink-0" />
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {detail.title}
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm md:text-base leading-relaxed">{detail.intro}</p>

          {/* Sourced Trust Metadata Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 pt-3 border-t border-border/60 text-xs text-muted-foreground">
            {detail.regulatoryBody && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-primary" />
                <span>Apex Body: <strong className="text-foreground">{detail.regulatoryBody}</strong></span>
              </span>
            )}
            {detail.skillLevel && (
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Skill: <strong className="text-foreground">{detail.skillLevel}</strong></span>
              </span>
            )}
            {detail.lastReviewed && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Last reviewed: <strong className="text-foreground">{detail.lastReviewed}</strong></span>
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <nav className="text-sm text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-1 items-center">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/careers" className="hover:text-primary">
                Careers
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium truncate max-w-[12rem] md:max-w-none">{detail.listName}</li>
          </ol>
        </nav>

        {/* Subjects Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-950 dark:text-slate-50">
              <BookOpen className="h-5 w-5 text-primary" />
              Subjects & Foundations (Classes 11–12)
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Recommended school foundations across CBSE, ISC, and State Boards in India.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm md:text-base">
              {detail.typicalSubjects.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Entrance Examinations Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-950 dark:text-slate-50">
              <ClipboardList className="h-5 w-5 text-primary" />
              Verified Key Entrance Examinations & Gateways
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Authoritative entrance channels — verify latest application windows with official testing agencies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-300 text-sm md:text-base">
              {detail.keyExams.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Colleges Card */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-950 dark:text-slate-50">
              <School className="h-5 w-5 text-primary" />
              Premier Institutions & Training Hubs
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Exemplary public and private institutions in India known for this discipline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detail.colleges.map((c) => (
              <div key={c.name} className="border-b border-border/60 last:border-0 pb-4 last:pb-0">
                <p className="font-semibold text-slate-950 dark:text-slate-50">{c.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{c.context}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Actionable Next 5 Steps Section */}
        <Card className="shadow-card border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-950 dark:text-slate-50">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              What Should You Do Next? (Your Next 5 Steps)
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">
              Concrete, actionable recommendations to evaluate and pursue this career path.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2.5">
              {actionSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm md:text-base text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* Sourced Reference Authority & Verification Footer */}
        {detail.sources && detail.sources.length > 0 && (
          <Card className="shadow-card border-border/80">
            <CardHeader className="py-4">
              <CardTitle className="flex items-center gap-2 text-base text-slate-950 dark:text-slate-50">
                <FileCheck2 className="h-4 w-4 text-emerald-600" />
                Verified Data Sources & Regulatory References
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 text-xs space-y-1.5 text-muted-foreground">
              <p>This profile is grounded in official government classifications and statutory curricula:</p>
              <ul className="list-disc pl-4 space-y-1">
                {detail.sources.map((src, i) => (
                  <li key={i}>
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {src.name}
                        <ExternalLink className="h-3 w-3 inline" />
                      </a>
                    ) : (
                      <span>{src.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Next Step Exploration CTA */}
        <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-3">
          <h2 className="font-semibold text-lg text-slate-950 dark:text-slate-50">Test Fit & Compare Alternatives</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Compare this role against your personal academic strengths and interests, or explore the multi-year progression timeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="rounded-full">
              <Link to="/quiz">Take the career assessment</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/pathways" state={{ career: detail.listName }}>
                Explore full roadmap
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/compare" className="gap-1.5">
                <GitCompare className="h-4 w-4" />
                Compare degrees
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerRolePage;
