import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, LogOut, User as UserIcon, MapPin, Phone, Calendar, Sun, History, TrendingUp, Sparkles } from "lucide-react";

interface CareerHistory {
  id: string;
  education_level: string;
  top_recommendation: string | null;
  top_match_percent: number | null;
  all_recommendations: any;
  created_at: string;
}

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<CareerHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
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
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadProfile(session.user.id);
      loadHistory(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        setProfile({
          display_name: (data as any).display_name || "",
          phone_number: data.phone_number || "",
          bio: data.bio || "",
          location: data.location || "",
          date_of_birth: data.date_of_birth || "",
        });
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async (userId: string) => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from("career_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setHistory(data as CareerHistory[]);
      }
    } catch (err) {
      console.error("Error loading history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("user_profiles")
        .upsert({
          id: user.id,
          display_name: (profile as any).display_name || null,
          phone_number: profile.phone_number || null,
          bio: profile.bio || null,
          location: profile.location || null,
          date_of_birth: profile.date_of_birth || null,
        } as any);

      if (error) throw error;

      toast({ title: "Saved", description: "Your profile has been updated." });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatEducationLevel = (level: string) => {
    if (level === "after-10th") return "After 10th Grade";
    if (level === "after-12th") return "After 12th Grade";
    return level;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-2xl">
        <Tabs defaultValue="personalization">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="personalization" className="flex-1">
              <UserIcon className="h-4 w-4 mr-2" />
              Personalization
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              <History className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          {/* ── PERSONALIZATION TAB ── */}
          <TabsContent value="personalization" className="space-y-6">
            {/* Account Info */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserIcon className="h-5 w-5" />
                  Account
                </CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Profile */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="text-lg">Profile</CardTitle>
                <CardDescription>Customize your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="display_name" className="flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5" /> Display Name
                  </Label>
                  <Input
                    id="display_name"
                    placeholder="How should we call you?"
                    value={(profile as any).display_name}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value } as any)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" /> Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    value={profile.phone_number}
                    onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Date of Birth
                  </Label>
                  <Input
                    id="dob"
                    type="date"
                    value={profile.date_of_birth}
                    onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself..."
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full rounded-full">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card className="border-border/40">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sun className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>Toggle between light and dark mode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Theme</span>
                  <ThemeToggle />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── HISTORY TAB ── */}
          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-foreground">Career Check History</h2>
              <span className="text-xs text-muted-foreground">{history.length} assessment{history.length !== 1 ? "s" : ""}</span>
            </div>

            {historyLoading ? (
              <p className="text-muted-foreground text-sm text-center py-8">Loading history...</p>
            ) : history.length === 0 ? (
              <Card className="border-border/40 border-dashed">
                <CardContent className="py-12 text-center space-y-3">
                  <History className="h-10 w-10 text-muted-foreground/40 mx-auto" />
                  <p className="text-muted-foreground text-sm">No career checks yet.</p>
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigate("/education-level")}>
                    Start Your First Assessment
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {history.map((entry) => {
                  const recs = Array.isArray(entry.all_recommendations) ? entry.all_recommendations : [];
                  return (
                    <Card key={entry.id} className="border-border/40 hover:border-border transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-primary" />
                              {entry.top_recommendation || "Career Assessment"}
                            </CardTitle>
                            <CardDescription className="mt-1 text-xs">
                              {formatDate(entry.created_at)}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {formatEducationLevel(entry.education_level)}
                            </Badge>
                            {entry.top_match_percent != null && (
                              <Badge className="text-xs bg-primary/10 text-primary border-primary/20">
                                {entry.top_match_percent}% Match
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {recs.length > 0 && (
                        <CardContent className="pt-0 space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recommended Paths</p>
                          <div className="space-y-1.5">
                            {recs.map((rec: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 min-w-0">
                                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                                  <span className="truncate text-foreground">{rec.stream}</span>
                                </div>
                                <span className="text-muted-foreground shrink-0 ml-2 text-xs">{rec.match}%</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
