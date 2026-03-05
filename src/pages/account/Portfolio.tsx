import { useState, useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Award, Trash2, Calendar, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { secureStorage } from "@/lib/security";

interface Activity {
    id: string;
    title: string;
    category: string;
    date: string;
    description: string;
}

const CATEGORIES = ["Club/Society", "Sports", "Volunteering", "Competition", "Project", "Other"];

const Portfolio = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Club/Society");
    const [date, setDate] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        const saved = secureStorage.getItem("zertainity_portfolio");
        if (saved) {
            try {
                setActivities(saved);
            } catch (e) {
                console.error("Failed to parse portfolio", e);
            }
        }
    }, []);

    const saveActivities = (newActivities: Activity[]) => {
        setActivities(newActivities);
        secureStorage.setItem("zertainity_portfolio", newActivities);
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        const newActivity: Activity = {
            id: crypto.randomUUID(),
            title,
            category,
            date,
            description
        };

        saveActivities([newActivity, ...activities]);
        toast.success("Activity added to portfolio!");

        // Reset
        setTitle("");
        setCategory("Club/Society");
        setDate("");
        setDescription("");
        setIsAdding(false);
    };

    const handleDelete = (id: string) => {
        saveActivities(activities.filter(a => a.id !== id));
        toast.success("Activity removed");
    };

    return (
        <div className="min-h-screen bg-background">
            <PageSEO
                title="Your Extracurricular Portfolio"
                description="Build and manage your profile for college applications by tracking your achievements and activities."
                canonical="/portfolio"
            />
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Extracurricular Portfolio</h1>
                        <p className="text-xs text-muted-foreground">Build your profile for college</p>
                    </div>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="ml-auto gap-2"
                        onClick={() => setIsAdding(!isAdding)}
                    >
                        {isAdding ? "Cancel" : <><Plus className="h-4 w-4" /> Add Activity</>}
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {isAdding && (
                    <Card className="mb-8 border-primary/20 shadow-md">
                        <CardHeader>
                            <CardTitle>Add New Activity</CardTitle>
                            <CardDescription>Record your achievements to build a strong profile for college applications.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Activity Title</Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g. Debate Club Captain"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <select
                                            id="category"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        >
                                            {CATEGORIES.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="date">Date / Duration</Label>
                                    <Input
                                        id="date"
                                        placeholder="e.g. Aug 2024 - Present"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description & Achievements</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Describe what you did and any awards or recognition you received..."
                                        className="h-24"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>
                                <Button type="submit" className="w-full sm:w-auto">Save Activity</Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {!isAdding && activities.length === 0 ? (
                    <div className="text-center py-20 border-2 border-dashed border-border rounded-xl bg-card/50">
                        <Award className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-4" />
                        <h2 className="text-lg font-medium mb-2">Your portfolio is empty</h2>
                        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                            Standalone grades aren't enough for top colleges. Start recording your extracurricular activities, leadership roles, and projects here.
                        </p>
                        <Button onClick={() => setIsAdding(true)}>
                            <Plus className="h-4 w-4 mr-2" /> Add Your First Activity
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {activities.map(activity => (
                            <Card key={activity.id} className="group transition-all hover:border-black/30 hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="inline-block px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-[10px] uppercase font-bold tracking-wider mb-2">
                                                {activity.category}
                                            </div>
                                            <CardTitle className="text-base">{activity.title}</CardTitle>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(activity.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {activity.date && (
                                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {activity.date}
                                        </div>
                                    )}
                                    {activity.description && (
                                        <p className="text-sm text-foreground/80 line-clamp-3">
                                            {activity.description}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Portfolio;
