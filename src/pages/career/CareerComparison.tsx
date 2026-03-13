import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, BarChart2, TrendingUp, BookOpen, Briefcase, Scale } from "lucide-react";
import type { CareerMatch } from "@/lib/scoringEngine";

const SCORE_COLOR = (s: number) => s >= 75 ? "text-foreground" : s >= 55 ? "text-muted-foreground" : "text-muted-foreground/50";
const SCORE_BG = (s: number) => s >= 75 ? "bg-foreground" : s >= 55 ? "bg-muted-foreground" : "bg-muted-foreground/50";

const GROWTH_LABEL: Record<string, { label: string; cls: string }> = {
    high: { label: "High Growth", cls: "bg-background text-foreground border border-foreground" },
    stable: { label: "Stable", cls: "bg-muted text-muted-foreground border border-border" },
    declining: { label: "Evolving", cls: "bg-muted/50 text-muted-foreground/50 border border-border/50" },
};

interface Props { careers?: CareerMatch[] }

const CompareRow = ({ label, values }: { label: string; values: (string | React.ReactNode)[] }) => (
    <tr className="border-b border-border last:border-0">
        <td className="py-6 pr-6 text-xs font-bold font-sans text-muted-foreground uppercase tracking-widest whitespace-nowrap w-48 align-top">{label}</td>
        {values.map((v, i) => (
            <td key={i} className={`py-6 px-6 text-base font-sans align-top ${i > 0 ? "border-l border-border" : ""}`}>{v}</td>
        ))}
    </tr>
);

