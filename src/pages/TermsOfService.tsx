


import { useNavigate } from "react-router-dom";

import { SEO } from "@/components/SEO";

const LAST_UPDATED_ISO = "2026-05-20";
const LAST_UPDATED_LABEL = "20 May 2026";

export default function TermsOfService() {
    const navigate = useNavigate();

    const tosSchema = {
        "@context": "https://schema.org",
        "@type": "TermsOfService",
        name: "Zertainity Terms of Service",
        url: "https://www.zertainity.in/terms-of-service",
        inLanguage: "en-IN",
        datePublished: "2026-05-01",
        dateModified: LAST_UPDATED_ISO,
        publisher: {
            "@type": "Organization",
            name: "Zertainity",
            url: "https://www.zertainity.in",
            logo: "https://www.zertainity.in/favicon.png",
        },
    };

    return (
        <div className="min-h-screen pb-16 bg-[color:var(--z-canvas)]">
            <SEO
                title="Terms of Service"
                description="The terms that govern your use of Zertainity — a free career guidance platform for Indian students. Read your rights, responsibilities, and our service commitments."
                canonical="/terms-of-service"
                keywords="Zertainity terms of service, career platform terms, user agreement India, education platform terms, free career guidance terms"
                publishedTime="2026-05-01"
                modifiedTime={LAST_UPDATED_ISO}
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Terms of Service", path: "/terms-of-service" },
                ]}
                jsonLd={tosSchema}
            />

            <header className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 bg-[color:var(--z-nav-bg)] border-b border-[color:var(--z-border)]">
                <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-[color:var(--z-border)]" aria-label="Go back">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="var(--z-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <h1 className="text-[15px] font-normal text-[color:var(--z-ink)]">Terms of Service</h1>
                </div>
            </header>

            <main className="mx-auto max-w-[720px] px-6 py-16">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 text-[color:var(--z-primary)]">Legal</p>
                    <h2 className="font-serif text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-4 text-[color:var(--z-ink)]">
                        Terms of Service
                    </h2>
                    <p className="text-[17px] font-light leading-[1.6] text-[color:var(--z-ink-muted)]">
                        These terms set out the rules for using Zertainity. Please take a moment to read them — by signing up, you agree to everything below.
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] mt-6 text-[color:var(--z-ink-muted)]">
                        Effective Date: {LAST_UPDATED_LABEL}
                    </p>
                </div>

                <div className="rounded-xl p-8 md:p-12 bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]">
                    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                        <h3>1. Acceptance of these terms</h3>
                        <p>
                            By creating an account, signing in, or otherwise using Zertainity (“the Platform”, “Zertainity”, “we”, or “us”), you confirm that you have read, understood, and agree to these Terms of Service and our <a href="/privacy-policy">Privacy Policy</a>. If you don’t agree, please don’t use the Platform.
                        </p>
                        <p>
                            If you are under 18, you may use Zertainity only with the involvement of a parent or guardian who agrees to these terms on your behalf.
                        </p>

                        <h3>2. What Zertainity offers and How it Works</h3>
                        <p>
                            Zertainity is a sophisticated, data-driven career guidance platform designed explicitly for the Indian educational ecosystem. Our primary mission is to provide objective, actionable pathways for students. Our services encompass:
                        </p>
                        <ul>
                            <li><strong>Comprehensive Assessments:</strong> A guided testing module that evaluates academic history, cognitive abilities (logical reasoning, verbal aptitude), and personality traits.</li>
                            <li><strong>Algorithmic Recommendations:</strong> We process your assessment data against our proprietary algorithms to suggest the most statistically viable career paths, academic streams (Science, Commerce, Arts), and specialized entrance examinations.</li>
                            <li><strong>Actionable Roadmaps:</strong> For every recommended career, we provide a detailed roadmap outlining required subjects, critical entrance exams (e.g., JEE, NEET, CLAT), and target college benchmarks.</li>
                            <li><strong>Extensive Catalogues:</strong> Searchable, up-to-date databases of careers, entrance exams, and educational pathways relevant to the Indian context.</li>
                            <li><strong>User Accounts:</strong> Secure accounts to save progress, revisit results, and track your educational journey over time.</li>
                        </ul>
                        <p>
                            The digital landscape and educational requirements evolve rapidly. Therefore, we reserve the right to add, modify, suspend, or remove features, content, or services at our sole discretion. Where a change materially impacts your core experience, we will make reasonable efforts to notify you in advance via email or an in-app alert.
                        </p>

                        <h3>3. Eligibility and account</h3>
                        <ul>
                            <li>You must be at least 13 years old to create an account.</li>
                            <li>Provide accurate, current, and complete information when signing up and during the assessment.</li>
                            <li>Keep your password confidential. You’re responsible for all activity under your account.</li>
                            <li>Tell us promptly if you suspect unauthorised access to your account.</li>
                        </ul>

                        <h3>4. Acceptable use</h3>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Use Zertainity for anything illegal, harmful, or against public morality.</li>
                            <li>Scrape, copy, or systematically extract our content, careers data, or guidance algorithms.</li>
                            <li>Reverse engineer, decompile, or attempt to derive the source code of the Platform.</li>
                            <li>Upload viruses, malware, or content that infringes anyone’s rights.</li>
                            <li>Impersonate another person or misrepresent your affiliation with any organisation.</li>
                            <li>Resell, sublicense, or commercially exploit Zertainity without our written consent.</li>
                        </ul>

                        <h3>5. User content</h3>
                        <p>
                            You retain ownership of the data you submit (e.g., marks, interests, free-text responses). By submitting it, you grant Zertainity a worldwide, royalty-free licence to host, process, and analyse this data as necessary to operate the service. We will never publish your personal data without your explicit consent.
                        </p>

                        <h3>6. Intellectual property</h3>
                        <p>
                            The Platform — including its design, source code, branding, careers catalogue, recommendation logic, copy, and graphics — is the property of Zertainity and its licensors and is protected by Indian and international intellectual-property laws. You may print or save your personal results for non-commercial use; everything else requires our written permission.
                        </p>

                        <h3>7. Educational guidance, not professional advice</h3>
                        <p>
                            Zertainity’s recommendations are based on your inputs and current public data about exams, colleges, and careers. They are <strong>educational, not prescriptive</strong>. Major life decisions — stream choice, college applications, exam attempts — should be made with input from parents, teachers, and qualified counsellors. See our <a href="/disclaimer">Disclaimer</a> for more.
                        </p>

                        <h3>8. Third-Party Services and Advertising (Google AdSense)</h3>
                        <p>
                            To maintain Zertainity as a free resource for students, we rely on trusted third-party infrastructure and advertising networks. Your interactions with these services are governed by their respective terms of service and privacy policies, not ours.
                        </p>
                        <p>
                            <strong>Google AdSense & DoubleClick Cookies:</strong><br />
                            Zertainity utilizes Google AdSense to display relevant advertisements on our Platform. Please be explicitly aware of the following regarding Google's advertising practices:
                        </p>
                        <ul>
                            <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to Zertainity or other websites across the Internet.</li>
                            <li>Google's use of advertising cookies enables it and its partners to serve targeted ads to you based on your browsing history.</li>
                            <li>You have the right to opt out of personalized advertising. You can do this by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">Google Ad Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://aboutads.info" target="_blank" rel="noreferrer">aboutads.info</a>.</li>
                        </ul>
                        <p>
                            We are not responsible for the content, privacy practices, or data collection policies of any external websites linked to or advertised on our Platform. Clicking on third-party links or advertisements is done entirely at your own risk.
                        </p>

                        <h3>9. Disclaimer of warranties</h3>
                        <p>
                            The Platform is provided on an <strong>“as is” and “as available”</strong> basis. To the maximum extent permitted by law, we disclaim all warranties — express or implied — including merchantability, fitness for a particular purpose, accuracy, and non-infringement. We don’t guarantee particular results from using the Platform.
                        </p>

                        <h3>10. Limitation of liability</h3>
                        <p>
                            To the maximum extent allowed by law, Zertainity, its founders, employees, and partners shall not be liable for any indirect, incidental, special, consequential, or exemplary damages, or for loss of data, profits, opportunities, or goodwill arising from your use of or inability to use the Platform. Our total aggregate liability to you for any claim shall not exceed INR 1,000.
                        </p>

                        <h3>11. Termination</h3>
                        <p>
                            You can stop using Zertainity at any time and delete your account from <strong>Settings</strong>. We may suspend or terminate accounts that violate these Terms, abuse the Platform, or expose us or other users to risk. On termination, the rights granted to you end immediately; sections that by nature should survive (IP, disclaimers, liability, governing law) will remain in effect.
                        </p>

                        <h3>12. Changes to these terms</h3>
                        <p>
                            We may update these Terms periodically. The “Effective Date” above shows the latest version. Continued use of the Platform after changes are posted means you accept the revised Terms. For material changes, we’ll give reasonable advance notice.
                        </p>

                        <h3>13. Governing law and disputes</h3>
                        <p>
                            These Terms are governed by the laws of India. Any dispute arising from or relating to the Platform will be subject to the exclusive jurisdiction of the courts at <strong>Bengaluru, Karnataka</strong>. Before filing a claim, we ask that you contact us first so we can try to resolve it amicably.
                        </p>

                        <h3>14. Contact</h3>
                        <p>
                            Questions about these Terms? Email <strong><a href="mailto:legal@zertainity.in">legal@zertainity.in</a></strong> or use the <a href="/contact">Contact</a> page.
                        </p>
                    </article>
                </div>
            </main>
        </div>
    );
}
