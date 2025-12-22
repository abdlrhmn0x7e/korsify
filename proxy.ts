import { NextResponse, type NextRequest } from "next/server";
import { fetchAuthQuery } from "./lib/auth-server";
import { api } from "./convex/_generated/api";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const user = await fetchAuthQuery(api.auth.getCurrentUser);

  // Return not found if the user trying to access an admin route without proper authentication
  if (user.role !== "admin" && path.startsWith("/admin")) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/admin/:path*",
};
