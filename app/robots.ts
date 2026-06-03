import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // Only /, /launch/*, /archive/*, and /roadmap are crawlable — everything else (admin, dashboard, profile, unreleased pages) is blocked by default.
      allow: ["/", "/launch/", "/archive/", "/roadmap"],
      disallow: "/",
    },
    sitemap: "https://athenax.co/sitemap.xml",
  };
}
