import React from "react";
import { Helmet } from "react-helmet-async";

export default function Contact() {
    return (
        <div className="container py-12">
            <Helmet>
                <title>Contact Us | Zertainity</title>
                <meta name="description" content="Get in touch with the Zertainity team for support, feature requests, or inquiries." />
            </Helmet>
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity Contact page.</p>
        </div>
    );
}
