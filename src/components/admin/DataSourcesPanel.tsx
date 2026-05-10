import { useEffect, useMemo, useState } from "react";
import { BookOpen, Briefcase, Building2, CheckCircle2, Database, ExternalLink, School } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { COMPREHENSIVE_CAREERS } from "@/data/careersCatalog";
import { EXAMS_CATALOG } from "@/data/examsCatalog";

type DataSourceStatus = "live" | "catalog" | "planned";

type SourceRow = {
  area: string;
  icon: typeof Briefcase;
  currentSource: string;
  records: number | null;
  status: DataSourceStatus;
  recommendedSources: string[];
  nextAction: string;
};

const statusConfig: Record<DataSourceStatus, { label: string; className: string }> = {
  live: {
    label: "Live database",
    className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  catalog: {
    label: "Local verified catalog",
    className: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  },
  planned: {
    label: "Needs data pipeline",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
};

export function DataSourcesPanel() {
  const [collegeCount, setCollegeCount] = useState<number | null>(null);
  const [schoolCount, setSchoolCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      const [collegesResult, schoolsResult] = await Promise.all([
        supabase.from("colleges").select("id", { count: "exact", head: true }),
        supabase.from("schools").select("id", { count: "exact", head: true }),
      ]);

      setCollegeCount(collegesResult.count ?? 0);
      setSchoolCount(schoolsResult.count ?? 0);
      setLoading(false);
    };

    fetchCounts();
  }, []);

  const sourceRows = useMemo<SourceRow[]>(() => [
    {
      area: "Careers",
      icon: Briefcase,
      currentSource: "src/data/careersCatalog.ts",
      records: COMPREHENSIVE_CAREERS.length,
      status: "catalog",
      recommendedSources: ["National Career Service", "NSDC skill sector reports", "O*NET for skill taxonomy"],
      nextAction: "Move careers into a Supabase careers table with source_url, last_verified_on, demand_score, salary_range, and updated_by fields.",
    },
    {
      area: "Schools",
      icon: School,
      currentSource: "Supabase public.schools",
      records: schoolCount,
      status: "live",
      recommendedSources: ["UDISE+ public school directory", "CBSE affiliation search", "State education department portals"],
      nextAction: "Import verified rows with board, location, coordinates, official website, and last_verified_on. Keep manual admin edits auditable.",
    },
    {
      area: "Colleges",
      icon: Building2,
      currentSource: "Supabase public.colleges",
      records: collegeCount,
      status: "live",
      recommendedSources: ["AISHE", "AICTE approved institutes", "NIRF rankings", "College official admission pages"],
      nextAction: "Normalize courses, cutoffs, city/state, approvals, ranking source, official URL, and verification date before showing to students.",
    },
    {
      area: "Exams",
      icon: BookOpen,
      currentSource: "src/data/examsCatalog.ts",
      records: EXAMS_CATALOG.length,
      status: "catalog",
      recommendedSources: ["NTA official portals", "JoSAA/CSAB", "NEET/NMC portals", "Exam conducting body bulletins"],
      nextAction: "Create an exams table with official_notice_url, apply_url, registration_window, exam_window, last_verified_on, and stale-data alerts.",
    },
  ], [collegeCount, schoolCount]);

  const totalVerifiedRecords = sourceRows.reduce((sum, row) => sum + (row.records ?? 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Real Data Sources</h2>
        <p className="text-muted-foreground">
          Track what data is live, what is still catalog-based, and which trusted sources should be used next.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : totalVerifiedRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined live and verified catalog records</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Live Database Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sourceRows.filter((row) => row.status === "live").length}</div>
            <p className="text-xs text-muted-foreground">Schools and colleges are Supabase-backed</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Catalog Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sourceRows.filter((row) => row.status === "catalog").length}</div>
            <p className="text-xs text-muted-foreground">Careers and exams should move to database tables</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Data Coverage Matrix
          </CardTitle>
          <CardDescription>Use this to decide what to fetch, verify, and migrate next.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Dataset</TableHead>
                  <TableHead>Current Source</TableHead>
                  <TableHead>Records</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Trusted Sources</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sourceRows.map((row) => {
                  const Icon = row.icon;
                  const status = statusConfig[row.status];

                  return (
                    <TableRow key={row.area}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-primary" />
                          {row.area}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{row.currentSource}</TableCell>
                      <TableCell>{loading && row.records === null ? "..." : (row.records ?? 0).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={status.className}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {row.recommendedSources.map((source) => (
                            <Badge key={source} variant="outline" className="font-normal">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {sourceRows.map((row) => (
          <Card key={row.area} className="shadow-sm border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Next step for {row.area}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">{row.nextAction}</p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <ExternalLink className="h-4 w-4" />
                Verify only from official or government-backed sources before publishing.
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
