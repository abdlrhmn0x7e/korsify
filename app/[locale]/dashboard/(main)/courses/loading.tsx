import { PageHeader } from "@/components/dashboard/page-header";
import { IconBook } from "@tabler/icons-react";
import { CoursesTableSkeleton } from "../_components/tables/courses";
import { AddCourseDialog } from "./_components/add-course-dialog";
import { PageLayout } from "@/components/dashboard/page-layout";

export default function CoursesPageLoading() {
  return (
    <PageLayout>
      <PageHeader title="Manage Your Courses" Icon={IconBook}>
        <AddCourseDialog />
      </PageHeader>

      <CoursesTableSkeleton />
    </PageLayout>
  );
}
