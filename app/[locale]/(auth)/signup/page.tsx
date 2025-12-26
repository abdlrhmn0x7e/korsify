import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { preloadAuthQuery } from "@/lib/auth-server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SignupButton } from "./_components/signup-button";

export default async function SignupPage({
  searchParams,
}: PageProps<"/[locale]/signup">) {
  const { token } = await searchParams;
  if (!token || typeof token !== "string") {
    return notFound();
  }

  const isTokenValid = await preloadAuthQuery(
    api.earlyAccess.accessTokens.verifyToken,
    {
      token,
    }
  );
  if (!isTokenValid) {
    return notFound();
  }

  return (
    <div className="space-y-4 min-w-96 text-center">
      <h4>Create your Korsify account</h4>

      <SignupButton />

      <span className="text-muted-foreground">
        Already have an account?{" "}
        <Button
          variant="link"
          render={<Link href="/login" />}
          size="sm"
          className="p-0"
        >
          Log in
        </Button>
      </span>
    </div>
  );
}
