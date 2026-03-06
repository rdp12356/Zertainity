import { Helmet } from "react-helmet-async";

interface PageSEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    ogType?: "website" | "article";
    ogImage?: string;
    customSchema?: object;
}

export const PageSEO = ({
    title,
    description,
    keywords,
    canonical,
    ogType = "website",
    ogImage = "https://www.zertainity.in/logo.svg",
    customSchema = {},
}: PageSEOProps) => {
    const fullTitle = `${title} | Zertainity`;
    const url = canonical ? `https://www.zertainity.in${canonical}` : "https://www.zertainity.in/";

    const jsonLdData = {
        "@context": "https://schema.org",
        "@type": ogType === "article" ? "TechArticle" : "WebPage",
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": url
        },
        "headline": fullTitle,
        "description": description,
        "image": ogImage,
        "publisher": {
            "@type": "Organization",
            "name": "Zertainity",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.zertainity.in/logo.svg"
            }
        },
        ...customSchema
    };

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Zertainity" />
            <meta property="article:publisher" content="https://www.zertainity.in/" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
            <meta name="twitter:site" content="@zertainity" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(jsonLdData)}
            </script>
        </Helmet>
    );
};
