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
        <div className="min-h-screen pb-16 bg-black text-white selection:bg-neutral-800 relative overflow-hidden font-sans">
            <SEO
                title="Contact Zertainity"
                description="Have questions about the platform? Reach out to Zertainity's support team or browse frequently asked questions."
                canonical="/contact"
            />

            {/* Ambient background glows */}
            <div className="absolute top-[-10%] right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

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
                    <h1 className="text-sm font-medium text-white/90">Contact</h1>
                </div>
            </header>

            <main className="mx-auto max-w-[720px] px-6 py-16 relative z-10">
                <div className="text-center mb-16">
                    <h2 
                        className="text-[36px] sm:text-[48px] font-light tracking-[-1px] leading-[1.1] mb-4 text-white"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                        Get in Touch
                    </h2>
                    <p className="text-[17px] font-light leading-[1.6] text-white/70">
                        Have questions about the site or running into a technical issue? Reach out and we'll help.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-12">
                    {/* Email Card */}
                    <div className="liquid-glass rounded-xl p-8 text-center flex flex-col items-center border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md hover:border-white/20 transition-all duration-300">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 bg-white/5 border border-white/10 text-amber-400">
                            <Mail className="h-6 w-6" />
                        </div>
                        <h3 className="text-[18px] font-semibold mb-2 text-white">Email Support</h3>
                        <p className="text-[14px] font-light mb-6 flex-grow text-white/70">
                            Send us an email with your questions or issues. Our support team typically responds within 24–48 hours.
                        </p>
                        <a
                            href="mailto:support@zertainity.in"
                            className="liquid-glass w-full text-center text-[15px] font-medium px-5 py-2.5 rounded-full transition-all duration-200 inline-block active:scale-[0.96] text-white border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 hover:shadow-premium-sm"
                        >
                            Email Us
                        </a>
                    </div>

                    {/* FAQ Card */}
                    <div className="liquid-glass rounded-xl p-8 border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md hover:border-white/20 transition-all duration-300">
                        <h3 className="text-[18px] font-semibold mb-5 text-white">Frequently Asked Questions</h3>
                        <ul className="space-y-4 text-[14px]">
                            {[
                                { q: "How do I get my results?", a: "Complete the assessment to receive instant recommendations and a downloadable PDF report." },
                                { q: "Can I retake the assessment?", a: "Yes, retake it anytime. Your history is saved in your account." },
                                { q: "Is my data secure?", a: "Yes. We use encryption and don't share your data with third parties." },
                                { q: "Which boards are supported?", a: "CBSE, ICSE, and state board streams for Classes 9–12." },
                                { q: "Is Zertainity free?", a: "Yes, completely free to use." },
                            ].map((item) => (
                                <li key={item.q}>
                                    <strong className="font-semibold block mb-0.5 text-white">{item.q}</strong>
                                    <span className="font-light text-white/70">{item.a}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* About section */}
                <div className="liquid-glass relative overflow-hidden p-8 rounded-xl border border-white/10 bg-white/[0.02] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] backdrop-blur-md">
                    {/* Inner gold glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#DAA520]/50 to-transparent" />
                    
                    <h3 
                        className="text-[22px] font-normal tracking-[-0.2px] mb-4 text-white"
                        style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                        About Zertainity
                    </h3>
                    <p className="text-[15px] font-light leading-[1.6] mb-3 text-white/80">
                        Zertainity is a free career guidance platform for Indian students. We help Class 9–12 and college-bound students understand their academic strengths, explore 150+ career options, and make informed decisions about streams and exams.
                    </p>
                    <p className="text-[15px] font-light leading-[1.6] text-white/80">
                        Our assessment engine matches your marks, subjects, and interests with personalised career pathways, exam tracks, and education options.
                    </p>
                </div>
            </main>
        </div>
    );
}
