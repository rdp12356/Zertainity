



import { useEffect, useMemo, useState } from "react";

import { BarChart3, Download, FileText, Settings } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type SubjectScore = {
  name: string;
  score: number;
};

type ThemeKey = "executive" | "premium" | "academy";

type TemplateState = {
  templateName: string;
  reportTitle: string;
  studentName: string;
  institution: string;
  educationLevel: string;
  overallScore: number;
  topRecommendation: string;
  summary: string;
  strengths: string;
  nextSteps: string;
  accent: ThemeKey;
  subjects: SubjectScore[];
};

type ThemeConfig = {
  label: string;
  description: string;
  shellClass: string;
  heroClass: string;
  surfaceClass: string;
  accentTextClass: string;
  mutedTextClass: string;
  chipClass: string;
  badgeClass: string;
  borderClass: string;
};

const STORAGE_KEY = "zertainity-pdf-template-manager";

const DEFAULT_TEMPLATE: TemplateState = {
  templateName: "Executive Assessment",
  reportTitle: "Zertainity Assessment Report",
  studentName: "Aarav Sharma",
  institution: "Delhi Public School",
  educationLevel: "Class 11",
  overallScore: 85,
  topRecommendation: "Computer Science and Data Science",
  summary:
    "A balanced academic profile with strong quantitative skills and a clear interest in future-facing technology roles.",
  strengths: "Strong math, consistency in science, and a high project readiness score for tech-led pathways.",
  nextSteps: "Focus on advanced problem solving, portfolio projects, and stream-specific entrance preparation.",
  accent: "executive",
  subjects: [
    { name: "Mathematics", score: 92 },
    { name: "Physics", score: 88 },
    { name: "Computer Science", score: 95 },
  ],
};

