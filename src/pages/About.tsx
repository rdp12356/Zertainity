import React from "react";
import { Helmet } from "react-helmet-async";

export default function About() {
    return (
        <div className="container py-12">
            <Helmet>
                <title>About Us | Zertainity</title>
                <meta name="description" content="Learn more about Zertainity and our mission to provide AI-powered career guidance." />
            </Helmet>
            <h1 className="text-3xl font-bold mb-4">About Us</h1>
            <p className="text-muted-foreground">Placeholder for Zertainity About Us page.</p>
        </div>
    );
}
