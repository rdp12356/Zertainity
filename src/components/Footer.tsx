import { Link } from "react-router-dom";

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

const socialLinks = [
    {
        label: "Twitter / X",
        href: "https://x.com/zertainity",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        href: "https://linkedin.com/company/zertainity",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: "Instagram",
        href: "https://instagram.com/zertainity",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
            </svg>
        ),
    },
    {
        label: "Email",
        href: "mailto:hello@zertainity.in",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
        ),
    },
];

const linkGroups = [
    {
        title: "Platform",
        links: [
            { label: "Assessment", path: "/education-level" },
            { label: "Careers Catalog", path: "/careers" },
            { label: "Methodology", path: "/about" },
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
];

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative transition-colors duration-300 bg-[var(--z-surface-dark)] text-[var(--z-surface-dark-muted)]">
            {/* Gradient top border */}
            <div
                className="absolute inset-x-0 top-0 h-px"
                style={{
                    background:
                        "linear-gradient(90deg, transparent, var(--z-primary) 30%, var(--z-primary) 70%, transparent)",
                    opacity: 0.45,
                }}
                aria-hidden="true"
            />

            <div className="mx-auto max-w-[1080px] px-6 pt-14 pb-10">
                {/* Contact CTA + Social row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-10 mb-10 border-b border-[var(--z-surface-dark-border)]">
                    <div>
                        <p className="text-[15px] font-medium text-[var(--z-surface-dark-text)]">
                            Have questions? Reach out anytime.
                        </p>
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-1.5 mt-2 text-[13px] font-medium text-[var(--z-primary)] hover:underline underline-offset-4 transition-colors duration-200"
                        >
                            Contact us
                            <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                                <path fillRule="evenodd" d="M2 8a.75.75 0 0 1 .75-.75h8.69L8.22 4.03a.75.75 0 0 1 1.06-1.06l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 0 1-1.06-1.06l3.22-3.22H2.75A.75.75 0 0 1 2 8Z" clipRule="evenodd" />
                            </svg>
                        </Link>
                    </div>

                    {/* Social icons */}
                    <div className="flex items-center gap-3">
                        {socialLinks.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                target={s.href.startsWith("mailto:") ? undefined : "_blank"}
                                rel={s.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                                aria-label={s.label}
                                className="flex items-center justify-center w-9 h-9 rounded-lg text-[var(--z-surface-dark-muted)] hover:text-[var(--z-surface-dark-text)] hover:bg-[var(--z-surface-dark-border)] transition-all duration-200"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {linkGroups.map((group) => (
                        <div key={group.title} className="space-y-3">
                            <h5 className="text-[12px] font-semibold tracking-widest uppercase text-[var(--z-surface-dark-muted)]">
                                {group.title}
                            </h5>
                            <div className="flex flex-col gap-2.5">
                                {group.links.map((link) => (
                                    <Link
                                        key={link.path + link.label}
                                        to={link.path}
                                        className="text-[13px] font-light transition-colors duration-200 text-[var(--z-surface-dark-muted)] hover:text-[var(--z-surface-dark-text)]"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footnotes */}
                <div className="text-[12px] font-light leading-[1.7] pb-8 mb-8 text-[var(--z-surface-dark-muted)] border-b border-[var(--z-surface-dark-border)]">
                    <p>Subject counselling guides CBSE, ICSE, and state secondary board models.</p>
                    <p className="mt-1">Exam targets map standard national and regional frameworks.</p>
                </div>

                {/* Copyright bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] font-light text-[var(--z-surface-dark-muted)]">
                    <span>
                        Designed with care by Johan Manoj &amp; Viney Ragesh. © {currentYear}{" "}
                        Zertainity.
                    </span>

                    <div className="flex items-center gap-4">
                        <span>Registered Trademark ®</span>
                        <span className="text-[var(--z-surface-dark-border)]">·</span>
                        <span>Protected by Copyright</span>
                        <span className="text-[var(--z-surface-dark-border)]">·</span>
                        <button
                          type="button"
                          onClick={scrollToTop}
                          className="inline-flex items-center gap-1 text-[var(--z-primary)] hover:text-[var(--z-surface-dark-text)] transition-colors duration-200 cursor-pointer"
                        >
                            Back to top ↑
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
