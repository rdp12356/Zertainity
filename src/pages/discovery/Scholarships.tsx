import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, Wand2, GraduationCap, Banknote, RefreshCcw, ExternalLink } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Upgraded scholarship dataset based on logic variables
const MOCK_SCHOLARSHIPS = [
    { id: 1, name: "Inspire Scholarship (DST)", type: "Merit-Based", amount: "₹80,000 / year", incomeLimit: null, maxFamilyIncome: 99999999, category: "All", gender: "All", minMarks: 95, provider: "Govt of India" },
    { id: 2, name: "Post Matric Scholarship for Minorities", type: "Means-Based", amount: "Up to ₹10,000 / year", incomeLimit: "₹2,000,000", maxFamilyIncome: 2000000, category: "Minority", gender: "All", minMarks: 50, provider: "NSP" },
    { id: 3, name: "Kishore Vaigyanik Protsahan Yojana (KVPY)", type: "Merit-Based", amount: "₹5,000 - ₹7,000 / month", incomeLimit: null, maxFamilyIncome: 99999999, category: "All", gender: "All", minMarks: 75, provider: "IISc Bangalore" },
    { id: 4, name: "AICTE Pragati Scholarship for Girls", type: "Merit & Means", amount: "₹50,000 / year", incomeLimit: "₹8,000,000", maxFamilyIncome: 8000000, category: "All", gender: "Female", minMarks: 60, provider: "AICTE" },
    { id: 5, name: "PM-YASASVI Pre-Matric Scholarship", type: "Means-Based", amount: "₹4,000 / year", incomeLimit: "₹2,500,000", maxFamilyIncome: 2500000, category: "OBC", gender: "All", minMarks: 0, provider: "MoSJE" },
    { id: 6, name: "National Fellowship for SC Students", type: "Fellowship", amount: "₹35,000 / month", incomeLimit: null, maxFamilyIncome: 99999999, category: "SC", gender: "All", minMarks: 55, provider: "UGC" },
    { id: 7, name: "UDAAN - CBSE Scholarship for Girl Students", type: "Merit-Based", amount: "Free JEE Prep material", incomeLimit: "₹6,000,000", maxFamilyIncome: 6000000, category: "All", gender: "Female", minMarks: 70, provider: "CBSE" },
    { id: 8, name: "HDFC Badhte Kadam Scholarship", type: "Crisis Support", amount: "Up to ₹1,00,000", incomeLimit: "₹6,000,000", maxFamilyIncome: 6000000, category: "All", gender: "All", minMarks: 60, provider: "HDFC Bank" },
];

