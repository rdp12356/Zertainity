
/* ─── Framer Motion spring configs ─── */



import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";

const smoothSpring = { type: "tween", duration: 0.4, ease: "easeOut" };
const gentleSpring = { type: "tween", duration: 0.5, ease: "easeOut" };

/* ─── Scroll-reveal wrapper ─── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ ...smoothSpring, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const meshY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([]);
    return () => setCurves([]);
  }, [setCurves]);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[color:var(--z-canvas)] text-[color:var(--z-ink)]">
      <SEO
        title="Zertainity — Academic Mapping & Career Guidance"
        description="A structured, evidence-based career mapping platform for Indian students. Map subjects and interests to verified exam and college tracks."
        canonical="/"
      />

      {/* ━━━ NAVIGATION ━━━ */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...smoothSpring, delay: 0.1 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled || mobileMenuOpen
            ? "bg-[color:var(--z-nav-bg)] border-[color:var(--z-nav-border)] backdrop-blur-xl py-3"
            : "bg-transparent border-transparent py-5"
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-6 flex items-center justify-between">
          <div
            onClick={() => {
              setMobileMenuOpen(false);
              navigate("/");
            }}
            className="cursor-pointer text-sm font-semibold tracking-[0.15em] uppercase select-none text-[color:var(--z-ink)] z-50 relative"
          >
            Zertainity
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {[
              { label: "Assessment", path: "/education-level" },
              { label: "Careers", path: "/careers" },
              { label: "Methodology", path: "/about" },
              { label: "Contact", path: "/contact" },
            ].map((item) => (
              <span
                key={item.path}
                onClick={() => navigate(item.path)}
                className="z-nav-link text-[15px] font-light cursor-pointer"
              >
                {item.label}
              </span>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated ? (
              <span
                onClick={() => navigate("/dashboard")}
                className="z-nav-link text-[15px] font-light cursor-pointer"
              >
                Dashboard
              </span>
            ) : (
              <span
                onClick={() => navigate("/auth")}
                className="z-nav-link text-[15px] font-light cursor-pointer"
              >
                Sign in
              </span>
            )}
            <button
              onClick={() => navigate("/education-level")}
              className="z-header-cta text-sm font-normal px-4 py-2 rounded-full transition-all duration-200 active:scale-[0.96]"
            >
              Start Assessment
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2 rounded-lg text-[color:var(--z-ink)] hover:bg-[color:var(--z-border)]/20 transition-colors z-50 relative"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 pt-24 pb-8 px-6 bg-[color:var(--z-canvas)]/98 backdrop-blur-lg flex flex-col justify-between"
          >
            <div className="flex flex-col gap-6 mt-8">
              {[
                { label: "Assessment", path: "/education-level" },
                { label: "Careers", path: "/careers" },
                { label: "Methodology", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((item, idx) => (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={item.path}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(item.path);
                  }}
                  className="text-2xl font-light text-[color:var(--z-ink)] cursor-pointer py-2 border-b border-[color:var(--z-border)]/30"
                >
                  {item.label}
                </motion.span>
              ))}
            </div>

            <div className="flex flex-col gap-4 mt-auto">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard");
                  }}
                  className="w-full text-center py-3 text-[16px] font-light text-[color:var(--z-ink)] border border-[color:var(--z-border)] rounded-full"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/auth");
                  }}
                  className="w-full text-center py-3 text-[16px] font-light text-[color:var(--z-ink)] border border-[color:var(--z-border)] rounded-full"
                >
                  Sign in
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/education-level");
                }}
                className="w-full text-center py-3 text-[16px] font-medium bg-[color:var(--z-primary)] text-[color:var(--z-primary-fg)] rounded-full shadow-lg"
              >
                Start Assessment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ━━━ HERO with Gradient Mesh ━━━ */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-hero-mesh"
          style={{ y: meshY }}
        />
        {/* Cyber grid overlay */}
        <div className="absolute inset-0 cyber-grid-mesh opacity-[0.05] dark:opacity-[0.12] pointer-events-none" />

        {/* Animated floating orb for dark mode depth */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-hero-orb"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        <div
          className="relative z-10 text-center max-w-[820px] mx-auto px-6 pt-24"
        >
          <h1 className="font-serif text-[42px] sm:text-[52px] lg:text-[60px] font-light leading-[1.05] tracking-[-1.4px] mb-8 text-[color:var(--z-ink)]">
            Your academic track,{" "}
            <span className="italic">mapped with clarity</span>
          </h1>

          <p className="text-[17px] sm:text-[19px] font-light leading-[1.55] max-w-[560px] mx-auto mb-10 text-[color:var(--z-ink-secondary)]">
            Subjects. Exams. Colleges. Careers. One clear path.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => navigate("/education-level")}
              className="z-hero-cta-primary text-[16px] font-normal px-5 py-2.5 rounded-full transition-all duration-200 active:scale-[0.96]"
            >
              Start the Assessment
            </button>
            <button
              onClick={() => navigate("/careers")}
              className="z-hero-cta-secondary text-[16px] font-normal px-5 py-2.5 rounded-full transition-all duration-200"
            >
              Browse Careers
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none z-hero-fade-bottom" />
      </section>

      {/* ━━━ HOW IT WORKS (DARK BAND) ━━━ */}
      <section className="py-28 relative overflow-hidden bg-[color:var(--z-surface-dark)]">
        <div className="absolute inset-0 pointer-events-none z-dark-glow-1" />
        <div className="absolute inset-0 pointer-events-none z-dark-glow-2" />
        <div className="relative z-10 mx-auto max-w-[960px] px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[10px] font-medium tracking-[0.15em] uppercase block mb-5 text-[color:var(--z-surface-dark-muted)]">
                How it works
              </span>
              <h2 className="font-serif text-[32px] sm:text-[42px] font-light tracking-[-1px] leading-[1.1] text-[color:var(--z-surface-dark-text)]">
                Three steps to{" "}
                <span className="italic">clarity</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Tell us where you are",
                description: "Select your board, class, and current subjects. We support CBSE, ICSE, and state boards.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                ),
              },
              {
                step: "02",
                title: "We map the options",
                description: "Your subjects and interests are matched against verified exam criteria, college requirements, and career pathways.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
                  </svg>
                ),
              },
              {
                step: "03",
                title: "You get a clear path",
                description: "Clean, structured results — no noise, no trending bias. Options parents and educators can trust.",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                ),
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="z-step-card glow-border-hover rounded-2xl p-7 h-full"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="z-step-icon w-10 h-10 rounded-xl flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[color:var(--z-surface-dark-muted)]">
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="font-serif text-[20px] font-light tracking-[-0.3px] mb-3 text-[color:var(--z-surface-dark-text)]">
                    {item.title}
                  </h3>
                  <p className="text-[14px] font-light leading-[1.6] text-[color:var(--z-surface-dark-muted)]">
                    {item.description}
                  </p>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.4}>
            <div className="text-center mt-12">
              <button
                onClick={() => navigate("/about")}
                className="z-cta-pill text-[15px] font-normal px-5 py-2.5 rounded-full active:scale-[0.96]"
              >
                Explore our methodology →
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ━━━ FEATURE CARDS (2×2 GRID) ━━━ */}
      <section className="py-24 bg-[color:var(--z-canvas-soft)]">
        <div className="mx-auto max-w-[1080px] px-6">
          <Reveal>
            <div className="text-center mb-16 space-y-4">
              <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-[color:var(--z-ink-muted)]">
                Platform
              </span>
              <h2 className="font-serif text-[32px] sm:text-[40px] font-light tracking-[-0.8px] text-[color:var(--z-ink)]">
                Everything you need,{" "}
                <span className="italic">nothing you don't</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Careers Catalog */}
            <Reveal delay={0}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="z-feature-card glow-border-hover glassmorphic-card-light dark:glassmorphic-card rounded-xl p-8 sm:p-10 flex flex-col justify-between h-[400px]"
              >
                <div className="space-y-3">
                  <h3 className="font-serif text-[26px] font-light tracking-[-0.26px] text-[color:var(--z-ink)]">
                    150+ Verified Career Pathways
                  </h3>
                  <p className="text-[15px] font-light leading-[1.5] max-w-[340px] text-[color:var(--z-ink-muted)]">
                    Deep specs, entrance criteria, exam timelines, and study durations mapped to local structures.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 my-4">
                  {["Aerospace", "Corporate Law", "Data Science", "UX Research", "Medicine"].map((tag) => (
                    <span
                      key={tag}
                      className="z-feature-tag px-3 py-1 text-[12px] rounded-full font-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span
                  onClick={() => navigate("/careers")}
                  className="text-[15px] font-normal hover:underline cursor-pointer inline-flex items-center gap-1 text-[color:var(--z-primary)]"
                >
                  Browse Careers
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </motion.div>
            </Reveal>

            {/* Card 2: Colleges */}
            <Reveal delay={0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="z-feature-card glow-border-hover glassmorphic-card-light dark:glassmorphic-card rounded-xl p-8 sm:p-10 flex flex-col justify-between h-[400px]"
              >
                <div className="space-y-3">
                  <h3 className="font-serif text-[26px] font-light tracking-[-0.26px] text-[color:var(--z-ink)]">
                    Mapped College Targets
                  </h3>
                  <p className="text-[15px] font-light leading-[1.5] max-w-[340px] text-[color:var(--z-ink-muted)]">
                    Analyse exam criteria, academic requirements, and entry thresholds for Indian institutions.
                  </p>
                </div>
                <div className="space-y-2 text-[13px] my-4">
                  {[
                    { name: "BITS Pilani", req: "BITSAT" },
                    { name: "Delhi University (SRCC)", req: "CUET" },
                    { name: "IIT Madras", req: "JEE Advanced" },
                  ].map((c) => (
                    <div key={c.name} className="z-college-row flex justify-between py-1.5">
                      <span className="font-normal text-[color:var(--z-ink)]">{c.name}</span>
                      <span className="font-light text-[color:var(--z-ink-muted)]">{c.req}</span>
                    </div>
                  ))}
                </div>
                <span
                  onClick={() => navigate("/education-level")}
                  className="text-[15px] font-normal hover:underline cursor-pointer inline-flex items-center gap-1 text-[color:var(--z-primary)]"
                >
                  Assess Entrance Match
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </motion.div>
            </Reveal>

            {/* Card 3: Founder story */}
            <Reveal delay={0.15}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="z-feature-card-cream glow-border-hover rounded-xl p-8 sm:p-10 flex flex-col justify-between h-[400px]"
              >
                <div className="space-y-3">
                  <h3 className="font-serif text-[26px] font-light tracking-[-0.26px] text-[color:var(--z-ink)]">
                    Built by students, for students
                  </h3>
                  <p className="text-[15px] font-light leading-[1.5] max-w-[340px] text-[color:var(--z-ink-secondary)]">
                    Created by high school seniors Johan Manoj and Viney Ragesh to address
                    the confusion faced during post-exam selection cycles.
                  </p>
                </div>
                <blockquote className="z-cream-quote pl-4 text-[14px] italic font-light leading-[1.6] my-4">
                  "We wanted to build something we wished we had — a clean, calm, and objective
                  platform where mapping pathways is structured and obvious."
                </blockquote>
                <span
                  onClick={() => navigate("/contact")}
                  className="text-[15px] font-normal hover:underline cursor-pointer inline-flex items-center gap-1 text-[color:var(--z-cream-text)]"
                >
                  Contact the founders
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>
              </motion.div>
            </Reveal>

            {/* Card 4: CTA card (dark featured) */}
            <Reveal delay={0.2}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="z-feature-card-dark rounded-xl p-8 sm:p-10 flex flex-col justify-between h-[400px] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none opacity-30 z-feature-card-glow-1" />
                <div className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none opacity-20 z-feature-card-glow-2" />
                <div className="relative z-10 space-y-3">
                  <h3 className="font-serif text-[26px] font-light tracking-[-0.26px] text-[color:var(--z-surface-dark-text)]">
                    Begin your assessment today
                  </h3>
                  <p className="text-[15px] font-light leading-[1.5] max-w-[340px] text-[color:var(--z-surface-dark-muted)]">
                    Answer a few structured questions about your subjects, interests, and goals.
                    We'll map your options with clarity.
                  </p>
                </div>
                <div className="relative z-10 mt-auto pt-6">
                  <button
                    onClick={() => navigate("/education-level")}
                    className="z-hero-cta-primary text-[16px] font-normal px-5 py-2.5 rounded-full transition-all duration-200 active:scale-[0.96]"
                  >
                    Start the Assessment
                  </button>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ━━━ FAQ SECTION ━━━ */}
      <section className="py-24 border-t border-[color:var(--z-border)] bg-[color:var(--z-canvas)]">
        <div className="mx-auto max-w-[840px] px-6">
          <Reveal>
            <div className="text-center mb-16 space-y-4">
              <span className="text-[10px] font-medium tracking-[0.1em] uppercase text-[color:var(--z-ink-muted)]">
                Frequently Asked Questions
              </span>
              <h2 className="font-serif text-[32px] sm:text-[40px] font-light tracking-[-0.8px] text-[color:var(--z-ink)]">
                Have questions? <span className="italic">We have answers.</span>
              </h2>
            </div>
          </Reveal>

          <div className="space-y-12">
            <div>
              <h3 className="font-serif text-[20px] font-normal tracking-wide text-[color:var(--z-primary)] mb-6 border-b border-[color:var(--z-border)]/40 pb-2.5">
                Platform & Services FAQs
              </h3>
              <div className="space-y-4">
                {faqs.filter(faq => faq.category === "Platform & Services").map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-serif text-[20px] font-normal tracking-wide text-[color:var(--z-primary)] mb-6 border-b border-[color:var(--z-border)]/40 pb-2.5">
                Stream & Career Selection FAQs
              </h3>
              <div className="space-y-4">
                {faqs.filter(faq => faq.category === "Stream & Career Guidance").map((faq, i) => (
                  <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const faqs = [
  // Platform & Services
  {
    category: "Platform & Services",
    question: "What is Zertainity?",
    answer: "Zertainity is India's leading career guidance platform that helps students discover their perfect career path through interest assessments, academic performance evaluation, and personalized recommendations. It is completely free to use."
  },
  {
    category: "Platform & Services",
    question: "Is Zertainity free to use?",
    answer: "Yes, Zertainity is completely free for all students. You can take the career aptitude test, explore career paths, and get personalized college recommendations without any cost."
  },
  {
    category: "Platform & Services",
    question: "How does Zertainity help students choose a career?",
    answer: "Zertainity uses advanced interest-mapping algorithms to analyze your academic preferences, subject scores, and personal choices. It then generates a personalized career recommendation list with detailed roadmaps showing you the exact steps from school to your dream career."
  },
  {
    category: "Platform & Services",
    question: "Which students can use Zertainity?",
    answer: "Zertainity is designed for Indian students at all levels — Class 10, Class 12, and undergraduate students who are deciding their career stream or looking for career clarity."
  },
  {
    category: "Platform & Services",
    question: "What careers does Zertainity cover?",
    answer: "Zertainity covers 100+ career paths including Technology (Software Engineering, Cloud Computing), Medicine (MBBS, BAMS), Engineering, Law, Government Services (IAS, IPS, SSC), Finance (CA, Investment Banking), Design, Media, Agriculture, Aviation, Sports, and many more careers available in India."
  },
  {
    category: "Platform & Services",
    question: "How accurate is Zertainity's career guidance?",
    answer: "Zertainity analyzes multiple data points including your subject performance, interests, and career market demand in India to provide highly personalized recommendations. The platform is continuously improved based on student feedback and career market trends."
  },
  {
    category: "Platform & Services",
    question: "Does Zertainity recommend colleges in India?",
    answer: "Yes, Zertainity provides personalized college recommendations based on your career goals, academic performance, and preferred location within India. It suggests the most relevant institutions for your chosen career path."
  },
  {
    category: "Platform & Services",
    question: "Who created Zertainity?",
    answer: "Zertainity was created by Johan Manoj and Viney Ragesh with the mission to provide every Indian student with access to quality career guidance, democratizing what was previously available only through expensive career counsellors."
  },

  // Stream & Career Guidance
  {
    category: "Stream & Career Guidance",
    question: "Which stream should I choose after 10th?",
    answer: "The choice depends on your interests, strengths, and future career goals. Indian students typically choose between Science (PCM for engineering/technology, PCB for medicine/research), Commerce (for finance, accounting, business), and Humanities/Arts (for law, humanities, design). Our free assessment helps analyze your academic performance and subject interests to suggest the ideal stream."
  },
  {
    category: "Stream & Career Guidance",
    question: "How do I know if Science is right for me?",
    answer: "If you enjoy logical problem-solving, mathematics, understanding how nature works, and are interested in engineering, medicine, research, or technology, Science might be a good fit. Zertainity evaluates your aptitude in key science and math subjects to give you an objective view of your readiness."
  },
  {
    category: "Stream & Career Guidance",
    question: "What careers can I pursue after Commerce?",
    answer: "Commerce opens up premium careers like Chartered Accountancy (CA), Investment Banking, Corporate Law, Management Consulting, Financial Analysis, and Actuarial Science. It's a highly versatile stream with strong market demand in India."
  },
  {
    category: "Stream & Career Guidance",
    question: "Is Arts a good stream?",
    answer: "Yes, absolutely. Arts/Humanities is highly valuable and offers excellent career paths in Law (via CLAT), Civil Services (UPSC), Design (NID/NIFT), Psychology, Journalism, Economics, and Management. It focuses on critical thinking, writing, and understanding human systems."
  },
  {
    category: "Stream & Career Guidance",
    question: "How do I choose a career at 15?",
    answer: "At 15, you don't need to commit to one specific job forever. Instead, focus on choosing the right academic stream (Science, Commerce, or Arts) that aligns with your broad interests. Our assessment helps you map your current interests to possible future directions, giving you a structured way to decide."
  },
  {
    category: "Stream & Career Guidance",
    question: "Good careers for introverted students?",
    answer: "Introverted students often thrive in careers that reward deep focus, independent analysis, and creative problem-solving. Premium paths include Software Development, Data Science, Research & Academia, Financial Analysis, Content Writing, Graphic Design, and UX/UI Design."
  },
  {
    category: "Stream & Career Guidance",
    question: "Which entrance exams to prepare for?",
    answer: "This depends on your chosen stream. Popular exams in India include JEE Main & Advanced for engineering, NEET for medical, CLAT for law, CUET for admissions to top central universities, BITSAT for BITS Pilani, and NID/UCEED for design. Zertainity maps these exams to your recommended career paths so you know exactly when and what to prepare."
  }
];

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Reveal delay={index * 0.05}>
      <div className="border-b border-[color:var(--z-border)]/60 py-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-left py-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--z-primary)]/50 rounded-lg px-2"
          aria-expanded={isOpen}
        >
          <span className="text-[16px] sm:text-[18px] font-normal text-[color:var(--z-ink)] group-hover:text-[color:var(--z-primary)] transition-colors duration-200">
            {question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[color:var(--z-ink-muted)] shrink-0 ml-4"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-[14px] sm:text-[15px] font-light leading-[1.6] mt-2 mb-3 text-[color:var(--z-ink-muted)] px-2">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}
