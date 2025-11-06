import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, ArrowLeft, Building2, School, Users, Shield, ShieldOff, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

// Temporary type definitions until Supabase types sync
type CollegeInsert = {
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  courses?: string[];
  cutoffs?: string;
  description?: string;
};

type SchoolInsert = {
  name: string;
  location: string;
  latitude?: number | null;
  longitude?: number | null;
  board?: string;
  grade_11_cutoff?: number | null;
  description?: string;
};

type UserWithRoles = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Users management state
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  
  // College form state
  const [collegeName, setCollegeName] = useState("");
  const [collegeLocation, setCollegeLocation] = useState("");
  const [collegeLat, setCollegeLat] = useState("");
  const [collegeLng, setCollegeLng] = useState("");
  const [collegeCourses, setCollegeCourses] = useState("");
  const [collegeCutoffs, setCollegeCutoffs] = useState("");
  const [collegeDescription, setCollegeDescription] = useState("");
  
  // School form state
  const [schoolName, setSchoolName] = useState("");
  const [schoolLocation, setSchoolLocation] = useState("");
  const [schoolLat, setSchoolLat] = useState("");
  const [schoolLng, setSchoolLng] = useState("");
  const [schoolBoard, setSchoolBoard] = useState("");
  const [schoolGrade11Cutoff, setSchoolGrade11Cutoff] = useState("");
  const [schoolDescription, setSchoolDescription] = useState("");

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setLoading(false);
          return;
        }

        setUser(session.user);

        // Check if user has admin role
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: "Error",
            description: "Failed to verify admin status",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }

        setIsAdmin(!!roles);
      } catch (error) {
        console.error('Error in admin check:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdminStatus();
    });

    return () => subscription.unsubscribe();
  }, [toast]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.rpc('get_all_users_with_roles');
      
      if (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        });
        return;
      }

      setUsers(data || []);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handlePromoteUser = async (userId: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role: 'admin' });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${userEmail} has been promoted to admin`
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to promote user",
        variant: "destructive"
      });
    }
  };

  const handleDemoteUser = async (userId: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin');

      if (error) throw error;

      toast({
        title: "Success",
        description: `${userEmail} has been removed from admin role`
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to demote user",
        variant: "destructive"
      });
    }
  };

  const handleInviteUser = async () => {
    if (!inviteEmail.trim()) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setInviting(true);
    try {
      const { error } = await supabase.functions.invoke('invite-user', {
        body: { email: inviteEmail }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invitation sent to ${inviteEmail}. They will receive an email to set their password.`
      });

      setInviteEmail("");
      fetchUsers();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to invite user",
        variant: "destructive"
      });
    } finally {
      setInviting(false);
    }
  };

  const handleSaveCollege = async () => {
    if (!collegeName.trim() || !collegeLocation.trim()) {
      toast({ title: "Error", description: "Name and location are required", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    try {
      const collegeData: CollegeInsert = {
        name: collegeName,
        location: collegeLocation,
        latitude: collegeLat ? parseFloat(collegeLat) : null,
        longitude: collegeLng ? parseFloat(collegeLng) : null,
        courses: collegeCourses.split(",").map(c => c.trim()).filter(Boolean),
        cutoffs: collegeCutoffs,
        description: collegeDescription
      };
      // @ts-ignore - Types will sync after database schema updates
      const { error } = await supabase.from("colleges").insert(collegeData);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "College added successfully" });
      setCollegeName("");
      setCollegeLocation("");
      setCollegeLat("");
      setCollegeLng("");
      setCollegeCourses("");
      setCollegeCutoffs("");
      setCollegeDescription("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSchool = async () => {
    if (!schoolName.trim() || !schoolLocation.trim()) {
      toast({ title: "Error", description: "Name and location are required", variant: "destructive" });
      return;
    }
    
    setIsSaving(true);
    try {
      const schoolData: SchoolInsert = {
        name: schoolName,
        location: schoolLocation,
        latitude: schoolLat ? parseFloat(schoolLat) : null,
        longitude: schoolLng ? parseFloat(schoolLng) : null,
        board: schoolBoard,
        grade_11_cutoff: schoolGrade11Cutoff ? parseFloat(schoolGrade11Cutoff) : null,
        description: schoolDescription
      };
      // @ts-ignore - Types will sync after database schema updates
      const { error } = await supabase.from("schools").insert(schoolData);
      
      if (error) throw error;
      
      toast({ title: "Success", description: "School added successfully" });
      setSchoolName("");
      setSchoolLocation("");
      setSchoolLat("");
      setSchoolLng("");
      setSchoolBoard("");
      setSchoolGrade11Cutoff("");
      setSchoolDescription("");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You must be logged in to access the admin panel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate("/auth")} className="w-full" variant="hero">
              Sign In
            </Button>
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="shadow-card w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You do not have admin privileges. Contact an administrator for access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate("/")} variant="outline" className="w-full">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Admin Panel
                </h1>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Tabs defaultValue="colleges" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colleges">Colleges</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="users" onClick={() => fetchUsers()}>Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="colleges">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Add College
                </CardTitle>
                <CardDescription>
                  Enter college information for career guidance recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-name">College Name *</Label>
                    <Input
                      id="college-name"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="e.g., MIT, Stanford"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-location">Location *</Label>
                    <Input
                      id="college-location"
                      value={collegeLocation}
                      onChange={(e) => setCollegeLocation(e.target.value)}
                      placeholder="e.g., Cambridge, MA"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="college-lat">Latitude</Label>
                    <Input
                      id="college-lat"
                      type="number"
                      step="any"
                      value={collegeLat}
                      onChange={(e) => setCollegeLat(e.target.value)}
                      placeholder="42.3601"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="college-lng">Longitude</Label>
                    <Input
                      id="college-lng"
                      type="number"
                      step="any"
                      value={collegeLng}
                      onChange={(e) => setCollegeLng(e.target.value)}
                      placeholder="-71.0942"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-courses">Courses (comma-separated)</Label>
                    <Input
                      id="college-courses"
                      value={collegeCourses}
                      onChange={(e) => setCollegeCourses(e.target.value)}
                      placeholder="Computer Science, Engineering, Business"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-cutoffs">Cutoff Marks/Requirements</Label>
                    <Input
                      id="college-cutoffs"
                      value={collegeCutoffs}
                      onChange={(e) => setCollegeCutoffs(e.target.value)}
                      placeholder="e.g., SAT: 1500+, GPA: 3.8+"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="college-description">Description</Label>
                    <Textarea
                      id="college-description"
                      value={collegeDescription}
                      onChange={(e) => setCollegeDescription(e.target.value)}
                      placeholder="Brief description of the college..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="hero"
                    onClick={handleSaveCollege}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? "Saving..." : "Add College"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="schools">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <School className="h-5 w-5 text-primary" />
                  Add School
                </CardTitle>
                <CardDescription>
                  Enter school information for grade 11 recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-name">School Name *</Label>
                    <Input
                      id="school-name"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g., Delhi Public School"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-location">Location *</Label>
                    <Input
                      id="school-location"
                      value={schoolLocation}
                      onChange={(e) => setSchoolLocation(e.target.value)}
                      placeholder="e.g., New Delhi"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="school-lat">Latitude</Label>
                    <Input
                      id="school-lat"
                      type="number"
                      step="any"
                      value={schoolLat}
                      onChange={(e) => setSchoolLat(e.target.value)}
                      placeholder="28.7041"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="school-lng">Longitude</Label>
                    <Input
                      id="school-lng"
                      type="number"
                      step="any"
                      value={schoolLng}
                      onChange={(e) => setSchoolLng(e.target.value)}
                      placeholder="77.1025"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-board">Board</Label>
                    <Input
                      id="school-board"
                      value={schoolBoard}
                      onChange={(e) => setSchoolBoard(e.target.value)}
                      placeholder="e.g., CBSE, ICSE, IB"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-cutoff">Grade 11 Cutoff Percentage</Label>
                    <Input
                      id="school-cutoff"
                      type="number"
                      step="0.01"
                      value={schoolGrade11Cutoff}
                      onChange={(e) => setSchoolGrade11Cutoff(e.target.value)}
                      placeholder="e.g., 85.5"
                    />
                  </div>
                  
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="school-description">Description</Label>
                    <Textarea
                      id="school-description"
                      value={schoolDescription}
                      onChange={(e) => setSchoolDescription(e.target.value)}
                      placeholder="Brief description of the school..."
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="hero"
                    onClick={handleSaveSchool}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? "Saving..." : "Add School"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Management
                </CardTitle>
                <CardDescription>
                  View and manage user roles and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Invite User Form */}
                <div className="mb-6 p-4 border border-border rounded-lg bg-card">
                  <h3 className="text-lg font-semibold mb-4">Invite New User</h3>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !inviting) {
                            handleInviteUser();
                          }
                        }}
                      />
                    </div>
                    <Button
                      onClick={handleInviteUser}
                      disabled={inviting}
                      variant="hero"
                    >
                      {inviting ? "Sending..." : "Send Invitation"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    An invitation email will be sent to the user with a link to set their password and access the platform.
                  </p>
                </div>

                {/* Users List */}
                {loadingUsers ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading users...
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No users found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users.map((userItem) => {
                      const isCurrentUser = userItem.id === user?.id;
                      const isUserAdmin = userItem.roles.includes('admin');
                      
                      return (
                        <div
                          key={userItem.id}
                          className="flex items-center justify-between p-4 border border-border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{userItem.email}</p>
                              {isCurrentUser && (
                                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>
                                Joined: {new Date(userItem.created_at).toLocaleDateString()}
                              </span>
                              {userItem.last_sign_in_at && (
                                <span>
                                  Last sign in: {new Date(userItem.last_sign_in_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <div className="mt-2">
                              {isUserAdmin ? (
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded">
                                  <Shield className="h-3 w-3" />
                                  Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-muted text-muted-foreground rounded">
                                  <ShieldOff className="h-3 w-3" />
                                  User
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {!isCurrentUser && (
                              <>
                                {isUserAdmin ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDemoteUser(userItem.id, userItem.email)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <ShieldOff className="h-4 w-4 mr-1" />
                                    Remove Admin
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePromoteUser(userItem.id, userItem.email)}
                                  >
                                    <Shield className="h-4 w-4 mr-1" />
                                    Make Admin
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
