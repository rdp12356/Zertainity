import { AlertTriangle, ArrowLeft } from "lucide-react";
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
                        <h1 className="text-lg font-semibold text-foreground">Platform Disclaimer</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">AI & Career Guidance Disclaimer</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Understanding the limits of automated guidance and your responsibilities.
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-6 uppercase tracking-wider">
                        Last Updated: May 2026
                    </p>
                </div>

                <div className="bg-card border-2 border-amber-500/20 rounded-2xl shadow-sm p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>
                    
                    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                        <h3 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mt-0">
                            <AlertTriangle className="h-6 w-6" />
                            Not Professional Advice
                        </h3>
                        <p className="lead">
                            The career pathways, subject recommendations, and educational strategies provided by Zertainity are generated using artificial intelligence and data-driven algorithms. <strong>They are intended for informational and exploratory purposes only.</strong>
                        </p>
                        <p>
                            Zertainity is <em>not</em> a substitute for certified career counselors, academic advisors, psychologists, or professional mentors. We highly recommend consulting with human professionals, parents, and teachers before making any definitive educational or career decisions.
                        </p>

                        <h3>AI Model Nuances & Accuracy</h3>
                        <p>
                            While we strive to provide highly accurate and contextualized guidance for the Indian educational system, our AI models are based on existing datasets and probability matrices. They may occasionally produce outputs that are:
                        </p>
                        <ul>
                            <li>Outdated, due to rapidly changing industry standards or syllabus updates.</li>
                            <li>Overly generalized, missing the nuance of a student's unique socio-economic or geographical context.</li>
                            <li>Incomplete regarding niche, emerging, or highly specialized career fields.</li>
                        </ul>

                        <h3>The Evolving Job Market</h3>
                        <p>
                            The landscape of careers, especially in technology, science, and the arts, is evolving at an unprecedented pace. Roles that are highly recommended today may look vastly different or face automation in the coming decade. Zertainity cannot predict economic shifts, market demands, or future employability with absolute certainty.
                        </p>

                        <h3>User Responsibility</h3>
                        <p>
                            By using Zertainity, you acknowledge that any action you take based on the information provided on this platform is strictly at your own risk. Zertainity, its developers, and partners will not be liable for any losses, damages, or unfulfilled career expectations arising from the use of our services.
                        </p>

                        <div className="mt-12 p-6 bg-muted/50 rounded-lg text-center border border-border/50">
                            <p className="m-0 font-medium text-foreground">
                                Use Zertainity as a compass to point you in the right direction, but let your passion, research, and professional advice chart the final course.
                            </p>
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
