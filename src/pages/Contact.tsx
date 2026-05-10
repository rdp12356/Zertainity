import { Mail, ArrowLeft, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Contact() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background pb-16">
            <header className="border-b border-border/40 bg-card/80 sticky top-0 z-50 backdrop-blur-xl">
                <div className="container mx-auto px-6 py-4 flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex items-center gap-2">
                        <Mail className="h-6 w-6 text-primary" />
                        <h1 className="text-lg font-semibold text-foreground">Contact Us</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 max-w-5xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-foreground">Get in Touch</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Have questions about the site or running into a technical issue? Reach out and we’ll help.
                    </p>
                </div>

                <div className="max-w-md mx-auto">
                    <Card className="shadow-lg border-2 border-primary/20 bg-card hover:border-primary/50 transition-colors group">
                        <CardContent className="p-8 text-center flex flex-col items-center h-full">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                                <Send className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                            <p className="text-sm text-muted-foreground mb-6 flex-grow">
                                Send us an email and our support team will get back to you.
                            </p>
                            <a 
                                href="mailto:support@zertainity.in" 
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 w-full"
                            >
                                <Mail className="mr-2 h-4 w-4" />
                                Email Us
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
