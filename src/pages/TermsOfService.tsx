import React from "react";
import { PageSEO } from "@/components/PageSEO";

export default function TermsOfService() {
    return (
        <div className="container py-12">
            <PageSEO
                title="Terms of Service | Zertainity"
                description="Read the Terms of Service governing your use of the Zertainity platform."
                canonical="/terms-of-service"
            />
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity Terms of Service.</p>
        </div>
    );
}
