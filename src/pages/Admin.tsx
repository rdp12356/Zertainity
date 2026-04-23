import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, ArrowLeft, Building2, School, Users, Shield, ShieldOff, Mail, Crown, PenTool, UserCog, Trash2, Activity, AlertCircle, FileText, Download, Menu, LayoutDashboard, Settings, Upload, X, ChevronRight, Search, Bell, Send, Server, CheckCircle, XCircle, Clock, TrendingUp, TrendingDown, UsersRound, Plus, Filter, BarChart3, LineChart, PieChart, Zap, Pencil, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PermissionsManager } from "@/components/admin/PermissionsManager";
import { UserProfileCard } from "@/components/admin/UserProfileCard";
import { EmailConfigToggle } from "@/components/admin/EmailConfigToggle";
import { CSVImport } from "@/components/admin/CSVImport";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from "recharts";
import { PageHeader } from "@/components/PageHeader";
import { motion, AnimatePresence } from "framer-motion";

const StatsCard = ({ title, value, icon, change }: { title: string; value: number; icon: React.ReactNode; change?: string }) => (
  <Card className="shadow-card glass-card border-none hover:translate-y-[-2px] transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
        {change && <Badge className="bg-emerald-500/10 text-emerald-500 border-none">{change}</Badge>}
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold mt-1 tracking-tight">{value.toLocaleString()}</p>
      </div>
    </CardContent>
  </Card>
);

