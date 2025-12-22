"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import Link from "next/link";
import { Container } from "./ui/container";
import { IconArrowRight } from "@tabler/icons-react";
import { LocaleSwitcherSelect } from "./locale-switcher";
import { useTranslations } from "next-intl";
import { Logo } from "./logo";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "./ui/spinner";
import { ProfileDropdown } from "./profile-dropdown";

export function Navbar() {
  const scrolled = useScroll(0);
  const t = useTranslations("navbar");

  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user.role === "admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-10 mx-px  transition-all duration-300",
        scrolled && "bg-white/90 backdrop-blur-sm",
      )}
    >
      {/* Bottom border when scrolled */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-px bg-neutral-200 opacity-0 transition-opacity duration-300 mask-[linear-gradient(90deg,transparent,black,transparent)]",
          scrolled && "opacity-100",
        )}
      />

      <Container className="flex items-center justify-between py-4">
        <Link href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-2">
          <LocaleSwitcherSelect />
          {isPending ? (
            <Spinner />
          ) : isLoggedIn ? (
            <ProfileDropdown
              name={session.user.name}
              email={session.user.email}
              photoUrl={session.user.image ?? ""}
            />
          ) : (
            <Button>
              {t("logIn")}
              <IconArrowRight />
            </Button>
          )}
          {isAdmin && (
            <Button nativeButton={false} render={<Link href="/admin" />}>
              Dashboard
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
}
