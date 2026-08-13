



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
  const [validSession, setValidSession] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Supabase puts the recovery token in the URL hash; onAuthStateChange fires with event=PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValidSession(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password must be at least 6 characters", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      await supabase.auth.signOut();
      navigate("/auth");
    }
    setLoading(false);
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
            {validSession
              ? "Enter a new password to regain access to your account."
              : "Waiting for reset link validation..."}
          </p>
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
