import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, UserCog, PenTool, ShieldOff, Trash2, Ban, CheckCircle, Mail, Phone, MapPin, Calendar, GraduationCap } from "lucide-react";

type UserProfile = {
  id: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  phone_number: string | null;
  location: string | null;
  position: string | null;
};

type UserWithRoles = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

type Props = {
  user: UserWithRoles;
  currentUserId: string;
  isOwner: boolean;
  isSuspended: boolean;
  onRoleChange: (userId: string, email: string, oldRole: string, newRole: string) => void;
  onDelete: (userId: string, email: string) => void;
  onSuspend: (userId: string, email: string) => void;
  onUnsuspend: (userId: string, email: string) => void;
  updatingRole: string | null;
  deletingUser: string | null;
};

export function UserProfileCard({
  user,
  currentUserId,
  isOwner,
  isSuspended,
  onRoleChange,
  onDelete,
  onSuspend,
  onUnsuspend,
  updatingRole,
  deletingUser
}: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const isCurrentUser = user.id === currentUserId;
  const currentRole = user.roles.length > 0 ? user.roles[0] : 'user';
  const isUpdating = updatingRole === user.id;

  useEffect(() => {
    fetchProfile();
  }, [user.id]);

  const fetchProfile = async () => {
    try {
      const { data } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const roleConfig = {
    owner: { icon: Crown, label: 'Owner', class: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800' },
    admin: { icon: Shield, label: 'Admin', class: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800' },
    manager: { icon: UserCog, label: 'Manager', class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' },
    editor: { icon: PenTool, label: 'Editor', class: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800' },
    viewer: { icon: GraduationCap, label: 'Viewer', class: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800' },
    user: { icon: ShieldOff, label: 'User', class: 'bg-muted text-muted-foreground border-border' }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`p-4 border rounded-lg ${isSuspended ? 'bg-destructive/5 border-destructive/30' : 'border-border'}`}>
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={profile?.avatar_url || undefined} alt={user.email} />
          <AvatarFallback className="text-lg">{getInitials(user.email)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg truncate">{user.email}</h3>
            {isCurrentUser && (
              <Badge variant="outline" className="text-xs">You</Badge>
            )}
            {isSuspended && (
              <Badge variant="destructive" className="text-xs">
                <Ban className="h-3 w-3 mr-1" />
                Suspended
              </Badge>
            )}
            {profile?.position && (
              <Badge variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">
                {profile.position}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              <span className="truncate">{user.email}</span>
            </div>
            {profile?.phone_number && (
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span>{profile.phone_number}</span>
              </div>
            )}
            {profile?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{profile.location}</span>
              </div>
            )}
            {profile?.date_of_birth && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(profile.date_of_birth).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
            {user.last_sign_in_at && (
              <span>• Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {user.roles.map((role) => {
              const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
              const Icon = config.icon;

              return (
                <Badge key={role} variant="outline" className={config.class}>
                  <Icon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              );
            })}
            {user.roles.length === 0 && (
              <Badge variant="outline" className={roleConfig.user.class}>
                <ShieldOff className="h-3 w-3 mr-1" />
                User
              </Badge>
            )}
          </div>
        </div>

        {!isCurrentUser && (
          <div className="flex flex-col gap-2 min-w-[140px]">
            <Select
              value={currentRole}
              onValueChange={(newRole) => onRoleChange(user.id, user.email, currentRole, newRole)}
              disabled={isUpdating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="editor">Editor</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="owner">Owner</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              {!isSuspended ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Ban className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Suspend User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to suspend <strong>{user.email}</strong>?
                        They will not be able to access the platform until unsuspended.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onSuspend(user.id, user.email)}>
                        Suspend User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUnsuspend(user.id, user.email)}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              )}

              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deletingUser === user.id}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to permanently delete <strong>{user.email}</strong>?
                        This action cannot be undone and will remove all user data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(user.id, user.email)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete User
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
