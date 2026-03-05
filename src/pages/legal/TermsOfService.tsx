import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Gavel } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PageSEO } from "@/components/PageSEO";

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <PageSEO title="Terms of Service - Zertainity" description="Read the terms and conditions for using the Zertainity platform." />

            <header className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo className="h-8 w-auto cursor-pointer" onClick={() => navigate("/")} />
                    <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="rounded-full">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16">
                <div className="max-w-3xl mx-auto space-y-10">
                    <div className="text-center space-y-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <Gavel className="h-6 w-6 text-blue-500" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Terms of Service</h1>
                        <p className="text-muted-foreground">Last Updated: March 2026</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-sm md:text-base">
                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">1. Acceptance of Terms</h2>
                            <p>By accessing or using Zertainity, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">2. Use of Services</h2>
                            <p>Zertainity provides career guidance and assessment tools for educational purposes. You agree to provide accurate information and use the services only for personal, non-commercial use.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">3. Academic Accuracy</h2>
                            <p>While we strive for 100% accuracy, career recommendations are based on statistical analysis and AI modeling. They should be used as a guidance tool, not as the sole basis for critical life decisions.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">4. Prohibited Conduct</h2>
                            <p>You agree not to attempt to reverse engineer, disrupt, or bypass the security measures of the platform. Unauthorized debugging or scraping is strictly prohibited and protected by our built-in security measures.</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="border-t py-12 bg-muted/20">
                <div className="container mx-auto px-6 text-center text-muted-foreground">
                    <p>© 2026 Zertainity. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default TermsOfService;
