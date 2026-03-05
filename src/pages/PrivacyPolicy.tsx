import React from "react";
import { PageSEO } from "@/components/PageSEO";

export default function PrivacyPolicy() {
    return (
        <div className="container py-12">
            <PageSEO
                title="Privacy Policy | Zertainity"
                description="Read the Zertainity Privacy Policy to understand how we handle your data and safeguard your privacy."
                canonical="/privacy-policy"
            />
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity Privacy Policy.</p>
        </div>
    );
}
