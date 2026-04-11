import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, ArrowLeft, BookOpen, School, ClipboardList } from "lucide-react";
import { SEO } from "@/components/SEO";
import { getCareerDetailBySlug } from "@/data/careerRoleDetails";
import NotFound from "./NotFound";

const CareerRolePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const detail = slug ? getCareerDetailBySlug(slug) : undefined;

  if (!detail) {
    return <NotFound />;
  }

  const canonical = `/careers/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: detail.title,
    description: detail.metaDescription,
    author: { "@type": "Organization", name: "Zertainity" },
    publisher: { "@type": "Organization", name: "Zertainity" },
    mainEntityOfPage: `https://www.zertainity.in${canonical}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={detail.title} description={detail.metaDescription} canonical={canonical} ogType="article" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

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
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {detail.title}
            </h1>
          </div>
          <p className="text-muted-foreground mt-3 text-sm md:text-base leading-relaxed">{detail.intro}</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <nav className="text-sm text-muted-foreground" aria-label="Breadcrumb">
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
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5 text-primary" />
              Subjects that usually help
            </CardTitle>
            <CardDescription>Typical 11th–12th or early undergraduate foundations in India—not a rigid checklist.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {detail.typicalSubjects.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <ClipboardList className="h-5 w-5 text-primary" />
              Key exams & gateways
            </CardTitle>
            <CardDescription>Entrances change rules yearly—always confirm the latest brochure.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              {detail.keyExams.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <School className="h-5 w-5 text-primary" />
              Types of institutions (examples)
            </CardTitle>
            <CardDescription>Illustrative categories—not rankings or guarantees.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {detail.colleges.map((c) => (
              <div key={c.name} className="border-b border-border/60 last:border-0 pb-4 last:pb-0">
                <p className="font-semibold text-foreground">{c.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{c.context}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="rounded-xl border border-border bg-muted/30 p-6 space-y-3">
          <h2 className="font-semibold text-lg">Plan your next step</h2>
          <p className="text-sm text-muted-foreground">
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
          <p className="text-xs text-muted-foreground">
            Guides:{" "}
            <Link to="/guides/career-after-10th-cbse" className="underline hover:text-primary">
              After 10th
            </Link>
            {" · "}
            <Link to="/guides/software-engineer-after-12th-india" className="underline hover:text-primary">
              Software engineer after 12th
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default CareerRolePage;
