import { Link } from "react-router-dom";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="pt-16 pb-10 transition-colors duration-300 bg-[var(--z-canvas)] border-t border-[var(--z-border)]"
        >
            <div className="mx-auto max-w-[1080px] px-6">
                {/* Footnotes */}
                <div
                    className="text-[13px] font-light leading-[1.6] pb-8 mb-8 text-[var(--z-ink-muted)] border-b border-[var(--z-border)]"
                >
                    <p>Subject counselling guides CBSE, ICSE, and state secondary board models.</p>
                    <p className="mt-1">Exam targets map standard national and regional frameworks.</p>
                </div>

                {/* Link grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {[
                        {
                            title: "Platform",
                            links: [
                                { label: "Assessment", path: "/education-level" },
                                { label: "Careers Catalog", path: "/careers" },
                                { label: "Methodology", path: "/about" },
                                { label: "CareerVerse (Play)", path: "/careerverse" },
                            ],
                        },
                        {
                            title: "Resources",
                            links: [
                                { label: "Browse Subjects", path: "/careers" },
                                { label: "Support & FAQs", path: "/contact" },
                            ],
                        },
                        {
                            title: "Legal",
                            links: [
                                { label: "Privacy Policy", path: "/privacy-policy" },
                                { label: "Terms of Service", path: "/terms-of-service" },
                                { label: "Disclaimer", path: "/disclaimer" },
                            ],
                        },
                        {
                            title: "Company",
                            links: [
                                { label: "About Us", path: "/about" },
                                { label: "Contact", path: "/contact" },
                                { label: "Sign In", path: "/auth" },
                            ],
                        },
                    ].map((group) => (
                        <div key={group.title} className="space-y-3">
                            <h5
                                className="text-[12px] font-medium tracking-wide text-[var(--z-ink)]"
                            >
                                {group.title}
                            </h5>
                            <div className="flex flex-col gap-2">
                                {group.links.map((link) => (
                                    <Link
                                        key={link.path + link.label}
                                        to={link.path}
                                        className="text-[12px] font-light transition-colors duration-200 text-[var(--z-ink-muted)] hover:text-[var(--z-ink)]"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Copyright */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] font-light text-[var(--z-ink-muted)]">
                    <span>Designed with care by Johan Manoj & Viney Ragesh. © {currentYear} Zertainity.</span>
                    <div className="flex items-center gap-4">
                        <span>Registered Trademark ®</span>
                        <span className="text-[var(--z-border)]">·</span>
                        <span>Protected by Copyright</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
