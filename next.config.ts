import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "mypinx.store" },
      { protocol: "https", hostname: "**.mypinx.store" },
    ],
  },
  async rewrites() {
    return [
      // Same-origin proxy for brand kit downloads so <a download> saves the file instead of opening it
      { source: "/brand/files/:file*", destination: "https://admin-athenax.mypinx.store/logos/brand-logos/:file*" },
    ];
  },
};

export default nextConfig;
