import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { getCurrentUser, preloadAuthQuery } from "@/lib/auth-server";
import { getScopedI18n } from "@/locales/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignupButton } from "./_components/signup-button";

export default async function SignupPage({
  searchParams,
}: PageProps<"/[locale]/signup">) {
  const user = await getCurrentUser();
  if (user) {
    return notFound();
  }

  const { token } = await searchParams;
  if (!token || typeof token !== "string") {
    return notFound();
  }

  const isTokenValid = await preloadAuthQuery(
    api.earlyAccess.accessTokens.verify,
    {
      accessToken: token,
    }
  );
  if (!isTokenValid) {
    return notFound();
  }

  const t = await getScopedI18n("auth.signup");

  return (
    <div className="space-y-4 min-w-96 text-center">
      <h4>{t("title")}</h4>

      <SignupButton token={token} />

      <span className="text-muted-foreground">
        {t("hasAccount")}{" "}
        <Button
          variant="link"
          render={<Link href="/login" />}
          size="sm"
          className="p-0"
        >
          {t("login")}
        </Button>
      </span>
    </div>
  );
}
