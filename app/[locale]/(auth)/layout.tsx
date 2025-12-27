import { Logo } from "@/components/logo";
import { TopGrid } from "@/components/top-grid";
import { Container } from "@/components/ui/container";
import { getScopedI18n, getStaticParams } from "@/locales/server";
import { setStaticParamsLocale } from "next-international/server";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function AuthLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  setStaticParamsLocale(locale);

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
