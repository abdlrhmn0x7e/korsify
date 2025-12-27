import type { ParsedRequest } from "../subdomain";
import { RequestTransform } from "./types";

const STOREFRONT_HEADER = "x-storefront-subdomain";

export function StorefrontTransform(
  parsed: ParsedRequest,
): RequestTransform | null {
  const { subdomain, path, fullPath } = parsed;

  if (!subdomain || path.startsWith("/storefront/")) {
    return null;
  }

  return {
    rewritePath: `/storefront/${subdomain}${fullPath}`,
    headers: {
      [STOREFRONT_HEADER]: subdomain,
    },
  };
}
