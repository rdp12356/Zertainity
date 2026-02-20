import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title = "Zertainity - AI-Powered Career Guidance for Students",
    description = "Zertainity helps students discover their perfect career path through AI-powered interest assessment and academic analysis.",
    keywords = "career guidance, AI career coach, student career path, college recommendations",
    image = "/og-image.png",
    url = "https://zertainity.in",
}) => {
    const siteTitle = title.includes("Zertainity") ? title : `${title} | Zertainity`;

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </Helmet>
    );
};
