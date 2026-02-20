import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

type CSVUser = {
  email: string;
  role: string;
  avatar_url?: string;
  date_of_birth?: string;
  phone_number?: string;
  location?: string;
};

export function CSVImport({ onImportComplete }: { onImportComplete: () => void }) {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const parseCSV = (text: string): CSVUser[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const user: any = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          user[header] = values[index];
        }
      });
      
      return user as CSVUser;
    }).filter(user => user.email); // Filter out empty rows
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Error",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    setResults(null);

    try {
      const text = await file.text();
      const users = parseCSV(text);

      if (users.length === 0) {
        toast({
          title: "Error",
          description: "No valid users found in CSV",
          variant: "destructive",
        });
        setImporting(false);
        return;
      }

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      // Import users one by one
      for (const user of users) {
        try {
          // Validate email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(user.email)) {
            errors.push(`Invalid email: ${user.email}`);
            failedCount++;
            continue;
          }

          // Validate role
          const validRoles = ['user', 'editor', 'manager', 'admin', 'owner'];
          if (user.role && !validRoles.includes(user.role)) {
            errors.push(`Invalid role for ${user.email}: ${user.role}`);
            failedCount++;
            continue;
          }

          // Invite user
          const { error: inviteError } = await supabase.functions.invoke('invite-user', {
            body: { 
              email: user.email, 
              role: user.role || 'user',
              profileData: {
                avatar_url: user.avatar_url,
                date_of_birth: user.date_of_birth,
                phone_number: user.phone_number,
                location: user.location,
              }
            }
          });

          if (inviteError) {
            errors.push(`Failed to invite ${user.email}: ${inviteError.message}`);
            failedCount++;
          } else {
            successCount++;
          }

          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error: any) {
          errors.push(`Error processing ${user.email}: ${error.message}`);
          failedCount++;
        }
      }

      setResults({ success: successCount, failed: failedCount, errors });

      if (successCount > 0) {
        toast({
          title: "Import Complete",
          description: `Successfully imported ${successCount} users${failedCount > 0 ? `, ${failedCount} failed` : ''}`,
        });
        onImportComplete();
      } else {
        toast({
          title: "Import Failed",
          description: "No users were successfully imported",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const downloadTemplate = () => {
    const template = `email,role,avatar_url,date_of_birth,phone_number,location
user1@example.com,user,https://example.com/avatar.jpg,1990-01-01,+1234567890,New York
user2@example.com,editor,,1985-05-15,+0987654321,California
admin@example.com,admin,,,+1122334455,Texas`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'users-import-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Template downloaded successfully",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-primary" />
          Bulk User Import (CSV)
        </CardTitle>
        <CardDescription>
          Import multiple users at once with their roles and profile information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>CSV Format:</strong> email, role, avatar_url, date_of_birth, phone_number, location
            <br />
            <strong>Valid Roles:</strong> user, editor, manager, admin, owner
          </AlertDescription>
        </Alert>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex-1"
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Template
          </Button>

          <Button
            variant="hero"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="flex-1"
          >
            <Upload className="h-4 w-4 mr-2" />
            {importing ? "Importing..." : "Upload CSV"}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />

        {results && (
          <div className="space-y-3">
            <div className="p-4 rounded-lg border border-border bg-muted/50">
              <h4 className="font-semibold mb-2">Import Results</h4>
              <div className="space-y-1 text-sm">
                <p className="text-green-600 dark:text-green-400">
                  ✓ Successfully imported: {results.success} users
                </p>
                {results.failed > 0 && (
                  <p className="text-destructive">
                    ✗ Failed: {results.failed} users
                  </p>
                )}
              </div>
            </div>

            {results.errors.length > 0 && (
              <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/10 max-h-48 overflow-y-auto">
                <h4 className="font-semibold text-sm mb-2 text-destructive">Errors:</h4>
                <ul className="space-y-1">
                  {results.errors.map((error, index) => (
                    <li key={index} className="text-xs text-destructive">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
