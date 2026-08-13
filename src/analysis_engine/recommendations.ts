import type {
  CareerMatch,
  CollegeProfile,
  CollegeRecommendation,
  CourseRecommendation,
} from "./types";
import { VERIFIED_COLLEGES } from "./config";

export function deriveCourseRecommendations(
  topCareers: CareerMatch[],
  maxCourses = 8
): CourseRecommendation[] {
  const courseMap = new Map<string, Set<string>>();

  topCareers.forEach((career) => {
    (career.recommended_courses || []).forEach((course) => {
      if (!courseMap.has(course)) {
        courseMap.set(course, new Set());
      }
      courseMap.get(course)!.add(career.career);
    });
  });

  const recommendations: CourseRecommendation[] = [];
  courseMap.forEach((careersSet, courseName) => {
    recommendations.push({
      course: courseName,
      based_on_careers: Array.from(careersSet),
    });
  });

  return recommendations.slice(0, maxCourses);
}

export function matchVerifiedColleges(
  courses: CourseRecommendation[],
  topCareers: CareerMatch[],
  colleges: CollegeProfile[] = VERIFIED_COLLEGES
): CollegeRecommendation[] {
  const recommendedCourseNames = new Set(courses.map((c) => c.course.toLowerCase()));
  const topCategories = new Set(topCareers.map((c) => c.category.toLowerCase()));

  const matched: CollegeRecommendation[] = [];

  colleges.forEach((college) => {
    const matchedCourses: string[] = [];
    const reasons: string[] = [];

    college.courses.forEach((c) => {
      const lower = c.toLowerCase();
      const directMatch = courses.find((rc) => lower.includes(rc.course.toLowerCase()) || rc.course.toLowerCase().includes(lower));
      if (directMatch) {
        matchedCourses.push(c);
        reasons.push(`Premier institution for ${directMatch.course}`);
      }
    });

    if (matchedCourses.length > 0) {
      matched.push({
        id: college.id,
        name: college.name,
        location: college.location,
        rating: college.rating,
        rank: college.rank,
        website: college.website,
        matched_courses: matchedCourses,
        match_reasons: reasons,
      });
    }
  });

  // If no direct course match found, provide verified category leaders
  if (matched.length === 0 && colleges.length > 0) {
    return colleges.slice(0, 4).map((c) => ({
      id: c.id,
      name: c.name,
      location: c.location,
      rating: c.rating,
      rank: c.rank,
      website: c.website,
      matched_courses: c.courses.slice(0, 2),
      match_reasons: ["Top national accredited institution"],
    }));
  }

  return matched;
}
