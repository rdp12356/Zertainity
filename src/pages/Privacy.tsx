import { SEO } from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Privacy = () => {
    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <SEO
                title="Privacy Policy"
                description="Privacy Policy for Zertainity. Learn how we collect, use, and protect your data."
            />
            <Card className="max-w-4xl mx-auto shadow-card">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
                        Privacy Policy
                    </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                    <p>Effective Date: {new Date().toLocaleDateString()}</p>

                    <h3>1. Introduction</h3>
                    <p>
                        Welcome to Zertainity. We value your privacy and are committed to protecting your personal information.
                        This Privacy Policy explains how we collect, use, and safeguard your data when you use our website.
                    </p>

                    <h3>2. Information We Collect</h3>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, take a quiz, or contact us.
                        This may include:
                    </p>
                    <ul>
                        <li>Name and email address</li>
                        <li>Quiz responses and career preferences</li>
                        <li>Usage data and cookies</li>
                    </ul>

                    <h3>3. How We Use Your Information</h3>
                    <p>We use your information to:</p>
                    <ul>
                        <li>Provide personalized career recommendations</li>
                        <li>Improve our website and services</li>
                        <li>Send you updates and educational content (if opted in)</li>
                    </ul>

                    <h3>4. Third-Party Services</h3>
                    <p>
                        We use third-party services like Google Analytics and Supabase. These services may collect information about your
                        interactions with our site. We may also display advertisements from Google AdSense, which uses cookies to show
                        relevant ads.
                    </p>

                    <h3>5. Data Security</h3>
                    <p>
                        We implement reasonable security measures to protect your data. However, no method of transmission over the
                        internet is 100% secure.
                    </p>

                    <h3>6. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@zertainity.in.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default Privacy;
