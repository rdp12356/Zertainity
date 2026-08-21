import { LegalPage, type LegalSection } from "@/components/LegalPage";

const LAST_UPDATED_ISO = "2026-05-20";
const LAST_UPDATED_LABEL = "20 May 2026";

const SECTIONS: LegalSection[] = [
    {
        id: "acceptance",
        num: "01",
        title: "Acceptance of These Terms",
        bullets: [
            { lead: "Agreement", text: "Creating an account, signing in, or using Zertainity means you accept these Terms and our Privacy Policy. Don't agree? Please don't use the Platform." },
            { lead: "Under 18", text: "You may use Zertainity only with a parent or guardian who accepts these terms on your behalf." },
        ],
    },
    {
        id: "what-we-offer",
        num: "02",
        title: "What Zertainity Offers",
        intro: "A data-driven career-guidance platform built for the Indian education ecosystem:",
        bullets: [
            { lead: "Assessments", text: "Guided modules evaluating academic history, reasoning, verbal aptitude, and personality." },
            { lead: "Recommendations", text: "Proprietary algorithms suggest statistically viable careers, streams, and entrance exams." },
            { lead: "Roadmaps", text: "Per-career routes covering subjects, exams (JEE, NEET, CLAT…), and college benchmarks." },
            { lead: "Catalogs", text: "Searchable, maintained databases of Indian careers and exams." },
            { lead: "Accounts", text: "Save progress, revisit results, track your journey over time." },
        ],
        note: { lead: "Things change", text: "We may add, modify, or remove features at our discretion; material changes get reasonable advance notice by email or in-app alert." },
    },
    {
        id: "eligibility",
        num: "03",
        title: "Eligibility & Account",
        bullets: [
            { lead: "Age", text: "You must be at least 13 to create an account." },
            { lead: "Accuracy", text: "Provide accurate, current, complete information at signup and during assessments." },
            { lead: "Security", text: "Keep your password confidential — you're responsible for all activity under your account." },
            { lead: "Report", text: "Tell us promptly if you suspect unauthorized access." },
        ],
    },
    {
        id: "acceptable-use",
        num: "04",
        title: "Acceptable Use",
        intro: "You agree NOT to:",
        bullets: [
            { lead: "Illegal use", text: "Use the Platform for anything illegal, harmful, or against public morality." },
            { lead: "Scraping", text: "Copy or systematically extract our content, careers data, or algorithms." },
            { lead: "Reverse engineering", text: "Decompile or attempt to derive our source code." },
            { lead: "Malware & infringement", text: "Upload viruses or content infringing anyone's rights." },
            { lead: "Impersonation", text: "Pose as another person or misrepresent affiliations." },
            { lead: "Commercial exploitation", text: "Resell, sublicense, or commercially exploit Zertainity without written consent." },
        ],
    },
    {
        id: "user-content",
        num: "05",
        title: "Your Content",
        bullets: [
            { lead: "Ownership", text: "You keep ownership of everything you submit (marks, interests, free-text)." },
            { lead: "Licence to us", text: "You grant a worldwide, royalty-free licence to host, process, and analyse it to operate the service." },
            { lead: "Privacy", text: "We never publish your personal data without explicit consent." },
        ],
    },
    {
        id: "ip",
        num: "06",
        title: "Intellectual Property",
        bullets: [
            { lead: "Ours", text: "Design, code, branding, catalogs, recommendation logic, copy, and graphics belong to Zertainity and its licensors under Indian and international law." },
            { lead: "Yours", text: "Print or save your personal results for non-commercial use; everything else needs written permission." },
        ],
    },
    {
        id: "not-advice",
        num: "07",
        title: "Guidance, Not Professional Advice",
        note: { lead: "Educational, not prescriptive", text: "Recommendations derive from your inputs plus public exam/college/career data. Big decisions — streams, applications, attempts — belong with parents, teachers, and qualified counsellors. See our Disclaimer." },
    },
    {
        id: "third-party-ads",
        num: "08",
        title: "Third Parties & Advertising",
        intro: "Ads keep Zertainity free. Third-party services are governed by their own terms and privacy policies:",
        bullets: [
            { lead: "Google AdSense", text: "Third-party vendors including Google use cookies to serve ads based on your prior visits to this and other sites." },
            { lead: "Targeted ads", text: "Advertising cookies let Google and its partners personalize ads to your browsing history." },
            { lead: "Opt out", text: "Anytime via Google Ad Settings or aboutads.info." },
            { lead: "External links", text: "We're not responsible for third-party content or practices; clicking ads/links is at your own risk." },
        ],
    },
    {
        id: "warranties",
        num: "09",
        title: "Disclaimer of Warranties",
        note: { lead: "\"As is\"", text: "The Platform is provided as is and as available. To the maximum extent permitted by law we disclaim all implied warranties — merchantability, fitness, accuracy, non-infringement. No particular results are guaranteed." },
    },
    {
        id: "liability",
        num: "10",
        title: "Limitation of Liability",
        note: { lead: "Cap", text: "To the maximum extent allowed by law, Zertainity and its team aren't liable for indirect or consequential damages (data, profits, opportunities, goodwill). Total aggregate liability for any claim: INR 1,000." },
    },
    {
        id: "termination",
        num: "11",
        title: "Termination",
        bullets: [
            { lead: "By you", text: "Stop anytime; delete your account from Settings." },
            { lead: "By us", text: "We may suspend or terminate accounts that violate these Terms or endanger users." },
            { lead: "Afterwards", text: "Granted rights end immediately; IP, disclaimers, liability, and governing-law clauses survive." },
        ],
    },
    {
        id: "changes",
        num: "12",
        title: "Changes to These Terms",
        bullets: [
            { lead: "Versioning", text: "The Effective Date above marks the latest version." },
            { lead: "Acceptance", text: "Continued use after changes means acceptance; material changes get advance notice." },
        ],
    },
    {
        id: "governing-law",
        num: "13",
        title: "Governing Law & Disputes",
        bullets: [
            { lead: "Law", text: "These Terms are governed by the laws of India." },
            { lead: "Jurisdiction", text: "Exclusive jurisdiction: courts at Bengaluru, Karnataka." },
            { lead: "Talk first", text: "Contact us before filing a claim so we can try to resolve things amicably." },
        ],
    },
    {
        id: "contact",
        num: "14",
        title: "Contact",
        bullets: [
            { lead: "Email", text: "legal@zertainity.in" },
            { lead: "Or", text: "Use the Contact page." },
        ],
    },
];

export default function TermsOfService() {
    return (
        <LegalPage
            title="Terms of Service"
            blurb="The rules for using Zertainity — your rights, your responsibilities, and our commitments."
            updatedLabel={LAST_UPDATED_LABEL}
            updatedPrefix="Effective Date"
            path="/terms-of-service"
            schemaType="TermsOfService"
            description="The terms that govern your use of Zertainity — a free career guidance platform for Indian students. Read your rights, responsibilities, and our service commitments."
            keywords="Zertainity terms of service, career platform terms, user agreement India, education platform terms, free career guidance terms"
            publishedTime="2026-05-01"
            modifiedTime={LAST_UPDATED_ISO}
            tldr={[
                "Be 13+, use real info, keep your password safe.",
                "Don't scrape, reverse engineer, or resell the Platform.",
                "Recommendations are educational — not professional advice.",
                "Disputes → talk to us first; Indian law applies (Bengaluru courts).",
            ]}
            sections={SECTIONS}
        />
    );
}
