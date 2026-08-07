


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
                        <h3>1. Introduction and Scope</h3>
                        <p>
                            Welcome to Zertainity (“Zertainity”, “we”, “us”, or “our”). We operate a comprehensive, data-driven career guidance and educational platform designed primarily for students in India. This Privacy Policy applies to the website located at <strong>www.zertainity.in</strong> and any associated mobile applications, APIs, or services we operate (collectively, the “Platform”).
                        </p>
                        <p>
                            We understand that by using our Platform, you are trusting us with highly personal information regarding your academic performance, cognitive abilities, and future aspirations. This policy is written to explicitly clarify our data practices in plain language: exactly what we collect, why it is necessary, how it is safeguarded, and the rights you possess over your data under applicable Indian laws, including the Digital Personal Data Protection (DPDP) Act.
                        </p>

                        <h3>2. Data We Collect and Process</h3>
                        <p>To provide you with verified, personalized career and academic roadmaps, we must collect and process specific categories of data. We adhere strictly to the principle of data minimization—collecting only what is strictly necessary for the functioning of the Platform.</p>
                        <ul>
                            <li><strong>Account Credentials:</strong> When you register, we collect your name, email address, and securely hashed passwords. This data is managed through our secure authentication provider, Supabase.</li>
                            <li><strong>Academic and Educational Profile:</strong> We collect your current educational stage, your affiliated board (e.g., CBSE, ICSE, State Boards), your grade level, specific subjects studied, historical academic marks, and any relevant extracurricular achievements you choose to share.</li>
                            <li><strong>Psychometric and Cognitive Data:</strong> If you participate in our assessment modules, we collect your responses to evaluate logical reasoning, verbal ability, critical thinking, and personality traits. This data forms the core of our recommendation engine.</li>
                            <li><strong>Behavioral and Platform Usage Data:</strong> We monitor how you interact with the Platform, including the career paths you explore, the colleges you save, and the entrance exams you track. We also automatically collect device-specific information (such as browser type, operating system version), anonymized IP addresses to determine general geographic regions, and timestamps of your visits.</li>
                            <li><strong>Cookies and Tracking Technologies:</strong> We utilize first-party cookies essential for maintaining your active session (authentication). With your consent, we also deploy analytics cookies to understand traffic patterns and third-party cookies related to advertising (detailed in Section 5).</li>
                        </ul>
                        <p>
                            <strong>A Note on Sensitive Personal Data:</strong> Zertainity does not require, nor do we knowingly collect, highly sensitive personal data such as financial information (credit card numbers), biometric data, medical or health records, caste or religious affiliations, or political beliefs. We urge you not to enter such information in any open text fields on the Platform.
                        </p>

                        <h3>3. Purpose of Data Processing</h3>
                        <p>The data we collect is exclusively used to fulfill our core mission of providing superior career guidance and maintaining a secure, performant platform. Specifically, we use your data to:</p>
                        <ul>
                            <li><strong>Generate Personalized Recommendations:</strong> Your academic and cognitive data is processed by our algorithms to identify optimal academic streams, suggest tailored career paths, and outline necessary entrance examinations.</li>
                            <li><strong>Ensure Continuous User Experience:</strong> We save your assessment progress and platform preferences so you can seamlessly resume your session across different devices.</li>
                            <li><strong>Maintain Platform Security and Integrity:</strong> Usage data helps us detect anomalous behavior, prevent fraudulent account creation, mitigate automated bot attacks, and ensure the overall stability of our infrastructure.</li>
                            <li><strong>Service Improvement and Analytics:</strong> Aggregated, anonymized data is analyzed to identify trends in student interests, which helps us decide which careers or exams to add to our database next.</li>
                            <li><strong>Legal Compliance:</strong> We process data as necessary to comply with binding legal obligations, respond to lawful government requests, and enforce our Terms of Service.</li>
                        </ul>

                        <h3>4. Legal Basis for Processing</h3>
                        <p>
                            Our processing of your personal data is grounded in specific legal bases: <strong>Consent</strong> (when you explicitly agree to our terms and take our assessments), <strong>Contractual Necessity</strong> (to deliver the core features of the Zertainity platform you registered for), <strong>Legitimate Interests</strong> (to secure our platform, prevent fraud, and conduct statistical analysis for product improvement without overriding your fundamental rights), and <strong>Legal Obligations</strong> (where mandated by Indian law).
                        </p>

                        <h3>5. Third-Party Data Sharing and Advertising</h3>
                        <p>Zertainity operates a secure ecosystem. We do not sell, rent, or indiscriminately trade your personal or academic data to marketing agencies, data brokers, or educational institutions without your explicit, opt-in consent. We only share data with essential infrastructure partners under strict confidentiality agreements:</p>
                        <ul>
                            <li><strong>Supabase:</strong> Our primary database and authentication provider. Your data is stored securely in their managed cloud infrastructure, utilizing Row Level Security (RLS) to ensure data isolation.</li>
                            <li><strong>Communication Services:</strong> We use secure third-party email providers solely to deliver transactional emails, such as password resets and account verification links.</li>
                            <li><strong>Google AdSense and Advertising:</strong> To keep Zertainity free for students, we may display advertisements via Google AdSense. Google utilizes cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to our Platform or other websites. You can opt out of personalized advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">Ad Settings</a> or the <a href="https://aboutads.info" target="_blank" rel="noreferrer">aboutads.info</a> portal.</li>
                            <li><strong>Analytics Providers:</strong> We use tools that process anonymized traffic metrics to help us understand platform usage at a macro level.</li>
                        </ul>

                        <h3>6. Security Protocols and Data Protection</h3>
                        <p>
                            Safeguarding your data is our paramount concern. Zertainity implements robust, industry-standard security measures. All data transmitted between your device and our servers is encrypted using Transport Layer Security (TLS/HTTPS). Data at rest within our databases is encrypted. User passwords are not stored in plaintext; they are securely hashed using modern cryptographic algorithms. Furthermore, our database employs Row Level Security (RLS), meaning the database itself enforces rules preventing one user from accessing another user's private data. Despite these rigorous measures, no digital platform is entirely immune to sophisticated threats. If you suspect any unauthorized access to your account, you must notify us immediately.
                        </p>

                        <h3>7. Data Retention and Deletion Policies</h3>
                        <p>
                            We retain your personal data only for as long as your Zertainity account remains active, or as necessary to fulfill the purposes outlined in this policy. If you choose to delete your account—which you can do at any time via your account settings or by emailing our support team—we will initiate the deletion of your personally identifiable information from our active databases within 30 days. Please note that certain anonymized, aggregated data that cannot be linked back to you may be retained indefinitely for statistical modeling. We may also retain specific data if legally required to do so for compliance or audit purposes.
                        </p>

                        <h3>8. Your Statutory Rights</h3>
                        <p>Under applicable data protection laws in India, you are endowed with specific rights regarding your personal data:</p>
                        <ul>
                            <li><strong>Right to Access:</strong> You can request a summary of the personal data we hold about you.</li>
                            <li><strong>Right to Rectification:</strong> You can correct or update any inaccurate or incomplete information in your profile.</li>
                            <li><strong>Right to Erasure:</strong> You can request the permanent deletion of your account and associated data.</li>
                            <li><strong>Right to Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time (though this may limit your ability to use certain features).</li>
                            <li><strong>Right to Grievance Redressal:</strong> You have the right to lodge a complaint regarding data processing with our designated Grievance Officer, or subsequently with the relevant Data Protection Board in India.</li>
                        </ul>
                        <p>To exercise these rights, please contact us at <a href="mailto:privacy@zertainity.in">privacy@zertainity.in</a>. We are committed to responding to all legitimate requests within 30 days.</p>

                        <h3>9. Protection of Minors</h3>
                        <p>
                            Zertainity is an educational platform intended for students aged 13 and above. We strongly encourage students under the age of 18 to utilize the platform with the guidance and involvement of a parent, legal guardian, or educator. We do not intentionally collect personal data from children under the age of 13. If you are a parent or guardian and believe your child under 13 has provided us with personal information without your consent, please contact us immediately, and we will take swift action to expunge that data from our systems.
                        </p>

                        <h3>10. Cross-Border Data Transfers</h3>
                        <p>
                            While our primary focus is Indian students, the digital infrastructure powering Zertainity (such as cloud servers and database providers) may be located outside the physical borders of India. When your data is transferred internationally, we ensure it is protected by contractual clauses and technical safeguards that mandate a level of data protection equivalent to that required by Indian law.
                        </p>

                        <h3>11. Modifications to this Privacy Policy</h3>
                        <p>
                            The digital landscape and legal regulations evolve rapidly. As such, we may update this Privacy Policy periodically to reflect changes in our practices or legal obligations. The "Last Updated" date at the top of this document indicates when revisions were last made. For any material changes that significantly alter how we process your data, we will provide prominent notice—such as an email notification or a visible alert on the Platform—prior to the changes taking effect. Your continued use of Zertainity after such updates constitutes your acknowledgment of the revised policy.
                        </p>

                        <h3>12. Contact Information and Grievance Officer</h3>
                        <p>
                            We welcome your questions, concerns, and feedback regarding this Privacy Policy. If you wish to exercise your data rights or report a privacy issue, please contact us at:
                        </p>
                        <p>
                            <strong>Email:</strong> <a href="mailto:privacy@zertainity.in">privacy@zertainity.in</a><br />
                            <strong>Web Form:</strong> Access our <a href="/contact">Contact Page</a>
                        </p>
                        <p>
                            In accordance with the Information Technology Act, 2000 and the rules made thereunder, any grievances can be directed to the email address above, which acts as the contact point for our designated Grievance Officer. We will address your concerns in a timely and legally compliant manner.
                        </p>
                    </article>
                </div>
            </main>
        </div>
    );
}
