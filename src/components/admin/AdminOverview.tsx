



import { useEffect, useState } from "react";

import { Users, Building2, School, Activity, Zap, ShieldCheck, Database, UserCog } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { COMPREHENSIVE_CAREERS } from "@/data/careersCatalog";
import { supabase } from "@/integrations/supabase/client";

type ActivityDataPoint = {
  name: string;
  events: number;
};

type RoleDataPoint = {
  name: string;
  count: number;
};

type DashboardStats = {
  totalUsers: number;
  careers: number;
  colleges: number;
  schools: number;
  activityEvents: number;
};

const defaultStats: DashboardStats = {
  totalUsers: 0,
  careers: 0,
  colleges: 0,
  schools: 0,
  activityEvents: 0,
};

type AdminOverviewProps = {
  onNavigate?: (tabId: string) => void;
};

export function AdminOverview({ onNavigate }: AdminOverviewProps) {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [activityData, setActivityData] = useState<ActivityDataPoint[]>([]);
  const [roleData, setRoleData] = useState<RoleDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const [
        usersResult,
        collegesResult,
        schoolsResult,
        activityCountResult,
        activityResult,
        rolesResult,
      ] = await Promise.all([
        supabase.rpc('get_all_users_with_roles'),
        supabase.from('colleges').select('id', { count: 'exact', head: true }),
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        supabase.from('user_activity_log').select('id', { count: 'exact', head: true }),
        supabase
          .from('user_activity_log')
          .select('created_at')
          .gte('created_at', sevenDaysAgo.toISOString()),
        supabase.from('user_roles').select('role'),
      ]);

      setStats({
        totalUsers: Array.isArray(usersResult.data) ? usersResult.data.length : 0,
        careers: COMPREHENSIVE_CAREERS.length,
        colleges: collegesResult.count ?? 0,
        schools: schoolsResult.count ?? 0,
        activityEvents: activityCountResult.count ?? 0,
      });

      const dailyActivity = new Map<string, number>();
      for (let index = 0; index < 7; index += 1) {
        const date = new Date(sevenDaysAgo);
        date.setDate(sevenDaysAgo.getDate() + index);
        dailyActivity.set(
          date.toLocaleDateString('en-US', { weekday: 'short' }),
          0
        );
      }

      activityResult.data?.forEach((entry) => {
        const day = new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' });
        dailyActivity.set(day, (dailyActivity.get(day) ?? 0) + 1);
      });

      setActivityData(
        Array.from(dailyActivity.entries()).map(([name, events]) => ({ name, events }))
      );

      const roleCounts = new Map<string, number>();
      rolesResult.data?.forEach((entry) => {
        roleCounts.set(entry.role, (roleCounts.get(entry.role) ?? 0) + 1);
      });

      setRoleData(
        Array.from(roleCounts.entries()).map(([name, count]) => ({ name, count }))
      );

      setLoading(false);
    };

    fetchOverviewData();
  }, []);

  const hasActivityData = activityData.some((item) => item.events > 0);
  const hasRoleData = roleData.some((item) => item.count > 0);
  const handleNavigate = (tabId: string) => {
    onNavigate?.(tabId);
  };

  const quickActions = [
    { id: "colleges", label: "Add College", helper: "Create new college entries" },
    { id: "schools", label: "Add School", helper: "Publish school listings" },
    { id: "users", label: "Invite Users", helper: "Send admin invites" },
    { id: "activity", label: "Review Activity", helper: "Open recent logs" },
  ];

  const userOps = [
    { id: "users", label: "User Directory", helper: "Manage roles & status" },
    { id: "permissions", label: "Permissions", helper: "RBAC policies" },
    { id: "audit", label: "Audit Trail", helper: "Compliance records" },
    { id: "settings", label: "Email Config", helper: "SMTP toggles" },
  ];

  const pipelineMetrics = [
    { label: "Careers", value: stats.careers, hint: "Catalog entries" },
    { label: "Colleges", value: stats.colleges, hint: "Institution index" },
    { label: "Schools", value: stats.schools, hint: "School directory" },
  ];

  const pipelineMax = Math.max(1, ...pipelineMetrics.map((item) => item.value));
  const activityHealth =
    stats.activityEvents === 0 ? { label: "No recent events", tone: "text-amber-600", dot: "bg-amber-500" }
    : { label: "Active telemetry", tone: "text-emerald-600", dot: "bg-emerald-500" };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Control Panel Overview</h2>
        <p className="text-muted-foreground">Monitor platform engagement, operational health, and catalog coverage.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From registered auth users</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Colleges Indexed</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.colleges.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From colleges table</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Schools Indexed</CardTitle>
            <School className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.schools.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From schools table</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Activity Events</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.activityEvents.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From activity log</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleNavigate(action.id)}
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-left text-xs font-medium transition hover:bg-muted"
              >
                <div className="text-[13px] font-semibold text-foreground">{action.label}</div>
                <div className="text-[11px] text-muted-foreground">{action.helper}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Auth & Sessions</span>
              <span className="flex items-center gap-2 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Operational
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Database</span>
              <span className="flex items-center gap-2 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Activity Ingestion</span>
              <span className={`flex items-center gap-2 ${activityHealth.tone}`}>
                <span className={`h-2 w-2 rounded-full ${activityHealth.dot}`} />
                {activityHealth.label}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Edge Functions</span>
              <span className="flex items-center gap-2 text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Operational
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content Pipeline</CardTitle>
            <Database className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            {pipelineMetrics.map((metric) => (
              <div key={metric.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-foreground">{metric.label}</span>
                    <span className="ml-2 text-[10px] text-muted-foreground">{metric.hint}</span>
                  </div>
                  <span className="font-mono text-muted-foreground">{loading ? "..." : metric.value.toLocaleString()}</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary transition-all"
                    style={{ width: `${Math.round((metric.value / pipelineMax) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Ops</CardTitle>
            <UserCog className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="space-y-2">
            {userOps.map((action) => (
              <button
                key={action.id}
                onClick={() => handleNavigate(action.id)}
                className="w-full rounded-md border border-border/60 bg-background px-3 py-2 text-left text-xs font-medium transition hover:bg-muted"
              >
                <div className="text-[13px] font-semibold text-foreground">{action.label}</div>
                <div className="text-[11px] text-muted-foreground">{action.helper}</div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Platform Engagement</CardTitle>
            <CardDescription>Daily activity events from the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasActivityData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="name" className="text-xs font-medium" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs font-medium" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="events" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No activity events found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>User Demographics</CardTitle>
            <CardDescription>Role distribution across the platform</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {hasRoleData ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                  <XAxis dataKey="name" className="text-xs font-medium" stroke="hsl(var(--muted-foreground))" />
                  <YAxis className="text-xs font-medium" stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No user roles found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
