


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
                <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:font-normal prose-headings:text-[color:var(--z-ink)] prose-p:text-[15px] prose-p:font-light prose-p:leading-[1.7] prose-p:text-[color:var(--z-ink-secondary)] mb-20">
                    <p>
                        The transition from secondary to higher secondary education in India is a critical juncture. The decisions made here—whether to pursue Science (PCM/PCB), Commerce, or Humanities—dictate the trajectory of a student's entire professional life. Unfortunately, these decisions are often driven by peer pressure, societal expectations, or a lack of verified information rather than a student's innate aptitude and genuine interests.
                    </p>
                    
                    <h3>The Problem With Traditional Guidance</h3>
                    <p>
                        Historically, career counseling has been subjective, relying heavily on anecdotal advice or standardized tests that fail to capture a student's full potential. The Indian educational landscape is vast, encompassing numerous boards (CBSE, ICSE, State Boards), hundreds of specialized entrance examinations (JEE, NEET, CLAT, CUET, CA Foundation), and thousands of colleges. Navigating this labyrinth without a data-driven compass often leads to misalignment, where students find themselves in streams or careers they are ill-suited for, leading to burnout and dissatisfaction.
                    </p>

                    <h3>The Zertainity Approach</h3>
                    <p>
                        Zertainity was engineered to solve this precise problem. We bridge the gap between ambition and reality by providing a comprehensive, objective, and deeply personalized career guidance platform. Our methodology is rooted in three core pillars:
                    </p>
                    <ul>
                        <li><strong>Cognitive and Psychometric Profiling:</strong> We don't just look at grades. Our proprietary assessment engine evaluates critical thinking, logical reasoning, verbal ability, and intrinsic personality traits to build a holistic profile of the student.</li>
                        <li><strong>Academic Trajectory Mapping:</strong> By analyzing past academic performance and combining it with cognitive data, we identify the academic streams where a student is statistically most likely to thrive.</li>
                        <li><strong>Actionable Roadmaps:</strong> A recommendation is useless without a plan. For every suggested career path, Zertainity provides a verified roadmap detailing the required high school subjects, the necessary entrance examinations, and the cutoff thresholds for top-tier institutions across India.</li>
                    </ul>

                    <h3>Empowering the Next Generation</h3>
                    <p>
                        We believe that every student deserves access to premium, unbiased career guidance. By democratizing this information, we empower students to take ownership of their futures. Whether a student is aiming for the IITs, aspiring to be a Chartered Accountant, or looking to break into the Civil Services, Zertainity provides the clarity and direction needed to turn those aspirations into reality.
                    </p>
                </div>

                {/* Team section */}
                <div className="rounded-xl p-8 md:p-12 text-center bg-[color:var(--z-cream)] border border-[color:var(--z-cream-border)]">
                    <h3
                        className="text-[28px] font-light tracking-[-0.4px] mb-6 text-[color:var(--z-ink)] font-serif"
                    >
                        The Architects
                    </h3>
                    <p className="text-[16px] font-light leading-[1.6] max-w-[480px] mx-auto mb-8 text-[color:var(--z-ink-secondary)]">
                        Zertainity was conceptualized, designed, and developed by{" "}
                        <strong className="font-normal text-[color:var(--z-ink)]">Viney Ragesh & Johan Manoj</strong>.
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
