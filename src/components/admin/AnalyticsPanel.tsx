import { useEffect, useMemo, useState } from "react";
import { Activity, BarChart3, Share2, Target } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type CareerHistoryRow = {
  created_at: string;
  education_level: string;
  top_recommendation: string | null;
  top_match_percent: number | null;
  user_id: string;
};

type SharedResultRow = {
  created_at: string;
  education_level: string;
  top_recommendation: string | null;
  top_match_percent: number | null;
};

type ActivityRow = {
  action: string;
  created_at: string;
  user_id: string;
};

type ChartRow = {
  name: string;
  count: number;
};

const countBy = <T,>(rows: T[], getKey: (row: T) => string | null | undefined): ChartRow[] => {
  const counts = new Map<string, number>();
  rows.forEach((row) => {
    const key = getKey(row)?.trim();
    if (!key) return;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
};

export function AnalyticsPanel() {
  const [careerHistory, setCareerHistory] = useState<CareerHistoryRow[]>([]);
  const [sharedResults, setSharedResults] = useState<SharedResultRow[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      const [careerResult, sharedResult, activityResult] = await Promise.all([
        supabase
          .from("career_history")
          .select("created_at, education_level, top_recommendation, top_match_percent, user_id")
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("shared_results")
          .select("created_at, education_level, top_recommendation, top_match_percent")
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("user_activity_log")
          .select("action, created_at, user_id")
          .order("created_at", { ascending: false })
          .limit(500),
      ]);

      setCareerHistory((careerResult.data ?? []) as CareerHistoryRow[]);
      setSharedResults((sharedResult.data ?? []) as SharedResultRow[]);
      setActivityLog((activityResult.data ?? []) as ActivityRow[]);
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  const topCareers = useMemo(() => countBy(careerHistory, (row) => row.top_recommendation), [careerHistory]);
  const educationLevels = useMemo(() => countBy(careerHistory, (row) => row.education_level), [careerHistory]);
  const activityTypes = useMemo(() => countBy(activityLog, (row) => row.action), [activityLog]);
  const averageMatch = useMemo(() => {
    const scores = careerHistory
      .map((row) => row.top_match_percent)
      .filter((score): score is number => typeof score === "number");
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }, [careerHistory]);

  const recentResults = careerHistory.slice(0, 8);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Analytics</h2>
        <p className="text-muted-foreground">Real engagement and assessment analytics from Supabase.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Assessments</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : careerHistory.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Saved career histories</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Shared Reports</CardTitle>
            <Share2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : sharedResults.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Public result links created</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Match</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : `${averageMatch}%`}</div>
            <p className="text-xs text-muted-foreground">From real assessment rows</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activity Logs</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : activityLog.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Latest tracked events</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <AnalyticsChart title="Top Career Recommendations" description="Most common top matches" data={topCareers} />
        <AnalyticsChart title="Education Levels" description="Assessment distribution" data={educationLevels} />
        <AnalyticsChart title="Activity Types" description="Most common user events" data={activityTypes} />
      </div>

      <Card className="shadow-sm border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle>Recent Assessment Outcomes</CardTitle>
          <CardDescription>Latest saved career recommendations from real users.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Created</TableHead>
                  <TableHead>Education Level</TableHead>
                  <TableHead>Top Recommendation</TableHead>
                  <TableHead className="text-right">Match</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResults.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No assessment data found.</TableCell>
                  </TableRow>
                ) : (
                  recentResults.map((row) => (
                    <TableRow key={`${row.user_id}-${row.created_at}`}>
                      <TableCell className="text-sm text-muted-foreground">{new Date(row.created_at).toLocaleString()}</TableCell>
                      <TableCell>{row.education_level}</TableCell>
                      <TableCell>{row.top_recommendation || "Not available"}</TableCell>
                      <TableCell className="text-right">{row.top_match_percent ?? 0}%</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsChart({ title, description, data }: { title: string; description: string; data: ChartRow[] }) {
  return (
    <Card className="shadow-sm border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[260px]">
        {data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No real data yet.</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
              <XAxis dataKey="name" angle={-25} textAnchor="end" interval={0} className="text-xs" stroke="hsl(var(--muted-foreground))" />
              <YAxis className="text-xs" stroke="hsl(var(--muted-foreground))" />
              <Tooltip cursor={{ fill: "hsl(var(--muted))" }} contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }} />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
