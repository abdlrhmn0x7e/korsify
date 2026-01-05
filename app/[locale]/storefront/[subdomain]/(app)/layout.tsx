import { Navbar } from "@storefront/_components/navbar";

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
