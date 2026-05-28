import type { BreadcrumbItem } from "@/components/SEO";

type SeoPage = {
  title: string;
  description: string;
  canonical: string;
  keywords?: string;
};

const pages: Record<string, SeoPage> = {
  home: {
    title: "Free Career Guidance for Indian Students",
    description:
      "Take a free career aptitude test and get a personalized roadmap built for the Indian education system.",
    canonical: "/",
    keywords:
      "free career guidance India, career aptitude test, stream selection, class 10 career test, class 12 career guidance",
  },
  quiz: {
    title: "Free Career Aptitude Test",
    description:
      "Answer 20 questions and find out which stream, college, and career suits you best.",
    canonical: "/quiz",
    keywords:
      "career aptitude test, free career quiz India, stream choice after 10th, career guidance quiz",
  },
  results: {
    title: "Your Career Roadmap",
    description:
      "Your personalized career roadmap based on your interests, strengths, and goals.",
    canonical: "/results",
    keywords:
      "career roadmap, personalized career guidance, student results, stream recommendation",
  },
  careers: {
    title: "Browse Careers in India",
    description:
      "Explore verified career paths for Indian students with subjects, exams, and pathway details.",
    canonical: "/careers",
  },
  pathways: {
    title: "Career Pathways for Indian Students",
    description:
      "Step-by-step pathways for Indian students with subjects, entrance exams, and college routes.",
    canonical: "/pathways",
  },
  exams: {
    title: "Indian Entrance Exams Guide",
    description:
      "A clear guide to major Indian entrance exams, eligibility, timelines, and career routes.",
    canonical: "/exams",
  },
  about: {
    title: "About Zertainity",
    description:
      "Learn how Zertainity maps subjects, exams, and career pathways for Indian students.",
    canonical: "/about",
  },
  contact: {
    title: "Contact Zertainity",
    description: "Reach out to Zertainity for support, questions, or feedback.",
    canonical: "/contact",
  },
};

export function getSeoPage(page: keyof typeof pages): SeoPage {
  return pages[page];
}

export function buildBreadcrumbs(items: BreadcrumbItem[]) {
  return items;
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Zertainity",
    url: "https://www.zertainity.in",
    logo: "https://www.zertainity.in/favicon.png",
  };
}

export function buildFaqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
