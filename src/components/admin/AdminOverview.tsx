import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, School, Activity } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

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
  colleges: number;
  schools: number;
  activityEvents: number;
};

const defaultStats: DashboardStats = {
  totalUsers: 0,
  colleges: 0,
  schools: 0,
  activityEvents: 0,
};

export function AdminOverview() {
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor platform engagement, active users, and data health.</p>
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
