import type {
  CoursesContent,
  CoursesVariant,
} from "@/convex/db/storefronts/validators";
import { CoursesGrid } from "./courses/courses-grid";
import { CoursesList } from "./courses/courses-list";
import { CoursesCarousel } from "./courses/courses-carousel";
import { CoursesFeatured } from "./courses/courses-featured";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string;
  thumbnailUrl?: string | null;
  pricing?: {
    price: number;
    overridePrice: number | null;
  };
  price?: number;
  duration?: number;
}

interface DisplayCourse {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  duration?: number;
}

interface CoursesSectionProps {
  content: CoursesContent;
  variant: CoursesVariant;
  courses: Array<Course>;
}

export function CoursesSection({ content, variant, courses }: CoursesSectionProps) {
  const displayCourses = getDisplayCourses(content, courses).map((course) =>
    normalizeCourseData(course)
  );

  switch (variant) {
    case "list":
      return <CoursesList content={content} courses={displayCourses} />;
    case "carousel":
      return <CoursesCarousel content={content} courses={displayCourses} />;
    case "featured":
      return <CoursesFeatured content={content} courses={displayCourses} />;
    case "grid":
    default:
      return <CoursesGrid content={content} courses={displayCourses} />;
  }
}

function getDisplayCourses(content: CoursesContent, courses: Array<Course>) {
  const selectedCourseIds = content.selectedCourseIds;
  if (selectedCourseIds.length === 0) return [];

  const courseById = new Map(courses.map((course) => [course._id, course]));
  return selectedCourseIds
    .map((courseId) => courseById.get(courseId))
    .filter((course): course is Course => course !== undefined);
}

function normalizeCourseData(course: Course): DisplayCourse {
  const description =
    typeof course.description === "string" ? course.description : undefined;
  const price = course.price ?? course.pricing?.overridePrice ?? course.pricing?.price;

  return {
    _id: course._id,
    title: course.title,
    slug: course.slug,
    description,
    imageUrl: course.imageUrl ?? course.thumbnailUrl ?? undefined,
    price,
    duration: course.duration,
  };
}
