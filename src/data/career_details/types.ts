export type CareerRoleCollege = {
  name: string;
  context: string;
};

export type CareerRoleSource = {
  name: string;
  url?: string;
};

export type CareerRoleDetail = {
  listName: string;
  title: string;
  metaDescription: string;
  intro: string;
  typicalSubjects: string[];
  keyExams: string[];
  colleges: CareerRoleCollege[];
  ncoCode?: string;
  skillLevel?: string;
  regulatoryBody?: string;
  lastReviewed?: string;
  sources?: CareerRoleSource[];
};
