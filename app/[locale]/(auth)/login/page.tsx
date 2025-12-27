import { getCurrentUser } from "@/lib/auth-server";
import { notFound } from "next/navigation";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    return notFound();
  }

  return <div>LoginPage</div>;
}
