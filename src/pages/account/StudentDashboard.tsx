import { useEffect, useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { User, History, LayoutDashboard, Settings, MapPin, Award, BookOpen, Clock, PlayCircle, Target, TrendingUp, Book, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface UserProfile {
    id: string;
    avatar_url: string | null;
    date_of_birth: string | null;
    phone_number: string | null;
    bio: string | null;
    location: string | null;
}

interface AnalysisRecord {
    id: string;
    created_at: string;
    education_level: string;
    top_careers: { career: string; matchScore: number; domain: string }[];
}

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [records, setRecords] = useState<AnalysisRecord[]>([]);
    const [email, setEmail] = useState("");

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                navigate("/auth");
                return;
            }

            setEmail(user.email ?? "");

            const { data: profileData } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (profileData) setProfile(profileData as UserProfile);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: historyData } = await (supabase as any)
                .from("career_results")
                .select("id, created_at, education_level, top_careers")
                .order("created_at", { ascending: false })
                .limit(5);
            setRecords((historyData ?? []) as AnalysisRecord[]);

        } catch (err) {
            console.error("Dashboard fetch error:", err);
            toast.error("Failed to load dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse flex flex-col items-center">
                    <LayoutDashboard className="h-10 w-10 text-primary/50 mb-4" />
                    <p className="text-muted-foreground font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const highestScore = records.reduce((max, record) => {
        const topCareer = record.top_careers?.[0];
        return topCareer && topCareer.matchScore > max ? topCareer.matchScore : max;
    }, 0);

    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            <PageSEO
                title="Your Student Dashboard - Zertainity"
                description="Manage your career track, view historical analysis results, and explore scholarships and entrance exams personalized for you."
                keywords="student dashboard, career tracking, exam finder, scholarship matching"
                canonical="/dashboard"
                customSchema={{
                    "@type": "WebPage",
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [{
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": "https://www.zertainity.in/"
                        },{
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Dashboard"
                        }]
                    }
                }}
            />
            
            <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-sm">
                            <LayoutDashboard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Student Dashboard</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Welcome back, {email.split('@')[0]}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <History className="h-5 w-5 text-primary mb-3 opacity-80" />
                            <h3 className="text-3xl font-black mb-1">{records.length}</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Analyses Taken</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <Award className="h-5 w-5 text-amber-500 mb-3 opacity-80" />
                            <h3 className="text-3xl font-black mb-1">{highestScore}%</h3>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Highest Match</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-card to-muted/30 border-border/50 md:col-span-2 hover:border-primary/30 transition-all">
                        <CardContent className="p-6 flex flex-col justify-center h-full">
                            <h3 className="text-lg font-bold mb-2">Ready for your next step?</h3>
                            <p className="text-sm text-muted-foreground mb-4">Discover exams, scholarships, and colleges that fit your profile perfectly.</p>
                            <div className="flex gap-2">
                                <Button size="sm" onClick={() => navigate("/education-level")} className="bg-primary shadow-glow hover:bg-primary/90 text-xs">
                                    <PlayCircle className="h-4 w-4 mr-1.5" /> New Analysis
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => navigate("/exam-tracker")} className="text-xs">
                                    Track Exams
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1 space-y-6">
                        <Card className="overflow-hidden border-border/60">
                            <div className="h-20 bg-gradient-to-r from-primary/20 to-secondary/20 w-full" />
                            <CardContent className="pt-0 flex flex-col items-center text-center relative">
                                <div className="h-20 w-20 rounded-full bg-card border-4 border-background shadow-md flex items-center justify-center -mt-10 mb-4 overflow-hidden relative z-10">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-8 w-8 text-primary/60" />
                                    )}
                                </div>
                                <h2 className="text-xl font-bold truncate w-full px-4">{email.split('@')[0]}</h2>
                                <p className="text-sm text-muted-foreground truncate w-full px-4 mb-4">{email}</p>
                                
                                {profile?.location && (
                                    <Badge variant="secondary" className="mb-4">
                                        <MapPin className="h-3 w-3 mr-1" /> {profile.location}
                                    </Badge>
                                )}

                                <div className="w-full flex gap-2">
                                    <Button variant="outline" className="flex-1" onClick={() => navigate("/profile")}>
                                        <Settings className="h-4 w-4 mr-2" /> Edit Info
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/60">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center">
                                    <BookOpen className="h-4 w-4 mr-2" /> Quick Tools
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1.5">
                                <Button variant="ghost" className="w-full justify-start text-sm h-11" onClick={() => navigate("/exam-finder")}>
                                    Age-Based Exam Finder 
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm h-11" onClick={() => navigate("/rank-predictor")}>
                                    College Rank Predictor 
                                </Button>
                                <Button variant="ghost" className="w-full justify-start text-sm h-11" onClick={() => navigate("/scholarships")}>
                                    Scholarships 
                                </Button>
                            </CardContent>
                        </Card>

                        {/* AdSense Unit (Dashboard Sidebar) */}
                        <Card className="border-dashed border-border/50 bg-muted/10 overflow-hidden">
                            <CardContent className="p-4 text-center">
                                <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest block mb-3 opacity-40">Partner Content</span>
                                <div className="aspect-[4/3] w-full bg-background/60 rounded-lg flex flex-col items-center justify-center border border-border/40 mb-3 shadow-inner">
                                    <span className="text-[10px] font-mono text-muted-foreground/30">ADSENSE_DASHBOARD_RECTANGLE</span>
                                    <div className="w-16 h-1 bg-muted rounded-full mt-2" />
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Unlock your global education potential.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <Card className="border-border/60 shadow-sm">
                            <CardHeader className="bg-muted/30 border-b border-border/40 pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Target className="h-5 w-5 text-indigo-500" /> Power Tools
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full justify-start text-sm h-14 bg-card hover:bg-muted/50 transition-colors" onClick={() => navigate("/career-kanban")}>
                                    <div className="bg-orange-500/10 p-2 rounded-lg mr-3">
                                        <TrendingUp className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <div className="text-left leading-tight">
                                        <div className="font-semibold">Career Kanban</div>
                                        <div className="text-[10px] text-muted-foreground font-normal">Track Roadmap</div>
                                    </div>
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-sm h-14 bg-card hover:bg-muted/50 transition-colors" onClick={() => navigate("/portfolio-builder")}>
                                    <div className="bg-blue-500/10 p-2 rounded-lg mr-3">
                                        <Book className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div className="text-left leading-tight">
                                        <div className="font-semibold">Portfolio Builder</div>
                                        <div className="text-[10px] text-muted-foreground font-normal">Create Resume</div>
                                    </div>
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-sm h-14 bg-card hover:bg-muted/50 transition-colors" onClick={() => navigate("/career-reels")}>
                                    <div className="bg-pink-500/10 p-2 rounded-lg mr-3">
                                        <Target className="h-4 w-4 text-pink-600" />
                                    </div>
                                    <div className="text-left leading-tight">
                                        <div className="font-semibold">Career Reels</div>
                                        <div className="text-[10px] text-muted-foreground font-normal">Day in the Life</div>
                                    </div>
                                </Button>
                                <Button variant="outline" className="w-full justify-start text-sm h-14 bg-card hover:bg-muted/50 transition-colors" onClick={() => navigate("/alumni-connect")}>
                                    <div className="bg-violet-500/10 p-2 rounded-lg mr-3">
                                        <Users className="h-4 w-4 text-violet-600" />
                                    </div>
                                    <div className="text-left leading-tight">
                                        <div className="font-semibold">Alumni Connect</div>
                                        <div className="text-[10px] text-muted-foreground font-normal">1-on-1 Mentorship</div>
                                    </div>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-border/60">
                            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/40">
                                <div>
                                    <CardTitle>Recent Career Analyses</CardTitle>
                                    <CardDescription>Your latest AI-driven career roadmaps.</CardDescription>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => navigate("/history")} className="text-xs">
                                    View All
                                </Button>
                            </CardHeader>
                            <CardContent className="pt-6">
                                {records.length === 0 ? (
                                    <div className="text-center py-12">
                                        <History className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                                        <p className="text-muted-foreground font-medium">No analyses taken yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {records.map((rec, index) => {
                                            const top = rec.top_careers?.[0];
                                            const date = new Date(rec.created_at).toLocaleDateString("en-IN", {
                                                month: "short", day: "numeric", year: "numeric"
                                            });
                                            const isLast = index === records.length - 1;

                                            return (
                                                <div key={rec.id} className="relative pl-6">
                                                    {!isLast && (
                                                        <div className="absolute left-[11px] top-6 bottom-[-24px] w-px bg-border" />
                                                    )}
                                                    <div className="absolute left-0 top-1.5 h-[22px] w-[22px] rounded-full border-2 border-background bg-primary/20 flex items-center justify-center z-10">
                                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                                    </div>
                                                    
                                                    <div className="bg-muted/30 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <span className="text-xs font-semibold text-primary"><Clock className="h-3 w-3 inline mr-1" />{date}</span>
                                                                <Badge variant="outline" className="text-[10px] h-5 capitalize px-1.5 py-0">{rec.education_level}</Badge>
                                                            </div>
                                                            <h4 className="font-bold text-foreground">
                                                                {top?.career || "Analysis Complete"}
                                                            </h4>
                                                            <p className="text-sm text-muted-foreground capitalize">Top Domain: {top?.domain}</p>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            {top && (
                                                                <div className="text-right">
                                                                    <span className="text-2xl font-black tracking-tighter text-foreground block leading-none">{top.matchScore}%</span>
                                                                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Match</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
