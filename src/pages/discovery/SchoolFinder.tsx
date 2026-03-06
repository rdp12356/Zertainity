import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    ArrowLeft, Search, MapPin, School, ExternalLink,
    Star, ThumbsUp, BookOpen, Trophy, Building2, Dumbbell,
    ChevronDown, ChevronUp, Info, Award
} from "lucide-react";
import { ALL_SCHOOLS, ALL_STATES, ALL_BOARDS, ALL_TYPES_SCHOOL, ALL_FACILITIES, SchoolEntry } from "@/data/schools";

const BOARD_COLORS: Record<string, string> = {
    "CBSE": "bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0",
    "ICSE": "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0",
    "IB": "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0",
    "IGCSE": "bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0",
    "State Board": "bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0",
    "CBSE + IB": "bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0",
};

const TYPE_COLORS: Record<string, string> = {
    "Government": "bg-green-100 text-green-700 border-green-200",
    "Private": "bg-gray-100 text-gray-700 border-gray-200",
    "Boarding": "bg-amber-100 text-amber-700 border-amber-200",
    "Aided": "bg-pink-100 text-pink-700 border-pink-200",
};

const BOARD_ACCENT: Record<string, string> = {
    "CBSE": "from-blue-500 to-blue-600",
    "ICSE": "from-purple-500 to-purple-600",
    "IB": "from-emerald-500 to-teal-500",
    "IGCSE": "from-teal-500 to-cyan-500",
    "State Board": "from-orange-500 to-amber-500",
    "CBSE + IB": "from-indigo-500 to-purple-500",
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`h-3 w-3 ${i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
        ))}
    </div>
);

const getRankingScore = (school: SchoolEntry): number => {
    const { educationWorld = 9999, outlookIndia = 9999, indiaToday = 9999 } = school.rankings;
    const validRanks = [educationWorld, outlookIndia, indiaToday].filter(r => r !== 9999);
    if (!validRanks.length) return 9999;
    return validRanks.reduce((a, b) => a + b, 0) / validRanks.length;
};

// Derived rating from rankings and board results
const getDerivedRating = (school: SchoolEntry): number => {
    const rankScore = getRankingScore(school);
    let base = 3.5;
    if (rankScore <= 5) base = 5.0;
    else if (rankScore <= 10) base = 4.8;
    else if (rankScore <= 20) base = 4.6;
    else if (rankScore <= 35) base = 4.4;
    else if (rankScore <= 50) base = 4.2;
    const dist = (school.boardResults.class12DistinctionPercent || 50) / 100;
    return Math.min(5.0, parseFloat((base + dist * 0.2).toFixed(1)));
};

interface Filters {
    query: string;
    state: string;
    board: string;
    schoolType: string;
    facility: string;
    rankingSource: "all" | "educationWorld" | "outlookIndia" | "indiaToday";
}

const SchoolFinder = () => {
    const navigate = useNavigate();
    const [filters, setFilters] = useState<Filters>({
        query: "", state: "All", board: "All", schoolType: "All",
        facility: "", rankingSource: "all"
    });
    const [selected, setSelected] = useState<SchoolEntry | null>(null);
    const [showFilters, setShowFilters] = useState(false);

    const updateFilter = (key: keyof Filters, val: string) => setFilters(f => ({ ...f, [key]: val }));

    const filteredSchools = ALL_SCHOOLS.filter(school => {
        const matchQuery = !filters.query ||
            school.name.toLowerCase().includes(filters.query.toLowerCase()) ||
            school.city.toLowerCase().includes(filters.query.toLowerCase());
        const matchState = filters.state === "All" || school.state === filters.state;
        const matchBoard = filters.board === "All" || school.board === filters.board;
        const matchType = filters.schoolType === "All" || school.type === filters.schoolType;
        const matchFacility = !filters.facility ||
            school.facilities.some(f => f.toLowerCase().includes(filters.facility.toLowerCase()));
        const matchRanking = filters.rankingSource === "all" || (
            filters.rankingSource === "educationWorld" && school.rankings.educationWorld !== undefined ||
            filters.rankingSource === "outlookIndia" && school.rankings.outlookIndia !== undefined ||
            filters.rankingSource === "indiaToday" && school.rankings.indiaToday !== undefined
        );
        return matchQuery && matchState && matchBoard && matchType && matchFacility && matchRanking;
    });

    const sortedSchools = [...filteredSchools].sort((a, b) => {
        if (filters.rankingSource === "educationWorld") {
            return (a.rankings.educationWorld ?? 9999) - (b.rankings.educationWorld ?? 9999);
        } else if (filters.rankingSource === "outlookIndia") {
            return (a.rankings.outlookIndia ?? 9999) - (b.rankings.outlookIndia ?? 9999);
        } else if (filters.rankingSource === "indiaToday") {
            return (a.rankings.indiaToday ?? 9999) - (b.rankings.indiaToday ?? 9999);
        }
        return getRankingScore(a) - getRankingScore(b);
    });

    return (
        <div className="min-h-screen bg-background">
            <PageSEO
                title="India School Finder & Rankings 2026"
                description="Find the best CBSE, ICSE, IB, and State Board schools in India. View latest rankings from Education World, Outlook India, and India Today. Compare board results, facilities, and fees."
                keywords="best schools India, CBSE school rankings, ICSE schools, IB schools India, school finder, Education World rankings, top 10 schools India"
                canonical="/schools"
            />
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <School className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">India School Finder</h1>
                        <p className="text-xs text-muted-foreground">Ranked by Education World, Outlook India & India Today</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-white bg-primary px-2.5 py-1 rounded-full">{sortedSchools.length} schools</span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Main Search */}
                <div className="space-y-3 mb-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search school by name or city…"
                            value={filters.query}
                            onChange={e => updateFilter("query", e.target.value)}
                            className="pl-10 h-11 text-base"
                        />
                    </div>

                    {/* Filter Toggle */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(v => !v)}
                        className="gap-2 w-full sm:w-auto"
                    >
                        {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        Advanced Filters
                    </Button>

                    {showFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                            {/* State */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">State</label>
                                <select
                                    value={filters.state}
                                    onChange={e => updateFilter("state", e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="All">All States</option>
                                    {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* Board */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Board</label>
                                <select
                                    value={filters.board}
                                    onChange={e => updateFilter("board", e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    {ALL_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">School Type</label>
                                <select
                                    value={filters.schoolType}
                                    onChange={e => updateFilter("schoolType", e.target.value)}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    {ALL_TYPES_SCHOOL.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>

                            {/* Ranking Source */}
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Sort by Ranking Source</label>
                                <select
                                    value={filters.rankingSource}
                                    onChange={e => updateFilter("rankingSource", e.target.value as Filters["rankingSource"])}
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                                >
                                    <option value="all">Best Overall Rank</option>
                                    <option value="educationWorld">Education World Magazine</option>
                                    <option value="outlookIndia">Outlook India</option>
                                    <option value="indiaToday">India Today</option>
                                </select>
                            </div>

                            {/* Facility */}
                            <div className="sm:col-span-2">
                                <label className="text-xs font-semibold text-muted-foreground uppercase mb-1 block">Filter by Facility</label>
                                <div className="relative">
                                    <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                    <Input
                                        placeholder='e.g. Swimming Pool, Robotics Lab, Boarding House…'
                                        value={filters.facility}
                                        onChange={e => updateFilter("facility", e.target.value)}
                                        className="pl-9 h-9"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {["Swimming Pool", "Boarding House", "Robotics Lab", "Horse Riding", "Cricket Ground"].map(f => (
                                        <button
                                            key={f}
                                            onClick={() => updateFilter("facility", filters.facility === f ? "" : f)}
                                            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${filters.facility === f ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"}`}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    {/* School List */}
                    <div className="md:col-span-2 space-y-2 max-h-[76vh] overflow-y-auto pr-1">
                        {sortedSchools.map((school, index) => {
                            const rating = getDerivedRating(school);
                            const bestRank = Math.min(
                                school.rankings.educationWorld ?? 9999,
                                school.rankings.outlookIndia ?? 9999,
                                school.rankings.indiaToday ?? 9999
                            );
                            return (
                                <button
                                    key={school.id}
                                    onClick={() => setSelected(school)}
                                    className={`group w-full text-left p-3.5 rounded-xl border transition-all duration-200 relative overflow-hidden ${selected?.id === school.id
                                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                                        : "border-border hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-md bg-card"
                                        }`}
                                >
                                    {/* Accent bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-r-full bg-gradient-to-b ${BOARD_ACCENT[school.board] ?? "from-gray-400 to-gray-500"} ${selected?.id === school.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`} />
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            {bestRank !== 9999 && (
                                                <span className="text-xs font-bold text-white bg-gradient-to-r from-primary to-primary/70 rounded-md px-1.5 py-0.5 shrink-0 shadow-sm">
                                                    #{bestRank}
                                                </span>
                                            )}
                                            <span className="font-semibold text-sm leading-tight truncate group-hover:text-primary transition-colors">{school.name}</span>
                                        </div>
                                        <div className="flex flex-col gap-1 items-end shrink-0">
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${BOARD_COLORS[school.board] ?? "bg-gray-100 text-gray-700"}`}>
                                                {school.board}
                                            </span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${TYPE_COLORS[school.type] ?? ""}`}>
                                                {school.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                        <span className="text-xs text-muted-foreground">{school.city}, {school.state}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <StarRating rating={rating} />
                                        <span className="text-[10px] text-muted-foreground">{school.annualFee.split("–")[0].trim()}/yr</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {school.bestFor.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">{tag}</span>
                                        ))}
                                    </div>
                                </button>
                            );
                        })}
                        {sortedSchools.length === 0 && (
                            <div className="text-center py-16 text-muted-foreground">
                                <School className="h-10 w-10 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">No schools found</p>
                                <p className="text-sm mt-1">Try changing the state or facility filter</p>
                            </div>
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className="md:col-span-3">
                        {selected ? (
                            <Card className="sticky top-24 shadow-md">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${BOARD_COLORS[selected.board]}`}>{selected.board}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${TYPE_COLORS[selected.type]}`}>{selected.type}</span>
                                                {selected.established && (
                                                    <span className="text-xs text-muted-foreground">Est. {selected.established}</span>
                                                )}
                                            </div>
                                            <CardTitle className="text-xl leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">{selected.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                <MapPin className="h-3.5 w-3.5" />{selected.city}, {selected.state}
                                            </CardDescription>
                                            <div className="flex items-center gap-2 mt-2">
                                                <StarRating rating={getDerivedRating(selected)} />
                                                <span className="text-xs font-semibold">{getDerivedRating(selected).toFixed(1)} / 5.0</span>
                                            </div>
                                        </div>
                                        {selected.website && (
                                            <a href={selected.website} target="_blank" rel="noreferrer" className="shrink-0">
                                                <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                                                    Visit Site <ExternalLink className="h-3.5 w-3.5" />
                                                </Button>
                                            </a>
                                        )}
                                    </div>
                                    {selected.note && (
                                        <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2">
                                            <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-800 dark:text-amber-200">{selected.note}</p>
                                        </div>
                                    )}
                                </CardHeader>

                                <CardContent className="space-y-5">
                                    {/* Magazine Rankings */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1">
                                            <Trophy className="h-3.5 w-3.5" /> Magazine Rankings
                                        </p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: "Education World", key: "educationWorld" as const, color: "bg-blue-50 border-blue-200 text-blue-700" },
                                                { label: "Outlook India", key: "outlookIndia" as const, color: "bg-purple-50 border-purple-200 text-purple-700" },
                                                { label: "India Today", key: "indiaToday" as const, color: "bg-red-50 border-red-200 text-red-700" },
                                            ].map(source => (
                                                <div key={source.key} className={`p-3 rounded-lg border text-center ${source.color}`}>
                                                    <p className="text-[10px] font-semibold uppercase mb-1 opacity-70">{source.label}</p>
                                                    <p className="text-2xl font-bold">
                                                        {selected.rankings[source.key] ? `#${selected.rankings[source.key]}` : "N/R"}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Board Results */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1">
                                            <BookOpen className="h-3.5 w-3.5" /> Past Board Batch Performance
                                        </p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Class 10 */}
                                            <div className="bg-muted/30 rounded-xl p-3 border border-border">
                                                <p className="text-xs font-bold mb-2 text-center">Class 10 (Board)</p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Pass %</span>
                                                        <span className="font-bold text-green-600">{selected.boardResults.class10PassPercent ?? "—"}%</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Top Score</span>
                                                        <span className="font-bold">{selected.boardResults.class10TopScore ?? "—"}{selected.board === "IB" ? "/45" : "/500"}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground text-[10px]">90%+ students</span>
                                                        <span className="font-bold text-primary">{selected.boardResults.class10DistinctionPercent ?? "—"}%</span>
                                                    </div>
                                                </div>
                                                {/* Progress bar for distinctions */}
                                                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
                                                        style={{ width: `${selected.boardResults.class10DistinctionPercent ?? 0}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Class 12 */}
                                            <div className="bg-muted/30 rounded-xl p-3 border border-border">
                                                <p className="text-xs font-bold mb-2 text-center">Class 12 (Board)</p>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Pass %</span>
                                                        <span className="font-bold text-green-600">{selected.boardResults.class12PassPercent ?? "—"}%</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Top Score</span>
                                                        <span className="font-bold">{selected.boardResults.class12TopScore ?? "—"}{selected.board === "IB" ? "/45" : "/500"}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground text-[10px]">90%+ students</span>
                                                        <span className="font-bold text-primary">{selected.boardResults.class12DistinctionPercent ?? "—"}%</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                                                        style={{ width: `${selected.boardResults.class12DistinctionPercent ?? 0}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Facilities */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                            <Building2 className="h-3.5 w-3.5" /> Facilities
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selected.facilities.map(f => (
                                                <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sports */}
                                    {selected.sports.length > 0 && (
                                        <div>
                                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                                <Dumbbell className="h-3.5 w-3.5" /> Sports Offered
                                            </p>
                                            <div className="flex flex-wrap gap-1.5">
                                                {selected.sports.map(s => (
                                                    <span key={s} className="text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2.5 py-0.5">{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Best For */}
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                            <ThumbsUp className="h-3.5 w-3.5" /> Best For
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selected.bestFor.map(tag => (
                                                <Badge key={tag} className="bg-primary/10 text-primary border-primary/20 border">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fee */}
                                    <div className="flex items-center justify-between p-3 bg-muted/40 rounded-xl border border-border">
                                        <span className="text-sm font-semibold">Annual Fee Range</span>
                                        <span className="text-sm font-bold text-primary">{selected.annualFee}</span>
                                    </div>

                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-80 flex items-center justify-center bg-muted/10 border-dashed">
                                <div className="text-center text-muted-foreground">
                                    <School className="h-14 w-14 mx-auto mb-4 opacity-15" />
                                    <p className="font-semibold text-lg">Select a School</p>
                                    <p className="text-sm mt-1 max-w-xs mx-auto">View detailed rankings, board results, facilities, and sports for any school</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SchoolFinder;
