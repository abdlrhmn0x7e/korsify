"use client";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import Link from "next/link";
import { Container } from "./ui/container";
import { LocaleSwitcherSelect } from "./locale-switcher";
import { Logo } from "./logo";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProfileDropdown } from "./profile-dropdown";
import { Button } from "./ui/button";
import { DirectedArrow } from "./directed-arrow";
import { useScopedI18n } from "@/locales/client";

export function Navbar() {
  const scrolled = useScroll(0);
  const user = useQuery(api.auth.getCurrentUser);
  const t = useScopedI18n("landing.navbar");

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
        <Logo variant="primary" withText />

        <div className="flex items-center gap-2">
          <LocaleSwitcherSelect />
          {isAdmin && (
            <Button render={<Link href="/admin" />} variant="ghost">
              {t("admin")}
            </Button>
          )}
          {isLoggedIn ? (
            <>
              <Button render={<Link href="/dashboard" />}>
                {t("dashboard")}
              </Button>
              <ProfileDropdown
                name={user.name}
                email={user.email}
                photoUrl={user.image ?? ""}
              />
            </>
          ) : (
            <Button render={<Link href="/login" />}>
              {t("login")}
              <DirectedArrow />
            </Button>
          )}
        </div>
      </Container>
    </header>
  );
}
