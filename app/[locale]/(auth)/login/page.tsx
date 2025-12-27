import { getCurrentUser } from "@/lib/auth-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LoginButton } from "./_components/login-button";
import { Button } from "@/components/ui/button";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    return notFound();
  }

  return (
    <div className="space-y-4 min-w-96 text-center">
      <h4>Log in to your Korsify account</h4>

      <LoginButton />

      <span className="text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Button
          variant="link"
          render={<Link href="/" />}
          size="sm"
          className="p-0"
        >
          Request early access
        </Button>
      </span>
    </div>
  );
}
