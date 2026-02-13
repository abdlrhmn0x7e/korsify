import type { CoursesContent } from "@/convex/db/storefronts/validators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  duration?: number;
}

interface CoursesListProps {
  content: CoursesContent;
  courses: Array<Course>;
}

export function CoursesList({ content, courses }: CoursesListProps) {
  const {
    title,
    subtitle,
    showPrice,
    showDuration,
    limit = 6,
    viewAllLink,
  } = content;

  const displayCourses = courses.slice(0, limit);

  return (
    <section className="py-16 px-4 @3xl:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl @3xl:text-4xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="space-y-6">
          {displayCourses.map((course) => (
            <div
              key={course._id}
              className="flex gap-6 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              {course.imageUrl && (
                <div className="w-48 shrink-0 hidden @md:block">
                  <div className="aspect-video relative rounded-md overflow-hidden">
                    <img
                      src={course.imageUrl}
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
              )}
              
              <div className="flex-1 flex flex-col justify-between py-2">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>
                    {showPrice && (
                      <Badge variant="secondary" className="shrink-0">
                        {course.price && course.price > 0
                          ? `$${course.price}`
                          : "Free"}
                      </Badge>
                    )}
                  </div>
                  {course.description && (
                    <p className="text-muted-foreground mt-2 line-clamp-2">
                      {course.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  {showDuration && course.duration && (
                    <span className="text-sm text-muted-foreground">
                      {Math.round(course.duration / 60)} mins
                    </span>
                  )}
                  <Button
                    size="sm"
                    render={<Link href={`/courses/${course.slug}`} />}
                  >
                    View Course
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayCourses.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No courses available yet.
          </div>
        )}

        {viewAllLink && displayCourses.length > 0 && (
          <div className="text-center pt-8">
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/courses" />}
            >
              View All Courses
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
