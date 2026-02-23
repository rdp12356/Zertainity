import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, History, Loader2, Trophy, ChevronRight, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnalysisRecord {
    id: string;
    created_at: string;
    education_level: string;
    top_careers: { career: string; matchScore: number; domain: string }[];
    ai_model_used: string;
    email_sent: boolean;
}

const SCORE_COLOR = (s: number) => s >= 75 ? "text-emerald-600" : s >= 55 ? "text-amber-600" : "text-red-500";

const AnalysisHistory = () => {
    const navigate = useNavigate();
    const [records, setRecords] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [authed, setAuthed] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (!session) { setAuthed(false); setLoading(false); return; }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data } = await (supabase as any)
                .from("career_results")
                .select("id, created_at, education_level, top_careers, ai_model_used, email_sent")
                .order("created_at", { ascending: false })
                .limit(20);
            setRecords((data ?? []) as AnalysisRecord[]);
            setLoading(false);
        });
    }, []);

    if (!authed) return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
            <History className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Sign in to view your analysis history.</p>
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <History className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold">Analysis History</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-2xl">
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}

                {!loading && records.length === 0 && (
                    <Card className="text-center py-16">
                        <CardContent>
                            <History className="h-12 w-12 mx-auto mb-4 text-muted-foreground/40" />
                            <p className="text-muted-foreground mb-4">No analyses yet. Complete your first career analysis.</p>
                            <Button onClick={() => navigate("/education-level")}>Start Analysis</Button>
                        </CardContent>
                    </Card>
                )}

                {!loading && records.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">{records.length} {records.length === 1 ? "analysis" : "analyses"} found</p>
                        {records.map((rec, idx) => {
                            const top = rec.top_careers?.[0];
                            const date = new Date(rec.created_at).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                            });
                            return (
                                <Card key={rec.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    {idx === 0 && <Badge className="text-xs bg-black text-white">Latest</Badge>}
                                                    <span className="text-xs text-muted-foreground">{date}</span>
                                                    <span className="text-xs text-muted-foreground capitalize">· {rec.education_level}</span>
                                                </div>
                                                <CardTitle className="text-lg flex items-center gap-2">
                                                    <Trophy className="h-4 w-4 text-amber-500" />
                                                    {top?.career ?? "Unknown"}
                                                    {top && <span className={`text-sm font-bold ${SCORE_COLOR(top.matchScore)}`}>{top.matchScore}%</span>}
                                                </CardTitle>
                                                <CardDescription className="capitalize">{top?.domain}</CardDescription>
                                            </div>
                                            <Badge variant="outline" className="text-xs capitalize">{rec.ai_model_used}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {rec.top_careers?.slice(1, 3).map(c => (
                                                <span key={c.career} className="text-xs bg-muted text-muted-foreground rounded-full px-2.5 py-0.5">
                                                    {c.career} · {c.matchScore}%
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm" variant="outline"
                                                className="gap-1.5 text-xs"
                                                onClick={() => navigate("/career-comparison", { state: { careers: rec.top_careers } })}
                                            >
                                                Compare <ChevronRight className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                size="sm" variant="ghost"
                                                className="gap-1.5 text-xs"
                                                onClick={() => navigate("/education-level")}
                                            >
                                                <RefreshCw className="h-3.5 w-3.5" /> Retake
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default AnalysisHistory;
