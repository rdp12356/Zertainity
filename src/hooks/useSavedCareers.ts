import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SavedCareerItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  saved_at: string;
}

// The old shared storage key is deliberately not read: it can contain a prior
// account's bookmarks on a shared device.
const storageKeyFor = (id: string | null) => id
  ? `zertainity_saved_careers_user_${id}`
  : "zertainity_saved_careers_guest";
const UPDATE_EVENT = "zertainity_saved_careers_updated";

function getLocalSavedCareers(userId: string | null): SavedCareerItem[] {
  try {
    const raw = localStorage.getItem(storageKeyFor(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setLocalSavedCareers(items: SavedCareerItem[], userId: string | null): void {
  try {
    localStorage.setItem(storageKeyFor(userId), JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: items }));
  } catch (err) {
    console.error("Failed to save career to localStorage:", err);
  }
}

export function useSavedCareers() {
  const [savedCareers, setSavedCareers] = useState<SavedCareerItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state on custom event or storage event
  const refreshFromLocal = useCallback(() => {
    setSavedCareers(getLocalSavedCareers(userId));
  }, [userId]);

  useEffect(() => {
    const handleCustomUpdate = () => refreshFromLocal();
    window.addEventListener(UPDATE_EVENT, handleCustomUpdate);
    window.addEventListener("storage", handleCustomUpdate);
    return () => {
      window.removeEventListener(UPDATE_EVENT, handleCustomUpdate);
      window.removeEventListener("storage", handleCustomUpdate);
    };
  }, [refreshFromLocal]);

  // Load from Supabase on mount
  useEffect(() => {
    let isMounted = true;

    async function initUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        const activeId = session?.user?.id ?? null;
        setUserId(activeId);
        setSavedCareers(getLocalSavedCareers(activeId));
        if (activeId) {
          // Fetch from Supabase
          const { data, error } = await supabase
            .from("user_saved_careers" as any)
            .select("career_slug, created_at")
             .eq("user_id", activeId)
            .order("created_at", { ascending: false });

          if (!error && data && isMounted) {
            const local = getLocalSavedCareers(activeId);
            const dbItems: SavedCareerItem[] = (data as Array<{ career_slug: string; created_at: string }>).map((row) => {
              const existing = local.find((item) => item.slug === row.career_slug);
              return {
                id: row.career_slug,
                slug: row.career_slug,
                title: existing?.title || row.career_slug.split("-").map((part) => part[0]?.toUpperCase() + part.slice(1)).join(" "),
                category: existing?.category || "General",
                saved_at: row.created_at,
              };
            });

            // Merge with local storage
            const mergedMap = new Map<string, SavedCareerItem>();
            [...local, ...dbItems].forEach((item) => {
              const key = item.slug.toLowerCase() || item.title.toLowerCase();
              if (!mergedMap.has(key)) mergedMap.set(key, item);
            });

            const merged = Array.from(mergedMap.values());
            setSavedCareers(merged);
            setLocalSavedCareers(merged, activeId);
          }
        }
      } catch (e) {
        console.warn("Could not sync saved careers with Supabase:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextId = session?.user?.id ?? null;
      setUserId(nextId);
      setSavedCareers(getLocalSavedCareers(nextId));
    });
    return () => {
      subscription.unsubscribe();
      isMounted = false;
    };
  }, []);

  const isSaved = useCallback(
    (slugOrTitle: string): boolean => {
      if (!slugOrTitle) return false;
      const target = slugOrTitle.toLowerCase().replace(/\s+/g, "-").trim();
      return savedCareers.some(
        (c) =>
          c.slug.toLowerCase().trim() === target ||
          c.title.toLowerCase().replace(/\s+/g, "-").trim() === target
      );
    },
    [savedCareers]
  );

  const toggleSaveCareer = useCallback(
    async (career: { slug?: string; title: string; category?: string }): Promise<boolean> => {
      const slug = (career.slug || career.title.toLowerCase().replace(/\s+/g, "-")).trim();
      const title = career.title.trim();
      const currentlySaved = isSaved(slug);

      if (userId) {
        const result = currentlySaved
          ? await supabase.from("user_saved_careers").delete().eq("user_id", userId).eq("career_slug", slug)
          : await supabase.from("user_saved_careers").insert({ user_id: userId, career_slug: slug });
        if (result.error && result.error.code !== "23505") {
          console.error("Failed to sync saved career", result.error);
          toast({ title: "Could not update saved careers", description: "Please retry.", variant: "destructive" });
          return currentlySaved;
        }
      }

      const updated = currentlySaved
        ? savedCareers.filter((c) => c.slug.toLowerCase() !== slug.toLowerCase())
        : [
            { id: slug, slug, title, category: career.category || "General", saved_at: new Date().toISOString() },
            ...savedCareers.filter((c) => c.slug !== slug),
          ];
      setSavedCareers(updated);
      setLocalSavedCareers(updated, userId);
      toast({ title: currentlySaved ? "Removed from Saved Careers" : "Career Saved", description: title });
      return !currentlySaved;
    },
    [savedCareers, isSaved, userId]
  );

  const removeSavedCareer = useCallback(
    async (slugOrTitle: string): Promise<void> => {
      const target = slugOrTitle.toLowerCase().replace(/\s+/g, "-").trim();
      const matching = savedCareers.find((c) => c.slug.toLowerCase() === target
        || c.title.toLowerCase().replace(/\s+/g, "-") === target);
      if (!matching) return;
      if (userId) {
        const { error } = await supabase.from("user_saved_careers")
          .delete().eq("user_id", userId).eq("career_slug", matching.slug);
        if (error) {
          console.error("Failed to delete saved career", error);
          toast({ title: "Could not remove saved career", variant: "destructive" });
          return;
        }
      }
      const updated = savedCareers.filter((c) => c.slug !== matching.slug);
      setSavedCareers(updated);
      setLocalSavedCareers(updated, userId);
      toast({ title: "Career Removed", description: "Removed from your saved list." });
    },
    [savedCareers, userId]
  );

  return {
    savedCareers,
    isSaved,
    toggleSaveCareer,
    removeSavedCareer,
    isLoading,
  };
}
