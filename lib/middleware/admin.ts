import { NextResponse, type NextRequest } from "next/server";
import { fetchAuthQuery } from "../auth-server";
import { api } from "@/convex/_generated/api";
import type { ParsedRequest } from "../subdomain";

export async function AdminGuard(
  req: NextRequest,
  parsed: ParsedRequest,
): Promise<NextResponse | null> {
  const { path } = parsed;
  const user = await fetchAuthQuery(api.auth.getCurrentUser);

  const isAdminRoute = path.startsWith("/admin");
  const isNotAdmin = user?.role !== "admin";

  if (isAdminRoute && isNotAdmin) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  return null;
}
