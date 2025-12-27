import type { ParsedRequest } from "../subdomain";
import { RequestTransform } from "./types";

const CUSTOM_DOMAIN_HEADER = "x-custom-domain";

export function CustomDomainTransform(
  parsed: ParsedRequest,
): RequestTransform | null {
  const { domain, path, isCustomDomain, searchParamsString } = parsed;

  if (!isCustomDomain || path.startsWith("/storefront/")) {
    return null;
  }

  return {
    rewritePath: `/storefront/_custom${path}${searchParamsString ? `?${searchParamsString}` : ""}`,
    headers: {
      [CUSTOM_DOMAIN_HEADER]: domain,
    },
  };
}