const THEME_CONFIGS: Record<ThemeKey, ThemeConfig> = {
  executive: {
    label: "Executive",
    description: "High contrast and formal",
    shellClass: "bg-slate-950 text-white border-slate-800",
    heroClass: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white",
    surfaceClass: "bg-white/5",
    accentTextClass: "text-indigo-200",
    mutedTextClass: "text-slate-400",
    chipClass: "bg-white/10 text-white border-white/10",
    badgeClass: "bg-indigo-500/10 text-indigo-200 border-indigo-500/20",
    borderClass: "border-slate-800",
  },
  premium: {
    label: "Premium",
    description: "Bright editorial layout",
    shellClass: "bg-white text-slate-900 border-slate-200",
    heroClass: "bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-slate-900",
    surfaceClass: "bg-slate-50",
    accentTextClass: "text-emerald-700",
    mutedTextClass: "text-slate-500",
    chipClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
    borderClass: "border-slate-200",
  },
  academy: {
    label: "Academy",
    description: "Warm and student friendly",
    shellClass: "bg-stone-50 text-stone-900 border-stone-200",
    heroClass: "bg-gradient-to-br from-amber-50 via-stone-50 to-white text-stone-900",
    surfaceClass: "bg-amber-50/60",
    accentTextClass: "text-amber-700",
    mutedTextClass: "text-stone-500",
    chipClass: "bg-amber-100 text-amber-800 border-amber-200",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    borderClass: "border-stone-200",
  },
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildPdfHtml = (template: TemplateState, theme: ThemeConfig) => {
  const subjects = template.subjects
    .map(
      (subject) => `
        <div class="subject-row">
          <span>${escapeHtml(subject.name)}</span>
          <strong>${subject.score}%</strong>
        </div>`,
    )
    .join("");

  const primaryColor = theme.label === "Executive" ? "#4f46e5" : theme.label === "Premium" ? "#059669" : "#d97706";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(template.templateName)}</title>
    <style>
      :root {
        --primary: ${primaryColor};
        --surface: ${theme.label === "Executive" ? "#0f172a" : "#ffffff"};
        --text: ${theme.label === "Executive" ? "#ffffff" : "#0f172a"};
        --muted: ${theme.label === "Executive" ? "#94a3b8" : "#64748b"};
        --border: ${theme.label === "Executive" ? "rgba(148,163,184,.18)" : "#e2e8f0"};
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, Arial, sans-serif;
        background: ${theme.label === "Executive" ? "#020617" : "#f8fafc"};
        color: var(--text);
      }
      .page {
        width: 100%;
        min-height: 100vh;
        padding: 32px;
        background: ${theme.label === "Executive" ? "linear-gradient(180deg, #020617 0%, #0f172a 100%)" : "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)"};
      }
      .shell {
        max-width: 900px;
        margin: 0 auto;
        border: 1px solid var(--border);
        border-radius: 28px;
        overflow: hidden;
        background: ${theme.label === "Executive" ? "rgba(15,23,42,.96)" : "#ffffff"};
        box-shadow: 0 24px 80px rgba(15, 23, 42, 0.18);
      }
      .hero {
        padding: 32px;
        background: ${theme.label === "Executive" ? "linear-gradient(135deg, rgba(79,70,229,.2), rgba(15,23,42,0))" : theme.label === "Premium" ? "linear-gradient(135deg, rgba(16,185,129,.08), rgba(59,130,246,.06))" : "linear-gradient(135deg, rgba(245,158,11,.12), rgba(255,255,255,0))"};
        border-bottom: 1px solid var(--border);
      }
      .eyebrow {
        font-size: 11px;
        letter-spacing: .25em;
        text-transform: uppercase;
        color: var(--muted);
        margin: 0 0 12px;
      }
      h1 {
        margin: 0;
        font-size: 34px;
        line-height: 1.1;
      }
      .subtitle {
        margin: 10px 0 0;
        color: var(--muted);
        max-width: 640px;
        font-size: 15px;
        line-height: 1.7;
      }
      .meta {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-top: 24px;
      }
      .meta-card, .panel, .recommendation, .subject-row {
        border: 1px solid var(--border);
        border-radius: 18px;
        background: ${theme.label === "Executive" ? "rgba(255,255,255,.04)" : "#fff"};
      }
      .meta-card {
        padding: 16px;
      }
      .meta-label, .section-label {
        margin: 0;
        color: var(--muted);
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: .18em;
      }
      .meta-value {
        margin: 10px 0 0;
        font-size: 18px;
        font-weight: 700;
      }
      .body {
        padding: 32px;
        display: grid;
        gap: 18px;
      }
      .panel {
        padding: 20px;
      }
      .panel h2 {
        margin: 0 0 10px;
        font-size: 18px;
      }
      .panel p {
        margin: 0;
        color: var(--muted);
        line-height: 1.7;
      }
      .grid-2 {
        display: grid;
        gap: 18px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .recommendation {
        padding: 18px;
      }
      .recommendation strong {
        display: block;
        margin-top: 8px;
        font-size: 18px;
      }
      .subject-row {
        margin-top: 10px;
        padding: 12px 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .footer {
        padding: 0 32px 32px;
        color: var(--muted);
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <div class="page">
      <div class="shell">
        <div class="hero">
          <p class="eyebrow">Zertainity ${escapeHtml(template.templateName)}</p>
          <h1>${escapeHtml(template.reportTitle)}</h1>
          <p class="subtitle">${escapeHtml(template.summary)}</p>
          <div class="meta">
            <div class="meta-card">
              <p class="meta-label">Student</p>
              <p class="meta-value">${escapeHtml(template.studentName)}</p>
            </div>
            <div class="meta-card">
              <p class="meta-label">Institution</p>
              <p class="meta-value">${escapeHtml(template.institution)}</p>
            </div>
            <div class="meta-card">
              <p class="meta-label">Match score</p>
              <p class="meta-value">${template.overallScore}%</p>
            </div>
          </div>
        </div>
        <div class="body">
          <div class="grid-2">
            <div class="panel">
              <p class="section-label">Top recommendation</p>
              <h2>${escapeHtml(template.topRecommendation)}</h2>
              <p>${escapeHtml(template.nextSteps)}</p>
            </div>
            <div class="panel">
              <p class="section-label">Strengths</p>
              <h2>${escapeHtml(template.educationLevel)}</h2>
              <p>${escapeHtml(template.strengths)}</p>
            </div>
          </div>
          <div class="panel">
            <p class="section-label">Subject snapshot</p>
            ${subjects}
          </div>
          <div class="recommendation">
            <p class="section-label">Editorial note</p>
            <strong>${escapeHtml(template.studentName)} is ready for the next stage with a ${template.overallScore}% confidence match.</strong>
            <p style="color: var(--muted); margin-top: 8px; line-height: 1.7;">Generated by the PDF Template Manager in the admin studio.</p>
          </div>
        </div>
        <div class="footer">
          Generated by Zertainity on ${new Date().toLocaleDateString()}.
        </div>
      </div>
    </div>
  </body>
</html>`;
};

const readStoredTemplate = (): TemplateState => {
  if (typeof window === "undefined") return DEFAULT_TEMPLATE;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_TEMPLATE;
    const parsed = JSON.parse(stored) as Partial<TemplateState>;
    return {
      ...DEFAULT_TEMPLATE,
      ...parsed,
      subjects: Array.isArray(parsed.subjects) && parsed.subjects.length > 0 ? parsed.subjects : DEFAULT_TEMPLATE.subjects,
    };
  } catch {
    return DEFAULT_TEMPLATE;
  }
};

export function PdfTemplateManager() {
  const { toast } = useToast();
  const [template, setTemplate] = useState<TemplateState>(() => readStoredTemplate());
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [savingPreset, setSavingPreset] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
  }, [template]);

  const theme = useMemo(() => THEME_CONFIGS[template.accent], [template.accent]);
  const previewDate = useMemo(() => new Date().toLocaleDateString(), []);

  const updateField = <K extends keyof TemplateState>(field: K, value: TemplateState[K]) => {
    setTemplate((current) => ({ ...current, [field]: value }));
  };

  const updateSubject = (index: number, key: keyof SubjectScore, value: string | number) => {
    setTemplate((current) => ({
      ...current,
      subjects: current.subjects.map((subject, subjectIndex) =>
        subjectIndex === index ? { ...subject, [key]: key === "score" ? Number(value) : value } : subject,
      ),
    }));
  };

  const addSubject = () => {
    setTemplate((current) => ({
      ...current,
      subjects: [...current.subjects, { name: "New subject", score: 75 }],
    }));
  };

  const removeSubject = (index: number) => {
    setTemplate((current) => ({
      ...current,
      subjects: current.subjects.filter((_, subjectIndex) => subjectIndex !== index),
    }));
  };

  const resetTemplate = () => {
    setTemplate(DEFAULT_TEMPLATE);
    toast({ title: "Template reset", description: "The PDF builder has been restored to the default sample." });
  };

  const saveTemplate = async () => {
    setSavingPreset(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(template));
      toast({ title: "Preset saved", description: "The current template is stored locally in the browser." });
    } finally {
      setSavingPreset(false);
    }
  };

  const handleDownloadPdf = async () => {
    setGeneratingPdf(true);
    const html = buildPdfHtml(template, theme);
    const filename = `zertainity-template-${template.templateName.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;

    try {
      const { data: blob, error: functionError } = await supabase.functions.invoke('generate-pdf', {
        body: {
          html,
          filename,
          author: 'Zertainity Admin',
          subject: template.reportTitle,
          keywords: 'career, assessment, template, zertainity, admin',
          producer: 'Zertainity Admin PDF Engine v1.0',
        }
      });

      if (functionError || !blob) {
        throw new Error(functionError?.message || 'PDF generation service failed');
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({ title: "PDF generated", description: "The current template has been downloaded as a PDF." });
    } catch (error: any) {
      console.error("Remote PDF generation failed, trying client-side fallback:", error);
      try {
        const { generatePdfFallback } = await import('@/utils/pdfGenerator');
        await generatePdfFallback(html, filename);
        toast({ title: "PDF generated (local fallback)", description: "The template has been rendered in the browser." });
      } catch (fallbackError) {
        console.error("Client-side fallback PDF generation failed:", fallbackError);
        toast({ title: "PDF failed", description: error?.message || "Unable to generate the PDF.", variant: "destructive" });
      }
    } finally {
      setGeneratingPdf(false);
    }
  };

  const posthogReady = Boolean(import.meta.env.VITE_POSTHOG_KEY && import.meta.env.VITE_POSTHOG_HOST);
  const pdfServiceReady = Boolean(import.meta.env.VITE_PDF_SERVICE_URL);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">PDF Template Manager</h2>
        <p className="text-muted-foreground">Build, preview, and export custom assessment PDFs without touching the backend template code.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Executive, Premium, Academy</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Editable Blocks</CardTitle>
            <BarChart3 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Title, summary, subjects, and recommendations</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">PostHog</CardTitle>
            <Settings className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{posthogReady ? "Ready" : "Setup"}</div>
            <p className="text-xs text-muted-foreground">Analytics instrumentation for admin events</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">PDF Service</CardTitle>
            <Download className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pdfServiceReady ? "Remote" : "Local"}</div>
            <p className="text-xs text-muted-foreground">Render endpoint used by the template manager</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="shadow-sm border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Template Builder</CardTitle>
            <CardDescription>Adjust the content blocks that feed the assessment PDF preview.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="template-name">Template name</Label>
                <Input id="template-name" value={template.templateName} onChange={(event) => updateField("templateName", event.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="report-title">Report title</Label>
                <Input id="report-title" value={template.reportTitle} onChange={(event) => updateField("reportTitle", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="student-name">Student name</Label>
                <Input id="student-name" value={template.studentName} onChange={(event) => updateField("studentName", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input id="institution" value={template.institution} onChange={(event) => updateField("institution", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="education-level">Education level</Label>
                <Input id="education-level" value={template.educationLevel} onChange={(event) => updateField("educationLevel", event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="theme">Template tone</Label>
                <Select value={template.accent} onValueChange={(value) => updateField("accent", value as ThemeKey)}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(THEME_CONFIGS).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label} - {value.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="overall-score">Overall score</Label>
                <Input id="overall-score" type="number" min={0} max={100} value={template.overallScore} onChange={(event) => updateField("overallScore", Number(event.target.value))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="top-recommendation">Top recommendation</Label>
                <Input id="top-recommendation" value={template.topRecommendation} onChange={(event) => updateField("topRecommendation", event.target.value)} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="summary">Summary</Label>
                <Textarea id="summary" value={template.summary} onChange={(event) => updateField("summary", event.target.value)} rows={4} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="strengths">Strengths</Label>
                <Textarea id="strengths" value={template.strengths} onChange={(event) => updateField("strengths", event.target.value)} rows={3} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="next-steps">Next steps</Label>
                <Textarea id="next-steps" value={template.nextSteps} onChange={(event) => updateField("nextSteps", event.target.value)} rows={3} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">Subject scores</h3>
                  <p className="text-sm text-muted-foreground">Add, remove, or adjust the core scoring rows shown in the report.</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addSubject}>
                  Add subject
                </Button>
              </div>

              <div className="space-y-3">
                {template.subjects.map((subject, index) => (
                  <div key={`${subject.name}-${index}`} className="grid gap-3 rounded-xl border border-border/60 bg-background p-4 md:grid-cols-[1.2fr_0.5fr_auto] md:items-end">
                    <div className="space-y-2">
                      <Label htmlFor={`subject-name-${index}`}>Subject</Label>
                      <Input id={`subject-name-${index}`} value={subject.name} onChange={(event) => updateSubject(index, "name", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`subject-score-${index}`}>Score</Label>
                      <Input id={`subject-score-${index}`} type="number" min={0} max={100} value={subject.score} onChange={(event) => updateSubject(index, "score", event.target.value)} />
                    </div>
                    <Button type="button" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => removeSubject(index)} disabled={template.subjects.length === 1}>
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={handleDownloadPdf} disabled={generatingPdf}>
                {generatingPdf ? "Generating PDF..." : "Generate PDF"}
              </Button>
              <Button type="button" variant="secondary" onClick={saveTemplate} disabled={savingPreset}>
                {savingPreset ? "Saving..." : "Save preset"}
              </Button>
              <Button type="button" variant="outline" onClick={resetTemplate}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className={cn("shadow-sm", theme.shellClass, theme.borderClass)}>
            <CardHeader className={cn("border-b", theme.borderClass)}>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Live Preview
              </CardTitle>
              <CardDescription className={theme.mutedTextClass}>This panel reflects the final PDF layout before it is generated.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className={cn("p-6", theme.heroClass)}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="outline" className={cn("mb-3 uppercase tracking-[0.25em]", theme.badgeClass)}>
                      {template.templateName}
                    </Badge>
                    <h3 className="text-2xl font-semibold tracking-tight">{template.reportTitle}</h3>
                    <p className={cn("mt-3 max-w-xl text-sm leading-6", theme.mutedTextClass)}>{template.summary}</p>
                  </div>
                  <div className={cn("min-w-[110px] rounded-2xl border px-4 py-3 text-center", theme.surfaceClass, theme.borderClass)}>
                    <div className="text-3xl font-bold">{template.overallScore}%</div>
                    <div className={cn("text-[11px] uppercase tracking-[0.2em]", theme.accentTextClass)}>Match</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className={cn("rounded-2xl border p-4", theme.surfaceClass, theme.borderClass)}>
                    <p className={cn("text-[11px] uppercase tracking-[0.25em]", theme.mutedTextClass)}>Student</p>
                    <p className="mt-2 text-base font-semibold">{template.studentName}</p>
                  </div>
                  <div className={cn("rounded-2xl border p-4", theme.surfaceClass, theme.borderClass)}>
                    <p className={cn("text-[11px] uppercase tracking-[0.25em]", theme.mutedTextClass)}>Institution</p>
                    <p className="mt-2 text-base font-semibold">{template.institution}</p>
                  </div>
                  <div className={cn("rounded-2xl border p-4", theme.surfaceClass, theme.borderClass)}>
                    <p className={cn("text-[11px] uppercase tracking-[0.25em]", theme.mutedTextClass)}>Date</p>
                    <p className="mt-2 text-base font-semibold">{previewDate}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className={cn("rounded-2xl border p-5", theme.surfaceClass, theme.borderClass)}>
                  <p className={cn("text-[11px] uppercase tracking-[0.25em]", theme.mutedTextClass)}>Recommendation</p>
                  <p className="mt-2 text-lg font-semibold">{template.topRecommendation}</p>
                  <p className={cn("mt-2 text-sm leading-6", theme.mutedTextClass)}>{template.nextSteps}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className={cn("rounded-2xl border p-5", theme.surfaceClass, theme.borderClass)}>
                    <p className={cn("text-[11px] uppercase tracking-[0.25em]", theme.mutedTextClass)}>Strengths</p>
                    <p className="mt-2 text-sm leading-6">{template.strengths}</p>
                  </div>
                  <div className={cn("rounded-2xl border p-5", theme.surfaceClass, theme.borderClass)}>
                    <p className={cn("text-[11px] uppercase tracking-[0.25em]", theme.mutedTextClass)}>Education level</p>
                    <p className="mt-2 text-sm font-semibold">{template.educationLevel}</p>
                    <p className={cn("mt-2 text-sm leading-6", theme.mutedTextClass)}>The builder keeps the layout clean and printable across page sizes.</p>
                  </div>
                </div>

                <div>
                  <p className={cn("text-[11px] uppercase tracking-[0.25em]", theme.mutedTextClass)}>Subject scores</p>
                  <div className="mt-3 grid gap-3">
                    {template.subjects.map((subject) => (
                      <div key={subject.name} className={cn("flex items-center justify-between rounded-2xl border px-4 py-3", theme.surfaceClass, theme.borderClass)}>
                        <span className="font-medium">{subject.name}</span>
                        <Badge variant="outline" className={theme.chipClass}>
                          {subject.score}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle>Integrations & deployment</CardTitle>
              <CardDescription>Use these settings to connect analytics or host the admin app cleanly on cPanel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="rounded-xl border border-border/60 bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong>PostHog analytics</strong>
                  <Badge variant="outline" className={posthogReady ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-800 border-amber-200"}>
                    {posthogReady ? "Configured" : "Needs env vars"}
                  </Badge>
                </div>
                <p className="mt-2 text-muted-foreground">
                  Set <span className="font-mono">VITE_POSTHOG_KEY</span> and <span className="font-mono">VITE_POSTHOG_HOST</span> to enable event tracking for admin actions, template saves, and PDF exports.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-background p-4">
                <div className="flex items-center justify-between gap-3">
                  <strong>PDF service</strong>
                  <Badge variant="outline" className={pdfServiceReady ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"}>
                    {pdfServiceReady ? "Remote" : "Local fallback"}
                  </Badge>
                </div>
                <p className="mt-2 text-muted-foreground">
                  Use <span className="font-mono">VITE_PDF_SERVICE_URL</span> in production. On cPanel, deploy the Vite build to static hosting and keep the PDF service on a separate Node endpoint or a proxy target.
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-background p-4">
                <strong>Recommended next tools</strong>
                <ul className="mt-2 space-y-2 text-muted-foreground">
                  <li>• PostHog for product analytics and admin usage tracking</li>
                  <li>• Sentry for runtime error monitoring</li>
                  <li>• cPanel or Vercel for frontend hosting, depending on your deployment path</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}