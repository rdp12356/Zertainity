import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: "website" | "article";
  ogImage?: string;
  twitterHandle?: string;
}

export const SEO = ({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage = "https://www.zertainity.in/favicon.png",
  twitterHandle = "@zertainity",
}: SEOProps) => {
  const siteName = "Zertainity";
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = "Zertainity is India's leading AI-powered career guidance platform. Take a free career aptitude test and explore 100+ career paths.";
  const metaDescription = description || defaultDescription;
  const url = canonical ? `https://www.zertainity.in${canonical}` : "https://www.zertainity.in";

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterHandle} />
    </Helmet>
  );
};
