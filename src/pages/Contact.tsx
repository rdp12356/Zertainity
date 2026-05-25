



import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Mail } from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import { SEO } from "@/components/SEO";

export default function Contact() {
    const navigate = useNavigate();
    const setCurves = useSetCurves();
    useEffect(() => {
        setCurves([]);
        return () => setCurves([]);
    }, [setCurves]);

    return (
        <div className="min-h-screen pb-16 bg-[var(--z-canvas)]">
            <SEO
                title="Contact Zertainity"
                description="Have questions about the platform? Reach out to Zertainity's support team or browse frequently asked questions."
                canonical="/contact"
            />

            <header
                className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 bg-[var(--z-nav-bg)] border-b border-[var(--z-border)]"
            >
                <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--z-border)]"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="var(--z-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <h1 className="text-[15px] font-normal text-[var(--z-ink)]">Contact</h1>
                </div>
            </header>

            <main className="mx-auto max-w-[720px] px-6 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-4 text-[var(--z-ink)] font-serif">
                        Get in Touch
                    </h2>
                    <p className="text-[17px] font-light leading-[1.6] text-[var(--z-ink-muted)]">
                        Have questions about the site or running into a technical issue? Reach out and we'll help.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Email Card */}
                    <div className="rounded-xl p-8 text-center flex flex-col items-center bg-[var(--z-canvas-soft)] border border-[var(--z-border)]">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-[var(--z-canvas)] border border-[var(--z-border)]">
                            <Mail className="h-6 w-6 text-[var(--z-primary)]" />
                        </div>
                        <h3 className="text-[18px] font-normal mb-2 text-[var(--z-ink)]">Email Support</h3>
                        <p className="text-[14px] font-light mb-6 flex-grow text-[var(--z-ink-muted)]">
                            Send us an email with your questions or issues. Our support team typically responds within 24–48 hours.
                        </p>
                        <a
                            href="mailto:support@zertainity.in"
                            className="w-full text-center text-[15px] font-normal px-5 py-2.5 rounded-full transition-all duration-200 inline-block active:scale-[0.96] bg-[var(--z-primary)] text-[var(--z-primary-fg)]"
                        >
                            Email Us
                        </a>
                    </div>

                    {/* FAQ Card */}
                    <div className="rounded-xl p-8 bg-[var(--z-canvas-soft)] border border-[var(--z-border)]">
                        <h3 className="text-[18px] font-normal mb-5 text-[var(--z-ink)]">Frequently Asked Questions</h3>
                        <ul className="space-y-4 text-[14px]">
                            {[
                                { q: "How do I get my results?", a: "Complete the assessment to receive instant recommendations and a downloadable PDF report." },
                                { q: "Can I retake the assessment?", a: "Yes, retake it anytime. Your history is saved in your account." },
                                { q: "Is my data secure?", a: "Yes. We use encryption and don't share your data with third parties." },
                                { q: "Which boards are supported?", a: "CBSE, ICSE, and state board streams for Classes 9–12." },
                                { q: "Is Zertainity free?", a: "Yes, completely free to use." },
                            ].map((item) => (
                                <li key={item.q}>
                                    <strong className="font-normal block mb-0.5 text-[var(--z-ink)]">{item.q}</strong>
                                    <span className="font-light text-[var(--z-ink-muted)]">{item.a}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* About section */}
                <div className="rounded-xl p-8 bg-[var(--z-cream)] border border-[var(--z-cream-border)]">
                    <h3 className="text-[22px] font-light tracking-[-0.2px] mb-4 text-[var(--z-ink)] font-serif">About Zertainity</h3>
                    <p className="text-[15px] font-light leading-[1.6] mb-3 text-[var(--z-ink-secondary)]">
                        Zertainity is a free career guidance platform for Indian students. We help Class 9–12 and college-bound students understand their academic strengths, explore 150+ career options, and make informed decisions about streams and exams.
                    </p>
                    <p className="text-[15px] font-light leading-[1.6] text-[var(--z-ink-secondary)]">
                        Our assessment engine matches your marks, subjects, and interests with personalised career pathways, exam tracks, and education options.
                    </p>
                </div>
            </main>
        </div>
    );
}
