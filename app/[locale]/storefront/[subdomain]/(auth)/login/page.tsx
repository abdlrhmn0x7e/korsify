import { getCurrentStudent } from "@/lib/student-auth-server";
import { getScopedI18n } from "@/locales/server";
import { redirect } from "next/navigation";
import { LoginForm } from "./_components/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function StorefrontLoginPage() {
  const student = await getCurrentStudent();

  if (student) {
    redirect("/");
  }

  const t = await getScopedI18n("storefront.auth.login");

  return (
    <div className="space-y-4 w-full max-w-sm flex flex-col items-center justify-center">
      <h4 className="text-lg font-medium text-center">{t("title")}</h4>
      <LoginForm />
      <span className="text-muted-foreground text-sm">
        {t("noAccount")}{" "}
        <Button
          variant="link"
          render={<Link href="/signup" />}
          size="sm"
          className="p-0"
        >
          {t("signUp")}
        </Button>
      </span>
    </div>
  );
}
