import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export function EmailConfigToggle({ isOwner }: { isOwner: boolean }) {
  const [useCustomEmail, setUseCustomEmail] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load saved setting from localStorage
    const saved = localStorage.getItem('useCustomEmail');
    if (saved) {
      setUseCustomEmail(saved === 'true');
    }
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

  return (
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
  );
}