const ScholarshipWizard = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    
    // Form State
    const [income, setIncome] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [gender, setGender] = useState<string>("");
    const [marks, setMarks] = useState<string>("");

    // Results State
    const [results, setResults] = useState(MOCK_SCHOLARSHIPS);
    const [hasAnalyzed, setHasAnalyzed] = useState(false);

    const handleNext = () => setStep((s) => Math.min(s + 1, 4));
    const handlePrev = () => setStep((s) => Math.max(s - 1, 1));

    const handleAnalyze = () => {
        const numIncome = parseInt(income, 10) || 99999999;
        const numMarks = parseFloat(marks) || 0;

        const filtered = MOCK_SCHOLARSHIPS.filter((s) => {
            // Strict Income Check
            if (numIncome > s.maxFamilyIncome) return false;
            
            // Gender Check (If scholarship is female-only, reject males)
            if (s.gender !== "All" && gender !== s.gender && gender !== "") return false;

            // Category Check
            if (s.category !== "All" && category !== s.category && category !== "") return false;

            // Marks check
            if (numMarks < s.minMarks && marks !== "") return false;

            return true;
        });

        setResults(filtered);
        setHasAnalyzed(true);
    };

    const resetWizard = () => {
        setStep(1);
        setIncome("");
        setCategory("");
        setGender("");
        setMarks("");
        setHasAnalyzed(false);
    };

    const progressValue = (step / 4) * 100;

    return (
        <div className="min-h-screen bg-background">
            <PageSEO
                title="Smart Scholarship Finder - 100% Free Grants"
                description="Find scholarships you are strictly eligible for in under 60 seconds. Search by family income, academic marks, and category."
                keywords="scholarships india, college grants, free education, merit scholarships, minority scholarships"
                canonical="/scholarships"
                customSchema={{
                    "@type": "ItemList",
                    "itemListElement": MOCK_SCHOLARSHIPS.map((s, i) => ({
                        "@type": "ListItem",
                        "position": i + 1,
                        "item": {
                            "@type": "FinancialAidValue",
                            "name": s.name,
                            "description": `${s.type} scholarship worth ${s.amount}`,
                            "provider": {
                                "@type": "Organization",
                                "name": s.provider
                            }
                        }
                    }))
                }}
            />

            <header className="border-b border-border bg-card sticky top-0 z-50 shadow-sm backdrop-blur-xl">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 border border-emerald-400/20 shadow-sm">
                            <Wand2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Scholarship Wizard</h1>
                            <p className="text-xs text-muted-foreground mt-0.5">Filter the noise. Find the funds.</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                
                {hasAnalyzed ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-3xl p-8 border border-emerald-500/20 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 bg-emerald-500/20 rounded-full blur-3xl mix-blend-multiply" />
                            <Sparkles className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                            <h2 className="text-3xl font-black mb-2 text-foreground">You match {results.length} scholarships!</h2>
                            <p className="text-muted-foreground max-w-lg mx-auto mb-6">Based on your family income, demographics, and merit metrics, we've filtered out the noise. These are the grants you should apply for immediately.</p>
                            <Button variant="outline" onClick={resetWizard} className="rounded-full shadow-sm hover:bg-emerald-50/50 hover:text-emerald-600 transition-colors">
                                <RefreshCcw className="h-4 w-4 mr-2" /> Recalculate
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            {results.length > 0 ? results.map((scholarship) => (
                                <Card key={scholarship.id} className="border-border/60 hover:border-emerald-500/30 hover:shadow-lg transition-all group overflow-hidden">
                                    <div className="h-1 w-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="space-y-1">
                                                <Badge variant="outline" className="bg-emerald-50/50 text-emerald-600 border-emerald-200">{scholarship.type}</Badge>
                                                <h3 className="font-bold text-lg leading-tight">{scholarship.name}</h3>
                                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{scholarship.provider}</p>
                                            </div>
                                            <div className="p-2 bg-emerald-100/50 rounded-lg text-emerald-600 shrink-0">
                                                <Banknote className="h-5 w-5" />
                                            </div>
                                        </div>
                                        
                                        <div className="bg-muted/30 p-3 rounded-xl mb-6 flex justify-between items-center border border-border/50">
                                            <span className="text-sm font-medium text-muted-foreground">Grant Amount</span>
                                            <span className="font-black text-emerald-600">{scholarship.amount}</span>
                                        </div>

                                        <Button className="w-full bg-slate-900 text-slate-50 hover:bg-slate-800 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors" size="sm">
                                            Apply Now <ExternalLink className="h-4 w-4 ml-2" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="col-span-2 text-center py-12">
                                    <p className="text-lg text-muted-foreground font-medium">We couldn't find exact matches based on those tight parameters.</p>
                                    <Button variant="link" onClick={resetWizard}>Try adjusting your parameters</Button>
                                </div>
                            )}

                            {/* AdSense Unit (In-Feed) */}
                            <Card className="border-emerald-500/10 bg-emerald-500/5 md:col-span-2">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Badge className="bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30 border-none uppercase text-[9px] font-black">Sponsored</Badge>
                                        <h4 className="font-bold">Education Loan Assistance</h4>
                                        <p className="text-xs text-muted-foreground">Compare top education loan offers from 15+ banks.</p>
                                    </div>
                                    <div className="w-[100px] h-[50px] bg-background/50 rounded flex items-center justify-center border border-dashed border-emerald-200">
                                        <span className="text-[10px] text-emerald-900/40 font-mono">AD_UNIT</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <Card className="border-border/60 shadow-xl max-w-2xl mx-auto overflow-hidden">
                        <div className="bg-muted p-4 border-b border-border/50 flex flex-col gap-2">
                            <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                <span>Step {step} of 4</span>
                                <span>{progressValue}% Complete</span>
                            </div>
                            <Progress value={progressValue} className="h-2 bg-background data-[state=indeterminate]:bg-background" />
                        </div>
                        
                        <CardContent className="p-8">
                            <div className="min-h-[220px]">
                                {step === 1 && (
                                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                        <div className="text-center mb-6">
                                            <Banknote className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                                            <h2 className="text-2xl font-black">Family Income</h2>
                                            <p className="text-muted-foreground">Many government scholarships have strict income slabs.</p>
                                        </div>
                                        <div className="space-y-2 max-w-xs mx-auto">
                                            <Label>Annual Family Income (in ₹)</Label>
                                            <Input 
                                                type="number" 
                                                placeholder="e.g. 250000" 
                                                value={income}
                                                onChange={(e) => setIncome(e.target.value)}
                                                className="text-center font-mono text-lg h-12"
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                        <div className="text-center mb-6">
                                            <GraduationCap className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                                            <h2 className="text-2xl font-black">Academic Merit</h2>
                                            <p className="text-muted-foreground">What were your previous year's percentage or CGPA?</p>
                                        </div>
                                        <div className="space-y-2 max-w-xs mx-auto">
                                            <Label>Percentage (out of 100%)</Label>
                                            <Input 
                                                type="number" 
                                                placeholder="e.g. 85.5" 
                                                value={marks}
                                                onChange={(e) => setMarks(e.target.value)}
                                                className="text-center font-mono text-lg h-12"
                                            />
                                        </div>
                                    </div>
                                )}

                                {step === 3 && (
                                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                        <div className="text-center mb-6">
                                            <Wand2 className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                                            <h2 className="text-2xl font-black">Caste Category</h2>
                                            <p className="text-muted-foreground">Determines eligibility for specific central schemes.</p>
                                        </div>
                                        <div className="space-y-2 max-w-xs mx-auto">
                                            <Label>Select Category</Label>
                                            <Select value={category} onValueChange={setCategory}>
                                                <SelectTrigger className="h-12 text-center justify-center font-medium">
                                                    <SelectValue placeholder="Select Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="General">General</SelectItem>
                                                    <SelectItem value="OBC">OBC</SelectItem>
                                                    <SelectItem value="SC">SC</SelectItem>
                                                    <SelectItem value="ST">ST</SelectItem>
                                                    <SelectItem value="Minority">Minority</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {step === 4 && (
                                    <div className="space-y-4 animate-in slide-in-from-right-8 duration-300">
                                        <div className="text-center mb-6">
                                            <Sparkles className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                                            <h2 className="text-2xl font-black">Gender Specs</h2>
                                            <p className="text-muted-foreground">Some prestigious scholarships are aimed at female empowerment.</p>
                                        </div>
                                        <div className="space-y-2 max-w-xs mx-auto">
                                            <Label>Select Gender</Label>
                                            <Select value={gender} onValueChange={setGender}>
                                                <SelectTrigger className="h-12 text-center justify-center font-medium">
                                                    <SelectValue placeholder="Select Gender" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Male">Male</SelectItem>
                                                    <SelectItem value="Female">Female</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between mt-8 pt-4 border-t border-border/50">
                                <Button 
                                    variant="ghost" 
                                    onClick={handlePrev} 
                                    disabled={step === 1}
                                    className="font-medium"
                                >
                                    Previous
                                </Button>
                                {step < 4 ? (
                                    <Button onClick={handleNext} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 shadow-sm">
                                        Next Step
                                    </Button>
                                ) : (
                                    <Button onClick={handleAnalyze} className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 shadow-lg shadow-emerald-500/20">
                                        Analyze Matches
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

            </main>
        </div>
    );
};

export default ScholarshipWizard;
