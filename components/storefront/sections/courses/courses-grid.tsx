import type { CoursesContent } from "@/convex/db/storefronts/validators";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

interface CoursesGridProps {
  content: CoursesContent;
  courses: Array<Course>;
}

export function CoursesGrid({ content, courses }: CoursesGridProps) {
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
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl @3xl:text-4xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 @3xl:grid-cols-2 @5xl:grid-cols-3 gap-8">
          {displayCourses.map((course) => (
            <Card
              key={course._id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {course.imageUrl && (
                <div className="aspect-video relative">
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <CardHeader>
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                  {showPrice && (
                    <Badge variant="secondary" className="shrink-0">
                      {course.price && course.price > 0
                        ? `$${course.price}`
                        : "Free"}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {showDuration && course.duration && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <span>{Math.round(course.duration / 60)} mins</span>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  render={<Link href={`/courses/${course.slug}`} />}
                >
                  View Course
                </Button>
              </CardFooter>
            </Card>
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
