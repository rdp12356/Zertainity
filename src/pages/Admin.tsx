import { useNavigate } from "react-router-dom";
import { useUserSession } from "@/hooks/use-user-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, ArrowLeft, Building2, School, Users, Shield, Activity, FileText, Settings, User as UserIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { UsersManagement } from "@/components/admin/UsersManagement";
import { PermissionsManager } from "@/components/admin/PermissionsManager";
import { EmailConfigToggle } from "@/components/admin/EmailConfigToggle";
import { ActivityLogs } from "@/components/admin/ActivityLogs";
import { AuditTrail } from "@/components/admin/AuditTrail";
import { ContentManagement } from "@/components/admin/ContentManagement";
import StudentDashboard from "./StudentDashboard";

const Admin = () => {
  const { user, profile, role, loading: sessionLoading } = useUserSession();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  // Form/Management states (Keeping simplified here, or moved to components)
  const [users, setUsers] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [suspendedUsers, setSuspendedUsers] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      navigate("/auth");
      return;
    }

    // Logic for "Viewer" role or normal users
    if (!["owner", "admin", "manager", "editor"].includes(role)) {
      setLoading(false);
      return;
    }

    fetchAdminData();
    setLoading(false);
  }, [user, role, sessionLoading, navigate]);

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      const [usersRes, suspendedRes, activityRes, auditRes] = await Promise.all([
        supabase.rpc('get_all_users_with_roles'),
        supabase.from('suspended_users').select('user_id'),
        supabase.from('user_activity_log').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(50)
      ]);

      setUsers(usersRes.data || []);
      setSuspendedUsers(new Set(suspendedRes.data?.map(s => s.user_id) || []));
      setActivityLogs(activityRes.data || []);
      setAuditLogs(auditRes.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleRoleChange = async (userId: string, email: string, oldRole: string, newRole: string) => {
    try {
      const { error } = await supabase.functions.invoke('update-user-role', {
        body: { userId, oldRole: oldRole === 'user' ? null : oldRole, newRole }
      });
      if (error) throw error;
      toast({ title: "Updated", description: `Changed ${email} to ${newRole}` });
      fetchAdminData();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  if (sessionLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading Management Console...</div>;
  }

  // Only owners and editors see the full Admin panel.
  // Managers can see most but not permissions.
  // If not management, show Student Dashboard
  if (!["owner", "admin", "manager", "editor"].includes(role)) {
    return <StudentDashboard />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold tracking-tight">Management Console</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile?.display_name || user?.email}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{role}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()} className="rounded-full">Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
            <TabsList className="bg-muted/50 p-1 rounded-full border border-border/40 w-auto">
              <TabsTrigger value="overview" className="rounded-full px-6">Overview</TabsTrigger>
              <TabsTrigger value="users" className="rounded-full px-6">Users</TabsTrigger>
              <TabsTrigger value="content" className="rounded-full px-6">Content</TabsTrigger>
              {(role === 'owner' || role === 'admin') && (
                <TabsTrigger value="permissions" className="rounded-full px-6">Security</TabsTrigger>
              )}
              <TabsTrigger value="logs" className="rounded-full px-6">Audit Trail</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-full px-6">System</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-premium border-border/40">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                  <div className="text-3xl font-bold">{users.length}</div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-xs text-green-500">
                    <Activity className="h-3 w-3" />
                    <span>Active membership</span>
                  </div>
                </CardContent>
              </Card>
              {/* More stat cards... */}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement
              users={users}
              currentUser={user}
              isOwner={role === 'owner'}
              loadingUsers={loadingData}
              onRefresh={fetchAdminData}
              onInvite={async (email, r) => {
                await supabase.functions.invoke('invite-user', { body: { email, role: r } });
                fetchAdminData();
              }}
              onRoleChange={handleRoleChange}
              onDelete={async (id) => {
                await supabase.functions.invoke('delete-user', { body: { userId: id } });
                fetchAdminData();
              }}
              onSuspend={async (id) => {
                await supabase.functions.invoke('suspend-user', { body: { userId: id, reason: 'Manual suspension' } });
                fetchAdminData();
              }}
              onUnsuspend={async (id) => {
                await supabase.functions.invoke('unsuspend-user', { body: { userId: id } });
                fetchAdminData();
              }}
              onExport={() => { }}
              suspendedUsers={suspendedUsers}
              updatingRole={null}
              deletingUser={null}
            />
          </TabsContent>

          <TabsContent value="content">
            <ContentManagement isOwner={role === 'owner'} />
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsManager isOwner={role === 'owner'} />
          </TabsContent>

          <TabsContent value="logs">
            <div className="grid gap-8">
              <ActivityLogs
                logs={activityLogs}
                users={users}
                loading={loadingData}
                selectedUser={null}
                onUserChange={() => { }}
              />
              <AuditTrail
                logs={auditLogs}
                users={users}
                loading={loadingData}
                selectedUser={null}
                onUserChange={() => { }}
              />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <EmailConfigToggle isOwner={role === 'owner'} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
