import { LegalPage, type LegalSection } from "@/components/LegalPage";

const LAST_UPDATED_ISO = "2026-05-20";
const LAST_UPDATED_LABEL = "20 May 2026";

const SECTIONS: LegalSection[] = [
    {
        id: "not-advice",
        num: "01",
        title: "Educational Guidance, Not Professional Advice",
        bullets: [
            { lead: "What we are", text: "A free, evidence-based platform helping Indian students explore streams, exams, careers, and colleges." },
            { lead: "What our output is", text: "Educational suggestions — never professional or psychological advice." },
            { lead: "What we are not", text: "A substitute for a certified counsellor, academic advisor, psychologist, mentor, parent, or teacher." },
        ],
        note: { lead: "Before big decisions", text: "Stream choice, exams, college applications, course acceptance — discuss them with people who know you best, and where helpful a qualified counsellor." },
    },
    {
        id: "how-generated",
        num: "02",
        title: "How Recommendations Are Generated",
        bullets: [
            { lead: "Inputs", text: "Your board, grade, subjects, marks, and interests." },
            { lead: "Matching", text: "Scores reflect alignment with patterns in our curated catalogs — they don't certify success in any field." },
            { lead: "Freshness", text: "We update content continuously but can't promise it always reflects the latest syllabus or admission policy." },
        ],
    },
    {
        id: "limitations",
        num: "03",
        title: "Where Guidance Can Fall Short",
        bullets: [
            { lead: "Outdated criteria", text: "Exam patterns and admission rules change — always verify with the official body (NTA, CBSE, NMC…)." },
            { lead: "Local nuance", text: "State quotas, regional colleges, and family circumstances may not be reflected." },
            { lead: "Emerging fields", text: "Niche careers evolve faster than catalogues can track." },
            { lead: "Personal context", text: "Health, finances, and family responsibilities are best discussed with a counsellor." },
        ],
    },
    {
        id: "job-market",
        num: "04",
        title: "The Evolving Job Market",
        bullets: [
            { lead: "Change is constant", text: "Careers in tech, design, healthcare, and sciences shift fast — today's popular role may look very different in 5–10 years." },
            { lead: "How to use results", text: "Treat every recommendation as a direction to investigate, not a destination to lock in." },
        ],
    },
    {
        id: "external-links",
        num: "05",
        title: "External Links & Third-Party Content",
        bullets: [
            { lead: "Why they exist", text: "We link to colleges, exam bodies, articles, and videos to aid exploration." },
            { lead: "Our limits", text: "We don't control those sites and aren't responsible for their accuracy, terms, or privacy practices." },
        ],
    },
    {
        id: "your-responsibility",
        num: "06",
        title: "Your Responsibility",
        bullets: [
            { lead: "Decisions are yours", text: "Choices made using our recommendations are your own; Zertainity and its founders aren't liable for exam results, admissions, employment, or financial outcomes." },
            { lead: "Full terms", text: "/terms-of-service" },
        ],
        note: { lead: "Our philosophy", text: "Use Zertainity as a compass, not a destination — let recommendations point you toward promising directions, then chart your course with research, conversation, and a counsellor you trust." },
    },
    {
        id: "medical-legal-financial",
        num: "07",
        title: "Medical, Legal & Financial Questions",
        intro: "Zertainity does not provide medical, legal, financial, or psychological advice.",
        bullets: [
            { lead: "iCall helpline", text: "9152987821" },
            { lead: "Vandrevala Foundation", text: "1860-2662-345" },
        ],
        note: { lead: "Mental health", text: "If career-related stress or anxiety feels heavy, please reach out to a qualified professional or one of the helplines above." },
    },
    {
        id: "contact",
        num: "08",
        title: "Contact",
        bullets: [
            { lead: "Content concerns", text: "Email support@zertainity.in — we'll review any recommendation or factual error." },
        ],
    },
];

export default function Disclaimer() {
    return (
        <LegalPage
            title="Career Guidance Disclaimer"
            kicker="Important"
            blurb="Understand what Zertainity can and cannot do, so you can use our guidance with confidence."
            updatedLabel={LAST_UPDATED_LABEL}
            path="/disclaimer"
            schemaType="WebPage"
            description="Zertainity is an educational career-guidance tool, not a substitute for certified counsellors. Read about how to use our recommendations responsibly."
            keywords="Zertainity disclaimer, career guidance limits, education tool disclaimer, career counselling disclaimer India"
            publishedTime="2026-05-01"
            modifiedTime={LAST_UPDATED_ISO}
            tldr={[
                "Recommendations are educational suggestions — not advice.",
                "Always verify exam/admission rules with official bodies.",
                "Major decisions belong with family, teachers, and counsellors.",
                "Not medical/legal/financial advice — helplines listed below.",
            ]}
            sections={SECTIONS}
        />
    );
}
