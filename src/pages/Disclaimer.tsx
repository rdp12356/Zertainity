



import { useNavigate } from "react-router-dom";

import { AlertTriangle } from "lucide-react";

import { SEO } from "@/components/SEO";

const LAST_UPDATED_ISO = "2026-05-20";
const LAST_UPDATED_LABEL = "20 May 2026";

export default function Disclaimer() {
    const navigate = useNavigate();

    const disclaimerSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Zertainity Disclaimer",
        url: "https://www.zertainity.in/disclaimer",
        description:
            "Limits of Zertainity's career guidance: an educational tool, not a substitute for professional counselling.",
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
                title="Disclaimer"
                description="Zertainity is an educational career-guidance tool, not a substitute for certified counsellors. Read about how to use our recommendations responsibly."
                canonical="/disclaimer"
                keywords="Zertainity disclaimer, career guidance limits, education tool disclaimer, career counselling disclaimer India"
                publishedTime="2026-05-01"
                modifiedTime={LAST_UPDATED_ISO}
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: "Disclaimer", path: "/disclaimer" },
                ]}
                jsonLd={disclaimerSchema}
            />

            <header className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 bg-[color:var(--z-nav-bg)] border-b border-[color:var(--z-border)]">
                <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-[color:var(--z-border)]" aria-label="Go back">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="var(--z-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <h1 className="text-[15px] font-normal text-[color:var(--z-ink)]">Disclaimer</h1>
                </div>
            </header>

            <main className="mx-auto max-w-[720px] px-6 py-16">
                <div className="text-center mb-16">
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 text-[color:var(--z-primary)]">Important</p>
                    <h2 className="font-serif text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-4 text-[color:var(--z-ink)]">
                        Career Guidance Disclaimer
                    </h2>
                    <p className="text-[17px] font-light leading-[1.6] text-[color:var(--z-ink-muted)]">
                        Understand what Zertainity can and cannot do, so you can use our guidance with confidence.
                    </p>
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] mt-6 text-[color:var(--z-ink-muted)]">
                        Last Updated: {LAST_UPDATED_LABEL}
                    </p>
                </div>

                <div className="rounded-xl p-8 md:p-12 relative overflow-hidden bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[color:var(--z-cream-text)]"></div>

                    <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
                        <h3 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mt-0">
                            <AlertTriangle className="h-6 w-6" />
                            Educational guidance, not professional advice
                        </h3>
                        <p className="lead">
                            Zertainity is a free, evidence-based platform that helps Indian students explore streams, exams, careers, and colleges. The recommendations you see are <strong>educational suggestions, not professional or psychological advice</strong>.
                        </p>
                        <p>
                            Zertainity is not a substitute for a certified career counsellor, academic advisor, psychologist, mentor, parent, or teacher. Before making any major decision — picking a stream, sitting an exam, applying to a college, or accepting a course — please discuss it with the people who know you best and, where helpful, with a qualified counsellor.
                        </p>

                        <h3>How recommendations are generated</h3>
                        <p>
                            Our recommendations combine the inputs you give us (board, grade, subjects, marks, interests) with our curated catalogue of careers, exams, and pathways. Match scores reflect alignment patterns; they don’t certify that you will succeed in a particular field. We continuously update our content but cannot promise it always reflects the latest syllabus or admission policy.
                        </p>

                        <h3>Where guidance can fall short</h3>
                        <ul>
                            <li><strong>Outdated criteria.</strong> Exam patterns, syllabi, and admission rules change. Always verify the latest from the official body (NTA, CBSE, NMC, etc.).</li>
                            <li><strong>Local nuance.</strong> State-specific quotas, regional colleges, and family circumstances may not be reflected in a generic recommendation.</li>
                            <li><strong>Niche or emerging careers.</strong> Some fields evolve faster than catalogues can keep up.</li>
                            <li><strong>Personal context.</strong> Health, finances, family responsibilities, and personal constraints are best discussed with a counsellor.</li>
                        </ul>

                        <h3>The evolving job market</h3>
                        <p>
                            Careers — especially in technology, design, healthcare, and the sciences — are changing rapidly. Roles popular today may look very different in 5–10 years. Treat any career recommendation as a direction to investigate, not a destination to lock in.
                        </p>

                        <h3>External links and third-party content</h3>
                        <p>
                            We may link to colleges, exam bodies, articles, or videos to help you explore further. We don’t control these sites and aren’t responsible for their accuracy, terms, or privacy practices.
                        </p>

                        <h3>Your responsibility</h3>
                        <p>
                            By using Zertainity, you accept that any decision you make based on our recommendations is your own. Zertainity, its founders, and contributors are not liable for outcomes such as exam results, admission decisions, employment outcomes, or financial losses arising from your use of the platform. See our <a href="/terms-of-service">Terms of Service</a> for more.
                        </p>

                        <h3>Medical, legal, and financial questions</h3>
                        <p>
                            Zertainity does not provide medical, legal, financial, or psychological advice. If you’re going through stress, anxiety, or any mental-health concern related to your career choice, please reach out to a qualified professional or a helpline such as <strong>iCall (9152987821)</strong> or <strong>Vandrevala Foundation (1860-2662-345)</strong>.
                        </p>

                        <div className="mt-12 p-6 bg-[color:var(--z-canvas)] rounded-lg text-center border border-[color:var(--z-border)]">
                            <p className="m-0 font-medium text-[color:var(--z-ink)]">
                                Use Zertainity as a <em>compass</em>, not a destination. Let our recommendations point you in promising directions — then chart your course with research, conversation, and a counsellor you trust.
                            </p>
                        </div>

                        <h3>Contact</h3>
                        <p>
                            Concerns about a specific recommendation or content error? Email <strong><a href="mailto:support@zertainity.in">support@zertainity.in</a></strong> and we’ll review it.
                        </p>
                    </article>
                </div>
            </main>
        </div>
    );
}
