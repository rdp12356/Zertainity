# Zertainity SEO and marketing launch plan

## Positioning
**Free career guidance built for Indian students.** Help students explore subjects, entrance exams, colleges, and career pathways. Avoid unsubstantiated “India's #1”, “most comprehensive”, success-rate, or guaranteed-placement claims.

## Primary audiences
- Class 10 students deciding on subject streams, with parents and teachers.
- Class 12 students exploring entrance exams, degrees, and college paths.
- Undergraduates exploring career pathways and employability.

## Conversion goals and instrumentation
- Primary: assessment started -> assessment completed -> recommendations viewed.
- Secondary: career guide viewed -> comparison viewed -> account signup.
- Track anonymized counts without sending student answers, PII, auth tokens, or precise locations into analytics. Confirm consent requirements before enabling advertising trackers.
- Report weekly landing-page sessions, search impressions, CTR, quiz start/completion, signup conversion, and top organic entry pages. Establish baseline before claiming improvement.

## Search content clusters
1. Career options after Class 10 in India (Science/Commerce/Humanities; avoid implying one stream suits everyone).
2. Career options after Class 12 by subject group, with entrance-exam requirements.
3. JEE/NEET/CUET and state entrance exam explainers with official links and individually reviewed update dates.
4. In-depth sourced career guides: required education, typical duties, exams, alternatives, uncertainties, and sources.
5. College exploration pages only for verified records; avoid automatically indexing empty, duplicate, and unreliable entries.

## Editorial quality and trust
- Add named editor, update date when actually edited, references to exam organizers and education authorities, and a correction/contact pathway.
- Do not mass-publish programmatically generated location pages before human verification.
- Review claims for accuracy and accessibility; state that guidance is informational and not a guaranteed career outcome.

## Technical SEO deployment checks
1. Confirm HTTPS canonical host redirect and 200 status for public URLs.
2. Check robots.txt and sitemap.xml on the *deployed* site, not only Git.
3. Validate sitemap URLs (200, canonical, indexable, unique) and remove user-specific/auth paths.
4. Inspect actual rendered HTML for per-route title, description, canonical and JSON-LD. The current Vite client-side rendering may warrant prerendering/SSR for important landing pages.
5. Run Lighthouse mobile tests, Core Web Vitals field reports, structured data validation, and search console coverage on production; do not claim scores without measurements.
6. Verify Analytics and Clarity events and consent behavior, mobile performance, OG 1200x630 share artwork, and social cards.
7. Submit canonical sitemap in Google Search Console and Bing Webmaster Tools; monitor coverage, branded queries, indexing and duplicate pages.

## Campaigns
- Organic: publish an audited guide + short explainer video each week and share through opt-in student communities.
- Schools: pilot with educators, collect voluntary feedback, and respect student data privacy.
- Referral: ask users to share a public career-guide URL rather than personal quiz results.
- Paid: only test ads once attribution, consent, privacy disclosures, and landing-page quality are verified.

## Release gates
Do not launch campaigns or merge/deploy the security PR until CI passes, credential exposure is reviewed, Supabase RLS and Edge Function permissions are tested in staging, and the production site is verified. Traffic, SEO rankings and marketing ROI are **not verified** by this document.
