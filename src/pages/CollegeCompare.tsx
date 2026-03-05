import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Scale, Check, X, Building2, TrendingUp, Trophy, IndianRupee, MapPin } from "lucide-react";

interface College {
    id: string;
    name: string;
    location: string;
    type: "Government" | "Private" | "IIIT" | "NIT" | "IIT";
    nirfRank: number;
    avgPackage: string;
    highestPackage: string;
    fees: string;
    campusSize: string;
    topRecruiters: string[];
}

const COLLEGES_DB: College[] = [
    {
        id: "c1",
        name: "IIT Bombay",
        location: "Mumbai, Maharashtra",
        type: "IIT",
        nirfRank: 3,
        avgPackage: "₹21.8 LPA",
        highestPackage: "₹3.67 CPA (Intl)",
        fees: "₹8-10 Lakhs",
        campusSize: "550 Acres",
        topRecruiters: ["Google", "Microsoft", "Optiver"]
    },
    {
        id: "c2",
        name: "IIT Delhi",
        location: "New Delhi, Delhi",
        type: "IIT",
        nirfRank: 2,
        avgPackage: "₹20.5 LPA",
        highestPackage: "₹2.50 CPA",
        fees: "₹8-10 Lakhs",
        campusSize: "320 Acres",
        topRecruiters: ["Microsoft", "Bain & Co", "Quantbox"]
    },
    {
        id: "c3",
        name: "NIT Trichy",
        location: "Tiruchirappalli, Tamil Nadu",
        type: "NIT",
        nirfRank: 9,
        avgPackage: "₹12.5 LPA",
        highestPackage: "₹52.0 LPA",
        fees: "₹5-7 Lakhs",
        campusSize: "800 Acres",
        topRecruiters: ["Amazon", "Oracle", "Goldman Sachs"]
    },
    {
        id: "c4",
        name: "BITS Pilani",
        location: "Pilani, Rajasthan",
        type: "Private",
        nirfRank: 25,
        avgPackage: "₹30.3 LPA",
        highestPackage: "₹60.7 LPA",
        fees: "₹20-25 Lakhs",
        campusSize: "328 Acres",
        topRecruiters: ["Apple", "Google", "Nvidia"]
    },
    {
        id: "c5",
        name: "VIT Vellore",
        location: "Vellore, Tamil Nadu",
        type: "Private",
        nirfRank: 11,
        avgPackage: "₹9.2 LPA",
        highestPackage: "₹1.02 CPA",
        fees: "₹12-18 Lakhs",
        campusSize: "372 Acres",
        topRecruiters: ["TCS", "Cognizant", "Motorola"]
    }
];

