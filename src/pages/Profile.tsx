import { useEffect, useState } from "react";
import { User, Mail, MapPin, Calendar, Phone, FileText, Loader2, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserProfile {
    id: string;
    avatar_url: string | null;
    date_of_birth: string | null;
    phone_number: string | null;
    bio: string | null;
    location: string | null;
}

const Profile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [profile, setProfile] = useState<UserProfile | null>(null);

    // Form states
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                navigate("/auth");
                return;
            }

            setEmail(user.email ?? "");

            const { data, error } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            if (data) {
                setProfile(data as UserProfile);
                setBio(data.bio || "");
                setLocation(data.location || "");
                setPhone(data.phone_number || "");
                setDob(data.date_of_birth || "");
            }
        } catch (err: any) {
            console.error("Error fetching profile:", err);
            toast.error("Failed to load profile data");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSaving(true);
        try {
            const updates = {
                bio,
                location,
                phone_number: phone,
                date_of_birth: dob || null,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('user_profiles')
                .update(updates)
                .eq('id', profile.id);

            if (error) throw error;

            toast.success("Profile updated successfully");
            setProfile({ ...profile, ...updates });
        } catch (err: any) {
            console.error("Error updating profile:", err);
            toast.error(err.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                    <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
                    </div>
                </header>
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-lg font-semibold text-foreground">Profile</h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Sidebar / Display Card */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <div className="h-24 w-24 rounded-full bg-primary/10 border-4 border-background shadow-sm flex items-center justify-center mb-4 overflow-hidden">
                                    {profile?.avatar_url ? (
                                        <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-10 w-10 text-primary/60" />
                                    )}
                                </div>
                                <h2 className="text-xl font-bold truncate w-full px-4">{email?.split('@')[0]}</h2>
                                <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1.5 truncate w-full px-4">
                                    <Mail className="h-3.5 w-3.5" />
                                    {email}
                                </p>
                                <div className="w-full h-px bg-border my-6" />
                                <div className="w-full space-y-3 text-sm">
                                    <div className="flex items-center gap-3 text-muted-foreground px-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="truncate">{location || "Location not set"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-muted-foreground px-2">
                                        <Phone className="h-4 w-4" />
                                        <span className="truncate">{phone || "Phone not set"}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Account Links</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/history")}>
                                    View Analysis History
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Edit Form */}
                    <div className="md:col-span-2">
                        <Card>
                            <form onSubmit={handleSave}>
                                <CardHeader>
                                    <CardTitle>Profile Details</CardTitle>
                                    <CardDescription>
                                        Update your personal information. This helps us tailor your career recommendations.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-muted-foreground">Email Address (Read-Only)</Label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input id="email" value={email} disabled className="pl-9 bg-muted/50" />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone">Phone Number</Label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="phone"
                                                        placeholder="+91 9876543210"
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="dob">Date of Birth</Label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="dob"
                                                        type="date"
                                                        value={dob}
                                                        onChange={(e) => setDob(e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="location">City / Location</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        id="location"
                                                        placeholder="e.g. Mumbai, Maharashtra"
                                                        value={location}
                                                        onChange={(e) => setLocation(e.target.value)}
                                                        className="pl-9"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="bio">Short Bio / Ambition</Label>
                                            <div className="relative">
                                                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                <Textarea
                                                    id="bio"
                                                    placeholder="Tell us what you want to become or your current educational background..."
                                                    className="pl-9 min-h-[120px] resize-y"
                                                    value={bio}
                                                    onChange={(e) => setBio(e.target.value)}
                                                />
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                This information helps the AI Mentor give you more context-aware advice.
                                            </p>
                                        </div>
                                    </div>

                                </CardContent>
                                <CardFooter className="bg-muted/30 border-t py-4 px-6 flex justify-end">
                                    <Button type="submit" disabled={saving} className="min-w-[120px]">
                                        {saving ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                        ) : (
                                            <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </div>

                </div>
            </main>


        </div>
    );
};

export default Profile;
