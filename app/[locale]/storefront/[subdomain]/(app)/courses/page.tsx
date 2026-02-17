import { headers } from "next/headers";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getScopedI18n } from "@/locales/server";
import { CoursesCatalog } from "./_components/courses-catalog";

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

export default async function StorefrontCoursesPage() {
  const teacher = await getTeacher();

  if (!teacher) {
    return null;
  }

  const courses = await fetchQuery(
    api.storefront.queries.getPublishedCourses,
    { teacherId: teacher._id }
  );

  const t = await getScopedI18n("storefront.courses");

  const normalizedCourses = courses.map(
    (course: {
      _id: string;
      title: string;
      slug: string;
      description?: string | null;
      thumbnailUrl?: string | null;
      pricing?: { price: number; overridePrice: number | null };
      duration?: number;
      publishedAt?: number | null;
    }) => ({
      _id: course._id,
      title: course.title,
      slug: course.slug,
      imageUrl: course.thumbnailUrl ?? undefined,
      price: course.pricing?.overridePrice ?? course.pricing?.price ?? 0,
      duration: course.duration ?? 0,
      publishedAt: course.publishedAt ?? 0,
    })
  );

  return (
    <CoursesCatalog
      courses={normalizedCourses}
      translations={{
        pageTitle: t("pageTitle"),
        pageSubtitle: t("pageSubtitle"),
        searchPlaceholder: t("searchPlaceholder"),
        filterAll: t("filterAll"),
        filterFree: t("filterFree"),
        filterPaid: t("filterPaid"),
        sortNewest: t("sortNewest"),
        sortPriceLow: t("sortPriceLow"),
        sortPriceHigh: t("sortPriceHigh"),
        sortTitle: t("sortTitle"),
        viewCourse: t("viewCourse"),
        free: t("free"),
        minutes: t("minutes"),
        noCoursesTitle: t("noCoursesTitle"),
        noCoursesDescription: t("noCoursesDescription"),
        noResultsTitle: t("noResultsTitle"),
        noResultsDescription: t("noResultsDescription"),
        clearFilters: t("clearFilters"),
        coursesAvailable: t("coursesAvailable"),
      }}
    />
  );
}
