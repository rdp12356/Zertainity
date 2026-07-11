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
        <div className="min-h-screen pb-16 bg-black text-white selection:bg-neutral-800 relative overflow-hidden font-sans">
            <SEO
                title="About Zertainity"
                description="Learn how Zertainity maps subjects, exams, and career pathways for Indian students — built by students, for students."
                canonical="/about"
            />

            {/* Ambient background glows */}
            <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header
                className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
            >
                <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        aria-label="Go back"
                        className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    <h1 className="text-sm font-medium text-white/90">About</h1>
                </div>
            </header>

            <main className="mx-auto max-w-[720px] px-6 py-16 relative z-10">
                {/* Hero */}
                <div className="text-center mb-20">
                    <h2
                        className="text-[36px] sm:text-[48px] font-light tracking-[-1px] leading-[1.1] mb-6 text-white"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                        Our Mission
                    </h2>
                    <p className="text-[17px] font-light leading-[1.6] max-w-[560px] mx-auto text-white/70">
                        We help students understand their options, compare career paths, and make confident decisions about the next step in education.
                    </p>
                </div>

                {/* Two cards */}
                <div className="grid md:grid-cols-2 gap-6 mb-20">
                    <div className="liquid-glass p-8 rounded-xl border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md hover:border-white/20 transition-all duration-300">
                        <h3 className="text-[20px] font-semibold tracking-[-0.2px] mb-4 text-white">
                            The Problem We Solve
                        </h3>
                        <p className="text-[15px] font-light leading-[1.6] text-white/70">
                            Many students are asked to choose a stream or career path before they have enough practical context. Zertainity brings career guidance, exam details, and education pathways together in one place so the choice is easier to understand.
                        </p>
                    </div>

                    <div className="liquid-glass p-8 rounded-xl border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md hover:border-white/20 transition-all duration-300">
                        <h3 className="text-[20px] font-semibold tracking-[-0.2px] mb-4 text-white">
                            Our Vision
                        </h3>
                        <p className="text-[15px] font-light leading-[1.6] text-white/70">
                            Our goal is to make career planning feel clear and practical. We want students to get useful information quickly, without having to jump between multiple websites.
                        </p>
                    </div>
                </div>

                {/* Team section */}
                <div className="liquid-glass relative overflow-hidden p-8 md:p-12 text-center rounded-xl border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-md">
                    {/* Inner gold glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent" />
                    
                    <h3
                        className="text-[28px] font-normal tracking-[-0.4px] mb-6 text-white"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                        The Team
                    </h3>
                    <p className="text-[16px] font-light leading-[1.6] max-w-[480px] mx-auto mb-8 text-white/80">
                        Zertainity was architected and developed by{" "}
                        <strong className="font-semibold text-amber-300">Viney Ragesh & Johan Manoj</strong>.
                        We built the platform to make career and exam research easier for students who want a single place to start.
                    </p>
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-light bg-white/5 border border-white/10 text-white/60"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Platform Built & Maintained in 2026
                    </div>
                </div>
            </main>
        </div>
    );
}
