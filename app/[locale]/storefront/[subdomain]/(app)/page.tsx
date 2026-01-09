import { headers } from "next/headers";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { DynamicSection } from "@/components/storefront/sections/dynamic-section";

const STOREFRONT_HEADER = "x-storefront-subdomain";
const CUSTOM_DOMAIN_HEADER = "x-custom-domain";

async function getTeacher() {
  const headersList = await headers();

  const subdomain = headersList.get(STOREFRONT_HEADER);
  if (subdomain) {
    return fetchQuery(api.teachers.queries.getBySubdomain, { subdomain });
  }

  const customDomain = headersList.get(CUSTOM_DOMAIN_HEADER);
  if (customDomain) {
    return fetchQuery(api.teachers.queries.getByCustomDomain, {
      customDomain,
    });
  }

  return null;
}

export default async function StorefrontHomePage() {
  const teacher = await getTeacher();

  if (!teacher) {
    return null;
  }

  const [storefrontData, courses] = await Promise.all([
    fetchQuery(api.storefront.queries.getStorefront, {
      teacherId: teacher._id,
    }).catch(() => null),
    fetchQuery(api.storefront.queries.getPublishedCourses, {
      teacherId: teacher._id,
    }),
  ]);

  if (storefrontData?.sections && storefrontData.sections.length > 0) {
    return (
      <div className="@container flex flex-col">
        {storefrontData.sections.map((section) => (
          <DynamicSection
            key={section.id}
            section={section}
            courses={courses}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold">{teacher.name}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Welcome to my courses. Browse and enroll in the courses below.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Available Courses</h2>
        {courses.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map(
              (course: {
                _id: string;
                title: string;
                description?: string;
                price?: number;
              }) => (
                <div key={course._id} className="rounded-lg border p-6">
                  <div className="aspect-video w-full mb-4 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground">Thumbnail</span>
                  </div>
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-muted-foreground mt-2 line-clamp-2">
                    {course.description}
                  </p>
                  <div className="mt-4 font-bold">
                    {course.price != null
                      ? new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(course.price)
                      : "Free"}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-muted p-8 text-center text-muted-foreground">
              No courses available yet.
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
