import { PageHeader } from "@/components/dashboard/page-header";
import { IconBook } from "@tabler/icons-react";
import { CoursesTable } from "../_components/tables/courses";
import { AddCourseDialog } from "./_components/add-course-dialog";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/dashboard/page-layout";
import { CourseDrawer } from "../_components/drawers/course-drawer";
import { getScopedI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const t = await getScopedI18n("dashboard.courses");
  const [teacher] = await Promise.all([
    fetchAuthQuery(api.teachers.queries.getTeacher),
  ]);
  if (!teacher) return redirect("/dashboard/onboarding");

  return (
    <PageLayout>
      <PageHeader title={t("title")} Icon={IconBook}>
        <AddCourseDialog />
      </PageHeader>

      <CoursesTable />

      <CourseDrawer />
    </PageLayout>
  );
}
