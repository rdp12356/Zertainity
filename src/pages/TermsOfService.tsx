import { FileText, CheckCircle, Scale, Terminal, ArrowLeft, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";

export default function TermsOfService() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <PageHeader title="Terms" />

            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-foreground">Usage Agreement</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        These terms explain how you can use the Zertainity website and guidance tools.
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
                                        Zertainity provides career guidance tools, quizzes, and pathway pages on an "as is" basis. We aim to keep the site available, but we cannot guarantee uninterrupted service at all times.
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
                                        You agree to provide accurate educational details when using the platform. Do not try to scrape data, misuse the site, or interfere with the service. We may restrict access if the site is used in a harmful way.
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
                                        The design, branding, and original content on this website belong to Zertainity unless stated otherwise. Please do not copy or redistribute the site content without permission.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-12 p-6 bg-muted/30 rounded-lg text-sm text-muted-foreground text-center">
                        By continuing to use Zertainity, you agree to these Terms of Service.
                    </div>
                </div>
            </main>
        </div>
    );
}
