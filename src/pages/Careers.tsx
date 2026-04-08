import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowLeft, Search, Briefcase, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePermission } from "@/hooks/usePermission";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const COMPREHENSIVE_CAREERS = [
  // Technology & IT Development
  { name: "Software Engineer", category: "Technology", demand: "Very High", education: "B.Tech/B.E. Computer Science" },
  { name: "Data Scientist", category: "Technology", demand: "Very High", education: "B.Tech + Analytics/Statistics" },
  { name: "Data Engineer", category: "Technology", demand: "Very High", education: "B.Tech/MCA + Big Data" },
  { name: "UI/UX Designer", category: "Technology", demand: "High", education: "Design Degree/Portfolio" },
  { name: "Cybersecurity Analyst", category: "Technology", demand: "Very High", education: "B.Tech CS + Security Certifications" },
  { name: "Cloud Architect", category: "Technology", demand: "Very High", education: "B.Tech + AWS/Azure Certifications" },
  { name: "AI/ML Engineer", category: "Technology", demand: "Very High", education: "B.Tech/M.Tech AI/ML" },
  { name: "DevOps Engineer", category: "Technology", demand: "High", education: "B.Tech CS + DevOps Tools" },
  { name: "Mobile App Developer", category: "Technology", demand: "High", education: "B.Tech CS/BCA" },
  { name: "Game Developer", category: "Technology", demand: "Medium", education: "B.Tech CS + Game Design" },
  { name: "Blockchain Developer", category: "Technology", demand: "High", education: "B.Tech CS + Blockchain Auth" },
  { name: "Full Stack Developer", category: "Technology", demand: "Very High", education: "B.Tech/MCA/Bootcamp" },
  { name: "Network Administrator", category: "Technology", demand: "Medium", education: "B.Sc/B.Tech + CCNA" },
  { name: "Site Reliability Eng (SRE)", category: "Technology", demand: "High", education: "B.Tech + Server Tools" },
  { name: "Database Administrator", category: "Technology", demand: "High", education: "B.Tech/BCA/MCA" },
  
  // Traditional & Specialized Engineering
  { name: "Mechanical Engineer", category: "Engineering", demand: "High", education: "B.Tech Mechanical" },
  { name: "Civil Engineer", category: "Engineering", demand: "High", education: "B.Tech Civil" },
  { name: "Electrical Engineer", category: "Engineering", demand: "High", education: "B.Tech Electrical" },
  { name: "Electronics Engineer", category: "Engineering", demand: "High", education: "B.Tech Electronics (ECE)" },
  { name: "Aeronautical Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Aeronautical" },
  { name: "Chemical Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Chemical" },
  { name: "Automobile Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Automobile" },
  { name: "Petroleum Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Petroleum" },
  { name: "Robotics Engineer", category: "Engineering", demand: "High", education: "B.Tech Robotics/Mechatronics" },
  { name: "Marine Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Marine Engineering" },
  { name: "Textile Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Textile Tech" },
  { name: "Mining Engineer", category: "Engineering", demand: "Medium", education: "B.Tech Mining" },
  { name: "Industrial Engineer", category: "Engineering", demand: "High", education: "B.Tech Industrial" },
  { name: "Environmental Engineer", category: "Engineering", demand: "High", education: "B.Tech Environmental Eng" },
  { name: "Sound Engineer", category: "Engineering", demand: "Medium", education: "Diploma/Degree Sound Eng" },
  
  // Medical, Healthcare, & AYUSH
  { name: "Doctor (MBBS)", category: "Medical", demand: "Very High", education: "MBBS + MD/MS" },
  { name: "Dentist", category: "Medical", demand: "High", education: "BDS/MDS" },
  { name: "Ayurvedic Doctor (BAMS)", category: "Medical", demand: "High", education: "BAMS + MD Ayurveda" },
  { name: "Homeopathic Doctor (BHMS)", category: "Medical", demand: "High", education: "BHMS" },
  { name: "Pharmacist", category: "Medical", demand: "Medium", education: "B.Pharm/M.Pharm/D.Pharm" },
  { name: "Nurse", category: "Medical", demand: "High", education: "B.Sc Nursing / GNM" },
  { name: "Physiotherapist", category: "Medical", demand: "Medium", education: "BPT/MPT" },
  { name: "Medical Lab Technician", category: "Medical", demand: "Medium", education: "B.Sc MLT" },
  { name: "Radiologist", category: "Medical", demand: "High", education: "MBBS + MD Radiology" },
  { name: "Veterinarian", category: "Medical", demand: "Medium", education: "BVSc & AH" },
  { name: "Psychologist / Therapist", category: "Healthcare", demand: "High", education: "M.A./M.Sc Psychology + RCI" },
  { name: "Nutritionist / Dietitian", category: "Healthcare", demand: "High", education: "B.Sc/M.Sc Nutrition" },
  { name: "Optometrist", category: "Healthcare", demand: "Medium", education: "B.Optom" },
  { name: "Speech Therapist", category: "Healthcare", demand: "Medium", education: "BASLP" },
  { name: "Healthcare Administrator", category: "Healthcare", demand: "High", education: "MBA Hospital Management" },
  
  // Finance, Banking & Accounting
  { name: "Chartered Accountant (CA)", category: "Finance", demand: "High", education: "CA Course (ICAI)" },
  { name: "Cost Accountant (CMA)", category: "Finance", demand: "High", education: "ICWAI/CMA Course" },
  { name: "Company Secretary (CS)", category: "Finance", demand: "Medium", education: "CS Course (ICSI)" },
  { name: "Investment Banker", category: "Finance", demand: "High", education: "MBA Finance/CA/CFA" },
  { name: "Financial Analyst", category: "Finance", demand: "High", education: "BBA/MBA Finance/CFA" },
  { name: "Actuary", category: "Finance", demand: "Medium", education: "Actuarial Science + IAI Exams" },
  { name: "Stock Broker / Trader", category: "Finance", demand: "Medium", education: "Commerce Degree + NISM" },
  { name: "Mutual Fund Manager", category: "Finance", demand: "High", education: "MBA Finance + NISM" },
  { name: "Bank PO / Clercial Officer", category: "Banking", demand: "Very High", education: "Any Degree + IBPS/SBI PO" },
  { name: "GST Consultant", category: "Finance", demand: "High", education: "B.Com/CA/Law" },
  { name: "Wealth Manager", category: "Finance", demand: "Medium", education: "MBA Finance/CFP" },
  { name: "Credit Risk Analyst", category: "Finance", demand: "High", education: "BBA/MBA Finance/FRM" },
  
  // Business, Management & Startups
  { name: "Business Analyst", category: "Business", demand: "High", education: "BBA/MBA/B.Tech" },
  { name: "Management Consultant", category: "Business", demand: "High", education: "MBA Top Tier" },
  { name: "Product Manager", category: "Business", demand: "Very High", education: "B.Tech + MBA / Certification" },
  { name: "Supply Chain Manager", category: "Business", demand: "High", education: "MBA Operations/Logistics" },
  { name: "HR Manager", category: "Business", demand: "Medium", education: "MBA HR" },
  { name: "Operations Manager", category: "Business", demand: "High", education: "MBA Operations" },
  { name: "E-Commerce Manager", category: "Business", demand: "High", education: "BBA/MBA" },
  { name: "Scrum Master / Agile", category: "Business", demand: "Medium", education: "CSM Certification" },
  { name: "Startup Founder / Entrepreneur", category: "Business", demand: "High", education: "Any Degree + Skill" },
  
  // Government, Defense & Civil Services (India specific)
  { name: "Civil Services (IAS/IPS/IFS)", category: "Government", demand: "Very High", education: "Any Degree + UPSC CSE" },
  { name: "Indian Revenue Service (IRS)", category: "Government", demand: "High", education: "Any Degree + UPSC CSE" },
  { name: "State Civil Services (PCS)", category: "Government", demand: "High", education: "Any Degree + State PSC" },
  { name: "Defense Services (Army/Navy/AF)", category: "Government", demand: "High", education: "12th/Degree + NDA/CDS/AFCAT" },
  { name: "Railway Services (RRB)", category: "Government", demand: "High", education: "B.Tech/Graduation + RRB" },
  { name: "Staff Selection Commission (SSC)", category: "Government", demand: "Very High", education: "12th/Degree + SSC CGL/CHSL" },
  { name: "Police Sub-Inspector / DSP", category: "Government", demand: "High", education: "Degree + State Police Exams" },
  { name: "Income Tax Inspector", category: "Government", demand: "High", education: "Degree + SSC CGL" },
  { name: "Forest Ranger", category: "Government", demand: "Medium", education: "B.Sc Science/Environment + PSC" },
  { name: "Block Development Officer (BDO)", category: "Government", demand: "High", education: "Degree + State PSC" },
  { name: "Paramilitary Forces (CAPF/CRPF)", category: "Government", demand: "High", education: "Degree + UPSC CAPF" },
  { name: "Postal Services Officer", category: "Government", demand: "Medium", education: "Degree + Postal Exams" },
  
  // Law & Legal
  { name: "Litigation Lawyer", category: "Legal", demand: "High", education: "BA LLB/LLB" },
  { name: "Corporate Lawyer", category: "Legal", demand: "High", education: "BA LLB + Corp Law Specialization" },
  { name: "Judge / Magistrate", category: "Legal", demand: "High", education: "LLB + State Judicial Services Exam" },
  { name: "Cyber Law Expert", category: "Legal", demand: "High", education: "LLB + Cyber Law Certification" },
  { name: "Intellectual Property (IP) Lawyer", category: "Legal", demand: "Medium", education: "LLB + IP Law" },
  { name: "Tax Lawyer", category: "Legal", demand: "High", education: "B.Com LLB / CA + LLB" },
  
  // Education, Training & Research
  { name: "School Teacher (PGT/TGT)", category: "Education", demand: "Very High", education: "B.A/B.Sc + B.Ed + TET/CTET" },
  { name: "University Professor / Lecturer", category: "Education", demand: "High", education: "Masters + NET / PhD" },
  { name: "Research Scientist (DRDO/ISRO/CSIR)", category: "Science", demand: "High", education: "M.Sc/M.Tech/PhD" },
  { name: "School Principal / Admin", category: "Education", demand: "Medium", education: "M.Ed + Experience" },
  { name: "Education Counselor", category: "Education", demand: "High", education: "M.A Psychology / Counseling" },
  { name: "Special Educator", category: "Education", demand: "High", education: "B.Ed Special Education" },
  { name: "Curriculum Designer / EdTech Dev", category: "Education", demand: "High", education: "Degree + EdTech Experience" },
  
  // Pure Sciences & R&D
  { name: "Biotechnologist", category: "Science", demand: "Medium", education: "B.Sc/B.Tech Biotech" },
  { name: "Microbiologist", category: "Science", demand: "Medium", education: "M.Sc Microbiology" },
  { name: "Pharmacologist", category: "Science", demand: "High", education: "M.Pharm / PhD" },
  { name: "Forensic Scientist", category: "Science", demand: "Medium", education: "M.Sc Forensic Science" },
  { name: "Geologist", category: "Science", demand: "Medium", education: "B.Sc/M.Sc Geology" },
  { name: "Meteorologist", category: "Science", demand: "Medium", education: "M.Sc Meteorology/Physics" },
  { name: "Food Technologist", category: "Science", demand: "High", education: "B.Tech/M.Sc Food Tech" },
  
  // Media, Journalism & Content
  { name: "Journalist / Reporter", category: "Media", demand: "Medium", education: "BJMC / Mass Communication" },
  { name: "Digital Content Writer / Copywriter", category: "Media", demand: "High", education: "Any Degree + Portfolio" },
  { name: "Film/Video Editor", category: "Media", demand: "High", education: "Editing Course / BFA" },
  { name: "Public Relations (PR) Manager", category: "Media", demand: "Medium", education: "MBA / Mass Comm" },
  { name: "News Anchor", category: "Media", demand: "Medium", education: "Journalism / Broadcasting" },
  { name: "Social Media Influencer/Creator", category: "Media", demand: "Medium", education: "None. Requires Niche/Audience" },
  { name: "Screenwriter", category: "Media", demand: "Medium", education: "Creative Writing / Media Degree" },
  
  // Design, Arts & Creative
  { name: "Architect", category: "Design", demand: "High", education: "B.Arch + COA Registration" },
  { name: "Interior Designer", category: "Design", demand: "High", education: "B.Des Interior Design" },
  { name: "Fashion Designer", category: "Design", demand: "High", education: "B.Des Fashion (NIFT)" },
  { name: "Graphic Designer", category: "Design", demand: "High", education: "B.Des / Portfolio" },
  { name: "3D Animator / VFX Artist", category: "Design", demand: "High", education: "Animation Degree/Arena/MAAC" },
  { name: "Industrial/Product Designer", category: "Design", demand: "Medium", education: "B.Des/M.Des (NID/IIT)" },
  { name: "Photographer / Videographer", category: "Design", demand: "Medium", education: "Fine Arts / Portfolio" },
  
  // Digital Marketing & Sales
  { name: "Digital Marketing Manager", category: "Marketing", demand: "Very High", education: "BBA/MBA + Digital Certs" },
  { name: "SEO Specialist / Growth Hacker", category: "Marketing", demand: "High", education: "Any Degree + SEO Experience" },
  { name: "Brand Manager", category: "Marketing", demand: "High", education: "MBA Marketing" },
  { name: "B2B Sales Manager", category: "Marketing", demand: "Very High", education: "BBA/MBA/B.Tech" },
  
  // Hospitality, Travel & Tourism
  { name: "Hotel Manager", category: "Hospitality", demand: "High", education: "BHM (Hotel Management)" },
  { name: "Chef / Culinary Artist", category: "Hospitality", demand: "High", education: "Diploma Culinary Arts / BHM" },
  { name: "Event Manager", category: "Hospitality", demand: "Medium", education: "Event Management Course" },
  { name: "Travel Consultant / Guide", category: "Tourism", demand: "Medium", education: "Travel & Tourism Degree" },
  { name: "Cabin Crew / Air Hostess", category: "Hospitality", demand: "Medium", education: "12th + Cabin Crew Training" },
  
  // Aviation & Merchant Navy
  { name: "Commercial Pilot", category: "Aviation", demand: "High", education: "12th PCM + CPL License" },
  { name: "Air Traffic Controller (ATC)", category: "Aviation", demand: "Medium", education: "B.Tech + AAI Training" },
  { name: "Aircraft Maintenance Engineer (AME)", category: "Aviation", demand: "Medium", education: "AME License (DGCA)" },
  { name: "Merchant Navy Officer (Deck/Engine)", category: "Maritime", demand: "High", education: "B.Sc Nautical Science / Marine Eng (IMU)" },
  
  // Agriculture, Farming & Rural Dev
  { name: "Agricultural Officer", category: "Agriculture", demand: "High", education: "B.Sc Agriculture + IBPS AFO" },
  { name: "Agronomist", category: "Agriculture", demand: "Medium", education: "M.Sc Agronomy" },
  { name: "Dairy Technologist", category: "Agriculture", demand: "Medium", education: "B.Tech Dairy Tech" },
  { name: "Sericulturist / Fishery Scientist", category: "Agriculture", demand: "Low", education: "B.Sc Sericulture / Fisheries" },
  
  // Sports, Fitness & Wellness
  { name: "Sports Coach / PE Teacher", category: "Sports", demand: "High", education: "B.P.Ed / NIS Diploma" },
  { name: "Fitness Trainer / Yoga Instructor", category: "Sports", demand: "High", education: "Fitness Cert/Yoga Certification (QCI)" },
  { name: "Sports Manager", category: "Sports", demand: "Medium", education: "MBA Sports Management" },
  { name: "Sports Physiotherapist", category: "Sports", demand: "Medium", education: "BPT + Sports Science" },
  
  // Social Work & NGO
  { name: "Social Worker / NGO Admin", category: "Social Sciences", demand: "Medium", education: "BSW / MSW" },
  { name: "Policy Analyst", category: "Social Sciences", demand: "Medium", education: "Public Policy Degree" },
  { name: "CSR Manager", category: "Business", demand: "Medium", education: "MBA/MSW" },
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
        {!hasPermission && userRole && (
          <Alert className="mb-6">
            <Lock className="h-4 w-4" />
            <AlertDescription>
              You have view-only access. Contact an admin for editing permissions.
            </AlertDescription>
          </Alert>
        )}
        
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
                    Explore Career Path
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
