


import { Link, useLocation, useNavigate } from "react-router-dom";

import { SEO } from "@/components/SEO";

const SUGGESTED_LINKS = [
  { label: "Take the assessment", path: "/education-level" },
  { label: "Browse careers", path: "/careers" },
  { label: "Explore pathways", path: "/pathways" },
  { label: "Find exams", path: "/exams" },
];

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[color:var(--z-canvas)]">
      <SEO
        title="Page Not Found"
        description="The page you were looking for doesn't exist on Zertainity. Try the assessment, browse careers, or explore exam tracks instead."
        canonical={location.pathname}
        noindex
      />

      <div className="text-center px-6 max-w-[520px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 text-[color:var(--z-primary)]">404</p>
        <h1 className="font-serif text-[60px] sm:text-[72px] font-light tracking-[-2px] leading-[1.05] mb-4 text-[color:var(--z-ink)]">
          We couldn't find that page
        </h1>
        <p className="text-[17px] font-light mb-10 leading-[1.6] text-[color:var(--z-ink-muted)]">
          The link may be broken, or the page may have moved. Here are a few popular places to continue.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <button
            onClick={() => navigate("/")}
            className="z-hero-cta-primary text-[15px] font-normal px-5 py-2.5 rounded-full transition-all duration-200 active:scale-[0.96]"
          >
            Back to home
          </button>
          <button
            onClick={() => navigate(-1)}
            className="z-hero-cta-secondary text-[15px] font-normal px-5 py-2.5 rounded-full transition-all duration-200"
          >
            Go back
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 max-w-[420px] mx-auto">
          {SUGGESTED_LINKS.map((l) => (
            <Link
              key={l.path}
              to={l.path}
              className="z-feature-card text-[14px] font-normal px-4 py-3 rounded-xl text-[color:var(--z-ink)] hover:text-[color:var(--z-primary)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
