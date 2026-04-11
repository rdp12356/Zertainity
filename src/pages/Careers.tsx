import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { GraduationCap, ArrowLeft, Search, Briefcase, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePermission } from "@/hooks/usePermission";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SEO } from "@/components/SEO";
import { AdUnit } from "@/components/AdUnit";
import { getCareerSlugForListName, hasCareerRoleDetail } from "@/data/careerRoleDetails";
import { COMPREHENSIVE_CAREERS } from "@/data/careersCatalog";

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
      <SEO
        title="Explore All Careers"
        description="Browse 100+ careers in India with in-depth guides for selected roles, plus free guides on streams after 10th, PCM vs PCB, software engineering routes, and commerce options."
        canonical="/careers"
      />
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
          <p className="text-muted-foreground mb-4">
            Discover {COMPREHENSIVE_CAREERS.length}+ career options available and find the perfect path for your future
          </p>
          <div className="max-w-2xl mx-auto text-left rounded-lg border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground mb-6">
            <p className="font-medium text-foreground mb-2">Popular guides</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                <Link to="/guides/career-after-10th-cbse" className="text-primary hover:underline">
                  Career after 10th (CBSE)
                </Link>
              </li>
              <li>
                <Link to="/guides/pcm-vs-pcb" className="text-primary hover:underline">
                  PCM vs PCB
                </Link>
              </li>
              <li>
                <Link to="/guides/software-engineer-after-12th-india" className="text-primary hover:underline">
                  Software engineer after 12th
                </Link>
              </li>
              <li>
                <Link to="/guides/commerce-careers-without-maths" className="text-primary hover:underline">
                  Commerce without heavy maths
                </Link>
              </li>
            </ul>
          </div>
          
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
          {filteredCareers.map((career, index) => {
            const detailSlug = getCareerSlugForListName(career.name);
            const hasGuide = hasCareerRoleDetail(career.name);
            return (
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
                  <div className="flex flex-col gap-2 mt-3">
                    {hasGuide && detailSlug && (
                      <Button asChild variant="secondary" size="sm" className="w-full">
                        <Link to={`/careers/${detailSlug}`}>Read in-depth guide</Link>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate("/pathways", { state: { career: career.name } })}
                    >
                      Explore career path
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
          })}
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
