"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TopGrid } from "@/components/top-grid";
import { useI18n } from "@/locales/client";
import { IconArrowLeft, IconHome } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const t = useI18n();
  const router = useRouter();

  return (
    <Container className="h-screen w-screen flex flex-col items-center justify-center">
      <TopGrid />

      <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-md">
        <div className="text-9xl font-bold text-primary">404</div>

        <h1>{t("notFound.title")}</h1>

        <p className="text-muted-foreground">{t("notFound.description")}</p>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.back()} size="xl">
            <IconArrowLeft className="size-4" />
            {t("notFound.goBack")}
          </Button>
          <Button render={<Link href="/" />} size="xl">
            <IconHome className="size-4" />
            {t("notFound.goHome")}
          </Button>
        </div>
      </div>
    </Container>
  );
}
