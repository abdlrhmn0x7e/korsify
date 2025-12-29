import { Logo } from "@/components/logo";
import { Onboarding } from "./_components/onboarding";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/container";
import { TopGrid } from "@/components/top-grid";
import { getScopedI18n } from "@/locales/server";

export default async function OnboardingPage() {
  const t = await getScopedI18n("onboarding");
  const preloadedTeacherQuery = await preloadAuthQuery(
    api.teachers.queries.getTeacher
  );

  if (preloadedTeacherQuery) {
    return redirect("/dashboard");
  }

  return (
    <main className="h-screen">
      <Container className="flex flex-col items-center justify-between h-full py-24">
        <TopGrid />
        <Logo variant="primary" size="xl" />
        <Onboarding />
        <footer>
          <p className="text-sm text-muted-foreground">{t("terms")}</p>
        </footer>
      </Container>
    </main>
  );
}
