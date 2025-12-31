import { PageHeader } from "@/components/page-header";
import { IconBook } from "@tabler/icons-react";
import { Suspense } from "react";
import {
  CoursesTable,
  CoursesTableSkeleton,
} from "../_components/tables/courses";
import { AddCourseButton } from "./_components/add-course-button";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";

export default async function CoursesPage() {
  const [teacher] = await Promise.all([
    fetchAuthQuery(api.teachers.queries.getTeacher),
  ]);
  if (!teacher) return redirect("/dashboard/onboarding");

  return (
    <section>
      <PageHeader title="Manage Your Courses" Icon={IconBook}>
        <AddCourseButton />
      </PageHeader>

      <Suspense fallback={<CoursesTableSkeleton />}>
        <CoursesTable />
      </Suspense>
    </section>
  );
}
