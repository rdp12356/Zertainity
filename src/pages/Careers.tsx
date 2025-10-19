import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowLeft, Search, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const MOCK_CAREERS = [
  { name: "Software Engineer", category: "Technology", demand: "Very High", education: "B.Tech/B.E. Computer Science" },
  { name: "Civil Services (IAS/IPS)", category: "Government", demand: "High", education: "Any Bachelor's Degree + UPSC" },
  { name: "Doctor (MBBS)", category: "Medical", demand: "Very High", education: "MBBS + MD/MS" },
  { name: "Chartered Accountant", category: "Finance", demand: "High", education: "CA Course" },
  { name: "Data Scientist", category: "Technology", demand: "Very High", education: "B.Tech + Analytics/Statistics" },
  { name: "Mechanical Engineer", category: "Engineering", demand: "High", education: "B.Tech Mechanical" },
  { name: "Teacher/Professor", category: "Education", demand: "Medium", education: "B.Ed/M.Ed/PhD" },
  { name: "Architect", category: "Design", demand: "Medium", education: "B.Arch" },
  { name: "Lawyer", category: "Legal", demand: "High", education: "LLB/LLM" },
  { name: "Digital Marketing Manager", category: "Marketing", demand: "High", education: "BBA/MBA Marketing" },
  { name: "Investment Banker", category: "Finance", demand: "High", education: "MBA Finance" },
  { name: "Pharmacist", category: "Medical", demand: "Medium", education: "B.Pharm/M.Pharm" },
  { name: "UI/UX Designer", category: "Design", demand: "High", education: "Design Degree/Portfolio" },
  { name: "Biotechnologist", category: "Science", demand: "Medium", education: "B.Tech/M.Tech Biotech" },
  { name: "Journalist", category: "Media", demand: "Medium", education: "Mass Communication/Journalism" },
  { name: "Hotel Manager", category: "Hospitality", demand: "Medium", education: "Hotel Management" },
  { name: "Pilot", category: "Aviation", demand: "High", education: "CPL License" },
  { name: "Fashion Designer", category: "Design", demand: "Medium", education: "Fashion Design Degree" },
  { name: "Psychologist", category: "Healthcare", demand: "Medium", education: "M.A./M.Sc Psychology" },
  { name: "Electrical Engineer", category: "Engineering", demand: "High", education: "B.Tech Electrical" }
];

const Careers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCareers = MOCK_CAREERS.filter(career =>
    career.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    career.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Explore Careers
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Popular Career Paths in India</h2>
          <p className="text-muted-foreground mb-6">
            Discover various career options available and find the perfect path for your future
          </p>
          
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, index) => (
            <Card key={index} className="shadow-card hover:shadow-glow transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <Badge variant={career.demand === "Very High" ? "default" : "secondary"}>
                    {career.demand} Demand
                  </Badge>
                </div>
                <CardTitle className="text-lg">{career.name}</CardTitle>
                <CardDescription>{career.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Education Required:</p>
                    <p className="text-sm font-medium">{career.education}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-3"
                    onClick={() => navigate("/pathways", { state: { career: career.name } })}
                  >
                    View Career Path
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCareers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No careers found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Careers;
