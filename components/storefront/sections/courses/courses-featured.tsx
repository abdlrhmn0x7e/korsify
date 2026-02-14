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

interface CoursesFeaturedProps {
  content: CoursesContent;
  courses: Array<Course>;
}

export function CoursesFeatured({ content, courses }: CoursesFeaturedProps) {
  const {
    title,
    subtitle,
    showPrice,
    showDuration,
    viewAllLink,
  } = content;

  const displayCourses = courses;
  const featuredCourse = displayCourses[0];
  const otherCourses = displayCourses.slice(1);

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

        {displayCourses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No courses available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 @4xl:grid-cols-2 gap-8">
            {featuredCourse && (
              <Card className="overflow-hidden hover:shadow-lg transition-shadow @4xl:row-span-2">
                {featuredCourse.imageUrl && (
                  <div className="aspect-video @4xl:aspect-[4/3] relative">
                    <img
                      src={featuredCourse.imageUrl}
                      alt={featuredCourse.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <Badge className="mb-2">Featured</Badge>
                      <CardTitle className="text-2xl">{featuredCourse.title}</CardTitle>
                    </div>
                    {showPrice && (
                      <Badge variant="secondary" className="shrink-0 text-lg px-3 py-1">
                        {featuredCourse.price && featuredCourse.price > 0
                          ? `$${featuredCourse.price}`
                          : "Free"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {featuredCourse.description && (
                    <p className="text-muted-foreground line-clamp-3">
                      {featuredCourse.description}
                    </p>
                  )}
                  {showDuration && featuredCourse.duration && (
                    <div className="text-sm text-muted-foreground mt-4">
                      {Math.round(featuredCourse.duration / 60)} mins
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    size="lg"
                    className="w-full"
                    render={<Link href={`/courses/${featuredCourse.slug}`} />}
                  >
                    View Course
                  </Button>
                </CardFooter>
              </Card>
            )}

            <div className="space-y-4">
              {otherCourses.map((course) => (
                <Card
                  key={course._id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex gap-4 p-4">
                    {course.imageUrl && (
                      <div className="w-24 shrink-0">
                        <div className="aspect-square relative rounded-md overflow-hidden">
                          <img
                            src={course.imageUrl}
                            alt={course.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold line-clamp-1">{course.title}</h3>
                          {showPrice && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              {course.price && course.price > 0
                                ? `$${course.price}`
                                : "Free"}
                            </Badge>
                          )}
                        </div>
                        {showDuration && course.duration && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {Math.round(course.duration / 60)} mins
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-fit mt-2"
                        render={<Link href={`/courses/${course.slug}`} />}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
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
