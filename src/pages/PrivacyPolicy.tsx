import React from "react";
import { Shield, Lock, Eye, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <h1 className="text-lg font-semibold text-foreground">Privacy Policy</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-foreground">How We Protect Your Data</h2>
                    <p className="text-lg text-muted-foreground w-full max-w-2xl mx-auto line-clamp-2">
                        At Zertainity, your personal and academic information is kept secure, private, and solely used to map your true potential.
                    </p>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                    <Card className="shadow-sm border border-border/40 bg-card/50">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <Database className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">1. Data Collection</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We collect information you directly provide, including your educational grade level, preferred subjects, academic marks, and quiz responses. This data is rigorously modeled by our systems to generate your personalized career pathway. We do not scrape external academic records or collect hidden tracking metrics without your consent.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-border/40 bg-card/50">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <Eye className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">2. Data Usage</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        The academic inputs (e.g., PCM, PCB selections) and evaluation metrics strictly fuel our internal recommendation engine. Zertainity does not sell, rent, or transparently broker your career projection data to third-party colleges, recruiters, or advertisement networks. Your pathway is strictly your own.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border border-border/40 bg-card/50">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start gap-4">
                                <Lock className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">3. Security Details</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Zertainity integrates natively with Supabase for robust backend enforcement. We utilize Row Level Security (RLS) ensuring that your profile information, assessment inputs, and career roadmaps are cryptographically bound to your specific authenticated session. Passwords remain encrypted and untouched by our frontend interfaces.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <div className="pt-8 text-sm text-muted-foreground">
                        <p>Last Updated: April 2026. If you have any inquiries regarding your privacy, please navigate to the Contact page to reach our development team directly.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
