import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles, TrendingUp, Share2, Check, Copy, Link2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import { AdUnit } from "@/components/AdUnit";

/* ── Share slug: cryptographically stronger than Math.random (unguessable links) ── */
const generateSlug = (len = 12) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

type ResultsLocationState = {
  educationLevel?: string;
  class9Marks?: unknown;
  class10Marks?: unknown;
  class11Subjects?: unknown;
  class12Subjects?: unknown;
  interests?: unknown;
  answers?: Record<string, number | string>;
  questions?: unknown[];
  marks?: number;
  customAnswers?: Record<number, string>;
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as ResultsLocationState;
  const {
    educationLevel,
    class9Marks,
    class10Marks,
    class11Subjects,
    class12Subjects,
    interests,
    answers,
    questions,
    marks,
    customAnswers,
  } = state;

  const hasQuizPayload =
    !!answers &&
    !!questions &&
    Array.isArray(questions) &&
    questions.length > 0 &&
    typeof answers === "object" &&
    Object.keys(answers).length > 0;

  /** Quiz flow only sends answers/questions; education wizard sends educationLevel. */
  const effectiveEducationLevel = educationLevel ?? (hasQuizPayload ? "after-12th" : undefined);

  const persistStartedRef = useRef(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Mock AI-generated strengths analysis
  const strengths = effectiveEducationLevel === 'after-10th' 
    ? "The student exhibits strong foundational skills across core subjects, with particularly notable performance in Mathematics and Science. Their expressed interests in technology and problem-solving align well with analytical and computational fields. The combination of academic performance and stated passions indicates a natural aptitude for systematic thinking and creative problem-solving."
    : "The student exhibits exceptional academic performance across all subjects, particularly in English, Mathematics, and Science, indicating strong analytical and problem-solving abilities. Their stated interest in technology and cybersecurity is well-supported by their responses, which highlight a preference for software design, algorithmic thinking, and a foundational understanding of logic gates. While showing a desire for structured learning and deep mastery, their inclination towards creative problem-solving and contributing to cutting-edge research suggests a strong alignment between their interests and aptitudes for STEM fields, especially those involving computing and engineering.";

  // Mock recommended career paths
  const recommendations = effectiveEducationLevel === 'after-10th' ? [
    {
      stream: "Science (PCM with Computer Science)",
      category: "Core Technology & Engineering",
      match: 95,
      description: "This stream directly aligns with strong performance in Math and Science, coupled with interests in technology. It provides a robust foundation for pursuing higher education in computer science, software engineering, or related fields.",
      reasons: [
        "Strong performance in Mathematics and Science",
        "Stated interest in technology and problem-solving",
        "Excellent foundation for engineering and technical careers",
        "Opens doors to IITs, NITs, and top engineering colleges"
      ],
      careers: [
        "Software Engineer",
        "Data Scientist",
        "AI/ML Engineer",
        "Computer Hardware Engineer",
        "Research Scientist"
      ]
    },
    {
      stream: "Science (PCB with Mathematics)",
      category: "Medical & Life Sciences",
      match: 85,
      description: "Strong Science fundamentals combined with mathematical aptitude create excellent preparation for medical sciences and biological research careers.",
      reasons: [
        "Excellent Science performance with analytical skills",
        "Mathematical foundation supports advanced medical studies",
        "Opens pathways to MBBS, BDS, and healthcare careers",
        "Research opportunities in biotechnology and pharmacology"
      ],
      careers: [
        "Doctor (MBBS)",
        "Dentist",
        "Biotechnologist",
        "Pharmacologist",
        "Medical Researcher"
      ]
    },
    {
      stream: "Commerce with Mathematics",
      category: "Business & Finance",
      match: 75,
      description: "Mathematical aptitude can be leveraged in commerce stream for careers in finance, accounting, and business analytics.",
      reasons: [
        "Strong mathematical foundation supports quantitative analysis",
        "Opens doors to CA, CS, and business management",
        "Growing demand for financial analysts and business strategists",
        "Entrepreneurship opportunities"
      ],
      careers: [
        "Chartered Accountant",
        "Financial Analyst",
        "Business Analyst",
        "Investment Banker",
        "Management Consultant"
      ]
    }
  ] : [
    {
      stream: "Science (PCM with Computer Science)",
      category: "Core Technology & Engineering",
      match: 95,
      description: "This stream directly aligns with the student's strong academic performance in Math and Science, coupled with their explicit interest in technology and cybersecurity, particularly software design and algorithms. It provides a robust foundation for pursuing higher education in computer science, software engineering, or related fields, preparing them for roles involving innovation and research.",
      reasons: [
        "Exceptional performance in Mathematics and Science, crucial for this stream",
        "Stated interest in designing new software, developing algorithms, and coding solutions",
        "Preference for learning new programming languages and contributing to cutting-edge research",
        "Direct alignment with their preferred subject combination for 11th-12th grade: Physics, Chemistry, Mathematics, Computer Science"
      ],
      careers: [
        "Software Engineer",
        "Cybersecurity Analyst (with further specialization)",
        "Data Scientist",
        "AI/ML Engineer",
        "Computer Hardware Engineer"
      ]
    },
    {
      stream: "Science (PCM with Electronics)",
      category: "Hardware & Systems Engineering",
      match: 88,
      description: "Given the student's interest in 'logic gates and circuit design' and their strong aptitude in Physics and Mathematics, this stream offers an excellent pathway. It allows for a deeper dive into the foundational hardware aspects of technology, which are integral to both computing and cybersecurity infrastructure, while still leveraging their problem-solving skills.",
      reasons: [
        "Strong performance in Physics and Mathematics, essential for electronics",
        "Specific interest in 'logic gates and circuit design' indicates an aptitude for hardware",
        "Provides a complementary understanding to software, crucial for a holistic view of technology",
        "Offers a different avenue for contributing to cutting-edge advancements beyond pure software"
      ],
      careers: [
        "Electronics Engineer",
        "Embedded Systems Engineer",
        "VLSI Design Engineer",
        "Robotics Engineer",
        "Network Hardware Engineer"
      ]
    },
    {
      stream: "Science (PCMB / with Biotechnology)",
      category: "Interdisciplinary Technology & Research",
      match: 75,
      description: "While not directly stated, the student's high performance in Science and interest in 'cutting-edge research' could be channeled into interdisciplinary fields like Bioinformatics or Computational Biology. This stream combines strong analytical skills with biological knowledge, opening doors to advanced research roles where technology is applied to solve complex biological problems.",
      reasons: [
        "Excellent performance in Science, providing a strong foundation for biology",
        "Interest in 'cutting-edge research and advancements' could extend to interdisciplinary fields",
        "High academic aptitude suggests an ability to master diverse scientific concepts",
        "Offers a unique application of technology and algorithmic thinking in a different scientific domain"
      ],
      careers: [
        "Bioinformatician",
        "Computational Biologist",
        "Biomedical Engineer (with software/hardware focus)",
        "Biotechnology Researcher",
        "Pharmaceutical Data Scientist"
      ]
    }
  ];

  /* ── Save career history + auto-generate shareable link ── */
  useEffect(() => {
    if (!effectiveEducationLevel) return;
    if (persistStartedRef.current) return;
    persistStartedRef.current = true;

    const slug = generateSlug();
    const top = recommendations[0];
    let cancelled = false;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return;

      // 1. Save career history (logged-in users only)
      if (session?.user) {
        await supabase.from("career_history").insert({
          user_id: session.user.id,
          education_level: effectiveEducationLevel,
          top_recommendation: top?.stream ?? null,
          top_match_percent: top?.match ?? null,
          all_recommendations: recommendations.map(r => ({ stream: r.stream, match: r.match, category: r.category })),
        });
      }

      if (cancelled) return;

      // 2. Save shareable result (works for guests too)
      const { error } = await supabase.from("shared_results").insert({
        slug,
        user_id: session?.user?.id ?? null,
        education_level: effectiveEducationLevel,
        strengths,
        recommendations,
        top_recommendation: top?.stream ?? null,
        top_match_percent: top?.match ?? null,
        display_name: session?.user?.user_metadata?.full_name ?? null,
      });

      if (!cancelled && !error) setShareSlug(slug);
    });

    return () => {
      cancelled = true;
      persistStartedRef.current = false;
    };
  }, [effectiveEducationLevel, strengths, recommendations]);

  if (!effectiveEducationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  const shareUrl = shareSlug ? `${window.location.origin}/r/${shareSlug}` : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied! 🔗", description: "Share it with friends, parents or teachers." });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <SEO 
        title="Your Career Results" 
        description="View your personalized career recommendations based on our AI aptitude test. Find your perfect professional match."
        canonical="/results"
      />
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Assessment Complete
                </h1>
              </div>
            </div>
            {/* Share button in header for quick access */}
            {shareUrl && (
              <Button
                id="results-share-header-btn"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-full gap-2 hidden sm:flex"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Results"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Your Personalized Career Path</h2>
          <p className="text-muted-foreground">
            Based on your academic performance and assessment responses, here are our recommendations
          </p>
        </div>

        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{strengths}</p>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6">Recommended Career Paths</h3>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="shadow-card border-2 hover:border-primary/50 transition-smooth">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{rec.stream}</CardTitle>
                      <CardDescription className="text-base">{rec.category}</CardDescription>
                    </div>
                    <Badge className="bg-gradient-primary text-lg px-4 py-1">{rec.match}% Match</Badge>
                  </div>
                  {/* Top Results Ad */}
                  <AdUnit slot="5555555555" className="!my-4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{rec.description}</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      Why this is great for you:
                    </h4>
                    <ul className="space-y-1 ml-6">
                      {rec.reasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground list-disc">{reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Career Options:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.careers.map((career, idx) => (
                        <Badge key={idx} variant="secondary">{career}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Shareable Link Card ── */}
        {shareUrl && (
          <Card className="shadow-card mb-6 border-primary/20 bg-primary/5 dark:bg-primary/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Link2 className="h-5 w-5 text-primary" />
                Share Your Results
              </CardTitle>
              <CardDescription>
                Anyone with this link can view your career recommendations — no login required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* URL display box */}
              <div className="flex items-center gap-2 bg-background rounded-lg border border-border/60 px-3 py-2.5 text-sm">
                <span className="text-muted-foreground flex-1 truncate font-mono text-xs">{shareUrl}</span>
                <Button
                  id="results-copy-link-btn"
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  onClick={handleCopy}
                  className={`shrink-0 rounded-md gap-1.5 transition-all ${
                    copied ? "bg-green-500 hover:bg-green-500 text-white border-green-500" : ""
                  }`}
                >
                  {copied ? (
                    <><Check className="h-3.5 w-3.5" /> Copied!</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy Link</>
                  )}
                </Button>
              </div>
              {/* Share via buttons */}
              <div className="flex flex-wrap gap-2">
                <a
                  id="results-share-whatsapp"
                  href={`https://wa.me/?text=${encodeURIComponent(`🎓 Check out my Zertainity career results! ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 hover:bg-muted/40 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  id="results-share-twitter"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just discovered my career path with Zertainity! 🎓✨`)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-border/60 hover:bg-muted/40 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter / X
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-card bg-gradient-primary text-center">
          <CardHeader>
            <CardTitle className="text-primary-foreground text-2xl">Ready to Start Your Journey?</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Take the next step towards your future. Research these paths and talk to your teachers and counselors.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button variant="secondary" size="lg" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            {shareUrl && (
              <Button
                id="results-share-mobile-btn"
                variant="outline"
                size="lg"
                onClick={handleCopy}
                className="border-white/30 text-white hover:bg-white/10 bg-transparent gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Results"}
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
