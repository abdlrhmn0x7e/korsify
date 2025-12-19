"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import Link from "next/link";
import { Container } from "./ui/container";
import { IconArrowRight } from "@tabler/icons-react";

export function Navbar({}) {
  const scrolled = useScroll(0);

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
          <span className="font-serif text-zinc-700 text-2xl font-medium">
            Korsify
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Button nativeButton={false} render={<Link href="#" />}>
            Log in
            <IconArrowRight />
          </Button>
        </div>
      </Container>
    </header>
  );
}
