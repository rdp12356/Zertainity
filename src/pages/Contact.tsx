import React from "react";
import { PageSEO } from "@/components/PageSEO";

export default function Contact() {
    return (
        <div className="container py-12">
            <PageSEO
                title="Contact Us | Zertainity"
                description="Get in touch with the Zertainity team for support, feature requests, or inquiries."
                canonical="/contact"
            />
            <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity Contact page.</p>
        </div>
    );
}
