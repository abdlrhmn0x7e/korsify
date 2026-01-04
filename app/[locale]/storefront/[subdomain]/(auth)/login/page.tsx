import { getTeacherFromHeaders } from "@/lib/student-auth-server";
import { getScopedI18n } from "@/locales/server";
import { notFound } from "next/navigation";
import { StudentLoginButton } from "./_components/student-login-button";

export default async function StorefrontLoginPage() {
  const teacher = await getTeacherFromHeaders();

  if (!teacher || teacher.status !== "active") {
    notFound();
  }

  const t = await getScopedI18n("auth.login");

  return (
    <div className="space-y-4 w-full text-center">
      <h4 className="text-xl font-semibold">{t("title")}</h4>
      <p className="text-muted-foreground text-sm">
        Sign in to access courses from {teacher.name}
      </p>
      <StudentLoginButton teacherId={teacher._id} />
    </div>
  );
}
