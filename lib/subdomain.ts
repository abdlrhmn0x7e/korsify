import { NextRequest } from "next/server";

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "korsify.com";

export const APP_HOSTNAMES = new Set([
  APP_DOMAIN,
  `www.${APP_DOMAIN}`,
  "localhost:3000",
  "localhost",
]);

export const ADMIN_HOSTNAMES = new Set([
  `admin.${APP_DOMAIN}`,
  "admin.localhost:3000",
  "admin.localhost",
]);

export const RESERVED_SUBDOMAINS = new Set([
  "www",
  "api",
  "app",
  "admin",
  "dashboard",
  "mail",
  "email",
  "smtp",
  "ftp",
  "ssh",
  "dns",
  "ns1",
  "ns2",
  "cdn",
  "static",
  "assets",
  "media",
  "images",
  "files",
  "upload",
  "uploads",
  "download",
  "downloads",
  "blog",
  "news",
  "help",
  "support",
  "docs",
  "doc",
  "documentation",
  "status",
  "health",
  "metrics",
  "analytics",
  "stats",
  "staging",
  "dev",
  "development",
  "test",
  "testing",
  "demo",
  "beta",
  "alpha",
  "preview",
  "sandbox",
  "localhost",
  "local",
]);

export interface ParsedRequest {
  domain: string;
  path: string;
  fullPath: string;
  subdomain: string | null;
  searchParams: URLSearchParams;
  searchParamsString: string;
  isCustomDomain: boolean;
}

export function parse(req: NextRequest): ParsedRequest {
  let domain = req.headers.get("host") || "";
  const path = req.nextUrl.pathname;

  domain = domain.replace(/^www\./, "").toLowerCase();

  const searchParams = req.nextUrl.searchParams;
  const searchParamsString = searchParams.toString();
  const fullPath = searchParamsString ? `${path}?${searchParamsString}` : path;

  const subdomain = extractSubdomain(domain);

  const isCustomDomain =
    !APP_HOSTNAMES.has(domain) &&
    !ADMIN_HOSTNAMES.has(domain) &&
    subdomain === null &&
    domain !== APP_DOMAIN;

  return {
    domain,
    path,
    fullPath,
    subdomain,
    searchParams,
    searchParamsString,
    isCustomDomain,
  };
}

function extractSubdomain(hostname: string): string | null {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "korsify.com";
  const hostWithoutPort = hostname.split(":")[0];

  if (hostWithoutPort.endsWith(".localhost")) {
    const subdomain = hostWithoutPort.replace(".localhost", "");
    if (subdomain && !RESERVED_SUBDOMAINS.has(subdomain)) {
      return subdomain;
    }
    return null;
  }

  const isAppDomainSubdomain = hostWithoutPort.endsWith(`.${appDomain}`);
  if (!isAppDomainSubdomain) {
    return null;
  }

  const subdomain = hostWithoutPort.slice(0, -`.${appDomain}`.length);

  const isInvalidSubdomain = !subdomain || subdomain.includes(".");
  if (isInvalidSubdomain) {
    return null;
  }

  if (RESERVED_SUBDOMAINS.has(subdomain.toLowerCase())) {
    return null;
  }

  return subdomain.toLowerCase();
}

export function isReservedSubdomain(subdomain: string): boolean {
  return RESERVED_SUBDOMAINS.has(subdomain.toLowerCase());
}

export function getReservedSubdomains(): ReadonlySet<string> {
  return RESERVED_SUBDOMAINS;
}
