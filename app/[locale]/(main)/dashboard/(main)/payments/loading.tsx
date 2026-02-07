import { PageHeader } from "@/components/dashboard/page-header";
import { IconCreditCard } from "@tabler/icons-react";
import { PageLayout } from "@/components/dashboard/page-layout";
import { WholePageSpinner } from "@/components/whole-page-spinner";

export default function CoursesPageLoading() {
  return (
    <PageLayout>
      <PageHeader title="Payments" Icon={IconCreditCard}></PageHeader>

      <WholePageSpinner />
    </PageLayout>
  );
}
