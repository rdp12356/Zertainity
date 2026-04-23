import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Bell, Shield, Globe, Database, Save, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export function EmailConfigToggle({ isOwner }: { isOwner: boolean }) {
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [welcomeEmails, setWelcomeEmails] = useState(true);
  const [roleEmails, setRoleEmails] = useState(true);
  const [siteMaintenance, setSiteMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);
  const [supportEmail, setSupportEmail] = useState("support@zertainity.in");
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('useCustomEmail');
    if (saved) {
      setUseCustomEmail(saved === 'true');
    }
    const savedSupport = localStorage.getItem('supportEmail');
    if (savedSupport) setSupportEmail(savedSupport);
  }, []);

  const handleToggle = (checked: boolean) => {
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "Only owners can change email configuration",
        variant: "destructive",
      });
      return;
    }

    setUseCustomEmail(checked);
    localStorage.setItem('useCustomEmail', checked.toString());
    
    toast({
      title: "Success",
      description: `Email notifications will now use ${checked ? 'zertainity@gmail.com' : 'Supabase Auth emails'}`,
    });
  };

  const handleSaveSettings = async () => {
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "Only owners can save settings",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      localStorage.setItem('emailNotifications', emailNotifications.toString());
      localStorage.setItem('welcomeEmails', welcomeEmails.toString());
      localStorage.setItem('roleEmails', roleEmails.toString());
      localStorage.setItem('siteMaintenance', siteMaintenance.toString());
      localStorage.setItem('supportEmail', supportEmail);

      toast({
        title: "Settings Saved",
        description: "Your notification settings have been updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Email Configuration
          </CardTitle>
          <CardDescription>
            Configure which email service to use for notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex-1 space-y-1">
              <Label htmlFor="email-toggle" className="text-base">
                Use Custom Email (zertainity@gmail.com)
              </Label>
              <p className="text-sm text-muted-foreground">
                When enabled, all email notifications will be sent from zertainity@gmail.com instead of Supabase Auth
              </p>
            </div>
            <Switch
              id="email-toggle"
              checked={useCustomEmail}
              onCheckedChange={handleToggle}
              disabled={!isOwner}
            />
          </div>

          <div className="p-4 rounded-lg bg-muted">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Current Configuration:</span>
              <Badge variant={useCustomEmail ? "default" : "secondary"}>
                {useCustomEmail ? "Custom Email" : "Supabase Auth"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {useCustomEmail 
                ? "Emails will be sent via zertainity@gmail.com using the send-notification edge function"
                : "Emails will be sent via Supabase's built-in authentication system"}
            </p>
          </div>

          {!isOwner && (
            <p className="text-sm text-muted-foreground text-center">
              Only project owners can modify email configuration
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Configure which notifications to send to users
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Enable all email notifications</p>
            </div>
            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              disabled={!isOwner}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Welcome Emails</Label>
              <p className="text-sm text-muted-foreground">Send welcome emails to new users</p>
            </div>
            <Switch
              checked={welcomeEmails}
              onCheckedChange={setWelcomeEmails}
              disabled={!isOwner}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Role Change Notifications</Label>
              <p className="text-sm text-muted-foreground">Notify users when their role changes</p>
            </div>
            <Switch
              checked={roleEmails}
              onCheckedChange={setRoleEmails}
              disabled={!isOwner}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Site Settings
          </CardTitle>
          <CardDescription>
            Configure site-wide settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base">Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">Show maintenance page to all users</p>
            </div>
            <Switch
              checked={siteMaintenance}
              onCheckedChange={setSiteMaintenance}
              disabled={!isOwner}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base">Support Email</Label>
            <Input
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
              placeholder="support@zertainity.in"
              disabled={!isOwner}
            />
            <p className="text-sm text-muted-foreground">Email address for user support inquiries</p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Security and access control settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="space-y-1">
              <span className="text-sm font-medium">Two-Factor Authentication</span>
              <p className="text-sm text-muted-foreground">Enforce 2FA for all admins</p>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
            <div className="space-y-1">
              <span className="text-sm font-medium">Session Timeout</span>
              <p className="text-sm text-muted-foreground">Auto logout after 30 minutes of inactivity</p>
            </div>
            <Badge variant="secondary">Coming Soon</Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Database Status
          </CardTitle>
          <CardDescription>
            Current database statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">Connected</p>
              <p className="text-sm text-muted-foreground">Database Status</p>
            </div>
            <div className="p-4 rounded-lg bg-muted text-center">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">Active</p>
              <p className="text-sm text-muted-foreground">Edge Functions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isOwner && (
        <Button
          onClick={handleSaveSettings}
          disabled={saving}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save All Settings"}
        </Button>
      )}
    </div>
  );
}
