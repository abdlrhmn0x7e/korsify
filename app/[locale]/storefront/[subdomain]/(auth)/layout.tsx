import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Container } from "@/components/ui/container";

const STOREFRONT_HEADER = "x-storefront-subdomain";
const CUSTOM_DOMAIN_HEADER = "x-custom-domain";

type Teacher = Awaited<
  ReturnType<typeof fetchQuery<typeof api.teachers.queries.getBySubdomain>>
>;

interface StorefrontAuthLayoutProps {
  children: React.ReactNode;
}

async function getTeacherFromHeaders(): Promise<Teacher | null> {
  const headersList = await headers();

  const subdomain = headersList.get(STOREFRONT_HEADER);
  if (subdomain) {
    return fetchQuery(api.teachers.queries.getBySubdomain, { subdomain });
  }

  const customDomain = headersList.get(CUSTOM_DOMAIN_HEADER);
  if (customDomain) {
    return fetchQuery(api.teachers.queries.getByCustomDomain, {
      customDomain,
    });
  }

  return null;
}

export default async function StorefrontAuthLayout({
  children,
}: StorefrontAuthLayoutProps) {
  const teacher = await getTeacherFromHeaders();

  if (!teacher || teacher.status !== "active") {
    notFound();
  }

  const primaryColor = teacher.branding?.primaryColor || "#3b82f6";

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={
        {
          "--storefront-primary": primaryColor,
        } as React.CSSProperties
      }
    >
      <Container className="flex flex-col items-center justify-center py-12">
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
          {teacher.branding?.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={teacher.branding.logoUrl}
              alt={teacher.name}
              className="h-12 w-auto"
            />
          )}
          {!teacher.branding?.logoUrl && (
            <h1 className="text-2xl font-bold">{teacher.name}</h1>
          )}
          {children}
        </div>
      </Container>
    </main>
  );
}
