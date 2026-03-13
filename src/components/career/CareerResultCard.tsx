import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    TrendingUp, Trophy, BookOpen, Briefcase, ChevronDown, ChevronUp,
    Zap, BarChart2, AlertCircle
} from 'lucide-react';
import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Tilt } from 'react-tilt';
import type { CareerMatch } from '@/lib/scoringEngine';

interface CareerResultCardProps {
    match: CareerMatch;
    aiExplanation?: string | null;
    aiModelUsed?: 'gemini' | 'openrouter' | 'rule-based' | null;
    isTop?: boolean;
    index?: number;
}

const GROWTH_CONFIG = {
    high: { label: 'High Growth', color: 'bg-emerald-100 text-emerald-900 border-emerald-900' },
    stable: { label: 'Stable', color: 'bg-blue-100 text-blue-900 border-blue-900' },
    declining: { label: 'Evolving', color: 'bg-amber-100 text-amber-900 border-amber-900' },
};

const READINESS_CONFIG = {
    High: { color: 'text-emerald-900 bg-emerald-100 border-emerald-900', bar: 'bg-emerald-900' },
    Medium: { color: 'text-amber-900 bg-amber-100 border-amber-900', bar: 'bg-amber-900' },
    Low: { color: 'text-red-900 bg-red-100 border-red-900', bar: 'bg-red-900' },
};

const SCORE_COLOR = (score: number) =>
    score >= 75 ? '#000000' : score >= 55 ? '#555555' : '#888888';

const AI_MODEL_BADGE: Record<string, { label: string; colour: string }> = {
    gemini: { label: '✦ Gemini AI', colour: 'bg-muted text-foreground border border-border' },
    openrouter: { label: '⚡ OpenRouter AI', colour: 'bg-muted text-foreground border border-border' },
    'rule-based': { label: '📋 Structured Analysis', colour: 'bg-muted text-foreground border border-border' },
};

const defaultTiltOptions = {
    reverse: false,
    max: 8,
    perspective: 1000,
    scale: 1.02,
    speed: 400,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)",
};

