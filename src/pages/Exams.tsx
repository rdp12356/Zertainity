import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, ExternalLink, FileText, Info, Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import { EXAMS_CATALOG, type ExamCatalogItem } from "@/data/examsCatalog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

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

const toStudentFriendlyText = (text?: string | null): string => {
  if (!text || typeof text !== "string") return "Check official notice for latest details.";
  const replacements: Array<[RegExp, string]> = [
    [/\bUG\b/g, "UG (Undergraduate)"],
    [/\bPG\b/g, "PG (Postgraduate)"],
    [/\bLLB\b/g, "LLB (Bachelor of Laws)"],
    [/\bNLU\b/g, "NLU (National Law University)"],
    [/\bNTA\b/g, "NTA (National Testing Agency)"],
    [/\bOTR\b/g, "OTR (One-Time Registration)"],
    [/\bPwD\b/g, "PwD (Persons with Disabilities)"],
    [/\bEWS\b/g, "EWS (Economically Weaker Section)"],
    [/\bGD\/PI\/WAT\b/g, "GD/PI/WAT (Group Discussion / Personal Interview / Written Ability Test)"],
    [/\bas notified\b/gi, "as per the latest official notice"],
    [/\bnotification-driven\b/gi, "decided by the latest official notification"],
  ];

  return replacements.reduce((acc, [pattern, value]) => acc.replace(pattern, value), text).replace(/\s+/g, " ").trim();
};

const defaultExpandedDetails = (category: string) => {
  const common = {
    documents: [
      "Passport-size photo and signature in exact official format",
      "Government photo ID (Aadhaar/PAN/Passport/Driving License as accepted)",
      "Class 10/12 and qualifying marksheet details",
      "Category/EWS/PwD certificate (if applicable)",
      "Active email and mobile number for OTP and updates",
    ],
    mistakes: [
      "Submitting form before reading official eligibility clauses",
      "Wrong subject/paper/program mapping during application",
      "Ignoring photo/signature dimension and file-size instructions",
      "Missing correction window deadlines",
      "Not downloading confirmation page and payment proof",
    ],
    after: [
      "Download and store admit card, response sheet, and scorecard",
      "Track counselling/admission/recruitment notices separately",
      "Prepare preference list before counselling starts",
      "Keep originals and scanned documents ready for verification",
    ],
    planning: [
      "3 to 2 months before exam: confirm eligibility, syllabus, and form checklist",
      "2 to 1 month before exam: submit application and start weekly mocks",
      "Last 4 weeks: focus on revision, previous papers, and weak topics",
      "Exam week: verify center location, reporting time, and accepted ID proof",
    ],
  };

  if (category === "Engineering") {
    return {
      eligibility: [
        "Usually PCM in Class 12 or equivalent; institute-specific rules apply",
        "Check age, board marks criteria, and number of attempts in current notice",
      ],
      fee: "Approx application fee: 1000-2500 (varies by exam/category and can change every year; verify official notice).",
      mode: "Computer-based test for most exams; some have multiple papers/sessions.",
      correction: "Most exams provide a correction window after form close; treat it as final chance.",
      support: "Use official exam helpdesk/portal grievance channels only.",
      ...common,
    };
  }

  if (category === "Medical") {
    return {
      eligibility: [
        "Typically PCB in Class 12 with subject-wise minimum criteria",
        "Nationality/domicile and age criteria are notification-dependent",
      ],
      fee: "Approx application fee: 1500-3500 (varies by exam/category and may change yearly; verify official notice).",
      mode: "Usually pen-paper or CBT depending on exam authority.",
      correction: "Correction window availability is exam-specific; watch dashboard notices daily.",
      support: "Use NTA/authority official contact channels and ticket system.",
      ...common,
    };
  }

  if (category === "Law") {
    return {
      eligibility: [
        "Usually Class 12 pass/appearing for UG law entrance exams",
        "Minimum marks, age policy, and category rules depend on official notification",
      ],
      fee: "Approx application fee: 2000-4500 (category-wise and updated yearly; always verify official notice).",
      mode: "Mostly computer-based objective test; paper pattern varies by exam.",
      correction: "Use correction window immediately if available; not all fields are editable.",
      support: "Use official consortium/university helpdesk and portal notices only.",
      ...common,
    };
  }

  if (category === "Government" || category === "Banking") {
    return {
      eligibility: [
        "Age range and category relaxation are strictly enforced",
        "Graduation/12th qualification depends on exam/post",
      ],
      fee: "Approx application fee: 0-1000 (many categories get exemption/relaxation; verify current notification).",
      mode: "Multi-stage process: prelims/mains/skill/interview as per post.",
      correction: "Some commissions do not allow broad corrections after submission.",
      support: "Follow official commission/board portal updates only.",
      ...common,
    };
  }

  return {
    eligibility: [
      "Eligibility changes by exam, category, and target program",
      "Always cross-check latest educational and age criteria",
    ],
    fee: "Approx application fee: 500-3000 depending on exam and category (changes by year; verify official notice).",
    mode: "Exam mode and stages are authority-specific.",
    correction: "If correction window exists, use it before final deadline.",
    support: "Use only official websites and published helpdesk channels.",
    ...common,
  };
};

