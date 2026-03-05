import { useState } from "react";
import { PageSEO } from "@/components/PageSEO";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Lock, Star, Download, FileText, Check, CreditCard } from "lucide-react";
import { toast } from "sonner";

// Phase 4: Premium features — gating UI for paid roadmap PDF
// Free: top career match + basic explanation
// Premium (₹49–₹99): detailed roadmap PDF, all 3 matches, college list, exam plan

const FREE_FEATURES = [
    "Top career match result",
    "Basic AI explanation",
    "Match score breakdown",
    "Entrance exam list",
];

const PREMIUM_FEATURES = [
    "All 3 career matches with comparison",
    "Detailed roadmap PDF (10 pages)",
    "Personalised college shortlist",
    "Month-by-month exam preparation plan",
    "5-year career growth projection",
    "Save & re-take analysis anytime",
    "Priority email support",
];

const PLANS = [
    {
        name: "Basic",
        price: "Free",
        priceNote: "Always free",
        features: FREE_FEATURES,
        cta: "Continue Free",
        highlight: false,
        variant: "outline" as const,
    },
    {
        name: "Career Pro",
        price: "₹49",
        priceNote: "One-time · No subscription",
        features: PREMIUM_FEATURES,
        cta: "Get Career Pro →",
        highlight: true,
        variant: "default" as const,
    },
    {
        name: "Career Max",
        price: "₹99",
        priceNote: "Lifetime access",
        features: [
            ...PREMIUM_FEATURES,
            "Unlimited re-takes",
            "WhatsApp mentor session (30 min)",
            "Physical roadmap booklet (shipped)",
        ],
        cta: "Get Career Max →",
        highlight: false,
        variant: "outline" as const,
    },
];

const Premium = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSelect = (planName: string) => {
        if (isProcessing) return;

        setSelected(planName);
        if (planName !== "Basic") {
            // Mock checkout flow
            setIsProcessing(true);

            const promise = new Promise((resolve) => {
                setTimeout(resolve, 3000); // Simulate network latency and Razorpay popup
            });

            toast.promise(promise, {
                loading: `Redirecting to Razorpay gateway for ${planName}...`,
                success: () => {
                    setIsProcessing(false);
                    return `Dummy Payment Successful! Welcome to ${planName}.`;
                },
                error: () => {
                    setIsProcessing(false);
                    return 'Payment failed.';
                },
            });

        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <PageSEO
                title="Upgrade to Career Pro | Zertainity"
                description="Get your full personalised career roadmap, college shortlist, and detailed exam preparation plan. Level up your future for as low as ₹49."
                keywords="premium career guidance, career roadmap PDF, personalised college list India, entrance exam prep plan"
                canonical="/premium"
            />
            <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="hover:rotate-[-5deg] transition-transform">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="p-1.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                        <Zap className="h-5 w-5 text-primary fill-primary/20" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">Upgrade Plan</h1>
                        <p className="text-xs text-muted-foreground">Unlock your full roadmap</p>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-12 max-w-5xl">
                <div className="text-center mb-10">
                    <Badge className="mb-4 bg-black text-white">Phase 4 · Monetization</Badge>
                    <h2 className="text-4xl font-bold mb-3">Get your full Career Roadmap</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Your basic result is ready. Upgrade to unlock a detailed PDF roadmap, college shortlist, and a personalised month-by-month exam prep plan.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-10">
                    {PLANS.map(plan => (
                        <Card
                            key={plan.name}
                            className={`relative transition-all cursor-pointer ${plan.highlight
                                ? "border-2 border-black shadow-xl ring-2 ring-black/10"
                                : "border-border"
                                } ${selected === plan.name ? "ring-2 ring-primary" : ""}`}
                            onClick={() => setSelected(plan.name)}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-black text-white text-xs px-3 py-1 rounded-full flex items-center gap-1">
                                        <Star className="h-3 w-3 fill-white" /> Most Popular
                                    </span>
                                </div>
                            )}
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg">{plan.name}</CardTitle>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold">{plan.price}</span>
                                </div>
                                <CardDescription>{plan.priceNote}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 mb-6">
                                    {plan.features.map(f => (
                                        <li key={f} className="flex items-start gap-2 text-sm">
                                            <Check className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={plan.highlight ? "default" : "outline"}
                                    disabled={isProcessing}
                                    className={`w-full ${plan.highlight ? "bg-black hover:bg-black/90 text-white" : ""}`}
                                    onClick={(e) => { e.stopPropagation(); handleSelect(plan.name); }}
                                >
                                    {isProcessing && selected === plan.name ? (
                                        <span className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            Processing...
                                        </span>
                                    ) : (
                                        plan.cta
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* PDF Preview banner */}
                <Card className="bg-gradient-to-r from-gray-900 to-gray-700 text-white border-0">
                    <CardContent className="py-6 flex items-center gap-6">
                        <div className="flex-shrink-0">
                            <FileText className="h-16 w-16 text-gray-300" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Download className="h-4 w-4 text-gray-300" />
                                <span className="text-xs uppercase tracking-widest text-gray-400">Included in Career Pro & Max</span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">Personalised Career Roadmap PDF</h3>
                            <p className="text-sm text-gray-300">
                                A 10-page personalised document with your top 3 matches, college shortlist, monthly exam prep calendar, and 5-year earning projections. Ready to download instantly after purchase.
                            </p>
                        </div>
                        <div className="ml-auto flex-shrink-0">
                            <Lock className="h-8 w-8 text-gray-500" />
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    Secured payment via Razorpay · India-first pricing · Instant access · No subscription
                </p>
            </main >
        </div >
    );
};

export default Premium;
