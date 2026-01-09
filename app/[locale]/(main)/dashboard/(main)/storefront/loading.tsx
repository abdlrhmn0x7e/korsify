import { PageHeader } from "@/components/dashboard/page-header";
import { IconBuildingStore } from "@tabler/icons-react";
import { PageLayout } from "@/components/dashboard/page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { WholePageSpinner } from "@/components/whole-page-spinner";

export default function CoursesPageLoading() {
  return (
    <PageLayout>
      <PageHeader title="Customize storefront" Icon={IconBuildingStore}>
        <Skeleton className="h-8 w-24" />
      </PageHeader>

      <WholePageSpinner />
    </PageLayout>
  );
}
