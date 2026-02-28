import React from "react";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
    return (
        <div className="container py-12">
            <Helmet>
                <title>Privacy Policy | Zertainity</title>
                <meta name="description" content="Read the Zertainity Privacy Policy to understand how we handle your data and safeguard your privacy." />
            </Helmet>
            <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity Privacy Policy.</p>
        </div>
    );
}
