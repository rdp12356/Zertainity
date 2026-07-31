import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";
import { Bookmark, Clock, ArrowRight, Play, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

import { supabase } from "@/integrations/supabase/client";
import { SEO } from "@/components/SEO";
import DecorativeCurves from "@/components/DecorativeCurves";
import { useSetCurves } from "@/components/CurvesContext";
import { Button } from "@/components/ui/button";

interface SavedCareer {
  career_id: string;
  careers: {
    slug: string;
    title: string;
    category: string;
  };
}

interface CareerHistory {
  id: string;
  created_at: string;
  education_level: string;
  top_recommendation: string | null;
  top_match_percent: number | null;
}

const smoothSpring = { type: "spring", stiffness: 60, damping: 20, mass: 0.8 };

export default function Dashboard() {
  const navigate = useNavigate();
  const setCurves = useSetCurves();
  
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedCareers, setSavedCareers] = useState<SavedCareer[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<CareerHistory[]>([]);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    setCurves([
      { d: "M -100 200 C 100 150, 300 250, 500 200 S 800 150, 1100 200", strokeOpacity: 0.15, strokeWidth: 4 },
      { d: "M -100 200 C 100 150, 300 250, 500 200 S 800 150, 1100 200", strokeOpacity: 0.4, strokeWidth: 1.5 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);

      // Fetch Profile for Name
      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("display_name")
        .eq("id", session.user.id)
        .single();
      
      setDisplayName((profileData as any)?.display_name || session.user.email?.split("@")[0] || "Student");

      // Fetch Saved Careers
      const { data: savedData, error: savedError } = await supabase
        .from("user_saved_careers" as any)
        .select("career_id, careers(slug, title, category)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (!savedError && savedData) {
        setSavedCareers(savedData as unknown as SavedCareer[]);
      }

      // Fetch Recent Assessments
      const { data: historyData } = await supabase
        .from("career_history")
        .select("id, created_at, education_level, top_recommendation, top_match_percent")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (historyData) {
        setRecentAssessments(historyData as CareerHistory[]);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [navigate]);

  // Real-time subscription for user_saved_careers
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('saved-careers-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_saved_careers',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // Re-fetch the joined data since the payload only has the raw rows
          const { data } = await supabase
            .from("user_saved_careers" as any)
            .select("career_id, careers(slug, title, category)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
            
          if (data) {
            setSavedCareers(data as unknown as SavedCareer[]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--z-canvas)]">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatLevel = (lvl: string) => {
    if (lvl === "after-10th") return "Class 10";
    if (lvl === "after-12th") return "Class 12";
    return lvl;
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[color:var(--z-canvas)] text-[color:var(--z-ink)] pt-24 pb-20">
      <SEO title="Dashboard | Zertainity" description="Your Zertainity dashboard." />
      
      <div className="max-w-[1080px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={smoothSpring}
          className="mb-12"
        >
          <span className="text-[12px] font-medium tracking-[0.1em] uppercase text-[color:var(--z-primary)] mb-2 block">
            Welcome back
          </span>
          <h1 className="font-serif text-[36px] sm:text-[42px] font-light tracking-tight">
            Hello, {displayName}
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Action Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothSpring, delay: 0.1 }}
              className="bg-[color:var(--z-primary)]/10 border border-[color:var(--z-primary)]/20 rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            >
              <div>
                <h3 className="text-xl font-medium mb-2">Ready for clarity?</h3>
                <p className="text-[15px] font-light text-[color:var(--z-ink-muted)] max-w-[340px]">
                  Take a new assessment to remap your skills and interests against live career tracks.
                </p>
              </div>
              <Button 
                onClick={() => navigate("/education-level")}
                className="rounded-full px-6 py-6 h-auto whitespace-nowrap bg-[color:var(--z-primary)] hover:bg-[color:var(--z-primary)]/90 text-[color:var(--z-primary-fg)]"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start Assessment
              </Button>
            </motion.div>

            {/* Saved Careers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...smoothSpring, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[20px] font-medium flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[color:var(--z-primary)]" />
                  Saved Careers
                </h2>
                <Button variant="ghost" size="sm" onClick={() => navigate("/careers")} className="text-xs">
                  Browse All <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>

              {savedCareers.length === 0 ? (
                <div className="glassmorphic-card-light dark:glassmorphic-card rounded-xl p-8 text-center border-dashed">
                  <Bookmark className="w-8 h-8 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="text-[15px] font-light text-[color:var(--z-ink-muted)]">
                    You haven't saved any careers yet.<br/>
                    Browse the catalog to bookmark tracks you're interested in.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedCareers.map((saved) => (
                    <div 
                      key={saved.career_id}
                      onClick={() => navigate(`/careers/${saved.careers.slug}`)}
                      className="group cursor-pointer glassmorphic-card-light dark:glassmorphic-card rounded-xl p-5 hover:border-[color:var(--z-primary)]/40 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-[color:var(--z-primary)]">
                          {saved.careers.category}
                        </span>
                        <h4 className="text-[16px] font-medium mt-1 group-hover:text-[color:var(--z-primary)] transition-colors">
                          {saved.careers.title}
                        </h4>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[color:var(--z-ink-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

          </div>

          {/* Sidebar Area */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...smoothSpring, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Recent Assessments */}
            <div>
              <h2 className="text-[18px] font-medium flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-[color:var(--z-primary)]" />
                Recent Activity
              </h2>

              {recentAssessments.length === 0 ? (
                <div className="p-6 rounded-xl border border-[color:var(--z-border)]/50 bg-[color:var(--z-surface-soft)] text-center">
                  <p className="text-[14px] font-light text-[color:var(--z-ink-muted)]">
                    No assessments taken yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAssessments.map((hist) => (
                    <div 
                      key={hist.id} 
                      onClick={() => navigate(`/settings`)} 
                      className="p-4 rounded-xl border border-[color:var(--z-border)]/50 bg-[color:var(--z-surface-soft)] hover:bg-[color:var(--z-surface-muted)] cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[12px] font-medium px-2 py-0.5 rounded-full bg-[color:var(--z-canvas)]">
                          {formatLevel(hist.education_level)}
                        </span>
                        <span className="text-[11px] text-[color:var(--z-ink-muted)]">
                          {new Date(hist.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-[color:var(--z-ink-muted)]">Top Match</div>
                        <div className="text-[15px] font-medium text-[color:var(--z-ink)] flex items-center gap-2 mt-0.5">
                          {hist.top_recommendation || "Pending"}
                          {hist.top_match_percent && (
                            <span className="text-[13px] text-[color:var(--z-primary)]">
                              ({hist.top_match_percent}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => navigate("/settings")}
                    className="w-full text-center py-2 text-[13px] text-[color:var(--z-ink-muted)] hover:text-[color:var(--z-primary)] transition-colors"
                  >
                    View all history in Settings →
                  </button>
                </div>
              )}
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}
