import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Database } from "@/integrations/supabase/types";

type AppPermission = Database['public']['Enums']['app_permission'];

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

      // Get user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);

      if (!roles || roles.length === 0) {
        setUserRole('user');
        // Regular users can view but not edit
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
