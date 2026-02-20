import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ActivityLogsProps {
    logs: any[];
    users: any[];
    loading: boolean;
    selectedUser: string | null;
    onUserChange: (userId: string | null) => void;
}

export const ActivityLogs = ({ logs, users, loading, selectedUser, onUserChange }: ActivityLogsProps) => {
    return (
        <Card className="shadow-premium border-border/40">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    User Activity Log
                </CardTitle>
                <CardDescription>
                    Real-time stream of user actions and login history.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="user-filter">Filter by User</Label>
                    <Select
                        value={selectedUser || "all"}
                        onValueChange={(value) => onUserChange(value === "all" ? null : value)}
                    >
                        <SelectTrigger id="user-filter" className="rounded-full">
                            <SelectValue placeholder="All users" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            {users.map((u) => (
                                <SelectItem key={u.id} value={u.id}>
                                    {u.email}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {loading ? (
                    <div className="text-center py-12 opacity-50 animate-pulse">Syncing logs...</div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-2xl border border-dashed">
                        <AlertCircle className="h-10 w-10 mx-auto mb-4 opacity-10" />
                        <p className="text-muted-foreground">No recent activity detected.</p>
                    </div>
                ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                        {logs.map((log) => {
                            const userEmail = users.find(u => u.id === log.user_id)?.email || 'System';
                            return (
                                <div key={log.id} className="p-4 border border-border/40 rounded-xl bg-card hover:bg-muted/30 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-sm">{userEmail}</span>
                                                <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full uppercase font-bold tracking-tight">
                                                    {log.action}
                                                </span>
                                            </div>
                                            {log.details && (
                                                <p className="text-xs text-muted-foreground break-all">
                                                    {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground tabular-nums">
                                            {new Date(log.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
