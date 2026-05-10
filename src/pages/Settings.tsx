import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User } from "@supabase/supabase-js";
import {
  ArrowLeft, LogOut, User as UserIcon, MapPin, Phone, Calendar,
  Shield, History, TrendingUp, Sparkles, Mail, Clock, KeyRound,
  AlertTriangle, CheckCircle2, Palette, ChevronRight, Bell, Download,
  Trash2, Info, ExternalLink, BellRing, FileText
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface CareerHistory {
  id: string;
  education_level: string;
  top_recommendation: string | null;
  top_match_percent: number | null;
  all_recommendations: any;
  created_at: string;
}

type SettingsSection = "profile" | "security" | "appearance" | "notifications" | "data" | "history" | "about";

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [history, setHistory] = useState<CareerHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem("z_notif_prefs") || "{}"); }
    catch { return {}; }
  });
  const [profile, setProfile] = useState({
    display_name: "",
    phone_number: "",
    bio: "",
    location: "",
    date_of_birth: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) { navigate("/auth"); return; }
      setUser(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { navigate("/auth"); return; }
      setUser(session.user);
      loadProfile(session.user.id);
      loadHistory(session.user.id);
      loadRoles(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
      if (data) {
        setProfile({
          display_name: (data as any).display_name || "",
          phone_number: data.phone_number || "",
          bio: data.bio || "",
          location: data.location || "",
          date_of_birth: data.date_of_birth || "",
        });
      }
    } catch (err) { console.error("Error loading profile:", err); }
    finally { setLoading(false); }
  };

  const loadRoles = async (userId: string) => {
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (data) setUserRoles(data.map((r: any) => r.role));
    } catch (err) { console.error("Error loading roles:", err); }
  };

  const loadHistory = async (userId: string) => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase.from("career_history").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (!error && data) setHistory(data as CareerHistory[]);
    } catch (err) { console.error("Error loading history:", err); }
    finally { setHistoryLoading(false); }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        display_name: (profile as any).display_name || null,
        phone_number: profile.phone_number || null,
        bio: profile.bio || null,
        location: profile.location || null,
        date_of_birth: profile.date_of_birth || null,
      } as any);
      if (error) throw error;
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword.length < 6) {
      toast({ title: "Too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (error) throw error;
      setPasswords({ newPassword: "", confirmPassword: "" });
      toast({ title: "Password updated", description: "Your password has been changed successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setChangingPassword(false); }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleNotif = (key: string) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("z_notif_prefs", JSON.stringify(updated));
    toast({ title: "Preference saved" });
  };

  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const [{ data: prof }, { data: hist }] = await Promise.all([
        supabase.from("user_profiles").select("*").eq("id", user.id).single(),
        supabase.from("career_history").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      const blob = new Blob([JSON.stringify({ profile: prof, career_history: hist, email: user.email, exported_at: new Date().toISOString() }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `zertainity-data-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Data exported", description: "Your data has been downloaded as JSON." });
    } catch { toast({ title: "Export failed", variant: "destructive" }); }
    finally { setExporting(false); }
  };

  const handleClearHistory = async () => {
    if (!user || !confirm("Are you sure? This will permanently delete all your career assessment history.")) return;
    setClearingHistory(true);
    try {
      const { error } = await supabase.from("career_history").delete().eq("user_id", user.id);
      if (error) throw error;
      setHistory([]);
      toast({ title: "History cleared", description: "All career assessments have been removed." });
    } catch { toast({ title: "Failed to clear", variant: "destructive" }); }
    finally { setClearingHistory(false); }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const formatEducationLevel = (level: string) => {
    if (level === "after-10th") return "After 10th";
    if (level === "after-12th") return "After 12th";
    return level;
  };

  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";
  const lastSignIn = user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
  const authProvider = user?.app_metadata?.provider === "google" ? "Google" : "Email";
  const initials = (profile.display_name || user?.email || "U").slice(0, 2).toUpperCase();

  const NAV_ITEMS: { key: SettingsSection; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "profile", label: "Profile", icon: <UserIcon className="h-4 w-4" />, desc: "Personal information" },
    { key: "security", label: "Security", icon: <Shield className="h-4 w-4" />, desc: "Password & sessions" },
    { key: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" />, desc: "Theme preferences" },
    { key: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" />, desc: "Email preferences" },
    { key: "data", label: "Data & Privacy", icon: <FileText className="h-4 w-4" />, desc: "Export & manage data" },
    { key: "history", label: "Career History", icon: <History className="h-4 w-4" />, desc: `${history.length} assessment${history.length !== 1 ? "s" : ""}` },
    { key: "about", label: "About", icon: <Info className="h-4 w-4" />, desc: "Platform info" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="h-5 w-5" /></Button>
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Profile Summary Banner */}
        <div className="mb-8 flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary">{initials}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-foreground truncate">
              {profile.display_name || user?.email?.split("@")[0] || "User"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {userRoles.map((role) => (
                <Badge key={role} variant="secondary" className="text-[10px] uppercase tracking-wider font-medium">
                  {role}
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />Member since {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Nav */}
          <nav className="md:w-56 shrink-0 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === item.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {item.icon}
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                </div>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-opacity ${activeSection === item.key ? "opacity-100" : "opacity-0"}`} />
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* ── PROFILE ── */}
            {activeSection === "profile" && (
              <>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>Update your profile details visible across the platform.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="display_name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Display Name</Label>
                        <Input id="display_name" placeholder="How should we call you?" value={(profile as any).display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value } as any)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</Label>
                        <Input id="phone" placeholder="+91 98765 43210" value={profile.phone_number} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</Label>
                        <Input id="location" placeholder="City, State" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date of Birth</Label>
                        <Input id="dob" type="date" value={profile.date_of_birth} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself and your career aspirations…" value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="resize-none" />
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                      <Button onClick={handleSave} disabled={saving} className="rounded-full px-8">
                        {saving ? "Saving…" : "Save Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Details</CardTitle>
                    <CardDescription>Read-only account metadata from your authentication provider.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                        <p className="text-sm font-medium flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Auth Provider</p>
                        <p className="text-sm font-medium flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-muted-foreground" />{authProvider}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Email Verified</p>
                        <p className="text-sm font-medium flex items-center gap-1.5">
                          {user?.email_confirmed_at
                            ? <><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />Verified</>
                            : <><AlertTriangle className="h-3.5 w-3.5 text-amber-500" />Not verified</>
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Last Sign In</p>
                        <p className="text-sm font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{lastSignIn}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ── SECURITY ── */}
            {activeSection === "security" && (
              <>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><KeyRound className="h-5 w-5" />Change Password</CardTitle>
                    <CardDescription>Set a new password for your account. Must be at least 6 characters.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {authProvider === "Google" ? (
                      <div className="flex items-start gap-3 rounded-lg bg-muted/50 border border-border/40 p-4">
                        <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Managed by Google</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Your account uses Google OAuth. Password is managed through your Google account settings.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="new-pw" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Password</Label>
                          <Input id="new-pw" type="password" placeholder="••••••••" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-pw" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</Label>
                          <Input id="confirm-pw" type="password" placeholder="••••••••" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
                        </div>
                        <Separator />
                        <div className="flex justify-end">
                          <Button onClick={handlePasswordChange} disabled={changingPassword || !passwords.newPassword} className="rounded-full px-8">
                            {changingPassword ? "Updating…" : "Update Password"}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                      <div>
                        <p className="text-sm font-medium">Sign out of all devices</p>
                        <p className="text-xs text-muted-foreground mt-0.5">This will end all active sessions including this one.</p>
                      </div>
                      <Button variant="destructive" size="sm" className="rounded-full shrink-0" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ── APPEARANCE ── */}
            {activeSection === "appearance" && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Palette className="h-5 w-5" />Theme</CardTitle>
                  <CardDescription>Choose how the application looks for you.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 border border-border/40 p-4">
                    <div>
                      <p className="text-sm font-medium">Color Mode</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark appearance.</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === "notifications" && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><BellRing className="h-5 w-5" />Email Notifications</CardTitle>
                  <CardDescription>Choose which emails you'd like to receive from Zertainity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { key: "assessment_results", label: "Assessment Results", desc: "Get a copy of your career results via email" },
                    { key: "product_updates", label: "Product Updates", desc: "New features, career tools, and platform improvements" },
                    { key: "career_tips", label: "Career Tips & Resources", desc: "Weekly curated articles and guidance for students" },
                    { key: "account_activity", label: "Account Activity", desc: "Security alerts and sign-in notifications" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key] !== false} onCheckedChange={() => toggleNotif(item.key)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* ── DATA & PRIVACY ── */}
            {activeSection === "data" && (
              <>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Download className="h-5 w-5" />Export Your Data</CardTitle>
                    <CardDescription>Download a copy of your profile and career assessment history as a JSON file.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-lg bg-muted/30 border border-border/40 p-4">
                      <div>
                        <p className="text-sm font-medium">Download personal data</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Includes profile info, assessment results, and account metadata.</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full shrink-0" onClick={handleExportData} disabled={exporting}>
                        <Download className="h-4 w-4 mr-1.5" />{exporting ? "Exporting…" : "Export"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-destructive"><Trash2 className="h-5 w-5" />Delete Data</CardTitle>
                    <CardDescription>Permanently remove your career assessment history. This cannot be undone.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                      <div>
                        <p className="text-sm font-medium">Clear career history</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{history.length} assessment{history.length !== 1 ? "s" : ""} will be permanently deleted.</p>
                      </div>
                      <Button variant="destructive" size="sm" className="rounded-full shrink-0" onClick={handleClearHistory} disabled={clearingHistory || history.length === 0}>
                        <Trash2 className="h-4 w-4 mr-1.5" />{clearingHistory ? "Clearing…" : "Clear All"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Privacy Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Your data is stored securely on Supabase infrastructure with row-level security.</p>
                      <p>• We do not sell or share your personal information with third parties.</p>
                      <p>• Assessment data is used solely to provide personalized career recommendations.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <a href="/privacy-policy" className="text-xs text-primary hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" />Privacy Policy</a>
                      <a href="/terms-of-service" className="text-xs text-primary hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" />Terms of Service</a>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* ── HISTORY ── */}
            {activeSection === "history" && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Career Assessment History</h2>
                    <p className="text-sm text-muted-foreground">{history.length} assessment{history.length !== 1 ? "s" : ""} completed</p>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigate("/education-level")}>
                    New Assessment
                  </Button>
                </div>

                {historyLoading ? (
                  <div className="flex justify-center py-12"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : history.length === 0 ? (
                  <Card className="border-border/40 border-dashed">
                    <CardContent className="py-16 text-center space-y-4">
                      <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                        <History className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">No assessments yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Take your first career assessment to see personalized recommendations here.</p>
                      </div>
                      <Button className="rounded-full" onClick={() => navigate("/education-level")}>Start Your First Assessment</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {history.map((entry) => {
                      const recs = Array.isArray(entry.all_recommendations) ? entry.all_recommendations : [];
                      return (
                        <Card key={entry.id} className="border-border/40 hover:border-border/80 transition-colors">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{entry.top_recommendation || "Career Assessment"}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(entry.created_at)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Badge variant="secondary" className="text-[10px]">{formatEducationLevel(entry.education_level)}</Badge>
                                {entry.top_match_percent != null && (
                                  <Badge className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400">
                                    {entry.top_match_percent}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {recs.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {recs.map((rec: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-muted/30">
                                    <span className="flex items-center gap-1.5 truncate text-foreground">
                                      <TrendingUp className="h-3 w-3 text-muted-foreground shrink-0" />{rec.stream}
                                    </span>
                                    <span className="text-muted-foreground ml-2 shrink-0">{rec.match}%</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ── ABOUT ── */}
            {activeSection === "about" && (
              <>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">About Zertainity</CardTitle>
                    <CardDescription>AI-powered career guidance for students in India.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/30 border border-border/40 p-3">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Version</p>
                        <p className="text-sm font-medium mt-0.5">1.0.0</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 border border-border/40 p-3">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Platform</p>
                        <p className="text-sm font-medium mt-0.5">Web App</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <a href="/privacy-policy" className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors group">
                        <span className="text-sm font-medium">Privacy Policy</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                      <a href="/terms-of-service" className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors group">
                        <span className="text-sm font-medium">Terms of Service</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                      <a href="mailto:support@zertainity.in" className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors group">
                        <span className="text-sm font-medium">Contact Support</span>
                        <Mail className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                    </div>
                    <Separator />
                    <p className="text-xs text-center text-muted-foreground">© {new Date().getFullYear()} Zertainity. All rights reserved.</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
