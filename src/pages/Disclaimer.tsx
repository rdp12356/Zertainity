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
                        This page explains the limits of the guidance provided on this site.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card className="shadow-sm border-2 border-amber-500/20 bg-amber-500/5">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                                <Info className="h-8 w-8 text-amber-500 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-3 text-amber-600 dark:text-amber-400">Not Professional Advice</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        The career pathways and subject suggestions on Zertainity are generated from our internal guidance system. They are meant to help you start your research, not replace a qualified career counselor, teacher, or parent.
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
                                        Career fields change quickly, so you should always verify important choices with official sources and people you trust. Use Zertainity as a starting point, then confirm the final decision with your own research.
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
