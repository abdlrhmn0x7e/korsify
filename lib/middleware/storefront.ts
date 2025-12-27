import { NextRequest, NextResponse } from "next/server";
import type { ParsedRequest } from "../subdomain";

const STOREFRONT_HEADER = "x-storefront-subdomain";

export function StorefrontMiddleware(
  req: NextRequest,
  parsed: ParsedRequest
): NextResponse {
  const { subdomain, path, searchParamsString } = parsed;

  if (!subdomain) {
    return NextResponse.next();
  }

  const alreadyRewritten = path.startsWith("/storefront/");
  if (alreadyRewritten) {
    return NextResponse.next();
  }

  const rewritePath = `/storefront/${subdomain}${path}${searchParamsString ? `?${searchParamsString}` : ""}`;
  const response = NextResponse.rewrite(new URL(rewritePath, req.url));
  response.headers.set(STOREFRONT_HEADER, subdomain);

  return response;
}
