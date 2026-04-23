import { Target, Lightbulb, Users, ArrowLeft, GraduationCap } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { PageHeader } from "@/components/PageHeader";

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <SEO 
                title="About Zertainity" 
                description="Learn more about Zertainity's mission to provide AI-powered career guidance to every student in India."
                canonical="/about"
            />
            <PageHeader title="About" />

            <main className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">Our Mission</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        We help students understand their options, compare career paths, and make confident decisions about the next step in education.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card className="shadow-lg border-border/40 bg-card overflow-hidden">
                        <div className="h-2 w-full bg-primary" />
                        <CardContent className="p-8">
                            <Target className="h-10 w-10 text-primary mb-6" />
                            <h3 className="text-2xl font-bold mb-4">The Problem We Solve</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Many students are asked to choose a stream or career path before they have enough practical context. Zertainity brings career guidance, exam details, and education pathways together in one place so the choice is easier to understand.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-border/40 bg-card overflow-hidden">
                        <div className="h-2 w-full bg-indigo-500" />
                        <CardContent className="p-8">
                            <Lightbulb className="h-10 w-10 text-indigo-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Our goal is to make career planning feel clear and practical. We want students to get useful information quickly, without having to jump between multiple websites.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-muted/30 rounded-3xl p-8 md:p-12 text-center border border-border/50">
                    <h3 className="text-3xl font-bold mb-6">The Team</h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Zertainity was architected and developed by <strong className="text-foreground">Viney Ragesh &amp; Johan Manoj</strong>.
                        We built the platform to make career and exam research easier for students who want a single place to start.
                    </p>
                    <div className="inline-flex items-center justify-center space-x-2 bg-background px-6 py-3 rounded-full border border-border">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-sm font-medium">Platform Built & Maintained in 2026</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
