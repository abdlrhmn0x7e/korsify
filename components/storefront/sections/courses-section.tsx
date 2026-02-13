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
  switch (variant) {
    case "list":
      return <CoursesList content={content} courses={courses} />;
    case "carousel":
      return <CoursesCarousel courses={courses} />;
    case "featured":
      return <CoursesFeatured content={content} courses={courses} />;
    case "grid":
    default:
      return <CoursesGrid content={content} courses={courses} />;
  }
}
