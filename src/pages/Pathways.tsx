import { useState } from "react";
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
      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
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
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">Explore Your Career Journey</h2>
          <p className="text-muted-foreground mb-6">
            Discover step-by-step pathways from school to your dream career
          </p>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search careers (e.g., IAS, Software Engineer)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="shadow-card sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Available Careers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {filteredCareers.map((career) => (
                  <Button
                    key={career}
                    variant={selectedCareer === career ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCareer(career)}
                  >
                    {career}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            {selectedPath ? (
              <div className="space-y-6">
                <Card className="shadow-card border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-2xl">{selectedCareer}</CardTitle>
                    <CardDescription>
                      Complete roadmap from school to professional career
                    </CardDescription>
                  </CardHeader>
                </Card>

                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-primary hidden md:block" />
                  
                  {selectedPath.map((step, index) => (
                    <div key={index} className="relative mb-8 md:ml-16">
                      <div className="absolute -left-16 top-6 hidden md:block">
                        <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
                          <span className="text-primary-foreground font-bold">{index + 1}</span>
                        </div>
                      </div>
                      
                      <Card className="shadow-card hover:shadow-glow transition-smooth">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-gradient-secondary">{step.phase}</Badge>
                            <span className="text-sm text-muted-foreground">{step.duration}</span>
                          </div>
                          <CardTitle>{step.title}</CardTitle>
                          <CardDescription>{step.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <h4 className="font-semibold mb-2 text-sm">Key Requirements:</h4>
                          <ul className="space-y-1">
                            {step.requirements.map((req, idx) => (
                              <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {req}
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
              <Card className="shadow-card h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Select a career to view its pathway
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pathways;
