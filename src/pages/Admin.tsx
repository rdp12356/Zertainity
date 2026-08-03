import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import {
  Building2, School, Users, Shield, ShieldCheck, Activity,
  FileText, LayoutDashboard, Briefcase, ClipboardList,
  Database, BarChart3, LogOut, CheckCircle2, RefreshCw,
  Sparkles, ArrowLeft, Plus, Trash2, Edit3, UserPlus,
  Ban, Check, X, Search, ShieldAlert, Download, Share2,
  Lock, Eye, History, AlertTriangle, TrendingUp, Award
} from "lucide-react";

import { SEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSetCurves } from "@/components/CurvesContext";
import { isOwnerEmail, OWNER_EMAILS } from "@/hooks/usePermission";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type UserWithRoles = {
  id: string; email: string; display_name: string; created_at: string;
  last_sign_in_at: string | null; roles: string[]; is_suspended?: boolean;
};
type CollegeItem = {
  id: string; name: string; location: string; courses: string[];
  description?: string; cutoffs?: string; latitude?: number; longitude?: number; created_at?: string;
};
type SchoolItem = {
  id: string; name: string; location: string; board?: string;
  description?: string; grade_11_cutoff?: number; latitude?: number; longitude?: number; created_at?: string;
};
type CareerItem = {
  id: string; title: string; category: string; salary: string; demand: string;
};
type ActivityLogEntry = {
  id: string; user_id: string; action: string; details: any;
  ip_address?: string; user_agent?: string; created_at: string;
};
type AuditLogEntry = {
  id: string; user_id: string | null; target_user_id: string | null;
  action: string; before_snapshot: any; after_snapshot: any;
  ip_address?: string; user_agent?: string; created_at: string;
};
type CareerHistoryEntry = {
  id: string; user_id: string; education_level: string;
  top_recommendation: string | null; top_match_percent: number | null;
  all_recommendations: any; created_at: string;
};
type SharedResultEntry = {
  id: string; slug: string; user_id: string | null; education_level: string;
  top_recommendation: string | null; top_match_percent: number | null;
  strengths: string | null; recommendations: any;
  display_name: string | null; created_at: string;
};
type RolePermissionEntry = {
  id: string; role: string; permission: string; created_at: string | null;
};

// ─── CSV EXPORT UTILITY ──────────────────────────────────────────────────────

