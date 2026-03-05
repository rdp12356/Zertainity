import { Helmet } from "react-helmet-async";

interface PageSEOProps {
    title: string;
    description: string;
    keywords?: string;
    canonical?: string;
    ogType?: "website" | "article";
    ogImage?: string;
}

export const PageSEO = ({
    title,
    description,
    keywords,
    canonical,
    ogType = "website",
    ogImage = "https://www.zertainity.in/logo.svg",
}: PageSEOProps) => {
    const fullTitle = `${title} | Zertainity`;
    const url = canonical ? `https://www.zertainity.in${canonical}` : "https://www.zertainity.in/";

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

            {/* Twitter */}
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    );
};
