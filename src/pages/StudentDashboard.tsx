import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUserSession } from "@/hooks/use-user-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BookOpen, History, Settings, GraduationCap, ArrowRight, User as UserIcon, Mail, Save, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";


const StudentDashboard = () => {
    const { user, profile, role, loading: sessionLoading, refreshData } = useUserSession();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        position: "",
        location: ""
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.display_name || "",
                position: profile.position || "",
                location: profile.location || ""
            });
        }
    }, [profile]);

    const handleSave = async () => {
        if (!user) return;
        setIsSaving(true);
        const { error } = await supabase
            .from("user_profiles")
            .update({
                display_name: formData.displayName,
                position: formData.position,
                location: formData.location
            })
            .eq("id", user.id);

        if (error) {
            toast.error("Failed to update profile");
        } else {
            toast.success("Profile updated successfully");
            if (user) await refreshData(user.id);
            setIsEditing(false);
        }
        setIsSaving(false);
    };
    const navigate = useNavigate();

    if (sessionLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading your dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">Student Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} className="rounded-full">
                            <Settings className="h-5 w-5" />
                        </Button>
                        <Avatar className="h-8 w-8 border border-border">
                            <AvatarImage src={profile?.avatar_url || ""} />
                            <AvatarFallback>{profile?.display_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12 max-w-6xl">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <Card className="overflow-hidden border-border/40 shadow-premium group">
                            <div className="h-24 bg-gradient-primary relative overflow-hidden">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 10, repeat: Infinity }}
                                    className="absolute inset-0 bg-white/5"
                                />
                            </div>
                            <CardContent className="pt-0 -mt-12 text-center relative">
                                <motion.div whileHover={{ scale: 1.05 }} className="inline-block relative">
                                    <Avatar className="h-24 w-24 mx-auto border-4 border-background shadow-lg">
                                        <AvatarImage src={profile?.avatar_url || ""} />
                                        <AvatarFallback className="text-2xl">{profile?.display_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </motion.div>
                                <div className="mt-4 space-y-4">
                                    {!isEditing ? (
                                        <>
                                            <div className="space-y-1">
                                                <h2 className="text-2xl font-bold">{profile?.display_name || "Student"}</h2>
                                                <p className="text-muted-foreground font-light">{user?.email}</p>
                                            </div>
                                            {profile?.position && (
                                                <Badge variant="outline" className="mt-2 text-primary border-primary/20 bg-primary/5">
                                                    {profile.position}
                                                </Badge>
                                            )}
                                            <Button variant="ghost" size="sm" className="w-full mt-4" onClick={() => setIsEditing(true)}>
                                                <Settings className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="space-y-3 pt-4 text-left">
                                            <div className="space-y-1">
                                                <Label className="text-xs">Display Name</Label>
                                                <Input
                                                    value={formData.displayName}
                                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Grade/Position</Label>
                                                <Input
                                                    value={formData.position}
                                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                                    placeholder="e.g. Grade 11"
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs">Location</Label>
                                                <Input
                                                    value={formData.location}
                                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    className="h-8 text-sm"
                                                />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <Button size="sm" variant="ghost" className="flex-1" onClick={() => setIsEditing(false)}>Cancel</Button>
                                                <Button size="sm" className="flex-1" onClick={handleSave} disabled={isSaving}>
                                                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t mt-6 grid grid-cols-2 gap-4">
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Joined</p>
                                        <p className="text-xs font-medium">{new Date(user?.created_at || "").toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-left">
                                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Status</p>
                                        <p className="text-xs font-medium text-green-500">Active</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/40">
                            <CardHeader>
                                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Stats</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Assessments Completed</span>
                                    <span className="font-bold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Saved Colleges</span>
                                    <span className="font-bold">0</span>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Right Column: Actions and Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div whileHover={{ y: -5 }} className="h-full">
                                <Card className="group hover:border-primary transition-all cursor-pointer h-full" onClick={() => navigate("/education-level")}>
                                    <CardHeader>
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <BookOpen className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="group-hover:text-primary transition-colors">Start New Assessment</CardTitle>
                                        <CardDescription>Discover your career path based on your interests and grades.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-primary text-sm font-medium">
                                            Begin Assessment <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            <motion.div whileHover={{ y: -5 }} className="h-full">
                                <Card className="group hover:border-primary transition-all cursor-pointer h-full" onClick={() => navigate("/college-predictor")}>
                                    <CardHeader>
                                        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <GraduationCap className="h-6 w-6" />
                                        </div>
                                        <CardTitle className="group-hover:text-primary transition-colors">College Predictor</CardTitle>
                                        <CardDescription>Find matching institutions based on your percentage and location.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center text-primary text-sm font-medium">
                                            Try Predictor <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>

                        <Card className="border-border/40">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Recent Activity</CardTitle>
                                    <CardDescription>Your latest actions on the platform.</CardDescription>
                                </div>
                                <History className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                                    <UserIcon className="h-12 w-12 mx-auto mb-4 opacity-10" />
                                    <p>Your activity history will appear here.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