export const CareerResultCard = memo(function CareerResultCard({ match, aiExplanation, aiModelUsed, isTop = false, index = 0 }: CareerResultCardProps) {
    const [expanded, setExpanded] = useState(isTop);
    const growthCfg = GROWTH_CONFIG[match.growthOutlook];
    const readinessCfg = READINESS_CONFIG[match.readinessLevel];

    const CardContentWrapper = (
        <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-none bg-background rounded-none ${isTop ? 'border-2 border-primary mb-2 shadow-[8px_8px_0px_#000]' : 'border-2 border-border shadow-[4px_4px_0px_transparent] hover:border-foreground hover:shadow-[4px_4px_0px_#000]'}`}>
            {isTop && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            )}

            <CardHeader className="pb-4 border-b border-border/50">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {isTop && (
                            <div className="flex-shrink-0 w-10 h-10 border border-primary bg-background rounded-none flex items-center justify-center mt-0.5">
                                <Trophy className="h-5 w-5 text-primary" />
                            </div>
                        )}
                        {!isTop && (
                            <div className="flex-shrink-0 w-8 h-8 border border-border bg-background rounded-none flex items-center justify-center mt-0.5">
                                <span className="text-xs font-serif font-bold text-foreground">#{match.rank}</span>
                            </div>
                        )}
                        <div className="min-w-0">
                            <CardTitle className="text-2xl font-serif leading-tight group-hover:text-primary transition-colors tracking-tight">{match.career}</CardTitle>
                            <p className="text-sm text-muted-foreground font-sans tracking-widest uppercase mt-1">{match.domain}</p>
                        </div>
                    </div>

                    {/* Match Score Gauge */}
                    <div className="flex-shrink-0 text-right">
                        <div
                            className="text-2xl font-bold tracking-tight"
                            style={{ color: SCORE_COLOR(match.matchScore) }}
                        >
                            {match.matchScore}%
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">match</div>
                    </div>
                </div>

                {/* Score bar */}
                <div className="w-full bg-border rounded-none h-1 mt-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${match.matchScore}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                        className="h-full rounded-none"
                        style={{ backgroundColor: SCORE_COLOR(match.matchScore) }}
                    />
                </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={`rounded-none text-xs border font-medium font-sans uppercase tracking-widest ${readinessCfg.color}`}>
                        <BarChart2 className="h-3 w-3 mr-1" />
                        {match.readinessLevel} Readiness
                    </Badge>
                    <Badge variant="outline" className={`rounded-none text-xs border font-medium font-sans uppercase tracking-widest ${growthCfg.color}`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {growthCfg.label}
                    </Badge>
                    {match.avgSalaryLpa && (
                        <Badge variant="secondary" className="rounded-none text-xs font-medium font-sans tracking-widest bg-muted border border-border">
                            ₹{match.avgSalaryLpa}–{match.avgSalaryLpa + 2} LPA
                        </Badge>
                    )}
                </div>

                {/* Strengths */}
                {match.strengths.length > 0 && (
                    <div className="pt-2">
                        <p className="text-xs font-bold font-sans text-muted-foreground uppercase tracking-widest mb-3 border-b border-border/50 pb-2">
                            Core Strengths
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {match.strengths.map((s, i) => (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (index * 0.1) + (i * 0.05) }}
                                    key={s}
                                    className="text-xs bg-muted text-foreground border border-border rounded-none px-3 py-1 font-sans font-medium uppercase tracking-widest"
                                >
                                    {s}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    {/* Required Exams */}
                    {match.requiredExams.length > 0 && (
                        <div>
                            <p className="text-xs font-bold font-sans text-muted-foreground uppercase tracking-widest mb-3 border-b border-border/50 pb-2 flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5" /> Required Exams
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {match.requiredExams.slice(0, 3).map(e => (
                                    <span key={e} className="text-xs border border-border px-2 py-1 font-sans">{e}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Job Roles */}
                    {match.topJobRoles.length > 0 && (
                        <div>
                            <p className="text-xs font-bold font-sans text-muted-foreground uppercase tracking-widest mb-3 border-b border-border/50 pb-2 flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5" /> Career Roles
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {match.topJobRoles.slice(0, 3).map(r => (
                                    <span key={r} className="text-xs bg-muted text-foreground px-2 py-1 font-sans">{r}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Mentor Explanation (collapsible) */}
                {aiExplanation && isTop && (
                    <div className="border-t border-border pt-6 mt-4">
                        <button
                            onClick={() => setExpanded(e => !e)}
                            className="flex items-center justify-between w-full text-left group"
                        >
                            <div className="flex items-center gap-2 text-sm font-sans font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                                <Zap className="h-4 w-4 text-primary" />
                                AI Mentor Analysis
                                {aiModelUsed && (
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none ml-2 font-mono ${AI_MODEL_BADGE[aiModelUsed]?.colour}`}>
                                        {AI_MODEL_BADGE[aiModelUsed]?.label}
                                    </span>
                                )}
                            </div>
                            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </span>
                        </button>

                        <motion.div
                            initial={false}
                            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0, marginTop: expanded ? 16 : 0 }}
                            className="overflow-hidden"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="p-6 bg-background rounded-none border border-border shadow-none">
                                <p className="text-sm font-sans text-foreground/90 leading-relaxed whitespace-pre-line font-medium">
                                    {aiExplanation}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full"
        >
            {isTop ? (
                <Tilt options={defaultTiltOptions} className="h-full cursor-pointer hover-card-premium">
                    {CardContentWrapper}
                </Tilt>
            ) : (
                <div className="h-full hover:-translate-y-1 transition-transform duration-300">
                    {CardContentWrapper}
                </div>
            )}
        </motion.div>
    );
});
