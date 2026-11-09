import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/lib";
import CopyBoilerplate from "./CopyBoilerplate";

const TITLE = "Brand Kit | AthenaX";
const DESCRIPTION = "AthenaX logos, colours, typography, usage rules and press boilerplate.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/brand" },
  openGraph: { title: TITLE, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const LOGO_FILES_URL = "https://drive.google.com/drive/folders/1Kgwr7FcRINPQWIcKKgdCRPX42enhPTqL?usp=sharing";
const SVG_URL = "https://drive.google.com/drive/folders/1lxgL-evpDPnYtw1VbCnN9ZLuONRPyg0I";
const PNG_URL = "https://drive.google.com/drive/folders/1EoW4PA7D7QVv6VYi9YuWluzaprHcKipm";
const CONTACT_EMAIL = "social@athenax.co";
const BOILERPLATE =
  "AthenaX is a discovery platform for frontier products — where research-backed products become visible, founders submit and builders connect.";

const LOGO_BASE = "https://admin-athenax.mypinx.store/logos/brand-logos";
const LOGO = {
  lockupDark: `${LOGO_BASE}/athenax-lockup-dark.png`,
  lockupWhite: `${LOGO_BASE}/athenax-lockup-white.png`,
  iconDark: `${LOGO_BASE}/athenax-icon-dark.png`,
  iconWhite: `${LOGO_BASE}/athenax-icon-white.png`,
  wordmarkDark: `${LOGO_BASE}/athenax-wordmark-dark.png`,
};

const MONO = "font-['Space_Mono',monospace]";
const LABEL = cn(MONO, "text-xs tracking-[0.1em] text-[#5B5B69]");
const TEXT_LINK = cn(MONO, "inline-flex min-h-8 items-center text-xs text-[#1C1C27] underline decoration-[#A8A398] underline-offset-4 hover:text-[#1C1C27]");
const LIGHT_TILE = "rounded-2xl border border-[#E3DED5] bg-[#FBFAF7]";

/* ---------- small pieces ---------- */

const ExtLink = ({ href, className, children }: { href: string; className?: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
  </a>
);

const DownloadLinks = () => (
  <span className="flex gap-5">
    <ExtLink href={SVG_URL} className={TEXT_LINK}>
      SVG ↓
    </ExtLink>
    <ExtLink href={PNG_URL} className={TEXT_LINK}>
      PNG ↓
    </ExtLink>
  </span>
);

const CheckBadge = () => (
  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1C1C27]">
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  </span>
);

const CrossBadge = () => (
  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#E8323C]">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  </span>
);

const SectionHeader = ({ title, intro }: { title: string; intro: string }) => (
  <div className="flex flex-wrap items-start justify-between gap-x-16 gap-y-5 border-t border-[#C9C3B8] pt-14">
    <h2 className="m-0 text-[34px] leading-[1.05] font-bold tracking-[-0.025em] sm:text-[42px]">{title}</h2>
    <p className="m-0 flex-[0_1_440px] text-base leading-[1.6] text-[#4F4F5E]">{intro}</p>
  </div>
);

const SubTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="mt-14 mb-0 text-[22px] font-bold tracking-[-0.01em]">{children}</h3>
);

/* ---------- data ---------- */

const LOGO_ROWS = [
  { tone: "light", bg: "bg-white border border-[#E3DED5]", lockup: LOGO.lockupDark, icon: LOGO.iconDark },
  { tone: "dark", bg: "bg-[#1C1C27]", lockup: LOGO.lockupWhite, icon: LOGO.iconWhite },
] as const;

const CORE_COLOURS = [
  { name: "Paper", role: "Backgrounds", hex: "#F2EFE9", rgb: "242 239 233", border: true },
  { name: "Ink", role: "Text, logo, dark surfaces", hex: "#1C1C27", rgb: "28 28 39" },
  { name: "Slate", role: "Secondary text", hex: "#6B6B7A", rgb: "107 107 122" },
];

const ACCENT_COLOURS = [
  { name: "Signal Red", role: "Accent — one key word or detail", hex: "#E8323C", rgb: "232 50 60" },
  { name: "Yellow", role: "Highlights and tags", hex: "#F5D94E", rgb: "245 217 78" },
];

