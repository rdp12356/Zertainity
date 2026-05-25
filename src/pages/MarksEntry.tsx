


import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const SUBJECT_OPTIONS_12TH = [
  "English",
  "Hindi",
  "Sanskrit",
  "Mathematics",
  "Applied Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Biotechnology",
  "Computer Science",
  "Informatics Practices",
  "Artificial Intelligence",
  "Data Science",
  "Web Application",
  "Economics",
  "Accountancy",
  "Business Studies",
  "Entrepreneurship",
  "History",
  "Geography",
  "Political Science",
  "Sociology",
  "Psychology",
  "Legal Studies",
  "Mass Media Studies",
  "Fine Arts",
  "Painting",
  "Graphic Design",
  "Fashion Studies",
  "Physical Education",
  "Home Science",
  "Agriculture",
  "Engineering Graphics",
  "Tourism",
  "Marketing",
  "Banking",
  "Insurance",
  "Financial Markets Management",
  "Retail",
  "Healthcare",
  "Food Nutrition and Dietetics",
  "Yoga",
  "Music",
  "Dance",
  "Theatre Studies"
];

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Sanskrit",
  "Urdu",
  "Punjabi",
  "Bengali",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Marathi",
  "Gujarati",
  "Odia",
  "Assamese",
  "Manipuri",
  "Nepali",
  "Sindhi",
  "Kashmiri",
  "Bodo",
  "Dogri",
  "Maithili",
  "Santali",
  "French",
  "German",
  "Spanish",
  "Russian",
  "Japanese",
  "Chinese",
  "Arabic",
  "Persian"
];

interface SubjectMarks {
  subject: string;
  marks: string;
  interest?: 'high' | 'mid' | 'low';
}

