import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info, Users, Shield, Target, Award, Heart } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PageSEO } from "@/components/PageSEO";

const About = () => {
    const navigate = useNavigate();

    const values = [
        { icon: Target, title: "Our Mission", text: "To provide every student with access to intelligent, data-driven career guidance regardless of their background." },
        { icon: Users, title: "Who We Are", text: "Founded by Viney Ragesh and Johan Manoj, Zertainity is a platform built by students, for students." },
        { icon: Shield, title: "Trust & Transparency", text: "We provide unbiased recommendations based on real data, cutoffs, and legitimate rankings." },
    ];

    return (
        <div className="min-h-screen bg-background">
            <PageSEO title="About Us - Our Mission & Team" description="Learn about Zertainity's mission to empower students with AI-driven career guidance." />

            <header className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo className="h-8 w-auto cursor-pointer" onClick={() => navigate("/")} />
                    <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="rounded-full">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Hero Section */}
                    <section className="text-center space-y-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Info className="h-8 w-8 text-primary" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-shimmer">About Zertainity</h1>
                        <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
                            We're on a mission to simplify the complex world of career choices for students in India.
                        </p>
                    </section>

                    {/* Grid Section */}
                    <section className="grid md:grid-cols-3 gap-8">
                        {values.map((v, i) => (
                            <div key={i} className="p-8 rounded-3xl border bg-card/50 hover:border-primary/30 transition-all duration-300 group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <v.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold mb-4">{v.title}</h3>
                                <p className="text-muted-foreground leading-relaxed text-sm">{v.text}</p>
                            </div>
                        ))}
                    </section>

                    {/* Detailed Content */}
                    <section className="space-y-8 prose prose-slate dark:prose-invert max-w-none">
                        <h2 className="text-3xl font-bold tracking-tight">The Story Behind Zertainity</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Zertainity was born out of a simple observation: choosing a career path after 10th and 12th is unnecessarily stressful and often based on incomplete information. Most students rely on word-of-mouth or expensive counselors.
                        </p>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            We built Zertainity to be the "GPS for Careers." By combining advanced AI analysis with a deep understanding of the Indian education landscape, we provide a clear roadmap from subject selection to college admissions.
                        </p>

                        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 mt-12">
                            <div className="flex items-center gap-4 mb-4">
                                <Heart className="h-6 w-6 text-primary animate-pulse" />
                                <h3 className="text-xl font-bold">A Student-First Approach</h3>
                            </div>
                            <p className="text-muted-foreground italic mb-0">
                                "We don't sell your data to colleges. We don't take referral fees. Our only goal is to help you find a path that you'll actually love." — Viney & Johan
                            </p>
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="text-center pt-8">
                        <Button size="lg" onClick={() => navigate("/education-level")} className="rounded-full px-10 h-14 text-lg font-bold shadow-xl hover:scale-105 transition-all">
                            Discover Your Path Now
                        </Button>
                    </section>
                </div>
            </main>

            <footer className="border-t py-12 bg-muted/20">
                <div className="container mx-auto px-6 text-center text-muted-foreground">
                    <Logo className="h-6 w-auto opacity-50 mx-auto mb-4" />
                    <p>© 2026 Zertainity. Built for the future of India.</p>
                </div>
            </footer>
        </div>
    );
};

export default About;
