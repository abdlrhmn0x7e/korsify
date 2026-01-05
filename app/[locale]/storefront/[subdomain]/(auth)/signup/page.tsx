import { getCurrentStudent } from "@/lib/student-auth-server";
import { notFound } from "next/navigation";
import { SignUpButton } from "./_components/sign-up-button";

export default async function StorefrontSignupPage() {
  const student = await getCurrentStudent();

  console.log("student", student);

  if (student) {
    return notFound();
  }

  return <SignUpButton />;
}
