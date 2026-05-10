import { FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <FileText className="h-6 w-6 text-primary" />
                        <h1 className="text-lg font-semibold text-foreground">Terms of Service</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Terms of Service</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Please read these terms carefully before using the Zertainity platform.
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-6 uppercase tracking-wider">
                        Effective Date: May 2026
                    </p>
                </div>

                <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-8 md:p-12">
                    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                        <h3>1. Acceptance of Terms</h3>
                        <p>
                            By accessing and using Zertainity ("the Platform", "we", "us", or "our"), you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access the platform or use any of our services.
                        </p>

                        <h3>2. Description of Service</h3>
                        <p>
                            Zertainity is an AI-powered career guidance platform designed for Indian students. We provide educational quizzes, career pathway generation, and subject-specific recommendations based on user input. The platform is continuously evolving, and we reserve the right to modify or discontinue any part of the service without notice.
                        </p>

                        <h3>3. User Responsibilities</h3>
                        <p>
                            To ensure the integrity of the platform and the accuracy of your results, you agree to:
                        </p>
                        <ul>
                            <li>Provide accurate, current, and complete information regarding your academic background.</li>
                            <li>Maintain the security of your account password and authentication credentials.</li>
                            <li>Use the platform solely for personal, non-commercial educational purposes.</li>
                            <li>Not engage in data scraping, reverse engineering, or exploiting the platform's API or algorithms.</li>
                        </ul>

                        <h3>4. Intellectual Property</h3>
                        <p>
                            All content, features, and functionality—including but not limited to text, graphics, logos, algorithms, and software—are the exclusive property of Zertainity and are protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written consent.
                        </p>

                        <h3>5. Disclaimer of Warranties</h3>
                        <p>
                            The information provided by Zertainity is for informational and educational purposes only. The platform is provided on an <strong>"AS IS" and "AS AVAILABLE"</strong> basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or completeness of the career guidance generated.
                        </p>

                        <h3>6. Limitation of Liability</h3>
                        <p>
                            In no event shall Zertainity, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, or goodwill, resulting from your access to or use of (or inability to access or use) the platform.
                        </p>

                        <h3>7. Modifications to Terms</h3>
                        <p>
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide reasonable notice of any material changes. By continuing to access or use our platform after those revisions become effective, you agree to be bound by the revised terms.
                        </p>

                        <h3>8. Governing Law</h3>
                        <p>
                            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                        </p>

                        <h3>9. Contact Information</h3>
                        <p>
                            Questions about the Terms of Service should be sent to us at <strong>legal@zertainity.in</strong>.
                        </p>
                    </article>
                </div>
            </main>
        </div>
    );
}
