import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSetCurves } from "@/components/CurvesContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Sparkles, TrendingUp, Share2, Check, Copy, Link2, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SEO } from "@/components/SEO";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  assessCareer,
  buildInterestsFromQuizAnswers,
  buildInterestsFromSubjectRows,
  buildMarksFromSubjectRows,
} from "@/lib/assessmentEngine";
import { escapeHtml, escapeHtmlAttribute, sanitizePdfFilename } from "@/utils/html";

/* ── Share slug: cryptographically stronger than Math.random (unguessable links) ── */
const generateSlug = (len = 12) => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
};

type ResultsLocationState = {
  educationLevel?: string;
  class9Marks?: unknown;
  class10Marks?: unknown;
  class11Subjects?: unknown;
  class12Subjects?: unknown;
  interests?: unknown;
  answers?: Record<string, number | string>;
  questions?: unknown[];
  marks?: number;
  customAnswers?: Record<number, string>;
};

type RiasecThemeMeta = {
  theme: string;
  code: string;
  fullName: string;
  color: string;
  description: string;
  keyCareers: string[];
};

const riasecThemesMeta: RiasecThemeMeta[] = [
  {
    theme: "Realistic",
    code: "R",
    fullName: "Realistic (Hands-on & Practical)",
    color: "#0ea5a4",
    description: "Hands-on, physical, active. Enjoys working with machines, tools, crafts, equipment, and being outdoors.",
    keyCareers: ["Civil Engineering", "Robotics", "Mechanical Engineering", "Defense Services"]
  },
  {
    theme: "Investigative",
    code: "I",
    fullName: "Investigative (Analytical & Scientific)",
    color: "#3b82f6",
    description: "Analytical, scientific, intellectual. Enjoys deep research, complex math, coding, and solving theoretical problems.",
    keyCareers: ["Data Science", "AI/ML Engineer", "Medicine", "Research Scientist"]
  },
  {
    theme: "Artistic",
    code: "A",
    fullName: "Artistic (Creative & Expressive)",
    color: "#ec4899",
    description: "Creative, expressive, original. Values imagination, aesthetics, creative design, and open-ended projects.",
    keyCareers: ["UI/UX Designer", "Product Designer", "Architect", "Content Creator"]
  },
  {
    theme: "Social",
    code: "S",
    fullName: "Social (Helping & Communicating)",
    color: "#10b981",
    description: "Cooperative, empathetic, nurturing. Values teaching, therapy, counseling, nursing, and team collaboration.",
    keyCareers: ["Psychologist", "Clinical Nurse", "Advisory Consultant", "Educationist"]
  },
  {
    theme: "Enterprising",
    code: "E",
    fullName: "Enterprising (Leading & Influencing)",
    color: "#f59e0b",
    description: "Persuasive, entrepreneurial, leadership-focused. Enjoys managing projects, startup ideas, and public speaking.",
    keyCareers: ["Management Consultant", "Product Manager", "Entrepreneur", "Financial Adviser"]
  },
  {
    theme: "Conventional",
    code: "C",
    fullName: "Conventional (Organised & Detail-oriented)",
    color: "#8b5cf6",
    description: "Organized, detail-oriented, systematic. Values structured workflows, records, financial spreadsheets, and rules.",
    keyCareers: ["Data Analyst", "Chartered Accountant", "Cybersecurity Auditor", "Investment Banker"]
  }
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border/80 bg-card/95 p-3.5 shadow-xl backdrop-blur-md max-w-[240px] transition-all duration-200">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: data.color }} />
          <span className="font-bold text-xs text-foreground">{data.fullName}</span>
        </div>
        <p className="text-[10px] text-muted-foreground leading-normal mb-2">
          {data.description}
        </p>
        <div className="flex items-center justify-between text-[10px] font-bold text-primary pt-1.5 border-t border-border/40">
          <span>Score Rating:</span>
          <span>{data.score} / 10 ({Math.round(data.score * 10)}%)</span>
        </div>
      </div>
    );
  }
  return null;
};

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as ResultsLocationState;
  const {
    educationLevel,
    class9Marks,
    class10Marks,
    class11Subjects,
    class12Subjects,
    interests,
    answers,
    questions,
    marks,
    customAnswers,
  } = state;

  const hasQuizPayload =
    !!answers &&
    !!questions &&
    Array.isArray(questions) &&
    questions.length > 0 &&
    typeof answers === "object" &&
    Object.keys(answers).length > 0;

  const effectiveEducationLevel = educationLevel ?? (hasQuizPayload ? "after-12th" : undefined);

  const savedRef = useRef(false);
  const [shareSlug, setShareSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const setCurves = useSetCurves();

  useEffect(() => {
    setCurves([
      { d: "M -160 200 C -40 140, 100 120, 300 160 S 580 260, 880 200", strokeOpacity: 0.13, strokeWidth: 5 },
      { d: "M -160 200 C -40 140, 100 120, 300 160 S 580 260, 880 200", strokeOpacity: 0.44, strokeWidth: 1.4 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

  const subjectRows = useMemo(() => [
    ...(Array.isArray(class9Marks) ? class9Marks : []),
    ...(Array.isArray(class10Marks) ? class10Marks : []),
    ...(Array.isArray(class11Subjects) ? class11Subjects : []),
    ...(Array.isArray(class12Subjects) ? class12Subjects : []),
  ], [class10Marks, class11Subjects, class12Subjects, class9Marks]);

  const assessment = useMemo(() => {
    const academicMarks = buildMarksFromSubjectRows(subjectRows);
    // Correctly pass answers, questions catalog, and customAnswers to restore high-accuracy calculations
    const interestRatings = {
      ...buildInterestsFromSubjectRows(subjectRows, typeof interests === "string" ? interests : undefined),
      ...buildInterestsFromQuizAnswers(answers, questions as any, customAnswers),
    };

    if (typeof marks === "number" && !Object.keys(academicMarks).length) {
      academicMarks.Mathematics = marks;
      academicMarks.English = marks;
      academicMarks["General Knowledge"] = marks;
    }

    return assessCareer({
      marks: academicMarks,
      interests: interestRatings,
      topN: 5,
    });
  }, [answers, subjectRows, interests, marks, questions, customAnswers]);

  const strengths = assessment.strengths;
  const recommendations = assessment.recommendations;
  const riasecProfile = assessment.riasecProfile;

  const chartData = useMemo(() => {
    if (!riasecProfile || !riasecProfile.scores) return [];
    return riasecThemesMeta.map((theme) => ({
      ...theme,
      score: riasecProfile.scores[theme.code] || 0,
    }));
  }, [riasecProfile]);

  useEffect(() => {
    if (!effectiveEducationLevel || savedRef.current) return;
    savedRef.current = true;

    const slug = generateSlug();
    const top = recommendations[0];

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      // 1. Save career history (logged-in users only)
      if (session?.user) {
        await supabase.from("career_history").insert({
          user_id: session.user.id,
          education_level: effectiveEducationLevel,
          top_recommendation: top?.stream ?? null,
          top_match_percent: top?.match ?? null,
          all_recommendations: {
            _strengths: strengths,
            _streams: effectiveEducationLevel === "after-10th" ? assessment.recommendedStreams : undefined,
            careers: recommendations.map(r => ({
              stream: r.stream,
              match: r.match,
              category: r.category,
              description: r.description,
              reasons: r.reasons,
              careers: r.careers,
            })),
          },
        });
      }

      // 2. Save shareable result (works for guests too)
      const recommendationsPayload = effectiveEducationLevel === "after-10th"
        ? { careers: recommendations, streams: assessment.recommendedStreams }
        : recommendations;

      const { error } = await supabase.from("shared_results").insert({
        slug,
        user_id: session?.user?.id ?? null,
        education_level: effectiveEducationLevel,
        strengths,
        recommendations: recommendationsPayload as any,
        top_recommendation: top?.stream ?? null,
        top_match_percent: top?.match ?? null,
        display_name: session?.user?.user_metadata?.full_name ?? null,
      });

      if (!error) setShareSlug(slug);
    });
  }, [effectiveEducationLevel, recommendations, strengths, assessment]);

  if (!effectiveEducationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  const shareUrl = shareSlug ? `${window.location.origin}/r/${shareSlug}` : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({ title: "Link copied! 🔗", description: "Share it with friends, parents or teachers." });
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    let htmlContent = "";
    let pdfFilename = sanitizePdfFilename(`zertainity-career-assessment-${new Date().toISOString().slice(0, 10)}.pdf`);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const studentName = session?.user?.user_metadata?.full_name || "Student";
      const dateString = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const educationLabel = effectiveEducationLevel === "after-10th" ? "After 10th" : "After 12th";
      const safeStudentName = escapeHtml(studentName);
      const safeStudentNameAttr = escapeHtmlAttribute(studentName);
      const safeEducationLabel = escapeHtml(educationLabel);
      const safeEducationLabelAttr = escapeHtmlAttribute(educationLabel);
      const safeDateString = escapeHtml(dateString);
      const safeStrengths = escapeHtml(strengths);
      const safeShareUrl = shareUrl ? escapeHtml(shareUrl) : null;
      const validSubjectRows = subjectRows
        .filter(row => row.subject && row.marks)
        .map(row => ({
          ...row,
          subject: escapeHtml(row.subject),
          marks: escapeHtml(row.marks),
          interest: escapeHtml(row.interest || 'Medium'),
        }));
      const pdfRecommendations = recommendations.map((rec) => ({
        ...rec,
        stream: escapeHtml(rec.stream),
        category: escapeHtml(rec.category),
        description: escapeHtml(rec.description),
        reasons: (rec.reasons || []).map((reason) => escapeHtml(reason)),
        careers: (rec.careers || []).map((career) => escapeHtml(career)),
      }));
      const pdfRecommendedStreams = (assessment.recommendedStreams || []).map((stream) => ({
        ...stream,
        streamName: escapeHtml(stream.streamName),
        matchLevel: escapeHtml(stream.matchLevel),
        subjects: (stream.subjects || []).map((subject) => escapeHtml(subject)),
        suitabilityAnalysis: escapeHtml(stream.suitabilityAnalysis),
        reasons: (stream.reasons || []).map((reason) => escapeHtml(reason)),
        careers: (stream.careers || []).map((career) => escapeHtml(career)),
      }));

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
          <meta name="description" content="Career Assessment Report - ${safeStudentNameAttr}">
          <meta name="keywords" content="career, assessment, guidance, zertainity, student, ${safeEducationLabelAttr}">
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
            
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-30deg);
              font-size: 72px;
              font-weight: 900;
              color: rgba(14, 165, 164, 0.05);
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
                  <div class="meta">Generated: ${safeDateString}</div>
                </td>
              </tr>
            </table>
          </header>

          <div class="student-info">
            <strong>Student:</strong> ${safeStudentName} &nbsp; | &nbsp; <strong>Level:</strong> ${safeEducationLabel}
          </div>

          <div class="section">
            <table class="cards-table">
              <tr>
                <td>
                  <div class="card card-left">
                    <strong>Overall Match</strong>
                    <div class="card-score">${recommendations[0]?.match || 0}%</div>
                    <div class="card-meta">Top suggested career: ${pdfRecommendations[0]?.stream || 'N/A'}</div>
                  </div>
                </td>
                <td>
                  <div class="card card-right">
                    <strong>${effectiveEducationLevel === 'after-10th' ? 'Recommended Streams' : 'Top Career Paths'}</strong>
                    <ul style="margin: 8px 0 0 16px; padding: 0; color: #4b5563; font-size: 12.5px; line-height: 1.4;">
                      ${effectiveEducationLevel === 'after-10th'
                        ? pdfRecommendedStreams.slice(0, 2).map((stream) => `<li>${stream.streamName} (${stream.matchScore}% Match)</li>`).join('')
                        : pdfRecommendations.slice(0, 2).map((rec) => `<li>${rec.stream} (${rec.match}% Match)</li>`).join('')
                      }
                    </ul>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Your Strengths</div>
            <p style="font-size: 13.5px; line-height: 1.5; margin: 6px 0;">${safeStrengths}</p>
          </div>

          ${validSubjectRows.length > 0 ? `
          <div class="section">
            <div class="section-title">Subject Scores & Interests</div>
            <table class="scores-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Marks</th>
                  <th>Interest Level</th>
                </tr>
              </thead>
              <tbody>
                ${validSubjectRows.map(row => `
                  <tr>
                    <td>${row.subject}</td>
                    <td>${row.marks}</td>
                    <td style="text-transform: capitalize;">${row.interest || 'Medium'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}

          ${effectiveEducationLevel === "after-10th" && pdfRecommendedStreams.length > 0 ? `
          <div class="section">
            <div class="section-title">Recommended High School Streams (Class 11 & 12)</div>
            <div class="recommendations-wrapper">
              ${pdfRecommendedStreams.map((stream, idx) => `
                <div class="rec" style="${idx === 0 ? 'border-left-color: #0ea5a4; background: #f0fdfa;' : 'border-left-color: #6b7280;'}">
                  <div class="rec-title">
                    ${stream.streamName}
                    <span class="rec-match">${stream.matchScore}% Match (${stream.matchLevel})</span>
                  </div>
                  <div class="rec-category">Core Subjects: ${stream.subjects.join(' · ')}</div>
                  <p style="margin: 6px 0;">${stream.suitabilityAnalysis}</p>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Why this fits:</strong></div>
                  <ul style="margin: 4px 0; padding-left: 18px;">
                    ${stream.reasons.map((r: any) => `<li>${r}</li>`).join('')}
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
              ${pdfRecommendations.map((rec, index) => `
                <div class="rec" style="${index === 0 ? 'border-left-color: #0ea5a4; background: #f8fafc;' : 'border-left-color: #6b7280;'}">
                  <div class="rec-title">
                    ${index + 1}. ${rec.stream}
                    <span class="rec-match">${rec.match}% Match</span>
                  </div>
                  <div class="rec-category">${rec.category}</div>
                  <p style="margin: 6px 0;">${rec.description}</p>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Why this fits:</strong></div>
                  <ul style="margin: 4px 0; padding-left: 18px;">
                    ${(rec.reasons || []).map(r => `<li>${r}</li>`).join('')}
                  </ul>
                  <div style="margin-top: 6px; font-size: 12.5px;"><strong>Career options:</strong> ${(rec.careers || []).join(', ')}</div>
                </div>
              `).join('')}
            </div>
          </div>

          ${safeShareUrl ? `
          <div class="section">
            <div class="section-title">Shareable Result Link</div>
            <p style="color: #0ea5a4; font-size: 13.5px; word-break: break-all; margin: 4px 0;">${safeShareUrl}</p>
          </div>
          ` : ''}

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

      pdfFilename = sanitizePdfFilename(pdfFilename);
      if (!token) throw new Error('Sign in required for server PDF generation; using local fallback');

      const { data: blob, error: functionError } = await supabase.functions.invoke('generate-pdf', {
        headers: { Authorization: `Bearer ${token}` },
        body: {
          html: htmlContent,
          author: 'Zertainity',
          subject: `Career Assessment Report - ${studentName}`,
          keywords: `career, assessment, guidance, zertainity, student, ${educationLabel}`,
          producer: 'Zertainity PDF Engine v1.0',
          filename: pdfFilename,
        }
      });

      if (functionError || !blob) {
        throw new Error(functionError?.message || 'PDF generation service failed');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdfFilename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({ title: "PDF downloaded", description: "Your assessment report has been saved." });
    } catch (error) {
      console.error("PDF service failed, trying client-side fallback:", error);
      try {
        const { generatePdfFallback } = await import('@/utils/pdfGenerator');
        await generatePdfFallback(htmlContent, pdfFilename);
      } catch (fallbackError) {
        console.error("Client-side fallback PDF generation failed:", fallbackError);
        toast({ title: "Download failed", description: "Unable to generate the PDF. Make sure a backend service is running or check browser capabilities.", variant: "destructive" });
      }
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 selection:bg-white/10 relative overflow-hidden font-sans">
      {/* Background ambient elements */}
      <div className="absolute top-[-10%] right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      <SEO
        title="Your Personalised Career Results"
        description="Personalised career recommendations based on your subjects, interests, and assessment responses."
        canonical="/results"
        noindex
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Assessment Results", path: "/results" },
        ]}
      />

      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10">
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/")} 
              className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-amber-500" />
              <span className="text-sm font-semibold tracking-tight text-white/90">
                Assessment Complete
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2.5">
            <Button
              id="results-download-header-btn"
              variant="outline"
              size="sm"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="rounded-full gap-2 font-semibold transition-all border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Preparing PDF..." : "Download PDF"}
            </Button>
            {shareUrl && (
              <Button
                id="results-share-header-btn"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-full gap-2 font-semibold transition-all border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Results"}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Career assessment report</p>
          <h2 
            className="text-4xl sm:text-5xl font-light tracking-[-1px] mb-3 text-white leading-tight"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Your Personalised Career Path
          </h2>
          <p className="text-white/60 max-w-2xl font-light text-sm leading-relaxed">
            Based on your academic performance, subject interest metrics, and occupational assessment responses, here are your diagnostic suggestions.
          </p>
        </div>

        <Card className="shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] mb-8 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl overflow-hidden text-white">
          <CardHeader className="pb-3 border-b border-white/10 bg-white/[0.01]">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-white">
              <Sparkles className="h-5 w-5 text-amber-400" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 pb-5">
            <p className="text-white/80 text-sm sm:text-base leading-relaxed font-light">{strengths}</p>
          </CardContent>
        </Card>

        {/* ── HIGH-FIDELITY HOLLAND RIASEC COMPONENT ── */}
        {riasecProfile && (
          <Card className="shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] mb-8 border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl overflow-hidden text-white relative">
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            <CardHeader className="pb-3 border-b border-white/10 bg-white/[0.01]">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                    Holland Occupational Themes (RIASEC)
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs sm:text-sm font-light text-white/60">
                    Your interest profile mapped to the 6 primary occupational groups of career science.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/55">
                    Holland Code:
                  </span>
                  <Badge className="bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-sm font-extrabold tracking-widest px-3 py-1.5 rounded-lg border border-amber-500/20 shadow-sm">
                    {riasecProfile.code}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 sm:p-6">
              <div className="grid gap-6 lg:grid-cols-12 items-center">
                {/* Radar Chart Column */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white/[0.01] rounded-2xl p-4 border border-white/5">
                  <div className="h-[270px] sm:h-[310px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="72%" data={chartData}>
                        <PolarGrid stroke="rgba(255,255,255,0.08)" />
                        <PolarAngleAxis 
                          dataKey="theme" 
                          tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: 500 }}
                        />
                        <PolarRadiusAxis 
                          angle={30} 
                          domain={[0, 10]} 
                          tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 8 }}
                        />
                        <Radar
                          name="Interest Score"
                          dataKey="score"
                          stroke="#f59e0b"
                          fill="#f59e0b"
                          fillOpacity={0.16}
                        />
                        <Tooltip content={<CustomTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Primary & Secondary Badge summary */}
                  <div className="mt-3.5 flex flex-wrap gap-2 justify-center">
                    <div className="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-sm">
                      Primary: {riasecProfile.primary.split(" ")[0]}
                    </div>
                    {riasecProfile.secondary && (
                      <div className="text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 shadow-sm">
                        Secondary: {riasecProfile.secondary.split(" ")[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Explanations Accordion Column */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="px-1">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-1.5">
                      Theme Characteristics
                    </h4>
                    <p className="text-xs text-white/60 leading-relaxed font-light">
                      Expand each theme to discover activity patterns, key attributes, and diagnostic matches:
                    </p>
                  </div>

                  <Accordion type="single" collapsible className="w-full border border-white/10 rounded-2xl overflow-hidden bg-white/[0.01] backdrop-blur-md">
                    {chartData.map((item) => {
                      const percentage = Math.round(item.score * 10);
                      
                      return (
                        <AccordionItem key={item.code} value={item.code} className="border-b border-white/10 last:border-0 hover:bg-white/[0.03] transition-all px-4 py-1">
                          <AccordionTrigger className="hover:no-underline py-3">
                            <div className="flex items-center justify-between w-full pr-4 text-left">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="h-3 w-3 rounded-full shadow-inner shrink-0" 
                                  style={{ backgroundColor: item.color }} 
                                />
                                <span className="font-bold text-sm text-white">
                                  {item.theme}
                                </span>
                                <span className="text-[9px] font-extrabold text-white/60 bg-white/5 px-1.5 py-0.5 rounded uppercase">
                                  {item.code}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <div className="hidden sm:block w-14 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full transition-all duration-300" 
                                    style={{ width: `${percentage}%`, backgroundColor: item.color }} 
                                  />
                                </div>
                                <span className="text-xs font-bold font-mono text-white/80" style={{ color: item.color }}>
                                  {item.score.toFixed(1)}/10
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-0.5 pb-4 text-white/70 leading-relaxed text-xs">
                            <p className="font-semibold text-white mb-1">{item.fullName}</p>
                            <p className="mb-2.5 font-light leading-relaxed">{item.description}</p>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-[9px] uppercase tracking-wide text-white/50">Target Careers:</span>
                              {item.keyCareers.map(cc => (
                                <span key={cc} className="px-2 py-0.5 rounded-md bg-white/5 text-white/80 text-[10px] font-medium border border-white/10">
                                  {cc}
                                </span>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {effectiveEducationLevel === "after-10th" && assessment.recommendedStreams && (
          <div className="mb-8 space-y-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">Academic Guidance</p>
              <h3 className="text-2xl font-bold tracking-tight text-white">Recommended High School Streams</h3>
              <p className="text-white/60 text-xs font-light mt-1">
                Based on your Class 9 & 10 marks trend and interest mapping, here are the most suitable streams for your senior secondary education (Class 11 & 12).
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {assessment.recommendedStreams.map((stream: any, idx: number) => {
                const isTop = idx === 0;
                return (
                  <Card
                    key={stream.streamName}
                    className={`shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:scale-[1.01] ${
                      isTop
                        ? "border border-amber-500/30 bg-gradient-to-br from-white/[0.02] via-white/[0.01] to-amber-500/5 ring-1 ring-amber-500/20 md:col-span-2 text-white rounded-2xl overflow-hidden"
                        : "border border-white/10 bg-white/[0.02] hover:border-amber-500/20 text-white rounded-2xl overflow-hidden"
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg leading-none font-bold tracking-tight text-white">
                              {stream.streamName}
                            </CardTitle>
                            {isTop && (
                              <Badge className="bg-amber-500 text-black text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                                Best Match
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="mt-2 text-xs text-white/60 font-semibold">
                            {stream.subjects.join(" · ")}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            stream.matchLevel === "High Match"
                              ? "bg-green-500/10 text-green-400"
                              : stream.matchLevel === "Moderate Match"
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-white/5 text-white/60"
                          }`}>
                            {stream.matchLevel}
                          </span>
                          <span className="text-lg font-extrabold text-amber-400">{stream.matchScore}%</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-1">
                      <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                        {stream.suitabilityAnalysis}
                      </p>

                      <div className="space-y-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                          Why this stream fits you
                        </h4>
                        <ul className="space-y-1.5 pl-4">
                          {stream.reasons.map((reason: any, rIdx: number) => (
                            <li key={rIdx} className="text-xs text-white/60 list-disc leading-normal font-light">
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-3 border-t border-white/10">
                        <span className="text-xs font-semibold text-white/80">Opens careers like:</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {stream.careers.map((career: any) => (
                            <Badge key={career} variant="secondary" className="text-xs font-medium rounded-md bg-white/5 text-white/80 border border-white/10">
                              {career}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-bold tracking-tight mb-5 text-white">Recommended Career Paths</h3>
          <div className="space-y-6">
            {recommendations.map((rec, index) => (
              <Card key={index} className="shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 bg-white/[0.02] backdrop-blur-md rounded-2xl overflow-hidden text-white hover:border-white/20 transition-all duration-300">
                <CardHeader className="pb-3 border-b border-white/10 bg-white/[0.01]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl font-bold mb-1 leading-snug text-white">{rec.stream}</CardTitle>
                      <CardDescription className="text-sm font-light text-white/60">{rec.category}</CardDescription>
                    </div>
                    <Badge className="w-fit rounded-full bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20 shadow-sm">
                      {rec.match}% match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-5">
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">{rec.description}</p>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs flex items-center gap-1.5 text-white uppercase tracking-wider">
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                      Why this fits you
                    </h4>
                    <ul className="space-y-1 ml-5">
                      {rec.reasons.map((reason, idx) => (
                        <li key={idx} className="text-xs text-white/60 list-disc font-light">{reason}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">Career options</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {rec.careers.map((career, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs font-medium rounded-md bg-white/5 text-white/80 border border-white/10">{career}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.01] p-4">
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Recommended next steps</h4>
                    <ul className="space-y-1.5 ml-5">
                      {rec.nextSteps.slice(0, 3).map((step, idx) => (
                        <li key={idx} className="text-xs text-white/60 list-disc font-light leading-normal">{step}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid gap-3.5 md:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/[0.01] p-4">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Suggested subjects</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {rec.suggestedSubjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="text-[10px] font-medium rounded-md bg-white/5 text-white/80 border border-white/10">{subject}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/[0.01] p-4">
                      <h4 className="font-bold text-xs text-white uppercase tracking-wider mb-2">Official pathway basis</h4>
                      <ul className="space-y-1 ml-4">
                        {rec.officialPathways.slice(0, 2).map((pathway) => (
                          <li key={pathway} className="text-xs text-white/60 list-disc font-light leading-normal">{pathway}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Shareable Link Card ── */}
        {shareUrl && (
          <Card className="shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-purple-500/20 bg-purple-950/20 rounded-2xl overflow-hidden text-white mb-6">
            <CardHeader className="pb-3 border-b border-white/10 bg-white/[0.01]">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-white">
                <Link2 className="h-5 w-5 text-amber-400" />
                Share Your Career Report
              </CardTitle>
              <CardDescription className="text-xs font-light text-white/60">
                Anyone with this link can view your career suggestions — no sign-up needed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5 pt-5">
              {/* URL Display box */}
              <div className="flex items-center gap-2 bg-black/40 rounded-xl border border-white/10 px-3 py-2 text-xs text-white">
                <span className="text-white/60 flex-1 truncate font-mono text-[10px]">{shareUrl}</span>
                <Button
                  id="results-copy-link-btn"
                  size="sm"
                  variant={copied ? "default" : "outline"}
                  onClick={handleCopy}
                  className={`shrink-0 rounded-lg gap-1.5 font-bold text-xs transition-all ${
                    copied 
                      ? "bg-green-500 hover:bg-green-600 text-white border-green-600 shadow-lg shadow-green-500/20" 
                      : "border-white/10 bg-white/5 text-white/80 hover:bg-white/10 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {copied ? (
                    <><Check className="h-3.5 w-3.5 text-white animate-scale-up" /> Copied!</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy Link</>
                  )}
                </Button>
              </div>
              {/* Share buttons */}
              <div className="flex flex-wrap gap-2 pt-0.5">
                <a
                  id="results-share-whatsapp"
                  href={`https://wa.me/?text=${encodeURIComponent(`🎓 Check out my Zertainity career results! ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white shadow-sm transition-all"
                >
                  <svg className="h-3.5 w-3.5" fill="#25D366" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
                <a
                  id="results-share-twitter"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Just discovered my career path with Zertainity! 🎓✨`)}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white shadow-sm transition-all"
                >
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter / X
                </a>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/10 bg-gradient-to-r from-purple-950/40 to-amber-950/30 backdrop-blur-md rounded-2xl overflow-hidden text-center text-white relative">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-white text-2xl font-bold">Ready to Start Your Journey?</CardTitle>
            <CardDescription className="text-white/70 font-light text-xs sm:text-sm">
              Take the next step towards your future. Research these paths and discuss options with teachers and counsellors.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <Button variant="secondary" size="lg" className="rounded-full font-bold px-6 bg-amber-500 text-black hover:bg-amber-600 hover:scale-105 active:scale-98 transition-all duration-300 border-0" onClick={() => navigate("/")}>
              Back to Home
            </Button>
            <Button
              id="results-download-mobile-btn"
              variant="outline"
              size="lg"
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="border-white/20 text-white/90 hover:bg-white/10 bg-white/5 rounded-full gap-2 font-bold px-6 transition-all duration-300 hover:text-white hover:border-white/30"
            >
              <Download className="h-4 w-4" />
              {downloading ? "Preparing PDF..." : "Download PDF"}
            </Button>
            {shareUrl && (
              <Button
                id="results-share-mobile-btn"
                variant="outline"
                size="lg"
                onClick={handleCopy}
                className="border-white/20 text-white/90 hover:bg-white/10 bg-white/5 rounded-full gap-2 font-bold px-6 transition-all duration-300 hover:text-white hover:border-white/30"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Share2 className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Results"}
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
