


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export const OWNER_EMAILS = [
  "johanmanoj2009@gmail.com",
  "johan.manoj@zertainity.in"
];

export const isOwnerEmail = (email?: string | null): boolean => {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return OWNER_EMAILS.some(e => e.toLowerCase() === normalized);
};

export const usePermission = (requiredPermission?: AppPermission | string) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkPermission();
  }, [requiredPermission]);

  const checkPermission = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setHasPermission(false);
        setIsLoading(false);
        return;
      }

      // Check if user email is in designated OWNER_EMAILS list
      if (isOwnerEmail(session.user.email)) {
        setUserRole('owner');
        setHasPermission(true);
        setIsLoading(false);
        return;
      }

      // Get user roles from database
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      if (!roles || roles.length === 0) {
        setUserRole('user');
        setHasPermission(!requiredPermission);
        setIsLoading(false);
        return;
      }

      const userRoleValue = roles[0].role;
      setUserRole(userRoleValue);

      // Owners and admins have all permissions
      if (userRoleValue === 'owner' || userRoleValue === 'admin') {
        setHasPermission(true);
        setIsLoading(false);
        return;
      }

      // If no specific permission required, user has access
      if (!requiredPermission) {
        setHasPermission(true);
        setIsLoading(false);
        return;
      }

      // Check specific permission for the role
      const { data: permissions } = await supabase
        .from('role_permissions')
        .select('permission')
        .eq('role', userRoleValue)
        .eq('permission', requiredPermission as any);

      setHasPermission(permissions && permissions.length > 0);
    } catch (error) {
      console.error('Error checking permission:', error);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { hasPermission, isLoading, userRole };
};
