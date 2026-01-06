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
import { getScopedI18n, getStaticParams } from "@/locales/server";
import { IconHome } from "@tabler/icons-react";
import { fetchMutation } from "convex/nextjs";
import { setStaticParamsLocale } from "next-international/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export function generateStaticParams() {
  return getStaticParams();
}

export default async function SignUpRedirectPage(
  props: PageProps<"/[locale]/signup/redirect">
) {
  const { locale } = await props.params;
  setStaticParamsLocale(locale);
  const t = await getScopedI18n("auth.redirect");

  return (
    <Suspense fallback={<VerifyAccessTokenLoader t={t} />}>
      <VerifyAccessToken {...props} t={t} />
    </Suspense>
  );
}

type TranslationFn = Awaited<ReturnType<typeof getScopedI18n<"auth.redirect">>>;

function VerifyAccessTokenLoader({ t }: { t: TranslationFn }) {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
        <EmptyTitle>{t("verifying.title")}</EmptyTitle>
        <EmptyDescription>{t("verifying.description")}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

async function VerifyAccessToken(
  props: PageProps<"/[locale]/signup/redirect"> & { t: TranslationFn }
) {
  const { t } = props;
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

        <h1>{t("error.title")}</h1>

        <p className="text-muted-foreground">{t("error.description")}</p>

        <Button render={<Link href="/" />} size="xl">
          <IconHome className="size-4" />
          {t("error.goHome")}
        </Button>
      </div>
    );
  }

  return redirect("/");
}
