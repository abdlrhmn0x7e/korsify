import { headers } from "next/headers";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

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

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center">
        <h1 className="text-4xl font-bold">{teacher.name}</h1>
        <p className="mt-4 text-lg text-gray-600">
          Welcome to my courses. Browse and enroll in the courses below.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Available Courses</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-gray-50 p-8 text-center text-gray-500">
            No courses available yet.
          </div>
        </div>
      </section>
    </div>
  );
}
