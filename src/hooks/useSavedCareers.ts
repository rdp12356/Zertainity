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

const STORAGE_KEY = "zertainity_saved_careers";
const UPDATE_EVENT = "zertainity_saved_careers_updated";

function getLocalSavedCareers(): SavedCareerItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setLocalSavedCareers(items: SavedCareerItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: items }));
  } catch (err) {
    console.error("Failed to save career to localStorage:", err);
  }
}

export function useSavedCareers() {
  const [savedCareers, setSavedCareers] = useState<SavedCareerItem[]>(getLocalSavedCareers);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync state on custom event or storage event
  const refreshFromLocal = useCallback(() => {
    setSavedCareers(getLocalSavedCareers());
  }, []);

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

        if (session?.user?.id) {
          setUserId(session.user.id);
          // Fetch from Supabase
          const { data, error } = await supabase
            .from("user_saved_careers" as any)
            .select("career_id, created_at, careers(slug, name, category)")
            .eq("user_id", session.user.id)
            .order("created_at", { ascending: false });

          if (!error && data && isMounted) {
            const dbItems: SavedCareerItem[] = (data as any[]).map((row) => ({
              id: row.career_id || row.careers?.slug || row.careers?.name || "",
              slug: row.careers?.slug || row.careers?.name?.toLowerCase().replace(/\s+/g, "-") || "",
              title: row.careers?.name || row.careers?.title || "Career",
              category: row.careers?.category || "General",
              saved_at: row.created_at || new Date().toISOString(),
            }));

            // Merge with local storage
            const local = getLocalSavedCareers();
            const mergedMap = new Map<string, SavedCareerItem>();
            [...local, ...dbItems].forEach((item) => {
              const key = item.slug.toLowerCase() || item.title.toLowerCase();
              if (!mergedMap.has(key)) mergedMap.set(key, item);
            });

            const merged = Array.from(mergedMap.values());
            setSavedCareers(merged);
            setLocalSavedCareers(merged);
          }
        }
      } catch (e) {
        console.warn("Could not sync saved careers with Supabase:", e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initUser();
    return () => {
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
      const slug = (
        career.slug ||
        career.title.toLowerCase().replace(/\s+/g, "-")
      ).trim();
      const title = career.title.trim();
      const category = career.category || "General";

      const currentlySaved = isSaved(slug);
      let updated: SavedCareerItem[];

      if (currentlySaved) {
        // Remove
        updated = savedCareers.filter(
          (c) =>
            c.slug.toLowerCase() !== slug.toLowerCase() &&
            c.title.toLowerCase() !== title.toLowerCase()
        );
        setSavedCareers(updated);
        setLocalSavedCareers(updated);

        if (userId) {
          try {
            await supabase
              .from("user_saved_careers" as any)
              .delete()
              .eq("user_id", userId)
              .eq("career_id", slug);
          } catch (e) {
            console.warn("Could not delete from Supabase user_saved_careers:", e);
          }
        }

        toast({
          title: "Removed from Saved Careers",
          description: `${title} has been removed from your saved list.`,
        });
        return false;
      } else {
        // Add
        const newItem: SavedCareerItem = {
          id: slug,
          slug,
          title,
          category,
          saved_at: new Date().toISOString(),
        };

        updated = [newItem, ...savedCareers.filter((c) => c.slug !== slug)];
        setSavedCareers(updated);
        setLocalSavedCareers(updated);

        if (userId) {
          try {
            await supabase.from("user_saved_careers" as any).insert({
              user_id: userId,
              career_id: slug,
            });
          } catch (e) {
            console.warn("Could not save to Supabase user_saved_careers:", e);
          }
        }

        toast({
          title: "Career Saved! 🎯",
          description: `${title} is now saved in your bookmarks & dashboard.`,
        });
        return true;
      }
    },
    [savedCareers, isSaved, userId]
  );

  const removeSavedCareer = useCallback(
    async (slugOrTitle: string): Promise<void> => {
      const target = slugOrTitle.toLowerCase().replace(/\s+/g, "-").trim();
      const updated = savedCareers.filter(
        (c) =>
          c.slug.toLowerCase() !== target &&
          c.title.toLowerCase().replace(/\s+/g, "-") !== target
      );
      setSavedCareers(updated);
      setLocalSavedCareers(updated);

      if (userId) {
        try {
          await supabase
            .from("user_saved_careers" as any)
            .delete()
            .eq("user_id", userId)
            .eq("career_id", target);
        } catch (e) {
          console.warn("Could not delete from Supabase user_saved_careers:", e);
        }
      }

      toast({
        title: "Career Removed",
        description: "Removed from your saved list.",
      });
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
