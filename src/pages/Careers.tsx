



import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { GraduationCap, ArrowLeft, Search, Briefcase, Lock } from "lucide-react";

import CurvedCard from "@/components/CurvedCard";
import { useSetCurves } from "@/components/CurvesContext";
import DecorativeCurves from "@/components/DecorativeCurves";
import { SEO } from "@/components/SEO";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { COMPREHENSIVE_CAREERS } from "@/data/careersCatalog";
import { usePermission } from "@/hooks/usePermission";

const Careers = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { hasPermission, isLoading, userRole } = usePermission('edit_careers');

  const setCurves = useSetCurves();
  useEffect(() => {
    setCurves([
      { d: "M -170 520 C 40 460, 220 420, 420 460 S 700 540, 980 480", strokeOpacity: 0.18, strokeWidth: 4 },
      { d: "M -170 520 C 40 460, 220 420, 420 460 S 700 540, 980 480", strokeOpacity: 0.44, strokeWidth: 1.3 },
    ]);
    return () => setCurves([]);
  }, [setCurves]);

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
    <div className="min-h-screen bg-background relative">
      <DecorativeCurves />
      <SEO
        title="Browse 150+ Careers in India"
        description="Explore 150+ verified career paths for Indian students — engineering, medicine, law, design, government, finance, tech, and more. Each role includes education paths, exam tracks, and demand insights."
        canonical="/careers"
        keywords="careers in India, career list India, engineering careers, medical careers, government jobs, design careers, tech careers India, career options after 12th, career options after graduation"
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Careers", path: "/careers" },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Careers in India",
          url: "https://www.zertainity.in/careers",
          description:
            "Comprehensive catalogue of careers available to Indian students, including required education, key entrance exams, and demand outlook.",
          inLanguage: "en-IN",
          isPartOf: {
            "@type": "WebSite",
            name: "Zertainity",
            url: "https://www.zertainity.in",
          },
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: COMPREHENSIVE_CAREERS.length,
            itemListElement: COMPREHENSIVE_CAREERS.slice(0, 20).map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.name,
              url: `https://www.zertainity.in/careers`,
            })),
          },
        }}
      />
      <header className="border-b border-border/60 bg-background/95 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-7 w-7 text-primary" />
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
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
        
        <CurvedCard
          className="mb-8 rounded-3xl border border-border/60 bg-card p-6 sm:p-8 shadow-card"
          curves={[
            { d: "M -140 220 C -10 180, 120 150, 340 190 S 620 260, 900 220", strokeOpacity: 0.12, strokeWidth: 6 },
            { d: "M -140 220 C -10 180, 120 150, 340 190 S 620 260, 900 220", strokeOpacity: 0.42, strokeWidth: 1.2 },
          ]}
        >
          <p className="text-sm font-medium uppercase tracking-wider text-primary mb-3">Career catalogue</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">All career paths in India</h2>
          <p className="text-muted-foreground mb-5 max-w-2xl">
            Discover {COMPREHENSIVE_CAREERS.length}+ career options available and find the perfect path for your future
          </p>
          <div className="max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search careers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
        </CurvedCard>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCareers.map((career, index) => {
            return (
            <Card key={index} className="shadow-card border-border/60 transition-colors hover:border-primary/40">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="rounded-xl border border-primary/20 bg-primary/10 p-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <Badge variant={career.demand === "Very High" ? "default" : "secondary"} className="rounded-full">
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full rounded-full"
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
