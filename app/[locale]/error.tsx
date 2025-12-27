"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { TopGrid } from "@/components/top-grid";
import { useI18n } from "@/locales/client";
import { IconHome, IconRefresh } from "@tabler/icons-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useI18n();

  return (
    <Container className="h-screen w-screen flex flex-col items-center justify-center">
      <TopGrid />

      <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-md">
        <div className="text-9xl font-bold text-primary">500</div>

        <h1>{t("globalError.title")}</h1>

        <p className="text-muted-foreground">{t("globalError.description")}</p>

        <div className="flex gap-3">
          <Button variant="outline" onClick={() => reset()} size="xl">
            <IconRefresh className="size-4" />
            {t("globalError.tryAgain")}
          </Button>
          <Button onClick={() => (window.location.href = "/")} size="xl">
            <IconHome className="size-4" />
            {t("globalError.goHome")}
          </Button>
        </div>
      </div>
    </Container>
  );
}
