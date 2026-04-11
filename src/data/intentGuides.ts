/**
 * Long-form intent pages for organic search — each slug must have unique, substantive copy.
 */

export type IntentGuide = {
  slug: string;
  title: string;
  metaDescription: string;
  lead: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export const INTENT_GUIDES: Record<string, IntentGuide> = {
  "career-after-10th-cbse": {
    slug: "career-after-10th-cbse",
    title: "Career planning after Class 10 (CBSE and equivalent boards)",
    metaDescription:
      "After CBSE Class 10 in India: choosing Science, Commerce, or Humanities, skill-building, and using a structured career test to reduce guesswork.",
    lead:
      "Class 10 is less about locking one job title forever and more about keeping future doors open while matching your current strengths. In India, your stream choice (Science with PCM or PCB, Commerce, Humanities, vocational diplomas) shapes which undergraduate entrances stay realistic—so treat the decision as a portfolio of options, not a single bet.",
    sections: [
      {
        heading: "What actually changes after 10th?",
        paragraphs: [
          "Science (PCM) keeps engineering, architecture, and many design-tech hybrids feasible; Science (PCB) aligns with medicine, life sciences, and allied health; Commerce opens CA, finance, and business analytics tracks that still reward mathematics if you add it; Humanities preserves law, design, media, and civil services preparation with the right subject mix.",
          "CBSE’s flexibility with subject combinations varies by school; always verify which electives your school can timetable for Classes 11–12 before committing on paper.",
        ],
      },
      {
        heading: "How parents and students can decide without panic",
        paragraphs: [
          "List three careers that genuinely excite the student (not only what relatives suggest) and check the minimum subject requirements for each. If two dream paths disagree—say civil services vs pure physics—look for hybrid undergraduate programmes or deferred specialisation rather than forcing an early false choice.",
          "Use past academic evidence: stable marks in mathematics usually matter for economics and engineering routes; sustained reading and writing help law and humanities; consistent biology interest supports medical preparation more than one exam cram season.",
        ],
      },
      {
        heading: "Next step on Zertainity",
        paragraphs: [
          "Take the free aptitude and interest flow on Zertainity, then explore pathways that show how subjects connect to realistic Indian entrance timelines. Bring the output to your school counsellor so they can map it to local board rules and scholarship options.",
        ],
      },
    ],
  },
  "pcm-vs-pcb": {
    slug: "pcm-vs-pcb",
    title: "PCM vs PCB after 10th: a neutral comparison for Indian students",
    metaDescription:
      "PCM (Math) vs PCB (Biology) after Class 10: which doors each opens, when you can switch, and myths to ignore when choosing in India.",
    lead:
      "PCM (Physics, Chemistry, Mathematics) and PCB (Physics, Chemistry, Biology) are not “difficulty levels” but different gateways. PCM keeps most engineering, architecture, and economics-heavy science routes viable; PCB aligns with NEET-centred medicine and many life-science degrees. PCMB exists but is heavy—only choose it with a timetable plan and sleep budget.",
    sections: [
      {
        heading: "Doors each combination keeps open",
        paragraphs: [
          "PCM: JEE route for B.Tech, B.Arch (with Maths), many B.Sc programmes, and later shifts into data or management with add-on courses. PCB: NEET for MBBS/BDS and strong alignment with nursing, pharmacy, physiotherapy, and research biology. Some design and agricultural programmes accept either stream—read each university’s brochure PDF instead of trusting forum rumours.",
          "Switching later is possible but expensive: moving from a pure PCB school track into engineering often means a gap year or extra mathematics bridge courses, while moving from PCM into medicine usually requires biology catch-up before NEET.",
        ],
      },
      {
        heading: "Myths that waste time",
        paragraphs: [
          "“Only toppers should take PCM” and “PCB is only for doctors” are both false—what matters is sustained interest in the daily work of those fields. Another myth is that PCMB doubles your chances; it mainly doubles your workload unless you truly enjoy both mathematics contests and biology depth.",
        ],
      },
      {
        heading: "Try an evidence-based check",
        paragraphs: [
          "Use Zertainity’s quiz and pathway graphs to see which stream matches your pattern of interests, then validate with a teacher who knows your writing speed under exam conditions—both streams are ultimately exam-constrained in India.",
        ],
      },
    ],
  },
  "software-engineer-after-12th-india": {
    slug: "software-engineer-after-12th-india",
    title: "How to become a software engineer after 12th in India",
    metaDescription:
      "Practical route map: JEE vs private university entrances, B.Tech CS vs BCA, internships, DSA practice, and hiring signals Indian tech companies use.",
    lead:
      "Most Indian students who become software engineers enter through a four-year B.Tech or B.E. with Computer Science, Information Technology, or allied branches, followed by internships and interview preparation in data structures, algorithms, and system basics. Alternate routes (BCA + MCA, strong open-source portfolios) work but require more deliberate proof because campus hiring funnels still favour established degree patterns.",
    sections: [
      {
        heading: "Typical timeline after 12th Science with Maths",
        paragraphs: [
          "Years 1–2 of engineering: build programming fluency (one systems language + Python), discrete mathematics, and databases. Year 3: internships— even unpaid short projects beat an empty CV. Year 4: focused LeetCode/Codeforces style practice for product companies plus OS/networks revision for infrastructure roles.",
          "If you miss highly competitive JEE ranks, many state universities and private institutes still offer strong peer groups—differentiate with GitHub quality, internship letters, and competitive programming ratings rather than only brand name.",
        ],
      },
      {
        heading: "Alternate and hybrid routes",
        paragraphs: [
          "BCA followed by MCA can converge with B.Tech hiring if you aggressively intern and publish projects. Integrated MSc programmes can feed research engineering roles. Bootcamps can help pivot after a degree but are rarely a substitute for a first undergraduate qualification in India for campus placements.",
        ],
      },
      {
        heading: "See where you fit",
        paragraphs: [
          "Zertainity’s assessment blends interest and academic style signals; pair the output with a mentor who knows your city’s hiring market (Bangalore product vs GCC analyst vs embedded hubs).",
        ],
      },
    ],
  },
  "commerce-careers-without-maths": {
    slug: "commerce-careers-without-maths",
    title: "Commerce careers in India without heavy mathematics",
    metaDescription:
      "Commerce stream options beyond stereotypical CA-only paths: law, management, marketing, policy, and where basic numeracy still appears.",
    lead:
      "Choosing Commerce without Mathematics does close some quantitative finance and economics doors, but many high-growth careers remain reachable: corporate law after CLAT, human resources, digital marketing, hotel management, public administration, and parts of international business. The key is to be honest about numeracy—every corporate role touches budgets eventually—while not assuming you must enjoy integration to succeed.",
    sections: [
      {
        heading: "Clusters that fit “commerce without maths” stereotypes least badly",
        paragraphs: [
          "Law (BA LLB / BBA LLB): mathematics rarely appears in entrance beyond logical reasoning sections. Hotel management and tourism: aptitude tests focus on service scenarios and language. Marketing and communications: excel at writing, analytics tools can be learned later. Public policy and social sciences: quantitative methods may appear in university but not at 12th level.",
          "Accountancy-heavy roles (CA core papers) do include quantitative techniques; if you dislike maths entirely, discuss with a counsellor whether CA is the right flagship goal versus CS company secretary or corporate law.",
        ],
      },
      {
        heading: "Where numeracy still sneaks in",
        paragraphs: [
          "MBA programmes often require quantitative aptitude tests (not Class 12 integration, but timed arithmetic and interpretation). Marketing analytics roles expect comfort with spreadsheets even if not calculus. Plan a gentle ramp—statistics for social sciences courses, Excel certification—rather than avoiding all numbers.",
        ],
      },
      {
        heading: "Map interests with Zertainity",
        paragraphs: [
          "Run the Zertainity career flow with your actual subject combination; it highlights pathways that match Indian entrance calendars so you can avoid dead-end combinations at graduation time.",
        ],
      },
    ],
  },
};

export const INTENT_GUIDE_SLUGS = Object.keys(INTENT_GUIDES);

export function getIntentGuide(slug: string | undefined): IntentGuide | undefined {
  if (!slug) return undefined;
  return INTENT_GUIDES[slug];
}