const BALANCE = [
  { name: "Paper", pct: 60, color: "#F2EFE9" },
  { name: "Ink", pct: 25, color: "#1C1C27" },
  { name: "Slate", pct: 10, color: "#6B6B7A" },
  { name: "Red", pct: 3, color: "#E8323C" },
  { name: "Yellow", pct: 2, color: "#F5D94E" },
];

const TYPE_SCALE = [
  { sample: "Where New Products Begin", spec: "DISPLAY · BOLD · 48–70", className: "text-[36px] sm:text-[52px] font-bold leading-none tracking-[-0.03em]", pad: "py-7" },
  { sample: "Research-backed products", spec: "HEADING · BOLD · 28–40", className: "text-[28px] sm:text-[32px] font-bold leading-[1.1] tracking-[-0.02em]", pad: "py-6" },
  { sample: "Founders submit. Builders connect.", spec: "BODY · REGULAR · 16–18", className: "text-[17px] leading-[1.55]", pad: "py-6" },
  { sample: "EXPLORE ATHENAX", spec: "LABEL · MONO · 11–13 · CAPS", className: cn(MONO, "text-xs tracking-[0.1em]"), pad: "pt-6" },
];

const LOGO_BACKGROUNDS = [
  { label: "Dark logo on Paper", tile: "bg-[#F2EFE9] border border-[#D6D0C5]", src: LOGO.lockupDark },
  { label: "Dark logo on white", tile: "bg-white border border-[#E3DED5]", src: LOGO.lockupDark },
  { label: "White logo on Ink", tile: "bg-[#1C1C27]", src: LOGO.lockupWhite },
];

const recolourMask: CSSProperties = {
  WebkitMask: `url(${LOGO.iconDark}) center/contain no-repeat`,
  mask: `url(${LOGO.iconDark}) center/contain no-repeat`,
  background: "#E8323C",
};

const busyPattern: CSSProperties = {
  background:
    "repeating-linear-gradient(45deg, rgba(28,28,39,0.55) 0 5px, transparent 5px 13px), repeating-linear-gradient(-45deg, rgba(232,50,60,0.45) 0 5px, transparent 5px 13px), #F5D94E",
};

const AVOID: { label: string; tile?: string; style?: CSSProperties; content: ReactNode }[] = [
  {
    label: "Don’t stretch or squash",
    content: <img src={LOGO.lockupDark} alt="Logo stretched" className="block h-auto w-[150px] scale-x-[1.45]" />,
  },
  {
    label: "Don’t rotate",
    content: <img src={LOGO.lockupDark} alt="Logo rotated" className="block h-auto w-[170px] -rotate-[18deg]" />,
  },
  {
    label: "Don’t recolour",
    content: <div role="img" aria-label="Icon recoloured red" className="h-[62px] w-24" style={recolourMask} />,
  },
  {
    label: "Don’t add shadows, glows or 3D",
    content: (
      <img
        src={LOGO.lockupDark}
        alt="Logo with shadow and glow"
        className="block h-auto w-[170px]"
        style={{ filter: "drop-shadow(5px 6px 0 #F5D94E) drop-shadow(0 0 14px rgba(232,50,60,0.55))" }}
      />
    ),
  },
  {
    label: "Don’t add outlines",
    content: (
      <img
        src={LOGO.lockupDark}
        alt="Logo with outline"
        className="block h-auto w-[170px]"
        style={{
          filter: "drop-shadow(2px 0 0 #E8323C) drop-shadow(-2px 0 0 #E8323C) drop-shadow(0 2px 0 #E8323C) drop-shadow(0 -2px 0 #E8323C)",
        }}
      />
    ),
  },
  {
    label: "Don’t rearrange or resize parts",
    content: (
      <span className="flex items-center gap-2.5">
        <img src={LOGO.wordmarkDark} alt="Wordmark placed before the icon" className="block h-[22px] w-auto" />
        <img src={LOGO.iconDark} alt="" className="block h-[52px] w-auto" />
      </span>
    ),
  },
  {
    label: "Don’t place on busy patterns or photos",
    tile: "rounded-2xl",
    style: busyPattern,
    content: <img src={LOGO.lockupDark} alt="Logo on a busy pattern" className="block h-auto w-[170px]" />,
  },
  {
    label: "Don’t use low-contrast pairings",
    tile: "rounded-2xl bg-[#3A3A48]",
    content: <img src={LOGO.lockupDark} alt="Dark logo on a dark background" className="block h-auto w-[170px]" />,
  },
];

