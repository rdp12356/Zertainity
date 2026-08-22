




import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { User } from "@supabase/supabase-js";
import {
  ArrowLeft, LogOut, User as UserIcon,
  Shield, History, TrendingUp, Sparkles, Mail, Clock, KeyRound,
  AlertTriangle, CheckCircle2, Palette, ChevronRight, Bell, Download,
  Trash2, Info, ExternalLink, BellRing, FileText,
  ArrowRight, Minus, Plus, Gamepad2, Loader2,
} from "lucide-react";

import { useSetCurves } from "@/components/CurvesContext";
import DecorativeCurves from "@/components/DecorativeCurves";
import { SEO } from "@/components/SEO";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { usePdfDownload, type PdfStage } from "@/hooks/usePdfDownload";
import { usePdfBatch } from "@/hooks/usePdfBatch";
import { supabase } from "@/integrations/supabase/client";

import { computeStreamsFromCareers } from "./SharedResult";

interface CareerHistory {
  id: string;
  education_level: string;
  top_recommendation: string | null;
  top_match_percent: number | null;
  all_recommendations: any;
  strengths?: string | null;
  created_at: string;
}

type SettingsSection = "profile" | "security" | "appearance" | "notifications" | "data" | "history" | "about";

/** Extract the careers recommendation array from all_recommendations (handles old array format and new object format) */
const extractRecs = (data: any): any[] => {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray(data.careers)) return data.careers;
  return [];
};

/** Extract strengths text from all_recommendations (new format stores it as _strengths) */
const extractStrengths = (entry: CareerHistory): string => {
  if (entry.strengths) return entry.strengths;
  if (entry.all_recommendations && typeof entry.all_recommendations === 'object' && !Array.isArray(entry.all_recommendations)) {
    return (entry.all_recommendations as any)._strengths || '';
  }
  return '';
};

/** Extract stream recommendations for after-10th (new format stores as _streams) */
const extractStreams = (entry: CareerHistory): any[] => {
  if (entry.all_recommendations && typeof entry.all_recommendations === 'object' && !Array.isArray(entry.all_recommendations)) {
    return (entry.all_recommendations as any)._streams || [];
  }
  return [];
};

