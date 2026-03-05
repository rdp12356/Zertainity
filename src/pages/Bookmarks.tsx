import { useState, useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Bookmark, MapPin, ExternalLink, Calendar, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { secureStorage } from "@/lib/security";

interface BookmarkedCollege {
    id: string;
    name: string;
    state: string;
    city?: string;
    college_type: string;
    website?: string;
    savedAt: string;
    notes?: string;
}

const Bookmarks = () => {
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState<BookmarkedCollege[]>([]);

    useEffect(() => {
        const saved = secureStorage.getItem("zertainity_college_bookmarks");
        if (saved) {
            try {
                setBookmarks(saved);
            } catch (e) {
                console.error("Failed to parse bookmarks", e);
            }
        }
    }, []);

    const removeBookmark = (id: string) => {
        const updated = bookmarks.filter(b => b.id !== id);
        setBookmarks(updated);
        secureStorage.setItem("zertainity_college_bookmarks", updated);
        toast.success("Bookmark removed");
    };

    return (
        <div className="min-h-screen bg-background">
            <PageSEO
                title="Your Saved Colleges"
                description="View and manage the colleges and institutions you've saved for future reference."
                canonical="/bookmarks"
            />
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <Bookmark className="h-5 w-5 text-primary fill-primary/20" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Saved Colleges</h1>
                        <p className="text-xs text-muted-foreground">{bookmarks.length} institutions bookmarked</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {bookmarks.length === 0 ? (
                    <div className="text-center py-20">
                        <Bookmark className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-4" />
                        <h2 className="text-lg font-medium mb-2">No colleges saved yet</h2>
                        <p className="text-sm text-muted-foreground mb-6">Explore colleges and save them to track your application process.</p>
                        <Button onClick={() => navigate("/colleges")}>
                            Browse Colleges
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {bookmarks.map(college => (
                            <Card key={college.id} className="relative group transition-all hover:border-black/30 hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                                    {college.college_type}
                                                </span>
                                            </div>
                                            <CardTitle className="text-base">{college.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1 text-xs">
                                                <MapPin className="h-3 w-3" />
                                                {college.city ? `${college.city}, ` : ""}{college.state}
                                            </CardDescription>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity absolute top-4 right-4"
                                            onClick={() => removeBookmark(college.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Saved {new Date(college.savedAt).toLocaleDateString()}
                                        </div>
                                        {college.website && (
                                            <a href={college.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                                Visit Website <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Bookmarks;
