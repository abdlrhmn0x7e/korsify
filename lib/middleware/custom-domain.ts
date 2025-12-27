import { NextRequest, NextResponse } from "next/server";
import type { ParsedRequest } from "../subdomain";

const CUSTOM_DOMAIN_HEADER = "x-custom-domain";

export function CustomDomainMiddleware(
  req: NextRequest,
  parsed: ParsedRequest
): NextResponse {
  const { domain, path, searchParamsString } = parsed;

  const alreadyRewritten = path.startsWith("/storefront/");
  if (alreadyRewritten) {
    return NextResponse.next();
  }

  const rewritePath = `/storefront/_custom${path}${searchParamsString ? `?${searchParamsString}` : ""}`;
  const response = NextResponse.rewrite(new URL(rewritePath, req.url));
  response.headers.set(CUSTOM_DOMAIN_HEADER, domain);

  return response;
}
