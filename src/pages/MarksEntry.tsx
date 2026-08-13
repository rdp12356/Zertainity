import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { AssessmentStepper } from "@/components/AssessmentStepper";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowLeft, ArrowRight, Info, CheckCircle2, Circle, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
const SUBJECT_OPTIONS_12TH = [
  "English", "Hindi", "Sanskrit", "Mathematics", "Applied Mathematics",
  "Physics", "Chemistry", "Biology", "Biotechnology", "Computer Science",
  "Informatics Practices", "Artificial Intelligence", "Data Science",
  "Web Application", "Economics", "Accountancy", "Business Studies",
  "Entrepreneurship", "History", "Geography", "Political Science",
  "Sociology", "Psychology", "Legal Studies", "Mass Media Studies",
  "Fine Arts", "Painting", "Graphic Design", "Fashion Studies",
  "Physical Education", "Home Science", "Agriculture", "Engineering Graphics",
  "Tourism", "Marketing", "Banking", "Insurance", "Financial Markets Management",
  "Retail", "Healthcare", "Food Nutrition and Dietetics", "Yoga",
  "Music", "Dance", "Theatre Studies"
];

const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Sanskrit", "Urdu", "Punjabi", "Bengali", "Tamil",
  "Telugu", "Kannada", "Malayalam", "Marathi", "Gujarati", "Odia",
  "Assamese", "Manipuri", "Nepali", "Sindhi", "Kashmiri", "Bodo",
  "Dogri", "Maithili", "Santali", "French", "German", "Spanish",
  "Russian", "Japanese", "Chinese", "Arabic", "Persian"
];

interface SubjectMarks {
  subject: string;
  marks: string;
  interest?: 'high' | 'mid' | 'low';
}

