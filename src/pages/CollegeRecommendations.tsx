import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MapPin, GraduationCap, ExternalLink, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface College {
    id: string;
    name: string;
    state: string;
    city?: string;
    college_type: string;
    ranking_nirf?: number;
    courses: string[];
    cutoffs: Record<string, unknown>;
    relevant_exams: string[];
    website?: string;
}

const TYPE_COLORS: Record<string, string> = {
    IIT: "bg-blue-100 text-blue-700",
    NIT: "bg-indigo-100 text-indigo-700",
    BITS: "bg-violet-100 text-violet-700",
    IIM: "bg-emerald-100 text-emerald-700",
    AIIMS: "bg-red-100 text-red-700",
    NLU: "bg-amber-100 text-amber-700",
    Central: "bg-cyan-100 text-cyan-700",
    State: "bg-orange-100 text-orange-700",
    Deemed: "bg-pink-100 text-pink-700",
    Private: "bg-gray-100 text-gray-700",
};

const TYPES = ["All", "IIT", "NIT", "BITS", "IIM", "AIIMS", "NLU", "Central", "Deemed", "Private"] as const;

const CollegeRecommendations = () => {
    const navigate = useNavigate();
    const [colleges, setColleges] = useState<College[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [typeFilter, setType] = useState("All");
    const [selected, setSelected] = useState<College | null>(null);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any)
            .from("college_data")
            .select("*")
            .eq("is_active", true)
            .order("ranking_nirf", { ascending: true, nullsFirst: false })
            .then(({ data }: { data: College[] | null }) => {
                setColleges((data ?? []) as College[]);
                setLoading(false);
            });
    }, []);

    const filtered = colleges.filter(c => {
        const matchType = typeFilter === "All" || c.college_type === typeFilter;
        const matchQuery = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.state.toLowerCase().includes(query.toLowerCase());
        return matchType && matchQuery;
    });

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <GraduationCap className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold">College Finder</h1>
                    <span className="ml-auto text-xs text-muted-foreground">{filtered.length} institutions</span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Filters */}
                <div className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search college or state…"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {TYPES.map(t => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${typeFilter === t ? "bg-black text-white border-black" : "border-border hover:bg-muted"
                                    }`}
                            >{t}</button>
                        ))}
                    </div>
                </div>

                {loading && (
                    <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                        Loading colleges…
                    </div>
                )}

                {!loading && (
                    <div className="grid md:grid-cols-5 gap-6">
                        {/* List */}
                        <div className="md:col-span-2 space-y-2 max-h-[70vh] overflow-y-auto pr-1">
                            {filtered.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => setSelected(c)}
                                    className={`w-full text-left p-3.5 rounded-lg border transition-all ${selected?.id === c.id ? "border-black bg-black/5" : "border-border hover:border-black/30"
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <span className="font-semibold text-sm leading-tight">{c.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${TYPE_COLORS[c.college_type] ?? "bg-gray-100 text-gray-700"}`}>
                                            {c.college_type}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">{c.city ? `${c.city}, ` : ""}{c.state}</span>
                                        {c.ranking_nirf && (
                                            <span className="text-xs text-muted-foreground ml-auto">NIRF #{c.ranking_nirf}</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                            {filtered.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground text-sm">No colleges found</div>
                            )}
                        </div>

                        {/* Detail */}
                        <div className="md:col-span-3">
                            {selected ? (
                                <Card className="sticky top-24">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[selected.college_type]}`}>
                                                        {selected.college_type}
                                                    </span>
                                                    {selected.ranking_nirf && (
                                                        <span className="text-xs text-muted-foreground">NIRF Rank #{selected.ranking_nirf}</span>
                                                    )}
                                                </div>
                                                <CardTitle className="text-xl leading-tight">{selected.name}</CardTitle>
                                                <CardDescription className="flex items-center gap-1 mt-1">
                                                    <MapPin className="h-3.5 w-3.5" />{selected.city ? `${selected.city}, ` : ""}{selected.state}
                                                </CardDescription>
                                            </div>
                                            {selected.website && (
                                                <a href={selected.website} target="_blank" rel="noreferrer">
                                                    <Button size="sm" variant="outline" className="gap-1.5 flex-shrink-0">
                                                        Visit <ExternalLink className="h-3.5 w-3.5" />
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        {/* Courses */}
                                        {selected.courses.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Available Courses</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selected.courses.map(c => <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>)}
                                                </div>
                                            </div>
                                        )}

                                        {/* Entrance Exams */}
                                        {selected.relevant_exams.length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Entrance Exams</p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {selected.relevant_exams.map(e => (
                                                        <button
                                                            key={e}
                                                            onClick={() => navigate("/entrance-exams")}
                                                            className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-0.5 hover:bg-blue-100 transition-colors"
                                                        >
                                                            {e}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Cutoffs */}
                                        {selected.cutoffs && Object.keys(selected.cutoffs).length > 0 && (
                                            <div>
                                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                                    <Filter className="h-3.5 w-3.5" /> Typical Cutoffs (General)
                                                </p>
                                                <div className="space-y-1.5">
                                                    {Object.entries(selected.cutoffs).map(([exam, data]) => (
                                                        <div key={exam} className="flex items-center justify-between bg-muted/40 rounded px-3 py-2">
                                                            <span className="text-xs font-medium">{exam.replace(/_/g, " ").toUpperCase()}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {typeof data === "object" && data !== null && "general" in data
                                                                    ? String((data as Record<string, unknown>).general)
                                                                    : "—"}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="h-64 flex items-center justify-center">
                                    <div className="text-center text-muted-foreground">
                                        <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-40" />
                                        <p className="text-sm">Select a college to view details</p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CollegeRecommendations;
