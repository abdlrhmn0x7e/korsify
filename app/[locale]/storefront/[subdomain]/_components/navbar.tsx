"use client";

import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LocaleSwitcherSelect } from "@/components/locale-switcher";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProfileDropdown } from "./profile-dropdown";
import { Button } from "@/components/ui/button";
import { DirectedArrow } from "@/components/directed-arrow";
import { useScopedI18n } from "@/locales/client";
import { useTeacher } from "./teacher-context-provider";
import { StorefrontLogo } from "./storefront-logo";

export function Navbar() {
  const scrolled = useScroll(0);
  const student = useQuery(api.studentAuth.getCurrentStudent);
  const teacher = useTeacher();

  const t = useScopedI18n("landing.navbar");

  const isLoggedIn = !!student;

  return (
    <header
      className={cn(
        "sticky top-0 z-10 mx-px transition-all duration-300",
        scrolled && "bg-background/90 backdrop-blur-sm"
      )}
    >
      {/* Bottom border when scrolled */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 h-px bg-border opacity-0 transition-opacity duration-300 mask-[linear-gradient(90deg,transparent,black,transparent)]",
          scrolled && "opacity-100"
        )}
      />

      <Container className="flex items-center justify-between py-4">
        <Link href="/">
          <StorefrontLogo
            logoUrl={teacher.branding?.logoUrl}
            name={teacher.name}
          />
        </Link>

        <div className="flex items-center gap-2">
          <LocaleSwitcherSelect />
          {isLoggedIn ? (
            <>
              <ProfileDropdown
                name={student.name}
                email={student.email}
                photoUrl={student.image ?? ""}
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
