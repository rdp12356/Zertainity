import { Shield, Lock, Eye, Database, ArrowLeft, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <PageHeader title="Privacy" />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-foreground">How We Protect Your Data</h2>
                    <p className="text-lg text-muted-foreground w-full max-w-2xl mx-auto leading-relaxed">
                        We keep your personal and academic information private and use it only to provide your career guidance results.
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
                                        We collect information you choose to provide, such as your grade level, preferred subjects, marks, and quiz responses. We do not pull external academic records or add hidden tracking without your consent.
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
                                        The academic inputs you provide are used to generate recommendations inside the app. We do not sell or rent your data to colleges, recruiters, or ad networks.
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
                                        Zertainity uses Supabase with Row Level Security so data access stays limited to the right account. Passwords are handled by Supabase authentication and are not exposed to the frontend.
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
