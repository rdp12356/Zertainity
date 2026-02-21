import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SUBJECT_OPTIONS_12TH = [
  "Physics", "Chemistry", "Mathematics", "Biology", "Computer Science",
  "English", "Economics", "Accountancy", "Business Studies", "Physical Education",
  "Psychology", "Geography", "History", "Political Science", "Sociology"
];

const LANGUAGE_OPTIONS = [
  "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali",
  "Marathi", "Gujarati", "Urdu", "Punjabi", "Sanskrit", "French", "Russian"
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
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setter(updated);
  };

  const validateAndSubmit = () => {
    if (educationLevel === 'after-10th') {
      const class9Valid = class9Marks.slice(0, 4).every(m => m.marks && parseFloat(m.marks) >= 0 && parseFloat(m.marks) <= 100 && m.interest);
      const class10Valid = class10Marks.slice(0, 4).every(m => m.marks && parseFloat(m.marks) >= 0 && parseFloat(m.marks) <= 100 && m.interest);
      const lang9 = class9Marks[4].subject && class9Marks[4].marks && class9Marks[4].interest;
      const lang10 = class10Marks[4].subject && class10Marks[4].marks && class10Marks[4].interest;

      if (!class9Valid || !class10Valid || !lang9 || !lang10) {
        toast({ title: "Please fill all mandatory fields", variant: "destructive" });
        return;
      }
    } else {
      const class11Valid = class11Subjects.slice(0, 5).every(s => s.subject && s.marks && s.interest && parseFloat(s.marks) >= 0 && parseFloat(s.marks) <= 100);
      const class12Valid = class12Subjects.slice(0, 5).every(s => s.subject && s.marks && s.interest && parseFloat(s.marks) >= 0 && parseFloat(s.marks) <= 100);

      if (!class11Valid || !class12Valid) {
        toast({ title: "Please fill at least 5 subjects for both grades", variant: "destructive" });
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
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/education-level")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Your Academic Journey
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <p className="text-center text-muted-foreground">
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
