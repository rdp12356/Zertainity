import { useMemo, useState } from "react";
import { BookOpen, Briefcase, CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { COMPREHENSIVE_CAREERS } from "@/data/careersCatalog";
import { EXAMS_CATALOG } from "@/data/examsCatalog";

type ContentKind = "career" | "exam";

type ContentRow = {
  id: string;
  kind: ContentKind;
  title: string;
  category: string;
  source: string;
  status: string;
  verifiedOn: string;
};

export function ContentOperationsPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | ContentKind>("all");

  const rows = useMemo<ContentRow[]>(() => {
    const careers = COMPREHENSIVE_CAREERS.map((career) => ({
      id: `career-${career.name}`,
      kind: "career" as const,
      title: career.name,
      category: career.category,
      source: "Careers catalog",
      status: "Published",
      verifiedOn: "Needs database verification date",
    }));

    const exams = EXAMS_CATALOG.map((exam) => ({
      id: `exam-${exam.id}`,
      kind: "exam" as const,
      title: exam.name,
      category: exam.authority,
      source: exam.officialWebsite,
      status: "Published",
      verifiedOn: exam.lastVerifiedOn,
    }));

    return [...careers, ...exams];
  }, []);

  const filteredRows = rows.filter((row) => {
    const query = searchTerm.toLowerCase();
    const matchesKind = kindFilter === "all" || row.kind === kindFilter;
    const matchesSearch = row.title.toLowerCase().includes(query) || row.category.toLowerCase().includes(query);
    return matchesKind && matchesSearch;
  });

  const staleExams = EXAMS_CATALOG.filter((exam) => {
    const verifiedAt = new Date(exam.lastVerifiedOn).getTime();
    const daysOld = (Date.now() - verifiedAt) / (1000 * 60 * 60 * 24);
    return daysOld > 90;
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Content Operations</h2>
        <p className="text-muted-foreground">Manage readiness of careers and exams without making the UI feel improvised.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Careers</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{COMPREHENSIVE_CAREERS.length}</div>
            <p className="text-xs text-muted-foreground">Published local catalog rows</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Exams</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{EXAMS_CATALOG.length}</div>
            <p className="text-xs text-muted-foreground">Published local catalog rows</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Needs Review</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staleExams}</div>
            <p className="text-xs text-muted-foreground">Exams verified more than 90 days ago</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Workflow</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Draft, verify, publish, audit</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/50 bg-card/50">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Content Inventory</CardTitle>
            <CardDescription>Search published careers and exams from the current app catalogs.</CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <div className="relative md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8 bg-background" placeholder="Search content..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
            </div>
            <div className="flex rounded-md border border-border/60 bg-background p-1">
              {(["all", "career", "exam"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setKindFilter(filter)}
                  className={`rounded px-3 py-1.5 text-sm capitalize transition-colors ${kindFilter === filter ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category / Authority</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{row.title}</TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{row.kind}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.category}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.verifiedOn}</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">{row.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
