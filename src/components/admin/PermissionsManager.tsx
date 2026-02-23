import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Permission = {
  id: string;
  role: string;
  permission: string;
  created_at: string;
};

type RolePermissions = {
  [role: string]: Set<string>;
};

const permissionLabels: Record<string, string> = {
  view_all: "View All Content",
  edit_careers: "Edit Careers",
  edit_colleges: "Edit Colleges",
  edit_schools: "Edit Schools",
  edit_pathways: "Edit Pathways",
  edit_quiz: "Edit Quiz",
  view_users: "View Users",
  manage_users: "Manage Users",
  manage_roles: "Manage Roles",
  manage_permissions: "Manage Permissions",
  view_audit_logs: "View Audit Logs",
  export_data: "Export Data"
};

const allPermissions = Object.keys(permissionLabels);
const roles = ["owner", "admin", "manager", "editor", "user"];

export function PermissionsManager({ isOwner }: { isOwner: boolean }) {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from("role_permissions")
        .select("*")
        .order("role");

      if (error) throw error;

      setPermissions(data || []);
      
      const perms: RolePermissions = {};
      roles.forEach(role => {
        perms[role] = new Set();
      });
      
      data?.forEach((perm) => {
        if (!perms[perm.role]) perms[perm.role] = new Set();
        perms[perm.role].add(perm.permission);
      });
      
      setRolePermissions(perms);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load permissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = async (role: string, permission: string) => {
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "Only owners can manage permissions",
        variant: "destructive",
      });
      return;
    }

    const key = `${role}-${permission}`;
    setUpdating(key);

    try {
      const hasPermission = rolePermissions[role]?.has(permission);

      if (hasPermission) {
        // Remove permission
        const { error } = await supabase
          .from("role_permissions")
          .delete()
          // @ts-ignore - Supabase types will sync
          .eq("role", role)
          // @ts-ignore - Supabase types will sync
          .eq("permission", permission);

        if (error) throw error;

        const newPerms = { ...rolePermissions };
        newPerms[role].delete(permission);
        setRolePermissions(newPerms);
      } else {
        // Add permission
        const { error } = await supabase
          .from("role_permissions")
          // @ts-ignore - Supabase types will sync
          .insert({ role, permission });

        if (error) throw error;

        const newPerms = { ...rolePermissions };
        if (!newPerms[role]) newPerms[role] = new Set();
        newPerms[role].add(permission);
        setRolePermissions(newPerms);
      }

      toast({
        title: "Success",
        description: `Permission ${hasPermission ? 'removed from' : 'added to'} ${role}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading permissions...</div>;
  }

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Role Permissions Management
        </CardTitle>
        <CardDescription>
          Configure granular permissions for each user role
          {!isOwner && (
            <Badge variant="outline" className="ml-2">
              <Lock className="h-3 w-3 mr-1" /> Owner Only
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Permission</TableHead>
                {roles.map((role) => (
                  <TableHead key={role} className="text-center font-semibold capitalize">
                    {role}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {allPermissions.map((permission) => (
                <TableRow key={permission}>
                  <TableCell className="font-medium">
                    {permissionLabels[permission]}
                  </TableCell>
                  {roles.map((role) => {
                    const hasPermission = rolePermissions[role]?.has(permission) || false;
                    const isUpdatingThis = updating === `${role}-${permission}`;
                    
                    return (
                      <TableCell key={role} className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={hasPermission}
                            onCheckedChange={() => handleTogglePermission(role, permission)}
                            disabled={!isOwner || isUpdatingThis}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {!isOwner && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            Contact the project owner to modify role permissions
          </p>
        )}
      </CardContent>
    </Card>
  );
}
