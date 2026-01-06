import { useQueryStates } from "nuqs";
import { createLoader, parseAsString } from "nuqs/server";

const courseSearchParams = {
  slug: parseAsString,
  lessonId: parseAsString,
};

export function useCourseSearchParams() {
  return useQueryStates(courseSearchParams, { shallow: true });
}

export const loadCourseSearchParams = createLoader(courseSearchParams);
