


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSetCurves } from "@/components/CurvesContext";
import { SEO } from "@/components/SEO";

export default function About() {
    const navigate = useNavigate();
    const setCurves = useSetCurves();
    useEffect(() => {
        setCurves([]);
        return () => setCurves([]);
    }, [setCurves]);

    return (
        <div className="min-h-screen pb-16 bg-[var(--z-canvas)]">
            <SEO
                title="About Zertainity"
                description="Learn how Zertainity maps subjects, exams, and career pathways for Indian students — built by students, for students."
                canonical="/about"
            />

            {/* Header */}
            <header
                className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 bg-[var(--z-nav-bg)] border-b border-[var(--z-border)]"
            >
                <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200 border border-[var(--z-border)]"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 3L5 8l5 5" stroke="var(--z-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 className="text-[15px] font-normal text-[var(--z-ink)]">About</h1>
                </div>
            </header>

            <main className="mx-auto max-w-[720px] px-6 py-16">
                {/* Hero */}
                <div className="text-center mb-20">
                    <h2
                        className="text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-6 text-[color:var(--z-ink)] font-serif"
                    >
                        Our Mission & Methodology
                    </h2>
                    <p className="text-[17px] font-light leading-[1.6] max-w-[600px] mx-auto text-[color:var(--z-ink-muted)]">
                        Zertainity exists to eliminate the guesswork from career planning. We leverage data, academic performance metrics, and cognitive assessments to chart clear, actionable pathways for Indian students.
                    </p>
                </div>

                {/* Main Content Body */}
                <div className="space-y-10 mb-20">
                    {/* Why we exist */}
                    <section>
                        <h3 className="text-[13px] font-medium uppercase tracking-[0.12em] mb-4 text-[color:var(--z-primary)]">Why we exist</h3>
                        <p className="text-[15px] font-light leading-[1.7] text-[color:var(--z-ink-secondary)] mb-4">
                            Class 10–12 decisions — Science (PCM/PCB), Commerce, or Humanities — shape an entire professional life. Yet they're usually driven by peer pressure or hearsay rather than aptitude.
                        </p>
                        <ul className="space-y-2.5">
                            {[
                                { lead: "Traditional counselling is subjective", text: "anecdotal advice and one-size-fits-all tests miss the full picture." },
                                { lead: "The landscape is enormous", text: "multiple boards, hundreds of exams (JEE, NEET, CLAT, CUET…), thousands of colleges." },
                                { lead: "Misalignment is expensive", text: "students land in streams that don't fit — leading to burnout and dissatisfaction." },
                            ].map((b) => (
                                <li key={b.lead} className="flex items-start gap-3 text-[14px] leading-[1.6]">
                                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--z-primary)]/50" aria-hidden />
                                    <span className="font-light text-[color:var(--z-ink-secondary)]">
                                        <strong className="font-medium text-[color:var(--z-ink)]">{b.lead}</strong> — {b.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Our approach */}
                    <section>
                        <h3 className="text-[13px] font-medium uppercase tracking-[0.12em] mb-4 text-[color:var(--z-primary)]">The Zertainity approach</h3>
                        <p className="text-[15px] font-light leading-[1.7] text-[color:var(--z-ink-secondary)] mb-5">
                            Objective, personalized guidance built on three pillars:
                        </p>
                        <div className="grid sm:grid-cols-3 gap-3">
                            {[
                                {
                                    n: "01",
                                    t: "Psychometric Profiling",
                                    d: "Critical thinking, logical reasoning, verbal ability, and personality traits — not just grades.",
                                },
                                {
                                    n: "02",
                                    t: "Trajectory Mapping",
                                    d: "Past performance + cognitive data → the streams you're statistically most likely to thrive in.",
                                },
                                {
                                    n: "03",
                                    t: "Actionable Roadmaps",
                                    d: "Required subjects, entrance exams, and cutoff benchmarks for top institutions.",
                                },
                            ].map((p) => (
                                <div key={p.n} className="rounded-xl p-5 bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]">
                                    <span className="font-mono text-[11px] font-semibold text-[color:var(--z-primary)]">{p.n}</span>
                                    <h4 className="text-[15px] font-semibold tracking-tight mt-2 mb-2 text-[color:var(--z-ink)]">{p.t}</h4>
                                    <p className="text-[13px] font-light leading-[1.6] text-[color:var(--z-ink-secondary)]">{p.d}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Transparency links */}
                    <section className="rounded-xl p-6 bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]">
                        <h3 className="text-[13px] font-medium uppercase tracking-[0.12em] mb-3 text-[color:var(--z-ink-muted)]">Full transparency</h3>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <a href="/methodology" className="group flex items-center justify-between gap-3 rounded-lg px-4 py-3 bg-[color:var(--z-canvas)] border border-[color:var(--z-border)] transition-colors hover:border-[color:var(--z-primary)]/40">
                                <span className="text-[13.5px] font-normal text-[color:var(--z-ink)]">Analysis Engine Methodology</span>
                                <span aria-hidden className="text-[color:var(--z-primary)]">→</span>
                            </a>
                            <a href="/compare" className="group flex items-center justify-between gap-3 rounded-lg px-4 py-3 bg-[color:var(--z-canvas)] border border-[color:var(--z-border)] transition-colors hover:border-[color:var(--z-primary)]/40">
                                <span className="text-[13.5px] font-normal text-[color:var(--z-ink)]">Degree Comparison Tool</span>
                                <span aria-hidden className="text-[color:var(--z-primary)]">→</span>
                            </a>
                        </div>
                    </section>

                    {/* Empowerment */}
                    <section>
                        <h3 className="text-[13px] font-medium uppercase tracking-[0.12em] mb-4 text-[color:var(--z-primary)]">Empowering the next generation</h3>
                        <p className="text-[15px] font-light leading-[1.7] text-[color:var(--z-ink-secondary)]">
                            Every student deserves premium, unbiased career guidance. Whether the goal is an IIT, a CA designation, or the Civil Services, Zertainity turns aspirations into a clear, researchable direction — so students can own their futures.
                        </p>
                    </section>
                </div>

                {/* Team section */}
                <div className="rounded-xl p-8 md:p-12 text-center bg-[color:var(--z-cream)] border border-[color:var(--z-cream-border)]">
                    <h3
                        className="text-[28px] font-light tracking-[-0.4px] mb-6 text-[color:var(--z-ink)] font-serif"
                    >
                        The Architects
                    </h3>
                    <p className="text-[16px] font-light leading-[1.6] max-w-[480px] mx-auto mb-8 text-[color:var(--z-ink-secondary)]">
                        Zertainity was co-founded and built by{" "}
                        <strong className="font-normal text-[color:var(--z-ink)]">Johan Manoj</strong> and{" "}
                        <strong className="font-normal text-[color:var(--z-ink)]">Viney Ragesh</strong>.
                        Built with a deep understanding of the challenges faced by Indian students, the platform represents a leap forward in educational technology.
                    </p>
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-light bg-[color:var(--z-canvas)] border border-[color:var(--z-border)] text-[color:var(--z-ink-muted)]"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Platform Built & Maintained in 2026
                    </div>
                </div>
            </main>
        </div>
    );
}
