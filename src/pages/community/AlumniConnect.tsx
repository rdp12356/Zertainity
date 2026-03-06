import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, Search, GraduationCap, MapPin, CheckCircle, CalendarDays, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Mock Database of verified Alumni
const MOCK_ALUMNI = [
    {
        id: "a1",
        name: "Rahul Sharma",
        college: "IIT Bombay",
        course: "B.Tech Computer Science",
        company: "Google",
        role: "Software Engineer",
        graduationYear: 2022,
        location: "Bangalore, India",
        avatar: "https://i.pravatar.cc/150?u=rahul",
        tags: ["Coding Interviews", "JEE Advanced Prep", "Hostel Life"],
        available: true
    },
    {
        id: "a2",
        name: "Priya Patel",
        college: "AIIMS Delhi",
        course: "MBBS",
        company: "Safdarjung Hospital",
        role: "Junior Resident",
        graduationYear: 2023,
        location: "New Delhi, India",
        avatar: "https://i.pravatar.cc/150?u=priya",
        tags: ["NEET Strategy", "Medical Biology", "Time Management"],
        available: true
    },
    {
        id: "a3",
        name: "Aarav Singh",
        college: "SRCC, Delhi University",
        course: "B.Com (Hons)",
        company: "McKinsey & Co.",
        role: "Business Analyst",
        graduationYear: 2021,
        location: "Mumbai, India",
        avatar: "https://i.pravatar.cc/150?u=aarav",
        tags: ["Consulting", "CUET Prep", "Case Studies"],
        available: false
    },
    {
        id: "a4",
        name: "Neha Gupta",
        college: "NID Ahmedabad",
        course: "B.Des Industrial Design",
        company: "IDEO",
        role: "Product Designer",
        graduationYear: 2020,
        location: "Pune, India",
        avatar: "https://i.pravatar.cc/150?u=neha",
        tags: ["Portfolio Reviews", "Design Aptitude Test", "Creative Thinking"],
        available: true
    }
];

