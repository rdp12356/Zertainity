


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
                        className="text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-6 text-[var(--z-ink)] font-serif"
                    >
                        Our Mission
                    </h2>
                    <p className="text-[17px] font-light leading-[1.6] max-w-[560px] mx-auto text-[var(--z-ink-muted)]">
                        We help students understand their options, compare career paths, and make confident decisions about the next step in education.
                    </p>
                </div>

                {/* Two cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-20">
                    <div className="rounded-xl p-8 transition-shadow duration-300 bg-[var(--z-canvas-soft)] border border-[var(--z-border)]">
                        <h3 className="text-[20px] font-normal tracking-[-0.2px] mb-4 text-[var(--z-ink)]">
                            The Problem We Solve
                        </h3>
                        <p className="text-[15px] font-light leading-[1.6] text-[var(--z-ink-muted)]">
                            Many students are asked to choose a stream or career path before they have enough practical context. Zertainity brings career guidance, exam details, and education pathways together in one place so the choice is easier to understand.
                        </p>
                    </div>

                    <div className="rounded-xl p-8 transition-shadow duration-300 bg-[var(--z-canvas-soft)] border border-[var(--z-border)]">
                        <h3 className="text-[20px] font-normal tracking-[-0.2px] mb-4 text-[var(--z-ink)]">
                            Our Vision
                        </h3>
                        <p className="text-[15px] font-light leading-[1.6] text-[var(--z-ink-muted)]">
                            Our goal is to make career planning feel clear and practical. We want students to get useful information quickly, without having to jump between multiple websites.
                        </p>
                    </div>
                </div>

                {/* Team section */}
                <div className="rounded-xl p-8 md:p-12 text-center bg-[var(--z-cream)] border border-[var(--z-cream-border)]">
                    <h3
                        className="text-[28px] font-light tracking-[-0.4px] mb-6 text-[var(--z-ink)] font-serif"
                    >
                        The Team
                    </h3>
                    <p className="text-[16px] font-light leading-[1.6] max-w-[480px] mx-auto mb-8 text-[var(--z-ink-secondary)]">
                        Zertainity was architected and developed by{" "}
                        <strong className="font-normal text-[var(--z-ink)]">Viney Ragesh & Johan Manoj</strong>.
                        We built the platform to make career and exam research easier for students who want a single place to start.
                    </p>
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-light bg-[var(--z-canvas)] border border-[var(--z-border)] text-[var(--z-ink-muted)]"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Platform Built & Maintained in 2026
                    </div>
                </div>
            </main>
        </div>
    );
}
