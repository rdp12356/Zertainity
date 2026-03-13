import { useState, useEffect } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowLeft, Search, Briefcase, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePermission } from "@/hooks/usePermission";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { hasPermission, isLoading, userRole } = usePermission('edit_careers');

  const filteredCareers = COMPREHENSIVE_CAREERS.filter(career =>
    career.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    career.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        title="Explore 140+ Career Paths in India"
        description="Comprehensive guide to careers in India. Discover demand, required education, and detailed pathways for technology, medical, business, design, and more."
        keywords="career options India, software engineer career path, how to become a doctor in India, IAS IPS career, high demand jobs India 2026"
        canonical="/careers"
      />
      <header className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="hover:bg-muted rounded-none">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-foreground" />
              <h1 className="text-4xl font-serif font-bold tracking-tight text-foreground">
                Explore Careers
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        {!hasPermission && userRole && (
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You have view-only access. Contact an admin for editing permissions.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-bold mb-4 tracking-tight">All Career Paths in India</h2>
          <p className="text-lg text-muted-foreground mb-8 font-sans max-w-2xl mx-auto">
            Discover {COMPREHENSIVE_CAREERS.length}+ career options available and find the perfect path for your future
          </p>

          <div className="max-w-xl mx-auto relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-foreground transition-colors" />
            <Input
              placeholder="Search careers by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 text-lg rounded-none border-2 border-border focus-visible:border-foreground focus-visible:ring-0 transition-all bg-background"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, index) => (
            <Card key={index} className="rounded-none border-border border shadow-none hover:border-foreground transition-colors group bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-4">
                  <Briefcase className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <Badge variant={career.demand === "Very High" ? "default" : "secondary"} className="rounded-none font-medium tracking-wide text-xs">
                    {career.demand} Demand
                  </Badge>
                </div>
                <CardTitle className="text-xl font-serif font-bold group-hover:text-primary transition-colors line-clamp-1">{career.name}</CardTitle>
                <CardDescription className="text-sm font-sans tracking-wide uppercase mt-1">{career.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Education Required</p>
                    <p className="text-sm font-medium font-sans line-clamp-1">{career.education}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full rounded-none border-border hover:bg-foreground hover:text-background transition-colors font-sans mt-2"
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
