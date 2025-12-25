import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="relative pt-16 pb-24 md:py-16 border-t">
      <div className="mx-auto max-w-5xl px-6 flex flex-col items-center justify-center gap-4">
        <Logo layout="vertical" />

        <span className="text-muted-foreground block text-center text-sm">
          © {new Date().getFullYear()} Korsify, All rights reserved.
        </span>
      </div>
    </footer>
  );
}
