


import { useNavigate } from "react-router-dom";

import { SEO } from "@/components/SEO";

const LAST_UPDATED_ISO = "2026-05-20";
const LAST_UPDATED_LABEL = "20 May 2026";

export default function PrivacyPolicy() {
    const navigate = useNavigate();

    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "PrivacyPolicy",
        name: "Zertainity Privacy Policy",
        url: "https://www.zertainity.in/privacy-policy",
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
                title="Privacy Policy"
                description="Learn how Zertainity collects, uses, and protects your personal and academic data. We never sell student data and use Supabase Row Level Security to keep it private."
                canonical="/privacy-policy"
                keywords="Zertainity privacy policy, student data privacy, career guidance privacy, India education data, GDPR DPDP, secure career platform"
                publishedTime="2026-05-01"
                modifiedTime={LAST_UPDATED_ISO}
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Privacy Policy", path: "/privacy-policy" },
                ]}
                jsonLd={articleSchema}
            />

            <header className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 bg-[color:var(--z-nav-bg)] border-b border-[color:var(--z-border)]">
                <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-[color:var(--z-border)]" aria-label="Go back">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="var(--z-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <h1 className="text-[15px] font-normal text-[color:var(--z-ink)]">Privacy Policy</h1>
                </div>
            </header>

            <main className="mx-auto max-w-[720px] px-6 py-16">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 text-[color:var(--z-primary)]">Legal</p>
                    <h2 className="font-serif text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-4 text-[color:var(--z-ink)]">
                        Privacy Policy
                    </h2>
                    <p className="text-[17px] font-light leading-[1.6] text-[color:var(--z-ink-muted)]">
                        Your privacy is fundamental to how we build Zertainity. This policy explains, in plain language, what we collect, why we collect it, and the rights you have over your data.
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] mt-6 text-[color:var(--z-ink-muted)]">
                        Last Updated: {LAST_UPDATED_LABEL}
                    </p>
                </div>

                <div className="rounded-xl p-8 md:p-12 bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]">
                    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                        <h3>1. Who we are</h3>
                        <p>
                            Zertainity (“Zertainity”, “we”, “us”, or “our”) is a free career guidance platform built for students in India. This Privacy Policy applies to <strong>www.zertainity.in</strong> and any related services we operate. By using Zertainity, you confirm that you have read and understood this policy.
                        </p>

                        <h3>2. Information we collect</h3>
                        <p>We only collect what we need to give you accurate, personalised guidance.</p>
                        <ul>
                            <li><strong>Account information</strong> — your name, email address, and authentication credentials, managed by our backend provider Supabase.</li>
                            <li><strong>Academic profile</strong> — your education stage, board (CBSE/ICSE/State), grade, subjects, marks, and quiz/assessment responses.</li>
                            <li><strong>Career interests</strong> — streams, careers, exams, and colleges you save or explore.</li>
                            <li><strong>Device and usage data</strong> — browser type, operating system, anonymised IP-derived region, referrer, and pages visited. This is used in aggregate to improve the platform.</li>
                            <li><strong>Cookies and similar technologies</strong> — strictly necessary cookies for sign-in, plus analytics cookies (only where allowed by your browser settings).</li>
                        </ul>
                        <p>
                            <strong>Sensitive personal data:</strong> we do not knowingly collect financial, health, biometric, caste, religion, or political-belief data. Please don’t enter such information in free-text fields.
                        </p>

                        <h3>3. How we use your data</h3>
                        <ul>
                            <li>Generate personalised career, stream, exam, and college recommendations.</li>
                            <li>Save your assessment progress so you can continue across devices.</li>
                            <li>Maintain account security, prevent abuse, and detect fraudulent activity.</li>
                            <li>Improve our recommendation algorithms and content quality.</li>
                            <li>Communicate essential service updates, security alerts, and support replies.</li>
                            <li>Comply with applicable Indian laws including the Digital Personal Data Protection (DPDP) Act, 2023.</li>
                        </ul>
                        <p>
                            We never use your academic profile to send promotional content from third parties, and we never sell your data.
                        </p>

                        <h3>4. Legal basis for processing</h3>
                        <p>
                            We rely on your <strong>consent</strong> when you sign up and submit your assessment, on <strong>contractual necessity</strong> to operate the service you asked for, on <strong>legitimate interests</strong> for security and product improvement, and on <strong>legal obligations</strong> where required.
                        </p>

                        <h3>5. Data sharing &amp; third parties</h3>
                        <p>We share data only with vetted processors who help us run the service:</p>
                        <ul>
                            <li><strong>Supabase</strong> — database, authentication, and edge functions (data hosted in regions with strong privacy laws).</li>
                            <li><strong>Email providers</strong> — to send transactional and verification emails.</li>
                            <li><strong>Analytics providers</strong> — only aggregated, privacy-preserving usage metrics.</li>
                            <li><strong>Google AdSense</strong> — if ads are shown, Google may use cookies to serve them. You can opt out of personalised ads at <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">adssettings.google.com</a>.</li>
                        </ul>
                        <p>
                            We do <strong>not</strong> sell, rent, or trade your personal or academic data. We may disclose information if required by Indian law, a valid government request, or to protect users’ safety.
                        </p>

                        <h3>6. Data security</h3>
                        <p>
                            We use industry-standard safeguards: TLS encryption in transit, encrypted storage at rest, hashed credentials, Row Level Security in our database, and the principle of least privilege for staff access. Despite our best efforts, no system can be guaranteed fully secure — if you ever suspect a breach, please contact us immediately.
                        </p>

                        <h3>7. Data retention</h3>
                        <p>
                            We keep your account and assessment data while your account is active. You can delete your account at any time from <strong>Settings</strong> or by emailing <a href="mailto:privacy@zertainity.in">privacy@zertainity.in</a>; on deletion, we remove your personally identifiable information within 30 days, except where retention is required by law.
                        </p>

                        <h3>8. Your rights</h3>
                        <p>Under Indian DPDP and other applicable laws, you have the right to:</p>
                        <ul>
                            <li>Access the personal data we hold about you.</li>
                            <li>Correct or update inaccurate information.</li>
                            <li>Erase your data and close your account.</li>
                            <li>Withdraw consent for non-essential processing.</li>
                            <li>Object to processing or request restriction.</li>
                            <li>Lodge a complaint with the Data Protection Board of India.</li>
                        </ul>
                        <p>To exercise any of these rights, email <a href="mailto:privacy@zertainity.in">privacy@zertainity.in</a>. We respond within 30 days.</p>

                        <h3>9. Children’s privacy</h3>
                        <p>
                            Zertainity is designed for students aged 13 and above. If you are under 18, please use the platform with the involvement of a parent or guardian. If you believe a child under 13 has provided personal information without parental consent, contact us and we will delete it promptly.
                        </p>

                        <h3>10. International transfers</h3>
                        <p>
                            Your data may be processed on servers located outside India by our infrastructure providers. Wherever data is processed, we apply contractual and technical safeguards consistent with this policy and Indian law.
                        </p>

                        <h3>11. Changes to this policy</h3>
                        <p>
                            We’ll update this page when we change how we handle data. The “Last Updated” date at the top tells you the latest revision. For material changes, we’ll notify you in-app or by email before they take effect.
                        </p>

                        <h3>12. Contact us</h3>
                        <p>
                            For privacy questions or to exercise your rights, write to <strong><a href="mailto:privacy@zertainity.in">privacy@zertainity.in</a></strong> or use the <a href="/contact">Contact</a> page. Our grievance officer (per Indian IT Rules) can be reached at the same address.
                        </p>
                    </article>
                </div>
            </main>
        </div>
    );
}
