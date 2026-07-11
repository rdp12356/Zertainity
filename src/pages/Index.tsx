import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Globe, Instagram, Twitter } from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import { SEO } from "@/components/SEO";
import { useInertialScroll } from "@/hooks/useInertialScroll";
import { SplitTextReveal } from "@/components/SplitTextReveal";
import { BezierLink } from "@/components/BezierLink";
import { Footer } from "@/components/Footer";

const smoothSpring = { type: "spring", stiffness: 100, damping: 22, mass: 0.6 };
const gentleSpring = { type: "spring", stiffness: 90, damping: 20, mass: 0.7 };

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15px" });
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  useInertialScroll(scrollRef, 0.065);

  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([]);
    return () => setCurves([]);
  }, [setCurves]);

  // Play video with native looping and instant loading
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(console.error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans">
      <SEO
        title="Zertainity — Academic Mapping & Career Guidance"
        description="A structured, evidence-based career mapping platform for Indian students. Map subjects and interests to verified exam and college tracks."
        canonical="/"
      />

      {/* Navigation Layer */}
      <div className="absolute top-0 left-0 right-0 z-[100] w-full pt-6">
        <nav className="pl-6 pr-6 py-2 w-full">
          <div className="rounded-full px-6 py-3 flex items-center justify-between max-w-5xl mx-auto">
            {/* Left: Logo & Links */}
            <div className="flex items-center gap-8">
              <div 
                className="flex items-center gap-2 text-white cursor-pointer"
                onClick={() => navigate("/")}
              >
                <img 
                  src="/logo-z.svg" 
                  alt="Zertainity Logo" 
                  className="h-8 w-8 object-contain"
                />
                <span className="font-semibold text-lg tracking-tight">Zertainity</span>
              </div>
              <div className="hidden md:flex items-center gap-8">
                <button onClick={() => navigate("/careers")} className="text-white/80 hover:text-white transition-colors text-sm font-medium">Careers</button>
                <button onClick={() => navigate("/about")} className="text-white/80 hover:text-white transition-colors text-sm font-medium">About</button>
              </div>
            </div>

            {/* Right: Auth Buttons */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate("/auth")}
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Smooth Scrolling Container */}
      <div ref={scrollRef}>

        {/* ━━━ CINEMATIC HERO ━━━ */}
        <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06),transparent_65%)]">
          {/* Background Video */}
          <div className="absolute inset-0 pointer-events-none bg-black/20">
            <video
              ref={videoRef}
              src="https://res.cloudinary.com/dg3snayxc/video/upload/v1783172450/from_the_first_onwards_the_use_gwr_video_mvp_1_usotaa.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              className="absolute inset-0 w-full h-full object-cover translate-y-[17%] pointer-events-none"
              style={{ opacity: 1 }}
            />
          </div>

          <div className="relative z-10 text-center max-w-3xl mx-auto px-6 -translate-y-[10%]">
            <h1 
              className="text-[36px] sm:text-[52px] md:text-[68px] lg:text-[80px] text-white mb-6 tracking-tight leading-[1.1] px-4"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Your academic track, mapped.
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...gentleSpring, delay: 0.6 }}
              className="text-lg md:text-xl font-light text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Subjects. Exams. Colleges. Careers. One clear path built for the curious.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...gentleSpring, delay: 0.75 }}
              className="flex justify-center gap-4 flex-wrap"
            >
              <button
                onClick={() => navigate("/education-level")}
                className="liquid-glass rounded-full px-8 py-3.5 text-white text-[15px] font-medium hover:bg-white/10 transition-colors"
              >
                Start the Assessment
              </button>
              <button
                onClick={() => navigate("/careers")}
                className="rounded-full px-8 py-3.5 text-white text-[15px] font-medium border border-white/20 hover:bg-white/5 transition-colors"
              >
                Browse Careers
              </button>
            </motion.div>
          </div>
          
          {/* Gradient fade to seamlessly blend with lower black sections */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
        </section>

        {/* ━━━ HOW IT WORKS ━━━ */}
        <section className="py-24 relative overflow-hidden bg-black z-30">
          <div className="relative z-10 mx-auto max-w-[960px] px-6">
            <Reveal>
              <div className="text-center mb-16">
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase block mb-4 text-white/50">
                  How it works
                </span>
                <h2 
                  className="text-4xl md:text-5xl text-white tracking-tight"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Three steps to clarity
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
                    className="liquid-glass rounded-2xl p-8 h-full"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white">
                        {item.icon}
                      </div>
                      <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-white/50">
                        Step {item.step}
                      </span>
                    </div>
                    <h3 
                      className="text-2xl mb-3 text-white"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {item.title}
                    </h3>
                    <p className="text-[14px] font-light leading-[1.6] text-white/70">
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
                  className="text-[14px] font-medium px-6 py-2.5 rounded-full border border-white/20 hover:bg-white/10 transition-colors"
                >
                  Explore our methodology →
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ━━━ FEATURE CARDS (2×2 GRID) ━━━ */}
        <section className="py-24 bg-black border-t border-white/10 z-30">
          <div className="mx-auto max-w-[1080px] px-6">
            <Reveal>
              <div className="text-center mb-16 space-y-4">
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50">
                  Platform
                </span>
                <h2 
                  className="text-4xl md:text-5xl text-white tracking-tight"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Everything you need, nothing you don't
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Careers Catalog */}
              <Reveal delay={0}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="liquid-glass rounded-2xl p-8 sm:p-10 flex flex-col justify-between h-[400px]"
                >
                  <div className="space-y-4">
                    <h3 
                      className="text-3xl text-white"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      150+ Verified Career Pathways
                    </h3>
                    <p className="text-[15px] font-light leading-[1.6] max-w-[340px] text-white/70">
                      Deep specs, entrance criteria, exam timelines, and study durations mapped to local structures.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 my-6">
                    {["Aerospace", "Corporate Law", "Data Science", "UX Research", "Medicine"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-[12px] rounded-full font-light tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/careers")}
                    className="text-left text-[14px] font-medium text-white hover:text-white/80 transition-colors flex items-center gap-2 w-max"
                  >
                    Browse Careers <ArrowRight size={14} />
                  </button>
                </motion.div>
              </Reveal>

              {/* Card 2: Colleges */}
              <Reveal delay={0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="liquid-glass rounded-2xl p-8 sm:p-10 flex flex-col justify-between h-[400px]"
                >
                  <div className="space-y-4">
                    <h3 
                      className="text-3xl text-white"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      Mapped College Targets
                    </h3>
                    <p className="text-[15px] font-light leading-[1.6] max-w-[340px] text-white/70">
                      Analyse exam criteria, academic requirements, and entry thresholds for Indian institutions.
                    </p>
                  </div>
                  <div className="space-y-3 text-[14px] my-6 flex-1">
                    {[
                      { name: "BITS Pilani", req: "BITSAT" },
                      { name: "Delhi University", req: "CUET" },
                      { name: "IIT Madras", req: "JEE Advanced" },
                    ].map((c) => (
                      <div key={c.name} className="flex justify-between items-center py-2 border-b border-white/10">
                        <span className="font-normal text-white">{c.name}</span>
                        <span className="font-light text-white/50">{c.req}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => navigate("/education-level")}
                    className="text-left text-[14px] font-medium text-white hover:text-white/80 transition-colors flex items-center gap-2 w-max"
                  >
                    Assess Entrance Match <ArrowRight size={14} />
                  </button>
                </motion.div>
              </Reveal>

              {/* Card 3: Founder story */}
              <Reveal delay={0.15}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="liquid-glass rounded-2xl p-8 sm:p-10 flex flex-col justify-between h-[400px]"
                >
                  <div className="space-y-4">
                    <h3 
                      className="text-3xl text-white"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      Built by students
                    </h3>
                    <p className="text-[15px] font-light leading-[1.6] max-w-[340px] text-white/70">
                      Created by high school seniors Johan Manoj and Viney Ragesh to address
                      the confusion faced during post-exam selection cycles.
                    </p>
                  </div>
                  <blockquote className="pl-4 text-[14px] italic font-light leading-[1.6] my-6 border-l-2 border-white/30 text-white/80">
                    "We wanted to build something we wished we had — a clean, calm, and objective
                    platform where mapping pathways is structured and obvious."
                  </blockquote>
                  <button
                    onClick={() => navigate("/contact")}
                    className="text-left text-[14px] font-medium text-white hover:text-white/80 transition-colors flex items-center gap-2 w-max"
                  >
                    Contact the founders <ArrowRight size={14} />
                  </button>
                </motion.div>
              </Reveal>

              {/* Card 4: CTA card */}
              <Reveal delay={0.2}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="liquid-glass rounded-2xl p-8 sm:p-10 flex flex-col justify-center items-center h-[400px] text-center"
                >
                  <div className="space-y-4 mb-8">
                    <h3 
                      className="text-3xl text-white"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      Begin your assessment
                    </h3>
                    <p className="text-[15px] font-light leading-[1.6] max-w-[300px] text-white/70 mx-auto">
                      Answer a few structured questions about your subjects, interests, and goals. We'll map your options with clarity.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/education-level")}
                    className="bg-white text-black px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-white/90 transition-colors flex items-center gap-2"
                  >
                    Start Now <ArrowRight size={16} />
                  </button>
                </motion.div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ━━━ FAQ SECTION ━━━ */}
        <section className="py-24 border-t border-white/10 bg-black z-30">
          <div className="mx-auto max-w-[840px] px-6">
            <Reveal>
              <div className="text-center mb-16 space-y-4">
                <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/50">
                  Frequently Asked Questions
                </span>
                <h2 
                  className="text-4xl md:text-5xl text-white tracking-tight"
                  style={{ fontFamily: "'Instrument Serif', serif" }}
                >
                  Have questions? We have answers.
                </h2>
              </div>
            </Reveal>

            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-medium tracking-wide text-white mb-6 border-b border-white/20 pb-3">
                  Platform & Services FAQs
                </h3>
                <div className="space-y-3">
                  {faqs.filter(faq => faq.category === "Platform & Services").map((faq, i) => (
                    <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium tracking-wide text-white mb-6 border-b border-white/20 pb-3">
                  Stream & Career Selection FAQs
                </h3>
                <div className="space-y-3">
                  {faqs.filter(faq => faq.category === "Stream & Career Guidance").map((faq, i) => (
                    <FAQItem key={i} question={faq.question} answer={faq.answer} index={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Icons (above standard Footer) */}
        <section className="pb-12 pt-6 bg-black flex justify-center gap-4 border-t border-white/10">
          <a href="#" aria-label="Instagram" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white transition-all">
            <Instagram size={20} />
          </a>
          <a href="#" aria-label="Twitter" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white transition-all">
            <Twitter size={20} />
          </a>
          <a href="#" aria-label="Globe" className="liquid-glass rounded-full p-4 text-white/80 hover:text-white transition-all">
            <Globe size={20} />
          </a>
        </section>

        {/* Keep existing standard Footer component at the bottom */}
        {/* We wrap it here, but since the parent wrapper has bg-black text-white, the footer will adopt dark aesthetics automatically if it relies on CSS variables or if we force it */}
        <div className="border-t border-white/10">
          {/* We do NOT explicitly render <Footer /> here because App.tsx already renders it for paths matching `/` ?? 
              Wait, App.tsx DOES NOT render Footer on `/`. So we must render it. */}
          <Footer />
        </div>
      </div>
    </div>
  );
}

// Just an ArrowRight icon component proxy if it wasn't imported from lucide
import { ArrowRight } from "lucide-react";

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
      <div className="liquid-glass rounded-xl overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-left p-5 group focus:outline-none"
          aria-expanded={isOpen}
        >
          <span className="text-[16px] sm:text-[17px] font-medium text-white group-hover:text-white/80 transition-colors duration-200">
            {question}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-white/50 shrink-0 ml-4"
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
            >
              <div className="p-5 pt-0 border-t border-white/10 mt-1">
                <p className="text-[14px] sm:text-[15px] font-light leading-[1.7] text-white/70">
                  {answer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}
