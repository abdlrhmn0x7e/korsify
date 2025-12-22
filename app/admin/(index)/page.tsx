import { requireAdmin } from "@/lib/auth-server";

export default async function AdminPage() {
  await requireAdmin();

  return <section>admin</section>;
}
