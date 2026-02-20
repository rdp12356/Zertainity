import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type UserRole = "owner" | "admin" | "manager" | "editor" | "viewer" | "user";

export interface UnifiedProfile {
    id: string;
    identity_key: string | null;
    display_name: string | null;
    avatar_url: string | null;
    position: string | null;
    bio: string | null;
    location: string | null;
    phone_number: string | null;
    date_of_birth: string | null;
}

export const useUserSession = () => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UnifiedProfile | null>(null);
    const [role, setRole] = useState<UserRole>("user");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSession = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                setUser(null);
                setProfile(null);
                setRole("user");
                setLoading(false);
                return;
            }

            setUser(session.user);
            await refreshData(session.user.id);
            setLoading(false);
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                refreshData(session.user.id);
            } else {
                setUser(null);
                setProfile(null);
                setRole("user");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const refreshData = async (userId: string) => {
        // 1. Get identity_key for current user
        const { data: initialProfile } = await supabase
            .from("user_profiles")
            .select("identity_key")
            .eq("id", userId)
            .single();

        const identityKey = initialProfile?.identity_key || userId;

        // 2. Fetch canonical profile for this identity
        const { data: canonicalProfile } = await supabase
            .from("user_profiles")
            .select("*")
            .eq("identity_key", identityKey)
            .order("updated_at", { ascending: false })
            .limit(1)
            .single();

        if (canonicalProfile) {
            setProfile(canonicalProfile as unknown as UnifiedProfile);
        }

        // 3. Fetch highest role
        const { data: roles } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", userId);

        if (roles && roles.length > 0) {
            // Priority: owner > admin > manager > editor > viewer > user
            const rolePriority: Record<string, number> = {
                owner: 6,
                admin: 5,
                manager: 4,
                editor: 3,
                viewer: 2,
                user: 1
            };

            const sortedRoles = roles.sort((a, b) =>
                (rolePriority[b.role] || 0) - (rolePriority[a.role] || 0)
            );

            setRole(sortedRoles[0].role as UserRole);
        }
    };

    return { user, profile, role, loading, refreshData };
};
