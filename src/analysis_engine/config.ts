import type { AnalysisConfig, CareerProfile } from "./types.ts";

export const DEFAULT_CAREER_PROFILES: CareerProfile[] = [
  { id: "bcom-finance", name: "B.Com Finance", category: "Finance", required_subjects: ["Accountancy"], subject_weights: { Accountancy: 0.45, Economics: 0.25, Mathematics: 0.2, "Business Studies": 0.1 }, required_skills: ["analytical", "logical"], interest_categories: ["finance", "business"], aptitude_requirements: { numerical: 70 }, preference_keywords: ["commerce", "finance", "bcom"], courses: ["B.Com Finance", "BBA Finance"] },
  { id: "software-engineer", name: "Software Engineer", category: "Technology", required_subjects: ["Mathematics"], subject_weights: { Mathematics: 0.4, "Computer Science": 0.35, Physics: 0.25 }, required_skills: ["analytical", "logical"], interest_categories: ["technology", "problem solving"], aptitude_requirements: { numerical: 65 }, preference_keywords: ["technology", "computer science", "engineering"], courses: ["B.Tech Computer Science", "BCA"] },
  { id: "data-scientist", name: "Data Scientist", category: "Technology", required_subjects: ["Mathematics"], subject_weights: { Mathematics: 0.5, Statistics: 0.3, "Computer Science": 0.2 }, required_skills: ["analytical", "logical"], interest_categories: ["technology", "mathematics", "research"], aptitude_requirements: { numerical: 75 }, preference_keywords: ["data", "technology", "analytics"], courses: ["B.Sc Data Science", "B.Tech AI & Data Science"] },
  { id: "chartered-accountant", name: "Chartered Accountant (CA)", category: "Finance", required_subjects: ["Accountancy"], subject_weights: { Accountancy: 0.5, Economics: 0.2, Mathematics: 0.15, "Business Studies": 0.15 }, required_skills: ["analytical", "logical"], interest_categories: ["finance", "business"], aptitude_requirements: { numerical: 70 }, preference_keywords: ["ca", "accounting", "finance"], courses: ["CA Foundation", "B.Com"] },
  { id: "doctor", name: "Doctor (MBBS)", category: "Medical", required_subjects: ["Biology", "Chemistry"], subject_weights: { Biology: 0.45, Chemistry: 0.35, Physics: 0.2 }, required_skills: ["communication"], interest_categories: ["healthcare", "science", "helping others"], aptitude_requirements: { scientific: 75 }, preference_keywords: ["medical", "medicine", "healthcare"], courses: ["MBBS", "BDS"] },
  { id: "business-analyst", name: "Business Analyst", category: "Business", subject_weights: { Economics: 0.3, "Business Studies": 0.3, Mathematics: 0.2, "Computer Science": 0.2 }, required_skills: ["analytical", "communication"], interest_categories: ["business", "technology", "problem solving"], aptitude_requirements: { numerical: 60 }, preference_keywords: ["business", "analytics", "management"], courses: ["BBA Business Analytics", "B.Com Business Analytics"] },
];

export const DEFAULT_CONFIG: AnalysisConfig = {
  performance_thresholds: [{ min: 90, label: "Exceptional" }, { min: 80, label: "Strong" }, { min: 70, label: "Good" }, { min: 60, label: "Developing" }, { min: 0, label: "Needs Improvement" }],
  strength_threshold: 80,
  development_threshold: 60,
  career_weights: { academic: 0.4, interest: 0.25, skills: 0.2, aptitude: 0.1, preferences: 0.05 },
  career_profiles: DEFAULT_CAREER_PROFILES,
  college_catalog: [],
};
