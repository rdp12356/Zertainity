import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Download } from "lucide-react";
import { UserProfileCard } from "./UserProfileCard";
import { CSVImport } from "./CSVImport";

interface UsersManagementProps {
    users: any[];
    currentUser: any;
    isOwner: boolean;
    loadingUsers: boolean;
    onRefresh: () => void;
    onInvite: (email: string, role: string) => Promise<void>;
    onRoleChange: (userId: string, email: string, oldRole: string, newRole: string) => Promise<void>;
    onDelete: (userId: string, email: string) => Promise<void>;
    onSuspend: (userId: string, email: string) => Promise<void>;
    onUnsuspend: (userId: string, email: string) => Promise<void>;
    onExport: () => void;
    suspendedUsers: Set<string>;
    updatingRole: string | null;
    deletingUser: string | null;
}

export const UsersManagement = ({
    users,
    currentUser,
    isOwner,
    loadingUsers,
    onRefresh,
    onInvite,
    onRoleChange,
    onDelete,
    onSuspend,
    onUnsuspend,
    onExport,
    suspendedUsers,
    updatingRole,
    deletingUser
}: UsersManagementProps) => {
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("user");
    const [inviting, setInviting] = useState(false);

    const handleInvite = async () => {
        if (!inviteEmail) return;
        setInviting(true);
        await onInvite(inviteEmail, inviteRole);
        setInviteEmail("");
        setInviting(false);
    };

    return (
        <Card className="shadow-card border-border/40">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    User Management
                </CardTitle>
                <CardDescription>
                    Invite new members and manage existing roles and positions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Invite Form */}
                <div className="mb-8 p-6 border border-border/40 rounded-2xl bg-muted/30">
                    <h3 className="text-sm font-semibold mb-4 uppercase tracking-wider opacity-60">Invite Team Member</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="invite-email">Email</Label>
                            <Input
                                id="invite-email"
                                placeholder="colleague@zertainity.in"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-48 space-y-2">
                            <Label htmlFor="invite-role">Role</Label>
                            <Select value={inviteRole} onValueChange={setInviteRole}>
                                <SelectTrigger id="invite-role">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="viewer">Viewer</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="owner">Owner</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={handleInvite}
                            disabled={inviting || !inviteEmail}
                            className="md:mt-8 rounded-full"
                            variant="hero"
                        >
                            {inviting ? "Sending..." : "Invite User"}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <CSVImport onImportComplete={onRefresh} />
                    <Button onClick={onExport} variant="outline" className="rounded-full">
                        <Download className="h-4 w-4 mr-2" />
                        Export Users
                    </Button>
                </div>

                {loadingUsers ? (
                    <div className="text-center py-20 bg-muted/10 rounded-2xl border border-dashed">
                        <p className="text-muted-foreground animate-pulse">Synchronizing user lists...</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {users.map((userItem) => (
                            <UserProfileCard
                                key={userItem.id}
                                user={userItem}
                                currentUserId={currentUser?.id || ''}
                                isOwner={isOwner}
                                isSuspended={suspendedUsers.has(userItem.id)}
                                onRoleChange={onRoleChange}
                                onDelete={onDelete}
                                onSuspend={onSuspend}
                                onUnsuspend={onUnsuspend}
                                updatingRole={updatingRole}
                                deletingUser={deletingUser}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
