import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Terms of Service"
                description="Terms of Service for Zertainity. Please read our terms and conditions carefully."
            />
            <Card className="max-w-4xl mx-auto shadow-card">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
                        Terms of Service
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <p>Effective Date: {new Date().toLocaleDateString()}</p>

                    <h3>1. Acceptance of Terms</h3>
                    <p>
                        By accessing or using Zertainity, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.
                    </p>

                    <h3>2. Educational Purpose</h3>
                    <p>
                        Zertainity is an AI-powered career guidance tool. The information provided is for educational and informational purposes only.
                        It does not constitute professional advice. You should consult with qualified professionals before making major life decisions.
                    </p>

                    <h3>3. User Conduct</h3>
                    <p>
                        You agree not to misuse our services, including but not limited to:
                    </p>
                    <ul>
                        <li>Interfering with the proper functioning of the site</li>
                        <li>Attempting to gain unauthorized access</li>
                        <li>Violating any applicable laws</li>
                    </ul>

                    <h3>4. Intellectual Property</h3>
                    <p>
                        All content on this website, including text, graphics, and logos, is the property of Zertainity or its content suppliers and is protected by copyright laws.
                    </p>

                    <h3>5. Limitation of Liability</h3>
                    <p>
                        Zertainity is not liable for any damages arising from the use or inability to use our services.
                    </p>

                    <h3>6. Changes to Terms</h3>
                    <p>
                        We may update these terms at any time. Continued use of the website constitutes acceptance of the new terms.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Terms;
