import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";

const Setup = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);
  const [adminExists, setAdminExists] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      setUser(session.user);
      
      // Check if user already has admin or owner role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .in('role', ['admin', 'owner']);
      
      if (roles && roles.length > 0) {
        // User is already admin/owner, redirect immediately
        navigate('/admin');
        return;
      }
      
      // Check if any admin or owner exists in the system
      const { data: existingAdmins } = await supabase
        .from('user_roles')
        .select('role')
        .in('role', ['admin', 'owner'])
        .limit(1);
      
      if (existingAdmins && existingAdmins.length > 0) {
        // An admin already exists, setup is not allowed
        setAdminExists(true);
      }
      
      setLoading(false);
    };

    checkUserStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSetupAdmin = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to setup admin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('setup-admin', {
        body: {}
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "Setup Failed",
          description: data.error,
          variant: "destructive",
        });
        setAdminExists(true);
      } else {
        toast({
          title: "Success",
          description: "You are now the admin!",
        });
        setSetupComplete(true);
        setTimeout(() => navigate('/admin'), 2000);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to setup admin",
        variant: "destructive",
      });
      // Check if the error is about admin already existing
      if (error.message?.includes('admin') || error.message?.includes('403')) {
        setAdminExists(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You need to be logged in to setup admin access</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Setup Not Available</CardTitle>
            <CardDescription>
              An admin user already exists in the system. First-time setup can only be done once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If you need admin access, please contact an existing administrator to grant you the appropriate role.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (setupComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Setup Complete!</CardTitle>
            <CardDescription>Redirecting to admin panel...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>First-Time Admin Setup</CardTitle>
          <CardDescription>
            Set yourself as the first admin user. This can only be done once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Your Email</Label>
            <Input value={user.email || ''} disabled />
          </div>
          <div className="space-y-2">
            <Label>User ID</Label>
            <Input value={user.id} disabled className="font-mono text-sm" />
          </div>
          <Button 
            onClick={handleSetupAdmin} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Setting up...' : 'Make Me Admin'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Setup;
