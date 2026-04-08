import React from "react";
import { AlertTriangle, Focus, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Disclaimer() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                        <h1 className="text-lg font-semibold text-foreground">AI Disclaimer</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-foreground">Important Notice</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Understanding the limits of Artificial Intelligence in career planning.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card className="shadow-sm border-2 border-amber-500/20 bg-amber-500/5">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                                <Info className="h-8 w-8 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-amber-600 dark:text-amber-400">Not Professional Human Advice</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        The career pathways, subject suggestions, and professional trajectories provided by the Zertainity platform are generated using automated Artificial Intelligence algorithms. While designed strictly to match educational performance with known industry requirements, these output models do not serve as a replacement for certified human career counselors, psychological testing, or parental guidance.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-border/40 bg-card/50">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                                <Focus className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">AI Model Nuances</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Career fields evolve incredibly quickly. Although our pathfinding system attempts to provide modern streams (e.g., separating AI Specializations from regular Computer Science), users must conduct their own secondary research. Zertainity cannot be held liable for educational pivots or academic losses resulting from purely AI-derived recommendations. Proceed using our tools as an excellent *starting point* for your journey.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
