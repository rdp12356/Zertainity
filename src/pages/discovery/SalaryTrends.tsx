import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, IndianRupee, Briefcase, GraduationCap } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SALARY_DATA = [
    {
        category: "Software Engineering",
        roles: [
            { name: "Frontend Developer", entry: 4.5, mid: 12.0, senior: 25.0 },
            { name: "Backend Developer", entry: 5.0, mid: 14.0, senior: 28.0 },
            { name: "Data Scientist", entry: 7.0, mid: 18.0, senior: 35.0 },
            { name: "DevOps Engineer", entry: 6.0, mid: 15.0, senior: 30.0 },
        ]
    },
    {
        category: "Medical & Healthcare",
        roles: [
            { name: "General Physician", entry: 8.0, mid: 15.0, senior: 25.0 },
            { name: "Specialist Surgeon", entry: 12.0, mid: 30.0, senior: 70.0 },
            { name: "Dentist", entry: 4.0, mid: 10.0, senior: 20.0 },
            { name: "Pharmacist", entry: 3.5, mid: 7.0, senior: 12.0 },
        ]
    },
    {
        category: "Finance & Accounts",
        roles: [
            { name: "Chartered Accountant (CA)", entry: 8.0, mid: 18.0, senior: 40.0 },
            { name: "Investment Banker", entry: 12.0, mid: 25.0, senior: 60.0 },
            { name: "Financial Analyst", entry: 5.0, mid: 10.0, senior: 22.0 },
            { name: "Bank Branch Manager", entry: 6.0, mid: 12.0, senior: 20.0 },
        ]
    },
    {
        category: "Law & Administration",
        roles: [
            { name: "Corporate Lawyer", entry: 7.0, mid: 18.0, senior: 45.0 },
            { name: "Litigation Lawyer", entry: 3.0, mid: 12.0, senior: 30.0 },
            { name: "Civil Servant (IAS)", entry: 6.7, mid: 15.0, senior: 30.0 },
        ]
    }
];

const SalaryTrends = () => {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(SALARY_DATA[0].category);

    const currentData = SALARY_DATA.find(d => d.category === selectedCategory)?.roles || [];

    // Custom Tooltip for Recharts
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                    <p className="font-bold mb-2 text-sm">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-muted-foreground">{entry.name}:</span>
                            <span className="font-semibold text-foreground">₹{entry.value} LPA</span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <PageSEO
                title="Career Salaries & Growth Trends in India 2026"
                description="Explore average annual packages (LPA) for software engineers, doctors, CAs, and more. Compare entry-level vs senior salary trajectories in India."
                keywords="salary trends India 2026, software engineer salary India, doctor salary India, CA salary India, career growth projections"
                canonical="/salary-trends"
            />
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Salary Trends & Estimates</h1>
                        <p className="text-xs text-muted-foreground">Career growth projections</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8 space-y-4 text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight">Career Growth Projections</h2>
                    <p className="text-muted-foreground">
                        Explore the typical salary trajectories across major Indian career pathways.
                        Figures represent average annual packages in Lakhs Per Annum (LPA).
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="md:col-span-1 space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 px-2">Sectors</h3>
                        {SALARY_DATA.map(category => (
                            <Button
                                key={category.category}
                                variant={selectedCategory === category.category ? "default" : "ghost"}
                                className="w-full justify-start text-left shrink-0"
                                onClick={() => setSelectedCategory(category.category)}
                            >
                                {category.category}
                            </Button>
                        ))}

                        <div className="mt-8 p-4 bg-muted/50 rounded-lg hidden md:block">
                            <h4 className="flex items-center gap-2 font-semibold text-sm mb-2">
                                <AlertCircle className="h-4 w-4 text-primary" /> Disclaimer
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Salary estimates are approximations based on market research. Actual figures var wildly based on college tier, location, company, and individual skill level.
                            </p>
                        </div>
                    </div>

                    {/* Chart Area */}
                    <div className="md:col-span-3 space-y-6">
                        <Card className="border-border">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{selectedCategory} Overview</span>
                                    <Badge variant="outline" className="font-normal border-primary text-primary">₹ Lakhs Per Annum (LPA)</Badge>
                                </CardTitle>
                                <CardDescription>Progression from Entry-Level to Senior roles</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={currentData}
                                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                                            <XAxis
                                                dataKey="name"
                                                tick={{ fill: '#888', fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#eee' }}
                                            />
                                            <YAxis
                                                tick={{ fill: '#888', fontSize: 12 }}
                                                tickLine={false}
                                                axisLine={{ stroke: '#eee' }}
                                                tickFormatter={(value) => `₹${value}L`}
                                            />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                                            <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px" }} />
                                            <Bar dataKey="entry" name="Entry Level (0-2 Yrs)" fill="hsl(190, 80%, 65%)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="mid" name="Mid Level (3-7 Yrs)" fill="hsl(210, 80%, 55%)" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="senior" name="Senior (8+ Yrs)" fill="hsl(230, 80%, 45%)" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {currentData.map(role => (
                                <Card key={role.name} className="shadow-sm border-border bg-card/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="p-2 bg-primary/10 rounded-md">
                                                <Briefcase className="h-4 w-4 text-primary" />
                                            </div>
                                        </div>
                                        <h4 className="font-semibold text-sm leading-tight mb-4">{role.name}</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">Entry</span>
                                                <span className="font-medium">₹{role.entry}L</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">Senior</span>
                                                <span className="font-medium text-primary">₹{role.senior}L</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Assuming AlertCircle needs to be imported if used
import { AlertCircle } from "lucide-react";

export default SalaryTrends;