const Settings = () => {
  // page-level decorative curves
  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([
      { d: "M -140 240 C -20 180, 140 160, 340 200 S 620 280, 900 240", strokeOpacity: 0.12, strokeWidth: 5 },
      { d: "M -140 240 C -20 180, 140 160, 340 200 S 620 280, 900 240", strokeOpacity: 0.4, strokeWidth: 1.3 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [history, setHistory] = useState<CareerHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [exporting, setExporting] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem("z_notif_prefs") || "{}"); }
    catch { return {}; }
  });

  const [profile, setProfile] = useState({
    display_name: "",
    phone_number: "",
    bio: "",
    location: "",
    date_of_birth: "",
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const pdfDownload = usePdfDownload();
  const pdfBatch = usePdfBatch<CareerHistory>();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) { navigate("/auth"); return; }
      setUser(session.user);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { navigate("/auth"); return; }
      setUser(session.user);
      loadProfile(session.user.id);
      loadHistory(session.user.id);
      loadRoles(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from("user_profiles").select("*").eq("id", userId).single();
      if (data) {
        setProfile({
          display_name: (data as any).display_name || "",
          phone_number: data.phone_number || "",
          bio: data.bio || "",
          location: data.location || "",
          date_of_birth: data.date_of_birth || "",
        });
      }
    } catch (err) { console.error("Error loading profile:", err); }
    finally { setLoading(false); }
  };

  const loadRoles = async (userId: string) => {
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      if (data) setUserRoles(data.map((r: any) => r.role));
    } catch (err) { console.error("Error loading roles:", err); }
  };

  const loadHistory = async (userId: string) => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase.from("career_history").select("*").eq("user_id", userId).order("created_at", { ascending: false });
      if (!error && data) setHistory(data as CareerHistory[]);
    } catch (err) { console.error("Error loading history:", err); }
    finally { setHistoryLoading(false); }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase.from("user_profiles").upsert({
        id: user.id,
        display_name: (profile as any).display_name || null,
        phone_number: profile.phone_number || null,
        bio: profile.bio || null,
        location: profile.location || null,
        date_of_birth: profile.date_of_birth || null,
      } as any);
      if (error) throw error;
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to save", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword.length < 6) {
      toast({ title: "Too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwords.newPassword });
      if (error) throw error;
      setPasswords({ newPassword: "", confirmPassword: "" });
      toast({ title: "Password updated", description: "Your password has been changed successfully." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally { setChangingPassword(false); }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const toggleNotif = (key: string) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("z_notif_prefs", JSON.stringify(updated));
    toast({ title: "Preference saved" });
  };

  const handleExportData = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const [{ data: prof }, { data: hist }] = await Promise.all([
        supabase.from("user_profiles").select("*").eq("id", user.id).single(),
        supabase.from("career_history").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]);
      const blob = new Blob([JSON.stringify({ profile: prof, career_history: hist, email: user.email, exported_at: new Date().toISOString() }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `zertainity-data-${Date.now()}.json`; a.click();
      URL.revokeObjectURL(url);
      toast({ title: "Data exported", description: "Your data has been downloaded as JSON." });
    } catch { toast({ title: "Export failed", variant: "destructive" }); }
    finally { setExporting(false); }
  };

  const handleClearHistory = async () => {
    if (!user || !confirm("Are you sure? This will permanently delete all your career assessment history.")) return;
    setClearingHistory(true);
    try {
      const { error } = await supabase.from("career_history").delete().eq("user_id", user.id);
      if (error) throw error;
      setHistory([]);
      toast({ title: "History cleared", description: "All career assessments have been removed." });
    } catch { toast({ title: "Failed to clear", variant: "destructive" }); }
    finally { setClearingHistory(false); }
  };

  /** Builds and generates one history-entry PDF; shared by single + batch flows. Throws on failure. */
  const generateHistoryPdf = async (
    entry: CareerHistory,
    setStage: (stage: PdfStage) => void
  ): Promise<void> => {
    // Hoisted so the client-side print fallback can reach them from any stage.
    let htmlContent = "";
    let pdfFilename = "";

    setStage("preparing");
    const recs = extractRecs(entry.all_recommendations);
      const strengths = extractStrengths(entry) || `Your top career match is ${entry.top_recommendation || 'being analysed'} at ${entry.top_match_percent || 0}% fit.`;
      const educationLevel = formatEducationLevel(entry.education_level);
      const studentName = (profile as any).display_name || user?.email?.split('@')[0] || "Student";
      const dateString = formatDate(entry.created_at);
      // Use stored streams (new format) or compute from careers (old format)
      const storedStreams = extractStreams(entry);
      const computedStreams = storedStreams.length > 0 ? storedStreams : (entry.education_level === "after-10th" ? computeStreamsFromCareers(recs) : []);

      let faviconBase64 = '';
      try {
        const favResp = await fetch('/favicon.png');
        if (favResp.ok) {
          const favBlob = await favResp.blob();
          faviconBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(favBlob);
          });
        }
      } catch (e) {
        console.warn('Failed to load favicon', e);
      }

      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="author" content="Zertainity">
          <meta name="description" content="Career Assessment Report - ${studentName}">
          <meta name="keywords" content="career, assessment, guidance, zertainity, student, ${educationLevel}">
          <meta name="generator" content="Zertainity Assessment Engine">
          <title>Zertainity Career Assessment Report</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
            
            :root {
              --brand: #0ea5a4;
              --muted: #6b7280;
            }
            @page {
              size: A4;
              margin: 20mm;
            }
            body {
              font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
              color: #111827;
              margin: 0;
              padding: 0;
              position: relative;
            }
            
            /* Watermark CSS styling */
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-30deg);
              font-size: 72px;
              font-weight: 900;
              color: rgba(14, 165, 164, 0.05); /* Brand color at 5% opacity */
              z-index: -1000;
              pointer-events: none;
              white-space: nowrap;
              user-select: none;
              letter-spacing: 4px;
            }

            header {
              border-bottom: 2px solid var(--brand);
              padding-bottom: 12px;
              margin-bottom: 20px;
            }
            
            /* Using table for header layout to ensure 100% WeasyPrint compatibility */
            .header-table {
              width: 100%;
              border-collapse: collapse;
              border: none;
            }
            .header-table td {
              border: none;
              padding: 0;
              vertical-align: middle;
            }
            
            .logo-container {
              display: inline-block;
            }
            .logo-img {
              width: 40px;
              height: 40px;
              border-radius: 8px;
              display: inline-block;
              vertical-align: middle;
              margin-right: 12px;
            }
            .logo-text-wrapper {
              display: inline-block;
              vertical-align: middle;
            }
            .logo-title {
              font-size: 24px;
              color: var(--brand);
              font-weight: 700;
              margin: 0;
              line-height: 1.2;
            }
            .logo-sub {
              color: var(--muted);
              font-size: 12px;
              margin: 0;
            }
            
            .header-right {
              text-align: right;
            }
            .header-right h1 {
              margin: 0;
              font-size: 18px;
              color: #374151;
            }
            .header-right .meta {
              color: var(--muted);
              font-size: 12px;
              margin-top: 4px;
            }

            .section {
              margin-top: 24px;
            }
            .section-title {
              font-weight: bold;
              font-size: 14px;
              color: #111827;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 10px;
            }
            
            .student-info {
              font-size: 14px;
              margin-bottom: 16px;
            }
            
            /* Cards layout using table for reliability in PDF engines */
            .cards-table {
              width: 100%;
              border-collapse: collapse;
              border: none;
              margin-top: 12px;
            }
            .cards-table td {
              border: none;
              padding: 0;
              width: 50%;
            }
            .card {
              border: 1px solid #e5e7eb;
              padding: 16px;
              border-radius: 8px;
              min-height: 90px;
              background: #ffffff;
            }
            .card-left {
              margin-right: 10px;
            }
            .card-right {
              margin-left: 10px;
            }
            .card strong {
              font-size: 13px;
              color: #374151;
            }
            .card-score {
              font-size: 28px;
              font-weight: bold;
              margin-top: 8px;
              color: var(--brand);
            }
            .card-meta {
              color: var(--muted);
              font-size: 12px;
              margin-top: 6px;
            }

            /* Score Table styling */
            .scores-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 8px;
            }
            .scores-table th {
              text-align: left;
              padding: 8px 12px;
              border-bottom: 2px solid #e5e7eb;
              color: #4b5563;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
              background: #f9fafb;
            }
            .scores-table td {
              text-align: left;
              padding: 10px 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
            }

            /* Recommendation list styling */
            .recommendations-wrapper {
              margin-top: 12px;
            }
            .rec {
              background: #f8fafc;
              border-left: 4px solid var(--brand);
              padding: 14px;
              border-radius: 6px;
              margin-bottom: 12px;
              font-size: 13.5px;
              line-height: 1.5;
              page-break-inside: avoid;
            }
            .rec-title {
              font-weight: bold;
              color: #111827;
              margin-bottom: 4px;
            }
            .rec-match {
              color: var(--brand);
              font-weight: bold;
              float: right;
            }
            .rec-category {
              color: var(--muted);
              font-size: 12px;
              margin-bottom: 6px;
            }
            .rec ul {
              margin: 8px 0;
              padding-left: 18px;
            }
            .rec li {
              margin: 4px 0;
              font-size: 12.5px;
              color: #374151;
            }
            
            footer {
              margin-top: 40px;
              font-size: 11px;
              color: var(--muted);
              border-top: 1px solid #e5e7eb;
              padding-top: 12px;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="watermark">zertainity.in</div>

          <header>
            <table class="header-table">
              <tr>
                <td>
                  <div class="logo-container">
                    ${faviconBase64 ? `<img src="${faviconBase64}" class="logo-img" alt="Logo" />` : '<div class="logo-img" style="background:#0ea5a4;"></div>'}
                    <div class="logo-text-wrapper">
                      <h1 class="logo-title">Zertainity</h1>
                      <p class="logo-sub">zertainity.in</p>
                    </div>
                  </div>
                </td>
                <td class="header-right">
                  <h1>Assessment Report</h1>
                  <div class="meta">Generated: ${dateString}</div>
                </td>
              </tr>
            </table>
          </header>

          <div class="student-info">
            <strong>Student:</strong> ${studentName} &nbsp; | &nbsp; <strong>Level:</strong> ${educationLevel}
          </div>

          <div class="section">
            <table class="cards-table">
              <tr>
                <td>
                  <div class="card card-left">
                    <strong>Overall Match</strong>
                    <div class="card-score">${entry.top_match_percent || recs[0]?.match || 0}%</div>
                    <div class="card-meta">Top suggested career: ${entry.top_recommendation || recs[0]?.stream || 'N/A'}</div>
                  </div>
                </td>
                <td>
                  <div class="card card-right">
                    <strong>${entry.education_level === 'after-10th' ? 'Recommended Streams' : 'Top Career Paths'}</strong>
                    <ul style="margin: 8px 0 0 16px; padding: 0; color: #4b5563; font-size: 12.5px; line-height: 1.4;">
                      ${entry.education_level === 'after-10th'
                        ? computedStreams.slice(0, 2).map(s => `<li>${s.streamName} (${s.matchScore}% Match)</li>`).join('')
                        : recs.slice(0, 2).map((r: any) => `<li>${r.stream} (${r.match}% Match)</li>`).join('')
                      }
                    </ul>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Your Strengths</div>
            <p style="font-size: 13.5px; line-height: 1.5; margin: 6px 0;">${strengths}</p>
          </div>

          ${entry.education_level === "after-10th" && computedStreams.length > 0 ? `
          <div class="section">
            <div class="section-title">Recommended High School Streams (Class 11 & 12)</div>
            <div class="recommendations-wrapper">
              ${computedStreams.map((stream, idx) => `
                <div class="rec" style="${idx === 0 ? 'border-left-color: #0ea5a4; background: #f0fdfa;' : 'border-left-color: #6b7280;'}">
                  <div class="rec-title">
                    ${stream.streamName}
                    <span class="rec-match">${stream.matchScore}% Match (${stream.matchLevel})</span>
                  </div>
                  <div class="rec-category">Core Subjects: ${stream.subjects.join(' • ')}</div>
                  <p style="margin: 6px 0;">${stream.suitabilityAnalysis}</p>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Why this fits:</strong></div>
                  <ul style="margin: 4px 0; padding-left: 18px;">
                    ${stream.reasons.map(r => `<li>${r}</li>`).join('')}
                  </ul>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Potential Careers:</strong> ${stream.careers.join(', ')}</div>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">Recommended Career Paths</div>
            <div class="recommendations-wrapper">
              ${recs.map((rec: any, index: number) => `
                <div class="rec" style="${index === 0 ? 'border-left-color: #0ea5a4; background: #f8fafc;' : 'border-left-color: #6b7280;'}">
                  <div class="rec-title">
                    ${index + 1}. ${rec.stream}
                    <span class="rec-match">${rec.match}% Match</span>
                  </div>
                  <div class="rec-category">${rec.category || ''}</div>
                  ${rec.description ? `<p style="margin: 6px 0;">${rec.description}</p>` : ''}
                  ${rec.reasons && rec.reasons.length > 0 ? `
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Why this fits:</strong></div>
                  <ul style="margin: 4px 0; padding-left: 18px;">
                    ${rec.reasons.map((r: string) => `<li>${r}</li>`).join('')}
                  </ul>
                  ` : ''}
                  ${rec.careers && rec.careers.length > 0 ? `<div style="margin-top: 6px; font-size: 12.5px;"><strong>Career options:</strong> ${rec.careers.join(', ')}</div>` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Important Note</div>
            <p style="font-size: 13px; line-height: 1.5; color: #4b5563; margin: 6px 0;">This report is guidance-oriented and should be used alongside discussions with parents, teachers, counsellors, and official admission or exam sources.</p>
          </div>

          <footer>
            This report is generated by Zertainity's assessment engine. Use it as guidance alongside counselling and academic advice.
          </footer>
        </body>
        </html>
      `;

      // Include the time so same-day assessments don't collide in the downloads folder.
      const timePart = entry.created_at.split('T')[1]?.replace(':', '').slice(0, 4) ?? '';
      pdfFilename = `zertainity-assessment-${entry.created_at.split('T')[0]}${timePart ? `-${timePart}` : ''}.pdf`;

      setStage("rendering");
      try {
        const { data: blob, error: functionError } = await supabase.functions.invoke('generate-pdf', {
          body: {
            html: htmlContent,
            author: 'Zertainity',
            subject: `Career Assessment Report - ${studentName}`,
            keywords: `career, assessment, guidance, zertainity, student, ${educationLevel}`,
            producer: 'Zertainity PDF Engine v1.0',
            filename: pdfFilename,
          }
        });

        if (functionError || !(blob instanceof Blob)) {
          throw new Error(functionError?.message || 'PDF generation service failed');
        }

        setStage("saving");
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdfFilename;
        document.body.appendChild(a);
        a.click();
        // Defer revocation so the browser has time to start the download.
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        document.body.removeChild(a);
      } catch (serviceError) {
        // No client-side print fallback — surface the failure so the UI can
        // offer a clean retry instead of interrupting with a browser dialog.
        console.error("PDF generation failed:", serviceError);
        throw serviceError instanceof Error ? serviceError : new Error(String(serviceError));
      }
  };

  const handleDownloadPdf = (entry: CareerHistory) => {
    if (pdfBatch.running) {
      toast({ title: "Batch in progress", description: "Wait for the batch download to finish first." });
      return;
    }
    void pdfDownload.downloadPdf(entry.id, (setStage) => generateHistoryPdf(entry, setStage));
  };

  const handleBatchDownloadPdfs = (items: CareerHistory[]) => {
    if (items.length === 0 || pdfDownload.isBusy || pdfBatch.running) {
      toast({ title: "A download is already in progress", description: "Wait for it to finish, then try again." });
      return;
    }
    toast({
      title: "Batch download started",
      description: "If your browser asks to allow multiple downloads, choose Allow.",
    });
    void pdfBatch.start(
      items,
      async (entry) => {
        await generateHistoryPdf(entry, () => {});
        return true;
      },
      (entry) => entry.top_recommendation || entry.id
    );
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  const formatEducationLevel = (level: string) => {
    if (level === "after-10th") return "After 10th";
    if (level === "after-12th") return "After 12th";
    return level;
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const exitCompareMode = () => {
    setCompareMode(false);
    setSelectedIds([]);
  };

  const compareEntries: [CareerHistory | undefined, CareerHistory | undefined] = (() => {
    if (selectedIds.length !== 2) return [undefined, undefined];
    const sorted = [...history].filter((h) => selectedIds.includes(h.id))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    return [sorted[0], sorted[1]];
  })();

  const comparisonRows = (() => {
    const [older, newer] = compareEntries;
    if (!older || !newer) return [];
    const olderRecs = extractRecs(older.all_recommendations) as Array<{ stream: string; match: number; category?: string }>;
    const newerRecs = extractRecs(newer.all_recommendations) as Array<{ stream: string; match: number; category?: string }>;
    const streams = new Set<string>([...olderRecs.map((r) => r.stream), ...newerRecs.map((r) => r.stream)]);
    return Array.from(streams).map((stream) => {
      const a = olderRecs.find((r) => r.stream === stream);
      const b = newerRecs.find((r) => r.stream === stream);
      const before = a?.match ?? null;
      const after = b?.match ?? null;
      const delta = before != null && after != null ? after - before : null;
      const status: "new" | "removed" | "changed" | "same" =
        before == null && after != null ? "new" :
        before != null && after == null ? "removed" :
        delta && delta !== 0 ? "changed" : "same";
      return { stream, category: (b?.category ?? a?.category) || "", before, after, delta, status };
    }).sort((x, y) => (y.after ?? 0) - (x.after ?? 0));
  })();

  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";
  const lastSignIn = user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
  const authProvider = user?.app_metadata?.provider === "google" ? "Google" : "Email";
  const initials = (profile.display_name || user?.email || "U").slice(0, 2).toUpperCase();

  const NAV_ITEMS: { key: SettingsSection; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "profile", label: "Profile", icon: <UserIcon className="h-4 w-4" />, desc: "Personal information" },
    { key: "security", label: "Security", icon: <Shield className="h-4 w-4" />, desc: "Password & sessions" },
    { key: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" />, desc: "Theme preferences" },
    { key: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" />, desc: "Email preferences" },
    { key: "data", label: "Data & Privacy", icon: <FileText className="h-4 w-4" />, desc: "Export & manage data" },
    { key: "history", label: "Career History", icon: <History className="h-4 w-4" />, desc: `${history.length} assessment${history.length !== 1 ? "s" : ""}` },
    { key: "about", label: "About", icon: <Info className="h-4 w-4" />, desc: "Platform info" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <SEO title="Account Settings" description="Manage your Zertainity account, preferences, and history." canonical="/settings" noindex />
      <DecorativeCurves />
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}><ArrowLeft className="h-5 w-5" /></Button>
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="rounded-full text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Profile Summary Banner */}
        <div className="mb-8 flex items-center gap-5">
          <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary">{initials}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-foreground truncate">
              {profile.display_name || user?.email?.split("@")[0] || "User"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {userRoles.map((role) => (
                <Badge key={role} variant="secondary" className="text-[10px] uppercase tracking-wider font-medium">
                  {role}
                </Badge>
              ))}
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />Member since {memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Nav */}
          <nav className="md:w-56 shrink-0 space-y-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === item.key
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {item.icon}
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                </div>
                <ChevronRight className={`h-4 w-4 shrink-0 transition-opacity ${activeSection === item.key ? "opacity-100" : "opacity-0"}`} />
              </button>
            ))}
          </nav>

          {/* Content Area */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* -- PROFILE -- */}
            {activeSection === "profile" && (
              <>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <CardDescription>Update your profile details visible across the platform.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="display_name" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Display Name</Label>
                        <Input id="display_name" placeholder="How should we call you?" value={(profile as any).display_name} onChange={(e) => setProfile({ ...profile, display_name: e.target.value } as any)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Phone</Label>
                        <Input id="phone" placeholder="+91 98765 43210" value={profile.phone_number} onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</Label>
                        <Input id="location" placeholder="City, State" value={profile.location} onChange={(e) => setProfile({ ...profile, location: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date of Birth</Label>
                        <Input id="dob" type="date" value={profile.date_of_birth} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</Label>
                      <Textarea id="bio" placeholder="Tell us about yourself and your career aspirations..." value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className="resize-none" />
                    </div>
                    <Separator />
                    <div className="flex justify-end">
                      <Button onClick={handleSave} disabled={saving} className="rounded-full px-8">
                        {saving ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Account Details</CardTitle>
                    <CardDescription>Read-only account metadata from your authentication provider.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                        <p className="text-sm font-medium flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{user?.email}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Auth Provider</p>
                        <p className="text-sm font-medium flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-muted-foreground" />{authProvider}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Email Verified</p>
                        <p className="text-sm font-medium flex items-center gap-1.5">
                          {user?.email_confirmed_at
                            ? <><CheckCircle2 className="h-3.5 w-3.5 text-green-500" />Verified</>
                            : <><AlertTriangle className="h-3.5 w-3.5 text-amber-500" />Not verified</>
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Last Sign In</p>
                        <p className="text-sm font-medium flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-muted-foreground" />{lastSignIn}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* -- SECURITY -- */}
            {activeSection === "security" && (
              <>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><KeyRound className="h-5 w-5" />Change Password</CardTitle>
                    <CardDescription>Set a new password for your account. Must be at least 6 characters.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {authProvider === "Google" ? (
                      <div className="flex items-start gap-3 rounded-lg bg-muted/50 border border-border/40 p-4">
                        <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium">Managed by Google</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Your account uses Google OAuth. Password is managed through your Google account settings.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="new-pw" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">New Password</Label>
                          <Input id="new-pw" type="password" placeholder="••••••••" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-pw" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Confirm Password</Label>
                          <Input id="confirm-pw" type="password" placeholder="••••••••" value={passwords.confirmPassword} onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
                        </div>
                        <Separator />
                        <div className="flex justify-end">
                          <Button onClick={handlePasswordChange} disabled={changingPassword || !passwords.newPassword} className="rounded-full px-8">
                            {changingPassword ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                      <div>
                        <p className="text-sm font-medium">Sign out of all devices</p>
                        <p className="text-xs text-muted-foreground mt-0.5">This will end all active sessions including this one.</p>
                      </div>
                      <Button variant="destructive" size="sm" className="rounded-full shrink-0" onClick={handleSignOut}>
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* -- APPEARANCE -- */}
            {activeSection === "appearance" && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Palette className="h-5 w-5" />Theme</CardTitle>
                  <CardDescription>Choose how the application looks for you.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 border border-border/40 p-4">
                    <div>
                      <p className="text-sm font-medium">Color Mode</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Toggle between light and dark appearance.</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -- NOTIFICATIONS -- */}
            {activeSection === "notifications" && (
              <Card className="border-border/40">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><BellRing className="h-5 w-5" />Email Notifications</CardTitle>
                  <CardDescription>Choose which emails you'd like to receive from Zertainity.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { key: "assessment_results", label: "Assessment Results", desc: "Get a copy of your career results via email" },
                    { key: "product_updates", label: "Product Updates", desc: "New features, career tools, and platform improvements" },
                    { key: "career_tips", label: "Career Tips & Resources", desc: "Weekly curated articles and guidance for students" },
                    { key: "account_activity", label: "Account Activity", desc: "Security alerts and sign-in notifications" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                      <Switch checked={notifications[item.key] !== false} onCheckedChange={() => toggleNotif(item.key)} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* -- DATA & PRIVACY -- */}
            {activeSection === "data" && (
              <>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg"><Download className="h-5 w-5" />Export Your Data</CardTitle>
                    <CardDescription>Download a copy of your profile and career assessment history as a JSON file.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-lg bg-muted/30 border border-border/40 p-4">
                      <div>
                        <p className="text-sm font-medium">Download personal data</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Includes profile info, assessment results, and account metadata.</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full shrink-0" onClick={handleExportData} disabled={exporting}>
                        <Download className="h-4 w-4 mr-1.5" />{exporting ? "Exporting..." : "Export"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-destructive"><Trash2 className="h-5 w-5" />Delete Data</CardTitle>
                    <CardDescription>Permanently remove your career assessment history. This cannot be undone.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                      <div>
                        <p className="text-sm font-medium">Clear career history</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{history.length} assessment{history.length !== 1 ? "s" : ""} will be permanently deleted.</p>
                      </div>
                      <Button variant="destructive" size="sm" className="rounded-full shrink-0" onClick={handleClearHistory} disabled={clearingHistory || history.length === 0}>
                        <Trash2 className="h-4 w-4 mr-1.5" />{clearingHistory ? "Clearing..." : "Clear All"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">Privacy Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Your data is stored securely on Supabase infrastructure with row-level security.</p>
                      <p>• We do not sell or share your personal information with third parties.</p>
                      <p>• Assessment data is used solely to provide personalized career recommendations.</p>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <a href="/privacy-policy" className="text-xs text-primary hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" />Privacy Policy</a>
                      <a href="/terms-of-service" className="text-xs text-primary hover:underline flex items-center gap-1"><ExternalLink className="h-3 w-3" />Terms of Service</a>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* -- HISTORY -- */}
            {activeSection === "history" && (
              <>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Career Assessment History</h2>
                    <p className="text-sm text-muted-foreground">
                      {compareMode
                        ? `Select 2 assessments to compare (${selectedIds.length} of 2)`
                        : `${history.length} assessment${history.length !== 1 ? "s" : ""} completed`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {compareMode ? (
                      <>
                        <Button
                          size="sm"
                          className="rounded-full"
                          onClick={() => setCompareOpen(true)}
                          disabled={selectedIds.length !== 2}
                        >
                          Compare
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full gap-1.5"
                          onClick={() => handleBatchDownloadPdfs(history.filter((h) => selectedIds.includes(h.id)))}
                          disabled={selectedIds.length === 0 || pdfBatch.running || pdfDownload.isBusy}
                        >
                          {pdfBatch.running ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Downloading {pdfBatch.completed + pdfBatch.failed}/{pdfBatch.total}...
                            </>
                          ) : (
                            `Download PDFs (${selectedIds.length})`
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-full"
                          onClick={() => { if (pdfBatch.running) pdfBatch.cancel(); exitCompareMode(); }}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => setCompareMode(true)}
                          disabled={history.length < 2}
                          title={history.length < 2 ? "Need at least 2 assessments" : "Compare two assessments"}
                        >
                          Compare
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full gap-1.5"
                          onClick={() => handleBatchDownloadPdfs(history)}
                          disabled={history.length === 0 || pdfBatch.running || pdfDownload.isBusy}
                          title={`Generate and download PDFs for all ${history.length} assessments`}
                        >
                          {pdfBatch.running ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Downloading {pdfBatch.completed + pdfBatch.failed}/{pdfBatch.total}...
                            </>
                          ) : (
                            `Download all (${history.length})`
                          )}
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-full" onClick={() => navigate("/education-level")}>
                          New Assessment
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {historyLoading ? (
                  <div className="flex justify-center py-12"><div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>
                ) : history.length === 0 ? (
                  <Card className="border-border/40 border-dashed">
                    <CardContent className="py-16 text-center space-y-4">
                      <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                        <History className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">No assessments yet</p>
                        <p className="text-sm text-muted-foreground mt-1">Take your first career assessment to see personalized recommendations here.</p>
                      </div>
                      <Button className="rounded-full" onClick={() => navigate("/education-level")}>Start Your First Assessment</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {history.map((entry) => {
                      const recs = extractRecs(entry.all_recommendations);
                      const isSelected = selectedIds.includes(entry.id);
                      return (
                        <Card
                          key={entry.id}
                          className={`border-border/40 transition-colors ${
                            compareMode
                              ? `cursor-pointer ${isSelected ? "border-primary/60 bg-primary/5" : "hover:border-border/80"}`
                              : "hover:border-border/80"
                          }`}
                          onClick={() => compareMode && toggleSelect(entry.id)}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3 min-w-0">
                                {compareMode && (
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={() => toggleSelect(entry.id)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="mt-1 shrink-0"
                                    aria-label="Select assessment for comparison"
                                  />
                                )}
                                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <Sparkles className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-sm truncate">{entry.top_recommendation || "Career Assessment"}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(entry.created_at)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {!compareMode && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => { e.stopPropagation(); handleDownloadPdf(entry); }}
                                    disabled={pdfDownload.isBusy || pdfBatch.running}
                                    aria-busy={pdfDownload.activeKey === entry.id}
                                    aria-label={`Download PDF report from ${formatDate(entry.created_at)}`}
                                    title="Download PDF"
                                  >
                                    {pdfDownload.activeKey === entry.id
                                      ? <Loader2 className="h-4 w-4 animate-spin" />
                                      : pdfBatch.doneIds.includes(entry.id)
                                        ? <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        : <Download className="h-4 w-4" />}
                                  </Button>
                                )}
                                <Badge variant="secondary" className="text-[10px]">{formatEducationLevel(entry.education_level)}</Badge>
                                {entry.top_match_percent != null && (
                                  <Badge className="text-[10px] bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400">
                                    {entry.top_match_percent}%
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {recs.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                {recs.map((rec: any, idx: number) => (
                                  <div key={idx} className="flex items-center justify-between text-xs px-2 py-1 rounded bg-muted/30">
                                    <span className="flex items-center gap-1.5 truncate text-foreground">
                                      <TrendingUp className="h-3 w-3 text-muted-foreground shrink-0" />{rec.stream}
                                    </span>
                                    <span className="text-muted-foreground ml-2 shrink-0">{rec.match}%</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Comparison Dialog */}
                <Dialog open={compareOpen} onOpenChange={(o) => { setCompareOpen(o); if (!o) exitCompareMode(); }}>
                  <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Compare assessments</DialogTitle>
                      <DialogDescription>
                        How your recommendations changed between the two assessments.
                      </DialogDescription>
                    </DialogHeader>

                    {compareEntries[0] && compareEntries[1] && (
                      <div className="space-y-6 pt-2">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="rounded-lg border border-border/60 p-3">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Earlier</p>
                            <p className="font-medium text-foreground mt-1">{formatDate(compareEntries[0].created_at)}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{formatEducationLevel(compareEntries[0].education_level)} — {compareEntries[0].top_recommendation || "No top pick"}</p>
                          </div>
                          <div className="rounded-lg border border-border/60 p-3">
                            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Later</p>
                            <p className="font-medium text-foreground mt-1">{formatDate(compareEntries[1].created_at)}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{formatEducationLevel(compareEntries[1].education_level)} — {compareEntries[1].top_recommendation || "No top pick"}</p>
                          </div>
                        </div>

                        {comparisonRows.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-6">No recommendations to compare.</p>
                        ) : (
                          <div className="space-y-1">
                            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-3 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium border-b border-border/40">
                              <span>Stream</span>
                              <span className="w-12 text-right">Earlier</span>
                              <ArrowRight className="h-3 w-3 opacity-0" />
                              <span className="w-12 text-right">Later</span>
                            </div>
                            {comparisonRows.map((row) => (
                              <div key={row.stream} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 px-3 py-2 rounded-md hover:bg-muted/30">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{row.stream}</p>
                                  {row.category && <p className="text-xs text-muted-foreground truncate">{row.category}</p>}
                                </div>
                                <span className="w-12 text-right tabular-nums text-sm text-muted-foreground">
                                  {row.before != null ? `${row.before}%` : "—"}
                                </span>
                                <span className="shrink-0">
                                  {row.status === "new" && <Plus className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />}
                                  {row.status === "removed" && <Minus className="h-3.5 w-3.5 text-red-500 dark:text-red-400" />}
                                  {row.status !== "new" && row.status !== "removed" && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
                                </span>
                                <span className={`w-12 text-right tabular-nums text-sm font-medium ${
                                  row.delta == null ? "text-foreground" :
                                  row.delta > 0 ? "text-green-600 dark:text-green-400" :
                                  row.delta < 0 ? "text-red-500 dark:text-red-400" :
                                  "text-foreground"
                                }`}>
                                  {row.after != null ? `${row.after}%` : "—"}
                                  {row.delta != null && row.delta !== 0 && (
                                    <span className="text-[10px] ml-1 text-muted-foreground">
                                      ({row.delta > 0 ? "+" : ""}{row.delta})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-start gap-3 rounded-lg border border-border/40 bg-muted/20 p-3 text-xs text-muted-foreground">
                          <Info className="h-4 w-4 mt-0.5 shrink-0" />
                          <p>
                            Differences usually reflect changes in your marks, subject mix, or quiz answers between the two attempts.
                          </p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </>
            )}

            {/* -- ABOUT -- */}
            {activeSection === "about" && (
              <>
                <Card className="border-border/40">
                  <CardHeader>
                    <CardTitle className="text-lg">About Zertainity</CardTitle>
                    <CardDescription>Career guidance for students in India.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg bg-muted/30 border border-border/40 p-3">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Version</p>
                        <p className="text-sm font-medium mt-0.5">1.0.0</p>
                      </div>
                      <div className="rounded-lg bg-muted/30 border border-border/40 p-3">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Platform</p>
                        <p className="text-sm font-medium mt-0.5">Web App</p>
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <a href="/privacy-policy" className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors group">
                        <span className="text-sm font-medium">Privacy Policy</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                      <a href="/terms-of-service" className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors group">
                        <span className="text-sm font-medium">Terms of Service</span>
                        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                      <a href="mailto:support@zertainity.in" className="flex items-center justify-between rounded-lg p-3 hover:bg-muted/30 transition-colors group">
                        <span className="text-sm font-medium">Contact Support</span>
                        <Mail className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </a>
                    </div>
                    <Separator />
                    <p className="text-xs text-center text-muted-foreground">© {new Date().getFullYear()} Zertainity. All rights reserved.</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
