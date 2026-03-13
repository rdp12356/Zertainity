import { useState, useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Clock, ExternalLink, Bell, AlertCircle, CheckCircle2 } from "lucide-react";
import { TRACKER_EXAMS } from "@/data/exams";

const CATEGORIES = ["All", "Engineering", "Medical", "Law", "Commerce", "Design", "General", "Civil Services"];

const ExamTracker = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [now, setNow] = useState(new Date());
    const [alertedExams, setAlertedExams] = useState<Set<string>>(new Set());
    const [toastMsg, setToastMsg] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000 * 60); // Update every minute
        return () => clearInterval(timer);
    }, []);

    // Toast auto-dismiss
    useEffect(() => {
        if (toastMsg) {
            const t = setTimeout(() => setToastMsg(null), 3500);
            return () => clearTimeout(t);
        }
    }, [toastMsg]);

    const calculateDaysLeft = (targetDateStr: string) => {
        const target = new Date(targetDateStr);
        const diffTime = target.getTime() - now.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const toggleAlert = (examId: string, examName: string) => {
        setAlertedExams(prev => {
            const next = new Set(prev);
            if (next.has(examId)) {
                next.delete(examId);
                setToastMsg(`🔕 Alert removed for ${examName}`);
            } else {
                next.add(examId);
                setToastMsg(`🔔 Alert set! You'll be reminded about ${examName}`);
            }
            return next;
        });
    };

    const sortedExams = [...TRACKER_EXAMS].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
    const filteredExams = sortedExams.filter(e => filter === "All" || e.category === filter);

    const getStatusColor = (days: number) => {
        if (days < 0) return "text-gray-500 bg-gray-100 border-gray-200";
        if (days <= 30) return "text-red-700 bg-red-50 border-red-200 animate-pulse";
        if (days <= 90) return "text-orange-700 bg-orange-50 border-orange-200";
        return "text-green-700 bg-green-50 border-green-200";
    };

    const upcomingCount = filteredExams.filter(e => calculateDaysLeft(e.examDate) > 0).length;

    return (
        <div className="min-h-screen bg-background pb-20">
            <PageSEO
                title="Entrance Exam Deadlines & Tracker 2026"
                description="Track important dates for JEE, NEET, CAT, CLAT, and other major entrance exams in India. Stay updated on registration deadlines and exam dates."
                keywords="exam tracker India, JEE Main 2026 dates, NEET 2026 deadline, CAT 2025 registration, entrance exam calendar India"
                canonical="/exam-tracker"
            />

            {/* Toast notification */}
            {toastMsg && (
                <div className="fixed top-4 right-4 z-50 bg-card border border-border shadow-xl rounded-xl px-5 py-3 flex items-center gap-3 animate-fade-in text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    {toastMsg}
                </div>
            )}

            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                            <CalendarDays className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Exam Deadlines</h1>
                            <p className="text-xs text-muted-foreground">Always stay ahead of schedule</p>
                        </div>
                    </div>
                    <span className="text-xs font-semibold text-white bg-primary px-2.5 py-1 rounded-full">
                        {upcomingCount} upcoming
                    </span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-8 space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Important Dates Tracker</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Track major entrance exam and registration deadlines in real-time. Days remaining are calculated live from today's date.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                        {CATEGORIES.map(cat => (
                            <Badge
                                key={cat}
                                variant={filter === cat ? "default" : "outline"}
                                className={`cursor-pointer px-3 py-1 text-sm transition-colors ${filter === cat ? "bg-primary" : "hover:bg-muted"}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4">
                    {filteredExams.map(exam => {
                        const examDays = calculateDaysLeft(exam.examDate);
                        const regDays = calculateDaysLeft(exam.registrationEnd);
                        const isPast = examDays < 0;
                        const hasAlert = alertedExams.has(exam.id);

                        return (
                            <Card key={exam.id} className={`overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 ${isPast ? 'border-l-gray-300 opacity-60' : 'border-l-primary'}`}>
                                <CardContent className="p-0">
                                    <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                                        {/* Info Section */}
                                        <div className="md:col-span-5 space-y-1">
                                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                <Badge variant="secondary" className="text-xs">{exam.category}</Badge>
                                                {regDays > 0 && regDays <= 15 && (
                                                    <Badge variant="destructive" className="text-[10px] uppercase flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" /> Reg Ends Soon
                                                    </Badge>
                                                )}
                                                {regDays < 0 && !isPast && (
                                                    <Badge className="text-[10px] bg-yellow-100 text-yellow-800 border-yellow-200 uppercase">
                                                        Registration Closed
                                                    </Badge>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold">{exam.name}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-1">{exam.fullName}</p>
                                        </div>

                                        {/* Timing Section */}
                                        <div className="md:col-span-4 grid grid-cols-2 gap-4 border-y md:border-y-0 md:border-x border-border py-4 md:py-0 md:px-6">
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Exam Date</p>
                                                <p className="font-medium">{new Date(exam.examDate).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                {examDays > 0 && <p className="text-xs text-muted-foreground mt-0.5">{examDays} days left</p>}
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Registration Ends</p>
                                                <p className="font-medium">{new Date(exam.registrationEnd).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                {regDays > 0 && <p className={`text-xs mt-0.5 font-medium ${regDays <= 15 ? 'text-destructive' : 'text-muted-foreground'}`}>{regDays} days left</p>}
                                            </div>
                                        </div>

                                        {/* Action / Countdown */}
                                        <div className="md:col-span-3 flex flex-row md:flex-col items-center justify-between md:justify-center md:items-end gap-3">
                                            <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${getStatusColor(examDays)}`}>
                                                <Clock className="h-5 w-5" />
                                                <div className="flex flex-col text-right">
                                                    <span className="text-lg font-bold leading-none">
                                                        {isPast ? "Passed" : `${examDays} Days`}
                                                    </span>
                                                    {!isPast && <span className="text-[10px] uppercase font-semibold">Remaining</span>}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant={hasAlert ? "default" : "outline"}
                                                    size="sm"
                                                    className={`gap-1.5 ${hasAlert ? "bg-primary text-primary-foreground" : ""}`}
                                                    onClick={() => toggleAlert(exam.id, exam.name)}
                                                    title={hasAlert ? "Remove alert" : "Set alert"}
                                                >
                                                    <Bell className="h-3.5 w-3.5" />
                                                </Button>
                                                <a href={exam.link} target="_blank" rel="noreferrer" className="shrink-0">
                                                    <Button variant="outline" size="sm" className="gap-2">
                                                        Site <ExternalLink className="h-3.5 w-3.5" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {filteredExams.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No exams found for this category.</p>
                    </div>
                )}

                {alertedExams.size > 0 && (
                    <div className="mt-12 p-5 rounded-xl border border-primary/20 bg-primary/5">
                        <div className="flex items-center gap-2 mb-3">
                            <Bell className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-sm">Your Alerts ({alertedExams.size})</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Array.from(alertedExams).map(id => {
                                const exam = TRACKER_EXAMS.find(e => e.id === id);
                                if (!exam) return null;
                                const days = calculateDaysLeft(exam.examDate);
                                return (
                                    <div key={id} className="flex items-center gap-2 bg-card border border-border rounded-full px-3 py-1 text-xs font-medium">
                                        <span>{exam.name}</span>
                                        <span className="text-muted-foreground">·</span>
                                        <span className={days < 0 ? "text-gray-400" : days <= 30 ? "text-destructive font-bold" : "text-primary"}>{days < 0 ? "Passed" : `${days}d`}</span>
                                        <button onClick={() => toggleAlert(id, exam.name)} className="text-muted-foreground hover:text-foreground ml-1">×</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExamTracker;
