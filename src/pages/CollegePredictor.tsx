import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Search, MapPin, GraduationCap, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";

const CollegePredictor = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [percentage, setPercentage] = useState("");
    const [location, setLocation] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!percentage) {
            toast({
                title: "Input Required",
                description: "Please enter your percentage to see matching colleges.",
                variant: "destructive"
            });
            return;
        }

        setIsSearching(true);
        setHasSearched(true);
        try {
            const { data, error } = await supabase
                .from("colleges")
                .select("*");

            if (error) throw error;

            const userPercentage = parseFloat(percentage);

            const matchedColleges = data?.filter(college => {
                const cutoffMatch = college.cutoffs?.match(/\d+(\.\d+)?/);
                const cutoffValue = cutoffMatch ? parseFloat(cutoffMatch[0]) : 0;

                const locationMatch = !location ||
                    college.location.toLowerCase().includes(location.toLowerCase());

                return (cutoffValue <= userPercentage || !cutoffValue) && locationMatch;
            }) || [];

            setResults(matchedColleges);
        } catch (error: any) {
            toast({
                title: "Search Failed",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsSearching(false);
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO
                title="College Predictor - Find Your Best Fit"
                description="Predict your chances of admission to top colleges based on your marks and location."
            />

            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="rounded-full">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            <h1 className="text-xl font-semibold tracking-tight">College Predictor</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 pt-12 max-w-5xl">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeInUp}
                    className="text-center mb-12 space-y-4"
                >
                    <h2 className="text-4xl font-bold tracking-tight">Predict Your Future</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-light">
                        Enter your academic details below to discover colleges where you represent a strong candidate for admission.
                    </p>
                </motion.div>

                <motion.div initial="initial" animate="animate" variants={fadeInUp}>
                    <Card className="shadow-premium border-border/40 mb-12 overflow-hidden">
                        <CardHeader className="bg-muted/30">
                            <CardTitle className="text-lg font-semibold">Candidate Profile</CardTitle>
                            <CardDescription>We'll match these details against current college requirements.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="percentage">Expected/Result Percentage (%)</Label>
                                    <div className="relative">
                                        <Input
                                            id="percentage"
                                            type="number"
                                            placeholder="e.g. 85"
                                            value={percentage}
                                            onChange={(e) => setPercentage(e.target.value)}
                                            className="pl-10"
                                        />
                                        <GraduationCap className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Preferred Location (Optional)</Label>
                                    <div className="relative">
                                        <Input
                                            id="location"
                                            placeholder="e.g. Mumbai, Delhi"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="pl-10"
                                        />
                                        <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="w-full mt-8 h-12 rounded-full font-medium shadow-lg hover:shadow-primary/20 transition-all"
                                variant="hero"
                            >
                                {isSearching ? "Analyzing Databases..." : "Find My Match"}
                                <Search className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </motion.div>

                {hasSearched && (
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="space-y-6"
                    >
                        <motion.h3 variants={fadeInUp} className="text-2xl font-semibold flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-primary" />
                            Recommended Institutions ({results.length})
                        </motion.h3>

                        {results.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {results.map((college) => (
                                    <motion.div
                                        key={college.id}
                                        variants={fadeInUp}
                                    >
                                        <Card className="h-full hover:shadow-premium transition-all duration-300 border-border/40 shadow-card hover:-translate-y-1 group">
                                            <CardHeader>
                                                <CardTitle className="text-xl group-hover:text-primary transition-colors">{college.name}</CardTitle>
                                                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                                    <MapPin className="h-3 w-3" />
                                                    {college.location}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                {college.description && (
                                                    <p className="text-sm line-clamp-3 text-muted-foreground font-light">
                                                        {college.description}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-2">
                                                    {college.courses?.slice(0, 3).map((course: string) => (
                                                        <span key={course} className="text-[10px] px-2 py-1 bg-muted rounded-full uppercase tracking-wider font-bold">
                                                            {course}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="pt-4 border-t flex justify-between items-center">
                                                    <div className="text-xs">
                                                        <span className="text-muted-foreground">Requirement: </span>
                                                        <span className="font-semibold text-primary">{college.cutoffs || "Contact for details"}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 h-8">
                                                        Details
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <motion.div variants={fadeInUp} className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                <p className="text-lg font-medium">No direct matches found</p>
                                <p className="text-muted-foreground font-light">Try adjusting your percentage or expanding your location search.</p>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </main>
        </div>
    );
};

export default CollegePredictor;
