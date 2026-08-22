/**
 * Single source of truth for in-depth, verified Indian career guides.
 * Sourced from official National Classification of Occupations 2015 (NCO-2015),
 * National Testing Agency (NTA), UPSC, and respective apex regulatory bodies.
 */
import type { CareerRoleDetail, CareerRoleCollege, CareerRoleSource } from "./career_details/types";
export type { CareerRoleDetail, CareerRoleCollege, CareerRoleSource };

import { TECHNOLOGY_CAREER_DETAILS } from "./career_details/technology";
import { ENGINEERING_CAREER_DETAILS } from "./career_details/engineering";
import { MEDICAL_CAREER_DETAILS } from "./career_details/medical";
import { FINANCE_CAREER_DETAILS } from "./career_details/finance";
import { GOVERNMENT_LEGAL_CAREER_DETAILS } from "./career_details/government_legal";
import { DESIGN_MEDIA_CAREER_DETAILS } from "./career_details/design_media";
import { SCIENCE_EDUCATION_CAREER_DETAILS } from "./career_details/science_education";

export const CAREER_ROLE_DETAILS: Record<string, CareerRoleDetail> = {
  ...TECHNOLOGY_CAREER_DETAILS,
  ...ENGINEERING_CAREER_DETAILS,
  ...MEDICAL_CAREER_DETAILS,
  ...FINANCE_CAREER_DETAILS,
  ...GOVERNMENT_LEGAL_CAREER_DETAILS,
  ...DESIGN_MEDIA_CAREER_DETAILS,
  ...SCIENCE_EDUCATION_CAREER_DETAILS,
};

// Build slug lookup dynamically from all authored career role details
export const CAREER_SLUG_BY_LIST_NAME: Record<string, string> = {};

Object.entries(CAREER_ROLE_DETAILS).forEach(([slug, detail]) => {
  CAREER_SLUG_BY_LIST_NAME[detail.listName] = slug;
});

// Explicit aliases for catalog compatibility
CAREER_SLUG_BY_LIST_NAME["Software Engineer"] = "software-engineer";
CAREER_SLUG_BY_LIST_NAME["Doctor (MBBS)"] = "doctor-mbbs";
CAREER_SLUG_BY_LIST_NAME["Chartered Accountant (CA)"] = "chartered-accountant-ca";
CAREER_SLUG_BY_LIST_NAME["Civil Services (IAS/IPS/IFS)"] = "civil-services-ias-ips-ifs";
CAREER_SLUG_BY_LIST_NAME["Data Scientist"] = "data-scientist";
CAREER_SLUG_BY_LIST_NAME["AI/ML Engineer"] = "ai-ml-engineer";
CAREER_SLUG_BY_LIST_NAME["Architect"] = "architect";
CAREER_SLUG_BY_LIST_NAME["Investment Banker"] = "investment-banker";
CAREER_SLUG_BY_LIST_NAME["Electronics Engineer"] = "electronics-engineer";
CAREER_SLUG_BY_LIST_NAME["Dentist"] = "dentist";
CAREER_SLUG_BY_LIST_NAME["Ayurvedic Doctor (BAMS)"] = "ayurvedic-doctor-bams";
CAREER_SLUG_BY_LIST_NAME["Homeopathic Doctor (BHMS)"] = "homeopathic-doctor-bhms";
CAREER_SLUG_BY_LIST_NAME["Psychologist / Therapist"] = "psychologist-therapist";
CAREER_SLUG_BY_LIST_NAME["Nutritionist / Dietitian"] = "nutritionist-dietitian";
CAREER_SLUG_BY_LIST_NAME["Cost Accountant (CMA)"] = "cost-accountant-cma";
CAREER_SLUG_BY_LIST_NAME["Company Secretary (CS)"] = "company-secretary-cs";
CAREER_SLUG_BY_LIST_NAME["Bank PO (Probationary Officer)"] = "bank-po-probationary-officer";
CAREER_SLUG_BY_LIST_NAME["Bank PO / Clercial Officer"] = "bank-po-probationary-officer";
CAREER_SLUG_BY_LIST_NAME["Defense Officer (Army/Navy/Air)"] = "defense-officer-army-navy-air";
CAREER_SLUG_BY_LIST_NAME["Defense Services (Army/Navy/AF)"] = "defense-officer-army-navy-air";
CAREER_SLUG_BY_LIST_NAME["Judge / Magistrate"] = "judge-magistrate";
CAREER_SLUG_BY_LIST_NAME["Journalist / Reporter"] = "journalist-reporter";
CAREER_SLUG_BY_LIST_NAME["Diplomat (IFS)"] = "diplomat-ifs";
CAREER_SLUG_BY_LIST_NAME["Site Reliability Eng (SRE)"] = "site-reliability-eng-sre";
CAREER_SLUG_BY_LIST_NAME["Staff Selection Commission (SSC)"] = "ssc-cgl-officer";
CAREER_SLUG_BY_LIST_NAME["School Teacher (PGT/TGT)"] = "school-teacher";
CAREER_SLUG_BY_LIST_NAME["University Professor / Lecturer"] = "college-professor";
CAREER_SLUG_BY_LIST_NAME["Research Scientist (DRDO/ISRO/CSIR)"] = "research-scientist";
CAREER_SLUG_BY_LIST_NAME["Hotel Manager"] = "hotel-general-manager";
CAREER_SLUG_BY_LIST_NAME["Agricultural Officer"] = "agricultural-scientist";
CAREER_SLUG_BY_LIST_NAME["Cyber Law Expert"] = "cyber-lawyer";
CAREER_SLUG_BY_LIST_NAME["State Civil Services (PCS)"] = "state-psc-officer";
CAREER_SLUG_BY_LIST_NAME["Indian Revenue Service (IRS)"] = "indian-revenue-service-irs";
CAREER_SLUG_BY_LIST_NAME["Railway Services (RRB)"] = "railway-services-officer";
CAREER_SLUG_BY_LIST_NAME["Film/Video Editor"] = "film-video-editor";
CAREER_SLUG_BY_LIST_NAME["Education Counselor"] = "educational-counselor";
CAREER_SLUG_BY_LIST_NAME["Merchant Navy Officer (Deck/Engine)"] = "merchant-navy-deck-officer";

export function hasCareerRoleDetail(listName: string): boolean {
  const slug = CAREER_SLUG_BY_LIST_NAME[listName];
  return Boolean(slug && CAREER_ROLE_DETAILS[slug]);
}

export function getCareerSlugForListName(listName: string): string | null {
  return CAREER_SLUG_BY_LIST_NAME[listName] ?? null;
}

export function getCareerDetailBySlug(slug: string): CareerRoleDetail | undefined {
  return CAREER_ROLE_DETAILS[slug];
}

export function getCareerDetailByListName(listName: string): CareerRoleDetail | undefined {
  const slug = CAREER_SLUG_BY_LIST_NAME[listName];
  return slug ? CAREER_ROLE_DETAILS[slug] : undefined;
}

export const ALL_CAREER_DETAIL_SLUGS = Object.keys(CAREER_ROLE_DETAILS);
