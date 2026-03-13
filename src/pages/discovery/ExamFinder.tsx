import { useState, useMemo } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, GraduationCap, Clock, BookOpen, Briefcase, ChevronRight, SearchX } from "lucide-react";
import { DETAIL_EXAMS } from "@/data/exams";

const ExamFinder = () => {
    const navigate = useNavigate();
    const [age, setAge] = useState<number>(18);

    const filteredExams = useMemo(() => {
        return DETAIL_EXAMS.filter(exam => exam.ageRange.min <= age && exam.ageRange.max >= age);
    }, [age]);

    return (
        <div className="min-h-screen bg-background pb-20">
            <PageSEO
                title="Age-Based Exam Finder"
                description="Find the perfect entrance exams, government tests, and career opportunities based on your current age."
                keywords="exam finder, age based exams, competitive exams India, government jobs, entrance tests"
                canonical="/exam-finder"
            />

            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="p-1.5 rounded-xl bg-gradient-to-br from-cyan-400 to-sky-600 border border-sky-400/20">
                            <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Exam Finder</h1>
                            <p className="text-xs text-muted-foreground">Discover exams based on your age</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Age Selector Section */}
                <div className="mb-10 text-center space-y-6 bg-muted/30 p-8 rounded-3xl border border-border">
                    <h2 className="text-3xl font-black tracking-tight">How old are you?</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Your age determines eligibility for most competitive exams in India. Let us find out what opportunities are currently available to you.
                    </p>
                    
                    <div className="flex justify-center items-center gap-6 py-4">
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="h-12 w-12 rounded-full text-2xl font-bold border-2"
                            onClick={() => setAge(Math.max(14, age - 1))}
                        >
                            -
                        </Button>
                        <div className="text-6xl font-black text-primary min-w-[3ch] text-center drop-shadow-md">
                            {age}
                        </div>
                        <Button 
                            variant="outline" 
                            size="icon"
                            className="h-12 w-12 rounded-full text-2xl font-bold border-2"
                            onClick={() => setAge(Math.min(40, age + 1))}
                        >
                            +
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground bg-background inline-flex mx-auto px-4 py-1.5 rounded-full border border-border">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Found {filteredExams.length} eligible exams
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {filteredExams.length > 0 ? (
                        filteredExams.map((exam, idx) => (
                            <Card key={idx} className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/60 hover:border-primary/50 group">
                                <CardContent className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row gap-6 md:gap-10">
                                        
                                        {/* Left Col: Core Info */}
                                        <div className="flex-1 space-y-4">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                {exam.domain.map((dom) => (
                                                    <Badge key={dom} variant="secondary" className="capitalize">
                                                        {dom}
                                                    </Badge>
                                                ))}
                                                <Badge variant="outline" className="text-xs text-muted-foreground">
                                                    Age {exam.ageRange.min} - {exam.ageRange.max}
                                                </Badge>
                                            </div>
                                            
                                            <div>
                                                <h3 className="text-2xl font-bold flex items-center gap-2">
                                                    {exam.name}
                                                    <a href={exam.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                                        <ChevronRight className="h-5 w-5" />
                                                    </a>
                                                </h3>
                                                <p className="text-muted-foreground font-medium">{exam.fullName}</p>
                                            </div>

                                            <div className="flex items-start gap-3 text-sm pt-2">
                                                <GraduationCap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                <span className="text-foreground/80"><strong className="text-foreground">Eligibility:</strong> {exam.eligibility}</span>
                                            </div>
                                            
                                            <div className="flex items-start gap-3 text-sm">
                                                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                <span className="text-foreground/80"><strong className="text-foreground">Frequency:</strong> {exam.frequency}</span>
                                            </div>
                                        </div>

                                        {/* Breakline on mobile */}
                                        <div className="w-full h-px bg-border md:w-px md:h-auto" />

                                        {/* Right Col: Benefits & Syllabus */}
                                        <div className="flex-1 space-y-6">
                                            <div>
                                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
                                                    <Briefcase className="h-4 w-4" /> Why take this exam?
                                                </h4>
                                                <ul className="space-y-2">
                                                    {exam.benefits.map((benefit, i) => (
                                                        <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                                                            <span className="text-green-500 font-bold shrink-0 mt-[-1px]">✓</span>
                                                            <span className="leading-snug">{benefit}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2 mb-2">
                                                    <BookOpen className="h-3.5 w-3.5" /> Syllabus Overview
                                                </h4>
                                                <p className="text-sm text-foreground/80 leading-relaxed">
                                                    {exam.syllabus}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 px-4">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <SearchX className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No Exams Found</h3>
                            <p className="text-muted-foreground mx-auto max-w-md">
                                We couldn't find any major competitive exams for this specific age. Try adjusting the age to find opportunities.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default ExamFinder;
