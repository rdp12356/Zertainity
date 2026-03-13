import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PageSEO } from "@/components/PageSEO";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <PageSEO title="Privacy Policy - Zertainity" description="Learn how Zertainity protects and manages your personal data." />

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
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck className="h-6 w-6 text-green-500" />
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
                        <p className="text-muted-foreground">Effective Date: March 5, 2026</p>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">1. Information We Collect</h2>
                            <p>We collect information you provide directly to us when you create an account, take a career quiz, or communicate with us. This includes:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Name and Email Address</li>
                                <li>Education level (10th, 12th, etc.)</li>
                                <li>Academic interests and grades (for analysis)</li>
                                <li>Communication preferences</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">2. How We Use Your Information</h2>
                            <p>Your data is used solely to provide and improve our career guidance services:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Generating personalized career recommendations</li>
                                <li>Analyzing academic trends to improve matching accuracy</li>
                                <li>Sending essential service updates and account notifications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">3. Data Security</h2>
                            <p>We implement industry-standard security measures to protect your data, including:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>SSL encryption for all data transfers</li>
                                <li>Secure storage of profile information via Supabase</li>
                                <li>Production-level client-side hardening to prevent unauthorized access</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold border-b pb-2 mb-4">4. Your Rights</h2>
                            <p>You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.</p>
                        </section>
                    </div>
                </div>
            </main>

            <footer className="border-t py-12 bg-muted/20">
                <div className="container mx-auto px-6 text-center text-muted-foreground">
                    <p>© 2026 Zertainity. Your privacy is our priority.</p>
                </div>
            </footer>
        </div>
    );
};

export default PrivacyPolicy;
