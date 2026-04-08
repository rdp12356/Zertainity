import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck, Brain, GraduationCap, ChevronRight, Loader2 } from "lucide-react";

type AuthView = "login" | "signup" | "forgot";

/* ─── Password Strength ─────────────────────────────────────────────── */
const getPasswordStrength = (pwd: string) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const map = [
    { label: "Too weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-400" },
    { label: "Fair", color: "bg-yellow-400" },
    { label: "Good", color: "bg-emerald-400" },
    { label: "Strong", color: "bg-green-500" },
  ];
  return { score, ...map[score] };
};

/* ─── Floating Particle ─────────────────────────────────────────────── */
const Particle = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute rounded-full opacity-20 animate-pulse"
    style={style}
  />
);

const Auth = () => {
  const [view, setView] = useState<AuthView>("login");
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const strength = getPasswordStrength(password);

  /* ── Particles config ── */
  const particles = [
    { width: 120, height: 120, top: "8%", left: "12%", background: "hsl(198 93% 59%)", animationDelay: "0s", animationDuration: "3s" },
    { width: 80, height: 80, top: "65%", left: "5%", background: "hsl(210 80% 70%)", animationDelay: "1s", animationDuration: "4s" },
    { width: 60, height: 60, top: "30%", left: "75%", background: "hsl(200 98% 50%)", animationDelay: "0.5s", animationDuration: "3.5s" },
    { width: 40, height: 40, top: "80%", left: "60%", background: "hsl(190 80% 60%)", animationDelay: "2s", animationDuration: "5s" },
    { width: 90, height: 90, top: "50%", left: "40%", background: "hsl(215 70% 55%)", animationDelay: "1.5s", animationDuration: "4.5s" },
  ];

  const features = [
    { icon: Brain, label: "AI-powered career discovery" },
    { icon: GraduationCap, label: "Personalised academic pathways" },
    { icon: ShieldCheck, label: "Secure & private by design" },
  ];

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .in("role", ["admin", "owner", "manager", "editor"]);
      if (roles && roles.length > 0) navigate("/admin");
      else navigate("/settings");
    }, 0);
    return () => clearTimeout(timer);
  }, [user, navigate]);

  /* ── Handlers ── */
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Welcome back 👋", description: "You've successfully signed in." });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast({ title: "Almost there! 🎉", description: "Check your inbox for a verification link." });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An error occurred", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Check your email", description: "We've sent a password reset link to your inbox." });
      setView("login");
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to sign in with Google", variant: "destructive" });
      setLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to sign in with GitHub", variant: "destructive" });
      setLoading(false);
    }
  };

  const switchView = (v: AuthView) => {
    setView(v);
    setIsLogin(v === "login");
    setPassword("");
    setShowPassword(false);
  };

  /* ─────────────────────────── RENDER ─────────────────────────────── */
  return (
    <div className="min-h-screen flex bg-background">

      {/* ── Left Hero Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden gradient-hero flex-col items-center justify-center p-12 text-white">
        {/* Animated particles */}
        {particles.map((p, i) => (
          <Particle key={i} style={{
            width: p.width, height: p.height,
            top: p.top, left: p.left,
            background: p.background,
            filter: "blur(40px)",
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
          }} />
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-sm text-center space-y-8 animate-float-up">
          {/* Brand */}
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Zertainity</span>
          </Link>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight">
              Discover your<br />
              <span className="text-cyan-300">perfect pathway</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              AI-powered career guidance personalised to your academic strengths and ambitions.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/20 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-cyan-300" />
                </div>
                <span className="text-sm font-medium text-white/90">{label}</span>
                <ChevronRight className="w-4 h-4 text-white/40 ml-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom credit */}
        <p className="absolute bottom-6 text-white/40 text-xs">
          © {new Date().getFullYear()} Zertainity · Empowering students
        </p>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md space-y-6 animate-float-up">

          {/* Back to home */}
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>

          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              {view === "forgot"
                ? "Reset password"
                : view === "login"
                ? "Welcome back"
                : "Create account"}
            </h2>
            <p className="text-muted-foreground text-sm">
              {view === "forgot"
                ? "Enter your email to receive a reset link"
                : view === "login"
                ? "Sign in to continue your journey"
                : "Start your personalised career discovery"}
            </p>
          </div>

          {/* Tab switcher (login / signup) */}
          {view !== "forgot" && (
            <div className="flex bg-muted/50 rounded-xl p-1 border border-border/40">
              {(["login", "signup"] as const).map((v) => (
                <button
                  key={v}
                  id={`auth-tab-${v}`}
                  onClick={() => switchView(v)}
                  disabled={loading}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    view === v
                      ? "bg-background text-foreground shadow-sm border border-border/40"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {v === "login" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>
          )}

          {/* ── Forgot Password Form ── */}
          {view === "forgot" && (
            <div className="space-y-4">
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reset-email" className="text-sm font-medium">Email address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="h-11 bg-muted/30 border-border/60 focus:border-primary transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  id="auth-reset-submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
              <button
                onClick={() => switchView("login")}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                disabled={loading}
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign in
              </button>
            </div>
          )}

          {/* ── Login / Sign Up Form ── */}
          {view !== "forgot" && (
            <div className="space-y-4">

              {/* OAuth buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  id="auth-google-btn"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="h-11 rounded-lg border border-border/60 bg-background hover:bg-muted/40 text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button
                  id="auth-github-btn"
                  onClick={handleGitHubSignIn}
                  disabled={loading}
                  className="h-11 rounded-lg border border-border/60 bg-background hover:bg-muted/40 text-sm font-medium flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                >
                  <svg className="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 border-t border-border/40" />
                <span className="text-xs text-muted-foreground uppercase tracking-wider">or</span>
                <div className="flex-1 border-t border-border/40" />
              </div>

              {/* Email form */}
              <form onSubmit={handleEmailAuth} className="space-y-4" id="auth-email-form">

                {/* Full Name — signup only */}
                {view === "signup" && (
                  <div className="space-y-1.5">
                    <Label htmlFor="full-name" className="text-sm font-medium">Full name</Label>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="Arjun Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="name"
                      className="h-11 bg-muted/30 border-border/60 focus:border-primary transition-colors"
                    />
                  </div>
                )}

                {/* Email */}
                <div className="space-y-1.5">
                  <Label htmlFor="auth-email" className="text-sm font-medium">Email address</Label>
                  <Input
                    id="auth-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="email"
                    className="h-11 bg-muted/30 border-border/60 focus:border-primary transition-colors"
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auth-password" className="text-sm font-medium">Password</Label>
                    {view === "login" && (
                      <button
                        type="button"
                        onClick={() => switchView("forgot")}
                        className="text-xs text-primary hover:underline underline-offset-4 transition-colors"
                        disabled={loading}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={6}
                      autoComplete={view === "login" ? "current-password" : "new-password"}
                      className="h-11 pr-10 bg-muted/30 border-border/60 focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      id="auth-toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength indicator — signup only */}
                  {view === "signup" && password.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= strength.score ? strength.color : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Password strength: <span className={`font-medium ${
                          strength.score <= 1 ? "text-red-500" :
                          strength.score === 2 ? "text-yellow-500" :
                          strength.score === 3 ? "text-emerald-500" : "text-green-500"
                        }`}>{strength.label}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Terms — signup only */}
                {view === "signup" && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By creating an account you agree to our{" "}
                    <Link to="/terms-of-service" className="text-primary hover:underline underline-offset-4">Terms of Service</Link>
                    {" "}and{" "}
                    <Link to="/privacy-policy" className="text-primary hover:underline underline-offset-4">Privacy Policy</Link>.
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  id="auth-submit-btn"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading
                    ? "Please wait…"
                    : view === "login"
                    ? "Sign In"
                    : "Create Account"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

