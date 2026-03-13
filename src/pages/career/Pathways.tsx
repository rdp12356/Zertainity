import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Search, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { usePermission } from "@/hooks/usePermission";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PathwayStep {
  phase: string;
  title: string;
  duration: string;
  description: string;
  requirements: string[];
}

const careerPathways: Record<string, PathwayStep[]> = {
  // Technology Careers
  "Software Engineer": [
    { phase: "School", title: "Foundation (Class 6-10)", duration: "5 years", description: "Focus on Mathematics, Science, and basic computer skills", requirements: ["Strong math foundation", "Logical thinking", "Computer basics"] },
    { phase: "School", title: "Higher Secondary (Class 11-12)", duration: "2 years", description: "Take PCM stream with Computer Science", requirements: ["Min 75% in PCM", "Learn programming basics (Python/Java)", "Participate in coding competitions"] },
    { phase: "College", title: "B.Tech Computer Science", duration: "4 years", description: "Engineering degree from recognized university", requirements: ["Clear JEE Main/Advanced", "Build projects & portfolio", "Internships", "DSA mastery"] },
    { phase: "Career", title: "Junior Developer → Senior Engineer", duration: "5+ years", description: "Start as junior developer, progress to senior roles", requirements: ["Strong coding skills", "System design knowledge", "Continuous learning", "Certifications"] }
  ],
  "Data Scientist": [
    { phase: "School", title: "Foundation", duration: "5 years", description: "Excel in Mathematics and Statistics", requirements: ["Strong analytical skills", "Math excellence", "Basic programming"] },
    { phase: "School", title: "Class 11-12 (PCM)", duration: "2 years", description: "Physics, Chemistry, Mathematics stream", requirements: ["Min 80% marks", "Statistics knowledge", "Python basics"] },
    { phase: "College", title: "B.Tech/B.Sc + M.Sc", duration: "4-5 years", description: "CS/Statistics/Math degree with specialization", requirements: ["ML/AI courses", "R/Python proficiency", "Projects on Kaggle", "Internships"] },
    { phase: "Career", title: "Data Analyst → Data Scientist", duration: "Ongoing", description: "Progress from analyst to scientist roles", requirements: ["ML expertise", "Big data tools", "Business acumen", "PhD (optional)"] }
  ],

  // Medical Careers
  "Doctor (MBBS)": [
    { phase: "School", title: "Foundation", duration: "5 years", description: "Strong foundation in all subjects, especially Science", requirements: ["Excellence in all subjects", "Science focus", "Biology interest"] },
    { phase: "School", title: "Class 11-12 (PCB)", duration: "2 years", description: "Physics, Chemistry, Biology with high marks", requirements: ["Min 90%+ in PCB", "NEET preparation", "Medical aptitude"] },
    { phase: "College", title: "MBBS", duration: "5.5 years", description: "Medical degree including 1 year internship", requirements: ["Clear NEET with high rank", "Dedication", "Empathy", "Long study hours"] },
    { phase: "Career", title: "PG/Practice", duration: "Lifetime", description: "MD/MS specialization or medical practice", requirements: ["NEET PG for specialization", "Clinical experience", "Continuous learning", "Patient care"] }
  ],
  "Dentist": [
    { phase: "School", title: "Foundation", duration: "5 years", description: "Focus on science subjects", requirements: ["Science aptitude", "Good hand-eye coordination", "Biology interest"] },
    { phase: "School", title: "Class 11-12 (PCB)", duration: "2 years", description: "Physics, Chemistry, Biology", requirements: ["85%+ marks", "NEET preparation", "Dexterity"] },
    { phase: "College", title: "BDS", duration: "5 years", description: "Bachelor of Dental Surgery", requirements: ["Clear NEET", "Practical skills", "Patient interaction"] },
    { phase: "Career", title: "Practice/MDS", duration: "Ongoing", description: "Private practice or specialization", requirements: ["License", "Clinical experience", "MDS for specialization"] }
  ],

  // Engineering Careers
  "Mechanical Engineer": [
    { phase: "School", title: "Foundation", duration: "5 years", description: "Mathematics and Physics focus", requirements: ["Strong math & physics", "Creative thinking", "Problem-solving"] },
    { phase: "School", title: "Class 11-12 (PCM)", duration: "2 years", description: "Physics, Chemistry, Mathematics", requirements: ["Min 75% marks", "Physics mastery", "JEE preparation"] },
    { phase: "College", title: "B.Tech Mechanical", duration: "4 years", description: "Mechanical Engineering degree", requirements: ["Clear JEE/State entrance", "Workshop training", "CAD software", "Internships"] },
    { phase: "Career", title: "Engineer → Manager", duration: "Ongoing", description: "Design, manufacturing, or management roles", requirements: ["Technical skills", "Industry certifications", "Leadership", "M.Tech (optional)"] }
  ],
  "Civil Engineer": [
    { phase: "School", title: "Foundation", duration: "5 years", description: "Math and Science foundation", requirements: ["Strong math skills", "Spatial thinking", "Drawing skills"] },
    { phase: "School", title: "Class 11-12 (PCM)", duration: "2 years", description: "Physics, Chemistry, Mathematics", requirements: ["75%+ marks", "Engineering drawing", "JEE preparation"] },
    { phase: "College", title: "B.Tech Civil", duration: "4 years", description: "Civil Engineering degree", requirements: ["Clear entrance exam", "AutoCAD skills", "Site visits", "Projects"] },
    { phase: "Career", title: "Site Engineer → Project Manager", duration: "Ongoing", description: "Construction, design, or consultancy", requirements: ["Field experience", "Project management", "Government exams (optional)"] }
  ],

  // Government Services
  "Civil Services (IAS/IPS)": [
    { phase: "School", title: "Foundation (6-10)", duration: "5 years", description: "Build strong academic foundation", requirements: ["All-round excellence", "Current affairs", "Reading habit"] },
    { phase: "School", title: "Class 11-12", duration: "2 years", description: "Any stream (Humanities recommended)", requirements: ["60%+ marks", "NCERT mastery", "Analytical thinking"] },
    { phase: "College", title: "Graduation (Any)", duration: "3-4 years", description: "Bachelor's degree in any discipline", requirements: ["Good GPA", "Optional subject selection", "Start UPSC prep in final year"] },
    { phase: "Preparation", title: "UPSC CSE", duration: "1-3 years", description: "Intensive Civil Services preparation", requirements: ["Complete syllabus", "Answer writing", "Current affairs", "Mock tests"] },
    { phase: "Career", title: "Training & Service", duration: "Lifetime", description: "LBSNAA training then postings", requirements: ["Clear UPSC", "Leadership skills", "Integrity", "Public service"] }
  ],

  // Finance Careers
  "Chartered Accountant": [
    { phase: "School", title: "Foundation", duration: "5 years", description: "Mathematics and accounts focus", requirements: ["Strong math", "Accounting basics", "Attention to detail"] },
    { phase: "School", title: "Class 11-12 (Commerce)", duration: "2 years", description: "Commerce with Accountancy", requirements: ["60%+ marks", "Start CA Foundation", "Accounting skills"] },
    { phase: "Training", title: "CA Course", duration: "4-5 years", description: "Foundation, Intermediate, Final + Articleship", requirements: ["Clear CA exams", "3 years articleship", "Dedication", "Continuous study"] },
    { phase: "Career", title: "CA Practice/Corporate", duration: "Ongoing", description: "Private practice or corporate jobs", requirements: ["ICAI membership", "Expertise area", "Networking", "Ethics"] }
  ],

  // Law Careers
  "Lawyer": [
    { phase: "School", title: "Foundation", duration: "5 years", description: "Strong language and reasoning skills", requirements: ["English proficiency", "Logical reasoning", "General awareness"] },
    { phase: "School", title: "Class 11-12", duration: "2 years", description: "Any stream (Humanities preferred)", requirements: ["60%+ marks", "Debating skills", "CLAT preparation"] },
    { phase: "College", title: "LLB (3/5 years)", duration: "3-5 years", description: "Law degree from recognized university", requirements: ["Clear CLAT/LSAT", "Internships", "Moot courts", "Legal research"] },
    { phase: "Career", title: "Junior → Senior Advocate", duration: "Ongoing", description: "Court practice or corporate law", requirements: ["Bar Council enrollment", "Court experience", "Specialization", "Networking"] }
  ],

  // Design Careers
  "Architect": [
    { phase: "School", title: "Foundation", duration: "5 years", description: "Math, art, and creative thinking", requirements: ["Math skills", "Drawing ability", "Creative mindset"] },
    { phase: "School", title: "Class 11-12", duration: "2 years", description: "PCM or any stream with Math", requirements: ["60%+ marks", "Portfolio development", "NATA preparation"] },
    { phase: "College", title: "B.Arch", duration: "5 years", description: "Architecture degree", requirements: ["Clear NATA/JEE Paper 2", "Design skills", "CAD proficiency", "Internships"] },
    { phase: "Career", title: "Architect Practice", duration: "Ongoing", description: "Firm job or independent practice", requirements: ["COA registration", "2 years experience", "Project portfolio", "M.Arch (optional)"] }
  ],

  // Default pathway for careers not explicitly defined
  "Default": [
    { phase: "School", title: "Foundation Years", duration: "5 years", description: "Build strong academic foundation in relevant subjects", requirements: ["Good academic record", "Subject interest", "Extracurricular activities"] },
    { phase: "School", title: "Higher Secondary", duration: "2 years", description: "Choose appropriate stream based on career goal", requirements: ["Relevant stream selection", "60%+ marks", "Entrance exam preparation"] },
    { phase: "College", title: "Undergraduate Degree", duration: "3-4 years", description: "Complete relevant bachelor's degree", requirements: ["Clear entrance exams", "Good GPA", "Internships", "Skill development"] },
    { phase: "Career", title: "Entry & Growth", duration: "Ongoing", description: "Start career and progress professionally", requirements: ["Entry-level job", "Certifications", "Experience", "Networking"] }
  ]
};

