import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Trophy, Building2, MapPin, Search } from "lucide-react";
import { CUTOFF_DATA, CollegeCutoff } from "@/data/cutoffs";

type PredictionResult = {
    safe: CollegeCutoff[];
    target: CollegeCutoff[];
    reach: CollegeCutoff[];
};

const RankPredictor = () => {
    const navigate = useNavigate();
    const [exam, setExam] = useState<string>("");
    const [rank, setRank] = useState<string>("");
    const [category, setCategory] = useState<string>("General");
    const [state, setState] = useState<string>("");
    const [results, setResults] = useState<PredictionResult | null>(null);
    const [hasPredicted, setHasPredicted] = useState(false);

    const handlePredict = () => {
        if (!exam || !rank || !category || !state) return;

        const numericRank = parseInt(rank, 10);
        if (isNaN(numericRank) || numericRank <= 0) return;

        // Filter the dataset based on Exam, Category
        let eligibleColleges = CUTOFF_DATA.filter(
            (c) => c.exam === exam && c.category === category
        );

        // Apply Home State Quota logic (simplified for mockup)
        eligibleColleges = eligibleColleges.filter(
            (c) => !c.homeState || (c.homeState && c.location === state)
        );

        const safe: CollegeCutoff[] = [];
        const target: CollegeCutoff[] = [];
        const reach: CollegeCutoff[] = [];

        eligibleColleges.forEach((c) => {
            if (numericRank <= c.closingRank * 0.8) {
                safe.push(c);
            } else if (numericRank <= c.closingRank * 1.1) {
                target.push(c);
            } else if (numericRank <= c.closingRank * 1.4) {
                reach.push(c);
            }
        });

        const sortByRank = (a: CollegeCutoff, b: CollegeCutoff) => a.closingRank - b.closingRank;
        
        safe.sort(sortByRank);
        target.sort(sortByRank);
        reach.sort(sortByRank);

        setResults({ safe, target, reach });
        setHasPredicted(true);
    };

    const renderCollegeCard = (college: CollegeCutoff, type: 'Safe' | 'Target' | 'Reach') => {
        const typeColors = {
            Safe: 'border-green-500/30 bg-green-500/5',
            Target: 'border-blue-500/30 bg-blue-500/5',
            Reach: 'border-orange-500/30 bg-orange-500/5',
        };

        const badgeColors = {
            Safe: 'bg-green-500 text-white',
            Target: 'bg-blue-500 text-white',
            Reach: 'bg-orange-500 text-white',
        };

        return (
            <Card key={college.id} className={`mb-3 overflow-hidden border ${typeColors[type]}`}>
                <CardContent className="p-4 flex justify-between items-center sm:flex-row flex-col gap-4">
                    <div className="flex-1 w-full">
                        <div className="flex items-center gap-2 mb-1">
                            <Badge className={`${badgeColors[type]} text-[10px] px-1.5 py-0 h-5`}>{type}</Badge>
                            <span className="text-xs font-semibold text-muted-foreground uppercase">{college.type}</span>
                        </div>
                        <h4 className="font-bold text-lg text-foreground flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" /> {college.collegeName}
                        </h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Target className="h-3 w-3" /> {college.course}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {college.location}</span>
                        </div>
                    </div>
                    <div className="text-right sm:border-l border-border/50 sm:pl-4">
                        <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">Hist. Cutoff</p>
                        <p className="text-xl font-black text-foreground">{college.closingRank.toLocaleString()}</p>
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <PageSEO
                title="College Rank Predictor - JEE, NEET, CUET Admissions"
                description="Predict your chances of admission into IITs, NITs, Medical, and State colleges based on your rank and category. Data-driven insights for Indian students."
                keywords="college rank predictor, JEE rank predictor, NEET admission chances, college matching, admission probability"
                canonical="/rank-predictor"
                customSchema={{
                   "@type": "RecommendationService",
                   "name": "Zertainity College Predictor",
                   "description": "Educational tool for predicting collegiate admission probabilities based on historical cutoff data.",
                   "serviceType": "Academic Admission Prediction"
                }}
            />

            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="p-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 border border-indigo-400/20">
                            <Trophy className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">Rank Predictor</h1>
                            <p className="text-xs text-muted-foreground">Data-driven college predictions</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    <div className="lg:col-span-4 space-y-6">
                        <div className="mb-6">
                            <h2 className="text-3xl font-black tracking-tight mb-2">Check Your Plausibility</h2>
                            <p className="text-muted-foreground sm:text-base text-sm">
                                Enter your details to cross-reference historical closing ranks. See exactly where you stand.
                            </p>
                        </div>

                        <Card className="border-border/60 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600" />
                            <CardContent className="pt-6 space-y-5">
                                <div className="space-y-2">
                                    <Label>Select Entrance Exam</Label>
                                    <Select value={exam} onValueChange={setExam}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="e.g. JEE Main" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="JEE Main">JEE Main (Engineering)</SelectItem>
                                            <SelectItem value="NEET">NEET (Medical)</SelectItem>
                                            <SelectItem value="CUET">CUET (Central Univ.)</SelectItem>
                                            <SelectItem value="MHT-CET">MHT-CET (Maharashtra)</SelectItem>
                                            <SelectItem value="BITSAT">BITSAT (BITS)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Your Real or Expected Rank</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="e.g. 4500" 
                                        value={rank} 
                                        onChange={(e) => setRank(e.target.value)} 
                                        className="font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select value={category} onValueChange={setCategory}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="General">General / Open</SelectItem>
                                            <SelectItem value="OBC">OBC-NCL</SelectItem>
                                            <SelectItem value="SC">SC</SelectItem>
                                            <SelectItem value="ST">ST</SelectItem>
                                            <SelectItem value="EWS">EWS</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Home State Domicile</Label>
                                    <Select value={state} onValueChange={setState}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                            <SelectItem value="Delhi">Delhi</SelectItem>
                                            <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                            <SelectItem value="Karnataka">Karnataka</SelectItem>
                                            <SelectItem value="Telangana">Telangana</SelectItem>
                                            <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                                            <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button 
                                    className="w-full h-12 text-base font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-xl shadow-indigo-500/20" 
                                    onClick={handlePredict}
                                    disabled={!exam || !rank || !state}
                                >
                                    <Search className="h-5 w-5 mr-2" /> Predict Colleges
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-dashed border-border/60 bg-muted/20">
                            <CardContent className="p-4 text-center">
                                <span className="text-[10px] text-muted-foreground uppercase font-black tracking-tighter block mb-2 opacity-50">Sponsor</span>
                                <div className="w-full h-[150px] bg-background/50 rounded border border-border/50 flex flex-col items-center justify-center">
                                    <span className="text-[10px] font-mono text-muted-foreground/30">ADSENSE_AD_UNIT_SIDEBAR</span>
                                    <div className="w-20 h-2 bg-muted rounded-full mt-2" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-8">
                        {!hasPredicted ? (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-3xl bg-muted/10 p-8 text-center">
                                <Trophy className="h-16 w-16 text-muted-foreground/30 mb-4" />
                                <h3 className="text-xl font-bold mb-2">Awaiting Parameters</h3>
                                <p className="text-muted-foreground max-w-sm">
                                    Fill out the form on the left to see which colleges you have the best shot at cracking this year.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <div>
                                        <h3 className="text-2xl font-black">Prediction Results</h3>
                                        <p className="text-sm text-muted-foreground">Based on historical closing ranks and {category} category cutoffs.</p>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div className="hidden sm:block">
                                            <div className="w-[120px] h-[50px] bg-muted/50 rounded border border-border/50 flex items-center justify-center">
                                                <span className="text-[8px] font-mono text-muted-foreground/40 italic">ADSENSE_UNIT_TOP_RIGHT</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground uppercase tracking-widest">Input Rank</p>
                                            <p className="text-2xl font-black text-indigo-500 font-mono">{parseInt(rank).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 font-bold mb-4 text-green-500">
                                        <span className="h-2 w-2 rounded-full bg-green-500"></span> Safe Options
                                    </h4>
                                    {results?.safe.length ? (
                                        results.safe.map(c => renderCollegeCard(c, 'Safe'))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic pl-4">No matching colleges found in this tier.</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 font-bold mb-4 text-blue-500">
                                        <span className="h-2 w-2 rounded-full bg-blue-500"></span> Target Colleges
                                    </h4>
                                    {results?.target.length ? (
                                        results.target.map(c => renderCollegeCard(c, 'Target'))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic pl-4">No matching colleges found in this tier.</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="flex items-center gap-2 font-bold mb-4 text-orange-500">
                                        <span className="h-2 w-2 rounded-full bg-orange-500"></span> Reach Colleges
                                    </h4>
                                    {results?.reach.length ? (
                                        results.reach.map(c => renderCollegeCard(c, 'Reach'))
                                    ) : (
                                        <p className="text-sm text-muted-foreground italic pl-4">No matching colleges found in this tier.</p>
                                    )}
                                </div>

                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default RankPredictor;
