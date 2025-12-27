import { Logo } from "@/components/logo";
import { TopGrid } from "@/components/top-grid";
import { Container } from "@/components/ui/container";
import { getScopedI18n } from "@/locales/server";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getScopedI18n("auth.layout");

  return (
    <main className="h-screen">
      <Container className="flex flex-col items-center justify-between h-full py-24">
        <TopGrid />
        <Logo variant="primary" withText size="xl" />
        {children}
        <footer>
          <p className="text-sm text-muted-foreground">{t("terms")}</p>
        </footer>
      </Container>
    </main>
  );
}
