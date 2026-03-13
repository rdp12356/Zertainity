import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Mail, MessageSquare, MapPin, Send, ExternalLink } from "lucide-react";
import { Logo } from "@/components/Logo";
import { PageSEO } from "@/components/PageSEO";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const Contact = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Message sent! We'll get back to you soon.", {
            description: "Thanks for reaching out to the Zertainity team.",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <PageSEO title="Contact Us - Support & Feedback" description="Get in touch with the Zertainity team for support, feedback, or partnerships." />

            <header className="border-b bg-card/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Logo className="h-8 w-auto cursor-pointer" onClick={() => navigate("/")} />
                    <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="rounded-full">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Home
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        {/* Info Section */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-shimmer">Get in Touch</h1>
                                <p className="text-xl text-muted-foreground font-light leading-relaxed">
                                    Have a question about our career paths? Found a bug? Or just want to say hello? We're all ears.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Email Us</h3>
                                        <p className="text-muted-foreground">For support and general inquiries</p>
                                        <a href="mailto:support@zertainity.com" className="text-primary font-medium hover:underline flex items-center gap-1 mt-1">
                                            support@zertainity.com <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <MessageSquare className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Live Chat</h3>
                                        <p className="text-muted-foreground">Available Mon-Fri, 9am - 6pm IST</p>
                                        <button onClick={() => toast.info("Chat system loading...")} className="text-primary font-medium hover:underline mt-1">
                                            Open Support Messenger
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-6 items-start">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Location</h3>
                                        <p className="text-muted-foreground">Remote-first team based in India</p>
                                        <p className="text-sm font-medium mt-1">Bangalore & Kochi</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="bg-card border rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold tracking-wide ml-1">Your Name</label>
                                        <Input placeholder="Alex Kumar" className="rounded-2xl h-12 border-muted-foreground/20 focus:border-primary transition-all" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold tracking-wide ml-1">Email Address</label>
                                        <Input type="email" placeholder="alex@gmail.com" className="rounded-2xl h-12 border-muted-foreground/20 focus:border-primary transition-all" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold tracking-wide ml-1">Subject</label>
                                    <Input placeholder="How do I get started with the quiz?" className="rounded-2xl h-12 border-muted-foreground/20 focus:border-primary transition-all" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold tracking-wide ml-1">Message</label>
                                    <Textarea placeholder="Tell us more about what's on your mind..." className="rounded-[1.5rem] min-h-[160px] border-muted-foreground/20 focus:border-primary transition-all resize-none" required />
                                </div>

                                <Button type="submit" className="w-full rounded-2xl h-14 font-black shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                    Send Message <Send className="ml-2 h-4 w-4" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t py-12 bg-muted/20 mt-16">
                <div className="container mx-auto px-6 text-center text-muted-foreground">
                    <Logo className="h-6 w-auto opacity-50 mx-auto mb-4" />
                    <p>© 2026 Zertainity. We're here for you.</p>
                </div>
            </footer>
        </div>
    );
};

export default Contact;