const NAME_SPELLINGS = [
  { text: "AthenaX", ok: true },
  { text: "Athenax", ok: false },
  { text: "Athena X", ok: false },
  { text: "ATHENAX", ok: false },
];

const SOCIALS = [
  { name: "X", handle: "@athenax_co", href: "https://x.com/athenax_co" },
  { name: "Discord", handle: "Join the server", href: "https://discord.com/invite/RURu4tTjHZ" },
  { name: "YouTube", handle: "@AthenaX_co", href: "https://www.youtube.com/@AthenaX_co" },
  { name: "LinkedIn", handle: "athenaxco", href: "https://www.linkedin.com/company/athenaxco/" },
  { name: "Instagram", handle: "@athenax_co", href: "https://www.instagram.com/athenax_co/" },
];

/* ---------- page ---------- */

export default function BrandPage() {
  return (
    <div className="bg-[#F2EFE9] text-[#1C1C27]" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
      <main className="mx-auto max-w-7xl px-5 md:px-10">
        {/* Hero */}
        <section className="pt-16 sm:pt-28">
          <div className="flex flex-wrap items-end justify-between gap-x-16 gap-y-8">
            <div className="min-w-0 flex-[1_1_560px]">
              <span className={LABEL}>BRAND ASSETS</span>
              <h1 className="mt-[18px] mb-0 text-[40px] leading-[1.05] font-bold tracking-[-0.025em] sm:text-[52px]">AthenaX Brand Kit</h1>
            </div>
            <div className="flex flex-wrap gap-4">
              <ExtLink href={LOGO_FILES_URL} className={cn(buttonVariants(), "h-[47px] gap-2.5 py-0")}>
                Logo files →
              </ExtLink>
              <a href={`mailto:${CONTACT_EMAIL}`} className={cn(buttonVariants({ variant: "outline" }), "h-[47px] py-0")}>
                Contact the team
              </a>
            </div>
          </div>
          <div className={cn(LIGHT_TILE, "mt-16 flex h-[260px] items-center justify-center rounded-[20px] px-8 sm:h-[440px]")}>
            <img src={LOGO.lockupDark} alt="AthenaX primary lockup" className="block h-auto w-[420px] max-w-full" />
          </div>
        </section>

        {/* Logo */}
        <section id="logo" className="pt-14">
          <SectionHeader
            title="Logo"
            intro="The lockup pairs the infinity mark with the AthenaX wordmark. Use it wherever there is room; use the icon on its own for avatars, favicons and tight spaces."
          />
          <div className="mt-16 flex flex-col gap-10">
            {LOGO_ROWS.map((row) => (
              <div key={row.tone} className="flex flex-wrap gap-5">
                <figure className="m-0 flex min-w-0 flex-[2_1_460px] flex-col gap-3.5">
                  <div className={cn("flex h-[280px] items-center justify-center rounded-2xl px-8", row.bg)}>
                    <img src={row.lockup} alt={`Lockup on ${row.tone}`} className="block h-auto w-[300px] max-w-full" />
                  </div>
                  <figcaption className="flex items-center justify-between gap-3">
                    <span className="text-[15px] font-medium">
                      Lockup <span className="text-[#6B6B7A]">— on {row.tone}</span>
                    </span>
                    <DownloadLinks />
                  </figcaption>
                </figure>
                <figure className="m-0 flex min-w-0 flex-[1_1_240px] flex-col gap-3.5">
                  <div className={cn("flex h-[280px] items-center justify-center rounded-2xl", row.bg)}>
                    <img src={row.icon} alt={`Icon on ${row.tone}`} className="block h-11 w-auto" />
                  </div>
                  <figcaption className="flex items-center justify-between gap-3">
                    <span className="text-[15px] font-medium">
                      Icon <span className="text-[#6B6B7A]">— on {row.tone}</span>
                    </span>
                    <DownloadLinks />
                  </figcaption>
                </figure>
              </div>
            ))}
          </div>
        </section>

        {/* Colour */}
        <section id="colour" className="pt-14">
          <SectionHeader
            title="Colour"
            intro="A warm paper ground with deep ink does most of the work. Red and yellow are accents — a single word, tag or detail at a time."
          />

          <div className="mt-16 flex flex-wrap gap-5">
            {CORE_COLOURS.map((c) => (
              <div key={c.name} className="flex min-w-0 flex-[1_1_260px] flex-col gap-4">
                <div className={cn("h-[300px] rounded-2xl", c.border && "border border-[#D6D0C5]")} style={{ background: c.hex }} />
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold">{c.name}</span>
                  <span className="text-sm text-[#5B5B69]">{c.role}</span>
                  <span className={cn(MONO, "mt-2 text-xs whitespace-pre")}>{`HEX  ${c.hex}`}</span>
                  <span className={cn(MONO, "text-xs whitespace-pre")}>{`RGB  ${c.rgb}`}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-5">
            {ACCENT_COLOURS.map((c) => (
              <div key={c.name} className="flex min-w-0 flex-[1_1_260px] flex-col gap-4">
                <div className="h-40 rounded-2xl" style={{ background: c.hex }} />
                <div className="flex flex-col gap-1">
                  <span className="text-lg font-bold">{c.name}</span>
                  <span className="text-sm text-[#5B5B69]">{c.role}</span>
                  <span className={cn(MONO, "mt-2 text-xs whitespace-pre-wrap")}>{`HEX  ${c.hex}  ·  RGB  ${c.rgb}`}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14">
            <span className={LABEL}>BALANCE</span>
            <div className="mt-4 flex h-14 overflow-hidden rounded-xl border border-[#D6D0C5]">
              {BALANCE.map((b) => (
                <div key={b.name} style={{ flex: `${b.pct} 1 0`, background: b.color }} />
              ))}
            </div>
            <div className={cn(MONO, "mt-3 flex flex-wrap gap-x-7 gap-y-2 text-xs text-[#4F4F5E]")}>
              {BALANCE.map((b) => (
                <span key={b.name}>
                  {b.name} {b.pct}%
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Typography */}
        <section id="type" className="pt-14">
          <SectionHeader
            title="Typography"
            intro="Two typefaces, both free on Google Fonts. Space Grotesk carries the voice; Space Mono handles labels, tags and data."
          />

          <div className="mt-16 flex flex-col gap-5">
            {/* Space Grotesk */}
            <div className={cn(LIGHT_TILE, "flex flex-wrap items-center gap-x-14 gap-y-8 p-6 sm:p-10")}>
              <span className="flex-none text-[116px] leading-[0.9] font-bold tracking-[-0.04em]">Aa</span>
              <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[18px]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[28px] font-bold tracking-[-0.02em]">Space Grotesk</span>
                    <span className={cn(MONO, "text-xs tracking-[0.08em] text-[#5B5B69]")}>PRIMARY · HEADLINES &amp; BODY</span>
                  </div>
                  <ExtLink href="https://fonts.google.com/specimen/Space+Grotesk" className={TEXT_LINK}>
                    Google Fonts ↗
                  </ExtLink>
                </div>
                <div className="flex flex-wrap gap-8 text-[22px]">
                  <span className="font-normal">Regular</span>
                  <span className="font-medium">Medium</span>
                  <span className="font-bold">Bold</span>
                </div>
                <div className="border-t border-[#E3DED5] pt-[18px] text-base leading-normal sm:text-xl tracking-[0.01em] break-all text-[#4F4F5E]">
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789 &amp; ! ? @ # → ·
                </div>
              </div>
            </div>

            {/* Space Mono */}
            <div className={cn(LIGHT_TILE, "flex flex-wrap items-center gap-x-14 gap-y-8 p-6 sm:p-10")}>
              <span className={cn(MONO, "flex-none text-[100px] leading-[0.9] tracking-[-0.03em]")}>Aa</span>
              <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-[18px]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[28px] font-bold tracking-[-0.02em]">Space Mono</span>
                    <span className={cn(MONO, "text-xs tracking-[0.08em] text-[#5B5B69]")}>SECONDARY · LABELS, TAGS &amp; DATA</span>
                  </div>
                  <ExtLink href="https://fonts.google.com/specimen/Space+Mono" className={TEXT_LINK}>
                    Google Fonts ↗
                  </ExtLink>
                </div>
                <div className={cn(MONO, "flex flex-wrap gap-8 text-xl")}>
                  <span className="font-normal">Regular</span>
                  <span className="font-bold">Bold</span>
                </div>
                <div className={cn(MONO, "border-t border-[#E3DED5] pt-[18px] text-sm sm:text-[17px] leading-[1.6] break-all text-[#4F4F5E]")}>
                  ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  <br />
                  abcdefghijklmnopqrstuvwxyz
                  <br />
                  0123456789 [ ] / → ·
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <span className={LABEL}>SCALE</span>
            <div className="mt-1">
              {TYPE_SCALE.map((row, i) => (
                <div
                  key={row.spec}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-x-8 gap-y-3",
                    row.pad,
                    i < TYPE_SCALE.length - 1 && "border-b border-[#D6D0C5]"
                  )}
                >
                  <span className={row.className}>{row.sample}</span>
                  <span className={cn(MONO, "text-xs text-[#5B5B69]")}>{row.spec}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Logo usage */}
        <section id="usage" className="pt-14">
          <SectionHeader
            title="Logo usage"
            intro="Use the original files exactly as supplied. Give the logo room, keep it upright and in its own colours, and place it where it can be read clearly."
          />

          {/* Clear space & minimum size */}
          <SubTitle>Clear space &amp; minimum size</SubTitle>
          <div className="mt-5 flex flex-wrap gap-5">
            <figure className="m-0 flex min-w-0 flex-[3_1_460px] flex-col gap-3.5">
              <div className={cn(LIGHT_TILE, "flex h-[300px] items-center justify-center px-4")}>
                <div className="relative max-w-full border border-dashed border-[#A8A398] p-6 sm:p-8">
                  {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos) => (
                    <div
                      key={pos}
                      className={cn(MONO, "absolute flex size-6 items-center sm:size-8 justify-center bg-[rgba(232,50,60,0.10)] text-[11px] text-[#B3262E]", pos)}
                    >
                      x
                    </div>
                  ))}
                  <img
                    src={LOGO.lockupDark}
                    alt="Lockup inside its clear space"
                    className="block h-12 w-auto sm:h-16 outline outline-[rgba(28,28,39,0.16)]"
                  />
                </div>
              </div>
              <figcaption className="text-sm text-[#4F4F5E]">
                Keep clear space of <span className={MONO + " text-[#1C1C27]"}>x</span> on every side, where{" "}
                <span className={MONO + " text-[#1C1C27]"}>x</span> is half the logo’s height.
              </figcaption>
            </figure>
            <figure className="m-0 flex min-w-0 flex-[2_1_300px] flex-col gap-3.5">
              <div className={cn(LIGHT_TILE, "flex h-[300px] flex-wrap items-center justify-center gap-14 px-6")}>
                {[
                  { src: LOGO.lockupDark, w: 100, gap: "gap-1", alt: "Lockup at minimum size" },
                  { src: LOGO.iconDark, w: 24, gap: "gap-0.5", alt: "Icon at minimum size" },
                ].map((m) => (
                  <div key={m.w} className="flex flex-col items-center gap-3">
                    <div className={cn("flex items-center", m.gap)} style={{ width: m.w }}>
                      <span className="h-[9px] w-px bg-[#1C1C27]" />
                      <span className="h-px flex-1 bg-[#1C1C27]" />
                      <span className="h-[9px] w-px bg-[#1C1C27]" />
                    </div>
                    <img src={m.src} alt={m.alt} className="block h-auto" style={{ width: m.w }} />
                    <span className={cn(MONO, "text-xs")}>{m.w} px</span>
                  </div>
                ))}
              </div>
              <figcaption className="text-sm text-[#4F4F5E]">Below these widths, switch to the icon or leave the logo out.</figcaption>
            </figure>
          </div>

          {/* Backgrounds */}
          <SubTitle>Backgrounds</SubTitle>
          <div className="mt-5 flex flex-wrap gap-5">
            {LOGO_BACKGROUNDS.map((b) => (
              <figure key={b.label} className="m-0 flex min-w-0 flex-[1_1_260px] flex-col gap-3.5">
                <div className={cn("flex h-[200px] items-center justify-center rounded-2xl px-7", b.tile)}>
                  <img src={b.src} alt={b.label} className="block h-auto w-[200px] max-w-full" />
                </div>
                <figcaption className="flex items-center gap-2.5 text-sm">
                  <CheckBadge />
                  {b.label}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* What to avoid */}
          <SubTitle>What to avoid</SubTitle>
          <div className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-x-5 gap-y-7">
            {AVOID.map((a) => (
              <figure key={a.label} className="m-0 flex flex-col gap-3.5">
                <div className={cn("flex h-[180px] items-center justify-center overflow-hidden", a.tile ?? LIGHT_TILE)} style={a.style}>
                  {a.content}
                </div>
                <figcaption className="flex items-center gap-2.5 text-sm">
                  <CrossBadge />
                  {a.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* About & press */}
        <section id="about" className="pt-14 pb-36">
          <SectionHeader
            title="About & press"
            intro="Writing about AthenaX? Use the description below, and get in touch for interviews, partnerships or anything not covered here."
          />

          <div className="mt-16 flex flex-wrap gap-5">
            <div className="flex min-w-0 flex-[3_1_480px] flex-col gap-5">
              <div className={cn(LIGHT_TILE, "p-6 sm:p-9")}>
                <div className="flex items-center justify-between gap-3">
                  <span className={LABEL}>BOILERPLATE</span>
                  <CopyBoilerplate text={BOILERPLATE} />
                </div>
                <p className="mt-[22px] mb-0 text-xl leading-[1.45] tracking-[-0.01em] sm:text-2xl">{BOILERPLATE}</p>
              </div>
              <div className={cn(LIGHT_TILE, "flex flex-wrap items-center justify-between gap-x-8 gap-y-4 px-6 py-7 sm:px-9")}>
                <span className={LABEL}>WRITING THE NAME</span>
                <div className="flex flex-wrap items-center gap-x-7 gap-y-2.5 text-[17px]">
                  {NAME_SPELLINGS.map((n) =>
                    n.ok ? (
                      <span key={n.text} className="inline-flex items-center gap-2 font-bold">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1C1C27" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M5 12.5l4.5 4.5L19 7.5" />
                        </svg>
                        {n.text}
                      </span>
                    ) : (
                      <span key={n.text} className="inline-flex items-center gap-2 text-[#6B6B7A]">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
                          <path d="M6 6l12 12" />
                          <path d="M18 6L6 18" />
                        </svg>
                        <span className="sr-only">Incorrect: </span>
                        {n.text}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            <div id="contact" className={cn(LIGHT_TILE, "flex min-w-0 flex-[2_1_340px] flex-col p-6 sm:p-9")}>
              <span className={LABEL}>PRESS &amp; PARTNERSHIPS</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-3.5 text-[22px] font-bold tracking-[-0.02em] break-all text-[#1C1C27] no-underline hover:text-[#1C1C27] sm:text-[26px]"
              >
                {CONTACT_EMAIL}
              </a>
              <span className={cn(LABEL, "mt-8")}>FOLLOW</span>
              <div className="mt-2.5 flex flex-col">
                {SOCIALS.map((s, i) => (
                  <ExtLink
                    key={s.name}
                    href={s.href}
                    className={cn(
                      "flex min-h-12 items-center justify-between text-base font-medium text-[#1C1C27] no-underline hover:text-[#1C1C27]",
                      i < SOCIALS.length - 1 && "border-b border-[#E3DED5]"
                    )}
                  >
                    {s.name}
                    <span className={cn(MONO, "text-xs font-normal text-[#5B5B69]")}>{s.handle} ↗</span>
                  </ExtLink>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
