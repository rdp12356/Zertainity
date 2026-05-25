



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "@supabase/supabase-js";
import { Loader2, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";

import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Setup = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      setUser(session.user);
      
      // Check if user already has admin or owner role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .in('role', ['admin', 'owner']);
      
      if (roles && roles.length > 0) {
        // User is already admin/owner, redirect immediately
        navigate('/admin');
        return;
      }
      
      // Check if any admin or owner exists using edge function (bypasses RLS)
      try {
        const { data, error } = await supabase.functions.invoke('check-admin-exists');
        if (!error && data?.adminExists) {
          setAdminExists(true);
        }
      } catch (err) {
        console.error('Error checking admin exists:', err);
        // If the check fails, we'll still show the form and let the setup-admin endpoint handle it
      }
      
      setLoading(false);
    };

    checkUserStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSetupAdmin = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to setup admin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: {}
      });

      // Handle error from function invocation
      if (error) {
        const anyErr = error as any;
        const msg = anyErr?.message || 'Failed to setup admin';
        toast({
          title: "Setup Failed",
          description: msg,
          variant: "destructive",
        });
        return;
      }

      // Handle error in response payload (200 response but with error field)
      if (data?.error) {
        toast({
          title: "Setup Failed",
          description: data.error,
          variant: "destructive",
        });
        setAdminExists(true);
      } else if (data?.success) {
        toast({
          title: "Success",
          description: "You are now the admin!",
        });
        setSetupComplete(true);
        setTimeout(() => navigate('/admin'), 2000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to setup admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const Shell = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[color:var(--z-canvas)]">
      <SEO title="First-Time Admin Setup" description="One-time admin bootstrap for Zertainity." canonical="/setup" noindex />
      <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 bg-[color:var(--z-canvas-soft)] border border-[color:var(--z-border)]">
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-[color:var(--z-primary)] mb-3" />
          <p className="text-[14px] font-light text-[color:var(--z-ink-muted)]">Loading…</p>
        </div>
      </Shell>
    );
  }

  if (!user) {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(0,55,112,0.06)]">
            <Lock className="h-6 w-6 text-[color:var(--z-primary)]" />
          </div>
          <h1 className="font-serif text-[26px] font-light tracking-[-0.4px] text-[color:var(--z-ink)]">Authentication required</h1>
          <p className="text-[14px] font-light mt-2 text-[color:var(--z-ink-muted)]">
            You need to sign in before completing first-time setup.
          </p>
        </div>
        <button onClick={() => navigate('/auth')} className="z-hero-cta-primary w-full h-11 rounded-full text-[15px] font-normal active:scale-[0.98] transition-all">
          Sign in
        </button>
      </Shell>
    );
  }

  if (adminExists) {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(0,55,112,0.06)]">
            <Lock className="h-6 w-6 text-[color:var(--z-primary)]" />
          </div>
          <h1 className="font-serif text-[26px] font-light tracking-[-0.4px] text-[color:var(--z-ink)]">Setup not available</h1>
          <p className="text-[14px] font-light mt-2 text-[color:var(--z-ink-muted)] leading-relaxed">
            An administrator already exists. First-time setup can only run once. Ask an existing admin to grant you a role.
          </p>
        </div>
        <button onClick={() => navigate('/')} className="z-hero-cta-primary w-full h-11 rounded-full text-[15px] font-normal active:scale-[0.98] transition-all">
          Back to home
        </button>
      </Shell>
    );
  }

  if (setupComplete) {
    return (
      <Shell>
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(34,197,94,0.12)]">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
          </div>
          <h1 className="font-serif text-[26px] font-light tracking-[-0.4px] text-[color:var(--z-ink)]">Setup complete</h1>
          <p className="text-[14px] font-light mt-2 text-[color:var(--z-ink-muted)]">
            Redirecting you to the admin panel…
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-[rgba(0,55,112,0.06)]">
          <ShieldCheck className="h-6 w-6 text-[color:var(--z-primary)]" />
        </div>
        <h1 className="font-serif text-[26px] font-light tracking-[-0.4px] text-[color:var(--z-ink)]">First-time admin setup</h1>
        <p className="text-[14px] font-light mt-2 text-[color:var(--z-ink-muted)]">
          Become the first administrator of this Zertainity workspace. This can only be done once.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="setup-email" className="text-[13px] font-medium text-[color:var(--z-ink)]">Your email</Label>
          <Input id="setup-email" value={user.email || ''} disabled className="z-input h-11 rounded-lg" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="setup-uid" className="text-[13px] font-medium text-[color:var(--z-ink)]">User ID</Label>
          <Input id="setup-uid" value={user.id} disabled className="z-input h-11 rounded-lg font-mono text-[12px]" />
        </div>
        <button
          onClick={handleSetupAdmin}
          disabled={loading}
          className="z-hero-cta-primary w-full h-11 rounded-full text-[15px] font-normal flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Setting up…' : 'Make me admin'}
        </button>
      </div>
    </Shell>
  );
};

export default Setup;
