import { useState, useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, MapPin, GraduationCap, ExternalLink, Filter, Bookmark, BookmarkCheck, Star, ThumbsUp } from "lucide-react";
import { secureStorage } from "@/lib/security";
import { ALL_COLLEGES, CollegeEntry, COLLEGE_TYPES } from "@/data/colleges";

const TYPE_COLORS: Record<string, string> = {
    IIT: "bg-blue-100 text-blue-700 border-blue-200",
    NIT: "bg-indigo-100 text-indigo-700 border-indigo-200",
    BITS: "bg-violet-100 text-violet-700 border-violet-200",
    IIM: "bg-emerald-100 text-emerald-700 border-emerald-200",
    AIIMS: "bg-red-100 text-red-700 border-red-200",
    NLU: "bg-amber-100 text-amber-700 border-amber-200",
    Central: "bg-cyan-100 text-cyan-700 border-cyan-200",
    State: "bg-orange-100 text-orange-700 border-orange-200",
    IIIT: "bg-teal-100 text-teal-700 border-teal-200",
    IISER: "bg-lime-100 text-lime-700 border-lime-200",
    Deemed: "bg-pink-100 text-pink-700 border-pink-200",
    Private: "bg-gray-100 text-gray-700 border-gray-200",
    School: "bg-green-100 text-green-700 border-green-200",
};



