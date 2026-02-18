import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, ArrowLeft, Building2, School, Users, Shield, ShieldOff, Mail, Crown, PenTool, UserCog, Trash2, Activity, AlertCircle, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PermissionsManager } from "@/components/admin/PermissionsManager";
import { UserProfileCard } from "@/components/admin/UserProfileCard";
import { EmailConfigToggle } from "@/components/admin/EmailConfigToggle";
import { CSVImport } from "@/components/admin/CSVImport";

// Temporary type definitions until Supabase types sync
type CollegeInsert = {
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  courses?: string[];
  cutoffs?: string;
  description?: string;
};

type SchoolInsert = {
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  board?: string;
  grade_11_cutoff?: number | null;
  description?: string;
};

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
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Users management state
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("user");
  const [inviting, setInviting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [suspendedUsers, setSuspendedUsers] = useState<Set<string>>(new Set());
  const [suspending, setSuspending] = useState<string | null>(null);

  // Activity log state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedAuditUser, setSelectedAuditUser] = useState<string>("");

  // College form state
  const [collegeName, setCollegeName] = useState("");
  const [collegeLocation, setCollegeLocation] = useState("");
  const [collegeLat, setCollegeLat] = useState("");
  const [collegeLng, setCollegeLng] = useState("");
  const [collegeCourses, setCollegeCourses] = useState("");
  const [collegeCutoffs, setCollegeCutoffs] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");

  // School form state
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
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Check if user has admin or owner role
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .in('role', ['admin', 'owner']);

        if (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: "Error",
            description: "Failed to verify admin status",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        setIsAdmin(roles && roles.length > 0);
        setIsOwner(roles?.some(r => r.role === 'owner') || false);
      } catch (error) {
        console.error('Error in admin check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users_with_roles');

      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        });
        return;
      }

      setUsers(data || []);

      // Fetch suspended users
      const { data: suspended } = await supabase
        .from('suspended_users')
        .select('user_id');

      setSuspendedUsers(new Set(suspended?.map(s => s.user_id) || []));
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handlePromoteUser = async (userId: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${userEmail} has been promoted to admin`
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user",
        variant: "destructive"
      });
    }
  };

  const handleDemoteUser = async (userId: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast({
        title: "Success",
        description: `${userEmail} has been removed from admin role`
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to demote user",
        variant: "destructive"
      });
    }
  };

  const handleChangeRole = async (userId: string, userEmail: string, oldRole: string, newRole: string) => {
    if (oldRole === newRole) return;

    setUpdatingRole(userId);
    try {
      const { error } = await supabase.functions.invoke('update-user-role', {
        body: { userId, oldRole: oldRole === 'user' ? null : oldRole, newRole }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated ${userEmail}'s role to ${newRole}`
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user role",
        variant: "destructive"
      });
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    setDeletingUser(userId);
    try {
      const { error } = await supabase.functions.invoke('delete-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${userEmail} has been deleted`
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive"
      });
    } finally {
      setDeletingUser(null);
    }
  };

  const fetchActivityLogs = async (userId?: string) => {
    setLoadingLogs(true);
    try {
      let query = supabase
        .from('user_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching activity logs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch activity logs",
          variant: "destructive"
        });
        return;
      }

      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error in fetchActivityLogs:', error);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setInviting(true);
    try {
      const { error } = await supabase.functions.invoke('invite-user', {
        body: { email: inviteEmail, role: inviteRole }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invitation sent to ${inviteEmail} as ${inviteRole}. They will receive an email to set their password.`
      });

      setInviteEmail("");
      setInviteRole("user");
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to invite user",
        variant: "destructive"
      });
    } finally {
      setInviting(false);
    }
  };

  const handleSaveCollege = async () => {
    if (!collegeName.trim() || !collegeLocation.trim()) {
      toast({ title: "Error", description: "Name and location are required", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const collegeData: CollegeInsert = {
        name: collegeName,
        location: collegeLocation,
        latitude: collegeLat ? parseFloat(collegeLat) : null,
        longitude: collegeLng ? parseFloat(collegeLng) : null,
        courses: collegeCourses.split(",").map(c => c.trim()).filter(Boolean),
        cutoffs: collegeCutoffs,
        description: collegeDescription
      };
      // @ts-ignore - Types will sync after database schema updates
      const { error } = await supabase.from("colleges").insert(collegeData);

      if (error) throw error;

      toast({ title: "Success", description: "College added successfully" });
      setCollegeName("");
      setCollegeLocation("");
      setCollegeLat("");
      setCollegeLng("");
      setCollegeCourses("");
      setCollegeCutoffs("");
      setCollegeDescription("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchAuditLogs = async (userId?: string) => {
    try {
      let query = supabase
        .from("audit_log")
        .select("*")
        .order("created_at", { ascending: false });

      if (userId) {
        query = query.or(`user_id.eq.${userId},target_user_id.eq.${userId}`);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;
      setAuditLogs(data || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      });
    }
  };

  // Blog state
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [isEditingPost, setIsEditingPost] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch blog posts",
        variant: "destructive"
      });
    } finally {
      setLoadingPosts(false);
    }
  };

  const handleSavePost = async () => {
    if (!postTitle.trim() || !postSlug.trim() || !postContent.trim()) {
      toast({
        title: "Error",
        description: "Title, Slug, and Content are required",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const postData = {
        title: postTitle,
        slug: postSlug,
        content: postContent,
        excerpt: postExcerpt,
        published: true, // Auto-publish for now
        author_id: user?.id
      };

      let error;
      if (isEditingPost) {
        const { error: updateError } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', isEditingPost);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('posts')
          .insert(postData);
        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Success",
        description: `Post ${isEditingPost ? 'updated' : 'created'} successfully`
      });

      setPostTitle("");
      setPostSlug("");
      setPostContent("");
      setPostExcerpt("");
      setIsEditingPost(null);
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save post",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully"
      });
      fetchPosts();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchActivityLogs();
      fetchAuditLogs();
      fetchPosts();
    }
  }, [isAdmin]);

  // ... (existing helper functions)

  const handleSaveSchool = async () => {
    if (!schoolName.trim() || !schoolLocation.trim()) {
      toast({ title: "Error", description: "Name and location are required", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    try {
      const schoolData: SchoolInsert = {
        name: schoolName,
        location: schoolLocation,
        latitude: schoolLat ? parseFloat(schoolLat) : null,
        longitude: schoolLng ? parseFloat(schoolLng) : null,
        board: schoolBoard,
        grade_11_cutoff: schoolGrade11Cutoff ? parseFloat(schoolGrade11Cutoff) : null,
        description: schoolDescription
      };
      // @ts-ignore - Types will sync after database schema updates
      const { error } = await supabase.from("schools").insert(schoolData);

      if (error) throw error;

      toast({ title: "Success", description: "School added successfully" });
      setSchoolName("");
      setSchoolLocation("");
      setSchoolLat("");
      setSchoolLng("");
      setSchoolBoard("");
      setSchoolGrade11Cutoff("");
      setSchoolDescription("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuspendUser = async (userId: string, email: string) => {
    setSuspending(userId);
    try {
      const { error } = await supabase.functions.invoke('suspend-user', {
        body: { userId, reason: 'Suspended by admin' }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${email} has been suspended`
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to suspend user",
        variant: "destructive"
      });
    } finally {
      setSuspending(null);
    }
  };

  const handleUnsuspendUser = async (userId: string, email: string) => {
    setSuspending(userId);
    try {
      const { error } = await supabase.functions.invoke('unsuspend-user', {
        body: { userId }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${email} has been unsuspended`
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to unsuspend user",
        variant: "destructive"
      });
    } finally {
      setSuspending(null);
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

      toast({
        title: "Success",
        description: "Users exported successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to export users",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="blog">Blog</TabsTrigger>
            <TabsTrigger value="users" onClick={() => fetchUsers()}>Users</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="activity" onClick={() => fetchActivityLogs()}>Activity</TabsTrigger>
            <TabsTrigger value="audit" onClick={() => fetchAuditLogs()}>Audit</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.filter(u => u.last_sign_in_at).length}</div>
                  <p className="text-xs text-muted-foreground">Currently active</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground">Blog articles live</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">Healthy</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest user actions across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center gap-4">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{log.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(log.created_at).toLocaleDateString()} at {new Date(log.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {activityLogs.length === 0 && <p className="text-sm text-muted-foreground">No recent activity.</p>}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Button variant="outline" className="justify-start" onClick={() => document.getElementById('user-tab-trigger')?.click()}>
                    <Users className="mr-2 h-4 w-4" /> Manage Users
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => document.getElementById('blog-tab-trigger')?.click()}>
                    <PenTool className="mr-2 h-4 w-4" /> Write New Post
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="blog">
            <Card className="shadow-card mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5 text-primary" />
                  {isEditingPost ? "Edit Post" : "Create New Post"}
                </CardTitle>
                <CardDescription>Write and publish articles for the Zertainity blog</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-title">Title</Label>
                    <Input
                      id="post-title"
                      value={postTitle}
                      onChange={(e) => {
                        setPostTitle(e.target.value);
                        if (!isEditingPost) {
                          setPostSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                        }
                      }}
                      placeholder="Article Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="post-slug">Slug</Label>
                    <Input
                      id="post-slug"
                      value={postSlug}
                      onChange={(e) => setPostSlug(e.target.value)}
                      placeholder="article-url-slug"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="post-excerpt">Excerpt</Label>
                    <Input
                      id="post-excerpt"
                      value={postExcerpt}
                      onChange={(e) => setPostExcerpt(e.target.value)}
                      placeholder="Short summary for preview cards"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="post-content">Content (Markdown)</Label>
                    <Textarea
                      id="post-content"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      placeholder="# Heading\n\nWrite your content here..."
                      className="min-h-[200px] font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  {isEditingPost && (
                    <Button variant="ghost" onClick={() => {
                      setIsEditingPost(null);
                      setPostTitle("");
                      setPostSlug("");
                      setPostContent("");
                      setPostExcerpt("");
                    }}>
                      Cancel
                    </Button>
                  )}
                  <Button variant="hero" onClick={handleSavePost} disabled={isSaving}>
                    {isSaving ? "Saving..." : (isEditingPost ? "Update Post" : "Publish Post")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <h3 className="text-xl font-semibold">Published Posts</h3>
              {loadingPosts ? (
                <p>Loading posts...</p>
              ) : (
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-lg">{post.title}</h4>
                          <p className="text-sm text-muted-foreground">/{post.slug}</p>
                          <p className="text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            setIsEditingPost(post.id);
                            setPostTitle(post.title);
                            setPostSlug(post.slug);
                            setPostContent(post.content);
                            setPostExcerpt(post.excerpt || "");
                          }}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {posts.length === 0 && <p className="text-muted-foreground">No posts found.</p>}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="colleges">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Add College
                </CardTitle>
                <CardDescription>
                  Enter college information for career guidance recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-name">College Name *</Label>
                    <Input
                      id="college-name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g., MIT, Stanford"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-location">Location *</Label>
                    <Input
                      id="college-location"
                      value={collegeLocation}
                      onChange={(e) => setCollegeLocation(e.target.value)}
                      placeholder="e.g., Cambridge, MA"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college-lat">Latitude</Label>
                    <Input
                      id="college-lat"
                      type="number"
                      step="any"
                      value={collegeLat}
                      onChange={(e) => setCollegeLat(e.target.value)}
                      placeholder="42.3601"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college-lng">Longitude</Label>
                    <Input
                      id="college-lng"
                      type="number"
                      step="any"
                      value={collegeLng}
                      onChange={(e) => setCollegeLng(e.target.value)}
                      placeholder="-71.0942"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-courses">Courses (comma-separated)</Label>
                    <Input
                      id="college-courses"
                      value={collegeCourses}
                      onChange={(e) => setCollegeCourses(e.target.value)}
                      placeholder="Computer Science, Engineering, Business"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-cutoffs">Cutoff Marks/Requirements</Label>
                    <Input
                      id="college-cutoffs"
                      value={collegeCutoffs}
                      onChange={(e) => setCollegeCutoffs(e.target.value)}
                      placeholder="e.g., SAT: 1500+, GPA: 3.8+"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-description">Description</Label>
                    <Textarea
                      id="college-description"
                      value={collegeDescription}
                      onChange={(e) => setCollegeDescription(e.target.value)}
                      placeholder="Brief description of the college..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="hero"
                    onClick={handleSaveCollege}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? "Saving..." : "Add College"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schools">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-primary" />
                  Add School
                </CardTitle>
                <CardDescription>
                  Enter school information for grade 11 recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-name">School Name *</Label>
                    <Input
                      id="school-name"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g., Delhi Public School"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-location">Location *</Label>
                    <Input
                      id="school-location"
                      value={schoolLocation}
                      onChange={(e) => setSchoolLocation(e.target.value)}
                      placeholder="e.g., New Delhi"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school-lat">Latitude</Label>
                    <Input
                      id="school-lat"
                      type="number"
                      step="any"
                      value={schoolLat}
                      onChange={(e) => setSchoolLat(e.target.value)}
                      placeholder="28.7041"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school-lng">Longitude</Label>
                    <Input
                      id="school-lng"
                      type="number"
                      step="any"
                      value={schoolLng}
                      onChange={(e) => setSchoolLng(e.target.value)}
                      placeholder="77.1025"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-board">Board</Label>
                    <Input
                      id="school-board"
                      value={schoolBoard}
                      onChange={(e) => setSchoolBoard(e.target.value)}
                      placeholder="e.g., CBSE, ICSE, IB"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-cutoff">Grade 11 Cutoff Percentage</Label>
                    <Input
                      id="school-cutoff"
                      type="number"
                      step="0.01"
                      value={schoolGrade11Cutoff}
                      onChange={(e) => setSchoolGrade11Cutoff(e.target.value)}
                      placeholder="e.g., 85.5"
                    />
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-description">Description</Label>
                    <Textarea
                      id="school-description"
                      value={schoolDescription}
                      onChange={(e) => setSchoolDescription(e.target.value)}
                      placeholder="Brief description of the school..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="hero"
                    onClick={handleSaveSchool}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? "Saving..." : "Add School"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View and manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Invite User Form */}
                <div className="mb-6 p-4 border border-border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-4">Invite New User</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="md:col-span-2">
                        <Label htmlFor="invite-email">Email Address</Label>
                        <Input
                          id="invite-email"
                          type="email"
                          placeholder="Enter email address"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !inviting) {
                              handleInviteUser();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="invite-role">Role</Label>
                        <Select value={inviteRole} onValueChange={setInviteRole}>
                          <SelectTrigger id="invite-role">
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">User</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="owner">Owner</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button
                      onClick={handleInviteUser}
                      disabled={inviting}
                      variant="hero"
                      className="w-full"
                    >
                      {inviting ? "Sending..." : "Send Invitation"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      An invitation email will be sent to the user with a link to set their password and access the platform.
                    </p>
                  </div>
                </div>

                <CSVImport onImportComplete={fetchUsers} />

                <div className="my-6 flex justify-end">
                  <Button onClick={handleExportUsers} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                {/* Users List */}
                {loadingUsers ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading users...
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((userItem) => (
                      <UserProfileCard
                        key={userItem.id}
                        user={userItem}
                        currentUserId={user?.id || ''}
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions">
            <PermissionsManager isOwner={isOwner} />
          </TabsContent>

          <TabsContent value="activity">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  User Activity Log
                </CardTitle>
                <CardDescription>
                  View login history and user actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="user-filter">Filter by User</Label>
                  <Select
                    value={selectedUserForLogs || "all"}
                    onValueChange={(value) => {
                      const userId = value === "all" ? null : value;
                      setSelectedUserForLogs(userId);
                      fetchActivityLogs(userId || undefined);
                    }}
                  >
                    <SelectTrigger id="user-filter">
                      <SelectValue placeholder="All users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      {users.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {loadingLogs ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading activity logs...
                  </div>
                ) : activityLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No activity logs found</p>
                    <p className="text-sm mt-1">User actions will appear here once logged</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto">
                    {activityLogs.map((log) => {
                      const userEmail = users.find(u => u.id === log.user_id)?.email || 'Unknown user';
                      return (
                        <div
                          key={log.id}
                          className="p-3 border border-border rounded-lg bg-muted/30"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{userEmail}</span>
                                <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                                  {log.action}
                                </span>
                              </div>
                              {log.details && (
                                <p className="text-sm text-muted-foreground">
                                  {JSON.stringify(log.details)}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                              {new Date(log.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 p-3 border border-border rounded-lg bg-muted/20">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Recent Login Activity
                  </h4>
                  <div className="space-y-2">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center justify-between text-sm">
                        <span>{u.email}</span>
                        <span className="text-muted-foreground">
                          {u.last_sign_in_at
                            ? new Date(u.last_sign_in_at).toLocaleString()
                            : 'Never signed in'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audit">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Audit Trail
                </CardTitle>
                <CardDescription>
                  Detailed logs of all administrative actions with before/after snapshots for compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="audit-user-filter">Filter by User</Label>
                  <Select
                    value={selectedAuditUser}
                    onValueChange={(value) => {
                      setSelectedAuditUser(value);
                      fetchAuditLogs(value === "all" ? undefined : value);
                    }}
                  >
                    <SelectTrigger id="audit-user-filter">
                      <SelectValue placeholder="All users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All users</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Performed By</TableHead>
                        <TableHead>Target User</TableHead>
                        <TableHead>Before</TableHead>
                        <TableHead>After</TableHead>
                        <TableHead>IP Address</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No audit logs found
                          </TableCell>
                        </TableRow>
                      ) : (
                        auditLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="text-sm">
                              {new Date(log.created_at).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant={
                                log.action === 'user_deleted' ? 'destructive' :
                                  log.action === 'role_changed' ? 'default' :
                                    'secondary'
                              }>
                                {log.action.replace('_', ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                              {users.find(u => u.id === log.user_id)?.email || 'System'}
                            </TableCell>
                            <TableCell className="text-sm">
                              {users.find(u => u.id === log.target_user_id)?.email ||
                                log.before_snapshot?.email ||
                                log.after_snapshot?.email ||
                                'N/A'}
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              {log.before_snapshot ? (
                                <pre className="max-w-[200px] overflow-x-auto">
                                  {JSON.stringify(log.before_snapshot, null, 2)}
                                </pre>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs font-mono">
                              {log.after_snapshot ? (
                                <pre className="max-w-[200px] overflow-x-auto">
                                  {JSON.stringify(log.after_snapshot, null, 2)}
                                </pre>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {log.ip_address || 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <EmailConfigToggle isOwner={isOwner} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
