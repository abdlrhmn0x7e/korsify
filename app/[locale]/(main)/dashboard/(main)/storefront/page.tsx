import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { redirect } from "next/navigation";
import { getStaticParams, getScopedI18n } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";
import { StorefrontBuilder } from "./_components/builder/storefront-builder";

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

  return <StorefrontBuilder teacher={teacher} />;
}
