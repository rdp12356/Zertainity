


import { useState, useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export const OWNER_EMAILS = [
  "johanmanoj2009@gmail.com",
  "johan.manoj@zertainity.in"
];

export const isOwnerEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return OWNER_EMAILS.some(e => e.toLowerCase() === normalized);
};

export const usePermission = (requiredPermission?: Database['public']['Enums']['app_permission'] | string) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const checkPermission = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          if (!cancelled) {
            setHasPermission(false);
            setIsLoading(false);
          }
          return;
        }

        // Server-issued database role is the only source of admin privileges.
        // Get user roles from database
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);
        if (rolesError) throw rolesError;

        if (!roles || roles.length === 0) {
          if (!cancelled) {
            setUserRole('user');
            setHasPermission(!requiredPermission);
            setIsLoading(false);
          }
          return;
        }

        const userRoleValue = roles[0].role;
        if (!cancelled) {
          setUserRole(userRoleValue);
        }

        // Owners and admins have all permissions
        if (userRoleValue === 'owner' || userRoleValue === 'admin') {
          if (!cancelled) {
            setHasPermission(true);
            setIsLoading(false);
          }
          return;
        }

        // If no specific permission required, user has access
        if (!requiredPermission) {
          if (!cancelled) {
            setHasPermission(true);
            setIsLoading(false);
          }
          return;
        }

        // Check specific permission for the role
        const { data: permissions, error: permissionsError } = await supabase
          .from('role_permissions')
          .select('permission')
          .eq('role', userRoleValue)
          .eq('permission', requiredPermission as any);
        if (permissionsError) throw permissionsError;

        if (!cancelled) {
          setHasPermission(Boolean(permissions && permissions.length > 0));
        }
      } catch (error) {
        console.error('Error checking permission:', error);
        if (!cancelled) {
          setHasPermission(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    checkPermission();

    return () => {
      cancelled = true;
    };
  }, [requiredPermission]);

  return { hasPermission, isLoading, userRole };
};
