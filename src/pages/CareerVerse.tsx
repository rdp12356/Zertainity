
// --- Types & Interfaces ---



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";
import {
  Gamepad2, Award, Sparkles, Brain,
  ArrowLeft, CheckCircle2, Target, ChevronRight,
  RefreshCw, Lock, Compass, Cpu,
  TrendingUp, Landmark, Plane, UserCheck, Check
} from "lucide-react";

import { SEO } from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserProgress {
  xp: number;
  lastPlayed: string;
  stats: {
    creativity: number;
    tech: number;
    business: number;
    focus: number;
  };
  badges: string[];
}

type StatDelta = Partial<UserProgress["stats"]>;

interface BoardDilemma {
  id: number;
  title: string;
  scenario: string;
  options: {
    text: string;
    xpBonus: number;
    statMods: StatDelta;
    badgeUnlock?: string;
    feedback: string;
  }[];
}

const DILEMMAS: BoardDilemma[] = [
  {
    id: 1,
    title: "Morning Prep Dilemma",
    scenario: "Your alarm goes off, and you have an extra hour before classes or work starts. What will you do with this time?",
    options: [
      {
        text: "Snooze the alarm and sleep (+10 Focus)",
        xpBonus: 20,
        statMods: { focus: 10 },
        feedback: "You feel fully refreshed and highly focused for the day ahead."
      },
      {
        text: "Read tech news & career strategies (+10 Business, +5 Tech)",
        xpBonus: 35,
        statMods: { business: 10, tech: 5 },
        feedback: "Excellent start! You stay ahead of industry trends and start building strategic knowledge."
      }
    ]
  },
  {
    id: 2,
    title: "College Lecture Challenge",
    scenario: "The lecture is extremely slow, and you already know the material. How do you spend the class?",
    options: [
      {
        text: "Sketch a creative UI layout in your notebook (+15 Creativity)",
        xpBonus: 25,
        statMods: { creativity: 15 },
        feedback: "Your design looks futuristic! You sharpened your spatial planning and creative thinking."
      },
      {
        text: "Solve an advanced coding algorithm on your laptop (+15 Tech)",
        xpBonus: 40,
        statMods: { tech: 15 },
        feedback: "Brilliant! You solved the challenge and optimized your runtime complexity."
      }
    ]
  },
  {
    id: 3,
    title: "The Project Dispute",
    scenario: "Your project team is arguing over the design direction, wasting valuable hours. What is your move?",
    options: [
      {
        text: "Step in, facilitate compromise, and assign tasks (+15 Business)",
        xpBonus: 30,
        statMods: { business: 15 },
        feedback: "Leadership shown! You calmed the team and aligned everyone on a cohesive plan."
      },
      {
        text: "Put on headphones and program the core features solo (+10 Tech, +10 Focus)",
        xpBonus: 25,
        statMods: { tech: 10, focus: 10 },
        feedback: "You built a working prototype, but the team feels left out. Still, solid tech progress."
      }
    ]
  },
  {
    id: 4,
    title: "Afternoon Hackathon Security Anomaly",
    scenario: "During a hackathon, you discover a major security exploit in your team's code right before the submission deadline.",
    options: [
      {
        text: "Stay up to patch it (+20 Tech, +10 Focus)",
        xpBonus: 50,
        statMods: { tech: 20, focus: 10 },
        badgeUnlock: "Cyber Safeguard",
        feedback: "Crisis averted! You successfully secured the codebase and earned the Cyber Safeguard badge."
      },
      {
        text: "Pitch it as a 'known issue' and focus on the presentation (+15 Business)",
        xpBonus: 30,
        statMods: { business: 15 },
        feedback: "The judges loved the pitch, but the code remains vulnerable. Good business strategy, though."
      }
    ]
  },
  {
    id: 5,
    title: "Networking Session Pitch",
    scenario: "You bump into a top industry mentor at a student networking meetup. You only have 30 seconds.",
    options: [
      {
        text: "Deliver a passionate pitch about your startup idea (+20 Business, +10 Creativity)",
        xpBonus: 45,
        statMods: { business: 20, creativity: 10 },
        badgeUnlock: "Pitch Master",
        feedback: "Impressive elevator pitch! They exchanged contacts and awarded you the Pitch Master badge."
      },
      {
        text: "Ask for their career story and listen (+15 Focus, +10 Business)",
        xpBonus: 30,
        statMods: { focus: 15, business: 10 },
        feedback: "Great networking! They appreciated your humility and shared three pieces of invaluable advice."
      }
    ]
  }
];

