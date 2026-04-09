import React from "react";
import { Target, Lightbulb, Users, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function About() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <SEO 
                title="About Zertainity" 
                description="Learn more about Zertainity's mission to provide AI-powered career guidance to every student in India."
                canonical="/about"
            />
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Users className="h-6 w-6 text-primary" />
                        <h1 className="text-lg font-semibold text-foreground">About Zertainity</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground">Our Mission</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        To empower every student with crystalline clarity about their future. We replace confusion with data-driven AI milestones, turning intimidating career choices into a fun, mapped-out journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-16">
                    <Card className="shadow-lg border-border/40 bg-card overflow-hidden">
                        <div className="h-2 w-full bg-primary" />
                        <CardContent className="p-8">
                            <Target className="h-10 w-10 text-primary mb-6" />
                            <h3 className="text-2xl font-bold mb-4">The Problem We Solve</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Globally, millions of students struggle to pick the right academic streams (like PCM vs Commerce) because they don't understand the real-world implications of those subjects. Zertainity bridges the massive gap between middle-school academics and post-graduate job realities.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-border/40 bg-card overflow-hidden">
                        <div className="h-2 w-full bg-indigo-500" />
                        <CardContent className="p-8">
                            <Lightbulb className="h-10 w-10 text-indigo-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We envision a framework where a student's innate strengths perfectly match their working future. By deploying intelligent interest evaluations and mapping complex variables silently behind the UI, we craft a genuinely personalized learning roadmap.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-muted/30 rounded-3xl p-8 md:p-12 text-center border border-border/50">
                    <h3 className="text-3xl font-bold mb-6">The Team</h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Zertainity was architected and developed by **Viney Ragesh & Johan Manoj**. 
                        Combining a passion for modern React interfaces (Tailwind, Vite, CSS styling) with strong backend management methodologies, we built Zertainity to provide students the very clarity we wished we possessed.
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
