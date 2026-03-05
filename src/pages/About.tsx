import React from "react";
import { PageSEO } from "@/components/PageSEO";

export default function About() {
    return (
        <div className="container py-12">
            <PageSEO
                title="About Us | Zertainity"
                description="Learn more about Zertainity and our mission to provide AI-powered career guidance."
                canonical="/about"
            />
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity About Us page.</p>
        </div>
    );
}
