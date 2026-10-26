


import { useState, useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";

export const usePermission = (requiredPermission?: AppPermission | string) => {
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

        // Database roles are authoritative; email addresses are not privileges.
        const { data: roles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (!roles || roles.length === 0) {
          if (!cancelled) {
            setUserRole('user');
            setHasPermission(!requiredPermission);
            setIsLoading(false);
          }
          return;
        }

        const names = roles.map((row) => row.role);
        const userRoleValue = names.includes('owner') ? 'owner' : names.includes('admin') ? 'admin' : roles[0].role;
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
        const { data: permissions } = await supabase
          .from('role_permissions')
          .select('permission')
          .eq('role', userRoleValue)
          .eq('permission', requiredPermission as any);

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
