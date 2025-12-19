import Link from "next/link";
import { Suspense } from "react";
import { CurrentYear } from "./ui/current-year";

export function Footer() {
  return (
    <footer className="relative pt-16 pb-24 md:py-16 border-t">
      <div className="mx-auto max-w-5xl px-6 flex flex-col items-center justify-center gap-4">
        <Link
          href="/"
          aria-label="go home"
          className="mx-auto size-fit flex items-center justify-center gap-2"
        >
          <span className="font-serif text-zinc-700 text-2xl font-medium">
            Korsify
          </span>
        </Link>

        <span className="text-muted-foreground block text-center text-sm">
          ©{" "}
          <Suspense>
            <CurrentYear />
          </Suspense>{" "}
          Korsify, All rights reserved
        </span>
      </div>
    </footer>
  );
}
