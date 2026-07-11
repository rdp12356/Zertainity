




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
      { d: "M -80 420 C 30 360, 220 340, 420 380 S 680 460, 920 420", stroke: "rgba(255,255,255,0.06)", strokeOpacity: 0.14, strokeWidth: 5 },
      { d: "M -80 420 C 30 360, 220 340, 420 380 S 680 460, 920 420", stroke: "rgba(255,255,255,0.15)", strokeOpacity: 0.42, strokeWidth: 1.3 },
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
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden selection:bg-neutral-800 font-sans pb-16">
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

      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="container mx-auto px-6 py-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/careers")} 
              aria-label="Back to careers"
              className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-0.5 text-xs font-semibold">
              {detail.listName}
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <GraduationCap className="h-7 w-7 text-amber-400 shrink-0" />
            <h1 
              className="text-2xl md:text-3xl font-light tracking-tight text-white leading-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {detail.title}
            </h1>
          </div>
          <p className="text-white/70 mt-3 text-sm md:text-base leading-relaxed font-light">{detail.intro}</p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-3xl space-y-8 relative z-10">
        <nav className="text-sm text-white/40" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-1.5 items-center font-light">
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/20">/</li>
            <li>
              <Link to="/careers" className="hover:text-amber-400 transition-colors">
                Careers
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/20">/</li>
            <li className="text-white/80 truncate max-w-[12rem] md:max-w-none">{detail.listName}</li>
          </ol>
        </nav>

        {/* subjects card */}
        <Card className="liquid-glass border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md rounded-2xl hover:border-white/20 transition-all duration-300">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <BookOpen className="h-5 w-5 text-amber-400" />
              Subjects that usually help
            </CardTitle>
            <CardDescription className="text-white/50 font-light">
              Typical 11th–12th or early undergraduate foundations in India—not a rigid checklist.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ul className="list-disc pl-5 space-y-1.5 text-white/70 font-light text-sm">
              {detail.typicalSubjects.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* exams card */}
        <Card className="liquid-glass border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md rounded-2xl hover:border-white/20 transition-all duration-300">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <ClipboardList className="h-5 w-5 text-amber-400" />
              Key exams & gateways
            </CardTitle>
            <CardDescription className="text-white/50 font-light">
              Entrances change rules yearly—always confirm the latest brochure.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            <ul className="list-disc pl-5 space-y-1.5 text-white/70 font-light text-sm">
              {detail.keyExams.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* institutions card */}
        <Card className="liquid-glass border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md rounded-2xl hover:border-white/20 transition-all duration-300">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-white">
              <School className="h-5 w-5 text-amber-400" />
              Types of institutions (examples)
            </CardTitle>
            <CardDescription className="text-white/50 font-light">
              Illustrative categories—not rankings or guarantees.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            {detail.colleges.map((c) => (
              <div key={c.name} className="border-b border-white/5 last:border-0 pb-4 last:pb-0">
                <p className="font-semibold text-white">{c.name}</p>
                <p className="text-sm text-white/60 mt-1 font-light leading-relaxed">{c.context}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* plan step container */}
        <div className="liquid-glass relative overflow-hidden p-8 md:p-12 text-center rounded-xl border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-md">
          {/* Inner gold glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent" />
          
          <h2 
            className="text-[28px] font-normal tracking-[-0.4px] mb-4 text-white"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Plan your next step
          </h2>
          <p className="text-sm text-white/70 max-w-[480px] mx-auto mb-8 font-light leading-relaxed">
            Compare this role with your interests using our free flow, then open a pathway visualisation for timelines.
          </p>
          <div className="flex flex-col sm:flex-row gap-4.5 justify-center">
            <Button asChild className="rounded-full bg-amber-500 hover:bg-amber-600 text-black shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 text-xs font-bold px-6 py-2.5 h-10">
              <Link to="/quiz">Take the career quiz</Link>
            </Button>
            <Button asChild variant="outline" className="border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20 rounded-full text-xs font-semibold px-6 py-2.5 h-10 transition-colors">
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
