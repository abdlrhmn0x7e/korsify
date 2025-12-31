import "./env";
import { NextConfig } from "next";
import { env } from "./env";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: env.NEXT_PUBLIC_CONVEX_URL.replace(/^https?:\/\//, ""),
      },
    ],
  },
};

export default nextConfig;