const downloadCSV = (data: Record<string, any>[], filename: string) => {
  if (!data.length) return;
  const keys = Object.keys(data[0]);
  const csv = [
    keys.join(","),
    ...data.map(row => keys.map(k => {
      const val = row[k];
      const str = val === null || val === undefined ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
      return `"${str.replace(/"/g, '""')}"`;
    }).join(","))
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
};

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [activeOwnerEmail, setActiveOwnerEmail] = useState<string>(OWNER_EMAILS[0]);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isOwner, setIsOwner] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Data state
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("student");

  const [colleges, setColleges] = useState<CollegeItem[]>([]);
  const [collegeName, setCollegeName] = useState("");
  const [collegeLocation, setCollegeLocation] = useState("");
  const [collegeCourses, setCollegeCourses] = useState("");
  const [collegeDesc, setCollegeDesc] = useState("");
  const [collegeCutoffs, setCollegeCutoffs] = useState("");
  const [editingCollegeId, setEditingCollegeId] = useState<string | null>(null);

  const [schools, setSchools] = useState<SchoolItem[]>([]);
  const [schoolName, setSchoolName] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("");
  const [schoolBoard, setSchoolBoard] = useState("");
  const [schoolDesc, setSchoolDesc] = useState("");
  const [schoolCutoff, setSchoolCutoff] = useState("");
  const [editingSchoolId, setEditingSchoolId] = useState<string | null>(null);

  const [careers, setCareers] = useState<CareerItem[]>([]);
  const [careerTitle, setCareerTitle] = useState("");
  const [careerCategory, setCareerCategory] = useState("");
  const [careerSalary, setCareerSalary] = useState("");
  const [careerDemand, setCareerDemand] = useState("High");
  const [editingCareerId, setEditingCareerId] = useState<string | null>(null);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editUserDisplayName, setEditUserDisplayName] = useState("");
  const [editUserBio, setEditUserBio] = useState("");
  const [editUserPhone, setEditUserPhone] = useState("");
  const [editUserLocation, setEditUserLocation] = useState("");

  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [careerHistory, setCareerHistory] = useState<CareerHistoryEntry[]>([]);
  const [sharedResults, setSharedResults] = useState<SharedResultEntry[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissionEntry[]>([]);
  const [searchLogs, setSearchLogs] = useState("");

  // New permission form
  const [newPermRole, setNewPermRole] = useState("user");
  const [newPermission, setNewPermission] = useState("view_all");

  const isAdminDomain = window.location.hostname === 'admin.zertainity.in';

  // ─── BACKGROUND CURVES ────────────────────────────────────────────────────
  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([
      { d: "M -160 220 C -40 160, 120 140, 320 180 S 600 280, 900 220", strokeOpacity: 0.16, strokeWidth: 5 },
      { d: "M -160 220 C -40 160, 120 140, 320 180 S 600 280, 900 220", strokeOpacity: 0.45, strokeWidth: 1.4 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

  // ─── AUTH CHECK ────────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          if (session.user.email && isOwnerEmail(session.user.email)) {
            setActiveOwnerEmail(session.user.email);
          }
        }
      } catch (e) { console.warn("Auth check:", e); }
      finally { setLoading(false); }
    };
    checkAuth();
  }, []);

  // ─── FETCH FUNCTIONS ───────────────────────────────────────────────────────

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      // Fetch display names from user_profiles
      const { data: profiles } = await supabase.from('user_profiles').select('id, display_name');
      const nameMap: Record<string, string> = {};
      if (profiles) profiles.forEach(p => { if (p.display_name) nameMap[p.id] = p.display_name; });

      const sess = await supabase.auth.getSession();
      const token = sess.data.session?.access_token;
      const { data: ed, error: ee } = await supabase.functions.invoke('list-users', {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!ee && ed?.users?.length) {
        setUsers(ed.users.map((u: any) => ({
          id: u.id, email: u.email || u.id, display_name: nameMap[u.id] || u.display_name || "",
          created_at: u.created_at || new Date().toISOString(),
          last_sign_in_at: u.last_sign_in_at, roles: isOwnerEmail(u.email) ? ["owner"] : (u.roles || ["student"]),
          is_suspended: Boolean(u.is_suspended)
        })));
        return;
      }
      const { data: rpc } = await supabase.rpc('get_all_users_with_roles');
      if (rpc?.length) {
        setUsers(rpc.map((u: any) => ({
          id: u.id, email: u.email || u.id, display_name: nameMap[u.id] || "",
          created_at: u.created_at || new Date().toISOString(),
          last_sign_in_at: u.last_sign_in_at, roles: isOwnerEmail(u.email) ? ["owner"] : (u.roles || ["student"]),
        })));
        return;
      }
      // Fallback: owner accounts
      setUsers(OWNER_EMAILS.map((e, i) => ({
        id: `usr-owner-${i}`, email: e, display_name: e.split('@')[0], created_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(), roles: ["owner"]
      })));
    } catch (e) { console.warn("fetchUsers:", e); }
    finally { setLoadingUsers(false); }
  }, []);

  const fetchColleges = useCallback(async () => {
    try {
      const { data } = await supabase.from('colleges').select('*').order('created_at', { ascending: false });
      if (data?.length) setColleges(data.map(c => ({
        id: c.id, name: c.name, location: c.location, courses: c.courses || [],
        description: c.description || "", cutoffs: c.cutoffs || "",
        latitude: c.latitude, longitude: c.longitude, created_at: c.created_at
      })));
    } catch (e) { console.warn("fetchColleges:", e); }
  }, []);

  const fetchSchools = useCallback(async () => {
    try {
      const { data } = await supabase.from('schools').select('*').order('created_at', { ascending: false });
      if (data?.length) setSchools(data.map(s => ({
        id: s.id, name: s.name, location: s.location, board: s.board || "CBSE",
        description: s.description || "", grade_11_cutoff: s.grade_11_cutoff,
        latitude: s.latitude, longitude: s.longitude, created_at: s.created_at
      })));
    } catch (e) { console.warn("fetchSchools:", e); }
  }, []);

  const fetchCareers = useCallback(async () => {
    try {
      const { data } = await supabase.from('careers').select('*').order('created_at', { ascending: false });
      if (data) setCareers(data.map(c => ({
        id: c.id, title: c.title, category: c.category, salary: c.salary || "", demand: c.demand || "High", created_at: c.created_at
      })));
    } catch (e) { console.warn("fetchCareers:", e); }
  }, []);

  const fetchActivityLogs = useCallback(async () => {
    try {
      const { data } = await supabase.from('user_activity_log').select('*').order('created_at', { ascending: false }).limit(200);
      if (data) setActivityLogs(data);
    } catch (e) { console.warn("fetchActivityLogs:", e); }
  }, []);

  const fetchAuditLogs = useCallback(async () => {
    try {
      const { data } = await supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(200);
      if (data) setAuditLogs(data);
    } catch (e) { console.warn("fetchAuditLogs:", e); }
  }, []);

  const fetchCareerHistory = useCallback(async () => {
    try {
      const { data } = await supabase.from('career_history').select('*').order('created_at', { ascending: false }).limit(500);
      if (data) setCareerHistory(data);
    } catch (e) { console.warn("fetchCareerHistory:", e); }
  }, []);

  const fetchSharedResults = useCallback(async () => {
    try {
      const { data } = await supabase.from('shared_results').select('*').order('created_at', { ascending: false }).limit(500);
      if (data) setSharedResults(data);
    } catch (e) { console.warn("fetchSharedResults:", e); }
  }, []);

  const fetchRolePermissions = useCallback(async () => {
    try {
      const { data } = await supabase.from('role_permissions').select('*').order('created_at', { ascending: false });
      if (data) setRolePermissions(data);
    } catch (e) { console.warn("fetchRolePermissions:", e); }
  }, []);

  // ─── INIT + REALTIME SUBSCRIPTIONS (7 CHANNELS) ───────────────────────────

  useEffect(() => {
    fetchUsers(); fetchColleges(); fetchSchools();
    fetchActivityLogs(); fetchAuditLogs();
    fetchCareerHistory(); fetchSharedResults(); fetchRolePermissions();

    const ch1 = supabase.channel('rt-colleges').on('postgres_changes', { event: '*', schema: 'public', table: 'colleges' }, () => fetchColleges()).subscribe();
    const ch2 = supabase.channel('rt-schools').on('postgres_changes', { event: '*', schema: 'public', table: 'schools' }, () => fetchSchools()).subscribe();
    const ch3 = supabase.channel('rt-profiles').on('postgres_changes', { event: '*', schema: 'public', table: 'user_profiles' }, () => fetchUsers()).subscribe();
    const ch4 = supabase.channel('rt-activity').on('postgres_changes', { event: '*', schema: 'public', table: 'user_activity_log' }, () => fetchActivityLogs()).subscribe();
    const ch5 = supabase.channel('rt-audit').on('postgres_changes', { event: '*', schema: 'public', table: 'audit_log' }, () => fetchAuditLogs()).subscribe();
    const ch6 = supabase.channel('rt-history').on('postgres_changes', { event: '*', schema: 'public', table: 'career_history' }, () => fetchCareerHistory()).subscribe();
    const ch7 = supabase.channel('rt-shared').on('postgres_changes', { event: '*', schema: 'public', table: 'shared_results' }, () => fetchSharedResults()).subscribe();
    const ch8 = supabase.channel('rt-careers').on('postgres_changes', { event: '*', schema: 'public', table: 'careers' }, () => fetchCareers()).subscribe();

    return () => { [ch1,ch2,ch3,ch4,ch5,ch6,ch7,ch8].forEach(c => supabase.removeChannel(c)); };
  }, [fetchUsers, fetchColleges, fetchSchools, fetchCareers, fetchActivityLogs, fetchAuditLogs, fetchCareerHistory, fetchSharedResults, fetchRolePermissions]);

  // ─── USER CRUD ─────────────────────────────────────────────────────────────

  const handleCreateUser = async () => {
    if (!newUserEmail.trim()) { toast({ title: "Error", description: "Email required.", variant: "destructive" }); return; }
    const id = `usr-${Date.now().toString().slice(-6)}`;
    try {
      await supabase.from('user_profiles').insert({ id, display_name: newUserEmail.trim() });
      await supabase.from('user_roles').insert({ user_id: id, role: newUserRole as any });
    } catch (e) { console.warn("Create user DB:", e); }
    setUsers(p => [{ id, email: newUserEmail.trim(), display_name: newUserEmail.trim(), created_at: new Date().toISOString(), last_sign_in_at: null, roles: [newUserRole] }, ...p]);
    toast({ title: "User Created", description: `${newUserEmail} added as ${newUserRole}.` });
    setNewUserEmail(""); setShowAddUserModal(false);
  };

  const handleUpdateRole = async (uid: string, email: string, role: string) => {
    try { await supabase.from('user_roles').upsert({ user_id: uid, role: role as any }); } catch (e) { console.warn(e); }
    setUsers(p => p.map(u => u.id === uid ? { ...u, roles: [role] } : u));
    toast({ title: "Role Updated", description: `${email} → ${role}` });
  };

  const handleToggleSuspend = async (uid: string, email: string, suspended?: boolean) => {
    try {
      if (!suspended) await supabase.from('suspended_users').insert({ user_id: uid, reason: 'Admin suspension' });
      else await supabase.from('suspended_users').delete().eq('user_id', uid);
    } catch (e) { console.warn(e); }
    setUsers(p => p.map(u => u.id === uid ? { ...u, is_suspended: !suspended } : u));
    toast({ title: !suspended ? "Suspended" : "Re-activated", description: email });
  };

  const handleDeleteUser = async (uid: string, email: string) => {
    try {
      await supabase.from('user_roles').delete().eq('user_id', uid);
      await supabase.from('user_profiles').delete().eq('id', uid);
      await supabase.from('suspended_users').delete().eq('user_id', uid);
      const sess = await supabase.auth.getSession();
      if (sess.data.session?.access_token) {
        await supabase.functions.invoke('delete-user', { headers: { Authorization: `Bearer ${sess.data.session.access_token}` }, body: { user_id: uid } });
      }
    } catch (e) { console.warn(e); }
    setUsers(p => p.filter(u => u.id !== uid));
    toast({ title: "User Deleted", description: `${email} removed from Supabase.` });
  };

  // ─── COLLEGE CRUD ──────────────────────────────────────────────────────────

  const handleSaveCollege = async () => {
    if (!collegeName.trim() || !collegeLocation.trim()) { toast({ title: "Error", description: "Name & location required.", variant: "destructive" }); return; }
    const courseList = collegeCourses ? collegeCourses.split(",").map(c => c.trim()) : [];
    const payload = { name: collegeName, location: collegeLocation, courses: courseList, description: collegeDesc || null, cutoffs: collegeCutoffs || null };
    try {
      if (editingCollegeId) {
        await supabase.from('colleges').update(payload).eq('id', editingCollegeId);
        setColleges(p => p.map(c => c.id === editingCollegeId ? { ...c, ...payload, courses: courseList } : c));
        toast({ title: "College Updated", description: collegeName });
        setEditingCollegeId(null);
      } else {
        const { data } = await supabase.from('colleges').insert(payload).select();
        if (data?.[0]) setColleges(p => [{ ...data[0], courses: data[0].courses || courseList }, ...p]);
        toast({ title: "College Created", description: `${collegeName} saved to Supabase.` });
      }
    } catch (e) { console.warn(e); }
    setCollegeName(""); setCollegeLocation(""); setCollegeCourses(""); setCollegeDesc(""); setCollegeCutoffs("");
  };

  const handleDeleteCollege = async (id: string, name: string) => {
    try { await supabase.from('colleges').delete().eq('id', id); } catch (e) { console.warn(e); }
    setColleges(p => p.filter(c => c.id !== id));
    toast({ title: "College Deleted", description: `${name} removed from Supabase.` });
  };

  // ─── SCHOOL CRUD ───────────────────────────────────────────────────────────

  const handleSaveSchool = async () => {
    if (!schoolName.trim() || !schoolLocation.trim()) { toast({ title: "Error", description: "Name & location required.", variant: "destructive" }); return; }
    const payload = { name: schoolName, location: schoolLocation, board: schoolBoard || "CBSE", description: schoolDesc || null, grade_11_cutoff: schoolCutoff ? Number(schoolCutoff) : null };
    try {
      if (editingSchoolId) {
        await supabase.from('schools').update(payload).eq('id', editingSchoolId);
        setSchools(p => p.map(s => s.id === editingSchoolId ? { ...s, ...payload } : s));
        toast({ title: "School Updated", description: schoolName });
        setEditingSchoolId(null);
      } else {
        const { data } = await supabase.from('schools').insert(payload).select();
        if (data?.[0]) setSchools(p => [{ ...data[0] }, ...p]);
        toast({ title: "School Created", description: `${schoolName} saved to Supabase.` });
      }
    } catch (e) { console.warn(e); }
    setSchoolName(""); setSchoolLocation(""); setSchoolBoard(""); setSchoolDesc(""); setSchoolCutoff("");
  };

  const handleDeleteSchool = async (id: string, name: string) => {
    try { await supabase.from('schools').delete().eq('id', id); } catch (e) { console.warn(e); }
    setSchools(p => p.filter(s => s.id !== id));
    toast({ title: "School Deleted", description: `${name} removed from Supabase.` });
  };

  // ─── USER PROFILE CRUD ─────────────────────────────────────────────────────

  const handleSaveUserProfile = async () => {
    if (!editingUserId) return;
    try {
      const updates = {
        display_name: editUserDisplayName,
        phone_number: editUserPhone,
        location: editUserLocation,
        bio: editUserBio,
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase.from('user_profiles').update(updates).eq('id', editingUserId);
      if (error) throw error;
      toast({ title: "Success", description: "User profile updated." });
      setEditingUserId(null);
      // realtime subscription will fetchUsers
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to update profile.", variant: "destructive" });
    }
  };

  // ─── CAREER CRUD ───────────────────────────────────────────────────────────

  const handleSaveCareer = async () => {
    if (!careerTitle.trim() || !careerCategory.trim()) { toast({ title: "Error", description: "Title & category required.", variant: "destructive" }); return; }
    try {
      if (editingCareerId) {
        const { error } = await supabase.from('careers').update({
          title: careerTitle, category: careerCategory, salary: careerSalary, demand: careerDemand
        }).eq('id', editingCareerId);
        if (error) throw error;
        toast({ title: "Career Updated", description: careerTitle });
      } else {
        const id = `car-${Date.now().toString().slice(-4)}`;
        const { error } = await supabase.from('careers').insert({
          id, title: careerTitle, category: careerCategory, salary: careerSalary, demand: careerDemand
        });
        if (error) throw error;
        toast({ title: "Career Added", description: careerTitle });
      }
      setEditingCareerId(null); setCareerTitle(""); setCareerCategory(""); setCareerSalary(""); setCareerDemand("High");
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to save career.", variant: "destructive" });
    }
  };

  const handleDeleteCareer = async (id: string, title: string) => {
    try {
      const { error } = await supabase.from('careers').delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Career Removed", description: title });
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to delete career.", variant: "destructive" });
    }
  };

  // ─── ACTIVITY / AUDIT LOG DELETE ───────────────────────────────────────────

  const handleDeleteActivityLog = async (id: string) => {
    try { await supabase.from('user_activity_log').delete().eq('id', id); } catch (e) { console.warn(e); }
    setActivityLogs(p => p.filter(l => l.id !== id));
    toast({ title: "Activity Log Deleted" });
  };

  const handleDeleteAuditLog = async (id: string) => {
    try { await supabase.from('audit_log').delete().eq('id', id); } catch (e) { console.warn(e); }
    setAuditLogs(p => p.filter(l => l.id !== id));
    toast({ title: "Audit Log Deleted" });
  };

  // ─── CAREER HISTORY DELETE ─────────────────────────────────────────────────

  const handleDeleteCareerHistory = async (id: string) => {
    try { await supabase.from('career_history').delete().eq('id', id); } catch (e) { console.warn(e); }
    setCareerHistory(p => p.filter(h => h.id !== id));
    toast({ title: "Assessment Deleted" });
  };

  // ─── SHARED RESULTS DELETE ─────────────────────────────────────────────────

  const handleDeleteSharedResult = async (id: string) => {
    try { await supabase.from('shared_results').delete().eq('id', id); } catch (e) { console.warn(e); }
    setSharedResults(p => p.filter(r => r.id !== id));
    toast({ title: "Shared Result Deleted" });
  };

  // ─── ROLE PERMISSIONS CRUD ─────────────────────────────────────────────────

  const handleAddPermission = async () => {
    try {
      const { data } = await supabase.from('role_permissions').insert({ role: newPermRole as any, permission: newPermission as any }).select();
      if (data?.[0]) setRolePermissions(p => [data[0], ...p]);
      toast({ title: "Permission Added", description: `${newPermRole} → ${newPermission}` });
    } catch (e) { console.warn(e); toast({ title: "Error", description: "May already exist.", variant: "destructive" }); }
  };

  const handleDeletePermission = async (id: string) => {
    try { await supabase.from('role_permissions').delete().eq('id', id); } catch (e) { console.warn(e); }
    setRolePermissions(p => p.filter(r => r.id !== id));
    toast({ title: "Permission Revoked" });
  };
  const getUserName = (uid: string | null) => {
    if (!uid) return "System";
    const u = users.find(x => x.id === uid);
    if (u) return u.display_name || u.email || uid.slice(0, 8) + "…";
    return uid.slice(0, 8) + "…";
  };

  // ─── NAV TABS ──────────────────────────────────────────────────────────────

  const navTabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "colleges", label: "Colleges", icon: Building2 },
    { id: "schools", label: "Schools", icon: School },
    { id: "careers", label: "Careers", icon: Briefcase },
    { id: "assessments", label: "Assessments", icon: ClipboardList },
    { id: "shared", label: "Shared Results", icon: Share2 },
    { id: "logs", label: "Activity Logs", icon: Activity },
    { id: "permissions", label: "Permissions", icon: Lock },
    { id: "export", label: "Data Export", icon: Download },
  ];

  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(searchUser.toLowerCase()) || (u.display_name || "").toLowerCase().includes(searchUser.toLowerCase()));

  // ─── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEO title="Zertainity Control Console" description="Full CRUD admin panel." canonical="/admin" noindex />

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-card/80 border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight">Zertainity Control Console</span>
                <Badge variant="secondary" className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                  Full CRUD • 7 Realtime Channels
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">admin.zertainity.in</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted/40 p-1.5 px-3 rounded-full border border-border/60">
              <Shield className="h-4 w-4 text-primary shrink-0" />
              <Select value={activeOwnerEmail} onValueChange={(v) => { setActiveOwnerEmail(v); toast({ title: "Switched Owner", description: v }); }}>
                <SelectTrigger className="h-7 text-xs border-0 bg-transparent focus:ring-0 font-mono font-semibold text-foreground w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {OWNER_EMAILS.map(e => <SelectItem key={e} value={e} className="text-xs font-mono"><span role="img" aria-label="crown">👑</span> {e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="rounded-full text-xs" onClick={() => navigate("/")}>Main Site ↗</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-6 flex-1 space-y-6 max-w-7xl">

        {/* Owner Banner */}
        <div className="p-3 rounded-2xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <p className="text-xs font-bold">Designated Platform Owner</p>
              <p className="text-[11px] text-muted-foreground">Session: <span className="font-mono text-primary font-semibold">{activeOwnerEmail}</span></p>
            </div>
          </div>
          <Badge className="bg-primary text-primary-foreground text-[10px] rounded-full px-3 py-1 font-semibold">Super Admin</Badge>
        </div>

        {/* Nav Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-border/40 pb-3">
          {navTabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  active ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]" : "bg-muted/40 hover:bg-muted/80 text-foreground border border-border/40"
                }`}>
                <Icon className="h-3.5 w-3.5" /> {t.label}
              </button>
            );
          })}
        </div>

        {/* ━━━ TAB: OVERVIEW ━━━ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Platform Dashboard</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { label: "Users", value: users.length, icon: Users, color: "text-blue-500" },
                { label: "Colleges", value: colleges.length, icon: Building2, color: "text-emerald-500" },
                { label: "Schools", value: schools.length, icon: School, color: "text-amber-500" },
                { label: "Assessments", value: careerHistory.length, icon: ClipboardList, color: "text-purple-500" },
                { label: "Shared Results", value: sharedResults.length, icon: Share2, color: "text-pink-500" },
                { label: "Activity Logs", value: activityLogs.length, icon: Activity, color: "text-cyan-500" },
              ].map(s => (
                <Card key={s.label} className="rounded-2xl border border-border/40 bg-card/80 p-4 shadow-sm">
                  <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
                  <p className="text-2xl font-extrabold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <Card className="rounded-2xl border border-border/40 bg-card/80 p-5 space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2"><Activity className="h-4 w-4 text-primary" /> Recent Activity (Live)</h3>
              {activityLogs.length === 0 ? (
                <p className="text-xs text-muted-foreground">No activity logs yet.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activityLogs.slice(0, 10).map(l => (
                    <div key={l.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-muted/20 border border-border/20">
                      <div>
                        <span className="font-semibold text-foreground">{l.action}</span>
                        <span className="text-muted-foreground ml-2">by {getUserName(l.user_id)}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{new Date(l.created_at).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Owner Emails */}
            <Card className="rounded-2xl border border-border/40 bg-card/80 p-5 space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Authorized Platform Owners</p>
              <div className="flex flex-wrap gap-2">
                {OWNER_EMAILS.map(e => (
                  <Badge key={e} variant="outline" className="text-xs py-1 px-3 bg-primary/5 text-primary border-primary/20 font-mono">
                    <Shield className="h-3 w-3 mr-1.5" />{e}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ━━━ TAB: USERS ━━━ */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold">User Directory</h2>
                <p className="text-xs text-muted-foreground">Full CRUD • Realtime Supabase sync</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setShowAddUserModal(true)} className="rounded-full text-xs gap-1.5"><UserPlus className="h-4 w-4" /> Add User</Button>
                <Button size="sm" variant="outline" onClick={fetchUsers} disabled={loadingUsers} className="rounded-full text-xs gap-1.5">
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingUsers ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Button size="sm" variant="outline" onClick={() => downloadCSV(users.map(u => ({ id: u.id, name: u.display_name, email: u.email, roles: u.roles.join(";"), created_at: u.created_at, suspended: u.is_suspended ? "yes" : "no" })), "users")} className="rounded-full text-xs gap-1.5">
                  <Download className="h-3.5 w-3.5" /> CSV
                </Button>
              </div>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={searchUser} onChange={e => setSearchUser(e.target.value)} placeholder="Search users..." className="pl-9 text-xs rounded-full" />
            </div>
            <Card className="rounded-2xl border border-border/40 bg-card/80 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border/40">
                    <TableHead className="text-xs font-semibold">Name</TableHead>
                    <TableHead className="text-xs font-semibold">Email</TableHead>
                    <TableHead className="text-xs font-semibold">Role</TableHead>
                    <TableHead className="text-xs font-semibold">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">No users found.</TableCell></TableRow>
                  ) : filteredUsers.map(u => (
                    <TableRow key={u.id} className="border-b border-border/20">
                      <TableCell className="text-xs font-semibold">{u.display_name || <span className="text-muted-foreground italic">No name</span>} {isOwnerEmail(u.email) && <span className="text-amber-500 font-bold ml-1" role="img" aria-label="crown">👑</span>}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{u.email}</TableCell>
                      <TableCell>
                        <Select value={u.roles[0] || "student"} onValueChange={r => handleUpdateRole(u.id, u.email, r)}>
                          <SelectTrigger className="h-7 w-28 text-[11px] rounded-full border-border/60"><SelectValue /></SelectTrigger>
                          <SelectContent className="rounded-xl">
                            {["owner","admin","manager","student"].map(r => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{u.is_suspended ? <Badge variant="destructive" className="text-[10px]">Suspended</Badge> : <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</Badge>}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" onClick={() => {
                            setEditingUserId(u.id);
                            setEditUserDisplayName(u.display_name || "");
                            setEditUserBio(u.bio || ""); setEditUserPhone(u.phone_number || ""); setEditUserLocation(u.location || "");
                          }} className="h-7 rounded-full">
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleToggleSuspend(u.id, u.email, u.is_suspended)} className="h-7 rounded-full">
                            {u.is_suspended ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Ban className="h-3.5 w-3.5 text-amber-500" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteUser(u.id, u.email)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
            
            {/* EDIT USER MODAL */}
            <Dialog open={!!editingUserId} onOpenChange={(open) => { if (!open) setEditingUserId(null); }}>
              <DialogContent className="rounded-3xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">Edit User Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-1"><Label className="text-xs font-semibold">Display Name</Label><Input value={editUserDisplayName} onChange={e => setEditUserDisplayName(e.target.value)} className="rounded-xl text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs font-semibold">Phone Number</Label><Input value={editUserPhone} onChange={e => setEditUserPhone(e.target.value)} className="rounded-xl text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs font-semibold">Location</Label><Input value={editUserLocation} onChange={e => setEditUserLocation(e.target.value)} className="rounded-xl text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs font-semibold">Bio</Label><Textarea value={editUserBio} onChange={e => setEditUserBio(e.target.value)} className="rounded-xl text-xs" /></div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingUserId(null)} className="rounded-full text-xs">Cancel</Button>
                  <Button onClick={handleSaveUserProfile} className="rounded-full text-xs">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* ADD USER MODAL */}
            <Dialog open={showAddUserModal} onOpenChange={setShowAddUserModal}>
              <DialogContent className="rounded-3xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">Add New User</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">Creates profile & role in Supabase.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="space-y-1"><Label className="text-xs font-semibold">Email</Label><Input value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} placeholder="user@example.com" className="rounded-xl text-xs" /></div>
                  <div className="space-y-1"><Label className="text-xs font-semibold">Role</Label>
                    <Select value={newUserRole} onValueChange={setNewUserRole}><SelectTrigger className="rounded-xl text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="rounded-xl">{["owner","admin","manager","student"].map(r => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setShowAddUserModal(false)} className="rounded-full text-xs">Cancel</Button>
                  <Button onClick={handleCreateUser} className="rounded-full text-xs">Create</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}

        {/* ━━━ TAB: COLLEGES ━━━ */}
        {activeTab === "colleges" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-bold">Colleges Registry</h2><p className="text-xs text-muted-foreground">Full CRUD • Realtime sync • {colleges.length} records</p></div>
              <Button size="sm" variant="outline" onClick={() => downloadCSV(colleges.map(c => ({ id: c.id, name: c.name, location: c.location, courses: c.courses.join(";"), description: c.description, cutoffs: c.cutoffs })), "colleges")} className="rounded-full text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> CSV</Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="rounded-2xl border border-border/40 bg-card/80 p-5 space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> {editingCollegeId ? "Edit College" : "Add College"}</h3>
                <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={collegeName} onChange={e => setCollegeName(e.target.value)} placeholder="IIT Bombay" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Location</Label><Input value={collegeLocation} onChange={e => setCollegeLocation(e.target.value)} placeholder="Mumbai, Maharashtra" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Courses (comma-sep)</Label><Input value={collegeCourses} onChange={e => setCollegeCourses(e.target.value)} placeholder="B.Tech CS, M.Tech AI" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={collegeDesc} onChange={e => setCollegeDesc(e.target.value)} placeholder="About the college..." className="rounded-xl text-xs min-h-[60px]" /></div>
                <div className="space-y-1"><Label className="text-xs">Cutoff Info</Label><Input value={collegeCutoffs} onChange={e => setCollegeCutoffs(e.target.value)} placeholder="JEE rank 1-500" className="rounded-xl text-xs" /></div>
                <div className="flex gap-2 pt-1">
                  {editingCollegeId && <Button variant="outline" onClick={() => { setEditingCollegeId(null); setCollegeName(""); setCollegeLocation(""); setCollegeCourses(""); setCollegeDesc(""); setCollegeCutoffs(""); }} className="rounded-full text-xs flex-1">Cancel</Button>}
                  <Button onClick={handleSaveCollege} className="rounded-full text-xs flex-1">{editingCollegeId ? "Update" : "Create"}</Button>
                </div>
              </Card>
              <div className="lg:col-span-2 space-y-2">
                {colleges.map(c => (
                  <Card key={c.id} className="rounded-xl border border-border/40 bg-card/60 p-3 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm">{c.name}</h4>
                      <p className="text-xs text-muted-foreground">{c.location}</p>
                      {c.description && <p className="text-[11px] text-muted-foreground mt-1">{c.description}</p>}
                      {c.cutoffs && <p className="text-[11px] text-primary mt-0.5">Cutoffs: {c.cutoffs}</p>}
                      <div className="flex flex-wrap gap-1 mt-1.5">{c.courses.map(co => <Badge key={co} variant="secondary" className="text-[10px]">{co}</Badge>)}</div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => { setEditingCollegeId(c.id); setCollegeName(c.name); setCollegeLocation(c.location); setCollegeCourses(c.courses.join(", ")); setCollegeDesc(c.description || ""); setCollegeCutoffs(c.cutoffs || ""); }} className="h-7 rounded-full"><Edit3 className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteCollege(c.id, c.name)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </Card>
                ))}
                {colleges.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">No colleges. Add one above.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ━━━ TAB: SCHOOLS ━━━ */}
        {activeTab === "schools" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-bold">Schools Registry</h2><p className="text-xs text-muted-foreground">Full CRUD • Realtime sync • {schools.length} records</p></div>
              <Button size="sm" variant="outline" onClick={() => downloadCSV(schools.map(s => ({ id: s.id, name: s.name, location: s.location, board: s.board, description: s.description, grade_11_cutoff: s.grade_11_cutoff })), "schools")} className="rounded-full text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> CSV</Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="rounded-2xl border border-border/40 bg-card/80 p-5 space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2"><School className="h-4 w-4 text-primary" /> {editingSchoolId ? "Edit School" : "Add School"}</h3>
                <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="Delhi Public School" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Location</Label><Input value={schoolLocation} onChange={e => setSchoolLocation(e.target.value)} placeholder="New Delhi" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Board</Label><Input value={schoolBoard} onChange={e => setSchoolBoard(e.target.value)} placeholder="CBSE / ICSE / State" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Description</Label><Textarea value={schoolDesc} onChange={e => setSchoolDesc(e.target.value)} placeholder="About the school..." className="rounded-xl text-xs min-h-[60px]" /></div>
                <div className="space-y-1"><Label className="text-xs">Grade 11 Cutoff %</Label><Input value={schoolCutoff} onChange={e => setSchoolCutoff(e.target.value)} placeholder="92" type="number" className="rounded-xl text-xs" /></div>
                <div className="flex gap-2 pt-1">
                  {editingSchoolId && <Button variant="outline" onClick={() => { setEditingSchoolId(null); setSchoolName(""); setSchoolLocation(""); setSchoolBoard(""); setSchoolDesc(""); setSchoolCutoff(""); }} className="rounded-full text-xs flex-1">Cancel</Button>}
                  <Button onClick={handleSaveSchool} className="rounded-full text-xs flex-1">{editingSchoolId ? "Update" : "Create"}</Button>
                </div>
              </Card>
              <div className="lg:col-span-2 space-y-2">
                {schools.map(s => (
                  <Card key={s.id} className="rounded-xl border border-border/40 bg-card/60 p-3 flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-sm">{s.name}</h4>
                      <p className="text-xs text-muted-foreground">{s.location}</p>
                      {s.description && <p className="text-[11px] text-muted-foreground mt-1">{s.description}</p>}
                      <div className="flex gap-2 mt-1.5">
                        <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">{s.board}</Badge>
                        {s.grade_11_cutoff && <Badge variant="outline" className="text-[10px]">Cutoff: {s.grade_11_cutoff}%</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => { setEditingSchoolId(s.id); setSchoolName(s.name); setSchoolLocation(s.location); setSchoolBoard(s.board || ""); setSchoolDesc(s.description || ""); setSchoolCutoff(s.grade_11_cutoff?.toString() || ""); }} className="h-7 rounded-full"><Edit3 className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteSchool(s.id, s.name)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </Card>
                ))}
                {schools.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">No schools. Add one above.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ━━━ TAB: CAREERS ━━━ */}
        {activeTab === "careers" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Careers Catalog</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="rounded-2xl border border-border/40 bg-card/80 p-5 space-y-3">
                <h3 className="text-sm font-bold flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> {editingCareerId ? "Edit Career" : "Add Career"}</h3>
                <div className="space-y-1"><Label className="text-xs">Title</Label><Input value={careerTitle} onChange={e => setCareerTitle(e.target.value)} placeholder="Robotics Engineer" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Domain</Label><Input value={careerCategory} onChange={e => setCareerCategory(e.target.value)} placeholder="Engineering" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Salary Range</Label><Input value={careerSalary} onChange={e => setCareerSalary(e.target.value)} placeholder="₹10-28 LPA" className="rounded-xl text-xs" /></div>
                <div className="space-y-1"><Label className="text-xs">Demand</Label>
                  <Select value={careerDemand} onValueChange={setCareerDemand}><SelectTrigger className="rounded-xl text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">{["High","Moderate","Low"].map(d => <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  {editingCareerId && <Button variant="outline" onClick={() => { setEditingCareerId(null); setCareerTitle(""); setCareerCategory(""); setCareerSalary(""); setCareerDemand("High"); }} className="w-full rounded-full text-xs">Cancel</Button>}
                  <Button onClick={handleSaveCareer} className="w-full rounded-full text-xs">{editingCareerId ? "Update" : "Create"}</Button>
                </div>
              </Card>
              <div className="lg:col-span-2">
                <Card className="rounded-2xl border border-border/40 bg-card/80 overflow-hidden">
                  <Table>
                    <TableHeader><TableRow className="border-b border-border/40">
                      <TableHead className="text-xs">Title</TableHead><TableHead className="text-xs">Domain</TableHead><TableHead className="text-xs">Salary</TableHead><TableHead className="text-xs">Demand</TableHead><TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>{careers.map(c => (
                      <TableRow key={c.id} className="border-b border-border/20">
                        <TableCell className="text-xs font-bold">{c.title}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{c.category}</TableCell>
                        <TableCell className="text-xs font-mono text-primary">{c.salary}</TableCell>
                        <TableCell><Badge variant={c.demand === "High" ? "default" : "secondary"} className="text-[10px]">{c.demand}</Badge></TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="outline" onClick={() => {
                              setEditingCareerId(c.id);
                              setCareerTitle(c.title);
                              setCareerCategory(c.category);
                              setCareerSalary(c.salary || "");
                              setCareerDemand(c.demand || "High");
                            }} className="h-7 rounded-full"><Edit3 className="h-3.5 w-3.5" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteCareer(c.id, c.title)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}</TableBody>
                  </Table>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* ━━━ TAB: ASSESSMENTS ━━━ */}
        {activeTab === "assessments" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-bold">Assessment Analytics</h2><p className="text-xs text-muted-foreground">career_history • Realtime • {careerHistory.length} records</p></div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={fetchCareerHistory} className="rounded-full text-xs gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
                <Button size="sm" variant="outline" onClick={() => downloadCSV(careerHistory.map(h => ({ id: h.id, user: getUserName(h.user_id), education_level: h.education_level, top_recommendation: h.top_recommendation, top_match_percent: h.top_match_percent, created_at: h.created_at })), "assessments")} className="rounded-full text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> CSV</Button>
              </div>
            </div>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="rounded-2xl border border-border/40 bg-card/80 p-4"><TrendingUp className="h-5 w-5 text-purple-500 mb-1" /><p className="text-2xl font-extrabold">{careerHistory.length}</p><p className="text-[11px] text-muted-foreground">Total Assessments</p></Card>
              <Card className="rounded-2xl border border-border/40 bg-card/80 p-4"><Award className="h-5 w-5 text-amber-500 mb-1" /><p className="text-2xl font-extrabold">{careerHistory.length ? Math.round(careerHistory.reduce((s, h) => s + (h.top_match_percent || 0), 0) / careerHistory.length) : 0}%</p><p className="text-[11px] text-muted-foreground">Avg Match %</p></Card>
              <Card className="rounded-2xl border border-border/40 bg-card/80 p-4"><BarChart3 className="h-5 w-5 text-emerald-500 mb-1" /><p className="text-2xl font-extrabold">{new Set(careerHistory.map(h => h.user_id)).size}</p><p className="text-[11px] text-muted-foreground">Unique Users</p></Card>
            </div>
            <Card className="rounded-2xl border border-border/40 bg-card/80 overflow-hidden">
              <Table>
                <TableHeader><TableRow className="border-b border-border/40">
                  <TableHead className="text-xs">User ID</TableHead><TableHead className="text-xs">Education</TableHead><TableHead className="text-xs">Top Recommendation</TableHead><TableHead className="text-xs">Match %</TableHead><TableHead className="text-xs">Date</TableHead><TableHead className="text-xs text-right">Del</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {careerHistory.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">No assessments yet.</TableCell></TableRow> :
                  careerHistory.slice(0, 50).map(h => (
                    <TableRow key={h.id} className="border-b border-border/20">
                      <TableCell className="text-xs font-medium">{getUserName(h.user_id)}</TableCell>
                      <TableCell className="text-xs">{h.education_level}</TableCell>
                      <TableCell className="text-xs font-semibold">{h.top_recommendation || "—"}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{h.top_match_percent ?? 0}%</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => handleDeleteCareerHistory(h.id)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* ━━━ TAB: SHARED RESULTS ━━━ */}
        {activeTab === "shared" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-bold">Shared Results</h2><p className="text-xs text-muted-foreground">shared_results • Realtime • {sharedResults.length} records</p></div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={fetchSharedResults} className="rounded-full text-xs gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
                <Button size="sm" variant="outline" onClick={() => downloadCSV(sharedResults.map(r => ({ id: r.id, slug: r.slug, user: getUserName(r.user_id), display_name: r.display_name, education_level: r.education_level, top_recommendation: r.top_recommendation, top_match_percent: r.top_match_percent, created_at: r.created_at })), "shared_results")} className="rounded-full text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> CSV</Button>
              </div>
            </div>
            <Card className="rounded-2xl border border-border/40 bg-card/80 overflow-hidden">
              <Table>
                <TableHeader><TableRow className="border-b border-border/40">
                  <TableHead className="text-xs">Slug</TableHead><TableHead className="text-xs">Display Name</TableHead><TableHead className="text-xs">Education</TableHead><TableHead className="text-xs">Top Match</TableHead><TableHead className="text-xs">Date</TableHead><TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {sharedResults.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-xs text-muted-foreground">No shared results yet.</TableCell></TableRow> :
                  sharedResults.slice(0, 50).map(r => (
                    <TableRow key={r.id} className="border-b border-border/20">
                      <TableCell className="text-xs font-mono text-primary cursor-pointer" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/r/${r.slug}`).then(() => toast({ title: "URL Copied!" }))}>/r/{r.slug}</TableCell>
                      <TableCell className="text-xs">{r.display_name || "—"}</TableCell>
                      <TableCell className="text-xs">{r.education_level}</TableCell>
                      <TableCell><Badge variant="secondary" className="text-[10px]">{r.top_match_percent ?? 0}%</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => handleDeleteSharedResult(r.id)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* ━━━ TAB: ACTIVITY LOGS ━━━ */}
        {activeTab === "logs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-bold">Activity & Audit Logs</h2><p className="text-xs text-muted-foreground">Realtime • {activityLogs.length} activity + {auditLogs.length} audit entries</p></div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => { fetchActivityLogs(); fetchAuditLogs(); }} className="rounded-full text-xs gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
                <Button size="sm" variant="outline" onClick={() => downloadCSV([...activityLogs.map(l => ({ type: "activity", id: l.id, user: getUserName(l.user_id), action: l.action, details: JSON.stringify(l.details), created_at: l.created_at })), ...auditLogs.map(l => ({ type: "audit", id: l.id, user: getUserName(l.user_id), action: l.action, details: "", created_at: l.created_at }))], "logs")} className="rounded-full text-xs gap-1.5"><Download className="h-3.5 w-3.5" /> CSV</Button>
              </div>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input value={searchLogs} onChange={e => setSearchLogs(e.target.value)} placeholder="Filter by action..." className="pl-9 text-xs rounded-full" />
            </div>

            {/* Activity Logs */}
            <Card className="rounded-2xl border border-border/40 bg-card/80 overflow-hidden">
              <div className="p-3 border-b border-border/40"><h3 className="text-sm font-bold flex items-center gap-2"><Activity className="h-4 w-4 text-cyan-500" /> User Activity Log ({activityLogs.length})</h3></div>
              <Table>
                <TableHeader><TableRow><TableHead className="text-xs">Action</TableHead><TableHead className="text-xs">User</TableHead><TableHead className="text-xs">Details</TableHead><TableHead className="text-xs">Time</TableHead><TableHead className="text-xs text-right">Del</TableHead></TableRow></TableHeader>
                <TableBody>
                  {activityLogs.filter(l => l.action.toLowerCase().includes(searchLogs.toLowerCase())).length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-6 text-xs text-muted-foreground">No activity logs.</TableCell></TableRow> :
                  activityLogs.filter(l => l.action.toLowerCase().includes(searchLogs.toLowerCase())).slice(0, 50).map(l => (
                    <TableRow key={l.id} className="border-b border-border/20">
                      <TableCell className="text-xs font-semibold">{l.action}</TableCell>
                      <TableCell className="text-xs font-medium">{getUserName(l.user_id)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{l.details ? JSON.stringify(l.details).slice(0, 60) : "—"}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => handleDeleteActivityLog(l.id)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Audit Logs */}
            <Card className="rounded-2xl border border-border/40 bg-card/80 overflow-hidden">
              <div className="p-3 border-b border-border/40"><h3 className="text-sm font-bold flex items-center gap-2"><FileText className="h-4 w-4 text-amber-500" /> Audit Log ({auditLogs.length})</h3></div>
              <Table>
                <TableHeader><TableRow><TableHead className="text-xs">Action</TableHead><TableHead className="text-xs">Actor</TableHead><TableHead className="text-xs">Target</TableHead><TableHead className="text-xs">Time</TableHead><TableHead className="text-xs text-right">Del</TableHead></TableRow></TableHeader>
                <TableBody>
                  {auditLogs.length === 0 ? <TableRow><TableCell colSpan={5} className="text-center py-6 text-xs text-muted-foreground">No audit logs.</TableCell></TableRow> :
                  auditLogs.slice(0, 50).map(l => (
                    <TableRow key={l.id} className="border-b border-border/20">
                      <TableCell className="text-xs font-semibold">{l.action}</TableCell>
                      <TableCell className="text-xs font-medium">{getUserName(l.user_id)}</TableCell>
                      <TableCell className="text-xs font-medium">{l.target_user_id ? getUserName(l.target_user_id) : "—"}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{new Date(l.created_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => handleDeleteAuditLog(l.id)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* ━━━ TAB: PERMISSIONS ━━━ */}
        {activeTab === "permissions" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-2xl font-bold">Role Permissions</h2><p className="text-xs text-muted-foreground">role_permissions • CRUD • {rolePermissions.length} mappings</p></div>
              <Button size="sm" variant="outline" onClick={fetchRolePermissions} className="rounded-full text-xs gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Refresh</Button>
            </div>

            {/* Add Permission Form */}
            <Card className="rounded-2xl border border-border/40 bg-card/80 p-5 space-y-3 max-w-xl">
              <h3 className="text-sm font-bold flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Grant Permission</h3>
              <div className="flex gap-2 items-end">
                <div className="flex-1 space-y-1"><Label className="text-xs">Role</Label>
                  <Select value={newPermRole} onValueChange={setNewPermRole}><SelectTrigger className="rounded-xl text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">{["admin","user","editor","manager","owner"].map(r => <SelectItem key={r} value={r} className="text-xs">{r}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="flex-1 space-y-1"><Label className="text-xs">Permission</Label>
                  <Select value={newPermission} onValueChange={setNewPermission}><SelectTrigger className="rounded-xl text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent className="rounded-xl">{["view_all","edit_careers","edit_colleges","edit_schools","edit_pathways","edit_quiz","view_users","manage_users","manage_roles","manage_permissions","view_audit_logs","export_data"].map(p => <SelectItem key={p} value={p} className="text-xs">{p}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddPermission} className="rounded-full text-xs">Grant</Button>
              </div>
            </Card>

            {/* Permissions Table */}
            <Card className="rounded-2xl border border-border/40 bg-card/80 overflow-hidden">
              <Table>
                <TableHeader><TableRow className="border-b border-border/40">
                  <TableHead className="text-xs">Role</TableHead><TableHead className="text-xs">Permission</TableHead><TableHead className="text-xs">Granted</TableHead><TableHead className="text-xs text-right">Revoke</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {rolePermissions.length === 0 ? <TableRow><TableCell colSpan={4} className="text-center py-8 text-xs text-muted-foreground">No permission mappings.</TableCell></TableRow> :
                  rolePermissions.map(rp => (
                    <TableRow key={rp.id} className="border-b border-border/20">
                      <TableCell><Badge variant="outline" className="text-xs">{rp.role}</Badge></TableCell>
                      <TableCell className="text-xs font-mono">{rp.permission}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{rp.created_at ? new Date(rp.created_at).toLocaleDateString() : "—"}</TableCell>
                      <TableCell className="text-right"><Button size="sm" variant="ghost" onClick={() => handleDeletePermission(rp.id)} className="h-7 rounded-full text-red-500 hover:bg-red-500/10"><Trash2 className="h-3.5 w-3.5" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        )}

        {/* ━━━ TAB: DATA EXPORT ━━━ */}
        {activeTab === "export" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Data Export Center</h2>
            <p className="text-xs text-muted-foreground">Download platform data as CSV files for offline analysis and compliance.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Users Directory", count: users.length, icon: Users, color: "text-blue-500", fn: () => downloadCSV(users.map(u => ({ id: u.id, email: u.email, roles: u.roles.join(";"), created_at: u.created_at, suspended: u.is_suspended ? "yes" : "no" })), "users") },
                { label: "Colleges Registry", count: colleges.length, icon: Building2, color: "text-emerald-500", fn: () => downloadCSV(colleges.map(c => ({ id: c.id, name: c.name, location: c.location, courses: c.courses.join(";"), description: c.description, cutoffs: c.cutoffs })), "colleges") },
                { label: "Schools Registry", count: schools.length, icon: School, color: "text-amber-500", fn: () => downloadCSV(schools.map(s => ({ id: s.id, name: s.name, location: s.location, board: s.board, description: s.description, grade_11_cutoff: s.grade_11_cutoff })), "schools") },
                { label: "Assessment History", count: careerHistory.length, icon: ClipboardList, color: "text-purple-500", fn: () => downloadCSV(careerHistory.map(h => ({ id: h.id, user: getUserName(h.user_id), education_level: h.education_level, top_recommendation: h.top_recommendation, top_match_percent: h.top_match_percent, created_at: h.created_at })), "assessments") },
                { label: "Shared Results", count: sharedResults.length, icon: Share2, color: "text-pink-500", fn: () => downloadCSV(sharedResults.map(r => ({ id: r.id, slug: r.slug, display_name: r.display_name, education_level: r.education_level, top_recommendation: r.top_recommendation, top_match_percent: r.top_match_percent, created_at: r.created_at })), "shared_results") },
                { label: "Activity & Audit Logs", count: activityLogs.length + auditLogs.length, icon: Activity, color: "text-cyan-500", fn: () => downloadCSV([...activityLogs.map(l => ({ type: "activity", id: l.id, user: getUserName(l.user_id), action: l.action, created_at: l.created_at })), ...auditLogs.map(l => ({ type: "audit", id: l.id, user: getUserName(l.user_id || ""), action: l.action, created_at: l.created_at }))], "all_logs") },
              ].map(item => (
                <Card key={item.label} className="rounded-2xl border border-border/40 bg-card/80 p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                    <div>
                      <p className="text-sm font-bold">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.count} records</p>
                    </div>
                  </div>
                  <Button onClick={item.fn} variant="outline" className="w-full rounded-full text-xs gap-1.5">
                    <Download className="h-4 w-4" /> Export as CSV
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default Admin;
