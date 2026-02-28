import React from "react";
import { Helmet } from "react-helmet-async";

export default function TermsOfService() {
    return (
        <div className="container py-12">
            <Helmet>
                <title>Terms of Service | Zertainity</title>
                <meta name="description" content="Read the Terms of Service governing your use of the Zertainity platform." />
            </Helmet>
            <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity Terms of Service.</p>
        </div>
    );
}
