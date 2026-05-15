import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "mypinx.store" },
      { protocol: "https", hostname: "**.mypinx.store" },
    ],
  },
};

export default nextConfig;
