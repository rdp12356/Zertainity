import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { captureAppError } from "@/lib/errorTelemetry";
import { COMPREHENSIVE_CAREERS } from "@/data/careersCatalog";

export interface SavedCareerItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  saved_at: string;
}

type SavedCareerRow = { career_slug: string; created_at: string };
const storageKey = (id: string | null) => "zertainity_saved_careers:" + (id ?? "guest");
const UPDATE_EVENT = "zertainity_saved_careers_updated";

function normalizeSlug(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, "-");
}

function localCareers(id: string | null): SavedCareerItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey(id)) || "[]");
    return Array.isArray(value) ? value.filter(
      (item: unknown): item is SavedCareerItem =>
        Boolean(item && typeof item === "object" && "slug" in item &&
          typeof (item as SavedCareerItem).slug === "string")
    ) : [];
  } catch {
    return [];
  }
}

function persistLocal(items: SavedCareerItem[], id: string | null): void {
  try {
    localStorage.setItem(storageKey(id), JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: { account: id } }));
  } catch (error) {
    captureAppError(error, "saved-careers.local");
  }
}

function hydrate(row: SavedCareerRow, local: SavedCareerItem[]): SavedCareerItem {
  const key = normalizeSlug(row.career_slug);
  const existing = local.find(item => normalizeSlug(item.slug) === key);
  const catalog = COMPREHENSIVE_CAREERS.find(entry => normalizeSlug(entry.name) === key);
  const title = existing?.title || catalog?.name ||
    row.career_slug.replace(/[-_]/g, " ").replace(/\b\w/g, letter => letter.toUpperCase());
  return {
    id: row.career_slug,
    slug: row.career_slug,
    title,
    category: existing?.category || catalog?.category || "General",
    saved_at: row.created_at || existing?.saved_at || new Date().toISOString(),
  };
}