export default function CareerVerse() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // --- Core States ---
  const [activeTab, setActiveTab] = useState<"dashboard" | "board" | "missions">("dashboard");
  const [userProfile, setUserProfile] = useState<{ display_name: string | null; email: string | null } | null>(null);
  const [unlockedPaths, setUnlockedPaths] = useState<string[]>([]);
  const [unlockedPathsLoading, setUnlockedPathsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // --- Game Stats & Progress ---
  const [progress, setProgress] = useState<UserProgress>({
    xp: 0,
    lastPlayed: new Date().toDateString(),
    stats: { creativity: 10, tech: 10, business: 10, focus: 10 },
    badges: ["Fast Learner"]
  });

  // --- Board Game States ---
  const [boardStep, setBoardStep] = useState(0); // 0 to 5
  const [currentDilemma, setCurrentDilemma] = useState<BoardDilemma | null>(null);
  const [dilemmaResult, setDilemmaResult] = useState<string | null>(null);

  // --- Mission Simulators ---
  const [activeMission, setActiveMission] = useState<"ai" | "entrepreneur" | "ca" | "pilot" | null>(null);

  // AI Mission States
  const [learningRate, setLearningRate] = useState(0.01);
  const [epochs, setEpochs] = useState(15);
  const [batchSize, setBatchSize] = useState(32);
  const [normalization, setNormalization] = useState(true);
  const [cleanData, setCleanData] = useState(true);
  const [aiTraining, setAiTraining] = useState(false);
  const [aiEpochProgress, setAiEpochProgress] = useState(0);
  const [, setAiLoss] = useState(1.0);
  const [aiAccuracy, setAiAccuracy] = useState(0.1);
  const [aiOutputLog, setAiOutputLog] = useState<string[]>([]);

  // Entrepreneur Mission States
  const [startupStep, setStartupStep] = useState(1); // 1 to 5
  const [startupFunding, setStartupFunding] = useState(50000);
  const [startupMVP, setStartupMVP] = useState<"cheap" | "standard" | "premium" | null>(null);
  const [startupTeam, setStartupTeam] = useState<"freelance" | "senior" | "agency" | null>(null);
  const [startupMarketing, setStartupMarketing] = useState<"social" | "influencer" | "viral" | null>(null);
  const [startupLog, setStartupLog] = useState<string[]>([]);

  // CA Mission States
  const [caAnswers, setCaAnswers] = useState<Record<number, string>>({});
  const [caSubmitted, setCaSubmitted] = useState(false);

  // Pilot Mission States
  const [pilotStep, setPilotStep] = useState(1); // 1 to 5
  const [pilotSafety, setPilotSafety] = useState(100);
  const [pilotFuel, setPilotFuel] = useState(100);
  const [pilotLog, setPilotLog] = useState<string[]>([]);

  // --- Load Profile & Career Test Results ---
  useEffect(() => {
    const initializePage = async () => {
      // 1. Get Session
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      setUserId(user?.id || "guest");

      if (user) {
        // Fetch profile
        const { data: profile } = await supabase
          .from("user_profiles")
          .select("display_name")
          .eq("id", user.id)
          .single();

        setUserProfile({
          display_name: profile?.display_name || user.email?.split("@")[0] || "Student",
          email: user.email || null
        });

        // 2. Fetch Latest Career History
        const { data: history } = await supabase
          .from("career_history")
          .select("all_recommendations")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (history && history[0]) {
          const recommendations = (history[0].all_recommendations as any)?.careers || [];
          const careerNames = recommendations.map((c: any) => c.stream);
          setUnlockedPaths(careerNames);
        }
      } else {
        setUserProfile({ display_name: "Guest Student", email: null });
      }
      setUnlockedPathsLoading(false);

      // 3. Load Gamified Progress from localStorage
      const storageKey = `z_careerverse_progress_${user?.id || "guest"}`;
      const savedProgress = localStorage.getItem(storageKey);
      if (savedProgress) {
        try {
          setProgress(JSON.parse(savedProgress));
        } catch (e) {
          console.error("Error loading progress", e);
        }
      }
    };

    initializePage();
  }, []);

  // --- Sync Progress to localStorage ---
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    const storageKey = `z_careerverse_progress_${userId || "guest"}`;
    localStorage.setItem(storageKey, JSON.stringify(newProgress));
  };

  // --- Helper to Award XP & Level Up ---
  const awardXP = (amount: number, statsMod?: StatDelta, badge?: string) => {
    const newXp = progress.xp + amount;

    const updatedStats = { ...progress.stats };
    if (statsMod) {
      Object.keys(statsMod).forEach((key) => {
        const k = key as keyof typeof progress.stats;
        updatedStats[k] = (updatedStats[k] || 0) + (statsMod[k] ?? 0);
      });
    }

    const updatedBadges = [...progress.badges];
    if (badge && !updatedBadges.includes(badge)) {
      updatedBadges.push(badge);
      toast({
        title: "🏆 Badge Unlocked!",
        description: `You earned the "${badge}" badge!`,
        variant: "default"
      });
    }

    saveProgress({
      ...progress,
      xp: newXp,
      stats: updatedStats,
      badges: updatedBadges
    });
  };

  // --- board logic ---
  const handleRollDice = () => {
    setDilemmaResult(null);

    if (boardStep < 5) {
      const current = DILEMMAS[boardStep];
      setCurrentDilemma(current);
    } else {
      // Completed board! Reset board step, reward bonus
      setBoardStep(0);
      setCurrentDilemma(null);
      awardXP(100, undefined, "Day Completer");
      toast({
        title: "☀️ Day Completed!",
        description: "You finished a full day timeline! +100 Bonus XP awarded.",
      });
    }
  };

  const handleSelectDilemmaOption = (optionIndex: number) => {
    if (!currentDilemma) return;
    const option = currentDilemma.options[optionIndex];

    setDilemmaResult(option.feedback);
    awardXP(option.xpBonus, option.statMods, option.badgeUnlock);
    setBoardStep((prev) => prev + 1);
  };

  // --- Mission: AI ML Engineer Neural training ---
  const handleTrainAI = () => {
    setAiTraining(true);
    setAiEpochProgress(0);
    setAiLoss(1.0);
    setAiAccuracy(0.1);
    setAiOutputLog(["Initializing Neural Network weights...", "Loading dataset..."]);

    let currentEpoch = 0;
    const interval = setInterval(() => {
      currentEpoch += 1;
      setAiEpochProgress(currentEpoch);

      // Simulation math based on hyperparameters
      const progressRatio = currentEpoch / epochs;
      let targetAccuracy = 0.96;
      let finalLoss = 0.05;

      // Adjust outcome based on choices
      if (learningRate > 0.15 && !normalization) {
        // Overfitting / Diverging loss
        targetAccuracy = 0.22 + Math.random() * 0.1;
        finalLoss = 0.8 + Math.random() * 0.5;
      } else if (learningRate < 0.005) {
        // Underfitting
        targetAccuracy = 0.6 + Math.random() * 0.08;
        finalLoss = 0.35 + Math.random() * 0.1;
      } else {
        if (!cleanData) targetAccuracy -= 0.15;
        if (!normalization) targetAccuracy -= 0.1;
      }

      const calculatedAccuracy = 0.1 + (targetAccuracy - 0.1) * progressRatio + (Math.random() * 0.02 - 0.01);
      const calculatedLoss = 1.0 - (1.0 - finalLoss) * progressRatio + (Math.random() * 0.05 - 0.025);

      setAiAccuracy(Math.max(0.05, Math.min(0.99, calculatedAccuracy)));
      setAiLoss(Math.max(0.01, calculatedLoss));

      setAiOutputLog((prev) => [
        ...prev,
        `Epoch ${currentEpoch}/${epochs} - Loss: ${calculatedLoss.toFixed(4)} - Val_Accuracy: ${(calculatedAccuracy * 100).toFixed(2)}%`
      ]);

      if (currentEpoch >= epochs) {
        clearInterval(interval);
        setAiTraining(false);

        // Check success criteria
        const finalAcc = calculatedAccuracy * 100;
        if (finalAcc >= 90) {
          awardXP(120, { tech: 25 }, "AI Pioneer");
          setAiOutputLog((prev) => [...prev, "🎉 Model converged successfully! Target accuracy reached."]);
        } else {
          awardXP(40, { tech: 10 });
          setAiOutputLog((prev) => [...prev, "⚠️ Model failed to meet target accuracy. Adjust parameters and try again."]);
        }
      }
    }, 200);
  };

  // --- Mission: Entrepreneur Startup simulator ---
  const handleStartupChoice = (type: "mvp" | "team" | "marketing", choice: any, cost: number) => {
    setStartupFunding((prev) => prev - cost);
    if (type === "mvp") {
      setStartupMVP(choice);
      setStartupLog((prev) => [...prev, `Built MVP with architectural grade: ${choice.toUpperCase()} (-$${cost})`]);
      setStartupStep(2);
    } else if (type === "team") {
      setStartupTeam(choice);
      setStartupLog((prev) => [...prev, `Recruited engineering team type: ${choice.toUpperCase()} (-$${cost})`]);
      setStartupStep(3);
    } else if (type === "marketing") {
      setStartupMarketing(choice);
      setStartupLog((prev) => [...prev, `Launched marketing campaign: ${choice.toUpperCase()} (-$${cost})`]);
      setStartupStep(4);
    }
  };

  const handleRunStartupOutcome = () => {
    // Math to evaluate startup performance
    let revenueMultiplier = 1.0;

    // MVP Factor
    if (startupMVP === "premium") revenueMultiplier += 0.5;
    if (startupMVP === "cheap") revenueMultiplier -= 0.3;

    // Team Factor
    if (startupTeam === "senior") revenueMultiplier += 0.4;
    if (startupTeam === "freelance") revenueMultiplier -= 0.2;

    // Marketing Factor
    if (startupMarketing === "influencer") revenueMultiplier += 0.3;
    if (startupMarketing === "viral") {
      // High-risk gamble!
      revenueMultiplier += Math.random() > 0.4 ? 0.8 : -0.6;
    }

    const calculatedRevenue = Math.round(40000 * revenueMultiplier);
    const finalCapital = startupFunding + calculatedRevenue;
    setStartupFunding(finalCapital);

    const netProfit = finalCapital - 50000;
    setStartupLog((prev) => [
      ...prev,
      `Assessments completed. Revenue generated: +$${calculatedRevenue.toLocaleString()}`,
      `Total startup capital: $${finalCapital.toLocaleString()}`,
      `Net profit/loss: $${netProfit.toLocaleString()}`
    ]);

    setStartupStep(5);

    if (netProfit > 10000) {
      awardXP(150, { business: 25, creativity: 10 }, "Unicorn Founder");
    } else {
      awardXP(50, { business: 10 });
    }
  };

  const resetStartupMission = () => {
    setStartupStep(1);
    setStartupFunding(50000);
    setStartupMVP(null);
    setStartupTeam(null);
    setStartupMarketing(null);
    setStartupLog([]);
  };

  // --- Mission: CA solver ---
  const handleCaSubmit = () => {
    setCaSubmitted(true);
    let correctCount = 0;
    if (caAnswers[1] === "ppf") correctCount++;
    if (caAnswers[2] === "sec54") correctCount++;
    if (caAnswers[3] === "equity") correctCount++;

    if (correctCount === 3) {
      awardXP(120, { focus: 20, business: 15 }, "Tax Wizard");
    } else {
      awardXP(20 * correctCount, { focus: 5 });
    }
  };

  const resetCaMission = () => {
    setCaAnswers({});
    setCaSubmitted(false);
  };

  // --- Mission: Pilot Cockpit flight deck ---
  const handlePilotChoice = (optionIndex: number) => {
    let safetyMod = 0;
    let fuelMod = 0;
    let feedback = "";

    if (pilotStep === 1) {
      if (optionIndex === 0) {
        fuelMod = -15;
        safetyMod = 0;
        feedback = "Routed around the storm. Heavy rain avoided, fuel level down to 85%.";
      } else {
        fuelMod = -5;
        safetyMod = -35;
        feedback = "Flew straight through turbulence. Flight deck experienced severe vibrations, safety down to 65%.";
      }
      setPilotStep(2);
    } else if (pilotStep === 2) {
      if (optionIndex === 0) {
        safetyMod = +15;
        feedback = "Shut down hot engine and diverted route. Safety margin increased, descent started.";
      } else {
        safetyMod = -40;
        feedback = "Kept engine hot. Internal temperature rose, warning alarms triggered! Critical flight state.";
      }
      setPilotStep(3);
    } else if (pilotStep === 3) {
      if (optionIndex === 0) {
        safetyMod = +10;
        feedback = "Crossfed fuel correctly, stabilizing flight balance.";
      } else {
        safetyMod = -15;
        fuelMod = -10;
        feedback = "Left wing fuel line leaked further, losing weight balance.";
      }
      setPilotStep(4);
    } else if (pilotStep === 4) {
      if (optionIndex === 0) {
        feedback = "Crab-landing successfully counteracted crosswinds. Smooth runway contact! Safely arrived.";
      } else {
        safetyMod = -60;
        feedback = "Autoland system exceeded maximum crosswind limits! Rough landing with tire blowout.";
      }
      setPilotStep(5);
    }

    setPilotSafety((prev) => Math.max(0, Math.min(100, prev + safetyMod)));
    setPilotFuel((prev) => Math.max(0, Math.min(100, prev + fuelMod)));
    setPilotLog((prev) => [...prev, feedback]);

    if (pilotStep === 4) {
      const finalSafety = Math.max(0, pilotSafety + safetyMod);
      if (finalSafety >= 50) {
        awardXP(130, { focus: 20, tech: 15 }, "Captain's Wings");
      } else {
        awardXP(30, { focus: 5 });
      }
    }
  };

  const resetPilotMission = () => {
    setPilotStep(1);
    setPilotSafety(100);
    setPilotFuel(100);
    setPilotLog([]);
  };

  // Map a percentage (0-100) to a nearest Tailwind width fraction class (w-#/12 or w-full).
  const pctToWidthClass = (pct: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(pct)));
    const slot = Math.round((clamped / 100) * 12);
    if (slot <= 0) return "w-0";
    if (slot >= 12) return "w-full";
    return `w-${slot}/12`;
  };

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
        description="Explore your future career recommendations through interactive simulations and choice boards."
        canonical="/careerverse"
        noindex
      />

      {/* --- HEADER --- */}
      <header className="z-page-header sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="z-icon-button rounded-full" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-serif font-bold tracking-tight text-[color:var(--z-ink)]">
                Career<span className="font-mono text-sm bg-gradient-to-r from-[color:var(--z-primary)] to-purple-400 bg-clip-text text-transparent ml-0.5">Verse</span>
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        {/* --- HERO BANNER --- */}
        <div className="relative mb-8 rounded-3xl overflow-hidden glassmorphic-card-light dark:glassmorphic-card border border-[color:var(--z-border)] dark:border-primary/20 p-8 sm:p-10 shadow-premium flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 bg-cyber-grid-mesh opacity-10 pointer-events-none" />
          <div className="z-10 text-left max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight text-[color:var(--z-ink)] mb-2">Welcome to the CareerVerse</h2>
            <p className="text-[color:var(--z-ink-secondary)] text-sm sm:text-base leading-relaxed">
              Explore your academic assessment paths by taking on real career missions, building core stats, and competing with students across India.
            </p>
          </div>
        </div>

        {/* --- NAVIGATION TABS --- */}
        <div className="flex border-b border-[color:var(--z-border)] gap-6 mb-8 overflow-x-auto pb-0.5 select-none scrollbar-none">
          {[
            { id: "dashboard", label: "Universe Hub", icon: <Compass className="h-4 w-4" /> },
            { id: "board", label: "Day in the Life", icon: <Target className="h-4 w-4" /> },
            { id: "missions", label: "Career Missions", icon: <Brain className="h-4 w-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setActiveMission(null); }}
              className={`flex items-center gap-2 pb-3 text-sm transition-smooth border-b-2 outline-none whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-[color:var(--z-primary)] text-[color:var(--z-primary)] font-serif font-semibold"
                  : "border-transparent text-[color:var(--z-ink-muted)] hover:text-[color:var(--z-ink)] font-normal"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- CONTENT PANELS --- */}
        <AnimatePresence mode="wait">
          {/* TAB 1: UNIVERSE HUB */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid gap-6 md:grid-cols-3"
            >
              {/* Profile Card & Unlocked Paths */}
              <Card className="md:col-span-2 border-[color:var(--z-border)] bg-[color:var(--z-canvas)] shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-serif text-[color:var(--z-ink)] flex items-center gap-2">
                    <UserCheck className="h-5 w-5 text-[color:var(--z-primary)]" />
                    Unlocked Assessment Pathways
                  </CardTitle>
                  <CardDescription className="text-[color:var(--z-ink-muted)]">Careers unlocked dynamically based on your test results.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {unlockedPathsLoading ? (
                    <div className="flex justify-center py-6">
                      <RefreshCw className="h-6 w-6 animate-spin text-[color:var(--z-ink-muted)]" />
                    </div>
                  ) : unlockedPaths.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {unlockedPaths.slice(0, 4).map((career) => (
                        <div key={career} className="p-4 rounded-xl z-selectable-card glow-border-hover flex items-center justify-between">
                          <div>
                            <p className="font-serif font-bold text-[color:var(--z-ink)] text-sm">{career}</p>
                            <p className="text-xs text-[color:var(--z-ink-muted)]">Compatible Choice</p>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium rounded-full">
                            UNLOCKED
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl border border-dashed border-[color:var(--z-border)] bg-[color:var(--z-canvas-soft)]/50 flex flex-col items-center justify-center text-center">
                      <Lock className="h-8 w-8 text-[color:var(--z-ink-muted)]/60 mb-2" />
                      <p className="font-semibold text-sm text-[color:var(--z-ink)]">No Assessment Paths Found</p>
                      <p className="text-xs text-[color:var(--z-ink-muted)] max-w-sm mt-1 mb-4">
                        Please finish your Career Guidance Test first to unlock personalized pathways. Currently playing in Demo mode.
                      </p>
                      <Button size="sm" onClick={() => navigate("/education-level")} className="rounded-full bg-[color:var(--z-primary)] text-[color:var(--z-primary-fg)] hover:bg-[color:var(--z-primary-hover)]">
                        Take Assessment Now
                      </Button>
                    </div>
                  )}

                  {/* Stat Metrics */}
                  <div className="pt-4 border-t border-[color:var(--z-border)]">
                    <h4 className="font-serif font-bold text-sm text-[color:var(--z-ink)] mb-4">Your Career Verse Stats</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: "Technical Skill", val: progress.stats.tech, textColor: "text-blue-500 dark:text-blue-400", bgGlow: "hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:border-blue-500/50" },
                        { label: "Creativity", val: progress.stats.creativity, textColor: "text-pink-500 dark:text-pink-400", bgGlow: "hover:shadow-[0_0_15px_rgba(236,72,153,0.15)] hover:border-pink-500/50" },
                        { label: "Business Sense", val: progress.stats.business, textColor: "text-amber-500 dark:text-amber-400", bgGlow: "hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:border-amber-500/50" },
                        { label: "Focus", val: progress.stats.focus, textColor: "text-emerald-500 dark:text-emerald-400", bgGlow: "hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-500/50" }
                      ].map((stat) => (
                        <div key={stat.label} className={`p-3 rounded-xl border border-[color:var(--z-border)] bg-[color:var(--z-canvas-soft)] transition-smooth text-center ${stat.bgGlow}`}>
                          <p className="text-[10px] uppercase font-bold text-[color:var(--z-ink-muted)]">{stat.label}</p>
                          <p className={`text-xl font-mono font-extrabold mt-1 ${stat.textColor}`}>{stat.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges Panel */}
              <Card className="border-[color:var(--z-border)] bg-[color:var(--z-canvas)] shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-serif text-[color:var(--z-ink)] flex items-center gap-2">
                    <Award className="h-5 w-5 text-[color:var(--z-primary)]" />
                    Badge Collection
                  </CardTitle>
                  <CardDescription className="text-[color:var(--z-ink-muted)]">Badges earned from simulations and choices.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "Fast Learner", desc: "First milestone complete" },
                      { id: "Cyber Safeguard", desc: "Patched a code security breach" },
                      { id: "Pitch Master", desc: "Delivered a killer elevator pitch" },
                      { id: "AI Pioneer", desc: "Trained a high-accuracy neural network" },
                      { id: "Unicorn Founder", desc: "Made a profitable startup launch" },
                      { id: "Tax Wizard", desc: "Perfect audit compliance score" },
                      { id: "Captain's Wings", desc: "Landed commercial flight safely" }
                    ].map((badge) => {
                      const unlocked = progress.badges.includes(badge.id);
                      return (
                        <div
                          key={badge.id}
                          className={`p-3 rounded-xl border text-center transition-smooth flex flex-col items-center justify-center ${
                            unlocked
                              ? "bg-gradient-to-b from-[color:var(--z-canvas)] to-[color:var(--z-primary)]/5 border-[color:var(--z-primary)]/20 shadow-xs animate-holographic text-glow-cyan dark:text-glow-violet"
                              : "bg-[color:var(--z-canvas-soft)]/40 border-dashed border-[color:var(--z-border)] opacity-50"
                          }`}
                        >
                          <Sparkles className={`h-5 w-5 mb-1.5 ${unlocked ? "text-[color:var(--z-primary)] fill-[color:var(--z-primary)]/20 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "text-[color:var(--z-ink-muted)]/30"}`} />
                          <p className="text-xs font-semibold text-[color:var(--z-ink)] truncate w-full">{badge.id}</p>
                          <p className="text-[9px] text-[color:var(--z-ink-muted)] mt-0.5 leading-none">{badge.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* TAB 2: DAY IN THE LIFE BOARD */}
          {activeTab === "board" && (
            <motion.div
              key="board"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <Card className="border-[color:var(--z-border)] bg-[color:var(--z-canvas)] shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg font-serif text-[color:var(--z-ink)] flex items-center gap-2">
                    <Target className="h-5 w-5 text-[color:var(--z-primary)]" />
                    Student Day Timeline Board
                  </CardTitle>
                  <CardDescription className="text-[color:var(--z-ink-muted)]">Navigate through critical daily scenarios to gain XP and core stats.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Timeline Board Visualization */}
                  <div className="relative flex items-center justify-between w-full overflow-x-auto pb-4 select-none scrollbar-none">
                    <div className="absolute top-5 left-0 right-0 h-1 bg-[color:var(--z-border)] z-0" />
                    {["Wake Up", "Lectures", "Collaboration", "Hackathon", "Pitch", "Milestone"].map((step, idx) => {
                      const active = idx === boardStep;
                      const completed = idx < boardStep;
                      return (
                        <div key={step} className="flex flex-col items-center z-10 min-w-[100px]">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center border font-bold text-sm transition-smooth duration-300 ${
                              active
                                ? "bg-[color:var(--z-primary)] border-[color:var(--z-primary)] text-[color:var(--z-primary-fg)] scale-110 shadow-glow"
                                : completed
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                                  : "bg-[color:var(--z-canvas-soft)] border-[color:var(--z-border)] text-[color:var(--z-ink-muted)]"
                            }`}
                          >
                            {completed ? <Check className="h-5 w-5" /> : idx + 1}
                          </div>
                          <span className={`text-xs mt-2 font-medium ${active ? "text-[color:var(--z-primary)] font-bold font-serif" : "text-[color:var(--z-ink-muted)]"}`}>{step}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scenarios Panel */}
                  <div className="p-6 rounded-2xl bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)] relative overflow-hidden">
                    <AnimatePresence mode="wait">
                      {!currentDilemma ? (
                        <motion.div
                          key="start"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center text-center py-6"
                        >
                          <Gamepad2 className="h-10 w-10 text-[color:var(--z-primary)] mb-3 animate-pulse" />
                          <h3 className="font-serif font-bold text-base text-[color:var(--z-ink)]">Ready to face today's challenges?</h3>
                          <p className="text-xs text-[color:var(--z-ink-muted)] max-w-sm mt-1 mb-4">
                            Roll your career dice or step forward into morning scenarios. Make choice decisions affecting your developer parameters.
                          </p>
                          <Button onClick={handleRollDice} className="rounded-full bg-[color:var(--z-primary)] text-[color:var(--z-primary-fg)] hover:bg-[color:var(--z-primary-hover)] shadow-sm">
                            {boardStep === 0 ? "Start Day Timeline" : "Continue Timeline"}
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="dilemma"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-6"
                        >
                          <div>
                            <span className="text-[10px] uppercase font-mono font-bold text-[color:var(--z-primary)] px-2.5 py-1 rounded bg-[color:var(--z-primary)]/10 border border-[color:var(--z-primary)]/20">Dilemma {boardStep + 1}</span>
                            <h3 className="text-lg font-serif font-bold text-[color:var(--z-ink)] mt-3">{currentDilemma.title}</h3>
                            <p className="text-sm text-[color:var(--z-ink-secondary)] mt-2 leading-relaxed">{currentDilemma.scenario}</p>
                          </div>

                          {!dilemmaResult ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                              {currentDilemma.options.map((opt, oIdx) => (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectDilemmaOption(oIdx)}
                                  className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition duration-200 text-[color:var(--z-ink)]"
                                >
                                  {opt.text}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-sm">
                                <p className="font-semibold">Outcome:</p>
                                <p className="mt-1 leading-relaxed">{dilemmaResult}</p>
                              </div>
                              <Button
                                onClick={() => {
                                  setCurrentDilemma(null);
                                  setDilemmaResult(null);
                                  handleRollDice();
                                }}
                                className="rounded-full bg-[color:var(--z-primary)] text-[color:var(--z-primary-fg)] hover:bg-[color:var(--z-primary-hover)] shadow-sm"
                              >
                                {boardStep < 5 ? "Go to Next Challenge" : "Finish Day & Claim Bonus"}
                              </Button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* TAB 3: CAREER MISSIONS */}
          {activeTab === "missions" && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {!activeMission ? (
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
                  {[
                    { id: "ai", title: "AI/ML Engineer", desc: "Build & train a neural network accuracy model.", icon: <Cpu className="h-6 w-6 text-blue-500" />, badge: "AI Pioneer" },
                    { id: "entrepreneur", title: "Entrepreneur", desc: "Manage a startup through 4 key funding rounds.", icon: <TrendingUp className="h-6 w-6 text-pink-500" />, badge: "Unicorn Founder" },
                    { id: "ca", title: "Chartered Accountant", desc: "Audit tax statements & recommend investments.", icon: <Landmark className="h-6 w-6 text-amber-500" />, badge: "Tax Wizard" },
                    { id: "pilot", title: "Commercial Pilot", desc: "Navigate weather emergency flights safely.", icon: <Plane className="h-6 w-6 text-emerald-500" />, badge: "Captain's Wings" }
                  ].map((mission) => {
                    const achieved = progress.badges.includes(mission.badge);
                    return (
                      <Card
                        key={mission.id}
                        onClick={() => setActiveMission(mission.id as any)}
                        className="cursor-pointer border-[color:var(--z-border)] bg-[color:var(--z-canvas)] z-selectable-card glow-border-hover transition-all"
                      >
                        <CardHeader className="pb-2">
                          <div className="p-3 bg-[color:var(--z-canvas-soft)] rounded-xl w-fit mb-2 border border-[color:var(--z-border)]">
                            {mission.icon}
                          </div>
                          <CardTitle className="text-base font-serif font-bold flex items-center justify-between text-[color:var(--z-ink)]">
                            <span>{mission.title}</span>
                            {achieved && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" />}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-[color:var(--z-ink-muted)] leading-relaxed">{mission.desc}</p>
                          <div className="mt-4 flex items-center gap-1.5 text-xs text-[color:var(--z-primary)] font-semibold">
                            <span>Launch Simulator</span>
                            <ChevronRight className="h-4 w-4" />
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Active Simulator Header */}
                  <div className="flex items-center justify-between bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)] p-4 rounded-2xl shadow-card">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="z-icon-button rounded-full" onClick={() => setActiveMission(null)}>
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                      <h3 className="font-serif font-extrabold text-base text-[color:var(--z-ink)] capitalize">{activeMission} Simulator</h3>
                    </div>
                    <Badge variant="outline" className="border-[color:var(--z-primary)]/20 text-[color:var(--z-primary)] font-semibold">Mission Active</Badge>
                  </div>

                  {/* Simulator Screen */}
                  <Card className="border-[color:var(--z-border)] bg-[color:var(--z-canvas)] shadow-premium overflow-hidden">
                    <CardContent className="p-6">
                      {/* SIMULATOR 1: AI ENGINEER */}
                      {activeMission === "ai" && (
                        <div className="grid gap-6 md:grid-cols-2">
                          {/* Hyperparameter Settings */}
                          <div className="space-y-4 bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)] p-5 rounded-2xl">
                            <h4 className="font-serif font-bold text-sm text-[color:var(--z-ink)] flex items-center gap-1.5">
                              <Brain className="h-4 w-4 text-blue-500" /> Neural Network Configuration
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="learningRateRange" className="text-xs text-[color:var(--z-ink-muted)] flex justify-between font-mono">
                                  <span>Learning Rate:</span>
                                  <span className="font-bold text-[color:var(--z-primary)] text-glow-cyan">{learningRate}</span>
                                </label>
                                <input
                                  type="range"
                                  min="0.001"
                                  max="0.5"
                                  step="0.005"
                                  id="learningRateRange"
                                  value={learningRate}
                                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                                  disabled={aiTraining}
                                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[color:var(--z-primary)] mt-2"
                                />
                              </div>
                              <div>
                                <label htmlFor="epochsRange" className="text-xs text-[color:var(--z-ink-muted)] flex justify-between font-mono">
                                  <span>Epochs (Training Runs):</span>
                                  <span className="font-bold text-[color:var(--z-primary)] text-glow-cyan">{epochs}</span>
                                </label>
                                <input
                                  type="range"
                                  min="5"
                                  max="40"
                                  step="1"
                                  id="epochsRange"
                                  value={epochs}
                                  onChange={(e) => setEpochs(parseInt(e.target.value))}
                                  disabled={aiTraining}
                                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[color:var(--z-primary)] mt-2"
                                />
                              </div>
                              <div className="pt-2 flex items-center justify-between">
                                <label className="text-xs text-[color:var(--z-ink-muted)] font-mono">Batch Size:</label>
                                <div className="flex gap-1.5">
                                  {[16, 32, 64, 128].map((size) => (
                                    <Button
                                      key={size}
                                      size="sm"
                                      variant={batchSize === size ? "default" : "outline"}
                                      className={`h-7 w-10 text-xs px-0 rounded transition-smooth font-mono ${
                                        batchSize === size 
                                          ? "bg-[color:var(--z-primary)] text-[color:var(--z-primary-fg)]" 
                                          : "border-[color:var(--z-border)] text-[color:var(--z-ink-muted)] bg-[color:var(--z-canvas)]"
                                      }`}
                                      disabled={aiTraining}
                                      onClick={() => setBatchSize(size)}
                                    >
                                      {size}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div className="pt-2 space-y-3 border-t border-[color:var(--z-border)]">
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="checkbox"
                                    id="norm"
                                    checked={normalization}
                                    onChange={(e) => setNormalization(e.target.checked)}
                                    disabled={aiTraining}
                                    className="rounded border-[color:var(--z-border)] text-[color:var(--z-primary)] focus:ring-[color:var(--z-primary)] h-4 w-4 bg-[color:var(--z-canvas)] cursor-pointer"
                                  />
                                  <label htmlFor="norm" className="text-xs text-[color:var(--z-ink-secondary)] font-medium cursor-pointer">Enable Input Feature Normalization</label>
                                </div>
                                <div className="flex items-center gap-2.5">
                                  <input
                                    type="checkbox"
                                    id="clean"
                                    checked={cleanData}
                                    onChange={(e) => setCleanData(e.target.checked)}
                                    disabled={aiTraining}
                                    className="rounded border-[color:var(--z-border)] text-[color:var(--z-primary)] focus:ring-[color:var(--z-primary)] h-4 w-4 bg-[color:var(--z-canvas)] cursor-pointer"
                                  />
                                  <label htmlFor="clean" className="text-xs text-[color:var(--z-ink-secondary)] font-medium cursor-pointer">Remove dataset anomalies and null values</label>
                                </div>
                              </div>
                            </div>
                            <Button 
                              onClick={handleTrainAI} 
                              disabled={aiTraining} 
                              className="w-full rounded-full bg-[color:var(--z-primary)] hover:bg-[color:var(--z-primary-hover)] text-[color:var(--z-primary-fg)] mt-4 font-serif font-semibold"
                            >
                              {aiTraining ? `Training Epoch ${aiEpochProgress}/${epochs}...` : "Execute Model Training"}
                            </Button>
                          </div>

                          {/* Output Terminal */}
                          <div className="bg-slate-950 text-cyan-400 p-5 rounded-2xl font-mono text-[11px] h-[340px] overflow-y-auto space-y-1 relative shadow-inner scanline-overlay border border-slate-800">
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded text-[9px] border border-cyan-500/20 text-glow-cyan z-20">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                              <span>Val Accuracy: {(aiAccuracy * 100).toFixed(0)}%</span>
                            </div>
                            <div className="space-y-1 z-10 relative">
                              <p className="text-slate-500">// Neural Network Training Streams</p>
                              {aiOutputLog.map((log, index) => (
                                <p key={index} className="text-glow-cyan">{log}</p>
                              ))}
                              {aiTraining && <p className="animate-pulse text-cyan-400 text-glow-cyan">_</p>}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SIMULATOR 2: ENTREPRENEUR */}
                      {activeMission === "entrepreneur" && (
                        <div className="space-y-6">
                          <div className="flex items-center justify-between border-b border-[color:var(--z-border)] pb-4">
                            <h4 className="font-serif font-bold text-sm text-[color:var(--z-ink)] flex items-center gap-1.5">
                              <TrendingUp className="h-4 w-4 text-pink-500" /> Startup Capital: <span className="font-mono text-pink-500 text-glow-violet">${startupFunding.toLocaleString()}</span>
                            </h4>
                            <span className="text-xs text-[color:var(--z-ink-muted)] font-bold font-mono">Stage {startupStep} of 5</span>
                          </div>

                          {startupStep === 1 && (
                            <div className="space-y-4">
                              <p className="text-sm text-[color:var(--z-ink-secondary)] leading-relaxed">
                                <span className="font-bold text-[color:var(--z-ink)]">Step 1: Product Development.</span> How much capital will you allocate to coding the Minimum Viable Product (MVP)?
                              </p>
                              <div className="grid gap-4 sm:grid-cols-3">
                                {[
                                  { id: "cheap", label: "Cheap Outsourced Code", desc: "Basic functionality, poor architecture.", cost: 10000 },
                                  { id: "standard", label: "In-House MVP", desc: "Balanced performance, scalable.", cost: 20000 },
                                  { id: "premium", label: "State-Of-The-Art Build", desc: "Premium security, microservices.", cost: 35000 }
                                ].map((choice) => (
                                  <button
                                    key={choice.id}
                                    onClick={() => handleStartupChoice("mvp", choice.id as any, choice.cost)}
                                    className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition flex flex-col justify-between text-[color:var(--z-ink)]"
                                  >
                                    <div>
                                      <p className="font-serif font-bold text-sm">{choice.label}</p>
                                      <p className="text-xs text-[color:var(--z-ink-muted)] mt-1.5">{choice.desc}</p>
                                    </div>
                                    <p className="text-xs text-pink-500 font-bold font-mono mt-5">${choice.cost.toLocaleString()}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {startupStep === 2 && (
                            <div className="space-y-4">
                              <p className="text-sm text-[color:var(--z-ink-secondary)] leading-relaxed">
                                <span className="font-bold text-[color:var(--z-ink)]">Step 2: Engineering Team.</span> Who will you hire to build features?
                              </p>
                              <div className="grid gap-4 sm:grid-cols-3">
                                {[
                                  { id: "freelance", label: "Freelance Contractors", desc: "High churn rate, low cost.", cost: 5000 },
                                  { id: "senior", label: "Senior Lead Engineer", desc: "Strong architectural design guidance.", cost: 15000 },
                                  { id: "agency", label: "Full Agency Engagement", desc: "Turnkey delivery, high expenses.", cost: 25000 }
                                ].map((choice) => (
                                  <button
                                    key={choice.id}
                                    onClick={() => handleStartupChoice("team", choice.id as any, choice.cost)}
                                    className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition flex flex-col justify-between text-[color:var(--z-ink)]"
                                  >
                                    <div>
                                      <p className="font-serif font-bold text-sm">{choice.label}</p>
                                      <p className="text-xs text-[color:var(--z-ink-muted)] mt-1.5">{choice.desc}</p>
                                    </div>
                                    <p className="text-xs text-pink-500 font-bold font-mono mt-5">${choice.cost.toLocaleString()}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {startupStep === 3 && (
                            <div className="space-y-4">
                              <p className="text-sm text-[color:var(--z-ink-secondary)] leading-relaxed">
                                <span className="font-bold text-[color:var(--z-ink)]">Step 3: Marketing & Sales.</span> How will you drive users and client onboarding?
                              </p>
                              <div className="grid gap-4 sm:grid-cols-3">
                                {[
                                  { id: "social", label: "Targeted Social Ads", desc: "Steady reach, predictable CAC.", cost: 5000 },
                                  { id: "influencer", label: "Influencer Partnerships", desc: "Fast user spike, moderate cost.", cost: 15000 },
                                  { id: "viral", label: "High-Risk Viral Campaign", desc: "Could fail or net huge rewards.", cost: 25000 }
                                ].map((choice) => (
                                  <button
                                    key={choice.id}
                                    onClick={() => handleStartupChoice("marketing", choice.id as any, choice.cost)}
                                    className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition flex flex-col justify-between text-[color:var(--z-ink)]"
                                  >
                                    <div>
                                      <p className="font-serif font-bold text-sm">{choice.label}</p>
                                      <p className="text-xs text-[color:var(--z-ink-muted)] mt-1.5">{choice.desc}</p>
                                    </div>
                                    <p className="text-xs text-pink-500 font-bold font-mono mt-5">${choice.cost.toLocaleString()}</p>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {startupStep === 4 && (
                            <div className="p-8 rounded-2xl bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)] text-center space-y-4">
                              <h5 className="font-serif font-bold text-base text-[color:var(--z-ink)]">Launch Phase Completed!</h5>
                              <p className="text-xs text-[color:var(--z-ink-muted)] max-w-sm mx-auto">
                                All budgets allocated. Click below to assess market validation and calculate revenue outcomes.
                              </p>
                              <Button onClick={handleRunStartupOutcome} className="rounded-full bg-[color:var(--z-primary)] text-[color:var(--z-primary-fg)] hover:bg-[color:var(--z-primary-hover)] font-serif font-semibold">Run Financial Audit</Button>
                            </div>
                          )}

                          {startupStep === 5 && (
                            <div className="space-y-4">
                              {/* Financial CRT Monitor */}
                              <div className="bg-slate-950 text-cyan-400 p-5 rounded-2xl font-mono text-xs space-y-1.5 scanline-overlay border border-slate-800">
                                <p className="text-slate-500">// Startup Audit Report</p>
                                {startupLog.map((log, idx) => (
                                  <p key={idx} className="text-glow-cyan">{log}</p>
                                ))}
                              </div>
                              <Button onClick={resetStartupMission} className="rounded-full bg-[color:var(--z-primary)] text-[color:var(--z-primary-fg)] hover:bg-[color:var(--z-primary-hover)] font-serif font-semibold">Relaunch Simulator</Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* SIMULATOR 3: CHARTERED ACCOUNTANT */}
                      {activeMission === "ca" && (
                        <div className="space-y-6">
                          <h4 className="font-serif font-bold text-sm text-[color:var(--z-ink)] flex items-center gap-1.5">
                            <Landmark className="h-4 w-4 text-amber-500" /> Tax Advisory Scenarios
                          </h4>

                          {!caSubmitted ? (
                            <div className="space-y-6">
                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-[color:var(--z-ink)]">1. Client earns ₹15 Lakhs. Which standard Indian tax exemption provides maximum deduction up to ₹1.5 Lakhs?</p>
                                <div className="grid gap-3 sm:grid-cols-3">
                                  {[
                                    { id: "ppf", label: "Section 80C (PPF/ELSS)" },
                                    { id: "crypto", label: "Capital losses on Bitcoin" },
                                    { id: "car", label: "Section 80EE (Luxury car)" }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => setCaAnswers((prev) => ({ ...prev, 1: opt.id }))}
                                      className={`p-3 rounded-lg border text-left text-xs font-medium transition-smooth ${
                                        caAnswers[1] === opt.id 
                                          ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]" 
                                          : "border-[color:var(--z-border)] bg-[color:var(--z-canvas)] text-[color:var(--z-ink-secondary)] hover:border-amber-500/50 hover:bg-[color:var(--z-canvas-soft)]"
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-[color:var(--z-ink)]">2. Client sold a property, earning ₹5 Lakhs capital gains. How can they offset this liability legally?</p>
                                <div className="grid gap-3 sm:grid-cols-3">
                                  {[
                                    { id: "sec54", label: "Section 54 (Reinvest in housing)" },
                                    { id: "gift", label: "Report as cash gift" },
                                    { id: "gold", label: "Buy physical gold bullion" }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => setCaAnswers((prev) => ({ ...prev, 2: opt.id }))}
                                      className={`p-3 rounded-lg border text-left text-xs font-medium transition-smooth ${
                                        caAnswers[2] === opt.id 
                                          ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]" 
                                          : "border-[color:var(--z-border)] bg-[color:var(--z-canvas)] text-[color:var(--z-ink-secondary)] hover:border-amber-500/50 hover:bg-[color:var(--z-canvas-soft)]"
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="space-y-3">
                                <p className="text-xs font-semibold text-[color:var(--z-ink)]">3. A high-growth tech startup needs long-term expansion capital without taking on high bank interest rates. What do you advise?</p>
                                <div className="grid gap-3 sm:grid-cols-3">
                                  {[
                                    { id: "equity", label: "Dilutive Venture Capital Seed" },
                                    { id: "loan", label: "High-Interest Personal Loan" },
                                    { id: "card", label: "Maxing credit card debt limit" }
                                  ].map((opt) => (
                                    <button
                                      key={opt.id}
                                      onClick={() => setCaAnswers((prev) => ({ ...prev, 3: opt.id }))}
                                      className={`p-3 rounded-lg border text-left text-xs font-medium transition-smooth ${
                                        caAnswers[3] === opt.id 
                                          ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.2)]" 
                                          : "border-[color:var(--z-border)] bg-[color:var(--z-canvas)] text-[color:var(--z-ink-secondary)] hover:border-amber-500/50 hover:bg-[color:var(--z-canvas-soft)]"
                                      }`}
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <Button 
                                onClick={handleCaSubmit} 
                                disabled={Object.keys(caAnswers).length !== 3} 
                                className="w-full rounded-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 text-white font-serif font-semibold mt-4"
                              >
                                Submit Tax Audit Report
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="p-4 rounded-xl border border-[color:var(--z-border)] bg-[color:var(--z-canvas-soft)] space-y-2">
                                <div className="flex items-center justify-between text-xs border-b border-[color:var(--z-border)] pb-2">
                                  <span className="text-[color:var(--z-ink-secondary)]">Deduction Exemption:</span>
                                  <span className={caAnswers[1] === "ppf" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                                    {caAnswers[1] === "ppf" ? "Correct" : "Incorrect"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs border-b border-[color:var(--z-border)] pb-2">
                                  <span className="text-[color:var(--z-ink-secondary)]">Offset Capital Gains:</span>
                                  <span className={caAnswers[2] === "sec54" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                                    {caAnswers[2] === "sec54" ? "Correct" : "Incorrect"}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-[color:var(--z-ink-secondary)]">Startup Capital Advice:</span>
                                  <span className={caAnswers[3] === "equity" ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>
                                    {caAnswers[3] === "equity" ? "Correct" : "Incorrect"}
                                  </span>
                                </div>
                              </div>
                              <Button onClick={resetCaMission} className="rounded-full bg-amber-500 hover:bg-amber-600 text-white font-serif font-semibold">Retry Advisor Scenario</Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* SIMULATOR 4: COMMERCIAL PILOT */}
                      {activeMission === "pilot" && (
                        <div className="space-y-6">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[color:var(--z-border)] pb-4 gap-4">
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                              <div className="flex flex-col w-full sm:w-36">
                                <div className="flex justify-between text-xs font-semibold text-emerald-600 mb-1.5">
                                  <span>Aircraft Safety</span>
                                  <span className="font-mono">{pilotSafety}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                                  <div className={`bg-emerald-500 h-full rounded-full transition-smooth shadow-[0_0_10px_#10b981] ${pctToWidthClass(pilotSafety)}`} />
                                </div>
                              </div>
                              <div className="flex flex-col w-full sm:w-36">
                                <div className="flex justify-between text-xs font-semibold text-cyan-600 mb-1.5">
                                  <span>Fuel Level</span>
                                  <span className="font-mono">{pilotFuel}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden relative shadow-[0_0_8px_rgba(6,182,212,0.2)]">
                                  <div className={`bg-cyan-500 h-full rounded-full transition-smooth shadow-[0_0_10px_#06b6d4] ${pctToWidthClass(pilotFuel)}`} />
                                </div>
                              </div>
                            </div>
                            <span className="text-xs text-[color:var(--z-ink-muted)] font-bold font-mono self-start sm:self-center">Approach Phase {pilotStep} of 5</span>
                          </div>

                          {pilotStep < 5 ? (
                            <div className="space-y-4">
                              <p className="text-sm font-serif font-semibold text-[color:var(--z-ink)]">
                                {pilotStep === 1 && "Stage 1: Pre-flight briefing reports monsoonal storms over the route. Choice?"}
                                {pilotStep === 2 && "Stage 2: Engine 1 temperature exceeds thresholds. Choice?"}
                                {pilotStep === 3 && "Stage 3: Fuel leak detected in wing manifold. Choice?"}
                                {pilotStep === 4 && "Stage 4: Strong 25 knots crosswinds on final runway approach. Choice?"}
                              </p>

                              <div className="grid gap-3 sm:grid-cols-2">
                                {pilotStep === 1 && (
                                  <>
                                    <button 
                                      onClick={() => handlePilotChoice(0)} 
                                      className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition-smooth text-[color:var(--z-ink)] hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                                    >
                                      File detour route around storms (+15% fuel burn)
                                    </button>
                                    <button 
                                      onClick={() => handlePilotChoice(1)} 
                                      className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition-smooth text-[color:var(--z-ink)] hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                                    >
                                      Proceed through storm zone (saves fuel, risks passenger comfort)
                                    </button>
                                  </>
                                )}
                                {pilotStep === 2 && (
                                  <>
                                    <button 
                                      onClick={() => handlePilotChoice(0)} 
                                      className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition-smooth text-[color:var(--z-ink)] hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                                    >
                                      Shut down Engine 1 and divert flight plan
                                    </button>
                                    <button 
                                      onClick={() => handlePilotChoice(1)} 
                                      className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition-smooth text-[color:var(--z-ink)] hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                                    >
                                      Maintain throttle and attempt landing at destination
                                    </button>
                                  </>
                                )}
                                {pilotStep === 3 && (
                                  <>
                                    <button 
                                      onClick={() => handlePilotChoice(0)} 
                                      className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition-smooth text-[color:var(--z-ink)] hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                                    >
                                      Initiate fuel crossfeed to balance wing weights
                                    </button>
                                    <button 
                                      onClick={() => handlePilotChoice(1)} 
                                      className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition-smooth text-[color:var(--z-ink)] hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                                    >
                                      Continue standard operations
                                    </button>
                                  </>
                                )}
                                {pilotStep === 4 && (
                                  <>
                                    <button 
                                      onClick={() => handlePilotChoice(0)} 
                                      className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition-smooth text-[color:var(--z-ink)] hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                                    >
                                      Execute manual crab-landing alignment technique
                                    </button>
                                    <button 
                                      onClick={() => handlePilotChoice(1)} 
                                      className="p-4 rounded-xl z-selectable-card glow-border-hover text-left text-sm font-medium transition-smooth text-[color:var(--z-ink)] hover:shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                                    >
                                      Enable autoland override system
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {/* Flight Black-Box CRT Monitor */}
                              <div className="bg-slate-950 text-emerald-400 p-5 rounded-2xl font-mono text-xs space-y-1.5 scanline-overlay border border-slate-800">
                                <p className="text-slate-500">// Flight Black-Box Record Log</p>
                                {pilotLog.map((log, idx) => (
                                  <p key={idx} className="text-glow-cyan">{log}</p>
                                ))}
                              </div>
                              <Button onClick={resetPilotMission} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-serif font-semibold">Replay Flight Simulator</Button>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