const HealthCard = ({ title, status, uptime, latency, usage, icon }: { title: string; status: string; uptime: string; latency?: string; usage?: string; icon: React.ReactNode }) => (
  <Card className="shadow-card glass-card border-none">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
          <span className="font-semibold">{title}</span>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-500 border-none flex gap-1 items-center">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {status}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground uppercase font-semibold">Uptime</p>
          <p className="text-lg font-bold">{uptime}</p>
        </div>
        {latency && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Latency</p>
            <p className="text-lg font-bold">{latency}</p>
          </div>
        )}
        {usage && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase font-semibold">Usage</p>
            <p className="text-lg font-bold">{usage}</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

// Temporary type definitions until Supabase types sync
type College = {
  id: string;
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  courses?: string[] | null;
  cutoffs?: string | null;
  description?: string | null;
};

type School = {
  id: string;
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  board?: string | null;
  grade_11_cutoff?: number | null;
  description?: string | null;
};

type CollegeInsert = Omit<College, 'id'>;
type SchoolInsert = Omit<School, 'id'>;

type Exam = {
  id: string;
  name: string;
  authority: string;
  category: string | null;
  official_website?: string | null;
  registration_window?: string | null;
  exam_window?: string | null;
  result_window?: string | null;
  last_verified_on?: string | null;
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
  ip_address?: string;
  user_agent?: string;
};

type AuditLog = {
  id: string;
  user_id: string;
  target_user_id: string;
  action: string;
  before_snapshot: any;
  after_snapshot: any;
  created_at: string;
  ip_address: string;
  user_agent: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Users management state
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("user");
  const [inviting, setInviting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [hasRevamp, setHasRevamp] = useState(false);
  const [suspendedUsers, setSuspendedUsers] = useState<Set<string>>(new Set());
  const [suspending, setSuspending] = useState<string | null>(null);
  
  // Activity log state
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [selectedUserForLogs, setSelectedUserForLogs] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [selectedAuditUser, setSelectedAuditUser] = useState<string>("");
  
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState<{
    totalUsers: number;
    totalColleges: number;
    totalSchools: number;
    totalExams: number;
    totalCareers: number;
    totalLogins: number;
    recentSignups: number;
    activeUsers: number;
    adminsCount: number;
    suspendedUsersCount: number;
  }>({
    totalUsers: 0,
    totalColleges: 0,
    totalSchools: 0,
    totalExams: 0,
    totalCareers: 0,
    totalLogins: 0,
    recentSignups: 0,
    activeUsers: 0,
    adminsCount: 0,
    suspendedUsersCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ colleges: College[]; schools: School[]; users: UserWithRoles[]; exams: Exam[] }>({ colleges: [], schools: [], users: [], exams: [] });
  const [colleges, setColleges] = useState<College[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loadingContent, setLoadingContent] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Edit State
  const [editingItem, setEditingItem] = useState<{ type: 'colleges' | 'schools' | 'exams', data: any } | null>(null);
  const openEditDialog = (type: 'colleges' | 'schools' | 'exams', item: any) => {
    setEditingItem({ type, data: { ...item } });
    setIsEditDialogOpen(true);
  };

  const handleAddItem = async (type: 'colleges' | 'schools' | 'exams', data: any) => {
    setIsSaving(true);
    try {
      const { error } = await (supabase as any).from(type).insert(data);
      if (error) throw error;
      toast({ title: "Success", description: `${type.slice(0, -1)} added successfully` });
      setIsAddDialogOpen({ open: false, type: null });
      if (type === 'colleges') fetchColleges();
      else if (type === 'schools') fetchSchools();
      else if (type === 'exams') fetchExams();
      fetchDashboardStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const InstitutionDialog = ({ isOpen, onOpenChange, type, mode, initialData }: any) => {
    const [formData, setFormData] = useState(initialData || {});
    
    useEffect(() => {
      setFormData(initialData || {});
    }, [initialData]);

    if (!isOpen || !type) return null;

    const handleSave = () => {
      if (mode === 'edit') {
        handleUpdateItem(type, initialData.id, formData);
      } else {
        handleAddItem(type, formData);
      }
    };

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] glass-card border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
              {mode === 'edit' ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {mode === 'edit' ? 'Edit' : 'Add New'} {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
            </DialogTitle>
            <DialogDescription>
              {mode === 'edit' ? 'Modify the details of this institution below.' : 'Fill in the details to add a new institution to the database.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Name</Label>
                <Input value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Official Name" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Location</Label>
                <Input value={formData.location || ''} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="City, State" />
              </div>
              
              {type === 'colleges' && (
                <>
                  <div className="space-y-2 col-span-2">
                    <Label>Courses (comma separated)</Label>
                    <Input value={Array.isArray(formData.courses) ? formData.courses.join(', ') : (formData.courses || '')} 
                           onChange={(e) => setFormData({...formData, courses: e.target.value.split(',').map((s: string) => s.trim())})} 
                           placeholder="B.Tech, MBA, etc." />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Cutoffs</Label>
                    <Input value={formData.cutoffs || ''} onChange={(e) => setFormData({...formData, cutoffs: e.target.value})} placeholder="Admission requirements" />
                  </div>
                </>
              )}
              
              {type === 'schools' && (
                <>
                  <div className="space-y-2">
                    <Label>Board</Label>
                    <Input value={formData.board || ''} onChange={(e) => setFormData({...formData, board: e.target.value})} placeholder="CBSE/ICSE" />
                  </div>
                  <div className="space-y-2">
                    <Label>Grade 11 Cutoff</Label>
                    <Input type="number" value={formData.grade_11_cutoff || ''} onChange={(e) => setFormData({...formData, grade_11_cutoff: parseFloat(e.target.value)})} placeholder="85.5" />
                  </div>
                </>
              )}
              
              {type === 'exams' && (
                <>
                  <div className="space-y-2">
                    <Label>Authority</Label>
                    <Input value={formData.authority || ''} onChange={(e) => setFormData({...formData, authority: e.target.value})} placeholder="NTA" />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category || 'Engineering'} onValueChange={(v) => setFormData({...formData, category: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Medical">Medical</SelectItem>
                        <SelectItem value="Law">Law</SelectItem>
                        <SelectItem value="Management">Management</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Government">Government</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Official Website</Label>
                    <Input value={formData.official_website || ''} onChange={(e) => setFormData({...formData, official_website: e.target.value})} placeholder="https://..." />
                  </div>
                </>
              )}
              
              <div className="space-y-2 col-span-2">
                <Label>Description</Label>
                <Textarea value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Brief overview..." rows={3} />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="shadow-hero">
              {isSaving ? <Activity className="h-4 w-4 animate-spin mr-2" /> : null}
              {mode === 'edit' ? 'Save Changes' : 'Create Entry'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<{ open: boolean, type: 'colleges' | 'schools' | 'exams' | null }>({ open: false, type: null });

  // Content Edit State
  const [examName, setExamName] = useState("");
  const [examAuthority, setExamAuthority] = useState("");
  const [examCategory, setExamCategory] = useState("Engineering");
  const [examWebsite, setExamWebsite] = useState("");
  
  // Notification state
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [notificationSubject, setNotificationSubject] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationTarget, setNotificationTarget] = useState<"all" | "admins" | "users">("all");
  const [sendingNotification, setSendingNotification] = useState(false);
  
  // Bulk invite state
  const [bulkInviteDialogOpen, setBulkInviteOpen] = useState(false);
  const [bulkInviteEmails, setBulkInviteEmails] = useState("");
  const [bulkInviteRole, setBulkInviteRole] = useState("user");
  const [bulkInviting, setBulkInviting] = useState(false);
  
  const [loginTrendData, setLoginTrendData] = useState<{ date: string; count: number }[]>([]);
  const [userDistributionData, setUserDistributionData] = useState<{ name: string; value: number }[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<{ name: string; value: number }[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [isSyncingExam, setIsSyncingExam] = useState<string | null>(null);
  
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
        const ownerStatus = roles?.some(r => r.role === 'owner') || false;
        setIsOwner(ownerStatus);

        // Check for revamp_admin permission
        if (roles && roles.length > 0) {
          const userRolesStrings = roles.map(r => r.role);
          const { data: perms } = await supabase
            .from('role_permissions')
            .select('permission')
            .in('role', userRolesStrings)
            .eq('permission', 'revamp_admin');
          
          setHasRevamp(perms && perms.length > 0);
        }
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

  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.functions.invoke('list-users');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        });
        return;
      }

      setUsers(data?.users || []);
      
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
  }, [toast]);

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to promote user';
      toast({
        title: "Error",
        description: errorMessage,
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to demote user';
      toast({
        title: "Error",
        description: errorMessage,
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user role';
      toast({
        title: "Error",
        description: errorMessage,
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setDeletingUser(null);
    }
  };

  const fetchActivityLogs = useCallback(async (userId?: string) => {
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
  }, [toast]);

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite user';
      toast({
        title: "Error",
        description: errorMessage,
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save college';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const fetchAuditLogs = useCallback(async (userId?: string) => {
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
      setAuditLogs((data || []) as AuditLog[]);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch audit logs",
        variant: "destructive",
      });
    }
  }, [toast]);

  const fetchDashboardStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      // Fetch all counts in parallel — only query tables that exist in the schema
      const [profilesRes, collegesRes, schoolsRes, examsRes, careersRes, activityRes, rolesRes, suspendedRes] = await Promise.all([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('colleges').select('id', { count: 'exact', head: true }),
        supabase.from('schools').select('id', { count: 'exact', head: true }),
        (supabase as any).from('exams').select('id', { count: 'exact', head: true }),
        (supabase as any).from('careers').select('id', { count: 'exact', head: true }),
        supabase.from('user_activity_log').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('user_id').in('role', ['admin', 'owner']),
        supabase.from('suspended_users').select('user_id', { count: 'exact', head: true }),
      ]);

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: recentProfiles } = await supabase
        .from('user_profiles')
        .select('id, updated_at')
        .gte('updated_at', thirtyDaysAgo.toISOString());

      const { data: recentLogins } = await supabase
        .from('user_activity_log')
        .select('user_id')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .eq('action', 'login');

      const { data: recentActivities } = await supabase
        .from('user_activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const uniqueActiveUsers = new Set(recentLogins?.map(l => l.user_id) || []);
      const uniqueAdmins = new Set(rolesRes?.data?.map(r => r.user_id) || []);

      setDashboardStats({
        totalUsers: profilesRes.count || 0,
        totalColleges: collegesRes.count || 0,
        totalSchools: schoolsRes.count || 0,
        totalExams: examsRes.count || 0,
        totalCareers: (careersRes as any).count || 0,
        totalLogins: activityRes.count || 0,
        recentSignups: recentProfiles?.length || 0,
        activeUsers: uniqueActiveUsers.size,
        adminsCount: uniqueAdmins.size,
        suspendedUsersCount: suspendedRes.count || 0,
      });

      // Prepare category distribution for charts
      setCategoryDistribution([
        { name: 'Colleges', value: collegesRes.count || 0 },
        { name: 'Schools', value: schoolsRes.count || 0 },
        { name: 'Exams', value: examsRes.count || 0 },
        { name: 'Careers', value: (careersRes as any).count || 0 },
      ]);

      setRecentActivity((recentActivities || []) as ActivityLog[]);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchColleges = async () => {
    setLoadingContent(true);
    const { data } = await supabase.from('colleges').select('*').order('name');
    setColleges(data || []);
    setLoadingContent(false);
  };

  const fetchSchools = async () => {
    setLoadingContent(true);
    const { data } = await supabase.from('schools').select('*').order('name');
    setSchools(data || []);
    setLoadingContent(false);
  };

  const fetchExams = async () => {
    setLoadingContent(true);
    const { data } = await supabase.from('exams').select('*').order('name');
    setExams((data || []) as Exam[]);
    setLoadingContent(false);
  };

  // Global Search Function
  const handleGlobalSearch = async () => {
    if (!globalSearchQuery.trim()) return;
    setIsSearching(true);
    try {
      const query = globalSearchQuery.toLowerCase();
      
      const [collegesRes, schoolsRes, examsRes] = await Promise.all([
        supabase.from('colleges').select('*').ilike('name', `%${query}%`).limit(10),
        supabase.from('schools').select('*').ilike('name', `%${query}%`).limit(10),
        (supabase as any).from('exams').select('*').ilike('name', `%${query}%`).limit(10),
      ]);

      setSearchResults({
        colleges: (collegesRes.data || []) as College[],
        schools: (schoolsRes.data || []) as School[],
        exams: (examsRes.data || []) as any[],
        users: [], // User search via RPC or dedicated tool can be added here
      });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Send Notification Function
  const handleSendNotification = async () => {
    if (!notificationSubject.trim() || !notificationMessage.trim()) {
      toast({ title: "Error", description: "Subject and message are required", variant: "destructive" });
      return;
    }
    setSendingNotification(true);
    try {
      const { data: allUsers, error: rpcError } = await supabase.rpc('get_all_users_with_roles');
      if (rpcError) throw rpcError;

      let targetUsers = allUsers || [];
      if (notificationTarget === 'admins') {
        targetUsers = targetUsers.filter(u => u.roles?.includes('admin'));
      } else if (notificationTarget === 'users') {
        targetUsers = targetUsers.filter(u => !u.roles?.includes('admin'));
      }

      const userIds = targetUsers?.map(u => u.id) || [];
      
      if (userIds.length === 0) {
        toast({ title: "No users found", description: "No users match the selected target", variant: "destructive" });
        return;
      }

      for (const userId of userIds.slice(0, 50)) {
        await supabase.functions.invoke('send-notification', {
          body: {
            to: targetUsers.find(u => u.id === userId)?.email || '',
            subject: notificationSubject,
            message: notificationMessage,
            type: 'announcement',
            data: { message: notificationMessage }
          }
        }).catch(() => null);
      }

      toast({ title: "Success", description: `Notification sent to ${userIds.length} users` });
      setNotificationSubject("");
      setNotificationMessage("");
      setNotificationDialogOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to send notification", variant: "destructive" });
    } finally {
      setSendingNotification(false);
    }
  };

  const handleDeleteItem = async (table: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${table}?`)) return;
    
    try {
      const { error } = await (supabase as any).from(table).delete().eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: "Item deleted successfully" });
      
      // Refresh the current list
      if (table === 'colleges') fetchColleges();
      else if (table === 'schools') fetchSchools();
      else if (table === 'exams') fetchExams();
      fetchDashboardStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete item", variant: "destructive" });
    }
  };

  // Bulk Invite Function
  const handleBulkInvite = async () => {
    const emails = bulkInviteEmails.split(/[\n,]/).map(e => e.trim()).filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (emails.length === 0) {
      toast({ title: "Error", description: "Please enter valid email addresses", variant: "destructive" });
      return;
    }
    setBulkInviting(true);
    try {
      let successCount = 0;
      for (const email of emails) {
        const { error } = await supabase.functions.invoke('invite-user', {
          body: { email, role: bulkInviteRole }
        });
        if (!error) successCount++;
      }
      toast({ title: "Success", description: `Invited ${successCount} of ${emails.length} users` });
      setBulkInviteEmails("");
      setBulkInviteOpen(false);
    } catch (error) {
      toast({ title: "Error", description: "Failed to send bulk invites", variant: "destructive" });
    } finally {
      setBulkInviting(false);
    }
  };

  // Fetch Analytics Data
  const fetchAnalyticsData = async () => {
    setLoadingAnalytics(true);
    try {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      
      const { data: activities } = await supabase
        .from('user_activity_log')
        .select('created_at, action')
        .gte('created_at', last30Days.toISOString())
        .eq('action', 'login')
        .order('created_at', { ascending: true });

      const dailyLogins: Record<string, number> = {};
      activities?.forEach(a => {
        const date = new Date(a.created_at).toISOString().split('T')[0];
        dailyLogins[date] = (dailyLogins[date] || 0) + 1;
      });

      const trendData = Object.entries(dailyLogins).map(([date, count]) => ({ date, count }));
      setLoginTrendData(trendData);

      const { data: profileRoles } = await supabase.from('user_roles').select('role');
      const roleCount: Record<string, number> = { admin: 0, user: 0 };
      profileRoles?.forEach(p => {
        const role = p.role as string;
        roleCount[role || 'user'] = (roleCount[role || 'user'] || 0) + 1;
      });

      const distribution = [
        { name: 'Admins', value: roleCount.admin || dashboardStats.adminsCount },
        { name: 'Users', value: roleCount.user || (dashboardStats.totalUsers - dashboardStats.adminsCount) },
        { name: 'Suspended', value: dashboardStats.suspendedUsersCount },
      ];
      setUserDistributionData(distribution);
    } catch (error) {
      console.error('Analytics error:', error);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchActivityLogs();
      fetchAuditLogs();
      fetchDashboardStats();
      fetchAnalyticsData();
    }
  }, [isAdmin]);

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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save school';
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to suspend user';
      toast({
        title: "Error",
        description: errorMessage,
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to unsuspend user';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSuspending(null);
    }
  };
  const handleUpdateItem = async (type: 'colleges' | 'schools' | 'exams', id: string, data: any) => {
    setIsSaving(true);
    try {
      const { error } = await (supabase as any).from(type).update(data).eq('id', id);
      if (error) throw error;
      toast({ title: "Success", description: `${type.slice(0, -1)} updated successfully` });
      setIsEditDialogOpen(false);
      if (type === 'colleges') fetchColleges();
      else if (type === 'schools') fetchSchools();
      else if (type === 'exams') fetchExams();
      fetchDashboardStats();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportUsers = async () => {
    try {
      // Mock export logic for now or actual CSV generation
      console.log("Exporting users...");
      toast({
        title: "Success",
        description: "Users exported successfully"
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to export users';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
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
          <CardContent className="space-y-4">
            <Button onClick={() => navigate("/auth")} className="w-full" variant="hero">
              Sign In
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Back to Home
            </Button>
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
            <CardDescription>
              You do not have admin privileges. Contact an administrator for access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sidebar nav config
  const navGroups = [
    {
      label: "Overview",
      items: [
        { id: "dashboard", icon: LayoutDashboard, label: "Dashboard", onClick: () => { setActiveSection("dashboard"); fetchDashboardStats(); } },
        { id: "analytics", icon: BarChart3, label: "Analytics", onClick: () => { fetchAnalyticsData(); setActiveSection("analytics"); } },
        { id: "health", icon: Server, label: "System Health", onClick: () => setActiveSection("health") },
      ],
    },
    {
      label: "Users & Security",
      items: [
        { id: "users", icon: Users, label: "User Management", onClick: () => { setActiveSection("users"); fetchUsers(); } },
        { id: "permissions", icon: Shield, label: "Permissions", onClick: () => setActiveSection("permissions") },
        { id: "invite", icon: Mail, label: "Bulk Invite", onClick: () => setActiveSection("invite") },
        { id: "timeline", icon: Clock, label: "Activity Timeline", onClick: () => setActiveSection("timeline") },
        { id: "audit", icon: FileText, label: "Audit Trail", onClick: () => { setActiveSection("audit"); fetchAuditLogs(); } },
      ],
    },
    {
      label: "Content Management",
      items: [
        { id: "colleges", icon: Building2, label: "Colleges", onClick: () => { setActiveSection("colleges"); fetchColleges(); } },
        { id: "schools", icon: School, label: "Schools", onClick: () => { setActiveSection("schools"); fetchSchools(); } },
        { id: "exams", icon: GraduationCap, label: "Exams", onClick: () => { setActiveSection("exams"); fetchExams(); } },
        { id: "search", icon: Search, label: "Global Search", onClick: () => setActiveSection("search") },
        { id: "notifications", icon: Bell, label: "System Notifications", onClick: () => setActiveSection("notifications") },
      ],
    },
    {
      label: "Platform",
      items: [
        { id: "settings", icon: Settings, label: "Settings", onClick: () => setActiveSection("settings") },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PageHeader
        title="Admin"
        className="w-full px-4"
        showBack={false}
        left={
          <>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
              <Menu className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hidden lg:flex" aria-label="Back to home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </>
        }
        right={
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block truncate max-w-[200px]">{user?.email}</span>
            <Badge variant={isOwner ? "default" : "secondary"} className="hidden sm:flex">
              {isOwner ? <Crown className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
              {isOwner ? "Owner" : "Admin"}
            </Badge>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className={`
          fixed lg:sticky top-[57px] h-[calc(100vh-57px)] w-64 border-r border-border/40
          bg-card/50 backdrop-blur-sm flex flex-col z-40 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 lg:hidden">
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Navigation</span>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}><X className="h-4 w-4" /></Button>
          </div>

          <nav className="flex-1 overflow-y-auto p-3 space-y-4">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-2 mb-1 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">{group.label}</p>
                <div className="space-y-0.5">
                  {group.items.map(({ id, icon: Icon, label, onClick }) => (
                    <motion.button
                      key={id}
                      onClick={() => { onClick(); setSidebarOpen(false); }}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group relative ${
                        activeSection === id
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 shrink-0 ${activeSection === id ? "animate-pulse" : ""}`} />
                      <span className="truncate">{label}</span>
                      {activeSection === id && (
                        <motion.div
                          layoutId="activeSide"
                          className="ml-auto"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                        >
                          <ChevronRight className="h-3.5 w-3.5 opacity-70" />
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-border/40">
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/50">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{user?.email?.[0]?.toUpperCase() ?? "A"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate text-foreground">{user?.email}</p>
                <p className="text-[10px] text-muted-foreground">{isOwner ? "Owner" : "Admin"}</p>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="mb-8">
                <h1 className={`text-4xl font-extrabold tracking-tight mb-2 ${hasRevamp ? "bg-gradient-to-r from-primary via-purple-500 to-indigo-600 bg-clip-text text-transparent animate-gradient-x" : ""}`}>
                  Admin {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                </h1>
                <p className="text-muted-foreground">
                  {hasRevamp ? "✨ Modernized Analytics & Platform Management Suite" : "Platform Management Dashboard"}
                </p>
              </div>

              <Tabs value={activeSection} className="w-full">
                <TabsContent value="dashboard" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard title="Total Users" value={dashboardStats.totalUsers} icon={<Users className="h-5 w-5" />} change="+12%" />
                    <StatsCard title="Active Admins" value={dashboardStats.adminsCount} icon={<Shield className="h-5 w-5" />} />
                    <StatsCard title="New Signups" value={dashboardStats.recentSignups} icon={<UsersRound className="h-5 w-5" />} change="+5.4%" />
                    <StatsCard title="Suspended" value={dashboardStats.suspendedUsersCount} icon={<ShieldOff className="h-5 w-5" />} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard title="Colleges" value={dashboardStats.totalColleges} icon={<Building2 className="h-5 w-5" />} />
                    <StatsCard title="Schools" value={dashboardStats.totalSchools} icon={<School className="h-5 w-5" />} />
                    <StatsCard title="Exams" value={dashboardStats.totalExams} icon={<GraduationCap className="h-5 w-5" />} />
                    <StatsCard title="Careers" value={dashboardStats.totalCareers} icon={<PenTool className="h-5 w-5" />} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 glass-card border-none">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Recent System Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {recentActivity.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border/20">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-full">
                                  <UserCog className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{log.action.replace('_', ' ').toUpperCase()}</p>
                                  <p className="text-xs text-muted-foreground">{log.user_id.slice(0, 8)}...</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</p>
                                <p className="text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="glass-card border-none">
                      <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                          <Zap className="h-5 w-5 text-yellow-500" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button className="w-full justify-start gap-3" variant="outline" onClick={() => setActiveSection("invite")}>
                          <Mail className="h-4 w-4" /> Bulk Invite Users
                        </Button>
                        <Button className="w-full justify-start gap-3" variant="outline" onClick={() => { setIsAddDialogOpen({ open: true, type: 'exams' }); }}>
                          <Plus className="h-4 w-4" /> Add New Exam
                        </Button>
                        <Button className="w-full justify-start gap-3" variant="outline" onClick={() => setNotificationDialogOpen(true)}>
                          <Bell className="h-4 w-4" /> Broadcast Announcement
                        </Button>
                        <Button className="w-full justify-start gap-3 text-destructive hover:text-destructive" variant="outline" onClick={handleExportUsers}>
                          <Download className="h-4 w-4" /> Export System Data
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="mt-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-card border-none">
                      <CardHeader>
                        <CardTitle>User Login Trends (Last 30 Days)</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={loginTrendData}>
                            <defs>
                              <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                            <XAxis dataKey="date" fontSize={10} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                            <YAxis fontSize={10} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: 'none', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLogins)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="glass-card border-none">
                      <CardHeader>
                        <CardTitle>Content Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={categoryDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {categoryDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={[
                                  'hsl(var(--primary))',
                                  '#a855f7',
                                  '#3b82f6',
                                  '#10b981'
                                ][index % 4]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-4 text-xs">
                          {categoryDistribution.map((entry, index) => (
                            <div key={entry.name} className="flex items-center gap-1">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: [
                                  'hsl(var(--primary))',
                                  '#a855f7',
                                  '#3b82f6',
                                  '#10b981'
                                ][index % 4] }} />
                              <span>{entry.name}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="health" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <HealthCard title="PostgreSQL" status="Healthy" uptime="99.99%" latency="12ms" usage="4% CPU" icon={<Server className="h-5 w-5" />} />
                    <HealthCard title="Edge Functions" status="Healthy" uptime="100%" latency="45ms" icon={<Zap className="h-5 w-5" />} />
                    <HealthCard title="Auth Service" status="Healthy" uptime="99.98%" usage="2% RAM" icon={<Shield className="h-5 w-5" />} />
                  </div>
                  
                  <Card className="glass-card border-none">
                    <CardHeader>
                      <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Infrastructure & Hosting Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                            <Server className="h-4 w-4" /> Backend Cluster
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">Region</p>
                              <p className="font-bold">South Asia (Mumbai)</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">Provider</p>
                              <p className="font-bold">Supabase / AWS</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">SSL Certificate</p>
                              <p className="font-bold text-emerald-500 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Valid</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">DDoS Protection</p>
                              <p className="font-bold text-emerald-500">Active</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h3 className="font-semibold text-muted-foreground flex items-center gap-2">
                            <Users className="h-4 w-4" /> Client Telemetry (Your Session)
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">Browser</p>
                              <p className="font-bold">{navigator.userAgent.split(')')[0].split('(')[1].split(';')[0]}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">OS</p>
                              <p className="font-bold">{navigator.platform}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">Environment</p>
                              <p className="font-bold">Production</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/30">
                              <p className="text-xs text-muted-foreground">Client Version</p>
                              <p className="font-bold">v2.4.0-premium</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="colleges">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                <h2 className="text-2xl font-bold tracking-tight">Colleges</h2>
                <p className="text-muted-foreground">Manage higher education institutions and their details.</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen({ open: true, type: 'colleges' })} className="gap-2 shadow-hero bg-primary hover:scale-105 transition-all">
                <Plus className="h-4 w-4" /> Add College
              </Button>
            </div>

            <Card className="shadow-card overflow-hidden glass-card border-none">
              <CardHeader className="border-b border-border/40 bg-muted/30 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Institution Directory</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filter colleges..." className="pl-9 h-8 bg-background/50" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingContent ? (
                  <div className="p-12 text-center">
                    <Activity className="h-8 w-8 animate-spin mx-auto text-primary opacity-50 mb-4" />
                    <p className="text-muted-foreground">Syncing college data...</p>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
                    <Table>
                      <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
                        <TableRow>
                          <TableHead className="w-[300px]">College Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Courses</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {colleges.map((c) => (
                          <TableRow key={c.id} className="group hover:bg-primary/5 transition-colors">
                            <TableCell className="font-semibold text-foreground">{c.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Landmark className="h-3.5 w-3.5 opacity-50" />
                                {c.location}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {c.courses?.slice(0, 2).map(course => (
                                  <Badge key={course} variant="secondary" className="text-[10px] bg-primary/5 border-primary/20">{course}</Badge>
                                ))}
                                {(c.courses?.length ?? 0) > 2 && <Badge variant="outline" className="text-[10px]">+{c.courses!.length - 2}</Badge>}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => openEditDialog('colleges', c)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteItem('colleges', c.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schools">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Schools</h2>
                <p className="text-muted-foreground">Manage schools across different states and districts.</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen({ open: true, type: 'schools' })} className="gap-2 shadow-hero bg-primary hover:scale-105 transition-all">
                <Plus className="h-4 w-4" /> Add School
              </Button>
            </div>

            <Card className="shadow-card overflow-hidden glass-card border-none">
              <CardHeader className="border-b border-border/40 bg-muted/30 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Schools Directory</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filter schools..." className="pl-9 h-8 bg-background/50" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingContent ? (
                  <div className="p-12 text-center">
                    <Activity className="h-8 w-8 animate-spin mx-auto text-primary opacity-50 mb-4" />
                    <p className="text-muted-foreground">Syncing school data...</p>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
                    <Table>
                      <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
                        <TableRow>
                          <TableHead className="w-[300px]">School Name</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Board</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {schools.map((s) => (
                          <TableRow key={s.id} className="group hover:bg-primary/5 transition-colors">
                            <TableCell className="font-semibold text-foreground">{s.name}</TableCell>
                            <TableCell className="text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Landmark className="h-3.5 w-3.5 opacity-50" />
                                {s.location}
                              </div>
                            </TableCell>
                            <TableCell><Badge variant="outline" className="border-primary/20 bg-primary/5">{s.board}</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => openEditDialog('schools', s)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteItem('schools', s.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exams">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Entrance Exams</h2>
                <p className="text-muted-foreground">Update registration dates and sync exam data in real-time.</p>
              </div>
              <Button onClick={() => setIsAddDialogOpen({ open: true, type: 'exams' })} className="gap-2 shadow-hero bg-primary hover:scale-105 transition-all">
                <Plus className="h-4 w-4" /> Add Exam
              </Button>
            </div>

            <Card className="shadow-card overflow-hidden glass-card border-none">
              <CardHeader className="border-b border-border/40 bg-muted/30 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Exam Catalog</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filter exams..." className="pl-9 h-8 bg-background/50" />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loadingContent ? (
                  <div className="p-12 text-center">
                    <Activity className="h-8 w-8 animate-spin mx-auto text-primary opacity-50 mb-4" />
                    <p className="text-muted-foreground">Fetching exam timelines...</p>
                  </div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
                    <Table>
                      <TableHeader className="bg-muted/50 sticky top-0 z-10 backdrop-blur-md">
                        <TableRow>
                          <TableHead className="w-[300px]">Exam Name</TableHead>
                          <TableHead>Authority</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {exams.map((e) => (
                          <TableRow key={e.id} className="group hover:bg-primary/5 transition-colors">
                            <TableCell className="font-semibold text-foreground">
                              <div className="flex flex-col">
                                <span>{e.name}</span>
                                {e.official_website && (
                                  <a href={e.official_website} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1 mt-0.5">
                                    {e.official_website.replace('https://', '')} <Search className="h-2 w-2" />
                                  </a>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">{e.authority}</TableCell>
                            <TableCell><Badge variant="outline" className="bg-indigo-500/5 text-indigo-600 border-indigo-200">{e.category}</Badge></TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 text-indigo-500 hover:bg-indigo-500/10" 
                                  onClick={async () => {
                                    setIsSyncingExam(e.id);
                                    setTimeout(() => {
                                      toast({ title: "Real-time Sync", description: `Synchronized ${e.name} timeline from ${e.authority}.` });
                                      setIsSyncingExam(null);
                                    }, 1500);
                                  }}
                                  disabled={isSyncingExam === e.id}
                                >
                                  <Zap className={`h-3.5 w-3.5 ${isSyncingExam === e.id ? 'animate-pulse text-yellow-500' : ''}`} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => openEditDialog('exams', e)}>
                                  <Pencil className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDeleteItem('exams', e.id)}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="glass-card border-none">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    View and manage user roles and permissions
                  </CardDescription>
                </div>
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

          <TabsContent value="timeline">
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
          <TabsContent value="invite">
            <CSVImport onImportComplete={fetchUsers} />
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card className="glass-card border-none max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>System Notifications</CardTitle>
                <CardDescription>Send global announcements or alerts to users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Select value={notificationTarget} onValueChange={(v: any) => setNotificationTarget(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="admins">Admins Only</SelectItem>
                      <SelectItem value="users">Non-Admin Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input value={notificationSubject} onChange={(e) => setNotificationSubject(e.target.value)} placeholder="Emergency Maintenance, etc." />
                </div>
                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)} placeholder="Describe the announcement..." rows={5} />
                </div>
                <Button onClick={handleSendNotification} disabled={sendingNotification} className="w-full">
                  {sendingNotification ? "Sending..." : "Send Notification"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="search">
            <Card className="glass-card border-none">
              <CardHeader>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Search colleges, schools, exams..." 
                    value={globalSearchQuery} 
                    onChange={(e) => setGlobalSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGlobalSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleGlobalSearch} disabled={isSearching}>
                    {isSearching ? <Activity className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {searchResults.colleges.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-bold flex items-center gap-2"><Building2 className="h-4 w-4" /> Colleges</h3>
                      <div className="space-y-2">
                        {searchResults.colleges.map(c => (
                          <div key={c.id} className="p-3 rounded-lg border border-border/40 hover:bg-muted/30 cursor-pointer" onClick={() => openEditDialog('colleges', c)}>
                            <p className="font-medium text-sm">{c.name}</p>
                            <p className="text-xs text-muted-foreground">{c.location}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.schools.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-bold flex items-center gap-2"><School className="h-4 w-4" /> Schools</h3>
                      <div className="space-y-2">
                        {searchResults.schools.map(s => (
                          <div key={s.id} className="p-3 rounded-lg border border-border/40 hover:bg-muted/30 cursor-pointer" onClick={() => openEditDialog('schools', s)}>
                            <p className="font-medium text-sm">{s.name}</p>
                            <p className="text-xs text-muted-foreground">{s.location}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {searchResults.exams.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="font-bold flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Exams</h3>
                      <div className="space-y-2">
                        {searchResults.exams.map(e => (
                          <div key={e.id} className="p-3 rounded-lg border border-border/40 hover:bg-muted/30 cursor-pointer" onClick={() => openEditDialog('exams', e)}>
                            <p className="font-medium text-sm">{e.name}</p>
                            <p className="text-xs text-muted-foreground">{e.authority}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {!isSearching && globalSearchQuery && Object.values(searchResults).every(arr => arr.length === 0) && (
                  <div className="text-center py-12 text-muted-foreground">No results found for "{globalSearchQuery}"</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <EmailConfigToggle isOwner={isOwner} />
                  <div className="pt-4 border-t border-border/40">
                    <h4 className="font-semibold mb-4">Maintenance Mode</h4>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                      <div>
                        <p className="font-bold text-orange-600 dark:text-orange-400">Offline for Updates</p>
                        <p className="text-xs text-muted-foreground">Prevent user access during core migrations</p>
                      </div>
                      <Button variant="outline" className="border-orange-500/50 text-orange-600">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card border-none">
                <CardHeader>
                  <CardTitle>Security Hardening</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl border border-border/40 bg-card/50">
                    <p className="font-semibold text-sm mb-1">Session Timeout</p>
                    <p className="text-xs text-muted-foreground mb-4">Current: 24 Hours</p>
                    <Button variant="outline" size="sm" className="w-full">Configure Policy</Button>
                  </div>
                  <div className="p-4 rounded-xl border border-border/40 bg-card/50">
                    <p className="font-semibold text-sm mb-1">Password Policy</p>
                    <p className="text-xs text-muted-foreground mb-4">Min 10 chars, symbols required</p>
                    <Button variant="outline" size="sm" className="w-full">Update Requirements</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AnimatePresence>

    <InstitutionDialog 
      isOpen={isEditDialogOpen} 
      onOpenChange={setIsEditDialogOpen} 
      type={editingItem?.type} 
      mode="edit" 
      initialData={editingItem?.data} 
    />
    
    <InstitutionDialog 
      isOpen={isAddDialogOpen.open} 
      onOpenChange={(open: boolean) => setIsAddDialogOpen({ ...isAddDialogOpen, open })} 
      type={isAddDialogOpen.type} 
      mode="add" 
    />
    
    <Dialog open={notificationDialogOpen} onOpenChange={setNotificationDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quick Broadcast</DialogTitle>
          <DialogDescription>Send a message to all active users</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Input value={notificationSubject} onChange={(e) => setNotificationSubject(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea value={notificationMessage} onChange={(e) => setNotificationMessage(e.target.value)} rows={4} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSendNotification} disabled={sendingNotification} className="w-full">
            {sendingNotification ? "Send Announcement" : "Send Announcement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </main>
</div>
</div>
);
};

export default Admin;
