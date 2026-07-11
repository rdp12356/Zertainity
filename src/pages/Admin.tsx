import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { 
  Building2, School, Users, Shield, Activity, 
  AlertCircle, FileText, Download, LayoutDashboard, Briefcase, 
  Settings, Database, BarChart3, UserRoundCheck, LibraryBig, Moon
} from "lucide-react";

import { AdminOverview } from "@/components/admin/AdminOverview";
import { AnalyticsPanel } from "@/components/admin/AnalyticsPanel";
import { CareersCatalogView } from "@/components/admin/CareersCatalogView";
import { ContentOperationsPanel } from "@/components/admin/ContentOperationsPanel";
import { CSVImport } from "@/components/admin/CSVImport";
import { DataSourcesPanel } from "@/components/admin/DataSourcesPanel";
import { EmailConfigToggle } from "@/components/admin/EmailConfigToggle";
import { PdfTemplateManager } from "@/components/admin/PdfTemplateManager";
import { PermissionsManager } from "@/components/admin/PermissionsManager";
import { StudentInsightsPanel } from "@/components/admin/StudentInsightsPanel";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { escapeHtml, sanitizePdfFilename } from "@/utils/html";

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
  invited_at?: string | null;
  is_pending_invite?: boolean;
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
  
  // Navigation active tab state
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Users management state
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("user");
  const [inviting, setInviting] = useState(false);
  const [userStatusFilter, setUserStatusFilter] = useState<'all' | 'active' | 'pending' | 'suspended'>('all');
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [suspendedUsers, setSuspendedUsers] = useState<Set<string>>(new Set());

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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);

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

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [impersonatedUserId, setImpersonatedUserId] = useState<string | null>(() => {
    return localStorage.getItem('z_impersonate_user_id');
  });
  const [impersonatedProfile, setImpersonatedProfile] = useState<any | null>(() => {
    try {
      const stored = localStorage.getItem('z_impersonate_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const handleGenerateTestPDF = async () => {
    const pdfFilename = sanitizePdfFilename(`zertainity-sample-${new Date().toISOString().split('T')[0]}.pdf`);
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Sample Assessment</title>
          <style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#111}</style>
        </head>
        <body>
          <h1>Zertainity - Sample Assessment</h1>
          <p>Generated for admin: ${escapeHtml(user?.email || 'admin')}</p>
          <h2>Top Recommendation</h2>
          <p><strong>Software Engineer</strong> — Strong match based on sample data.</p>
          <h3>Subject Highlights</h3>
          <ul><li>Math: 92</li><li>Physics: 88</li><li>CS: 95</li></ul>
        </body>
      </html>
    `;

    setGeneratingPdf(true);
    try {
      const sessionResp = await supabase.auth.getSession();
      const token = sessionResp.data.session?.access_token;
      if (!token) throw new Error('No authenticated session found');

      const { data: blob, error: functionError } = await supabase.functions.invoke('generate-pdf', {
        headers: { Authorization: `Bearer ${token}` },
        body: {
          html,
          filename: pdfFilename,
          author: 'Zertainity Admin',
          subject: 'Sample Assessment Report',
        }
      });

      if (functionError || !blob) {
        throw new Error(functionError?.message || 'PDF generation service failed');
      }

      const url = window.URL.createObjectURL(blob as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFilename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast({ title: 'Success', description: 'Sample PDF downloaded' });
    } catch (error: any) {
      console.error('Generate PDF error, trying local fallback:', error);
      try {
        const { generatePdfFallback } = await import('@/utils/pdfGenerator');
        await generatePdfFallback(html, pdfFilename);
        toast({ title: 'Success', description: 'Sample PDF downloaded (local fallback)' });
      } catch (fallbackError) {
        console.error('Client-side fallback failed:', fallbackError);
        toast({
          title: 'Error',
          description: 'Failed to generate PDF.',
          variant: 'destructive',
        });
      }
    } finally {
      setGeneratingPdf(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const sessionResp = await supabase.auth.getSession();
      const token = sessionResp.data.session?.access_token;

      if (!token) {
        throw new Error('No authenticated session found');
      }

      const { data, error } = await supabase.functions.invoke('list-users', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;

      const fetchedUsers = (data?.users || []).map((userItem: any) => ({
        id: userItem.id,
        email: userItem.email,
        created_at: userItem.created_at,
        last_sign_in_at: userItem.last_sign_in_at,
        invited_at: userItem.invited_at,
        is_pending_invite: Boolean(userItem.is_pending_invite),
        roles: userItem.roles || [],
      }));

      setUsers(fetchedUsers);

      const suspendedIds = new Set<string>((data?.users || []).filter((userItem: any) => userItem.is_suspended).map((userItem: any) => String(userItem.id)));
      setSuspendedUsers(suspendedIds);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users. Check your admin session and edge function deployment.',
        variant: 'destructive',
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

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
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || payload?.message || 'Failed to invite user');
      }

      toast({
        title: "Success",
        description: payload?.message || `Invitation sent to ${inviteEmail} as ${inviteRole}.`
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
      // @ts-ignore
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

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchActivityLogs();
      fetchAuditLogs();
    }
  }, [isAdmin]);

  // Check for impersonation token in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('impersonate_token');
    if (token) {
      (async () => {
        try {
          const { data, error } = await supabase.functions.invoke('consume-impersonation', { body: { token } });
          if (error) throw error;
          // @ts-ignore
          const payload = data?.target_user_id ? data : (await (data as any)) || null;
          const targetUserId = payload?.target_user_id || payload?.targetUserId || null;
          if (targetUserId) {
            localStorage.setItem('z_impersonate_user_id', targetUserId);
            if (payload?.profile?.email) {
              localStorage.setItem('z_impersonate_user_email', payload.profile.email);
            }
            if (payload?.profile) {
              localStorage.setItem('z_impersonate_profile', JSON.stringify(payload.profile));
            }
            setImpersonatedUserId(targetUserId);
            setImpersonatedProfile(payload?.profile || null);
          }
        } catch (err) {
          console.error('Failed to consume impersonation token', err);
        }
      })();
    }
  }, []);

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
      // @ts-ignore
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
    }
  };

  const handleUnsuspendUser = async (userId: string, email: string) => {
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

  const handleStopImpersonation = () => {
    localStorage.removeItem('z_impersonate_user_id');
    localStorage.removeItem('z_impersonate_user_email');
    localStorage.removeItem('z_impersonate_profile');
    const url = new URL(window.location.href);
    url.searchParams.delete('impersonate_token');
    window.history.replaceState({}, '', url.toString());
    window.location.reload();
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'users') fetchUsers();
    if (tab === 'activity') fetchActivityLogs();
    if (tab === 'audit') fetchAuditLogs();
  };

  const filteredUsers = users.filter((userItem) => {
    if (userStatusFilter === 'pending') return Boolean(userItem.is_pending_invite);
    if (userStatusFilter === 'active') return !userItem.is_pending_invite && !suspendedUsers.has(userItem.id);
    if (userStatusFilter === 'suspended') return suspendedUsers.has(userItem.id);
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center font-sans">
        <p className="text-xs text-zinc-500 font-mono">Loading credentials...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-4 font-sans">
        <Card className="border border-[#E4E4E7] w-full max-w-sm rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <CardHeader className="text-center p-6 border-b border-[#E4E4E7]">
            <CardTitle className="text-sm font-semibold text-[#0F0F0F]">Authentication Required</CardTitle>
            <CardDescription className="text-xs text-zinc-500 mt-1">You must sign in to view the control panel</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <button 
              onClick={() => navigate("/auth")} 
              className="w-full h-8 bg-[#18181B] text-white hover:bg-zinc-800 text-xs font-semibold rounded-[4px] transition-all"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate("/")} 
              className="w-full h-8 border border-[#E4E4E7] text-zinc-700 hover:bg-[#F4F4F5] text-xs font-semibold rounded-[4px] transition-all bg-white"
            >
              Back to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F4F4F5] flex items-center justify-center p-4 font-sans">
        <Card className="border border-[#E4E4E7] w-full max-w-sm rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <CardHeader className="text-center p-6 border-b border-[#E4E4E7]">
            <CardTitle className="text-sm font-semibold text-[#0F0F0F]">Access Denied</CardTitle>
            <CardDescription className="text-xs text-zinc-500 mt-1">
              You do not have administrative privileges. Contact support if this is an error.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <button 
              onClick={() => navigate("/")} 
              className="w-full h-8 border border-[#E4E4E7] text-zinc-700 hover:bg-[#F4F4F5] text-xs font-semibold rounded-[4px] transition-all bg-white"
            >
              Back to Home
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Helper components for modular rendering inside Main workspace
  const SidebarLink = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => handleTabChange(id)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#0F0F0F] transition-colors rounded-none ${
          isActive
            ? "bg-[#F4F4F5] border-l-2 border-[#18181B] font-semibold"
            : "border-l-2 border-transparent hover:bg-[#F4F4F5] font-normal text-zinc-600"
        }`}
      >
        <Icon className="h-3.5 w-3.5 text-zinc-500" />
        <span>{label}</span>
      </button>
    );
  };

  const UserDirectoryView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#0F0F0F] tracking-tight">User Management</h2>
        <p className="text-[13px] text-zinc-500 mt-0.5">Manage administrators, team member roles, and verify student permissions.</p>
      </div>

      {/* Invite New User Card */}
      <Card className="bg-white border border-[#E4E4E7] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
        <CardHeader className="p-4 border-b border-[#E4E4E7] bg-white">
          <CardTitle className="text-xs font-semibold text-[#0F0F0F] uppercase tracking-wider">Invite New User</CardTitle>
          <CardDescription className="text-xs text-zinc-500">Add moderators, managers, or administrative staff.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="invite-email" className="text-xs font-semibold text-zinc-600">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="email@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B] focus-visible:ring-offset-2 bg-white"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !inviting) {
                    handleInviteUser();
                  }
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-role" className="text-xs font-semibold text-zinc-600">Assign Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="invite-role" className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus:ring-[#18181B] bg-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-[4px] border-[#E4E4E7]">
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <button
            onClick={handleInviteUser}
            disabled={inviting}
            className="w-full h-8 bg-[#18181B] hover:bg-zinc-800 text-white text-xs font-semibold rounded-[4px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {inviting ? "Sending..." : "Send Invitation"}
          </button>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="bg-white border border-[#E4E4E7] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Total Users</div>
          <div className="text-2xl font-semibold tracking-tight text-[#0F0F0F] z-mono-font tabular-nums">
            {loadingUsers ? "..." : users.length.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Pending Invitations</div>
          <div className="text-2xl font-semibold tracking-tight text-[#D97706] z-mono-font tabular-nums">
            {loadingUsers ? "..." : users.filter((u) => u.is_pending_invite).length.toLocaleString()}
          </div>
        </div>
        <div className="bg-white border border-[#E4E4E7] rounded-[6px] p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Active Users</div>
          <div className="text-2xl font-semibold tracking-tight text-[#16A34A] z-mono-font tabular-nums">
            {loadingUsers ? "..." : users.filter((u) => !u.is_pending_invite && !suspendedUsers.has(u.id)).length.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Underline Tabs */}
      <div className="border-b border-[#E4E4E7] flex gap-6 text-xs select-none">
        {([
          ['all', 'All users'],
          ['active', 'Active'],
          ['pending', 'Pending invitations'],
          ['suspended', 'Suspended'],
        ] as const).map(([value, label]) => {
          const isActive = userStatusFilter === value;
          return (
            <button
              key={value}
              onClick={() => setUserStatusFilter(value)}
              className={`pb-2 transition-all rounded-none border-b-2 ${
                isActive
                  ? "border-[#18181B] font-semibold text-[#0F0F0F]"
                  : "border-transparent text-zinc-500 hover:text-[#0F0F0F]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* CSV Import Panel / CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-1">
        <CSVImport onImportComplete={fetchUsers} />
        <button
          onClick={handleExportUsers}
          className="h-8 px-3 text-xs font-semibold border border-[#E4E4E7] hover:bg-[#FAFAFA] rounded-[4px] flex items-center gap-1.5 active:scale-95 transition-all text-zinc-700 bg-white"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#E4E4E7] rounded-[6px] overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white border-b border-[#E4E4E7]">
              <TableRow className="hover:bg-transparent border-b border-[#E4E4E7]">
                <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Name</TableHead>
                <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Email</TableHead>
                <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Role</TableHead>
                <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Status</TableHead>
                <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Joined</TableHead>
                <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingUsers ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-xs text-zinc-500 bg-white">
                    Loading directory...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-xs text-zinc-500 bg-white">
                    No users matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((userItem) => {
                  const namePrefix = userItem.email.split("@")[0];
                  const formattedDate = new Date(userItem.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  });
                  const isPending = userItem.is_pending_invite;
                  const isSuspended = suspendedUsers.has(userItem.id);
                  const isCurrentUser = userItem.id === user?.id;
                  const currentRole = userItem.roles.length > 0 ? userItem.roles[0] : 'user';

                  return (
                    <TableRow 
                      key={userItem.id} 
                      className="border-b border-[#E4E4E7] last:border-b-0 hover:bg-[#FAFAFA] transition-colors"
                    >
                      <TableCell className="px-4 py-2 text-xs font-medium text-[#0F0F0F]">
                        {namePrefix} {isCurrentUser && <span className="text-[10px] text-zinc-400 font-normal ml-1"> (You)</span>}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs text-zinc-500 z-mono-font">
                        {userItem.email}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs text-zinc-700">
                        {isCurrentUser || !isOwner ? (
                          <span className="capitalize text-[11px] font-semibold">{currentRole}</span>
                        ) : (
                          <Select 
                            value={currentRole} 
                            disabled={updatingRole === userItem.id}
                            onValueChange={(val) => handleChangeRole(userItem.id, userItem.email, currentRole, val)}
                          >
                            <SelectTrigger className="h-6 w-24 text-[11px] rounded-[4px] border-[#E4E4E7] focus:ring-0 bg-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-[4px] border-[#E4E4E7]">
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs">
                        {isSuspended ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="text-red-600 font-medium text-[11px]">Suspended</span>
                          </div>
                        ) : isPending ? (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="text-amber-600 font-medium text-[11px]">Pending</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                            <span className="text-emerald-600 font-medium text-[11px]">Active</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs text-zinc-500 z-mono-font">
                        {formattedDate}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs text-right space-x-2">
                        {isCurrentUser ? (
                          <span className="text-zinc-300 text-[10px]">-</span>
                        ) : (
                          <div className="inline-flex items-center gap-3 justify-end">
                            {isSuspended ? (
                              <button 
                                onClick={() => handleUnsuspendUser(userItem.id, userItem.email)}
                                className="text-emerald-600 hover:text-emerald-700 font-semibold text-[11px]"
                              >
                                Unsuspend
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleSuspendUser(userItem.id, userItem.email)}
                                className="text-amber-600 hover:text-amber-700 font-semibold text-[11px]"
                              >
                                Suspend
                              </button>
                            )}
                            
                            {isOwner && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button className="text-red-600 hover:text-red-700 font-semibold text-[11px]">
                                    Delete
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-[6px] border-[#E4E4E7] bg-white">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-sm font-bold text-[#0F0F0F]">Delete Account</AlertDialogTitle>
                                    <AlertDialogDescription className="text-xs text-zinc-500 mt-1">
                                      Confirm deletion of {userItem.email}. This cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-[4px] text-xs h-7">Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteUser(userItem.id, userItem.email)}
                                      className="rounded-[4px] text-xs h-7 bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );

  const AddCollegeView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#0F0F0F] tracking-tight">Add New College</h2>
        <p className="text-[13px] text-zinc-500 mt-0.5">Integrate institutional metadata to feed the student recommendation engine.</p>
      </div>

      <Card className="bg-white border border-[#E4E4E7] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="college-name" className="text-xs font-semibold text-zinc-600">College Name *</Label>
              <Input
                id="college-name"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                placeholder="e.g., IIT Madras"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="college-location" className="text-xs font-semibold text-zinc-600">Location *</Label>
              <Input
                id="college-location"
                value={collegeLocation}
                onChange={(e) => setCollegeLocation(e.target.value)}
                placeholder="e.g., Chennai, Tamil Nadu"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="college-lat" className="text-xs font-semibold text-zinc-600">Latitude</Label>
              <Input
                id="college-lat"
                type="number"
                step="any"
                value={collegeLat}
                onChange={(e) => setCollegeLat(e.target.value)}
                placeholder="13.0067"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="college-lng" className="text-xs font-semibold text-zinc-600">Longitude</Label>
              <Input
                id="college-lng"
                type="number"
                step="any"
                value={collegeLng}
                onChange={(e) => setCollegeLng(e.target.value)}
                placeholder="80.2406"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="college-courses" className="text-xs font-semibold text-zinc-600">Courses (comma-separated)</Label>
              <Input
                id="college-courses"
                value={collegeCourses}
                onChange={(e) => setCollegeCourses(e.target.value)}
                placeholder="Computer Science, Electronics, Electrical"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="college-cutoffs" className="text-xs font-semibold text-zinc-600">Cutoff Requirements</Label>
              <Input
                id="college-cutoffs"
                value={collegeCutoffs}
                onChange={(e) => setCollegeCutoffs(e.target.value)}
                placeholder="e.g., JEE Advanced Rank < 1000"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="college-description" className="text-xs font-semibold text-zinc-600">Description</Label>
              <Textarea
                id="college-description"
                value={collegeDescription}
                onChange={(e) => setCollegeDescription(e.target.value)}
                placeholder="Details about campus facilities, NIRF ranking, and placements..."
                rows={3}
                className="text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B] bg-white"
              />
            </div>
          </div>
          
          <button
            onClick={handleSaveCollege}
            disabled={isSaving}
            className="w-full h-8 bg-[#18181B] hover:bg-zinc-800 text-white text-xs font-semibold rounded-[4px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Add College Record"}
          </button>
        </CardContent>
      </Card>
    </div>
  );

  const AddSchoolView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#0F0F0F] tracking-tight">Add New School</h2>
        <p className="text-[13px] text-zinc-500 mt-0.5">Index school profiles to align streams for grade 11 and 12 entries.</p>
      </div>

      <Card className="bg-white border border-[#E4E4E7] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="school-name" className="text-xs font-semibold text-zinc-600">School Name *</Label>
              <Input
                id="school-name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="e.g., Delhi Public School"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="school-location" className="text-xs font-semibold text-zinc-600">Location *</Label>
              <Input
                id="school-location"
                value={schoolLocation}
                onChange={(e) => setSchoolLocation(e.target.value)}
                placeholder="e.g., Sector 12, R.K. Puram, New Delhi"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="school-lat" className="text-xs font-semibold text-zinc-600">Latitude</Label>
              <Input
                id="school-lat"
                type="number"
                step="any"
                value={schoolLat}
                onChange={(e) => setSchoolLat(e.target.value)}
                placeholder="28.5724"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="school-lng" className="text-xs font-semibold text-zinc-600">Longitude</Label>
              <Input
                id="school-lng"
                type="number"
                step="any"
                value={schoolLng}
                onChange={(e) => setSchoolLng(e.target.value)}
                placeholder="77.1706"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="school-board" className="text-xs font-semibold text-zinc-600">Board Affinity</Label>
              <Input
                id="school-board"
                value={schoolBoard}
                onChange={(e) => setSchoolBoard(e.target.value)}
                placeholder="CBSE, ICSE, State Board"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="school-cutoff" className="text-xs font-semibold text-zinc-600">Grade 11 Admission Cutoff (%)</Label>
              <Input
                id="school-cutoff"
                type="number"
                step="0.01"
                value={schoolGrade11Cutoff}
                onChange={(e) => setSchoolGrade11Cutoff(e.target.value)}
                placeholder="e.g., 88.5"
                className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B]"
              />
            </div>
            
            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="school-description" className="text-xs font-semibold text-zinc-600">Description</Label>
              <Textarea
                id="school-description"
                value={schoolDescription}
                onChange={(e) => setSchoolDescription(e.target.value)}
                placeholder="Details about streams offered, admission guidelines..."
                rows={3}
                className="text-xs rounded-[4px] border-[#E4E4E7] focus-visible:ring-[#18181B] bg-white"
              />
            </div>
          </div>
          
          <button
            onClick={handleSaveSchool}
            disabled={isSaving}
            className="w-full h-8 bg-[#18181B] hover:bg-zinc-800 text-white text-xs font-semibold rounded-[4px] transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Add School Record"}
          </button>
        </CardContent>
      </Card>
    </div>
  );

  const ActivityLogView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#0F0F0F] tracking-tight">User Activity Logs</h2>
        <p className="text-[13px] text-zinc-500 mt-0.5">Review login events, action timestamps, and student navigation sessions.</p>
      </div>

      <Card className="bg-white border border-[#E4E4E7] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="user-filter" className="text-xs font-semibold text-zinc-600">Filter by User</Label>
            <Select
              value={selectedUserForLogs || "all"}
              onValueChange={(value) => {
                const userId = value === "all" ? null : value;
                setSelectedUserForLogs(userId);
                fetchActivityLogs(userId || undefined);
              }}
            >
              <SelectTrigger id="user-filter" className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus:ring-[#18181B] bg-white">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent className="rounded-[4px] border-[#E4E4E7]">
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
            <div className="text-center py-6 text-xs text-zinc-500">
              Loading logs...
            </div>
          ) : activityLogs.length === 0 ? (
            <div className="text-center py-6 text-xs text-zinc-400">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p>No activity logs found</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {activityLogs.map((log) => {
                const userEmail = users.find(u => u.id === log.user_id)?.email || 'Unknown user';
                return (
                  <div
                    key={log.id}
                    className="p-3 border border-[#E4E4E7] rounded-[4px] bg-[#FAFAFA]"
                  >
                    <div className="flex items-start justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#0F0F0F]">{userEmail}</span>
                          <span className="px-1.5 py-0.2 bg-[#F4F4F5] border border-[#E4E4E7] rounded text-[10px] font-mono text-zinc-600">
                            {log.action}
                          </span>
                        </div>
                        {log.details && (
                          <pre className="text-[10px] text-zinc-500 font-mono overflow-x-auto max-w-[600px] mt-1 bg-white border border-[#E4E4E7] p-2 rounded">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-400 z-mono-font whitespace-nowrap ml-4">
                        {new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border border-[#E4E4E7] rounded-[4px] p-3 bg-[#FAFAFA] space-y-2">
            <h4 className="font-semibold text-xs text-[#0F0F0F] flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-zinc-500" />
              Recent Login Activity
            </h4>
            <div className="space-y-1 text-xs">
              {users.slice(0, 5).map((u) => (
                <div key={u.id} className="flex items-center justify-between">
                  <span className="text-zinc-600">{u.email}</span>
                  <span className="text-zinc-400 z-mono-font">
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
    </div>
  );

  const AuditTrailView = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-[22px] font-semibold text-[#0F0F0F] tracking-tight">Audit Trail</h2>
        <p className="text-[13px] text-zinc-500 mt-0.5">Compliance records of administrative actions with historic state logs.</p>
      </div>

      <Card className="bg-white border border-[#E4E4E7] rounded-[6px] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="audit-user-filter" className="text-xs font-semibold text-zinc-600">Filter by User</Label>
            <Select
              value={selectedAuditUser || "all"}
              onValueChange={(value) => {
                setSelectedAuditUser(value);
                fetchAuditLogs(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger id="audit-user-filter" className="h-8 text-xs rounded-[4px] border-[#E4E4E7] focus:ring-[#18181B] bg-white">
                <SelectValue placeholder="All users" />
              </SelectTrigger>
              <SelectContent className="rounded-[4px] border-[#E4E4E7]">
                <SelectItem value="all">All users</SelectItem>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border border-[#E4E4E7] rounded-[4px] overflow-hidden">
            <Table>
              <TableHeader className="bg-white border-b border-[#E4E4E7]">
                <TableRow className="hover:bg-transparent border-b border-[#E4E4E7]">
                  <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Timestamp</TableHead>
                  <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Action</TableHead>
                  <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Performed By</TableHead>
                  <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">Target User</TableHead>
                  <TableHead className="text-xs font-semibold text-[#0F0F0F] h-9 px-4">IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-xs text-zinc-400 bg-white">
                      No audit events recorded.
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log.id} className="border-b border-[#E4E4E7] last:border-b-0 hover:bg-[#FAFAFA] transition-colors">
                      <TableCell className="px-4 py-2 text-xs text-zinc-500 z-mono-font">
                        {new Date(log.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs font-semibold text-[#0F0F0F]">
                        {log.action.replace('_', ' ').toUpperCase()}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs text-zinc-600">
                        {users.find(u => u.id === log.user_id)?.email || 'System'}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs text-zinc-600">
                        {users.find(u => u.id === log.target_user_id)?.email || 
                         log.before_snapshot?.email || 
                         log.after_snapshot?.email || 
                         '-'}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-xs text-zinc-400 font-mono">
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
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F4F5] flex font-sans text-[#0F0F0F] z-panel-font antialiased">
      <SEO title="Zertainity Control Panel" description="Platform administration and directory console." canonical="/admin" noindex />
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
        .z-panel-font {
          font-family: 'Inter', -apple-system, sans-serif;
        }
        .z-mono-font {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Fixed Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[220px] bg-[#FAFAFA] border-r border-[#E4E4E7] flex flex-col z-30 select-none">
        {/* Top Logo */}
        <div className="h-14 border-b border-[#E4E4E7] flex items-center px-4 gap-2 shrink-0">
          <div className="w-5 h-5 bg-[#0F0F0F] rounded-sm flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-[#FFFFFF] rotate-45" />
          </div>
          <span className="font-semibold text-xs tracking-tight text-[#0F0F0F] uppercase">Control Panel</span>
        </div>
        
        {/* Sidebar Nav Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
           <div>
             <div className="px-3 mb-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Monitoring</div>
             <div className="space-y-0.5">
                <SidebarLink id="overview" label="Overview" icon={LayoutDashboard} />
                <SidebarLink id="analytics" label="Analytics" icon={BarChart3} />
                <SidebarLink id="activity" label="Activity Log" icon={Activity} />
                <SidebarLink id="audit" label="Audit Trail" icon={FileText} />
             </div>
           </div>
           
           <div>
             <div className="px-3 mb-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Student Data</div>
             <div className="space-y-0.5">
                <SidebarLink id="students" label="Student Insights" icon={UserRoundCheck} />
                <SidebarLink id="users" label="User Directory" icon={Users} />
             </div>
           </div>

           <div>
             <div className="px-3 mb-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Database Registry</div>
             <div className="space-y-0.5">
                <SidebarLink id="colleges" label="Add College" icon={Building2} />
                <SidebarLink id="schools" label="Add School" icon={School} />
                <SidebarLink id="careers" label="Careers Catalog" icon={Briefcase} />
                <SidebarLink id="data-sources" label="Data Sources" icon={Database} />
             </div>
           </div>

           <div>
             <div className="px-3 mb-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">System Utilities</div>
             <div className="space-y-0.5">
                <SidebarLink id="pdf-studio" label="PDF Studio" icon={FileText} />
                <SidebarLink id="content-ops" label="Content Ops" icon={LibraryBig} />
                <SidebarLink id="permissions" label="Permissions" icon={Shield} />
                <SidebarLink id="settings" label="Settings" icon={Settings} />
             </div>
           </div>
        </div>
      </aside>
      
      {/* Right Panel Workspace */}
      <div className="flex-1 pl-[220px] flex flex-col min-h-screen">
        {/* Topbar Header */}
        <header className="h-14 border-b border-[#E4E4E7] bg-white sticky top-0 z-20 flex items-center justify-between px-8 text-xs text-zinc-500 shrink-0">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />
              <span className="font-semibold text-zinc-700">System Operational</span>
            </div>
            
            <div className="w-px h-3 bg-[#E4E4E7]" />
            <div className="z-mono-font text-[11px]">v1.2.0</div>
            <div className="w-px h-3 bg-[#E4E4E7]" />

            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#18181B] rounded-full" />
              <span>Cloudflare Edge: Active</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {impersonatedUserId && (
              <div className="flex items-center gap-2 px-2.5 py-1 bg-amber-50 rounded border border-amber-200 text-amber-800 text-[10px] font-medium">
                <span>Impersonating: {impersonatedProfile?.email || impersonatedUserId}</span>
                <button 
                  onClick={handleStopImpersonation}
                  className="underline hover:text-amber-950 font-bold ml-1"
                >
                  Stop
                </button>
              </div>
            )}
            
            <button 
              onClick={handleGenerateTestPDF} 
              disabled={generatingPdf}
              className="px-2.5 py-1 text-zinc-600 border border-[#E4E4E7] hover:bg-[#F4F4F5] rounded-[4px] active:scale-95 transition-all bg-white"
            >
              {generatingPdf ? 'Generating...' : 'Test PDF'}
            </button>

            <button 
              onClick={handleLogout}
              className="px-2.5 py-1 text-zinc-600 border border-[#E4E4E7] hover:bg-[#F4F4F5] rounded-[4px] active:scale-95 transition-all bg-white"
            >
              Logout
            </button>

            <div className="w-px h-3 bg-[#E4E4E7]" />

            <div className="flex items-center gap-2 select-none">
              <div className="w-6 h-6 rounded-full bg-[#18181B] text-white flex items-center justify-center font-semibold text-[10px] z-mono-font">
                {user?.email?.substring(0, 2).toUpperCase() || "AD"}
              </div>
              <span className="text-zinc-700 font-semibold">{user?.email}</span>
            </div>
          </div>
        </header>
        
        {/* Main Panel View Workspace */}
        <main className="flex-1 p-8 max-w-5xl w-full mx-auto space-y-8">
           {activeTab === "overview" && <AdminOverview onNavigate={setActiveTab} />}
           {activeTab === "analytics" && <AnalyticsPanel />}
           {activeTab === "students" && <StudentInsightsPanel />}
           {activeTab === "content-ops" && <ContentOperationsPanel />}
           {activeTab === "pdf-studio" && <PdfTemplateManager />}
           {activeTab === "careers" && <CareersCatalogView />}
           {activeTab === "data-sources" && <DataSourcesPanel />}
           {activeTab === "permissions" && <PermissionsManager isOwner={isOwner} />}
           {activeTab === "settings" && <EmailConfigToggle isOwner={isOwner} />}
           
           {activeTab === "activity" && <ActivityLogView />}
           {activeTab === "audit" && <AuditTrailView />}
           {activeTab === "colleges" && <AddCollegeView />}
           {activeTab === "schools" && <AddSchoolView />}
           {activeTab === "users" && <UserDirectoryView />}
        </main>
      </div>
      
      {/* Floating command palette hint and dark mode toggle */}
      <div className="fixed bottom-4 right-4 flex items-center gap-3 z-40 select-none">
        <div className="bg-[#FAFAFA] border border-[#E4E4E7] text-[10px] text-zinc-400 px-2 py-0.5 rounded-[4px] shadow-sm z-mono-font">
          Ctrl+K
        </div>
        <button 
          onClick={() => {
            toast({ title: "Theme Toggle", description: "Design theme is locked to Control Panel light mode." });
          }}
          className="bg-[#FAFAFA] border border-[#E4E4E7] text-zinc-500 hover:bg-[#F4F4F5] w-7 h-7 rounded-[4px] flex items-center justify-center shadow-sm active:scale-95 transition-all"
        >
          <Moon className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Admin;
