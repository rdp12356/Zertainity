import React from "react";
import { PageSEO } from "@/components/PageSEO";

export default function Disclaimer() {
    return (
        <div className="container py-12">
            <PageSEO
                title="Disclaimer | Zertainity"
                description="View the legal disclaimer regarding AI-generated career recommendations on Zertainity."
                canonical="/disclaimer"
            />
            <h1 className="text-3xl font-bold mb-4">Disclaimer</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity Disclaimer.</p>
        </div>
    );
}