const StarRating = ({ rating }: { rating: number }) => {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${i < full ? "text-yellow-400 fill-yellow-400" : i === full && hasHalf ? "text-yellow-400 fill-yellow-400/40" : "text-gray-300"}`}
                />
            ))}
            <span className="text-xs font-medium ml-1 text-muted-foreground">{rating.toFixed(1)}</span>
        </div>
    );
};

const CollegeRecommendations = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [typeFilter, setType] = useState("All");
    const [selected, setSelected] = useState<CollegeEntry | null>(null);
    const [savedBookmarks, setSavedBookmarks] = useState<string[]>([]);
    const [bestForFilter, setBestForFilter] = useState("");

    useEffect(() => {
        const saved = secureStorage.getItem("zertainity_college_bookmarks");
        if (saved) {
            try {
                setSavedBookmarks(saved.map((b: any) => b.id));
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const toggleBookmark = (college: CollegeEntry) => {
        let bookmarks = secureStorage.getItem("zertainity_college_bookmarks") || [];
        const isSaved = bookmarks.some((b: any) => b.id === college.id);
        if (isSaved) {
            bookmarks = bookmarks.filter((b: any) => b.id !== college.id);
            setSavedBookmarks(savedBookmarks.filter(id => id !== college.id));
        } else {
            bookmarks.push({ ...college, savedAt: new Date().toISOString() });
            setSavedBookmarks([...savedBookmarks, college.id]);
        }
        secureStorage.setItem("zertainity_college_bookmarks", bookmarks);
    };

    const filtered = ALL_COLLEGES.filter(c => {
        const matchType = typeFilter === "All" || c.college_type === typeFilter;
        const matchQuery = !query || c.name.toLowerCase().includes(query.toLowerCase()) || c.state.toLowerCase().includes(query.toLowerCase()) || c.city.toLowerCase().includes(query.toLowerCase());
        const matchBestFor = !bestForFilter || c.bestFor.some(tag => tag.toLowerCase().includes(bestForFilter.toLowerCase()));
        return matchType && matchQuery && matchBestFor;
    });

    // Sort: rated highest first, then NIRF ranked
    const sorted = [...filtered].sort((a, b) => {
        if (b.rating !== a.rating) return b.rating - a.rating;
        const aRank = a.ranking_nirf ?? 9999;
        const bRank = b.ranking_nirf ?? 9999;
        return aRank - bRank;
    });

    return (
        <div className="min-h-screen bg-background">
            <PageSEO
                title="Top Colleges & Universities in India 2026"
                description="Find and compare the best IITs, NITs, IIMs, AIIMS, and top private universities in India. View NIRF rankings, courses, and estimated cutoffs."
                keywords="best colleges India, IIT rankings, top engineering colleges, top medical colleges India, NIRF 2026, IIM list, NLU rankings"
                canonical="/colleges"
            />
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">College & Institution Finder</h1>
                        <p className="text-xs text-muted-foreground">200+ institutions ranked by NIRF, CAT, JEE & more</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-white bg-primary px-2.5 py-1 rounded-full">{sorted.length} institutions</span>
                    <Button variant="outline" size="sm" onClick={() => navigate("/bookmarks")} className="ml-2 gap-2">
                        <Bookmark className="h-4 w-4" /> Saved ({savedBookmarks.length})
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Filters */}
                <div className="mb-6 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name, city or state…"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="relative">
                            <ThumbsUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder='Filter by "Best For" (e.g. Engineering, Medical, Law…)'
                                value={bestForFilter}
                                onChange={e => setBestForFilter(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {COLLEGE_TYPES.map(t => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${typeFilter === t ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    {/* List */}
                    <div className="md:col-span-2 space-y-2 max-h-[75vh] overflow-y-auto pr-1">
                        {sorted.map(c => (
                            <button
                                key={c.id}
                                onClick={() => setSelected(c)}
                                className={`w-full text-left p-3.5 rounded-xl border transition-all ${selected?.id === c.id ? "border-primary bg-primary/5 shadow-md" : "border-border hover:border-primary/40 hover:shadow-sm bg-card"}`}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <span className="font-semibold text-sm leading-tight">{c.name}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full border flex-shrink-0 ${TYPE_COLORS[c.college_type] ?? "bg-gray-100 text-gray-700"}`}>
                                        {c.college_type}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground">{c.city}, {c.state}</span>
                                    {c.ranking_nirf && (
                                        <span className="text-xs text-muted-foreground ml-auto font-medium">#{c.ranking_nirf} NIRF</span>
                                    )}
                                </div>
                                <div className="mt-2">
                                    <StarRating rating={c.rating} />
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {c.bestFor.slice(0, 3).map(tag => (
                                        <span key={tag} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{tag}</span>
                                    ))}
                                </div>
                            </button>
                        ))}
                        {sorted.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground text-sm">
                                <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                No institutions found. Try a different filter.
                            </div>
                        )}
                    </div>

                    {/* Detail */}
                    <div className="md:col-span-3">
                        {selected ? (
                            <Card className="sticky top-24 shadow-md">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[selected.college_type]}`}>
                                                    {selected.college_type}
                                                </span>
                                                {selected.ranking_nirf && (
                                                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                                        NIRF Rank #{selected.ranking_nirf}
                                                    </span>
                                                )}
                                            </div>
                                            <CardTitle className="text-xl leading-tight mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{selected.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                <MapPin className="h-3.5 w-3.5" />{selected.city}, {selected.state}
                                            </CardDescription>
                                            <div className="mt-2">
                                                <StarRating rating={selected.rating} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2 items-end shrink-0">
                                            <Button
                                                size="sm"
                                                variant={savedBookmarks.includes(selected.id) ? "default" : "outline"}
                                                className="gap-2 transition-all"
                                                onClick={() => toggleBookmark(selected)}
                                            >
                                                {savedBookmarks.includes(selected.id) ? (
                                                    <><BookmarkCheck className="h-4 w-4" /> Saved</>
                                                ) : (
                                                    <><Bookmark className="h-4 w-4" /> Save</>
                                                )}
                                            </Button>
                                            {selected.website && (
                                                <a href={selected.website} target="_blank" rel="noreferrer">
                                                    <Button size="sm" variant="ghost" className="gap-1.5 text-xs">
                                                        Official Site <ExternalLink className="h-3.5 w-3.5" />
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    {/* Best For */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                            <ThumbsUp className="h-3.5 w-3.5" /> Best For (Based on Reputation & Reviews)
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selected.bestFor.map(tag => (
                                                <Badge key={tag} className="bg-primary/10 text-primary border-primary/20 border">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Courses */}
                                    {selected.courses.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Available Programs</p>
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
                                                        onClick={() => navigate("/exam-tracker")}
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
                                                <Filter className="h-3.5 w-3.5" /> Typical Cutoffs (General Category)
                                            </p>
                                            <div className="space-y-1.5">
                                                {Object.entries(selected.cutoffs).map(([exam, data]) => (
                                                    <div key={exam} className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
                                                        <span className="text-xs font-medium">{exam.replace(/_/g, " ").toUpperCase()}</span>
                                                        <span className="text-xs text-foreground font-semibold">
                                                            {typeof data === "object" && data !== null && "general" in data
                                                                ? String((data as Record<string, unknown>).general)
                                                                : "—"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="pt-2 grid grid-cols-2 gap-3">
                                        <Button variant="outline" size="sm" onClick={() => navigate("/exam-tracker")} className="w-full">
                                            View Exam Dates
                                        </Button>
                                        <Button size="sm" onClick={() => navigate("/scholarships")} className="w-full">
                                            Find Scholarships
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-64 flex items-center justify-center bg-muted/10 border-dashed">
                                <div className="text-center text-muted-foreground">
                                    <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p className="font-medium">Select an institution to view details</p>
                                    <p className="text-sm mt-1">Browse {ALL_COLLEGES.length}+ colleges and schools across India</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CollegeRecommendations;
