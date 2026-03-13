import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, BookOpen, GraduationCap, Calendar, ExternalLink } from "lucide-react";
import { DETAIL_EXAMS as EXAMS, type DetailExam } from "@/data/exams";

const DOMAINS = ["All", "engineering", "medical", "commerce", "law", "design", "arts"] as const;

const EntranceExams = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [domain, setDomain] = useState<string>("All");
    const [selected, setSelected] = useState<DetailExam | null>(null);

    const filtered = useMemo(() =>
        EXAMS.filter(e => {
            const matchDomain = domain === "All" || e.domain.includes(domain);
            const matchQuery = !query || e.name.toLowerCase().includes(query.toLowerCase()) || e.fullName.toLowerCase().includes(query.toLowerCase());
            return matchDomain && matchQuery;
        }), [domain, query]);

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-card sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <BookOpen className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold">Entrance Exams</h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-6 space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search exams (JEE, NEET, CAT…)"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {DOMAINS.map(d => (
                            <button
                                key={d}
                                onClick={() => setDomain(d)}
                                className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-colors ${domain === d ? "bg-black text-white border-black" : "border-border hover:bg-muted"
                                    }`}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-5 gap-6">
                    {/* List */}
                    <div className="md:col-span-2 space-y-2">
                        {filtered.map(exam => (
                            <button
                                key={exam.name}
                                onClick={() => setSelected(exam)}
                                className={`w-full text-left p-4 rounded-lg border transition-all ${selected?.name === exam.name ? "border-black bg-black/5" : "border-border hover:border-black/30"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-sm">{exam.name}</span>
                                    <div className="flex gap-1">
                                        {exam.domain.slice(0, 2).map(d => (
                                            <span key={d} className="text-xs bg-muted text-muted-foreground rounded px-1.5 py-0.5 capitalize">{d}</span>
                                        ))}
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">{exam.authority}</p>
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground text-sm">No exams found</div>
                        )}
                    </div>

                    {/* Detail */}
                    <div className="md:col-span-3">
                        {selected ? (
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-2xl">{selected.name}</CardTitle>
                                            <CardDescription>{selected.fullName}</CardDescription>
                                        </div>
                                        <a href={selected.website} target="_blank" rel="noreferrer">
                                            <Button size="sm" variant="outline" className="gap-1.5">
                                                Official Site <ExternalLink className="h-3.5 w-3.5" />
                                            </Button>
                                        </a>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Authority</p><p className="font-medium">{selected.authority}</p></div>
                                        <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Frequency</p><p className="font-medium">{selected.frequency}</p></div>
                                        <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Mode</p><p className="font-medium">{selected.mode}</p></div>
                                        <div><p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Eligibility</p><p className="font-medium">{selected.eligibility}</p></div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" /> Key Dates (Typical)
                                        </p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { label: "Registration", months: selected.registrationMonth },
                                                { label: "Exam", months: selected.examMonth },
                                                { label: "Result", months: [selected.resultMonth] },
                                            ].map(d => (
                                                <div key={d.label} className="bg-muted/50 rounded-lg p-3 text-center">
                                                    <p className="text-xs text-muted-foreground mb-1">{d.label}</p>
                                                    <p className="font-semibold text-sm">{d.months.join(" / ")}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Facts</p>
                                        <ul className="space-y-1.5">
                                            {selected.keyFacts.map(f => (
                                                <li key={f} className="text-sm flex items-start gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0 mt-1.5" />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5">
                                        {selected.domain.map(d => (
                                            <Badge key={d} variant="secondary" className="capitalize">{d}</Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="h-64 flex items-center justify-center">
                                <div className="text-center text-muted-foreground">
                                    <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-40" />
                                    <p className="text-sm">Select an exam to view details</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EntranceExams;
