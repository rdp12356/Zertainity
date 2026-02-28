import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, BookOpen, GraduationCap, Calendar, ExternalLink } from "lucide-react";

interface Exam {
    name: string;
    fullName: string;
    domain: string[];
    authority: string;
    frequency: string;
    eligibility: string;
    mode: string;
    registrationMonth: string[];
    examMonth: string[];
    resultMonth: string;
    website: string;
    keyFacts: string[];
}

const EXAMS: Exam[] = [
    {
        name: "JEE Main", fullName: "Joint Entrance Examination (Main)",
        domain: ["engineering"], authority: "National Testing Agency (NTA)",
        frequency: "Twice a year (Jan & Apr)", eligibility: "12th PCM, min 75%",
        mode: "CBT (Online)", registrationMonth: ["Nov", "Feb"],
        examMonth: ["Jan", "Apr"], resultMonth: "Feb / May",
        website: "https://jeemain.nta.nic.in",
        keyFacts: ["Gateway to NITs, IIITs, CFTIs", "Qualifier for JEE Advanced", "75 questions, 3 hours", "Negative marking (-1 for wrong MCQ)"]
    },
    {
        name: "JEE Advanced", fullName: "Joint Entrance Examination (Advanced)",
        domain: ["engineering"], authority: "IITs (rotating)",
        frequency: "Once a year (May/Jun)", eligibility: "Top 2.5 lakh JEE Main qualifiers",
        mode: "CBT (Online)", registrationMonth: ["Apr"],
        examMonth: ["May"], resultMonth: "Jun",
        website: "https://jeeadv.ac.in",
        keyFacts: ["Gateway to all 23 IITs", "2 papers of 3 hours each", "No fixed marking; varies yearly", "Only 2 attempts allowed"]
    },
    {
        name: "NEET UG", fullName: "National Eligibility cum Entrance Test (UG)",
        domain: ["medical"], authority: "National Testing Agency (NTA)",
        frequency: "Once a year (May)", eligibility: "12th PCB, min 50% (Gen)",
        mode: "OMR (Pen & Paper)", registrationMonth: ["Feb–Mar"],
        examMonth: ["May"], resultMonth: "Jun",
        website: "https://neet.nta.nic.in",
        keyFacts: ["Gateway to MBBS, BDS, AYUSH, Nursing", "720 marks total", "Negative marking (-1)", "State quota + All India quota seats"]
    },
    {
        name: "BITSAT", fullName: "BITS Admission Test",
        domain: ["engineering"], authority: "BITS Pilani",
        frequency: "Once a year (May–Jun)", eligibility: "12th PCM min 75%, Physics+Chem+Maths 60%+",
        mode: "CBT (Online)", registrationMonth: ["Jan–Feb"],
        examMonth: ["May", "Jun"], resultMonth: "Jul",
        website: "https://www.bitsadmission.com",
        keyFacts: ["Admission to BITS Pilani/Goa/Hyderabad", "130 questions, 3 hours", "No negative marking for last 12 bonus questions", "12th toppers get direct admission"]
    },
    {
        name: "CAT", fullName: "Common Admission Test",
        domain: ["commerce"], authority: "IIMs (rotating)",
        frequency: "Once a year (Nov)", eligibility: "Bachelor's degree 50% (Gen)",
        mode: "CBT (Online)", registrationMonth: ["Aug–Sep"],
        examMonth: ["Nov"], resultMonth: "Jan",
        website: "https://iimcat.ac.in",
        keyFacts: ["Gateway to IIMs + 1500+ MBA colleges", "VARC + DILR + QA sections", "40 TITA (no negative) + 120 MCQ", "Percentile-based shortlisting"]
    },
    {
        name: "CLAT", fullName: "Common Law Admission Test",
        domain: ["law"], authority: "Consortium of NLUs",
        frequency: "Once a year (Dec)", eligibility: "12th pass 45% (Gen)",
        mode: "CBT (Online)", registrationMonth: ["Jul–Nov"],
        examMonth: ["Dec"], resultMonth: "Jan",
        website: "https://consortiumofnlus.ac.in",
        keyFacts: ["Admission to 22 National Law Universities", "120 questions, 2 hours", "Passage-based reading comprehension", "0.25 negative marking"]
    },
    {
        name: "NIFT", fullName: "National Institute of Fashion Technology Entrance Test",
        domain: ["design"], authority: "National Institute of Fashion Technology",
        frequency: "Once a year (Feb)", eligibility: "12th pass any stream",
        mode: "CBT + Situation Test", registrationMonth: ["Nov–Jan"],
        examMonth: ["Feb"], resultMonth: "Apr",
        website: "https://nift.ac.in",
        keyFacts: ["B.Des, B.FTech admissions", "GAT + CAT (Creative Ability Test)", "Situation test for B.Des candidates", "16 NIFT campuses across India"]
    },
    {
        name: "NID DAT", fullName: "National Institute of Design Design Aptitude Test",
        domain: ["design"], authority: "National Institute of Design",
        frequency: "Once a year (Jan)", eligibility: "12th pass any stream",
        mode: "CBT + Studio Test", registrationMonth: ["Oct–Nov"],
        examMonth: ["Jan"], resultMonth: "Apr",
        website: "https://admissions.nid.edu",
        keyFacts: ["B.Des at NID Ahmedabad + campuses", "Design Aptitude Test (DAT) in 2 phases", "Tests visual thinking, creativity", "Portfolio submission required for Studio test"]
    },
    {
        name: "CUET", fullName: "Common University Entrance Test (UG)",
        domain: ["arts", "commerce", "law", "design"], authority: "National Testing Agency (NTA)",
        frequency: "Once a year (May–Jun)", eligibility: "12th pass",
        mode: "CBT (Online)", registrationMonth: ["Feb–Mar"],
        examMonth: ["May", "Jun"], resultMonth: "Jul",
        website: "https://cuet.samarth.ac.in",
        keyFacts: ["Central & State university admissions", "Domain-specific + General Test", "45 Universities including DU, JNU, BHU", "No minimum marks needed to appear"]
    },
    {
        name: "GATE", fullName: "Graduate Aptitude Test in Engineering",
        domain: ["engineering"], authority: "IITs + IISc (rotating)",
        frequency: "Once a year (Feb)", eligibility: "B.E./B.Tech/B.Sc (Research)",
        mode: "CBT (Online)", registrationMonth: ["Sep–Oct"],
        examMonth: ["Feb"], resultMonth: "Mar",
        website: "https://gate2025.iitr.ac.in",
        keyFacts: ["M.Tech admissions to IITs, NITs", "PSU recruitment (BHEL, ONGC, etc.)", "Score valid for 3 years", "29 subject papers available"]
    },
    {
        name: "UPSC CSE", fullName: "Civil Services Examination",
        domain: ["arts"], authority: "Union Public Service Commission",
        frequency: "Once a year (Jun Prelims)", eligibility: "Graduate any discipline, age 21–32",
        mode: "OMR + Written + Interview", registrationMonth: ["Feb–Mar"],
        examMonth: ["Jun", "Sep", "Mar"], resultMonth: "Apr (final)",
        website: "https://upsc.gov.in",
        keyFacts: ["3 stages: Prelims, Mains, Interview", "IAS, IPS, IFS, IRS and 20+ services", "Max 6 attempts (Gen)", "One of India's toughest exams; ~0.1% selection rate"]
    },
    {
        name: "CA Foundation", fullName: "Chartered Accountancy Foundation",
        domain: ["commerce"], authority: "ICAI",
        frequency: "Twice a year (May & Nov)", eligibility: "12th pass any stream",
        mode: "OMR + Descriptive", registrationMonth: ["Jan", "Jul"],
        examMonth: ["May", "Nov"], resultMonth: "Jun / Dec",
        website: "https://icai.org",
        keyFacts: ["Entry point to CA career", "4 papers over 2 days", "Passing required to proceed to CA Intermediate", "60% pass marks needed per paper"]
    },
];

const DOMAINS = ["All", "engineering", "medical", "commerce", "law", "design", "arts"] as const;

const EntranceExams = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [domain, setDomain] = useState<string>("All");
    const [selected, setSelected] = useState<Exam | null>(null);

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