export function useSavedCareers() {
  const [savedCareers, setSavedCareers] = useState<SavedCareerItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentUserRef = useRef<string | null>(null);
  const loadingGeneration = useRef(0);

  const publish = useCallback((items: SavedCareerItem[], account: string | null) => {
    setSavedCareers(items);
    persistLocal(items, account);
  }, []);

  useEffect(() => {
    let active = true;
    const initUser = async () => {
      const generation = ++loadingGeneration.current;
      setIsLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!active || generation !== loadingGeneration.current) return;
        const account = session?.user?.id ?? null;
        currentUserRef.current = account;
        setUserId(account);
        const local = localCareers(account);
        setSavedCareers(local);
        if (!account) return;

        // The live table stores career_slug. There is no careers FK or career_id column.
        // A previous broken client kept local-only bookmarks: migrate those for this account.
        // Only migrate pre-fix local-only bookmarks once per account.
        // Re-uploading local cache on every login could resurrect a bookmark
        // deleted on another device.
        const migrationKey = "zertainity_saved_careers_migrated:" + account;
        let migrated = false;
        try { migrated = localStorage.getItem(migrationKey) === "1"; } catch { /* storage unavailable */ }
        if (!migrated && local.length) {
          const { error: migrateError } = await supabase
            .from("user_saved_careers" as any)
            .upsert(local.map(item => ({ user_id: account, career_slug: item.slug })),
              { onConflict: "user_id,career_slug", ignoreDuplicates: true });
          if (migrateError) throw migrateError;
        }
        const { data, error } = await supabase
          .from("user_saved_careers" as any)
          .select("career_slug, created_at")
          .eq("user_id", account)
          .order("created_at", { ascending: false });
        if (error) throw error;
        if (!active || generation !== loadingGeneration.current || currentUserRef.current !== account) return;
        try { localStorage.setItem(migrationKey, "1"); } catch { /* local storage unavailable */ }
        publish(((data ?? []) as SavedCareerRow[]).map(row => hydrate(row, local)), account);
      } catch (error) {
        captureAppError(error, "saved-careers.sync");
        if (active && generation === loadingGeneration.current) {
          toast({ title: "Saved careers could not sync", description: "Your local bookmarks remain available. Please try again online.", variant: "destructive" });
        }
      } finally {
        if (active && generation === loadingGeneration.current) setIsLoading(false);
      }
    };

    void initUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        // Supabase client calls must run after the auth callback resolves.
        window.setTimeout(() => { if (active) void initUser(); }, 0);
      }
    });
    return () => { active = false; loadingGeneration.current++; subscription.unsubscribe(); };
  }, [publish]);

  useEffect(() => {
    const onUpdate = (event: Event) => {
      const account = (event as CustomEvent<{ account: string | null }>).detail?.account;
      if (account === currentUserRef.current) setSavedCareers(localCareers(account));
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey(currentUserRef.current)) {
        setSavedCareers(localCareers(currentUserRef.current));
      }
    };
    window.addEventListener(UPDATE_EVENT, onUpdate);
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(UPDATE_EVENT, onUpdate); window.removeEventListener("storage", onStorage); };
  }, []);

  const isSaved = useCallback((slugOrTitle: string): boolean => {
    const key = normalizeSlug(slugOrTitle || "");
    return key !== "" && savedCareers.some(
      item => normalizeSlug(item.slug) === key || normalizeSlug(item.title) === key
    );
  }, [savedCareers]);

  const removeSavedCareer = useCallback(async (slugOrTitle: string): Promise<void> => {
    const target = normalizeSlug(slugOrTitle);
    const record = savedCareers.find(
      item => normalizeSlug(item.slug) === target || normalizeSlug(item.title) === target
    );
    if (!record) return;
    const account = currentUserRef.current;
    try {
      if (account) {
        const { data, error } = await supabase.from("user_saved_careers" as any)
          .delete().eq("user_id", account).eq("career_slug", record.slug)
          .select("career_slug");
        if (error) throw error;
        if (!data?.length) throw new Error("Saved career deletion was not confirmed");
      }
      if (currentUserRef.current !== account) return;
      publish(savedCareers.filter(item => normalizeSlug(item.slug) !== normalizeSlug(record.slug)), account);
      toast({ title: "Career Removed", description: "Removed from your saved list." });
    } catch (error) {
      captureAppError(error, "saved-careers.delete");
      toast({ title: "Could not remove career", description: "Your saved list has not changed.", variant: "destructive" });
    }
  }, [savedCareers, publish]);

  const toggleSaveCareer = useCallback(async (career: { slug?: string; title: string; category?: string }): Promise<boolean> => {
    const slug = normalizeSlug(career.slug || career.title);
    const title = career.title.trim();
    if (!slug || !title) return false;
    if (isSaved(slug)) {
      await removeSavedCareer(slug);
      return false;
    }

    const account = currentUserRef.current;
    try {
      if (account) {
        const { data, error } = await supabase.from("user_saved_careers" as any)
          .upsert({ user_id: account, career_slug: slug },
            { onConflict: "user_id,career_slug" })
          .select("career_slug, created_at");
        if (error) throw error;
        if (!data?.length) throw new Error("Saved career insert was not confirmed");
      }
      if (currentUserRef.current !== account) return false;
      const next: SavedCareerItem = {
        id: slug, slug, title, category: career.category || "General", saved_at: new Date().toISOString(),
      };
      publish([next, ...savedCareers.filter(item => normalizeSlug(item.slug) !== slug)], account);
      toast({ title: "Career Saved! 🎯", description: title + " is saved to your account." });
      return true;
    } catch (error) {
      captureAppError(error, "saved-careers.insert");
      toast({ title: "Could not save career", description: "The server did not confirm the change. Please retry.", variant: "destructive" });
      return false;
    }
  }, [isSaved, removeSavedCareer, savedCareers, publish]);

  return { savedCareers, isSaved, toggleSaveCareer, removeSavedCareer, isLoading, userId };
}
