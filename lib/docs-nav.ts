const DOCS_PAGES = [
  {
    id: "docs",
    label: "Overview",
    href: "/docs",
    title: "Documentation",
    subtitle: "Everything you need to know about AthenaX.",
    fileTag: "/root/docs",
  },
  {
    id: "docs-researchers",
    label: "For Researchers",
    href: "/docs/researchers",
    title: "For Researchers",
    subtitle: "Get paid to do research.",
    fileTag: "/root/docs/researchers",
  },
  {
    id: "docs-protocols",
    label: "For Protocols",
    href: "/docs/protocols",
    title: "For Protocols",
    subtitle: "Fund research that matters.",
    fileTag: "/root/docs/protocols",
  },
  {
    id: "docs-builders",
    label: "For Builders",
    href: "/docs/builders",
    title: "For Builders",
    subtitle: "Turn research into products.",
    fileTag: "/root/docs/builders",
  },
  {
    id: "docs-standards",
    label: "ARS Standards",
    href: "/docs/standards",
    title: "ARS Standards",
    subtitle: "How reputation is calculated.",
    fileTag: "/root/docs/ars-standards",
  },
  {
    id: "docs-governance",
    label: "Governance",
    href: "/docs/governance",
    title: "Governance",
    subtitle: "How decisions get made.",
    fileTag: "/root/docs/governance",
  },
  {
    id: "docs-media",
    label: "Media Kit",
    href: "/docs/media",
    title: "Media Kit",
    subtitle: "Press-ready assets, voice notes, and brand usage for partners, media, and ecosystem teams.",
    fileTag: "/root/docs/media-kit",
  },
] as const;

export const DOCS_NAV = DOCS_PAGES.map(({ id, label, href }) => ({ id, label, href }));

type DocsMeta = {
  current: (typeof DOCS_PAGES)[number]["id"];
  title: string;
  subtitle: string;
  fileTag: string;
};

export const DOCS_META_BY_PATH: Record<string, DocsMeta> = Object.fromEntries(
  DOCS_PAGES.map(({ id, href, title, subtitle, fileTag }) => [
    href,
    {
      current: id,
      title,
      subtitle,
      fileTag,
    },
  ])
);
