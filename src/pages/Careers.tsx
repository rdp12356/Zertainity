import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowLeft, Search, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COMPREHENSIVE_CAREERS = [
  // Technology & IT
  { name: "Software Engineer", category: "Technology", demand: "Very High", education: "B.Tech/B.E. Computer Science" },
  { name: "Data Scientist", category: "Technology", demand: "Very High", education: "B.Tech + Analytics/Statistics" },
  { name: "UI/UX Designer", category: "Technology", demand: "High", education: "Design Degree/Portfolio" },
  { name: "Cybersecurity Analyst", category: "Technology", demand: "Very High", education: "B.Tech CS + Security Certifications" },
  { name: "Cloud Architect", category: "Technology", demand: "Very High", education: "B.Tech + Cloud Certifications" },
  { name: "AI/ML Engineer", category: "Technology", demand: "Very High", education: "B.Tech/M.Tech AI/ML" },
  { name: "DevOps Engineer", category: "Technology", demand: "High", education: "B.Tech CS + DevOps Tools" },
  { name: "Mobile App Developer", category: "Technology", demand: "High", education: "B.Tech CS/BCA" },
  { name: "Game Developer", category: "Technology", demand: "Medium", education: "B.Tech CS + Game Design" },
  { name: "Blockchain Developer", category: "Technology", demand: "High", education: "B.Tech CS + Blockchain" },
  
  // Engineering
  { name: "Mechanical Engineer", category: "Engineering", demand: "High", education: "B.Tech Mechanical" },
  { name: "Civil Engineer", category: "Engineering", demand: "High", education: "B.Tech Civil" },
  { name: "Electrical Engineer", category: "Engineering", demand: "High", education: "B.Tech Electrical" },
  { name: "Electronics Engineer", category: "Engineering", demand: "High", education: "B.Tech Electronics" },
  { name: "Aeronautical Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Aeronautical" },
  { name: "Chemical Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Chemical" },
  { name: "Automobile Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Automobile" },
  { name: "Petroleum Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Petroleum" },
  { name: "Robotics Engineer", category: "Engineering", demand: "High", education: "B.Tech Robotics/Mechatronics" },
  
  // Medical & Healthcare
  { name: "Doctor (MBBS)", category: "Medical", demand: "Very High", education: "MBBS + MD/MS" },
  { name: "Dentist", category: "Medical", demand: "High", education: "BDS/MDS" },
  { name: "Pharmacist", category: "Medical", demand: "Medium", education: "B.Pharm/M.Pharm" },
  { name: "Nurse", category: "Medical", demand: "High", education: "B.Sc Nursing" },
  { name: "Physiotherapist", category: "Medical", demand: "Medium", education: "BPT/MPT" },
  { name: "Medical Lab Technician", category: "Medical", demand: "Medium", education: "B.Sc MLT" },
  { name: "Radiologist", category: "Medical", demand: "High", education: "MBBS + MD Radiology" },
  { name: "Veterinarian", category: "Medical", demand: "Medium", education: "BVSc & AH" },
  { name: "Psychologist", category: "Healthcare", demand: "Medium", education: "M.A./M.Sc Psychology" },
  { name: "Nutritionist", category: "Healthcare", demand: "Medium", education: "B.Sc Nutrition" },
  
  // Finance & Business
  { name: "Chartered Accountant", category: "Finance", demand: "High", education: "CA Course" },
  { name: "Investment Banker", category: "Finance", demand: "High", education: "MBA Finance" },
  { name: "Financial Analyst", category: "Finance", demand: "High", education: "BBA/MBA Finance" },
  { name: "Company Secretary", category: "Finance", demand: "Medium", education: "CS Course" },
  { name: "Actuary", category: "Finance", demand: "Medium", education: "Actuarial Science + Exams" },
  { name: "Stock Broker", category: "Finance", demand: "Medium", education: "Commerce Degree + NISM" },
  { name: "Business Analyst", category: "Business", demand: "High", education: "BBA/MBA" },
  { name: "Management Consultant", category: "Business", demand: "High", education: "MBA" },
  { name: "Entrepreneur", category: "Business", demand: "High", education: "Any Degree + Business Skills" },
  { name: "HR Manager", category: "Business", demand: "Medium", education: "MBA HR" },
  
  // Government & Civil Services
  { name: "Civil Services (IAS/IPS)", category: "Government", demand: "High", education: "Any Bachelor's + UPSC" },
  { name: "Defense Services", category: "Government", demand: "High", education: "Graduation + NDA/CDS" },
  { name: "Banking Officer", category: "Government", demand: "High", education: "Graduation + IBPS" },
  { name: "Railway Services", category: "Government", demand: "High", education: "Graduation + RRB Exams" },
  { name: "SSC Services", category: "Government", demand: "High", education: "12th/Graduation + SSC" },
  { name: "Police Services", category: "Government", demand: "High", education: "Graduation + State Exams" },
  
  // Law & Legal
  { name: "Lawyer", category: "Legal", demand: "High", education: "LLB/LLM" },
  { name: "Corporate Lawyer", category: "Legal", demand: "High", education: "LLB + Corporate Law" },
  { name: "Judge", category: "Legal", demand: "Medium", education: "LLB + Judicial Services" },
  { name: "Legal Advisor", category: "Legal", demand: "Medium", education: "LLB/LLM" },
  
  // Education & Research
  { name: "Teacher/Professor", category: "Education", demand: "Medium", education: "B.Ed/M.Ed/PhD" },
  { name: "Research Scientist", category: "Science", demand: "Medium", education: "M.Sc/PhD" },
  { name: "School Principal", category: "Education", demand: "Medium", education: "M.Ed + Experience" },
  { name: "Education Counselor", category: "Education", demand: "Medium", education: "M.Ed Psychology" },
  
  // Science & Research
  { name: "Biotechnologist", category: "Science", demand: "Medium", education: "B.Tech/M.Tech Biotech" },
  { name: "Microbiologist", category: "Science", demand: "Medium", education: "M.Sc Microbiology" },
  { name: "Chemist", category: "Science", demand: "Medium", education: "M.Sc Chemistry" },
  { name: "Physicist", category: "Science", demand: "Medium", education: "M.Sc/PhD Physics" },
  { name: "Environmental Scientist", category: "Science", demand: "Medium", education: "M.Sc Environmental Science" },
  { name: "Space Scientist", category: "Science", demand: "Medium", education: "M.Tech Aerospace + ISRO" },
  
  // Media & Communication
  { name: "Journalist", category: "Media", demand: "Medium", education: "Mass Communication/Journalism" },
  { name: "Content Writer", category: "Media", demand: "High", education: "Any Degree + Writing Skills" },
  { name: "Video Editor", category: "Media", demand: "Medium", education: "Editing Course/Portfolio" },
  { name: "Public Relations Officer", category: "Media", demand: "Medium", education: "Mass Communication" },
  { name: "News Anchor", category: "Media", demand: "Medium", education: "Journalism/Mass Comm" },
  { name: "RJ (Radio Jockey)", category: "Media", demand: "Low", education: "Mass Communication" },
  
  // Design & Creative
  { name: "Architect", category: "Design", demand: "Medium", education: "B.Arch" },
  { name: "Interior Designer", category: "Design", demand: "Medium", education: "Interior Design Degree" },
  { name: "Fashion Designer", category: "Design", demand: "Medium", education: "Fashion Design Degree" },
  { name: "Graphic Designer", category: "Design", demand: "High", education: "Design Degree/Portfolio" },
  { name: "Product Designer", category: "Design", demand: "High", education: "Design Degree" },
  { name: "Animator", category: "Design", demand: "Medium", education: "Animation Course" },
  { name: "Photographer", category: "Design", demand: "Medium", education: "Photography Course/Portfolio" },
  
  // Marketing & Sales
  { name: "Digital Marketing Manager", category: "Marketing", demand: "High", education: "BBA/MBA Marketing" },
  { name: "Brand Manager", category: "Marketing", demand: "High", education: "MBA Marketing" },
  { name: "Sales Manager", category: "Marketing", demand: "High", education: "BBA/MBA" },
  { name: "SEO Specialist", category: "Marketing", demand: "High", education: "Any Degree + SEO Skills" },
  { name: "Social Media Manager", category: "Marketing", demand: "High", education: "Marketing/Communications" },
  
  // Hospitality & Tourism
  { name: "Hotel Manager", category: "Hospitality", demand: "Medium", education: "Hotel Management" },
  { name: "Chef", category: "Hospitality", demand: "Medium", education: "Culinary Arts" },
  { name: "Event Manager", category: "Hospitality", demand: "Medium", education: "Event Management" },
  { name: "Travel Consultant", category: "Tourism", demand: "Medium", education: "Travel & Tourism" },
  { name: "Tourism Officer", category: "Tourism", demand: "Low", education: "Tourism Management" },
  
  // Aviation
  { name: "Pilot", category: "Aviation", demand: "High", education: "CPL License" },
  { name: "Air Traffic Controller", category: "Aviation", demand: "Medium", education: "B.Tech + ATC Training" },
  { name: "Aircraft Maintenance Engineer", category: "Aviation", demand: "Medium", education: "AME License" },
  { name: "Cabin Crew", category: "Aviation", demand: "Medium", education: "12th + Cabin Crew Training" },
  
  // Arts & Entertainment
  { name: "Actor", category: "Entertainment", demand: "Low", education: "Acting Course/Portfolio" },
  { name: "Singer", category: "Entertainment", demand: "Low", education: "Music Training" },
  { name: "Musician", category: "Entertainment", demand: "Low", education: "Music Degree" },
  { name: "Dancer", category: "Entertainment", demand: "Low", education: "Dance Training" },
  { name: "Film Director", category: "Entertainment", demand: "Low", education: "Film Making Course" },
  
  // Agriculture & Environment
  { name: "Agricultural Scientist", category: "Agriculture", demand: "Medium", education: "B.Sc/M.Sc Agriculture" },
  { name: "Horticulturist", category: "Agriculture", demand: "Medium", education: "B.Sc Horticulture" },
  { name: "Forest Officer", category: "Environment", demand: "Medium", education: "B.Sc Forestry + IFS" },
  { name: "Wildlife Biologist", category: "Environment", demand: "Low", education: "M.Sc Wildlife Biology" },
  
  // Sports & Fitness
  { name: "Sports Coach", category: "Sports", demand: "Medium", education: "B.P.Ed/M.P.Ed" },
  { name: "Professional Athlete", category: "Sports", demand: "Low", education: "Sports Training" },
  { name: "Fitness Trainer", category: "Sports", demand: "Medium", education: "Fitness Certification" },
  { name: "Sports Manager", category: "Sports", demand: "Medium", education: "Sports Management" },
];

const Careers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCareers = COMPREHENSIVE_CAREERS.filter(career =>
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
          <h2 className="text-3xl font-bold mb-4">All Career Paths in India</h2>
          <p className="text-muted-foreground mb-6">
            Discover {COMPREHENSIVE_CAREERS.length}+ career options available and find the perfect path for your future
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