const expandedExamDetails = (exam: ExamCatalogItem & { category: string }) => {
  const fallback = defaultExpandedDetails(exam.category);
  return {
    eligibility: exam.eligibilitySnapshot ?? fallback.eligibility,
    documents: exam.documentsChecklist ?? fallback.documents,
    fee: exam.feeInfo ?? fallback.fee,
    mode: exam.examMode ?? fallback.mode,
    correction: exam.correctionWindow ?? fallback.correction,
    support: exam.officialSupport ?? fallback.support,
    mistakes: exam.commonMistakes ?? fallback.mistakes,
    after: exam.afterExamSteps ?? fallback.after,
    prep: exam.prepPriorities ?? [
      "Understand syllabus and pattern before starting preparation",
      "Use mock tests and previous papers every week",
      "Revise weak areas and high-weight topics on a schedule",
    ],
    fit: exam.whoShouldChoose ?? [
      "Students who meet eligibility and want this pathway",
      "Students ready for consistent preparation",
      "Students who can track deadlines and official notices",
    ],
    upcoming: exam.upcomingExamDate ?? exam.examWindow,
    planning: fallback.planning,
  };
};

const Exams = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dbExams, setDbExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDbExams = async () => {
      try {
        const { data, error } = await supabase.from('exams').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          // Map DB schema to catalog structure if needed
          const mapped = data.map(item => ({
            ...item,
            id: item.id.toString(),
            pathways: Array.isArray(item.pathways) ? item.pathways : [],
            howToApply: Array.isArray(item.how_to_apply) ? item.how_to_apply : [],
            thingsToKnow: Array.isArray(item.things_to_know) ? item.things_to_know : [],
            officialNoticeUrl: item.official_notice_url || item.official_website,
            applyUrl: item.apply_url || item.official_website,
            lastVerifiedOn: item.last_verified_on || new Date().toISOString().split('T')[0]
          }));
          setDbExams(mapped);
        }
      } catch (error: any) {
        console.error("Error fetching exams:", error);
        toast({ title: "Note", description: "Using catalog data (offline)", variant: "default" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDbExams();
  }, [toast]);

  const examsWithCategory = useMemo(() => {
    const baseExams = dbExams.length > 0 ? dbExams : EXAMS_CATALOG;
    return baseExams.map((exam) => ({
      ...exam,
      category: exam.category || categorizeExam(exam.name, exam.pathways || []),
    }));
  }, [dbExams]);

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

      <PageHeader title="Exams" />

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

        <Card className="border-border bg-muted/20">
          <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">What you get here</p>
            <p>
              This section is designed to be decision-ready: exam timelines, official apply links, eligibility snapshot, document checklist, common application mistakes, and what to do after results.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <Card key={i} className="border-border p-6 space-y-4">
                <div className="flex justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-24 w-full" />
              </Card>
            ))
          ) : filtered.map((exam) => {
            const details = expandedExamDetails(exam);

            return (
            <Card key={exam.id} className="border-border">
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{exam.name}</CardTitle>
                    <CardDescription className="mt-1">{toStudentFriendlyText(exam.authority)}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="outline">Verified: {exam.lastVerifiedOn}</Badge>
                    <Badge variant="outline">Upcoming: {toStudentFriendlyText(details.upcoming)}</Badge>
                    <Badge variant="secondary">{exam.category}</Badge>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{toStudentFriendlyText(exam.registrationWindow)}</Badge>
                  <Badge variant="secondary">{toStudentFriendlyText(exam.examWindow)}</Badge>
                  <Badge variant="secondary">{toStudentFriendlyText(exam.resultWindow)}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Window & attempts
                  </p>
                  <p className="text-sm text-muted-foreground">Attempts: {toStudentFriendlyText(exam.attempts)}</p>
                  <p className="text-sm text-muted-foreground">Mode: {toStudentFriendlyText(details.mode)}</p>
                  <p className="text-sm text-muted-foreground">Fees: {toStudentFriendlyText(details.fee ?? "Check official notice for latest fee.")}</p>
                  <p className="text-sm text-muted-foreground">Correction window: {toStudentFriendlyText(details.correction)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Eligibility snapshot</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {details.eligibility.map((item) => (
                      <li key={item}>{toStudentFriendlyText(item)}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Documents checklist</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {details.documents.map((item) => (
                      <li key={item}>{toStudentFriendlyText(item)}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    How to apply (official)
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {exam.howToApply.map((step) => (
                      <li key={step}>{toStudentFriendlyText(step)}</li>
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
                      <li key={item}>{toStudentFriendlyText(item)}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Common mistakes to avoid</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {details.mistakes.map((item) => (
                      <li key={item}>{toStudentFriendlyText(item)}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Timeline planning checklist</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {details.planning.map((item) => (
                      <li key={item}>{toStudentFriendlyText(item)}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Top 3 prep priorities</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {details.prep.map((item) => (
                      <li key={item}>{toStudentFriendlyText(item)}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Who should choose this exam</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {details.fit.map((item) => (
                      <li key={item}>{toStudentFriendlyText(item)}</li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Pathways after this exam</p>
                  <div className="flex flex-wrap gap-2">
                    {exam.pathways.map((path) => (
                      <Badge key={path} variant="outline">{toStudentFriendlyText(path)}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">After exam: next actions</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    {details.after.map((item) => (
                      <li key={item}>{toStudentFriendlyText(item)}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground">Support channel: {toStudentFriendlyText(details.support)}</p>
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
          );
          })}
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
