import { PageHeader } from "@/components/dashboard/page-header";
import { IconBook } from "@tabler/icons-react";
import { CoursesTableSkeleton } from "../_components/tables/courses";
import { AddCourseButton } from "./_components/add-course-button";
import { PageLayout } from "@/components/dashboard/page-layout";

export default function CoursesPageLoading() {
  return (
    <PageLayout>
      <PageHeader title="Manage Your Courses" Icon={IconBook}>
        <AddCourseButton />
      </PageHeader>

      <CoursesTableSkeleton />
    </PageLayout>
  );
}
