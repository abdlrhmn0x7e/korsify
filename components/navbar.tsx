"use client";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import Link from "next/link";
import { Container } from "./ui/container";
import { LocaleSwitcherSelect } from "./locale-switcher";
import { Logo } from "./logo";
import { useTranslations } from "next-intl";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProfileDropdown } from "./profile-dropdown";
import { Button } from "./ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const scrolled = useScroll(0);
  const t = useTranslations("navbar");
  const user = useQuery(api.auth.getCurrentUser);

  const isLoggedIn = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-10 mx-px  transition-all duration-300",
        scrolled && "bg-white/90 backdrop-blur-sm"
      )}
    >
      {/* Bottom border when scrolled */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-px bg-neutral-200 opacity-0 transition-opacity duration-300 mask-[linear-gradient(90deg,transparent,black,transparent)]",
          scrolled && "opacity-100"
        )}
      />

      <Container className="flex items-center justify-between py-4">
        <Link href="/">
          <Logo variant="primary" withText />
        </Link>

        <div className="flex items-center gap-2">
          <LocaleSwitcherSelect />
          {isLoggedIn ? (
            <ProfileDropdown
              name={user.name}
              email={user.email}
              photoUrl={user.image ?? ""}
            />
          ) : (
            <Button
              onClick={() =>
                authClient.signIn.email({
                  email: "test@test.com",
                  password: "test",
                })
              }
            >
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