const MarksEntry = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { educationLevel } = location.state || {};

  const [class9Marks, setClass9Marks] = useState<SubjectMarks[]>([
    { subject: "English", marks: "", interest: undefined },
    { subject: "Mathematics", marks: "", interest: undefined },
    { subject: "Science", marks: "", interest: undefined },
    { subject: "Social Studies", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined }
  ]);

  const [class10Marks, setClass10Marks] = useState<SubjectMarks[]>([
    { subject: "English", marks: "", interest: undefined },
    { subject: "Mathematics", marks: "", interest: undefined },
    { subject: "Science", marks: "", interest: undefined },
    { subject: "Social Studies", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined }
  ]);

  const [class11Subjects, setClass11Subjects] = useState<SubjectMarks[]>([
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined }
  ]);

  const [class12Subjects, setClass12Subjects] = useState<SubjectMarks[]>([
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined },
    { subject: "", marks: "", interest: undefined }
  ]);

  const [interests, setInterests] = useState("");

  if (!educationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  const normalizeMarksInput = (value: string) => {
    if (value === "") return "";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "";
    return String(Math.max(0, Math.min(100, numericValue)));
  };

  const hasValidMarks = (row: SubjectMarks) => {
    const score = Number(row.marks);
    return row.subject && row.marks !== "" && Number.isFinite(score) && score >= 0 && score <= 100 && row.interest;
  };

  const updateMarks = (
    grade: '9' | '10' | '11' | '12',
    index: number,
    field: 'subject' | 'marks' | 'interest',
    value: string | 'high' | 'mid' | 'low'
  ) => {
    const setter = grade === '9' ? setClass9Marks : grade === '10' ? setClass10Marks : grade === '11' ? setClass11Subjects : setClass12Subjects;
    const current = grade === '9' ? class9Marks : grade === '10' ? class10Marks : grade === '11' ? class11Subjects : class12Subjects;
    
    const updated = [...current];
    if (field === 'interest') {
      updated[index] = { ...updated[index], interest: value as 'high' | 'mid' | 'low' };
    } else if (field === 'marks') {
      updated[index] = { ...updated[index], marks: normalizeMarksInput(value) };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setter(updated);
  };

  const validateAndSubmit = () => {
    if (educationLevel === 'after-10th') {
      const class9Valid = class9Marks.slice(0, 4).every(hasValidMarks);
      const class10Valid = class10Marks.slice(0, 4).every(hasValidMarks);
      const lang9 = hasValidMarks(class9Marks[4]);
      const lang10 = hasValidMarks(class10Marks[4]);

      if (!class9Valid || !class10Valid || !lang9 || !lang10) {
        toast({ title: "Please fill all mandatory fields with marks between 0 and 100", variant: "destructive" });
        return;
      }
    } else {
      const class11Valid = class11Subjects.slice(0, 5).every(hasValidMarks);
      const class12Valid = class12Subjects.slice(0, 5).every(hasValidMarks);
      const class11OptionalValid = !class11Subjects[5].subject && !class11Subjects[5].marks && !class11Subjects[5].interest || hasValidMarks(class11Subjects[5]);
      const class12OptionalValid = !class12Subjects[5].subject && !class12Subjects[5].marks && !class12Subjects[5].interest || hasValidMarks(class12Subjects[5]);

      if (!class11Valid || !class12Valid || !class11OptionalValid || !class12OptionalValid) {
        toast({ title: "Please fill at least 5 subjects for both grades with marks between 0 and 100", variant: "destructive" });
        return;
      }
    }

    if (!interests.trim()) {
      toast({ title: "Please describe your interests", variant: "destructive" });
      return;
    }

    navigate("/results", {
      state: {
        educationLevel,
        class9Marks: educationLevel === 'after-10th' ? class9Marks : undefined,
        class10Marks: educationLevel === 'after-10th' ? class10Marks : undefined,
        class11Subjects: educationLevel === 'after-12th' ? class11Subjects : undefined,
        class12Subjects: educationLevel === 'after-12th' ? class12Subjects : undefined,
        interests
      }
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--z-canvas)' }}>
      <header className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300" style={{ backgroundColor: 'var(--z-nav-bg)', borderBottom: '1px solid var(--z-border)' }}>
        <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/education-level")} className="w-8 h-8 flex items-center justify-center rounded-full" style={{ border: '1px solid var(--z-border)' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="var(--z-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <h1 className="text-[15px] font-normal" style={{ color: 'var(--z-ink)' }}>Your Academic Journey</h1>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-6 py-12 space-y-8">
        <p className="text-center text-[15px] font-light" style={{ color: 'var(--z-ink-muted)' }}>
          Enter your marks from {educationLevel === 'after-10th' ? '9th and 10th' : '11th and 12th'} grade (out of 100)
        </p>

        {educationLevel === 'after-10th' ? (
          <>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Class 9th</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {class9Marks.slice(0, 4).map((subject, idx) => (
                  <div key={idx} className="space-y-2">
                    <Label>{subject.subject}</Label>
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={subject.marks}
                        onChange={(e) => updateMarks('9', idx, 'marks', e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={subject.interest === 'high' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateMarks('9', idx, 'interest', 'high')}
                        >
                          High
                        </Button>
                        <Button
                          type="button"
                          variant={subject.interest === 'mid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateMarks('9', idx, 'interest', 'mid')}
                        >
                          Mid
                        </Button>
                        <Button
                          type="button"
                          variant={subject.interest === 'low' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateMarks('9', idx, 'interest', 'low')}
                        >
                          Low
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>Language</Label>
                  <div className="flex gap-3">
                    <Select value={class9Marks[4].subject} onValueChange={(val) => updateMarks('9', 4, 'subject', val)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={class9Marks[4].marks}
                      onChange={(e) => updateMarks('9', 4, 'marks', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={class9Marks[4].interest === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMarks('9', 4, 'interest', 'high')}
                    >
                      High
                    </Button>
                    <Button
                      type="button"
                      variant={class9Marks[4].interest === 'mid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMarks('9', 4, 'interest', 'mid')}
                    >
                      Mid
                    </Button>
                    <Button
                      type="button"
                      variant={class9Marks[4].interest === 'low' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMarks('9', 4, 'interest', 'low')}
                    >
                      Low
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Class 10th</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {class10Marks.slice(0, 4).map((subject, idx) => (
                  <div key={idx} className="space-y-2">
                    <Label>{subject.subject}</Label>
                    <div className="flex gap-3">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="0-100"
                        value={subject.marks}
                        onChange={(e) => updateMarks('10', idx, 'marks', e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={subject.interest === 'high' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateMarks('10', idx, 'interest', 'high')}
                        >
                          High
                        </Button>
                        <Button
                          type="button"
                          variant={subject.interest === 'mid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateMarks('10', idx, 'interest', 'mid')}
                        >
                          Mid
                        </Button>
                        <Button
                          type="button"
                          variant={subject.interest === 'low' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateMarks('10', idx, 'interest', 'low')}
                        >
                          Low
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="space-y-2">
                  <Label>Language</Label>
                  <div className="flex gap-3">
                    <Select value={class10Marks[4].subject} onValueChange={(val) => updateMarks('10', 4, 'subject', val)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGE_OPTIONS.map(lang => <SelectItem key={lang} value={lang}>{lang}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0-100"
                      value={class10Marks[4].marks}
                      onChange={(e) => updateMarks('10', 4, 'marks', e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={class10Marks[4].interest === 'high' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMarks('10', 4, 'interest', 'high')}
                    >
                      High
                    </Button>
                    <Button
                      type="button"
                      variant={class10Marks[4].interest === 'mid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMarks('10', 4, 'interest', 'mid')}
                    >
                      Mid
                    </Button>
                    <Button
                      type="button"
                      variant={class10Marks[4].interest === 'low' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateMarks('10', 4, 'interest', 'low')}
                    >
                      Low
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Class 11th</CardTitle>
                <p className="text-sm text-muted-foreground">Select 5-6 subjects (6th subject is optional)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {class11Subjects.map((subject, idx) => (
                  <div key={idx} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Subject {idx + 1} {idx === 5 && "(Optional)"}</Label>
                      <Select value={subject.subject} onValueChange={(val) => updateMarks('11', idx, 'subject', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {SUBJECT_OPTIONS_12TH.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Marks (0-100)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={subject.marks}
                          onChange={(e) => updateMarks('11', idx, 'marks', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Interest Level</Label>
                        <div className="flex gap-2">
                          {["high", "mid", "low"].map(level => (
                            <Button
                              key={level}
                              type="button"
                              size="sm"
                              variant={subject.interest === level ? "default" : "outline"}
                              onClick={() => updateMarks('11', idx, 'interest', level)}
                              className="flex-1 text-xs"
                            >
                              {level}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Class 12th</CardTitle>
                <p className="text-sm text-muted-foreground">Select 5-6 subjects (6th subject is optional)</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {class12Subjects.map((subject, idx) => (
                  <div key={idx} className="space-y-3 p-4 border border-border rounded-lg">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Subject {idx + 1} {idx === 5 && "(Optional)"}</Label>
                      <Select value={subject.subject} onValueChange={(val) => updateMarks('12', idx, 'subject', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {SUBJECT_OPTIONS_12TH.map(sub => <SelectItem key={sub} value={sub}>{sub}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Marks (0-100)</Label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          value={subject.marks}
                          onChange={(e) => updateMarks('12', idx, 'marks', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Interest Level</Label>
                        <div className="flex gap-2">
                          {["high", "mid", "low"].map(level => (
                            <Button
                              key={level}
                              type="button"
                              size="sm"
                              variant={subject.interest === level ? "default" : "outline"}
                              onClick={() => updateMarks('12', idx, 'interest', level)}
                              className="flex-1 text-xs"
                            >
                              {level}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Your Interests & Passions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Tell us about your interests, hobbies, and what subjects or activities you're passionate about. 
              This helps us assess if your interests align with suitable career paths.
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="E.g., I love solving mathematical problems, enjoy reading about history, passionate about coding, interested in helping people, like creating art..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              rows={6}
            />
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <Button variant="hero" size="lg" onClick={validateAndSubmit} className="px-12">
            Generate Assessment
          </Button>
        </div>
      </main>
    </div>
  );
};

export default MarksEntry;
