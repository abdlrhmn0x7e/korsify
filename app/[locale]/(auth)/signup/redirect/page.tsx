import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { getCurrentUser } from "@/lib/auth-server";
import { IconHome } from "@tabler/icons-react";
import { fetchMutation } from "convex/nextjs";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default function SignUpRedirectPage(
  props: PageProps<"/[locale]/signup/redirect">
) {
  return (
    <Suspense fallback={<VerifyAccessTokenLoader />}>
      <VerifyAccessToken {...props} />
    </Suspense>
  );
}

function VerifyAccessTokenLoader() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>Verifying your access token</EmptyTitle>
        <EmptyDescription>
          Please wait while we verify your access token. Do not refresh the
          page.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

async function VerifyAccessToken(
  props: PageProps<"/[locale]/signup/redirect">
) {
  const [{ token }, user] = await Promise.all([
    props.searchParams,
    getCurrentUser(),
  ]);
  if (!token || typeof token !== "string") {
    return notFound();
  }

  if (!user) {
    return notFound();
  }

  try {
    await fetchMutation(api.earlyAccess.accessTokens.claim, {
      accessToken: token,
      userId: user._id,
    });
  } catch {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-3 max-w-md">
        <div className="text-9xl font-bold text-primary"></div>

        <h1>Something went wrong!</h1>

        <p className="text-muted-foreground">Please try again later.</p>

        <Button render={<Link href="/" />} size="xl">
          <IconHome className="size-4" />
          Go home
        </Button>
      </div>
    );
  }

  return redirect("/");
}
