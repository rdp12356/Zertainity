import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Building2, School, Briefcase, GraduationCap, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface ContentManagementProps {
    isOwner: boolean;
}

export function ContentManagement({ isOwner }: ContentManagementProps) {
    const [activeTab, setActiveTab] = useState("colleges");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: res, error } = await supabase
                .from(activeTab as any)
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            setData(res || []);
        } catch (error: any) {
            toast.error(`Failed to fetch ${activeTab}: ` + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item: any) => {
        setFormData(item);
        setIsEditing(item.id);
        setIsAdding(false);
    };

    const handleAdd = () => {
        setFormData({});
        setIsAdding(true);
        setIsEditing(null);
    };

    const handleCancel = () => {
        setIsEditing(null);
        setIsAdding(false);
        setFormData({});
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isEditing) {
                const { error } = await supabase
                    .from(activeTab as any)
                    .update(formData)
                    .eq("id", isEditing);
                if (error) throw error;
                toast.success("Updated successfully");
            } else {
                const { error } = await supabase
                    .from(activeTab as any)
                    .insert(formData);
                if (error) throw error;
                toast.success("Added successfully");
            }
            fetchData();
            handleCancel();
        } catch (error: any) {
            toast.error("Failed to save: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const { error } = await supabase
                .from(activeTab as any)
                .delete()
                .eq("id", id);
            if (error) throw error;
            toast.success("Deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error("Failed to delete: " + error.message);
        }
    };

    return (
        <div className="space-y-6">
            <Card className="shadow-premium border-border/40 overflow-hidden">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <CardHeader className="bg-muted/30 pb-4 border-b">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                    Content Management
                                </CardTitle>
                                <CardDescription>
                                    Manage colleges, schools, careers, and quiz data
                                </CardDescription>
                            </div>
                            <TabsList className="bg-background/50 p-1 border border-border/40 rounded-full h-auto">
                                <TabsTrigger value="colleges" className="rounded-full px-4 text-xs">Colleges</TabsTrigger>
                                <TabsTrigger value="schools" className="rounded-full px-4 text-xs">Schools</TabsTrigger>
                                <TabsTrigger value="careers" className="rounded-full px-4 text-xs">Careers</TabsTrigger>
                                <TabsTrigger value="quiz_questions" className="rounded-full px-4 text-xs">Quizzes</TabsTrigger>
                            </TabsList>
                        </div>
                    </CardHeader>

                    <CardContent className="pt-6">
                        {!isAdding && !isEditing ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold capitalize">{activeTab.replace('_', ' ')}</h3>
                                    <Button onClick={handleAdd} size="sm" className="rounded-full">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add New
                                    </Button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-border/40 overflow-hidden bg-card">
                                        <Table>
                                            <TableHeader className="bg-muted/50">
                                                <TableRow>
                                                    <TableHead className="font-bold">Name/Question</TableHead>
                                                    <TableHead className="font-bold">Details</TableHead>
                                                    <TableHead className="text-right font-bold w-[120px]">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.map((item) => (
                                                    <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                                                        <TableCell className="font-medium">
                                                            {activeTab === "quiz_questions" ? item.question : item.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-1">
                                                                {activeTab === "colleges" && <Badge variant="secondary">{item.location}</Badge>}
                                                                {activeTab === "schools" && <Badge variant="secondary">{item.board}</Badge>}
                                                                {activeTab === "careers" && <Badge variant="secondary">{item.category}</Badge>}
                                                                {activeTab === "quiz_questions" && <Badge variant="secondary">{item.subject}</Badge>}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(item)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                                                                    <Pencil className="h-4 w-4" />
                                                                </Button>
                                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {data.length === 0 && (
                                                    <TableRow>
                                                        <TableCell colSpan={3} className="text-center py-12 text-muted-foreground">
                                                            No {activeTab.replace('_', ' ')} found. Create the first one!
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-6 max-w-2xl mx-auto">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold">{isEditing ? "Edit" : "Add New"} {activeTab.replace('_', ' ')}</h3>
                                    <Button variant="ghost" size="icon" onClick={handleCancel} className="rounded-full">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="grid gap-4 p-6 bg-muted/20 border border-border/40 rounded-2xl">
                                    {activeTab === "colleges" && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">College Name</Label>
                                                <Input id="name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input id="location" value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea id="description" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === "careers" && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">Career Name</Label>
                                                <Input id="name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="category">Category</Label>
                                                <Input id="category" value={formData.category || ""} onChange={(e) => setFormData({ ...formData, category: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="demand">Demand Level</Label>
                                                <Input id="demand" value={formData.demand || ""} onChange={(e) => setFormData({ ...formData, demand: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="education">Required Education</Label>
                                                <Input id="education" value={formData.education || ""} onChange={(e) => setFormData({ ...formData, education: e.target.value })} />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === "quiz_questions" && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input id="subject" value={formData.subject || ""} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="question">Question Text</Label>
                                                <Textarea id="question" value={formData.question || ""} onChange={(e) => setFormData({ ...formData, question: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Options (JSON array of strings)</Label>
                                                <Input
                                                    value={JSON.stringify(formData.options || [])}
                                                    onChange={(e) => {
                                                        try {
                                                            setFormData({ ...formData, options: JSON.parse(e.target.value) });
                                                        } catch (err) { }
                                                    }}
                                                />
                                            </div>
                                        </>
                                    )}

                                    {activeTab === "schools" && (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="name">School Name</Label>
                                                <Input id="name" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="board">Board (CBSE/ICSE/etc.)</Label>
                                                <Input id="board" value={formData.board || ""} onChange={(e) => setFormData({ ...formData, board: e.target.value })} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="location">Location</Label>
                                                <Input id="location" value={formData.location || ""} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="flex gap-4">
                                    <Button variant="outline" onClick={handleCancel} className="flex-1 rounded-full">Cancel</Button>
                                    <Button onClick={handleSave} disabled={saving} className="flex-1 rounded-full">
                                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Tabs>
            </Card>
        </div>
    );
}
