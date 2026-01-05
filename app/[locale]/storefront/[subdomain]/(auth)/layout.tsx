"use client";

import { Container } from "@/components/ui/container";
import { TopGrid } from "@/components/top-grid";
import { useTeacher } from "../_components/teacher-context-provider";
import Link from "next/link";
import { StorefrontLogo } from "../_components/storefront-logo";

interface StorefrontAuthLayoutProps {
  children: React.ReactNode;
}

export default function StorefrontAuthLayout({
  children,
}: StorefrontAuthLayoutProps) {
  const teacher = useTeacher();

  return (
    <main className="h-screen">
      <Container className="flex flex-col items-center justify-between h-full py-24">
        <TopGrid />
        <Link href="/">
          <StorefrontLogo
            logoUrl={teacher.branding?.logoUrl}
            name={teacher.name}
          />
        </Link>
        {children}
        <footer>
          <p className="text-sm text-muted-foreground text-center">
            {teacher.name}
          </p>
        </footer>
      </Container>
    </main>
  );
}
