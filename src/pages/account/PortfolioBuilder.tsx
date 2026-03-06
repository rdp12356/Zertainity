import { useState, useRef } from "react";
import { PageSEO } from "@/components/PageSEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Download, GraduationCap, Trophy, Globe, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Types
interface Activity {
    id: string;
    title: string;
    description: string;
}

const PortfolioBuilder = () => {
    const navigate = useNavigate();
    const resumeRef = useRef<HTMLDivElement>(null);

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [school, setSchool] = useState("");
    const [grade, setGrade] = useState("");
    const [summary, setSummary] = useState("");

    // Dynamic Lists
    const [academics, setAcademics] = useState<Activity[]>([]);
    const [extracurriculars, setExtracurriculars] = useState<Activity[]>([]);
    const [awards, setAwards] = useState<Activity[]>([]);

    // State Toggles
    const [isPreview, setIsPreview] = useState(false);

    // Handlers
    const addActivity = (setter: React.Dispatch<React.SetStateAction<Activity[]>>) => {
        setter(prev => [...prev, { id: Date.now().toString(), title: "", description: "" }]);
    };

    const updateActivity = (setter: React.Dispatch<React.SetStateAction<Activity[]>>, id: string, field: keyof Activity, value: string) => {
        setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const removeActivity = (setter: React.Dispatch<React.SetStateAction<Activity[]>>, id: string) => {
        setter(prev => prev.filter(item => item.id !== id));
    };

    // Very basic window.print trigger for the "Download" utility
    const handlePrint = () => {
        window.print();
    };

    // Render helper for dynamic list forms
    const renderListItems = (
        title: string, 
        items: Activity[], 
        setter: React.Dispatch<React.SetStateAction<Activity[]>>,
        placeholderTitle: string,
        placeholderDesc: string
    ) => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label className="text-base font-bold">{title}</Label>
                <Button variant="outline" size="sm" onClick={() => addActivity(setter)} className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
            </div>
            {items.map((item, index) => (
                <div key={item.id} className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-3 relative group">
                    <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute -right-2 -top-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeActivity(setter, item.id)}
                    >
                        <Trash2 className="h-3 w-3" />
                    </Button>
                    <Input 
                        placeholder={placeholderTitle} 
                        value={item.title}
                        onChange={(e) => updateActivity(setter, item.id, 'title', e.target.value)}
                        className="font-semibold"
                    />
                    <Textarea 
                        placeholder={placeholderDesc} 
                        value={item.description}
                        onChange={(e) => updateActivity(setter, item.id, 'description', e.target.value)}
                        className="resize-none h-20 text-sm"
                    />
                </div>
            ))}
            {items.length === 0 && <p className="text-sm text-muted-foreground italic">No items added to this section yet.</p>}
        </div>
    );

    return (
        <div className="min-h-screen bg-muted/20 pb-20 print:bg-white print:pb-0">
            <PageSEO
                title="Portfolio Builder"
                description="Build a standout high school resume for college applications."
                canonical="/portfolio-builder"
            />

            {/* Print Header (Hidden on screen) */}
            <div className="hidden print:block text-center py-4 border-b border-border mb-8">
                <p className="text-xs text-muted-foreground">Generated via Zertainity.in</p>
            </div>

            {/* Screen Header (Hidden on print) */}
            <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm backdrop-blur-xl print:hidden">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="p-1.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-400/20 shadow-sm">
                            <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Portfolio Builder</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Craft your college application resume</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant={isPreview ? "outline" : "default"} 
                            onClick={() => setIsPreview(!isPreview)}
                        >
                            {isPreview ? "Edit Mode" : "Preview Canvas"}
                        </Button>
                        {isPreview && (
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handlePrint}>
                                <Download className="h-4 w-4 mr-2" /> PDF Print
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                {!isPreview ? (
                    // --- EDIT MODE ---
                    <div className="grid md:grid-cols-12 gap-6 print:hidden">
                        <div className="md:col-span-12 lg:col-span-8 space-y-6">
                            
                            <Card className="border-border/60 shadow-sm">
                                <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <GraduationCap className="h-5 w-5 text-blue-500" /> Personal Details
                                    </CardTitle>
                                    <CardDescription>The core details for your header.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Full Legal Name</Label>
                                            <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Contact Email</Label>
                                            <Input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Current School</Label>
                                            <Input placeholder="Delhi Public School" value={school} onChange={e => setSchool(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Grade / Year</Label>
                                            <Input placeholder="11th Grade / Class of 2025" value={grade} onChange={e => setGrade(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Professional Summary (Max 3 Sentences)</Label>
                                        <Textarea 
                                            placeholder="A highly motivated CS enthusiast with a passion for building AI tools..." 
                                            value={summary}
                                            onChange={e => setSummary(e.target.value)}
                                            className="h-24 resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-border/60 shadow-sm">
                                <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <Globe className="h-5 w-5 text-indigo-500" /> Extracurriculars & Leadership
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {renderListItems(
                                        "Clubs, Sports, & Volunteering", 
                                        extracurriculars, 
                                        setExtracurriculars, 
                                        "e.g., Debate Club Captain", 
                                        "Organized 5 inter-school tournaments. Mentored 20 junior delegates..."
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-border/60 shadow-sm">
                                <CardHeader className="bg-muted/30 border-b border-border/50 pb-4">
                                    <CardTitle className="flex items-center gap-2">
                                        <Trophy className="h-5 w-5 text-amber-500" /> Honors & Awards
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {renderListItems(
                                        "Academic & Competitive Achievements", 
                                        awards, 
                                        setAwards, 
                                        "e.g., National Cyber Olympiad Gold Medalist", 
                                        "Ranked 1st in State across 50,000 participants."
                                    )}
                                </CardContent>
                            </Card>

                        </div>

                        <div className="hidden lg:block lg:col-span-4">
                            <Card className="border-border/60 sticky top-24 bg-card shadow-lg">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="h-24 w-24 rounded-full bg-muted border-4 border-background mx-auto flex items-center justify-center shadow-inner">
                                        <Briefcase className="h-10 w-10 text-muted-foreground/30" />
                                    </div>
                                    <h3 className="font-bold text-lg leading-tight">Ready to Export?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Once you have filled out your details, toggle "Preview Canvas" at the top to see the exact PDF layout and print it.
                                    </p>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsPreview(true)}>
                                        Generate Preview
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    // --- PREVIEW / PRINT MODE ---
                    // Note: 'print:' classes apply styling ONLY when the user hits CTRL+P or Print.
                    <div className="flex justify-center">
                        <div 
                            ref={resumeRef}
                            className="bg-white text-black w-full max-w-[800px] min-h-[1056px] shadow-2xl print:shadow-none p-12 print:p-0 rounded-sm print:rounded-none"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                            {/* Resume Header */}
                            <div className="border-b-2 border-slate-800 pb-6 mb-8 text-center print:border-slate-800">
                                <h1 className="text-4xl font-black tracking-tight mb-2 uppercase text-slate-900">{name || "Your Name"}</h1>
                                <div className="text-sm font-medium text-slate-600 flex justify-center items-center gap-4 flex-wrap">
                                    <span>{email || "email@example.com"}</span>
                                    <span>•</span>
                                    <span>{school || "Your School Name"}</span>
                                    <span>•</span>
                                    <span>{grade || "Your Grade"}</span>
                                </div>
                            </div>

                            {/* Summary Section */}
                            {summary && (
                                <div className="mb-8">
                                    <p className="text-sm text-slate-700 leading-relaxed font-medium print:text-black">
                                        {summary}
                                    </p>
                                </div>
                            )}

                            {/* Extracurriculars Section */}
                            {extracurriculars.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">Leadership & Extracurriculars</h2>
                                    <div className="space-y-4">
                                        {extracurriculars.map(item => (
                                            <div key={item.id}>
                                                <h3 className="font-bold text-sm text-slate-800 mb-1">{item.title || "Untitled Activity"}</h3>
                                                <p className="text-sm text-slate-600 leading-snug print:text-black whitespace-pre-wrap">{item.description || "No description provided."}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Awards Section */}
                            {awards.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 mb-3 border-b border-slate-300 pb-1">Honors & Awards</h2>
                                    <div className="space-y-4">
                                        {awards.map(item => (
                                            <div key={item.id}>
                                                <h3 className="font-bold text-sm text-slate-800 mb-1">{item.title || "Untitled Award"}</h3>
                                                <p className="text-sm text-slate-600 leading-snug print:text-black whitespace-pre-wrap">{item.description || "No description provided."}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Academic placeholder for empty states */}
                            {extracurriculars.length === 0 && awards.length === 0 && (
                                <div className="text-center py-20 border-2 border-dashed border-slate-200 mt-10 print:hidden">
                                    <p className="text-slate-400 italic font-medium">Add activities and honors in edit mode to populate your canvas.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PortfolioBuilder;