const CollegeCompare = () => {
    const navigate = useNavigate();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        if (id && selectedIds.length < 3 && !selectedIds.includes(id)) {
            setSelectedIds([...selectedIds, id]);
        }
        e.target.value = ""; // reset dropdown
    };

    const removeCollege = (id: string) => {
        setSelectedIds(selectedIds.filter(cid => cid !== id));
    };

    const selectedColleges = selectedIds.map(id => COLLEGES_DB.find(c => c.id === id)!).filter(Boolean);

    return (
        <div className="min-h-screen bg-background pb-20">
            <PageSEO
                title="Compare Colleges & Universities in India"
                description="Side-by-side comparison of top Indian colleges. Compare fees, placements, NIRF rankings, and campus facilities for IITs, NITs, and more."
                keywords="compare colleges India, IIT vs NIT, BITS Pilani vs VIT, college comparison tool, NIRF ranking comparison"
                canonical="/college-compare"
            />
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                            <Scale className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">College Comparison Array</h1>
                            <p className="text-xs text-muted-foreground">Compare fees & placements</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="mb-8 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tight">Compare Colleges</h2>
                    <p className="text-muted-foreground max-w-2xl">
                        Select up to 3 colleges to see a side-by-side comparison of their placements, fees, and national rankings.
                    </p>

                    <div className="flex items-center gap-4 max-w-md pt-4">
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            onChange={handleSelect}
                            defaultValue=""
                            disabled={selectedIds.length >= 3}
                        >
                            <option value="" disabled>Search & Add a College...</option>
                            {COLLEGES_DB.map(college => (
                                <option
                                    key={college.id}
                                    value={college.id}
                                    disabled={selectedIds.includes(college.id)}
                                >
                                    {college.name} ({college.location})
                                </option>
                            ))}
                        </select>
                        <Badge variant="outline" className="px-3 shrink-0 py-1.5 whitespace-nowrap">
                            {selectedIds.length} / 3 Selected
                        </Badge>
                    </div>
                </div>

                {selectedColleges.length === 0 ? (
                    <div className="text-center py-20 bg-muted/30 rounded-xl border border-dashed border-border mt-8">
                        <Scale className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                        <h3 className="text-lg font-semibold text-foreground">No Colleges Selected</h3>
                        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">
                            Use the dropdown above to add colleges to the comparison matrix. You can compare up to three at once.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-8">
                        <table className="w-full border-collapse mt-4 min-w-[800px]">
                            <thead>
                                <tr>
                                    <th className="p-4 border-b border-border bg-muted/20 text-left w-48 sticky left-0 z-10 font-semibold text-muted-foreground">
                                        Features
                                    </th>
                                    {selectedColleges.map(college => (
                                        <th key={college.id} className="p-4 border-b border-border bg-card w-72 align-top text-left">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold">{college.name}</h3>
                                                    <Badge variant="secondary" className="mt-2 mb-1">{college.type}</Badge>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={() => removeCollege(college.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                    <X className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </th>
                                    ))}
                                    {/* Empty slots for visual consistency if < 3 */}
                                    {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => (
                                        <th key={`empty-${i}`} className="p-4 border-b border-border bg-muted/10 w-72"></th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {/* Location */}
                                <tr>
                                    <td className="p-4 font-medium border-b border-border bg-muted/20 sticky left-0 z-10 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary" /> Location
                                    </td>
                                    {selectedColleges.map(college => (
                                        <td key={college.id} className="p-4 border-b border-border bg-card/50">
                                            {college.location}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => <td key={`empty-${i}`} className="border-b border-border bg-muted/10"></td>)}
                                </tr>

                                {/* NIRF Ranking */}
                                <tr>
                                    <td className="p-4 font-medium border-b border-border bg-muted/20 sticky left-0 z-10 flex items-center gap-2">
                                        <Trophy className="h-4 w-4 text-primary" /> NIRF Ranking
                                    </td>
                                    {selectedColleges.map(college => (
                                        <td key={college.id} className="p-4 border-b border-border bg-card/50">
                                            <span className="text-2xl font-bold text-primary">#{college.nirfRank}</span>
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => <td key={`empty-${i}`} className="border-b border-border bg-muted/10"></td>)}
                                </tr>

                                {/* Average Package */}
                                <tr>
                                    <td className="p-4 font-medium border-b border-border bg-muted/20 sticky left-0 z-10 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-500" /> Average Package
                                    </td>
                                    {selectedColleges.map(college => (
                                        <td key={college.id} className="p-4 border-b border-border bg-card/50 font-semibold text-green-600">
                                            {college.avgPackage}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => <td key={`empty-${i}`} className="border-b border-border bg-muted/10"></td>)}
                                </tr>

                                {/* Highest Package */}
                                <tr>
                                    <td className="p-4 font-medium border-b border-border bg-muted/20 sticky left-0 z-10 flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-green-600" /> Highest Package
                                    </td>
                                    {selectedColleges.map(college => (
                                        <td key={college.id} className="p-4 border-b border-border bg-card/50">
                                            {college.highestPackage}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => <td key={`empty-${i}`} className="border-b border-border bg-muted/10"></td>)}
                                </tr>

                                {/* Fees */}
                                <tr>
                                    <td className="p-4 font-medium border-b border-border bg-muted/20 sticky left-0 z-10 flex items-center gap-2">
                                        <IndianRupee className="h-4 w-4 text-amber-500" /> Estimated Fees
                                    </td>
                                    {selectedColleges.map(college => (
                                        <td key={college.id} className="p-4 border-b border-border bg-card/50">
                                            {college.fees}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => <td key={`empty-${i}`} className="border-b border-border bg-muted/10"></td>)}
                                </tr>

                                {/* Campus Size */}
                                <tr>
                                    <td className="p-4 font-medium border-b border-border bg-muted/20 sticky left-0 z-10 flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-blue-500" /> Campus Size
                                    </td>
                                    {selectedColleges.map(college => (
                                        <td key={college.id} className="p-4 border-b border-border bg-card/50">
                                            {college.campusSize}
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => <td key={`empty-${i}`} className="border-b border-border bg-muted/10"></td>)}
                                </tr>

                                {/* Top Recruiters */}
                                <tr>
                                    <td className="p-4 font-medium border-b border-border bg-muted/20 sticky left-0 z-10 align-top pt-6">
                                        Top Recruiters
                                    </td>
                                    {selectedColleges.map(college => (
                                        <td key={college.id} className="p-4 border-b border-border bg-card/50 align-top">
                                            <div className="flex flex-wrap gap-2">
                                                {college.topRecruiters.map(r => (
                                                    <Badge key={r} variant="outline" className="bg-background">{r}</Badge>
                                                ))}
                                            </div>
                                        </td>
                                    ))}
                                    {Array.from({ length: 3 - selectedColleges.length }).map((_, i) => <td key={`empty-${i}`} className="border-b border-border bg-muted/10"></td>)}
                                </tr>

                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CollegeCompare;
