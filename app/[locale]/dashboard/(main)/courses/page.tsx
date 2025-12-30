import { PageHeader } from "@/components/page-header";
import { IconBook } from "@tabler/icons-react";
import { Suspense } from "react";
import {
  CoursesTable,
  CoursesTableSkeleton,
} from "../_components/tables/courses";
import { AddCourseButton } from "./_components/add-course-button";

export default async function CoursesPage() {
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
