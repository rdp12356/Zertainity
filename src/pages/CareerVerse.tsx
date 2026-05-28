import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Gamepad2, Sparkles, Brain, Target, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

export default function CareerVerse() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[color:var(--z-canvas)] text-[color:var(--z-ink)] relative overflow-hidden pb-12">
      {/* Background glow orbs for depth */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] z-dark-glow-1 opacity-70" />
        <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] z-dark-glow-2 opacity-50" />
        <div className="absolute inset-0 cyber-grid-mesh opacity-20 dark:opacity-30" />
      </div>

      <SEO
        title="CareerVerse — Gamify Your Future"
        description="Experience realistic career simulations, face critical decisions, and test-drive your dream professions. Coming soon to Zertainity."
        canonical="/careerverse"
        noindex
      />

      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-[color:var(--z-border)]/40 bg-[color:var(--z-nav-bg)]/80">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-[color:var(--z-border)]/20 text-[color:var(--z-ink)]"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-serif font-bold tracking-tight text-[color:var(--z-ink)]">
            Career<span className="font-mono text-xs bg-gradient-to-r from-[color:var(--z-primary)] to-purple-400 bg-clip-text text-transparent ml-0.5">Verse</span>
          </h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-4xl relative z-10 flex flex-col items-center text-center">
        {/* Glow Icon */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative mb-8 flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[color:var(--z-primary)]/10 to-purple-500/10 border border-[color:var(--z-primary)]/30 text-[color:var(--z-primary)] shadow-lg"
        >
          <Gamepad2 className="h-10 w-10 text-[color:var(--z-primary)] animate-pulse" />
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500"></span>
          </span>
        </motion.div>

        {/* Coming Soon Badge */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[color:var(--z-primary)]/10 text-[color:var(--z-primary)] dark:text-purple-300 border border-[color:var(--z-primary)]/20 mb-6"
        >
          <Sparkles className="w-3.5 h-3.5" />
          COMING SOON
        </motion.span>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-[36px] sm:text-[48px] font-light leading-tight tracking-tight mb-6 text-[color:var(--z-ink)]"
        >
          Gamify Your Future in the <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-[color:var(--z-primary)] via-purple-500 to-pink-500">CareerVerse</span>
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-base sm:text-lg font-light leading-relaxed max-w-2xl text-[color:var(--z-ink-secondary)] mb-12"
        >
          We are crafting an immersive career sandbox for Indian students. Experience the day-to-day realities of 150+ professions through real-world simulations, solve high-stakes dilemmas, earn XP, and unlock premium digital achievements.
        </motion.p>

        {/* Feature Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid gap-6 md:grid-cols-3 w-full text-left mb-12"
        >
          <div className="p-6 rounded-2xl bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]/60 hover:border-[color:var(--z-primary)]/20 transition-all duration-300 shadow-sm">
            <Brain className="h-6 w-6 text-[color:var(--z-primary)] mb-3" />
            <h4 className="font-serif text-lg font-normal mb-2 text-[color:var(--z-ink)]">Real Simulations</h4>
            <p className="text-xs font-light leading-relaxed text-[color:var(--z-ink-muted)]">
              Build and train ML models, balance company ledgers, or guide commercial airliners through heavy weather challenges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]/60 hover:border-[color:var(--z-primary)]/20 transition-all duration-300 shadow-sm">
            <Target className="h-6 w-6 text-purple-500 mb-3" />
            <h4 className="font-serif text-lg font-normal mb-2 text-[color:var(--z-ink)]">Day-in-the-Life</h4>
            <p className="text-xs font-light leading-relaxed text-[color:var(--z-ink-muted)]">
              Navigate hourly decision timelines where choices directly test your focus, tech aptitude, and business sense.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]/60 hover:border-[color:var(--z-primary)]/20 transition-all duration-300 shadow-sm">
            <Award className="h-6 w-6 text-pink-500 mb-3" />
            <h4 className="font-serif text-lg font-normal mb-2 text-[color:var(--z-ink)]">Badges & XP</h4>
            <p className="text-xs font-light leading-relaxed text-[color:var(--z-ink-muted)]">
              Accumulate XP parameters, unlock rare competency badges, and demonstrate your unique capabilities to parents and advisors.
            </p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            className="rounded-full bg-[color:var(--z-primary)] hover:bg-[color:var(--z-primary-hover)] text-[color:var(--z-primary-fg)] font-medium px-8"
            onClick={() => navigate("/education-level")}
          >
            Start Free Career Assessment
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-[color:var(--z-border)] hover:bg-[color:var(--z-border)]/20 px-8 text-[color:var(--z-ink)]"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
