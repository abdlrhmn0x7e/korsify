import { Navbar } from "@/components/storefront/navbar";

export default function StorefrontAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
