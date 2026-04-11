import { Link } from "react-router-dom";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full border-t border-border/40 bg-background py-8 text-muted-foreground">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                    <div className="md:col-span-2">
                        <h3 className="text-foreground font-semibold text-lg mb-2">Zertainity</h3>
                        <p className="text-sm max-w-sm mb-4">
                            AI-powered career guidance and educational pathway planning for students.
                            Find your dream career with confidence.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-foreground font-medium mb-3">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-foreground font-medium mb-3">Guides</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/guides/career-after-10th-cbse" className="hover:text-primary transition-colors">After 10th (CBSE)</Link>
                            </li>
                            <li>
                                <Link to="/guides/pcm-vs-pcb" className="hover:text-primary transition-colors">PCM vs PCB</Link>
                            </li>
                            <li>
                                <Link to="/guides/software-engineer-after-12th-india" className="hover:text-primary transition-colors">Software engineer after 12th</Link>
                            </li>
                            <li>
                                <Link to="/guides/commerce-careers-without-maths" className="hover:text-primary transition-colors">Commerce without heavy maths</Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-foreground font-medium mb-3">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/about" className="hover:text-primary transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>© {currentYear} Zertainity. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <span className="opacity-75">Registered Trademark ®</span>
                        <span className="opacity-75">Protected by Copyright</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