const AlumniConnect = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTab, setSelectedTab] = useState("all");

    // Filter Logic
    const filteredAlumni = MOCK_ALUMNI.filter(alumni => {
        const matchesSearch = 
            alumni.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            alumni.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alumni.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alumni.company.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedTab === "available") return matchesSearch && alumni.available;
        if (selectedTab === "tech") return matchesSearch && alumni.role.includes("Engineer");
        if (selectedTab === "medical") return matchesSearch && alumni.course.includes("MBBS");
        
        return matchesSearch;
    });

    const handleConnect = (name: string) => {
        toast.success(`Connection request sent to ${name}! They will be notified via email.`);
    };

    return (
        <div className="min-h-screen bg-muted/20 pb-20">
            <PageSEO
                title="1-on-1 Alumni Connect - Mentorship & Guidance"
                description="Connect with verified seniors and graduates from IITs, AIIMS, and Top Indian Colleges. Get career guidance, interview tips, and professional networking."
                keywords="alumni mentorship, career guidance, college alumni, IIT mentors, medical mentors, networking"
                canonical="/alumni-connect"
                customSchema={{
                   "@type": "MentorshipProgram",
                   "name": "Zertainity Alumni Mentorship",
                   "description": "Connecting students with verified industry professionals for 1-on-1 career guidance.",
                   "provider": {
                       "@type": "Organization",
                       "name": "Zertainity"
                   }
                }}
            />

            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="p-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 border border-indigo-400/20 shadow-sm">
                            <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Alumni Connect</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Talk to those who've been there</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 sm:p-12 mb-8 text-white relative overflow-hidden flex flex-col items-center text-center shadow-xl">
                    <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
                    <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 bg-white/10 rounded-full blur-3xl mix-blend-overlay" />
                    
                    <Users className="h-16 w-16 text-white/80 mb-6 relative z-10" />
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4 relative z-10">Don't guess. Ask exactly what happens inside.</h2>
                    <p className="text-indigo-100 max-w-2xl text-base sm:text-lg mb-8 relative z-10">
                        Connect with verified students and recent graduates from IITs, AIIMS, NIDs, and DU. Ask them about campus life, interview strategies, and real-world workloads.
                    </p>

                    <div className="relative w-full max-w-xl mx-auto z-10">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <Input 
                            className="w-full h-14 pl-12 pr-4 bg-white text-black text-lg font-medium rounded-full shadow-lg placeholder:text-muted-foreground/70"
                            placeholder="Search by college, role, or major..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Directory Controls & AdSense Sidebar */}
                <div className="flex flex-col lg:flex-row gap-8 mb-6">
                    <div className="w-full lg:w-[280px] space-y-6">
                         <Card className="border-dashed border-border bg-card/50 overflow-hidden hidden lg:block">
                            <CardContent className="p-4 text-center">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest block mb-3">Promoted</span>
                                <div className="aspect-square w-full bg-muted/50 rounded flex items-center justify-center border border-border/50 mb-3">
                                    <span className="text-muted-foreground/40 text-[10px] font-mono italic">ADSENSE_SIDEBAR_CANNUAL</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-tight">Career resources from our partners.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h3 className="text-2xl font-black">Verified Mentors</h3>
                        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab} className="w-full sm:w-auto">
                            <TabsList className="bg-muted border border-border/50">
                                <TabsTrigger value="all">All Alumni</TabsTrigger>
                                <TabsTrigger value="available">Accepting Mentees</TabsTrigger>
                                <TabsTrigger value="tech">Tech & IT</TabsTrigger>
                                <TabsTrigger value="medical">Medical</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Directory Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {filteredAlumni.map((alumni) => (
                        <Card key={alumni.id} className="border-border/60 hover:border-indigo-500/30 hover:shadow-lg transition-all group overflow-hidden bg-card">
                            <CardContent className="p-0">
                                {/* Top Banner */}
                                <div className="h-24 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 w-full relative">
                                    {alumni.available && (
                                        <Badge className="absolute top-4 right-4 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-semibold text-xs border-0">
                                            <span className="flex h-2 w-2 rounded-full bg-white mr-1.5 animate-pulse" /> Available
                                        </Badge>
                                    )}
                                </div>
                                
                                <div className="px-6 pb-6 relative">
                                    {/* Avatar overlay */}
                                    <div className="flex justify-between items-end -mt-10 mb-4">
                                        <div className="h-20 w-20 rounded-full border-4 border-card bg-muted overflow-hidden shadow-sm relative z-10">
                                            <img src={alumni.avatar} alt={alumni.name} className="h-full w-full object-cover" />
                                        </div>
                                    </div>

                                    {/* Profile Info */}
                                    <div className="mb-4">
                                        <h4 className="text-xl font-bold flex items-center gap-1">
                                            {alumni.name} 
                                            <CheckCircle className="h-4 w-4 text-blue-500 fill-blue-50" />
                                        </h4>
                                        <p className="text-indigo-600 font-medium text-sm mb-2">{alumni.role} at {alumni.company}</p>
                                        
                                        <div className="grid grid-cols-2 gap-y-2 mt-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {alumni.college}</span>
                                            <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Class of {alumni.graduationYear}</span>
                                            <span className="flex items-center gap-1.5 col-span-2"><MapPin className="h-4 w-4" /> {alumni.location}</span>
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {alumni.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-muted/50 hover:bg-muted text-xs font-normal">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3">
                                        <Button 
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                                            disabled={!alumni.available}
                                            onClick={() => handleConnect(alumni.name)}
                                        >
                                            <CalendarDays className="h-4 w-4 mr-2" /> Request Connect
                                        </Button>
                                        <Button variant="outline" size="icon" className="shrink-0" onClick={() => toast("Messaging coming soon!")}>
                                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredAlumni.length === 0 && (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-border/60 rounded-3xl bg-muted/10">
                            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                            <h3 className="text-lg font-bold">No mentors found</h3>
                            <p className="text-muted-foreground">Try adjusting your search terms or filters.</p>
                        </div>
                    )}

                    {/* AdSense In-Feed Banner (Bottom of results) */}
                    <Card className="col-span-full border-primary/10 bg-gradient-to-r from-primary/5 to-transparent overflow-hidden mt-6">
                        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                            <div className="flex-1">
                                <Badge variant="secondary" className="mb-2">Recommended for You</Badge>
                                <h4 className="font-bold text-lg mb-1 italic text-indigo-700">Get 100% Free Scholarship Counselling</h4>
                                <p className="text-sm text-muted-foreground">Limited spots available for the 2024 academic cycle.</p>
                            </div>
                            {/* Ad Unit Placeholder */}
                            <div className="w-[300px] h-[90px] bg-background/50 rounded border border-border/50 flex items-center justify-center">
                                <span className="text-[10px] font-mono text-muted-foreground/40">ADSENSE_HORIZONTAL_IN_FEED</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </main>
        </div>
    );
};

export default AlumniConnect;
