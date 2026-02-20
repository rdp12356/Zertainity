import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Database } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AuditTrailProps {
    logs: any[];
    users: any[];
    loading: boolean;
    selectedUser: string | null;
    onUserChange: (userId: string | null) => void;
}

export const AuditTrail = ({ logs, users, loading, selectedUser, onUserChange }: AuditTrailProps) => {
    return (
        <Card className="shadow-premium border-border/40 overflow-hidden">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Audit Trail
                </CardTitle>
                <CardDescription>
                    Immutable records of sensitive system changes and administrative overhead.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-6 space-y-2">
                    <Label htmlFor="audit-user-filter">Target User</Label>
                    <Select
                        value={selectedUser || "all"}
                        onValueChange={(value) => onUserChange(value === "all" ? null : value)}
                    >
                        <SelectTrigger id="audit-user-filter" className="rounded-full">
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

                <div className="rounded-2xl border border-border/40 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead>Event Time</TableHead>
                                <TableHead>Operation</TableHead>
                                <TableHead>Actor</TableHead>
                                <TableHead>Context Cache</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={4} className="text-center py-8">Fetching records...</TableCell></TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-20 text-muted-foreground">
                                        <Database className="h-8 w-8 mx-auto mb-4 opacity-5" />
                                        No audit records found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-xs tabular-nums">
                                            {new Date(log.created_at).toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={log.action.includes('delete') ? 'destructive' : 'outline'} className="uppercase text-[9px] font-bold">
                                                {log.action.replace('_', ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {users.find(u => u.id === log.user_id)?.email || 'System'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-[200px] truncate text-[10px] text-muted-foreground font-mono">
                                                {JSON.stringify(log.after_snapshot || log.details || {})}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};
