import { type NextRequest } from "next/server";
import { parse, APP_HOSTNAMES } from "./lib/subdomain";
import { StorefrontMiddleware } from "./lib/middleware/storefront";
import { CustomDomainMiddleware } from "./lib/middleware/custom-domain";
import { AppMiddleware } from "./lib/middleware/app";

export const config = {
  matcher: [
    "/((?!api/|_next/|static/|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};

export async function proxy(req: NextRequest) {
  const parsed = parse(req);

  if (parsed.subdomain) {
    return StorefrontMiddleware(req, parsed);
  }

  if (parsed.isCustomDomain) {
    return CustomDomainMiddleware(req, parsed);
  }

  if (APP_HOSTNAMES.has(parsed.domain)) {
    return AppMiddleware(req, parsed);
  }

  return AppMiddleware(req, parsed);
}
