import { PageHeader } from "@/components/dashboard/page-header";
import { IconBook } from "@tabler/icons-react";
import { CoursesTable } from "../_components/tables/courses";
import { AddCourseButton } from "./_components/add-course-button";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { PageLayout } from "@/components/dashboard/page-layout";

export default async function CoursesPage() {
  const [teacher] = await Promise.all([
    fetchAuthQuery(api.teachers.queries.getTeacher),
  ]);
  if (!teacher) return redirect("/dashboard/onboarding");

  return (
    <PageLayout>
      <PageHeader title="Manage Your Courses" Icon={IconBook}>
        <AddCourseButton />
      </PageHeader>

      <CoursesTable />
    </PageLayout>
  );
}
