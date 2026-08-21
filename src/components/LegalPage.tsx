import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";

export type LegalBullet = { lead: string; text: string };

export type LegalSection = {
    id: string;
    num: string;
    title: string;
    intro?: string;
    bullets?: LegalBullet[];
    note?: { lead: string; text: string };
    outro?: ReactNode;
};

type LegalPageProps = {
    title: string;
    /** Small uppercase label above the title, e.g. "Legal". */
    kicker?: string;
    blurb: string;
    updatedLabel: string;
    updatedPrefix?: string;
    path: string;
    schemaType: string;
    description: string;
    keywords: string;
    publishedTime: string;
    modifiedTime: string;
    tldr?: string[];
    sections: LegalSection[];
    /** Renders bullet text values that are emails / internal links correctly. */
    linkTextAsEmail?: boolean;
};

/**
 * Shared layout for legal documents: sticky header, TL;DR summary, jump-nav
 * chips, and numbered section cards with bold lead-in bullets. Content is
 * passed as structured data so every legal page stays visually consistent.
 */
export function LegalPage({
    title,
    kicker = "Legal",
    blurb,
    updatedLabel,
    updatedPrefix = "Last Updated",
    path,
    schemaType,
    description,
    keywords,
    publishedTime,
    modifiedTime,
    tldr,
    sections,
}: LegalPageProps) {
    const navigate = useNavigate();
    const [active, setActive] = useState(sections[0]?.id ?? "");

    const jump = (id: string) => {
        setActive(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": schemaType,
        name: `Zertainity ${title}`,
        url: `https://www.zertainity.in${path}`,
        inLanguage: "en-IN",
        datePublished: publishedTime,
        dateModified: modifiedTime,
        publisher: {
            "@type": "Organization",
            name: "Zertainity",
            url: "https://www.zertainity.in",
            logo: "https://www.zertainity.in/favicon.png",
        },
    };

    const EMAIL_RE = /^[\w.+-]+@[\w-]+\.[\w.-]+$/;

    const renderBulletText = (text: string) => {
        if (EMAIL_RE.test(text)) {
            return <a className="text-primary underline underline-offset-2" href={`mailto:${text}`}>{text}</a>;
        }
        if (/^\/[^\s]*$/.test(text)) {
            return <a className="text-primary underline underline-offset-2" href={text}>{text.replace(/^\//, "").replace(/-/g, " ") || "page"}</a>;
        }
        return <span className="font-light">{text}</span>;
    };

    return (
        <div className="min-h-screen pb-16 bg-[color:var(--z-canvas)]">
            <SEO
                title={title}
                description={description}
                canonical={path}
                keywords={keywords}
                publishedTime={publishedTime}
                modifiedTime={modifiedTime}
                breadcrumbs={[
                    { name: "Home", path: "/" },
                    { name: title, path },
                ]}
                jsonLd={jsonLd}
            />

            <header className="sticky top-0 z-50 backdrop-blur-xl transition-colors duration-300 bg-[color:var(--z-nav-bg)] border-b border-[color:var(--z-border)]">
                <div className="mx-auto max-w-[1080px] px-6 py-4 flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-full border border-[color:var(--z-border)]" aria-label="Go back">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="var(--z-ink-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <h1 className="text-[15px] font-normal text-[color:var(--z-ink)]">{title}</h1>
                </div>
            </header>

            <main className="mx-auto max-w-[760px] px-6 pt-12">
                {/* Title block */}
                <div className="text-center mb-8">
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 text-[color:var(--z-primary)]">{kicker}</p>
                    <h2 className="font-serif text-[36px] sm:text-[44px] font-light tracking-[-1px] leading-[1.1] mb-3 text-[color:var(--z-ink)]">
                        {title}
                    </h2>
                    <p className="text-[15px] font-light leading-[1.6] text-[color:var(--z-ink-muted)]">{blurb}</p>
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] mt-4 text-[color:var(--z-ink-muted)]">
                        {updatedPrefix}: {updatedLabel}
                    </p>
                </div>

                {/* TL;DR */}
                {tldr && tldr.length > 0 && (
                    <div className="rounded-xl p-5 md:p-6 mb-8 bg-primary/5 border border-primary/20">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] mb-3 text-primary">The short version</p>
                        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                            {tldr.map((t) => (
                                <li key={t} className="flex items-start gap-2 text-[13.5px] font-light leading-[1.5] text-[color:var(--z-ink)]">
                                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Jump nav */}
                <nav aria-label="Sections" className="flex flex-wrap gap-2 mb-10">
                    {sections.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => jump(s.id)}
                            className={`rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition-colors ${
                                active === s.id
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-[color:var(--z-border)] text-[color:var(--z-ink-secondary)] hover:border-primary/40 hover:text-primary"
                            }`}
                        >
                            {s.num} · {s.title}
                        </button>
                    ))}
                </nav>

                {/* Sections */}
                <div className="space-y-5">
                    {sections.map((s) => (
                        <Card key={s.id} id={s.id} className="scroll-mt-24 rounded-xl border-[color:var(--z-border)] bg-[color:var(--z-canvas-soft)]">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-baseline gap-3 mb-4">
                                    <span className="font-mono text-[12px] font-semibold text-primary">{s.num}</span>
                                    <h3 className="text-[19px] font-semibold tracking-tight text-[color:var(--z-ink)]">{s.title}</h3>
                                </div>

                                {s.intro && (
                                    <p className="text-[13.5px] font-light leading-[1.6] text-[color:var(--z-ink-muted)] mb-4">{s.intro}</p>
                                )}

                                {s.bullets && s.bullets.length > 0 && (
                                    <ul className="space-y-2.5">
                                        {s.bullets.map((b) => (
                                            <li key={b.lead} className="flex items-start gap-3 text-[13.5px] leading-[1.6] text-[color:var(--z-ink-secondary)]">
                                                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary/50" aria-hidden />
                                                <span>
                                                    <strong className="font-medium text-[color:var(--z-ink)]">{b.lead}.</strong>{" "}
                                                    {renderBulletText(b.text)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {s.note && (
                                    <div className="mt-4 rounded-lg border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-[13px] leading-[1.6] text-[color:var(--z-ink-secondary)]">
                                        <strong className="font-medium text-amber-700 dark:text-amber-400">{s.note.lead}:</strong>{" "}
                                        <span className="font-light">{s.note.text}</span>
                                    </div>
                                )}

                                {s.outro && (
                                    <p className="mt-4 text-[13.5px] font-light leading-[1.6] text-[color:var(--z-ink-secondary)]">{s.outro}</p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
