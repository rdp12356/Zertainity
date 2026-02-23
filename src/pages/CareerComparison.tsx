import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, BarChart2, TrendingUp, BookOpen, Briefcase, Scale } from "lucide-react";
import type { CareerMatch } from "@/lib/scoringEngine";

const SCORE_COLOR = (s: number) => s >= 75 ? "text-emerald-600" : s >= 55 ? "text-amber-600" : "text-red-500";
const SCORE_BG = (s: number) => s >= 75 ? "bg-emerald-500" : s >= 55 ? "bg-amber-400" : "bg-red-400";

const GROWTH_LABEL: Record<string, { label: string; cls: string }> = {
    high: { label: "High Growth 🚀", cls: "bg-emerald-100 text-emerald-700" },
    stable: { label: "Stable 📊", cls: "bg-blue-100 text-blue-700" },
    declining: { label: "Evolving ⚡", cls: "bg-amber-100 text-amber-700" },
};

interface Props { careers?: CareerMatch[] }

const CompareRow = ({ label, values }: { label: string; values: (string | React.ReactNode)[] }) => (
    <tr className="border-b border-border/50 last:border-0">
        <td className="py-3 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap w-32">{label}</td>
        {values.map((v, i) => (
            <td key={i} className="py-3 px-3 text-sm">{v}</td>
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
            <header className="border-b border-border bg-card sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Scale className="h-6 w-6 text-primary" />
                    <h1 className="text-xl font-bold">Career Comparison</h1>
                    <span className="ml-auto text-xs text-muted-foreground">
                        Comparing {selected.length} careers
                    </span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Selector chips when more than 3 careers */}
                {careers.length > 3 && (
                    <div className="mb-6">
                        <p className="text-sm text-muted-foreground mb-2">Select up to 3 to compare:</p>
                        <div className="flex flex-wrap gap-2">
                            {careers.map(c => {
                                const isOn = selected.some(s => s.career === c.career);
                                return (
                                    <button
                                        key={c.career}
                                        onClick={() => {
                                            if (isOn) setSelected(p => p.filter(s => s.career !== c.career));
                                            else if (selected.length < 3) setSelected(p => [...p, c]);
                                        }}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${isOn ? "bg-black text-white border-black" : "border-border hover:bg-muted"
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
                <Card className="overflow-hidden">
                    <CardHeader className="pb-0">
                        {/* Career name header row */}
                        <div className="grid gap-4" style={{ gridTemplateColumns: `10rem repeat(${selected.length}, 1fr)` }}>
                            <div />
                            {selected.map(c => (
                                <div key={c.career} className="text-center">
                                    <h3 className="font-bold text-sm leading-tight">{c.career}</h3>
                                    <p className="text-xs text-muted-foreground capitalize">{c.domain}</p>
                                    {c.rank === 1 && <Badge className="text-xs mt-1 bg-black text-white">🏆 Top Match</Badge>}
                                </div>
                            ))}
                        </div>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <tbody>
                                    {/* Match Score */}
                                    <CompareRow
                                        label="Match Score"
                                        values={selected.map(c => (
                                            <div className="flex flex-col items-center gap-1">
                                                <span className={`text-2xl font-bold ${SCORE_COLOR(c.matchScore)}`}>{c.matchScore}%</span>
                                                <div className="w-full bg-muted h-1.5 rounded-full">
                                                    <div className={`h-1.5 rounded-full ${SCORE_BG(c.matchScore)}`} style={{ width: `${c.matchScore}%` }} />
                                                </div>
                                            </div>
                                        ))}
                                    />
                                    {/* Confidence */}
                                    <CompareRow
                                        label="Confidence"
                                        values={selected.map(c => (
                                            <span className="font-medium">{c.confidenceScore ?? "—"}%</span>
                                        ))}
                                    />
                                    {/* Readiness */}
                                    <CompareRow
                                        label="Readiness"
                                        values={selected.map(c => (
                                            <Badge variant="outline" className="text-xs">{c.readinessLevel}</Badge>
                                        ))}
                                    />
                                    {/* Growth */}
                                    <CompareRow
                                        label="Growth"
                                        values={selected.map(c => {
                                            const g = GROWTH_LABEL[c.growthOutlook];
                                            return <span className={`text-xs px-2 py-0.5 rounded-full ${g.cls}`}>{g.label}</span>;
                                        })}
                                    />
                                    {/* Salary */}
                                    <CompareRow
                                        label="Avg Salary"
                                        values={selected.map(c =>
                                            c.avgSalaryLpa ? `₹${c.avgSalaryLpa}–${c.avgSalaryLpa + 2} LPA` : "—"
                                        )}
                                    />
                                    {/* Key Strengths */}
                                    <CompareRow
                                        label="Your Strengths"
                                        values={selected.map(c => (
                                            <div className="flex flex-wrap gap-1">
                                                {c.strengths.slice(0, 2).map(s => (
                                                    <span key={s} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">{s}</span>
                                                ))}
                                                {c.strengths.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                                            </div>
                                        ))}
                                    />
                                    {/* Entrance Exams */}
                                    <CompareRow
                                        label="Key Exams"
                                        values={selected.map(c => (
                                            <div className="flex flex-wrap gap-1">
                                                {c.requiredExams.slice(0, 3).map(e => (
                                                    <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                                                ))}
                                            </div>
                                        ))}
                                    />
                                    {/* Top Roles */}
                                    <CompareRow
                                        label="Top Roles"
                                        values={selected.map(c => (
                                            <ul className="text-xs text-muted-foreground space-y-0.5">
                                                {c.topJobRoles.slice(0, 3).map(r => <li key={r}>• {r}</li>)}
                                            </ul>
                                        ))}
                                    />
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Verdict */}
                <Card className="mt-6 bg-black text-white border-0">
                    <CardContent className="py-5 flex items-start gap-4">
                        <BarChart2 className="h-8 w-8 text-gray-300 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-white">
                                Best fit: {selected.sort((a, b) => b.matchScore - a.matchScore)[0]?.career}
                            </p>
                            <p className="text-sm text-gray-300 mt-1">
                                Based on your marks and interest scores. This career scored highest on the compatibility index.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <Button variant="outline" onClick={() => navigate("/results")}>← Back to Results</Button>
                </div>
            </main>
        </div>
    );
};

export default CareerComparison;
