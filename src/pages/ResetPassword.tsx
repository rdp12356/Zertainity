



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { KeyRound, Loader2 } from "lucide-react";

import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryState, setRecoveryState] = useState<"checking" | "ready" | "invalid">("checking");
  const [recoveryError, setRecoveryError] = useState("");
  const validSession = recoveryState === "ready";
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.slice(1));
    // Supabase returns expired/invalid link errors in either query or fragment.
    if (query.get("error") || query.get("error_code") || hash.get("error") || hash.get("error_code")) {
      setRecoveryError("This password reset link is invalid or expired.");
      setRecoveryState("invalid");
      return;
    }

    // PASSWORD_RECOVERY can be dispatched before the page mounts.
    // Checking the restored session prevents a valid link from leaving this form disabled.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      if (event === "PASSWORD_RECOVERY" && session) {
        setRecoveryError("");
        setRecoveryState("ready");
      } else if (event === "SIGNED_OUT") {
        setRecoveryState("invalid");
      }
    });
    void supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!active) return;
      if (error || !session) {
        setRecoveryError(error
          ? "We couldn't validate your recovery session. Open the email link again."
          : "No active recovery session was found. Request a new reset link.");
        setRecoveryState("invalid");
        return;
      }
      setRecoveryError("");
      setRecoveryState("ready");
    }).catch(() => {
      if (!active) return;
      setRecoveryError("We couldn't verify the reset link. Please try again.");
      setRecoveryState("invalid");
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validSession) return;
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      await supabase.auth.signOut();
      navigate("/auth");
    } catch (error) {
      toast({
        title: "Password reset failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background/50 backdrop-blur-3xl bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <SEO
        title="Reset Password"
        description="Reset your Zertainity password securely."
        canonical="/reset-password"
        noindex
      />

      <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 bg-background/80 backdrop-blur-md border border-border/40 shadow-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(0,55,112,0.06)]">
            <KeyRound className="h-6 w-6 text-[color:var(--z-primary)]" />
          </div>
          <h1 className="font-serif text-[28px] font-light tracking-[-0.4px] text-[color:var(--z-ink)]">
            Set new password
          </h1>
          <p className="text-[14px] font-light mt-2 text-[color:var(--z-ink-muted)]">
            {recoveryState === "checking"
              ? "Validating your reset link..."
              : validSession
                ? "Enter a new password to regain access to your account."
                : "Your reset link needs to be renewed."}
          </p>
          {recoveryState === "invalid" && (
            <div role="alert" className="mt-4 text-sm text-destructive">
              <p>{recoveryError}</p>
              <button type="button" className="z-link mt-2" onClick={() => navigate("/auth?view=forgot")}>
                Request a new reset link
              </button>
            </div>
          )}
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-[13px] font-medium text-[color:var(--z-ink)]">
              New password
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || !validSession}
              minLength={6}
              className="z-input h-11 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[13px] font-medium text-[color:var(--z-ink)]">
              Confirm password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              disabled={loading || !validSession}
              minLength={6}
              className="z-input h-11 rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="z-hero-cta-primary w-full h-11 rounded-full text-[15px] font-normal flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || !validSession}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Updating..." : "Update password"}
          </button>

          <p className="text-center text-[13px] font-light text-[color:var(--z-ink-muted)]">
            Remembered your password?{" "}
            <button type="button" onClick={() => navigate("/auth")} className="z-link">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
