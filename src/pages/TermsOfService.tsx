import React from "react";
import { FileText, CheckCircle, Scale, Terminal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <h1 className="text-lg font-semibold text-foreground">Terms of Service</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-foreground">Usage Agreement</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Standard rules governing your engagement with the Zertainity platform and AI tools.
                    </p>
                </div>

                <div className="space-y-6">
                    <Card className="shadow-sm border-l-4 border-l-primary border-t-border/40 border-r-border/40 border-b-border/40 bg-card/50">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                                <CheckCircle className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Service Availability</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Zertainity provides an advanced software interface designed to generate subjective career path recommendations. Access to our quizzes, pathfinders, and premium dark-mode layouts is granted "as is", without guaranteed uptime provisions during development phases.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-l-4 border-l-primary border-t-border/40 border-r-border/40 border-b-border/40 bg-card/50">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                                <Scale className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">User Conduct</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        You agree to supply accurate educational inputs to receive valuable insights. Any attempt to artificially manipulate our algorithm endpoints, scrape database lists of careers, or reverse engineer the weighting systems (PCM/PCB) is strictly prohibited. Zertainity reserves the right to terminate accounts actively violating codebase integrity.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-l-4 border-l-primary border-t-border/40 border-r-border/40 border-b-border/40 bg-card/50">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                                <Terminal className="h-7 w-7 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Intellectual Property</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        All interface designs, branding elements, evaluation structures, and core recommendation logics featured throughout this website remain the explicit intellectual property of the Zertainity founders. Duplication of our UI layers or educational logic flows is restricted under copyright.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-12 p-6 bg-muted/30 rounded-lg text-sm text-muted-foreground text-center">
                        Continued use of localhost or production build instances of Zertainity implies absolute consent to these Terms of Service.
                    </div>
                </div>
            </main>
        </div>
    );
}
