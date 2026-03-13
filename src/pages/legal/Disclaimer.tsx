import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PageSEO } from "@/components/PageSEO";

const Disclaimer = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <PageSEO title="Disclaimer - Zertainity" description="Important legal disclaimers regarding Zertainity's career advice and data." />

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
                        <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="h-6 w-6 text-amber-500" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Legal Disclaimer</h1>
                        <p className="text-muted-foreground">Important Notice to Users</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 bg-amber-500/5 p-8 rounded-3xl border border-amber-500/20">
                        <section>
                            <h2 className="text-xl font-bold mb-4">Educational Guidance Only</h2>
                            <p>Zertainity is an educational guidance platform. The career recommendations, college matching, and exam tracking data provided are for informational purposes only. They do not guarantee admission to any institution or success in any career path.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">Date Accuracy</h2>
                            <p>While we make every effort to keep exam dates and deadlines updated, official schedules are subject to change by respective examination boards (NTA, IITs, etc.). Users are strictly advised to cross-verify all dates with official university or board websites.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">Third-Party Links</h2>
                            <p>Our platform may contain links to external educational sites or government portals. We are not responsible for the content or privacy practices of these third-party websites.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold mb-4">No Professional Liability</h2>
                            <p>Zertainity and its founders shall not be liable for any losses or damages incurred as a result of using the information provided on this platform. Users use the service at their own discretion.</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="border-t py-12 bg-muted/20">
                <div className="container mx-auto px-6 text-center text-muted-foreground">
                    <p>© 2026 Zertainity. Empowering informed choices.</p>
                </div>
            </footer>
        </div>
    );
};

export default Disclaimer;
