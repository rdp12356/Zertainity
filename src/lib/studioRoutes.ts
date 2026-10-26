// Single source of truth for Zertainity Studio page names and deep links.
// Routes are always authorized independently through Supabase roles and RLS.
export const STUDIO_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "users", label: "Users" },
  { id: "colleges", label: "Colleges" },
  { id: "schools", label: "Schools" },
  { id: "careers", label: "Careers" },
  { id: "assessments", label: "Assessments" },
  { id: "shared", label: "Shared Results" },
  { id: "logs", label: "Activity Logs" },
  { id: "permissions", label: "Permissions" },
  { id: "export", label: "Data Export" },
] as const;

export type StudioSection = (typeof STUDIO_SECTIONS)[number]["id"];
export const STUDIO_SECTION_IDS: StudioSection[] = STUDIO_SECTIONS.map(section => section.id);

export function isStudioSection(section: string | undefined): section is StudioSection {
  return Boolean(section && STUDIO_SECTION_IDS.some(id => id === section));
}

export function studioPath(section: StudioSection, isStudioHost: boolean): string {
  if (isStudioHost) return section === "overview" ? "/" : "/" + section;
  return section === "overview" ? "/admin" : "/admin/" + section;
}
