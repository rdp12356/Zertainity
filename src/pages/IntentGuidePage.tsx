import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { SEO } from "@/components/SEO";
import { getIntentGuide } from "@/data/intentGuides";
import NotFound from "./NotFound";

const IntentGuidePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const guide = slug ? getIntentGuide(slug) : undefined;

  if (!guide) {
    return <NotFound />;
  }

  const canonical = `/guides/${guide.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    author: { "@type": "Organization", name: "Zertainity" },
    mainEntityOfPage: `https://www.zertainity.in${canonical}`,
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO title={guide.title} description={guide.metaDescription} canonical={canonical} ogType="article" />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <header className="border-b border-border bg-card shadow-card">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} aria-label="Back to home">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Guide</span>
          </div>
          <div className="flex items-start gap-3">
            <GraduationCap className="h-9 w-9 text-primary shrink-0 mt-1" />
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">{guide.title}</h1>
          </div>
          <p className="mt-4 text-muted-foreground leading-relaxed">{guide.lead}</p>
        </div>
      </header>

      <article className="container mx-auto px-4 py-10 max-w-3xl">
        <nav className="text-sm text-muted-foreground mb-10" aria-label="Breadcrumb">
          <ol className="flex flex-wrap gap-1 items-center">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium">Guides</li>
            <li aria-hidden="true">/</li>
            <li className="text-foreground font-medium truncate max-w-[14rem]">{guide.title}</li>
          </ol>
        </nav>

        {guide.sections.map((section) => (
          <section key={section.heading} className="mb-10">
            <h2 className="text-xl font-bold text-foreground mt-8 first:mt-0">{section.heading}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={`${section.heading}-${i}`} className="text-muted-foreground leading-relaxed mt-3">
                {p}
              </p>
            ))}
          </section>
        ))}

        <div className="mt-12 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-6">
          <p className="font-medium text-foreground mb-3">Turn this into a personal plan</p>
          <p className="text-sm text-muted-foreground mb-4">
            Use the free quiz and pathway tools—then discuss the output with a school counsellor or mentor who knows your
            board’s rules.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="rounded-full">
              <Link to="/quiz">Take the career quiz</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/pathways">Browse pathways</Link>
            </Button>
            <Button asChild variant="secondary" className="rounded-full">
              <Link to="/careers">Explore all careers</Link>
            </Button>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-8">
          <p className="text-sm font-medium text-foreground mb-3">Related guides</p>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/guides/career-after-10th-cbse" className="text-primary hover:underline">
                Career after 10th (CBSE)
              </Link>
            </li>
            <li>
              <Link to="/guides/pcm-vs-pcb" className="text-primary hover:underline">
                PCM vs PCB
              </Link>
            </li>
            <li>
              <Link to="/guides/software-engineer-after-12th-india" className="text-primary hover:underline">
                Software engineer after 12th in India
              </Link>
            </li>
            <li>
              <Link to="/guides/commerce-careers-without-maths" className="text-primary hover:underline">
                Commerce careers without heavy maths
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
};

export default IntentGuidePage;
