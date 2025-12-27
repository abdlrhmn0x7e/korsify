import { Logo } from "@/components/logo";
import { TopGrid } from "@/components/top-grid";
import { Container } from "@/components/ui/container";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen">
      <Container className="flex flex-col items-center justify-between h-full py-24">
        <TopGrid />
        <Logo variant="primary" withText size="xl" />
        {children}
        <footer>
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to Korsify’s Terms of Service and Privacy
            Policy
          </p>
        </footer>
      </Container>
    </main>
  );
}
