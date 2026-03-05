import { useState, useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CalendarDays, Clock, ExternalLink, Bell, AlertCircle } from "lucide-react";

interface Exam {
    id: string;
    name: string;
    fullName: string;
    category: "Engineering" | "Medical" | "Law" | "General";
    examDate: string;
    registrationEnd: string;
    link: string;
}

const EXAMS: Exam[] = [
    {
        id: "jee-main-1",
        name: "JEE Main (Session 1)",
        fullName: "Joint Entrance Examination (Main)",
        category: "Engineering",
        examDate: "2026-01-24", // Static mock dates
        registrationEnd: "2025-11-30",
        link: "https://jeemain.nta.ac.in/"
    },
    {
        id: "neet-ug",
        name: "NEET UG",
        fullName: "National Eligibility cum Entrance Test",
        category: "Medical",
        examDate: "2026-05-03",
        registrationEnd: "2026-03-09",
        link: "https://neet.nta.nic.in/"
    },
    {
        id: "bit-sat",
        name: "BITSAT",
        fullName: "BITS Admission Test",
        category: "Engineering",
        examDate: "2026-05-20",
        registrationEnd: "2026-04-10",
        link: "https://bitsadmission.com/"
    },
    {
        id: "cuet",
        name: "CUET UG",
        fullName: "Common University Entrance Test",
        category: "General",
        examDate: "2026-05-15",
        registrationEnd: "2026-03-26",
        link: "https://cuet.samarth.ac.in/"
    },
    {
        id: "clat",
        name: "CLAT",
        fullName: "Common Law Admission Test",
        category: "Law",
        examDate: "2025-12-01",
        registrationEnd: "2025-11-03",
        link: "https://consortiumofnlus.ac.in/"
    }
];

const CATEGORIES = ["All", "Engineering", "Medical", "Law", "General"];

const ExamTracker = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("All");
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000 * 60); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const calculateDaysLeft = (targetDateStr: string) => {
        const target = new Date(targetDateStr);
        const diffTime = target.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const sortedExams = [...EXAMS].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
    const filteredExams = sortedExams.filter(e => filter === "All" || e.category === filter);

    const getStatusColor = (days: number) => {
        if (days < 0) return "text-gray-500 bg-gray-100 border-gray-200";
        if (days <= 30) return "text-red-700 bg-red-50 border-red-200 animate-pulse";
        if (days <= 90) return "text-orange-700 bg-orange-50 border-orange-200";
        return "text-green-700 bg-green-50 border-green-200";
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <PageSEO
                title="Entrance Exam Deadlines & Tracker 2026"
                description="Track important dates for JEE, NEET, CAT, CLAT, and other major entrance exams in India. Stay updated on registration deadlines and exam dates."
                keywords="exam tracker India, JEE Main 2026 dates, NEET 2026 deadline, CAT 2025 registration, entrance exam calendar India"
                canonical="/exam-tracker"
            />
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
                    <Button variant="outline" size="sm" className="hidden md:flex gap-2">
                        <Bell className="h-4 w-4" /> Setup Alerts
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="mb-8 space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Important Dates Tracker</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Keep track of major entrance examination dates and registration deadlines to ensure you never miss an opportunity.
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

                        return (
                            <Card key={exam.id} className={`overflow-hidden transition-all duration-300 hover:shadow-md border-l-4 ${isPast ? 'border-l-gray-300 opacity-60' : 'border-l-primary'}`}>
                                <CardContent className="p-0">
                                    <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                                        {/* Info Section */}
                                        <div className="md:col-span-5 space-y-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="secondary" className="text-xs">{exam.category}</Badge>
                                                {regDays > 0 && regDays <= 15 && (
                                                    <Badge variant="destructive" className="text-[10px] uppercase flex items-center gap-1">
                                                        <AlertCircle className="h-3 w-3" /> Reg Ends Soon
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
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Registration Ends</p>
                                                <p className="font-medium">{new Date(exam.registrationEnd).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</p>
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
                                            <a href={exam.link} target="_blank" rel="noreferrer" className="shrink-0">
                                                <Button variant="outline" size="sm" className="gap-2">
                                                    Official Site <ExternalLink className="h-3.5 w-3.5" />
                                                </Button>
                                            </a>
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
                        <p>No upcoming exams found for this category.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ExamTracker;
