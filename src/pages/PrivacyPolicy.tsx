import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        <h1 className="text-lg font-semibold text-foreground">Privacy Policy</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold tracking-tight mb-4 text-foreground">Privacy Policy</h2>
                    <p className="text-lg text-muted-foreground w-full max-w-2xl mx-auto leading-relaxed">
                        Your privacy is our priority. Learn how we collect, use, and protect your personal and academic data.
                    </p>
                    <p className="text-sm font-medium text-muted-foreground mt-6 uppercase tracking-wider">
                        Last Updated: May 2026
                    </p>
                </div>

                <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-8 md:p-12">
                    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                        <h3>1. Information We Collect</h3>
                        <p>
                            We collect information to provide you with the best possible career guidance and personalized pathways. The types of data we collect include:
                        </p>
                        <ul>
                            <li><strong>Account Information:</strong> When you register, we collect your name, email address, and authentication credentials securely managed via Supabase.</li>
                            <li><strong>Academic Data:</strong> We collect your grade level, preferred subjects, examination marks, and quiz responses to tailor your career recommendations.</li>
                            <li><strong>Usage Data:</strong> We automatically collect information on how you interact with Zertainity to improve our platform's user experience.</li>
                        </ul>

                        <h3>2. How We Use Your Data</h3>
                        <p>
                            Your data is strictly used for platform functionality. We use it to:
                        </p>
                        <ul>
                            <li>Generate accurate, AI-assisted career pathway recommendations.</li>
                            <li>Maintain and secure your account.</li>
                            <li>Improve our proprietary guidance algorithms and platform features.</li>
                            <li>Communicate with you regarding updates, support, and essential service announcements.</li>
                        </ul>

                        <h3>3. Data Sharing & Third Parties</h3>
                        <p>
                            <strong>We do not sell, rent, or trade your personal or academic data to any third parties.</strong> 
                        </p>
                        <p>
                            We only share information with trusted service providers (like Supabase for database and authentication services) strictly for operating our platform. These providers are bound by strict confidentiality agreements and data protection laws.
                        </p>

                        <h3>4. Data Security</h3>
                        <p>
                            Zertainity employs industry-standard security measures, including <strong>Row Level Security (RLS)</strong>, to ensure that your data is only accessible to you. All data transmissions are encrypted using SSL/TLS protocols. However, no electronic transmission is entirely secure, and we cannot guarantee absolute security.
                        </p>

                        <h3>5. Your Rights & Choices</h3>
                        <p>
                            You have full control over your data. You may:
                        </p>
                        <ul>
                            <li>Review and update your academic inputs and profile at any time.</li>
                            <li>Request a complete deletion of your account and associated data by contacting support.</li>
                            <li>Opt-out of non-essential communications.</li>
                        </ul>

                        <h3>6. Children's Privacy</h3>
                        <p>
                            Our platform is intended for high school and college students seeking career guidance. If you are under the age of 13, you must have a parent or guardian's consent to use Zertainity. We do not knowingly collect personal data from children under 13 without parental consent.
                        </p>

                        <h3>7. Contact Us</h3>
                        <p>
                            If you have any questions or concerns regarding this Privacy Policy, please reach out to our team at <strong>privacy@zertainity.in</strong> or through our Contact page.
                        </p>
                    </article>
                </div>
            </main>
        </div>
    );
}
