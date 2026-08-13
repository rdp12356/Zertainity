import type { CollegeProfile } from "./types.ts";
import { canonicalKey } from "./normalization.ts";

const tokens = (value: string) => canonicalKey(value).split(/[^a-z0-9]+/).filter(token => token.length > 1);
const overlaps = (left: string, right: string) => tokens(left).filter(token => tokens(right).includes(token)).length >= 2;

export function recommendColleges(colleges: CollegeProfile[], courses: string[]) {
  return colleges.map(college => {
    const matched_courses = courses.filter(course => college.courses.some(collegeCourse => overlaps(course, collegeCourse)));
    return { id: college.id, name: college.name, location: college.location, rating: college.rating ?? null, rank: college.rank ?? null, website: college.website ?? null, matched_courses, match_reasons: matched_courses.map(course => college.name + " lists a related " + course + " course") };
  }).filter(college => college.matched_courses.length > 0)
    .sort((left, right) => right.matched_courses.length - left.matched_courses.length || (right.rating ?? 0) - (left.rating ?? 0) || left.name.localeCompare(right.name))
    .slice(0, 10);
}
