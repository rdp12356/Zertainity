import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, ArrowLeft, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PathwayStep {
  phase: string;
  title: string;
  duration: string;
  description: string;
  requirements: string[];
}

const careerPathways: Record<string, PathwayStep[]> = {
  "IAS Officer": [
    {
      phase: "School",
      title: "Foundation Years (Class 6-10)",
      duration: "5 years",
      description: "Build strong fundamentals in all subjects with focus on humanities and current affairs",
      requirements: ["Strong academic record", "General awareness", "Reading habit development"]
    },
    {
      phase: "School",
      title: "Higher Secondary (Class 11-12)",
      duration: "2 years",
      description: "Choose stream based on interest (preferably Humanities/Commerce for better UPSC preparation)",
      requirements: ["Minimum 60% marks", "Develop analytical thinking", "Start NCERT mastery"]
    },
    {
      phase: "College",
      title: "Graduation",
      duration: "3-4 years",
      description: "Complete any bachelor's degree from a recognized university",
      requirements: ["Any discipline", "Maintain good GPA", "Start UPSC preparation in final year"]
    },
    {
      phase: "Preparation",
      title: "UPSC CSE Preparation",
      duration: "1-2 years",
      description: "Intensive preparation for Civil Services Examination",
      requirements: ["Complete syllabus coverage", "Answer writing practice", "Current affairs", "Optional subject mastery"]
    },
    {
      phase: "Career",
      title: "IAS Training & Service",
      duration: "Lifetime",
      description: "Foundation course at LBSNAA Mussoorie followed by district and state postings",
      requirements: ["Clear UPSC CSE", "Complete training", "Continuous learning"]
    }
  ],
  "Software Engineer": [
    {
      phase: "School",
      title: "Foundation Years",
      duration: "5 years",
      description: "Focus on Mathematics and logical reasoning",
      requirements: ["Strong math skills", "Problem-solving ability", "Basic computer literacy"]
    },
    {
      phase: "School",
      title: "Higher Secondary (Science)",
      duration: "2 years",
      description: "Take PCM (Physics, Chemistry, Mathematics) stream",
      requirements: ["Minimum 75% marks", "Programming basics", "Competitive exam preparation"]
    },
    {
      phase: "College",
      title: "B.Tech/B.E. in Computer Science",
      duration: "4 years",
      description: "Complete engineering degree with focus on software development",
      requirements: ["Clear JEE/State entrance", "Learn programming languages", "Build projects", "Internships"]
    },
    {
      phase: "Career",
      title: "Junior Software Engineer",
      duration: "2-3 years",
      description: "Start career at tech companies or startups",
      requirements: ["Good coding skills", "Problem-solving", "Team collaboration", "Continuous learning"]
    },
    {
      phase: "Career",
      title: "Senior Roles & Specialization",
      duration: "Ongoing",
      description: "Progress to senior engineer, architect, or specialized roles",
      requirements: ["Deep technical expertise", "Leadership skills", "Industry certifications"]
    }
  ]
};

const Pathways = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);

  const availableCareers = Object.keys(careerPathways);
  const filteredCareers = availableCareers.filter(career =>
    career.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPath = selectedCareer ? careerPathways[selectedCareer] : null;

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
