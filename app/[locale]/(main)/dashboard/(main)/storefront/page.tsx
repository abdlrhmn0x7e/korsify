import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { PageLayout } from "@/components/dashboard/page-layout";
import { PageHeader } from "@/components/dashboard/page-header";
import { IconBuildingStore, IconLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { StorefrontProvider } from "./_components/builder/storefront-context";
import { BuilderLayout } from "./_components/builder/builder-layout";
import { SaveStatus } from "./_components/save-status";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function StorefrontBuilderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

  const teacher = await fetchAuthQuery(api.teachers.queries.getTeacher);
  if (!teacher) return redirect("/dashboard/onboarding");

  return (
    <StorefrontProvider>
      <PageLayout>
        <PageHeader
          Icon={IconBuildingStore}
          title="Customize your storefront homepage"
        >
          <div className="flex items-center gap-4">
            <SaveStatus />
            <Button
              variant="outline"
              render={
                <a
                  href={`http://${teacher.subdomain}.localhost:3000`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <IconLink className="mr-2 h-4 w-4" />
              View Live
            </Button>
          </div>
        </PageHeader>

        <BuilderLayout />
      </PageLayout>
    </StorefrontProvider>
  );
}
