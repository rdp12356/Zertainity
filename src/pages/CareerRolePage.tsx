




import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { GraduationCap, ArrowLeft, BookOpen, School, ClipboardList } from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import DecorativeCurves from "@/components/DecorativeCurves";
import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCareerDetailBySlug } from "@/data/careerRoleDetails";

import NotFound from "./NotFound";

const CareerRolePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const detail = slug ? getCareerDetailBySlug(slug) : undefined;

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
    keywords: [detail.title, detail.listName, "career India", "career path"].join(", "),
  };

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
          <div className="flex items-center gap-3 mb-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/careers")} aria-label="Back to careers">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Badge variant="secondary">{detail.listName}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary shrink-0" />
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
              {detail.title}
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mt-3 text-sm md:text-base leading-relaxed">{detail.intro}</p>
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

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-950 dark:text-slate-50">
              <BookOpen className="h-5 w-5 text-primary" />
              Subjects that usually help
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">Typical 11th–12th or early undergraduate foundations in India—not a rigid checklist.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              {detail.typicalSubjects.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-950 dark:text-slate-50">
              <ClipboardList className="h-5 w-5 text-primary" />
              Key exams & gateways
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">Entrances change rules yearly—always confirm the latest brochure.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300">
              {detail.keyExams.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-950 dark:text-slate-50">
              <School className="h-5 w-5 text-primary" />
              Types of institutions (examples)
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300">Illustrative categories—not rankings or guarantees.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detail.colleges.map((c) => (
              <div key={c.name} className="border-b border-border/60 last:border-0 pb-4 last:pb-0">
                <p className="font-semibold text-slate-950 dark:text-slate-50">{c.name}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{c.context}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-3">
          <h2 className="font-semibold text-lg text-slate-950 dark:text-slate-50">Plan your next step</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Compare this role with your interests using our free flow, then open a pathway visualisation for timelines.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="rounded-full">
              <Link to="/quiz">Take the career quiz</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/pathways" state={{ career: detail.listName }}>
                Explore pathways
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerRolePage;
