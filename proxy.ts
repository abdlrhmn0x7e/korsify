import { NextRequest, NextResponse } from "next/server";
import { parse, ParsedRequest } from "./lib/subdomain";
import { StorefrontTransform } from "./lib/middleware/storefront";
import { CustomDomainTransform } from "./lib/middleware/custom-domain";
import { AdminGuard } from "./lib/middleware/admin";
import { I18nMiddleware } from "./lib/middleware/i18n";
import { RequestTransform } from "./lib/middleware/types";

function resolveTransform(parsed: ParsedRequest): RequestTransform | null {
  return StorefrontTransform(parsed) ?? CustomDomainTransform(parsed);
}

function applyTransform(
  req: NextRequest,
  transform: RequestTransform | null,
): NextRequest {
  if (!transform) return req;
  return new NextRequest(new URL(transform.rewritePath, req.url));
}

function applyHeaders(
  response: NextResponse,
  transform: RequestTransform | null,
): void {
  if (!transform?.headers) return;

  for (const [key, value] of Object.entries(transform.headers)) {
    response.headers.set(key, value);
  }
}

export const config = {
  matcher: ["/((?!api/|_next/|static/|favicon.ico|robots.txt|sitemap.xml).*)"],
};

export async function proxy(req: NextRequest) {
  const parsed = parse(req);

  const adminRedirect = await AdminGuard(req, parsed);
  if (adminRedirect) return adminRedirect;

  const transform = resolveTransform(parsed);
  const trasnformedRequest = applyTransform(req, transform);

  const response = I18nMiddleware(trasnformedRequest);

  applyHeaders(response, transform);

  return response;
}