const SubjectCombobox = ({ options, value, onChange, placeholder }: { options: string[], value: string, onChange: (val: string) => void, placeholder: string }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9 bg-background font-normal border-border/50 hover:bg-background"
        >
          {value ? value : <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search subject..." />
          <CommandList>
            <CommandEmpty>No subject found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option}
                  value={option}
                  onSelect={() => {
                    onChange(option === value ? "" : option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

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
  const [board, setBoard] = useState<"cbse" | "icse" | "ib">(location.state?.board || "cbse");
  const [activeTab, setActiveTab] = useState(educationLevel === 'after-10th' ? "grade9" : "grade11");

  if (!educationLevel) {
    return <Navigate to="/education-level" replace />;
  }

  const isAfter10th = educationLevel === 'after-10th';

  const normalizeMarksInput = (value: string) => {
    if (value === "") return "";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "";
    const maxMarks = board === 'ib' ? 7 : 100;
    return String(Math.max(0, Math.min(maxMarks, numericValue)));
  };

  const hasValidMarks = (row: SubjectMarks) => {
    const score = Number(row.marks);
    const maxMarks = board === 'ib' ? 7 : 100;
    return Boolean(row.subject && row.marks !== "" && Number.isFinite(score) && score >= 0 && score <= maxMarks && row.interest);
  };

  const updateMarks = (
    grade: '9' | '10' | '11' | '12',
    index: number,
    field: 'subject' | 'marks' | 'interest',
    value: string
  ) => {
    const setter = grade === '9' ? setClass9Marks : grade === '10' ? setClass10Marks : grade === '11' ? setClass11Subjects : setClass12Subjects;
    const current = grade === '9' ? class9Marks : grade === '10' ? class10Marks : grade === '11' ? class11Subjects : class12Subjects;
    
    const updated = [...current];
    if (field === 'interest') {
      updated[index] = { ...updated[index], interest: value as 'high' | 'mid' | 'low' };
    } else if (field === 'marks') {
      const normalized = normalizeMarksInput(value);
      // Auto-assign default interest ('high' for >=80%, 'mid' otherwise) if student hasn't picked one yet
      const score = Number(normalized);
      const defaultInterest = normalized !== "" ? (score >= (board === 'ib' ? 6 : 80) ? 'high' : 'mid') : undefined;
      const currentInterest = updated[index].interest || defaultInterest;
      updated[index] = { ...updated[index], marks: normalized, interest: currentInterest };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setter(updated);

    // Smart sync subjects and interest across paired grades (9 <-> 10 and 11 <-> 12)
    if (grade === '11') {
      setClass12Subjects(prev => {
        const next = [...prev];
        if (field === 'subject') {
          if (!next[index].subject || next[index].subject === current[index].subject) {
            next[index] = { ...next[index], subject: value };
          }
        } else if (field === 'interest') {
          if (!next[index].interest || next[index].interest === current[index].interest) {
            next[index] = { ...next[index], interest: value as 'high' | 'mid' | 'low' };
          }
        }
        return next;
      });
    } else if (grade === '12') {
      setClass11Subjects(prev => {
        const next = [...prev];
        if (field === 'subject' && !next[index].subject) {
          next[index] = { ...next[index], subject: value };
        } else if (field === 'interest' && !next[index].interest) {
          next[index] = { ...next[index], interest: value as 'high' | 'mid' | 'low' };
        }
        return next;
      });
    } else if (grade === '9') {
      setClass10Marks(prev => {
        const next = [...prev];
        if (field === 'subject' && index === 4) {
          if (!next[4].subject || next[4].subject === current[4].subject) {
            next[4] = { ...next[4], subject: value };
          }
        } else if (field === 'interest') {
          if (!next[index].interest || next[index].interest === current[index].interest) {
            next[index] = { ...next[index], interest: value as 'high' | 'mid' | 'low' };
          }
        }
        return next;
      });
    } else if (grade === '10') {
      setClass9Marks(prev => {
        const next = [...prev];
        if (field === 'subject' && index === 4 && !next[4].subject) {
          next[4] = { ...next[4], subject: value };
        } else if (field === 'interest' && !next[index].interest) {
          next[index] = { ...next[index], interest: value as 'high' | 'mid' | 'low' };
        }
        return next;
      });
    }
  };

  const class9ValidCount = class9Marks.slice(0, 5).filter(hasValidMarks).length;
  const class10ValidCount = class10Marks.slice(0, 5).filter(hasValidMarks).length;
  const class11ValidCount = class11Subjects.slice(0, 5).filter(hasValidMarks).length;
  const class12ValidCount = class12Subjects.slice(0, 5).filter(hasValidMarks).length;

  const copyGrade1ToGrade2 = () => {
    if (isAfter10th) {
      setClass10Marks(class9Marks.map(item => ({ ...item })));
      toast({ title: "Copied!", description: "Class 9 subjects and marks copied to Class 10." });
    } else {
      setClass12Subjects(class11Subjects.map(item => ({ ...item })));
      toast({ title: "Copied!", description: "Class 11 subjects and marks copied to Class 12." });
    }
  };

  const validateAndSubmit = () => {
    if (isAfter10th) {
      const class9Valid = class9Marks.slice(0, 4).every(hasValidMarks);
      const lang9 = hasValidMarks(class9Marks[4]);
      const class10Valid = class10Marks.slice(0, 4).every(hasValidMarks);
      const lang10 = hasValidMarks(class10Marks[4]);

      if (!class9Valid || !lang9) {
        setActiveTab("grade9");
        toast({ 
          title: "Incomplete Class 9 Marks", 
          description: "Please complete all 5 subjects and marks for Class 9th.", 
          variant: "destructive" 
        });
        return;
      }

      if (!class10Valid || !lang10) {
        setActiveTab("grade10");
        toast({ 
          title: "Class 10 Marks Needed", 
          description: "Please enter your Class 10th marks (or click 'Copy from Class 9th' to duplicate).", 
          variant: "default" 
        });
        return;
      }
    } else {
      const class11Valid = class11Subjects.slice(0, 5).every(hasValidMarks);
      const class12Valid = class12Subjects.slice(0, 5).every(hasValidMarks);
      const class11OptionalValid = (!class11Subjects[5].subject && !class11Subjects[5].marks && !class11Subjects[5].interest) || hasValidMarks(class11Subjects[5]);
      const class12OptionalValid = (!class12Subjects[5].subject && !class12Subjects[5].marks && !class12Subjects[5].interest) || hasValidMarks(class12Subjects[5]);

      if (!class11Valid || !class11OptionalValid) {
        setActiveTab("grade11");
        toast({ 
          title: "Incomplete Class 11 Marks", 
          description: "Please select 5 subjects and enter marks for Class 11th.", 
          variant: "destructive" 
        });
        return;
      }

      if (!class12Valid || !class12OptionalValid) {
        setActiveTab("grade12");
        toast({ 
          title: "Class 12 Marks Needed", 
          description: "Please enter your Class 12th marks (or click 'Copy from Class 11th' to duplicate).", 
          variant: "default" 
        });
        return;
      }
    }

    if (!interests.trim()) {
      toast({ title: "Passions & Interests", description: "Please briefly describe your interests so we can better tailor your career suggestions.", variant: "destructive" });
      return;
    }

    navigate("/results", {
      state: {
        educationLevel,
        board,
        class9Marks: isAfter10th ? class9Marks : undefined,
        class10Marks: isAfter10th ? class10Marks : undefined,
        class11Subjects: !isAfter10th ? class11Subjects : undefined,
        class12Subjects: !isAfter10th ? class12Subjects : undefined,
        interests
      }
    });
  };

  const renderSubjectRow = (grade: '9'|'10'|'11'|'12', data: SubjectMarks[], index: number, isOptional = false) => {
    const row = data[index];
    const isLang = isAfter10th && index === 4;
    const isValid = hasValidMarks(row);
    
    return (
      <div key={index} className={`flex flex-col sm:flex-row gap-4 p-4 rounded-xl border transition-all duration-200 bg-card hover:shadow-sm ${isValid ? "border-primary/30 bg-primary/[0.03]" : "border-border/40 hover:border-border/80"}`}>
        <div className="flex-1 space-y-1.5 min-w-[200px]">
          <Label className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Subject {isOptional ? "(Optional)" : ""}</span>
            {isValid ? (
              <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-500">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Valid
              </span>
            ) : (
              <Circle className="w-3.5 h-3.5 text-muted-foreground/30" />
            )}
          </Label>
          {isAfter10th && !isLang ? (
            <div className="h-9 flex items-center px-3 rounded-md bg-muted/50 border border-border/50 text-sm font-medium">
              {row.subject}
            </div>
          ) : isLang ? (
            <Input
              type="text"
              value={row.subject}
              onChange={(e) => updateMarks(grade, index, 'subject', e.target.value)}
              placeholder="e.g. Hindi, Sanskrit, etc."
              className="h-9 bg-background border-border/50 text-sm font-medium focus-visible:ring-primary/20"
            />
          ) : (
            <SubjectCombobox 
              options={SUBJECT_OPTIONS_12TH} 
              value={row.subject} 
              onChange={(val) => updateMarks(grade, index, 'subject', val)} 
              placeholder="Select subject..." 
            />
          )}
        </div>
        
        <div className="flex gap-4">
          <div className="space-y-1.5 w-[100px] shrink-0">
            <Label className="text-xs text-muted-foreground">{board === 'ib' ? 'Grade' : 'Marks'}</Label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max={board === 'ib' ? "7" : "100"}
                placeholder={board === 'ib' ? "1-7" : "0-100"}
                value={row.marks}
                onChange={(e) => updateMarks(grade, index, 'marks', e.target.value)}
                className={`h-9 bg-background ${board === 'ib' ? 'px-3' : 'pr-6'} ${row.marks && Number(row.marks) > (board === 'ib' ? 7 : 100) ? "border-destructive focus-visible:ring-destructive" : ""}`}
              />
              {board !== 'ib' && (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">%</span>
              )}
            </div>
          </div>
          
          <div className="space-y-1.5 flex-1 sm:w-[220px] shrink-0">
            <Label className="text-xs text-muted-foreground">Interest Level</Label>
            <ToggleGroup 
              type="single" 
              value={row.interest} 
              onValueChange={(val) => {
                if (val) updateMarks(grade, index, 'interest', val);
              }}
              className="justify-start w-full bg-muted/30 p-1 rounded-lg border border-border/50 gap-1"
            >
              <ToggleGroupItem 
                value="low" 
                className="flex-1 h-7 text-xs font-medium transition-all data-[state=on]:bg-amber-500/20 data-[state=on]:text-amber-500 data-[state=on]:border data-[state=on]:border-amber-500/40 data-[state=on]:font-semibold hover:bg-muted/60"
              >
                Low
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="mid" 
                className="flex-1 h-7 text-xs font-medium transition-all data-[state=on]:bg-blue-500/20 data-[state=on]:text-blue-500 data-[state=on]:border data-[state=on]:border-blue-500/40 data-[state=on]:font-semibold hover:bg-muted/60"
              >
                Med
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="high" 
                className="flex-1 h-7 text-xs font-medium transition-all data-[state=on]:bg-emerald-500/20 data-[state=on]:text-emerald-500 data-[state=on]:border data-[state=on]:border-emerald-500/40 data-[state=on]:font-semibold hover:bg-muted/60"
              >
                High
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <button
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 rounded-full hover:bg-muted/50 transition-colors"
                aria-label="Go back"
            >
                <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="min-w-0">
                    <h1 className="text-[15px] font-normal leading-tight" style={{ color: 'var(--z-ink)' }}>Enter Marks</h1>
                    <p className="text-[12px] font-light truncate" style={{ color: 'var(--z-ink-muted)' }}>{isAfter10th ? "9th & 10th Grade" : "11th & 12th Grade"}</p>
                </div>
            </div>
        </div>
      </header>

      <main className="mx-auto max-w-[800px] px-6 py-8 w-full">
        <AssessmentStepper currentStep={3} totalSteps={5} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
          className="mt-8 space-y-8"
        >
          <div className="text-center mb-8">
              <h2 className="text-[28px] sm:text-[36px] font-light tracking-[-0.8px] leading-[1.1] mb-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--z-ink)' }}>
                  Academic Performance
              </h2>
              <p className="text-[15px] font-light max-w-xl mx-auto" style={{ color: 'var(--z-ink-muted)' }}>
                  Your past marks and interests help us find patterns in what you excel at and enjoy. Let's log your scores for {isAfter10th ? "9th and 10th" : "11th and 12th"} grade.
              </p>
          </div>

          <div className="flex justify-center mb-6">
            <ToggleGroup type="single" value={board} onValueChange={(val) => val && setBoard(val as any)} className="bg-muted/40 p-1 rounded-lg border border-border/50">
              <ToggleGroupItem value="cbse" className="h-9 px-4 text-sm font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm">CBSE</ToggleGroupItem>
              <ToggleGroupItem value="icse" className="h-9 px-4 text-sm font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm">ICSE</ToggleGroupItem>
              <ToggleGroupItem value="ib" className="h-9 px-4 text-sm font-medium data-[state=on]:bg-background data-[state=on]:shadow-sm">IB</ToggleGroupItem>
            </ToggleGroup>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/40 mb-6">
              <TabsTrigger value={isAfter10th ? "grade9" : "grade11"} className="h-10 rounded-md text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2">
                <span>{isAfter10th ? "Class 9th" : "Class 11th"}</span>
                <span className={cn(
                  "text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold",
                  (isAfter10th ? class9ValidCount : class11ValidCount) >= 5 
                    ? "bg-emerald-500/20 text-emerald-500" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {(isAfter10th ? class9ValidCount : class11ValidCount)}/5
                </span>
              </TabsTrigger>
              <TabsTrigger value={isAfter10th ? "grade10" : "grade12"} className="h-10 rounded-md text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm flex items-center justify-center gap-2">
                <span>{isAfter10th ? "Class 10th" : "Class 12th"}</span>
                <span className={cn(
                  "text-[11px] px-2 py-0.5 rounded-full font-mono font-semibold",
                  (isAfter10th ? class10ValidCount : class12ValidCount) >= 5 
                    ? "bg-emerald-500/20 text-emerald-500" 
                    : (isAfter10th ? class10ValidCount : class12ValidCount) > 0
                      ? "bg-amber-500/20 text-amber-500"
                      : "bg-muted text-muted-foreground"
                )}>
                  {(isAfter10th ? class10ValidCount : class12ValidCount)}/5
                </span>
              </TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              {activeTab === (isAfter10th ? "grade9" : "grade11") && (
                <TabsContent value={isAfter10th ? "grade9" : "grade11"} asChild forceMount>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {isAfter10th 
                      ? class9Marks.map((_, idx) => renderSubjectRow('9', class9Marks, idx, false))
                      : class11Subjects.map((_, idx) => renderSubjectRow('11', class11Subjects, idx, idx === 5))}

                    <div className="flex justify-end pt-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveTab(isAfter10th ? "grade10" : "grade12")}
                        className="gap-1.5 h-9 font-medium"
                      >
                        Next: Enter {isAfter10th ? "Class 10th" : "Class 12th"} Marks
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                </TabsContent>
              )}
              
              {activeTab === (isAfter10th ? "grade10" : "grade12") && (
                <TabsContent value={isAfter10th ? "grade10" : "grade12"} asChild forceMount>
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-lg bg-muted/40 border border-border/50 text-xs mb-2">
                      <span className="text-muted-foreground">
                        Have similar scores in {isAfter10th ? "Class 10th" : "Class 12th"}? You can copy them in 1 click:
                      </span>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        size="sm" 
                        onClick={copyGrade1ToGrade2} 
                        className="h-7 text-xs gap-1 font-medium shrink-0"
                      >
                        ⚡ Copy from {isAfter10th ? "Class 9th" : "Class 11th"}
                      </Button>
                    </div>

                    {isAfter10th 
                      ? class10Marks.map((_, idx) => renderSubjectRow('10', class10Marks, idx, false))
                      : class12Subjects.map((_, idx) => renderSubjectRow('12', class12Subjects, idx, idx === 5))}
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>

          <Card className="border border-border/40 shadow-sm bg-card overflow-hidden mt-8">
            <CardHeader className="bg-muted/10 pb-4 border-b border-border/20">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                Passions & Hobbies
              </CardTitle>
              <CardDescription>
                Briefly describe what you love doing outside of typical classwork. This context is invaluable for our career match.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Textarea
                placeholder="E.g., I love solving mathematical problems, enjoy reading about history, passionate about coding, interested in helping people, like creating art..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={5}
                className="resize-none bg-background focus-visible:ring-primary/20"
              />
            </CardContent>
          </Card>

          <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-3">
            <Button
                variant="outline"
                className="sm:w-auto h-12"
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
            <Button 
                className="flex-1 h-12 text-sm sm:text-base font-medium shadow-sm transition-all active:scale-[0.98]"
                onClick={validateAndSubmit} 
            >
                Complete Assessment & Get Results
                <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default MarksEntry;
