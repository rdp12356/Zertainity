import { LegalPage, type LegalSection } from "@/components/LegalPage";

const LAST_UPDATED_ISO = "2026-05-20";
const LAST_UPDATED_LABEL = "20 May 2026";

const SECTIONS: LegalSection[] = [
    {
        id: "introduction",
        num: "01",
        title: "Introduction & Scope",
        bullets: [
            { lead: "Who we are", text: "Zertainity — a data-driven career-guidance platform for students in India." },
            { lead: "What this covers", text: "www.zertainity.in plus any associated apps, APIs, or services (the “Platform”)." },
            { lead: "What you're trusting us with", text: "Academic performance, ability assessments, and aspirations — this policy explains, in plain language, exactly how that data is handled under Indian law (including the DPDP Act)." },
        ],
    },
    {
        id: "data-we-collect",
        num: "02",
        title: "Data We Collect",
        intro: "We follow strict data minimization — only what the Platform needs to function.",
        bullets: [
            { lead: "Account", text: "Name, email, securely hashed password (managed by Supabase Auth)." },
            { lead: "Academic profile", text: "Education stage, board (CBSE/ICSE/State), grade, subjects, marks, optional achievements." },
            { lead: "Assessment data", text: "Quiz responses measuring reasoning, verbal ability, critical thinking, and interests — the core of your recommendations." },
            { lead: "Usage data", text: "Careers explored, colleges saved, exams tracked, device/browser type, anonymized IP region, visit timestamps." },
            { lead: "Cookies", text: "Essential session cookies; analytics and advertising cookies only with consent (see §5)." },
        ],
        note: { lead: "Never collected", text: "No financial data, biometrics, medical records, caste/religion, or political beliefs. Please don't enter these in open text fields." },
    },
    {
        id: "why-we-process",
        num: "03",
        title: "Why We Process It",
        bullets: [
            { lead: "Personalized guidance", text: "Generate stream, career, and exam recommendations from your profile." },
            { lead: "Continuity", text: "Save progress and preferences so you can resume on any device." },
            { lead: "Security", text: "Detect anomalies, prevent fraud and bot signups, keep the Platform stable." },
            { lead: "Improvement", text: "Analyze anonymized trends to decide what careers/exams to add next." },
            { lead: "Legal compliance", text: "Respond to lawful requests and enforce our Terms of Service." },
        ],
    },
    {
        id: "legal-basis",
        num: "04",
        title: "Legal Basis",
        bullets: [
            { lead: "Consent", text: "You agree to our terms and choose to take assessments." },
            { lead: "Contract", text: "Delivering the core features you registered for." },
            { lead: "Legitimate interests", text: "Security, fraud prevention, and product analytics — without overriding your rights." },
            { lead: "Legal obligation", text: "Where Indian law mandates it." },
        ],
    },
    {
        id: "third-parties",
        num: "05",
        title: "Third Parties & Advertising",
        intro: "We never sell or rent your data. It is shared only with essential infrastructure partners under confidentiality:",
        bullets: [
            { lead: "Supabase", text: "Database + authentication, protected by Row Level Security so users can never read each other's data." },
            { lead: "Email providers", text: "Transactional email only — password resets and verification links." },
            { lead: "Google AdSense", text: "Ads keep Zertainity free. Google may use cookies (e.g., DoubleClick) to personalize ads based on your visits. Opt out at Google's Ad Settings or aboutads.info." },
            { lead: "Analytics", text: "Anonymized traffic metrics only." },
        ],
    },
    {
        id: "security",
        num: "06",
        title: "Security",
        bullets: [
            { lead: "In transit", text: "TLS/HTTPS encryption on every connection." },
            { lead: "At rest", text: "Database-level encryption." },
            { lead: "Passwords", text: "Modern cryptographic hashing — never stored in plaintext." },
            { lead: "Isolation", text: "Row Level Security means the database itself blocks cross-user access." },
        ],
        note: { lead: "If something looks wrong", text: "No platform is immune to sophisticated attacks — report suspected unauthorized access to us immediately." },
    },
    {
        id: "retention",
        num: "07",
        title: "Retention & Deletion",
        bullets: [
            { lead: "While active", text: "Data is kept only while your account is active or as needed for the purposes above." },
            { lead: "On deletion", text: "Delete anytime from Settings or by email — personally identifiable data is removed from active databases within 30 days." },
            { lead: "Kept longer", text: "Only anonymized aggregates (statistical modeling) or data retention required by law." },
        ],
    },
    {
        id: "your-rights",
        num: "08",
        title: "Your Rights",
        bullets: [
            { lead: "Access", text: "Request a summary of the data we hold about you." },
            { lead: "Rectification", text: "Correct inaccurate or incomplete profile information." },
            { lead: "Erasure", text: "Request permanent deletion of your account and data." },
            { lead: "Withdraw consent", text: "Any time — some features may stop working as a result." },
            { lead: "Grievance redressal", text: "Complain to our Grievance Officer, then to the Data Protection Board of India." },
            { lead: "Exercise them", text: "Email privacy@zertainity.in — we respond within 30 days." },
        ],
    },
    {
        id: "minors",
        num: "09",
        title: "Protection of Minors",
        bullets: [
            { lead: "Age", text: "The Platform is intended for students 13+; under-18s should use it with a parent, guardian, or educator." },
            { lead: "Under 13", text: "We never knowingly collect their data. Parents: contact us and we will promptly expunge it." },
        ],
    },
    {
        id: "transfers",
        num: "10",
        title: "Cross-Border Transfers",
        bullets: [
            { lead: "Where data lives", text: "Cloud infrastructure may sit outside India." },
            { lead: "Your protection", text: "Contractual clauses + technical safeguards ensure protection equivalent to Indian law." },
        ],
    },
    {
        id: "changes",
        num: "11",
        title: "Changes to This Policy",
        bullets: [
            { lead: "How you'll know", text: "The “Last Updated” date changes; material changes get prominent notice (email or on-Platform alert) before taking effect." },
            { lead: "Continued use", text: "After an update, means you accept the revised policy." },
        ],
    },
    {
        id: "contact",
        num: "12",
        title: "Contact & Grievance Officer",
        bullets: [
            { lead: "Email", text: "privacy@zertainity.in" },
            { lead: "Web form", text: "/contact" },
        ],
        note: { lead: "IT Act, 2000", text: "The address above is the designated Grievance Officer contact point under the Act and its rules." },
    },
];

export default function PrivacyPolicy() {
    return (
        <LegalPage
            title="Privacy Policy"
            blurb="Plain-language answers to what we collect, why, and the control you have."
            updatedLabel={LAST_UPDATED_LABEL}
            path="/privacy-policy"
            schemaType="PrivacyPolicy"
            description="Learn how Zertainity collects, uses, and protects your personal and academic data. We never sell student data and use Supabase Row Level Security to keep it private."
            keywords="Zertainity privacy policy, student data privacy, career guidance privacy, India education data, GDPR DPDP, secure career platform"
            publishedTime="2026-05-01"
            modifiedTime={LAST_UPDATED_ISO}
            tldr={[
                "We never sell your data.",
                "Delete your account anytime — gone within 30 days.",
                "The database itself enforces privacy (Row Level Security).",
                "Questions → privacy@zertainity.in, answered within 30 days.",
            ]}
            sections={SECTIONS}
        />
    );
}
