import { useEffect, useMemo, useState } from "react";
import { Search, UserRoundCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type UserWithRoles = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

type CareerHistoryRow = {
  created_at: string;
  education_level: string;
  top_recommendation: string | null;
  top_match_percent: number | null;
  user_id: string;
};

type StudentRow = UserWithRoles & {
  assessments: number;
  latestRecommendation: string | null;
  latestMatch: number | null;
  latestAssessmentAt: string | null;
};

export function StudentInsightsPanel() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [history, setHistory] = useState<CareerHistoryRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const [usersResult, historyResult] = await Promise.all([
        supabase.rpc("get_all_users_with_roles"),
        supabase
          .from("career_history")
          .select("created_at, education_level, top_recommendation, top_match_percent, user_id")
          .order("created_at", { ascending: false })
          .limit(1000),
      ]);

      setUsers((usersResult.data ?? []) as UserWithRoles[]);
      setHistory((historyResult.data ?? []) as CareerHistoryRow[]);
      setLoading(false);
    };

    fetchInsights();
  }, []);

  const students = useMemo<StudentRow[]>(() => {
    return users.map((user) => {
      const userHistory = history.filter((entry) => entry.user_id === user.id);
      const latest = userHistory[0];
      return {
        ...user,
        assessments: userHistory.length,
        latestRecommendation: latest?.top_recommendation ?? null,
        latestMatch: latest?.top_match_percent ?? null,
        latestAssessmentAt: latest?.created_at ?? null,
      };
    });
  }, [history, users]);

  const filteredStudents = students.filter((student) => {
    const query = searchTerm.toLowerCase();
    return (
      student.email.toLowerCase().includes(query) ||
      student.latestRecommendation?.toLowerCase().includes(query) ||
      student.roles.some((role) => role.toLowerCase().includes(query))
    );
  });

  const activeStudents = students.filter((student) => student.assessments > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Student Insights</h2>
        <p className="text-muted-foreground">Understand student engagement and assessment outcomes from real account data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : students.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From auth users RPC</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">With Assessments</CardTitle>
            <UserRoundCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : activeStudents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Users with at least one career history row</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assessment Rows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : history.length.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Latest 1,000 records loaded</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-border/50 bg-card/50">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>Search students by email, role, or recommendation.</CardDescription>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8 bg-background" placeholder="Search students..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Assessments</TableHead>
                  <TableHead>Latest Recommendation</TableHead>
                  <TableHead className="text-right">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No students found.</TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.email}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {(student.roles.length ? student.roles : ["user"]).map((role) => (
                            <Badge key={role} variant="outline" className="capitalize">{role}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{student.assessments}</TableCell>
                      <TableCell>
                        {student.latestRecommendation ? `${student.latestRecommendation} (${student.latestMatch ?? 0}%)` : "No assessment yet"}
                      </TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {student.latestAssessmentAt ? new Date(student.latestAssessmentAt).toLocaleDateString() : "Never"}
                      </TableCell>
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
