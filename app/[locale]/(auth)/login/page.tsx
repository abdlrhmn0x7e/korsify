import { getCurrentUser } from "@/lib/auth-server";
import { getScopedI18n } from "@/locales/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LoginButton } from "./_components/login-button";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    return notFound();
  }

  const t = await getScopedI18n("auth.login");

  return (
    <div className="space-y-4 min-w-96 text-center">
      <h4>{t("title")}</h4>

      <LoginButton />

      <span className="text-muted-foreground">
        {t("noAccount")}{" "}
        <Button
          variant="link"
          render={<Link href="/" />}
          size="sm"
          className="p-0"
        >
          {t("requestEarlyAccess")}
        </Button>
      </span>
    </div>
  );
}
