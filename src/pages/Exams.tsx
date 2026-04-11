import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, ExternalLink, FileText, GraduationCap, Info, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { EXAMS_CATALOG } from "@/data/examsCatalog";

const CATEGORY_ORDER = [
  "All",
  "Engineering",
  "Medical",
  "Law",
  "Design",
  "Management",
  "Government",
  "Banking",
  "Professional",
  "Research",
  "Hospitality",
  "Agriculture",
  "Maritime",
  "Other",
] as const;

const categorizeExam = (name: string, pathways: string[]): string => {
  const haystack = `${name} ${pathways.join(" ")}`.toLowerCase();

  if (/(jee|bitsat|viteee|wbjee|mht cet|comedk|b\.tech|engineering)/.test(haystack)) return "Engineering";
  if (/(neet|mbbs|bds|bhms|bams|medical|pharm|gpat)/.test(haystack)) return "Medical";
  if (/(clat|ailet|llb|law)/.test(haystack)) return "Law";
  if (/(nift|nid|uceed|ceed|design|ux|fashion)/.test(haystack)) return "Design";
  if (/(cat|xat|ipmat|npat|mba|pgdm|management)/.test(haystack)) return "Management";
  if (/(upsc|nda|cds|ssc|ias|ips|ifs|civil services|central government)/.test(haystack)) return "Government";
  if (/(ibps|sbi|bank|po)/.test(haystack)) return "Banking";
  if (/(ca|cma|cseet|company secretary|chartered account)/.test(haystack)) return "Professional";
  if (/(gate|jam|ugc net|csir|jrf|research|phd)/.test(haystack)) return "Research";
  if (/(nchm|hotel|hospitality|tourism)/.test(haystack)) return "Hospitality";
  if (/(icar|agri|agriculture)/.test(haystack)) return "Agriculture";
  if (/(imu|maritime|marine|nautical)/.test(haystack)) return "Maritime";

  return "Other";
};

const Exams = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const examsWithCategory = useMemo(() => {
    return EXAMS_CATALOG.map((exam) => ({
      ...exam,
      category: categorizeExam(exam.name, exam.pathways),
    }));
  }, []);

  const categories = useMemo(() => {
    const available = new Set(examsWithCategory.map((exam) => exam.category));
    return CATEGORY_ORDER.filter((category) => category === "All" || available.has(category));
  }, [examsWithCategory]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return examsWithCategory.filter((exam) => {
      const matchesCategory = selectedCategory === "All" || exam.category === selectedCategory;
      const matchesQuery =
        !q ||
        exam.name.toLowerCase().includes(q) ||
        exam.authority.toLowerCase().includes(q) ||
        exam.pathways.some((path) => path.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [examsWithCategory, query, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Exams"
        description="Explore major India entrance exams with official links, application steps, dates, and pathways after each exam."
        canonical="/exams"
      />

      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">Explore Exams</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-xl">Exams</CardTitle>
            <CardDescription>
              Dates and process are shown from official sources with direct links. Always complete final verification on the official notice page before applying.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-lg mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search exam, authority, or pathway"
                className="pl-9"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((exam) => (
            <Card key={exam.id} className="border-border">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{exam.name}</CardTitle>
                    <CardDescription className="mt-1">{exam.authority}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">Verified: {exam.lastVerifiedOn}</Badge>
                    <Badge variant="secondary">{exam.category}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{exam.registrationWindow}</Badge>
                  <Badge variant="secondary">{exam.examWindow}</Badge>
                  <Badge variant="secondary">{exam.resultWindow}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Window & attempts
                  </p>
                  <p className="text-sm text-muted-foreground">Attempts: {exam.attempts}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    How to apply (official)
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {exam.howToApply.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-primary" />
                    Things to know before applying
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {exam.thingsToKnow.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Pathways after this exam</p>
                  <div className="flex flex-wrap gap-2">
                    {exam.pathways.map((path) => (
                      <Badge key={path} variant="outline">{path}</Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={exam.officialNoticeUrl} target="_blank" rel="noreferrer">
                      Official Notice
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button asChild size="sm">
                    <a href={exam.applyUrl} target="_blank" rel="noreferrer">
                      Apply on Official Website
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filtered.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No exams found for this search.
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Exams;
