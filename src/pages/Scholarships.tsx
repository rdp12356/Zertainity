import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, Navigation, IndianRupee, Globe, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Scholarship {
    id: string;
    title: string;
    description: string;
    amount: string;
    deadline: string;
    eligibility: string[];
    category: "Merit-Based" | "Means-Based" | "Government" | "Private";
    link: string;
}

// Static mock database for demonstration
const SCHOLARSHIPS: Scholarship[] = [
    {
        id: "ntse",
        title: "National Talent Search Examination (NTSE)",
        description: "A national-level scholarship program to identify and nurture talented students.",
        amount: "₹1250 - ₹2000 per month",
        deadline: "Nov 2026",
        eligibility: ["Class 10 students", "Must clear Stage 1 (State) and Stage 2 (National)"],
        category: "Government",
        link: "https://ncert.nic.in/national-talent-examination.php"
    },
    {
        id: "kvpy",
        title: "Kishore Vaigyanik Protsahan Yojana (KVPY)",
        description: "An on-going National Program of Fellowship in Basic Sciences, initiated and funded by the Department of Science and Technology, Government of India.",
        amount: "₹5000 - ₹7000 per month + Contingency",
        deadline: "Passed (Integrated into INSPIRE)",
        eligibility: ["Class 11, 12 science students", "1st year UG in Basic Sciences"],
        category: "Government",
        link: "https://inspire.dst.gov.in/"
    },
    {
        id: "reliance",
        title: "Reliance Foundation Undergraduate Scholarships",
        description: "Aims to support meritorious students from across India with financial assistance to pursue their undergraduate college education.",
        amount: "Up to ₹2,000,000 over duration of degree",
        deadline: "October 2026",
        eligibility: ["Passed 12th with min 60%", "Must be enrolled in 1st year full-time UG in India"],
        category: "Private",
        link: "https://reliancefoundation.org/scholarships"
    },
    {
        id: "hsdc",
        title: "HDFC Educational Crisis Scholarship Support",
        description: "Helps students whose families are facing a sudden crisis and need financial support to continue their education.",
        amount: "Up to ₹10,000 (School) / ₹25,000 (College)",
        deadline: "Variable",
        eligibility: ["Students who have experienced a crisis in past 2 years (death, illness, etc)"],
        category: "Means-Based",
        link: "https://www.hdfcbank.com/"
    },
    {
        id: "cbse_single_girl",
        title: "CBSE Merit Scholarship for Single Girl Child",
        description: "Provides scholarships to meritorious Single Girl Students who have passed the CBSE Class X Examination.",
        amount: "₹500 per month",
        deadline: "October 2026",
        eligibility: ["Single Girl Child", "Passed CBSE Class X with min 60% marks"],
        category: "Merit-Based",
        link: "https://cbse.gov.in/scholarship"
    }
];

const CATEGORIES = ["All", "Merit-Based", "Means-Based", "Government", "Private"];

const Scholarships = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const filteredScholarships = SCHOLARSHIPS.filter(s => {
        const matchesQuery = s.title.toLowerCase().includes(query.toLowerCase()) ||
            s.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;

        return matchesQuery && matchesCategory;
    });

    const getCategoryColor = (cat: string) => {
        switch (cat) {
            case "Government": return "bg-blue-100 text-blue-800";
            case "Private": return "bg-purple-100 text-purple-800";
            case "Merit-Based": return "bg-green-100 text-green-800";
            case "Means-Based": return "bg-orange-100 text-orange-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <PageSEO
                title="Scholarships & Financial Aid for Indian Students 2026"
                description="Browse a curated list of merit-based, means-based, government, and private scholarships in India. Find funding for school and college education."
                keywords="scholarships for Indian students, NTSE scholarship, KVPY alternate, Reliance foundation scholarship, single girl child scholarship, education loan India"
                canonical="/scholarships"
            />
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Scholarships & Financial Aid</h1>
                        <p className="text-xs text-muted-foreground">Find funding for your education</p>
                    </div>
                    <span className="ml-auto text-xs font-semibold text-white bg-primary px-2.5 py-1 rounded-full">{filteredScholarships.length} results</span>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <div className="w-full md:w-64 space-y-6 shrink-0">
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Search</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name..."
                                    className="pl-9 bg-card"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Categories</h3>
                            <div className="space-y-2 flex flex-col">
                                {CATEGORIES.map(category => (
                                    <Label
                                        key={category}
                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${categoryFilter === category ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted"}`}
                                        onClick={() => setCategoryFilter(category)}
                                    >
                                        <div className={`w-3 h-3 rounded-full ${categoryFilter === category ? "bg-primary" : "border border-muted-foreground"}`} />
                                        {category}
                                    </Label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold tracking-tight">Available Opportunities</h2>
                            <span className="text-sm text-muted-foreground">{filteredScholarships.length} results</span>
                        </div>

                        {filteredScholarships.length === 0 ? (
                            <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2">
                                <BookOpen className="h-12 w-12 text-muted-foreground opacity-30 mb-4" />
                                <h3 className="text-lg font-medium">No scholarships found</h3>
                                <p className="text-muted-foreground mt-2 max-w-md">Try adjusting your search criteria or checking back later for new opportunities.</p>
                                <Button variant="outline" className="mt-6" onClick={() => { setQuery(""); setCategoryFilter("All"); }}>
                                    Clear Filters
                                </Button>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {filteredScholarships.map(scholarship => (
                                    <Card key={scholarship.id} className="overflow-hidden hover:border-black/30 transition-colors group">
                                        <CardContent className="p-0">
                                            <div className="p-6">
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <div>
                                                        <div className="flex gap-2 mb-2">
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(scholarship.category)}`}>
                                                                {scholarship.category}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors">{scholarship.title}</h3>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                                    {scholarship.description}
                                                </p>

                                                <div className="grid md:grid-cols-2 gap-y-3 gap-x-6 text-sm mb-6 bg-muted/30 p-4 rounded-lg">
                                                    <div>
                                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                                                            <IndianRupee className="h-3 w-3" /> Grant Amount
                                                        </span>
                                                        <span className="font-medium">{scholarship.amount}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 mb-1">
                                                            <Navigation className="h-3 w-3" /> Application Deadline
                                                        </span>
                                                        <span className="font-medium text-destructive">{scholarship.deadline}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Eligibility Criteria</span>
                                                    <div className="flex flex-wrap gap-2 mb-6">
                                                        {scholarship.eligibility.map((crit, idx) => (
                                                            <Badge key={idx} variant="secondary" className="font-normal border-border bg-card">{crit}</Badge>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end pt-4 border-t border-border">
                                                    <a href={scholarship.link} target="_blank" rel="noreferrer">
                                                        <Button className="gap-2">
                                                            View Official Details <Globe className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Scholarships;
