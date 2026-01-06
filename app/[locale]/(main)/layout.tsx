import { ConvexClientProvider } from "@/components/convex-client-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
