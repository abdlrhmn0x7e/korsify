import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

const STOREFRONT_HEADER = "x-storefront-subdomain";
const CUSTOM_DOMAIN_HEADER = "x-custom-domain";

type Teacher = Awaited<
  ReturnType<typeof fetchQuery<typeof api.teachers.queries.getBySubdomain>>
>;

interface StorefrontLayoutProps {
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

export default async function StorefrontLayout({
  children,
}: StorefrontLayoutProps) {
  const teacher = await getTeacherFromHeaders();

  if (!teacher || teacher.status !== "active") {
    notFound();
  }

  const primaryColor = teacher.branding?.primaryColor || "#3b82f6";

  return (
    <div
      className="min-h-screen"
      style={
        {
          "--storefront-primary": primaryColor,
        } as React.CSSProperties
      }
    >
      <StorefrontHeader teacher={teacher} />
      <main>{children}</main>
    </div>
  );
}

function StorefrontHeader({ teacher }: { teacher: NonNullable<Teacher> }) {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {teacher.branding?.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={teacher.branding.logoUrl}
              alt={teacher.name}
              className="h-8 w-auto"
            />
          )}
          <span className="font-semibold">{teacher.name}</span>
        </div>
        <nav className="flex items-center gap-4">
          {/*eslint-disable-next-line @next/next/no-html-link-for-pages*/}
          <a href="/" className="text-sm hover:underline">
            Home
          </a>
          {/*eslint-disable-next-line @next/next/no-html-link-for-pages*/}
          <a href="/courses" className="text-sm hover:underline">
            Courses
          </a>
        </nav>
      </div>
    </header>
  );
}
