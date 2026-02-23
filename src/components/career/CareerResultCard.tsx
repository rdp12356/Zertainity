import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TrendingUp, Trophy, BookOpen, Briefcase, ChevronDown, ChevronUp,
    Zap, BarChart2, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import type { CareerMatch } from '@/lib/scoringEngine';

interface CareerResultCardProps {
    match: CareerMatch;
    aiExplanation?: string | null;
    aiModelUsed?: 'gemini' | 'openrouter' | 'rule-based' | null;
    isTop?: boolean;
}

const GROWTH_CONFIG = {
    high: { label: 'High Growth', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    stable: { label: 'Stable', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    declining: { label: 'Evolving', color: 'bg-amber-100 text-amber-700 border-amber-200' },
};

const READINESS_CONFIG = {
    High: { color: 'text-emerald-600 bg-emerald-50', bar: 'bg-emerald-500' },
    Medium: { color: 'text-amber-600 bg-amber-50', bar: 'bg-amber-400' },
    Low: { color: 'text-red-600 bg-red-50', bar: 'bg-red-400' },
};

const SCORE_COLOR = (score: number) =>
    score >= 75 ? '#16a34a' : score >= 55 ? '#d97706' : '#dc2626';

const AI_MODEL_BADGE: Record<string, { label: string; colour: string }> = {
    gemini: { label: '✦ Gemini AI', colour: 'bg-violet-100 text-violet-700' },
    openrouter: { label: '⚡ OpenRouter AI', colour: 'bg-blue-100 text-blue-700' },
    'rule-based': { label: '📋 Structured Analysis', colour: 'bg-gray-100 text-gray-600' },
};

export function CareerResultCard({ match, aiExplanation, aiModelUsed, isTop = false }: CareerResultCardProps) {
    const [expanded, setExpanded] = useState(isTop);
    const growthCfg = GROWTH_CONFIG[match.growthOutlook];
    const readinessCfg = READINESS_CONFIG[match.readinessLevel];

    return (
        <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${isTop ? 'border-2 border-black shadow-lg' : 'border border-border'}`}>
            {isTop && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-black via-gray-600 to-black" />
            )}

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {isTop && (
                            <div className="flex-shrink-0 w-8 h-8 bg-black rounded-full flex items-center justify-center mt-0.5">
                                <Trophy className="h-4 w-4 text-white" />
                            </div>
                        )}
                        {!isTop && (
                            <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-xs font-bold text-muted-foreground">#{match.rank}</span>
                            </div>
                        )}
                        <div className="min-w-0">
                            <CardTitle className="text-lg leading-tight">{match.career}</CardTitle>
                            <p className="text-sm text-muted-foreground capitalize mt-0.5">{match.domain}</p>
                        </div>
                    </div>

                    {/* Match Score Gauge */}
                    <div className="flex-shrink-0 text-right">
                        <div
                            className="text-2xl font-bold"
                            style={{ color: SCORE_COLOR(match.matchScore) }}
                        >
                            {match.matchScore}%
                        </div>
                        <div className="text-xs text-muted-foreground">match</div>
                    </div>
                </div>

                {/* Score bar */}
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                    <div
                        className="h-1.5 rounded-full transition-all duration-700"
                        style={{ width: `${match.matchScore}%`, backgroundColor: SCORE_COLOR(match.matchScore) }}
                    />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={`text-xs border ${readinessCfg.color}`}>
                        <BarChart2 className="h-3 w-3 mr-1" />
                        {match.readinessLevel} Readiness
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${growthCfg.color}`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {growthCfg.label}
                    </Badge>
                    {match.avgSalaryLpa && (
                        <Badge variant="secondary" className="text-xs">
                            ₹{match.avgSalaryLpa}–{match.avgSalaryLpa + 2} LPA
                        </Badge>
                    )}
                </div>

                {/* Strengths */}
                {match.strengths.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                            Your Strengths Here
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {match.strengths.map(s => (
                                <span key={s} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-0.5">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Required Exams */}
                {match.requiredExams.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Required Exams
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {match.requiredExams.slice(0, 4).map(e => (
                                <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Top Job Roles */}
                {match.topJobRoles.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Briefcase className="h-3 w-3" /> Career Roles
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {match.topJobRoles.slice(0, 4).map(r => (
                                <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* AI Mentor Explanation (collapsible) */}
                {aiExplanation && isTop && (
                    <div className="border-t border-border pt-4">
                        <button
                            onClick={() => setExpanded(e => !e)}
                            className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors w-full text-left"
                        >
                            <Zap className="h-4 w-4 text-violet-500" />
                            AI Mentor Explanation
                            {aiModelUsed && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ml-1 ${AI_MODEL_BADGE[aiModelUsed]?.colour}`}>
                                    {AI_MODEL_BADGE[aiModelUsed]?.label}
                                </span>
                            )}
                            <span className="ml-auto">
                                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </span>
                        </button>

                        {expanded && (
                            <div className="mt-3 p-4 bg-muted/40 rounded-lg border border-border/60">
                                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
                                    {aiExplanation}
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
