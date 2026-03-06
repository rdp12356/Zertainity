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
        <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg h-full ${isTop ? 'border-2 border-primary shadow-glow' : 'border border-border'}`}>
            {isTop && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-400 to-primary" />
            )}

            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                        {isTop && (
                            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center mt-0.5 shadow-md">
                                <Trophy className="h-4 w-4 text-primary-foreground" />
                            </div>
                        )}
                        {!isTop && (
                            <div className="flex-shrink-0 w-8 h-8 bg-muted rounded-full flex items-center justify-center mt-0.5">
                                <span className="text-xs font-bold text-muted-foreground">#{match.rank}</span>
                            </div>
                        )}
                        <div className="min-w-0">
                            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">{match.career}</CardTitle>
                            <p className="text-sm text-muted-foreground capitalize mt-0.5">{match.domain}</p>
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
                <div className="w-full bg-muted rounded-full h-1.5 mt-3 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${match.matchScore}%` }}
                        transition={{ duration: 1, delay: 0.2 + (index * 0.1), ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: SCORE_COLOR(match.matchScore) }}
                    />
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={`text-xs border font-medium ${readinessCfg.color}`}>
                        <BarChart2 className="h-3 w-3 mr-1" />
                        {match.readinessLevel} Readiness
                    </Badge>
                    <Badge variant="outline" className={`text-xs border font-medium ${growthCfg.color}`}>
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {growthCfg.label}
                    </Badge>
                    {match.avgSalaryLpa && (
                        <Badge variant="secondary" className="text-xs font-medium">
                            ₹{match.avgSalaryLpa}–{match.avgSalaryLpa + 2} LPA
                        </Badge>
                    )}
                </div>

                {/* Strengths */}
                {match.strengths.length > 0 && (
                    <div className="pt-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Core Strengths
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {match.strengths.map((s, i) => (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 + (index * 0.1) + (i * 0.05) }}
                                    key={s}
                                    className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-md px-2.5 py-1 font-medium"
                                >
                                    {s}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Required Exams */}
                    {match.requiredExams.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <BookOpen className="h-3.5 w-3.5" /> Required Exams
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {match.requiredExams.slice(0, 3).map(e => (
                                    <Badge key={e} variant="outline" className="text-xs bg-background/50">{e}</Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Top Job Roles */}
                    {match.topJobRoles.length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <Briefcase className="h-3.5 w-3.5" /> Career Roles
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {match.topJobRoles.slice(0, 3).map(r => (
                                    <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Mentor Explanation (collapsible) */}
                {aiExplanation && isTop && (
                    <div className="border-t border-border/60 pt-4 mt-2">
                        <button
                            onClick={() => setExpanded(e => !e)}
                            className="flex items-center justify-between w-full text-left group"
                        >
                            <div className="flex items-center gap-2 text-sm font-semibold group-hover:text-primary transition-colors">
                                <Zap className="h-4 w-4 text-violet-500 group-hover:animate-pulse" />
                                AI Mentor Analysis
                                {aiModelUsed && (
                                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm ml-2 ${AI_MODEL_BADGE[aiModelUsed]?.colour}`}>
                                        {AI_MODEL_BADGE[aiModelUsed]?.label}
                                    </span>
                                )}
                            </div>
                            <span className="text-muted-foreground group-hover:text-primary transition-colors">
                                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </span>
                        </button>

                        <motion.div
                            initial={false}
                            animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0, marginTop: expanded ? 12 : 0 }}
                            className="overflow-hidden"
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="p-4 bg-secondary/50 rounded-lg border border-border/50 shadow-inner">
                                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-medium">
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