const Pathways = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<string | null>(
    location.state?.career || null
  );
  const { hasPermission, isLoading, userRole } = usePermission('edit_pathways');

  const availableCareers = Object.keys(careerPathways).filter(c => c !== "Default");
  const filteredCareers = availableCareers.filter(career =>
    career.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPath = selectedCareer
    ? (careerPathways[selectedCareer] || careerPathways["Default"])
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageSEO
        title="Career Pathways & Roadmaps"
        description="Step-by-step career journeys from school to dream job. Explore roadmaps for Software Engineering, Medical, Civil Services, Finance, and more."
        keywords="career pathways India, career roadmap, how to become an IAS officer, software engineer roadmap India, medical career path"
        canonical="/pathways"
      />
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:bg-muted rounded-none">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-foreground" />
              <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
                Career Pathways
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {!hasPermission && userRole && (
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You have view-only access. Contact an admin for editing permissions.
            </AlertDescription>
          </Alert>
        )}

        <div className="mb-12 border-b border-border pb-12">
          <h2 className="text-4xl font-serif font-bold mb-4 tracking-tight">Explore Your Career Journey</h2>
          <p className="text-lg text-muted-foreground mb-8 font-sans max-w-2xl">
            Discover step-by-step pathways from school to your dream career
          </p>

          <div className="relative max-w-xl group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              placeholder="Search careers (e.g., IAS, Software Engineer)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg rounded-none border-2 border-border focus-visible:border-foreground focus-visible:ring-0 transition-all bg-background"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1 border-r border-border pr-6 hidden md:block">
            <div className="sticky top-8 space-y-2">
              <h3 className="text-lg font-serif font-bold mb-6 tracking-tight">Available Careers</h3>
              {filteredCareers.map((career) => (
                <Button
                  key={career}
                  variant="ghost"
                  className={`w-full justify-start rounded-none font-sans py-6 border-b border-border last:border-0 ${selectedCareer === career ? 'bg-foreground text-background hover:bg-foreground hover:text-background' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setSelectedCareer(career)}
                >
                  <span className="line-clamp-1 text-left">{career}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="md:col-span-3 md:pl-6">
            {selectedPath ? (
              <div className="space-y-10">
                <div className="border-b border-border pb-8">
                  <h2 className="text-5xl font-serif font-bold tracking-tight text-primary mb-3 leading-none">{selectedCareer}</h2>
                  <p className="text-lg font-sans text-muted-foreground">
                    Complete roadmap from school to professional career
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border hidden md:block" />

                  {selectedPath.map((step, index) => (
                    <div key={index} className="relative mb-12 md:ml-16">
                      <div className="absolute -left-16 top-6 hidden md:block z-10">
                        <div className="w-14 h-14 rounded-none border border-border bg-background flex items-center justify-center">
                          <span className="text-foreground font-serif font-bold text-xl">{index + 1}</span>
                        </div>
                      </div>

                      <Card className="rounded-none border border-border shadow-none bg-background hover:border-foreground transition-colors group">
                        <CardHeader className="pb-6 border-b border-border/50">
                          <div className="flex items-center justify-between mb-6">
                            <Badge variant="outline" className="rounded-none font-sans font-medium tracking-widest uppercase text-xs border-border bg-muted text-foreground">
                              {step.phase}
                            </Badge>
                            <span className="text-sm font-sans tracking-wide font-medium text-muted-foreground">{step.duration}</span>
                          </div>
                          <CardTitle className="text-3xl font-serif font-bold group-hover:text-primary transition-colors">{step.title}</CardTitle>
                          <CardDescription className="text-base font-sans mt-3 text-foreground/80 leading-relaxed">{step.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <h4 className="font-sans font-bold text-sm tracking-widest uppercase mb-4 text-muted-foreground">Key Requirements</h4>
                          <ul className="space-y-3">
                            {step.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm font-sans font-medium text-foreground flex items-start gap-4">
                                <span className="w-2 h-2 rounded-none bg-primary mt-1.5 shrink-0" />
                                <span>{req}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-border mt-10">
                  <GraduationCap className="h-16 w-16 text-muted-foreground/30 mb-6" />
                  <p className="text-xl font-serif font-bold text-muted-foreground mb-2">
                    Select a career
                  </p>
                  <p className="text-sm font-sans text-muted-foreground">View its complete roadmap</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pathways;
