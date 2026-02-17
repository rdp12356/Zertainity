import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  GraduationCap, ArrowLeft, Building2, School, Users, Shield, Mail,
  Activity, Download, BarChart3, FileText, Settings, LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { PermissionsManager } from "@/components/admin/PermissionsManager";
import { UserProfileCard } from "@/components/admin/UserProfileCard";
import { EmailConfigToggle } from "@/components/admin/EmailConfigToggle";
import { CSVImport } from "@/components/admin/CSVImport";
import { motion } from "framer-motion";

type UserWithRoles = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

type ActivityLog = {
  id: string;
  user_id: string;
  action: string;
  details: any;
  created_at: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Users state
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("user");
  const [inviting, setInviting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [suspendedUsers, setSuspendedUsers] = useState<Set<string>>(new Set());
  const [suspending, setSuspending] = useState<string | null>(null);

  // Activity state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // College form
  const [collegeName, setCollegeName] = useState("");
  const [collegeLocation, setCollegeLocation] = useState("");
  const [collegeLat, setCollegeLat] = useState("");
  const [collegeLng, setCollegeLng] = useState("");
  const [collegeCourses, setCollegeCourses] = useState("");
  const [collegeCutoffs, setCollegeCutoffs] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");

  // School form
  const [schoolName, setSchoolName] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("");
  const [schoolLat, setSchoolLat] = useState("");
  const [schoolLng, setSchoolLng] = useState("");
  const [schoolBoard, setSchoolBoard] = useState("");
  const [schoolGrade11Cutoff, setSchoolGrade11Cutoff] = useState("");
  const [schoolDescription, setSchoolDescription] = useState("");

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) { setLoading(false); return; }
        setUser(session.user);

        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .in('role', ['admin', 'owner']);

        setIsAdmin(!!roles && roles.length > 0);
        setIsOwner(roles?.some(r => r.role === 'owner') || false);
      } catch (error) {
        console.error('Error in admin check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => checkAdminStatus());
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchActivityLogs();
      fetchAuditLogs();
    }
  }, [isAdmin]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await supabase.rpc('get_all_users_with_roles');
      setUsers(data || []);
      const { data: suspended } = await supabase.from('suspended_users').select('user_id');
      setSuspendedUsers(new Set(suspended?.map(s => s.user_id) || []));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchActivityLogs = async () => {
    setLoadingLogs(true);
    try {
      const { data } = await supabase
        .from('user_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const { data } = await supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
      setAuditLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    }
  };

  const handleChangeRole = async (userId: string, email: string, oldRole: string, newRole: string) => {
    if (oldRole === newRole) return;
    setUpdatingRole(userId);
    try {
      const { error } = await supabase.functions.invoke('update-user-role', {
        body: { userId, oldRole: oldRole === 'user' ? null : oldRole, newRole }
      });
      if (error) throw error;
      toast({ title: "Success", description: `Updated ${email}'s role to ${newRole}` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update role", variant: "destructive" });
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    setDeletingUser(userId);
    try {
      const { error } = await supabase.functions.invoke('delete-user', { body: { userId } });
      if (error) throw error;
      toast({ title: "Success", description: `${email} has been deleted` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete user", variant: "destructive" });
    } finally {
      setDeletingUser(null);
    }
  };

  const handleSuspendUser = async (userId: string, email: string) => {
    setSuspending(userId);
    try {
      const { error } = await supabase.functions.invoke('suspend-user', { body: { userId, reason: 'Suspended by admin' } });
      if (error) throw error;
      toast({ title: "Success", description: `${email} has been suspended` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to suspend user", variant: "destructive" });
    } finally {
      setSuspending(null);
    }
  };

  const handleUnsuspendUser = async (userId: string, email: string) => {
    setSuspending(userId);
    try {
      const { error } = await supabase.functions.invoke('unsuspend-user', { body: { userId } });
      if (error) throw error;
      toast({ title: "Success", description: `${email} has been unsuspended` });
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to unsuspend user", variant: "destructive" });
    } finally {
      setSuspending(null);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast({ title: "Error", description: "Email is required", variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setInviting(true);
    try {
      const { error } = await supabase.functions.invoke('invite-user', {
        body: { email: inviteEmail, role: inviteRole }
      });
      if (error) throw error;
      toast({ title: "Success", description: `Invitation sent to ${inviteEmail}` });
      setInviteEmail("");
      setInviteRole("user");
      fetchUsers();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to invite user", variant: "destructive" });
    } finally {
      setInviting(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      if (!response.ok) throw new Error('Failed to export users');
      const csvData = await response.text();
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast({ title: "Success", description: "Users exported successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to export users", variant: "destructive" });
    }
  };

  const handleSaveCollege = async () => {
    if (!collegeName.trim() || !collegeLocation.trim()) {
      toast({ title: "Error", description: "Name and location are required", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from("colleges").insert({
        name: collegeName,
        location: collegeLocation,
        latitude: collegeLat ? parseFloat(collegeLat) : null,
        longitude: collegeLng ? parseFloat(collegeLng) : null,
        courses: collegeCourses.split(",").map(c => c.trim()).filter(Boolean),
        cutoffs: collegeCutoffs,
        description: collegeDescription
      });
      if (error) throw error;
      toast({ title: "Success", description: "College added successfully" });
      setCollegeName(""); setCollegeLocation(""); setCollegeLat(""); setCollegeLng("");
      setCollegeCourses(""); setCollegeCutoffs(""); setCollegeDescription("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSchool = async () => {
    if (!schoolName.trim() || !schoolLocation.trim()) {
      toast({ title: "Error", description: "Name and location are required", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from("schools").insert({
        name: schoolName,
        location: schoolLocation,
        latitude: schoolLat ? parseFloat(schoolLat) : null,
        longitude: schoolLng ? parseFloat(schoolLng) : null,
        board: schoolBoard,
        grade_11_cutoff: schoolGrade11Cutoff ? parseFloat(schoolGrade11Cutoff) : null,
        description: schoolDescription
      });
      if (error) throw error;
      toast({ title: "Success", description: "School added successfully" });
      setSchoolName(""); setSchoolLocation(""); setSchoolLat(""); setSchoolLng("");
      setSchoolBoard(""); setSchoolGrade11Cutoff(""); setSchoolDescription("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  // Stats
  const totalUsers = users.length;
  const adminCount = users.filter(u => u.roles.includes('admin') || u.roles.includes('owner')).length;
  const suspendedCount = suspendedUsers.size;
  const recentLogins = users.filter(u => {
    if (!u.last_sign_in_at) return false;
    const d = new Date(u.last_sign_in_at);
    return (Date.now() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You must be logged in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => navigate("/auth")} className="w-full">Sign In</Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You do not have admin privileges.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-foreground" />
                <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden md:inline">{user.email}</span>
              <Badge variant="outline" className="text-xs">{isOwner ? 'Owner' : 'Admin'}</Badge>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border/40 p-1 h-auto flex-wrap">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background" onClick={() => fetchUsers()}>
              <Users className="h-4 w-4" /> Users
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background">
              <FileText className="h-4 w-4" /> Content
            </TabsTrigger>
            <TabsTrigger value="permissions" className="gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background">
              <Shield className="h-4 w-4" /> RBAC
            </TabsTrigger>
            <TabsTrigger value="activity" className="gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background" onClick={() => { fetchActivityLogs(); fetchAuditLogs(); }}>
              <Activity className="h-4 w-4" /> Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-foreground data-[state=active]:text-background">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: totalUsers, icon: Users },
                  { label: "Admins", value: adminCount, icon: Shield },
                  { label: "Suspended", value: suspendedCount, icon: Activity },
                  { label: "Active (7d)", value: recentLogins, icon: BarChart3 },
                ].map((stat, i) => (
                  <Card key={i} className="border-border/40 shadow-card">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <p className="text-3xl font-semibold text-foreground">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/40 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {activityLogs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    ) : (
                      <div className="space-y-3">
                        {activityLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-foreground/40 mt-1.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">{log.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">Recent Audit Trail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {auditLogs.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No audit entries</p>
                    ) : (
                      <div className="space-y-3">
                        {auditLogs.slice(0, 5).map((log) => (
                          <div key={log.id} className="flex items-start gap-3 text-sm">
                            <div className="w-2 h-2 rounded-full bg-foreground/40 mt-1.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium">{log.action}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(log.created_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Invite User */}
              <Card className="border-border/40 shadow-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Invite User
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-3">
                    <Input
                      type="email"
                      placeholder="Email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !inviting && handleInviteUser()}
                      className="flex-1"
                    />
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger className="w-full md:w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        {isOwner && <SelectItem value="owner">Owner</SelectItem>}
                      </SelectContent>
                    </Select>
                    <Button onClick={handleInviteUser} disabled={inviting} className="md:w-auto">
                      {inviting ? "Sending..." : "Send Invite"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <CSVImport onImportComplete={fetchUsers} />

              <div className="flex justify-end">
                <Button onClick={handleExportUsers} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Export CSV
                </Button>
              </div>

              {/* User List */}
              {loadingUsers ? (
                <div className="text-center py-12 text-muted-foreground text-sm">Loading users...</div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No users found</div>
              ) : (
                <div className="space-y-3">
                  {users.map((userItem) => (
                    <UserProfileCard
                      key={userItem.id}
                      user={userItem}
                      currentUserId={user.id}
                      isOwner={isOwner}
                      isSuspended={suspendedUsers.has(userItem.id)}
                      onRoleChange={handleChangeRole}
                      onDelete={handleDeleteUser}
                      onSuspend={handleSuspendUser}
                      onUnsuspend={handleUnsuspendUser}
                      updatingRole={updatingRole}
                      deletingUser={deletingUser}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Add College */}
                <Card className="border-border/40 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> Add College
                    </CardTitle>
                    <CardDescription>Add a college for career guidance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input value={collegeName} onChange={(e) => setCollegeName(e.target.value)} placeholder="e.g., MIT" />
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input value={collegeLocation} onChange={(e) => setCollegeLocation(e.target.value)} placeholder="e.g., Cambridge, MA" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Latitude</Label>
                        <Input type="number" step="any" value={collegeLat} onChange={(e) => setCollegeLat(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Longitude</Label>
                        <Input type="number" step="any" value={collegeLng} onChange={(e) => setCollegeLng(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Courses (comma-separated)</Label>
                      <Input value={collegeCourses} onChange={(e) => setCollegeCourses(e.target.value)} placeholder="CS, Engineering" />
                    </div>
                    <div className="space-y-2">
                      <Label>Cutoffs</Label>
                      <Input value={collegeCutoffs} onChange={(e) => setCollegeCutoffs(e.target.value)} placeholder="SAT: 1500+" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={collegeDescription} onChange={(e) => setCollegeDescription(e.target.value)} rows={2} />
                    </div>
                    <Button onClick={handleSaveCollege} disabled={isSaving} className="w-full">
                      {isSaving ? "Saving..." : "Add College"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Add School */}
                <Card className="border-border/40 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <School className="h-4 w-4" /> Add School
                    </CardTitle>
                    <CardDescription>Add a school for recommendations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="e.g., Delhi Public School" />
                    </div>
                    <div className="space-y-2">
                      <Label>Location *</Label>
                      <Input value={schoolLocation} onChange={(e) => setSchoolLocation(e.target.value)} placeholder="e.g., New Delhi" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Latitude</Label>
                        <Input type="number" step="any" value={schoolLat} onChange={(e) => setSchoolLat(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Longitude</Label>
                        <Input type="number" step="any" value={schoolLng} onChange={(e) => setSchoolLng(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Board</Label>
                      <Input value={schoolBoard} onChange={(e) => setSchoolBoard(e.target.value)} placeholder="CBSE, ICSE, IB" />
                    </div>
                    <div className="space-y-2">
                      <Label>Grade 11 Cutoff %</Label>
                      <Input type="number" step="0.01" value={schoolGrade11Cutoff} onChange={(e) => setSchoolGrade11Cutoff(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea value={schoolDescription} onChange={(e) => setSchoolDescription(e.target.value)} rows={2} />
                    </div>
                    <Button onClick={handleSaveSchool} disabled={isSaving} className="w-full">
                      {isSaving ? "Saving..." : "Add School"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* RBAC Tab */}
          <TabsContent value="permissions">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <PermissionsManager isOwner={isOwner} />
            </motion.div>
          </TabsContent>

          {/* Activity/Logs Tab */}
          <TabsContent value="activity">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="border-border/40 shadow-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Activity className="h-4 w-4" /> User Activity Log
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingLogs ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Loading...</p>
                  ) : activityLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No activity logs found</p>
                  ) : (
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activityLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium">{log.action}</TableCell>
                              <TableCell className="text-xs text-muted-foreground font-mono">{log.user_id.slice(0, 8)}...</TableCell>
                              <TableCell className="text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border/40 shadow-card">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {auditLogs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No audit entries</p>
                  ) : (
                    <div className="rounded-lg border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Action</TableHead>
                            <TableHead>Admin</TableHead>
                            <TableHead>Target</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {auditLogs.map((log) => (
                            <TableRow key={log.id}>
                              <TableCell className="font-medium">{log.action}</TableCell>
                              <TableCell className="text-xs text-muted-foreground font-mono">{log.user_id?.slice(0, 8) || '—'}...</TableCell>
                              <TableCell className="text-xs text-muted-foreground font-mono">{log.target_user_id?.slice(0, 8) || '—'}...</TableCell>
                              <TableCell className="text-sm">{new Date(log.created_at).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <EmailConfigToggle isOwner={isOwner} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
