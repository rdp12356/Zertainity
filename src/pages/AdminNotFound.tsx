import { Link } from "react-router-dom";
import { ArrowLeft, LayoutDashboard, Shield, Users, Briefcase, LockKeyhole } from "lucide-react";
import { SEO } from "@/components/SEO";

const sections = [
  { to: "/", label: "Studio dashboard", Icon: LayoutDashboard },
  { to: "/users", label: "Team and accounts", Icon: Users },
  { to: "/careers", label: "Career catalog", Icon: Briefcase },
];

export default function AdminNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-14 text-foreground">
      <SEO title="Studio page not found" canonical="/admin" noindex />
      <div className="w-full max-w-xl rounded-3xl border border-border/70 bg-card p-7 text-center shadow-xl shadow-black/5 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Shield className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Zertainity Studio · 404</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">This workspace page does not exist</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          The address may have changed. Go to the dashboard or choose an existing Studio section.
        </p>
        <nav className="mt-8 grid gap-3 sm:grid-cols-3" aria-label="Available Studio pages">
          {sections.map(({ to, label, Icon }) => (
            <Link key={to} to={to}
              className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background px-3 py-4 text-xs font-semibold transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs">
          <Link className="inline-flex items-center gap-1 font-semibold text-primary hover:underline" to="/auth">
            <LockKeyhole className="h-4 w-4" /> Sign in
          </Link>
          <a className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground" href="https://www.zertainity.in/">
            <ArrowLeft className="h-4 w-4" /> Public website
          </a>
        </div>
      </div>
    </main>
  );
}