const CareerComparison = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const careers: CareerMatch[] = location.state?.careers ?? [];
    const [selected, setSelected] = useState<CareerMatch[]>(careers.slice(0, 3));

    if (careers.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
                <GraduationCap className="h-14 w-14 text-muted-foreground" />
                <p className="text-muted-foreground">No careers to compare. Complete an analysis first.</p>
                <Button onClick={() => navigate("/education-level")}>Start Analysis</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b border-border bg-background sticky top-0 z-10">
                <div className="container mx-auto px-4 py-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-none hover:bg-muted">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-3">
                            <Scale className="h-8 w-8 text-foreground" />
                            <h1 className="text-3xl font-serif font-bold tracking-tight text-foreground">Career Comparison</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Selector chips when more than 3 careers */}
                {careers.length > 3 && (
                    <div className="mb-8 border-b border-border pb-8">
                        <p className="text-sm font-sans font-bold uppercase tracking-widest text-muted-foreground mb-4">Select up to 3 to compare:</p>
                        <div className="flex flex-wrap gap-3">
                            {careers.map(c => {
                                const isOn = selected.some(s => s.career === c.career);
                                return (
                                    <button
                                        key={c.career}
                                        onClick={() => {
                                            if (isOn) setSelected(p => p.filter(s => s.career !== c.career));
                                            else if (selected.length < 3) setSelected(p => [...p, c]);
                                        }}
                                        className={`text-sm font-sans font-medium px-4 py-2 border transition-colors ${isOn ? "bg-foreground text-background border-foreground hover:bg-muted-foreground" : "bg-background text-foreground border-border hover:border-foreground"
                                            }`}
                                    >
                                        {c.career}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Comparison table */}
                <Card className="rounded-none border-2 border-border shadow-none overflow-hidden mb-12">
                    <CardHeader className="pb-0 border-b border-border">
                        {/* Career name header row */}
                        <div className="grid gap-0" style={{ gridTemplateColumns: `12rem repeat(${selected.length}, 1fr)` }}>
                            <div />
                            {selected.map((c, i) => (
                                <div key={c.career} className={`text-center py-6 px-4 ${i > 0 ? "border-l border-border" : ""}`}>
                                    {c.rank === 1 && <Badge className="rounded-none text-[10px] mb-3 bg-foreground text-background uppercase tracking-widest">Top Match</Badge>}
                                    <h3 className="font-serif font-bold text-2xl leading-tight tracking-tight mb-2">{c.career}</h3>
                                    <p className="text-xs font-sans tracking-widest text-muted-foreground uppercase">{c.domain}</p>
                                </div>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <tbody>
                                    {/* Match Score */}
                                    <CompareRow
                                        label="Match Score"
                                        values={selected.map(c => (
                                            <div className="flex flex-col items-start gap-2 max-w-[80%]">
                                                <span className={`text-4xl font-serif font-bold tracking-tight ${SCORE_COLOR(c.matchScore)}`}>{c.matchScore}%</span>
                                                <div className="w-full bg-border h-1 rounded-none">
                                                    <div className={`h-1 rounded-none ${SCORE_BG(c.matchScore)}`} style={{ width: `${c.matchScore}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    />
                                    {/* Confidence */}
                                    <CompareRow
                                        label="Confidence"
                                        values={selected.map(c => (
                                            <span className="font-sans font-medium">{c.confidenceScore ?? "—"}%</span>
                                        ))}
                                    />
                                    {/* Readiness */}
                                    <CompareRow
                                        label="Readiness"
                                        values={selected.map(c => (
                                            <Badge variant="outline" className="rounded-none font-sans uppercase tracking-widest text-xs">{c.readinessLevel}</Badge>
                                        ))}
                                    />
                                    {/* Growth */}
                                    <CompareRow
                                        label="Growth"
                                        values={selected.map(c => {
                                            const g = GROWTH_LABEL[c.growthOutlook];
                                            return <span className={`text-xs font-sans font-bold uppercase tracking-widest px-3 py-1 ${g.cls}`}>{g.label}</span>;
                                        })}
                                    />
                                    {/* Salary */}
                                    <CompareRow
                                        label="Avg Salary"
                                        values={selected.map(c =>
                                            c.avgSalaryLpa ? <span className="font-mono text-muted-foreground">₹{c.avgSalaryLpa}–{c.avgSalaryLpa + 2} LPA</span> : "—"
                                        )}
                                    />
                                    {/* Key Strengths */}
                                    <CompareRow
                                        label="Required Strengths"
                                        values={selected.map(c => (
                                            <div className="flex flex-wrap gap-2">
                                                {c.strengths.slice(0, 3).map(s => (
                                                    <span key={s} className="text-xs bg-muted text-foreground border border-border px-2 py-1 font-sans">{s}</span>
                                                ))}
                                                {c.strengths.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                                            </div>
                                        ))}
                                    />
                                    {/* Entrance Exams */}
                                    <CompareRow
                                        label="Key Exams"
                                        values={selected.map(c => (
                                            <div className="flex flex-wrap gap-2">
                                                {c.requiredExams.slice(0, 3).map(e => (
                                                    <Badge key={e} variant="secondary" className="rounded-none text-xs bg-muted text-foreground border border-border">{e}</Badge>
                                                ))}
                                            </div>
                                        ))}
                                    />
                                    {/* Top Roles */}
                                    <CompareRow
                                        label="Top Roles"
                                        values={selected.map(c => (
                                            <ul className="text-sm font-sans text-foreground space-y-2">
                                                {c.topJobRoles.slice(0, 3).map(r => <li key={r} className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-foreground mt-1.5 shrink-0" /> {r}</li>)}
                                            </ul>
                                        ))}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Verdict */}
                <Card className="mt-8 rounded-none border-t-4 border-foreground bg-muted text-foreground shadow-none">
                    <CardContent className="py-8 px-8 flex items-start gap-6">
                        <BarChart2 className="h-8 w-8 text-foreground flex-shrink-0 mt-1" />
                        <div>
                            <p className="font-serif font-bold text-2xl text-foreground">
                                Data Verdict: {selected.sort((a, b) => b.matchScore - a.matchScore)[0]?.career}
                            </p>
                            <p className="text-base font-sans text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                                Algorithmically, this career scored highest on the compatibility index based on your unique academic profile and cognitive interests.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-12 pb-12">
                    <Button variant="outline" className="rounded-none font-sans font-medium uppercase tracking-widest px-8 py-6 border-2 border-border hover:border-foreground hover:bg-background transition-colors" onClick={() => navigate("/results")}>
                        Return to Analysis Results
                    </Button>
                </div>
            </main>
        </div>
    );
};

export default CareerComparison;
