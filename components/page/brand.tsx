import type { ReactNode } from "react";
import Link from "next/link";
import Icon from "../Icons";

const EMAIL = "info@athenax.co";
const BRAND_PDF_URL = "https://athenax.mypinx.store/Brand/Brand%20Guidelines.pdf";
const BRAND_ASSET_BASE = "https://athenax.mypinx.store/Brand";

const pillClassName =
  "inline-flex items-center rounded-full border border-ink bg-accent-yellow px-6 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-ink";

const cardClassName =
  "rounded-[2rem] border-[3px] border-ink shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]";

const sectionWrapClassName = "w-screen relative left-1/2 -translate-x-1/2 bg-white";

const standards = [
  "Use provided asset files without modification",
  "Maintain contrast ratios for accessibility",
  "Apply colors only from the approved palette",
  "Preserve the original aspect ratio",
];

const violations = [
  "Rotating or skewing the symbol",
  "Creating unofficial color variations",
  "Combining with unapproved graphics",
  "Using outdated or recreated versions",
];

const partnershipItems = [
  "Integration of your product into the AthenaX incubation pipeline",
  "Co-marketing efforts with AthenaX",
  "Strategic collaboration on distribution",
];

const ecosystemItems = [
  "Integration of AthenaX branding into your project",
  "A creative project designed by and for the AthenaX community",
];

function SectionPill({ children }: { children: ReactNode }) {
  return <div className={pillClassName}>{children}</div>;
}

function SectionIntro({
  pill,
  copy,
  className = "",
}: {
  pill: string;
  copy: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <SectionPill>{pill}</SectionPill>
      <p
        className="mt-14 max-w-3xl text-[28px] leading-[1.45] text-ink/65 md:text-[31px]"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        {copy}
      </p>
    </div>
  );
}

function SoftCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${cardClassName} bg-white ${className}`}>{children}</div>;
}

function BrandListItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-6 text-[31px] text-ink">
      <span className="block h-6 w-6 shrink-0 bg-ink" />
      <span>{children}</span>
    </li>
  );
}

function RuleItem({
  text,
  icon,
  rotation,
}: {
  text: string;
  icon: "check" | "x";
  rotation: string;
}) {
  return (
    <div className="flex items-center gap-8">
      <div
        className={`flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[1.5rem] border-[3px] border-ink bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] ${rotation}`}
      >
        <Icon name={icon} size={28} className="text-accent-red" />
      </div>
      <span className="text-[30px] leading-[1.35] text-ink/75">{text}</span>
    </div>
  );
}

export default function BrandPage() {
  return (
    <div className="bg-[#f5f4f2] pt-16 text-ink">
      <div className="mx-auto max-w-[1380px] px-8 pb-10 md:px-12">
        <div className="grid items-start gap-20 pt-20 md:grid-cols-2 md:pt-28">
          <div className="space-y-12">
            <h1
              className="max-w-[620px] text-[72px] uppercase leading-[0.9] tracking-[-0.05em] md:text-[88px]"
              style={{ fontFamily: "var(--font-londrina), cursive" }}
            >
              AthenaX
              <br />
              Brand Guidelines
            </h1>

            <ul
              className="space-y-5 text-[32px]"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              <BrandListItem>Symbols</BrandListItem>
              <BrandListItem>Palettes</BrandListItem>
              <BrandListItem>Typography</BrandListItem>
            </ul>
          </div>

          <div className="max-w-[700px] space-y-10 pt-3">
            <h2
              className="text-[54px] uppercase leading-none tracking-[-0.04em] md:text-[64px]"
              style={{ fontFamily: "var(--font-londrina), cursive" }}
            >
              Brand Licensing
            </h2>

            <div
              className="space-y-10 text-[29px] leading-[1.55] text-ink/60"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              <p>
                The AthenaX brand represents trust in decentralized coordination and long-term ecosystem alignment. It signals legitimacy, builder-first
                values, and structured partnership.
              </p>
              <p>
                AthenaX brand assets are released under CC0. No rights reserved. You are free to use, modify, and distribute them without authorization.
              </p>
              <p>Misrepresentation or any activity falsely implying official partnership or endorsement is prohibited.</p>
            </div>
          </div>
        </div>

        <div className="pb-12 pt-44">
          <div className="mx-auto max-w-4xl text-center">
            <h2
              className="text-[56px] uppercase leading-none tracking-[-0.04em] md:text-[66px]"
              style={{ fontFamily: "var(--font-londrina), cursive" }}
            >
              Brand Assets
            </h2>
            <p
              className="mx-auto mt-12 max-w-[980px] text-[28px] leading-[1.45] text-ink/60 md:text-[31px]"
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
            >
              AthenaX branding may appear in multiple color configurations. Preferred colors are Blue, Black, and White. Consistency and clarity take
              precedence over creative variation.
            </p>
          </div>
        </div>
      </div>

      <section className={sectionWrapClassName}>
        <div className="mx-auto max-w-[1380px] px-8 py-28 md:px-12">
          <SectionIntro
            pill="Primary Mark"
            copy={
              <>
                The AthenaX symbol combines mathematical precision
                <br className="hidden md:block" />
                with fluid dynamics, representing both logic and adaptability.
              </>
            }
          />

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            <SoftCard className="aspect-[4/3] p-10 md:p-16">
              <div className="flex h-full items-center justify-center">
                <img src={`${BRAND_ASSET_BASE}/Logo.svg`} alt="AthenaX icon" width={640} height={420} className="h-auto w-full max-w-[66%]" />
              </div>
            </SoftCard>

            <div className={`${cardClassName} aspect-[4/3] bg-accent-yellow p-10 md:p-16`}>
              <div className="flex h-full items-center justify-center">
                <img
                  src={`${BRAND_ASSET_BASE}/Logo_Outline.png`}
                  alt="AthenaX clear space guide"
                  width={720}
                  height={480}
                  className="h-auto w-full max-w-[92%]"
                />
              </div>
            </div>

            <SoftCard className="min-h-[280px] p-10 md:p-12">
              <h3
                className="text-[48px] uppercase leading-none tracking-[-0.04em] md:text-[56px]"
                style={{ fontFamily: "var(--font-londrina), cursive" }}
              >
                Icon
              </h3>
              <p className="mt-6 max-w-[720px] text-[26px] leading-[1.45] text-ink/75">
                The icon represents infinity and continuity, core principles of long-term ecosystem building.
              </p>
            </SoftCard>

            <SoftCard className="min-h-[280px] p-10 md:p-12">
              <h3
                className="text-[48px] uppercase leading-none tracking-[-0.04em] md:text-[56px]"
                style={{ fontFamily: "var(--font-londrina), cursive" }}
              >
                Clear Space
              </h3>
              <p className="mt-6 max-w-[760px] text-[26px] leading-[1.45] text-ink/75">
                The symbol requires breathing room equal to the height of the inner &ldquo;X&rdquo; element on all sides. Never compromise this clear
                space.
              </p>
            </SoftCard>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f4f2]">
        <div className="mx-auto max-w-[1380px] px-8 py-28 md:px-12">
          <SectionIntro
            pill="Lock-up"
            copy={
              <>
                Use the full lock-up when displaying the complete AthenaX brand.
                <br />
                Suitable for horizontally-aligned applications.
              </>
            }
          />

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {[
              { src: "Logo_Dark.svg", alt: "Dark", className: `${cardClassName} aspect-[2/1] bg-white p-12 md:p-16`, imgClassName: "max-w-[78%]" },
              { src: "Logo_White.svg", alt: "White", className: `${cardClassName} aspect-[2/1] bg-ink p-12 md:p-16`, imgClassName: "max-w-[78%]" },
              {
                src: "Logo_Red.svg",
                alt: "Red",
                className:
                  "aspect-[2/1] rounded-[2rem] border-[3px] border-accent-red bg-white p-12 shadow-[10px_10px_0px_0px_var(--color-accent-red)] md:p-16",
                imgClassName: "max-w-[78%]",
              },
              {
                src: "Logo_Yellow.svg",
                alt: "Yellow",
                className: `${cardClassName} aspect-[2/1] bg-ink p-12 md:p-16`,
                imgClassName: "max-w-[78%]",
              },
              {
                src: "Logo_Dark.svg",
                alt: "Dark on blue",
                className: `${cardClassName} aspect-[2/1] bg-accent-blue p-12 md:p-16`,
                imgClassName: "max-w-[78%]",
              },
              {
                src: "Logo_Yellow_Outline.png",
                alt: "Yellow outline",
                className: `${cardClassName} aspect-[2/1] bg-ink p-0`,
                imgClassName: "w-full max-w-none",
              },
            ].map((logo) => (
              <div key={logo.src + logo.alt} className={logo.className}>
                <div className="flex h-full items-center justify-center">
                  <img
                    src={`${BRAND_ASSET_BASE}/${logo.src}`}
                    alt={logo.alt}
                    width={840}
                    height={420}
                    className={`h-auto w-full ${logo.imgClassName}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionWrapClassName}>
        <div className="mx-auto max-w-[1380px] px-8 py-28 md:px-12">
          <SectionIntro
            pill="Color System"
            copy={
              <>
                The color palette balances technical precision with approachable design.
                <br />
                Each color serves a specific purpose in the visual hierarchy.
              </>
            }
          />

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {[
              {
                name: "color-cream",
                hex: "#FDFBF7",
                usage: "For background and UI elements",
                className: `${cardClassName} bg-white text-ink`,
              },
              {
                name: "color-ink",
                hex: "#1F2937",
                usage: "For text and borders",
                className: `${cardClassName} bg-ink text-white`,
              },
              {
                name: "color-accent-red",
                hex: "#E63636",
                usage: "For buttons and highlights",
                className: `${cardClassName} bg-accent-red text-white`,
              },
              {
                name: "color-accent-yellow",
                hex: "#FDE68A",
                usage: "For highlights and accents",
                className: `${cardClassName} bg-accent-yellow text-ink`,
              },
              {
                name: "color-accent-blue",
                hex: "#DBEAFE",
                usage: "For links and accents",
                className: `${cardClassName} bg-accent-blue text-ink md:col-span-2 md:mx-auto md:max-w-[58%]`,
              },
            ].map((color) => (
              <div key={color.name} className={`${color.className} min-h-[248px] p-10 md:p-12`}>
                <h3
                  className="text-[38px] uppercase leading-none tracking-[-0.05em] md:text-[50px]"
                  style={{ fontFamily: "var(--font-londrina), cursive" }}
                >
                  <span className="lowercase">{color.name}</span>: {color.hex}
                </h3>
                <p className="mt-8 text-[24px] leading-[1.4] opacity-85">* {color.usage} *</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f4f2]">
        <div className="mx-auto max-w-[1380px] px-8 py-28 md:px-12">
          <SectionIntro
            pill="Typography"
            copy={
              <>
                AthenaX uses modern, readable typefaces that convey clarity
                <br />
                and consistency across all communications.
              </>
            }
          />

          <div className="mt-16 grid gap-10 md:grid-cols-2">
            {[
              {
                label: "Logo Primary font",
                name: "Londrina Solid",
                fontFamily: "var(--font-londrina), cursive",
                accent: "",
                samples: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", "1234567890", '\'?""!(%) [#]{@}/&\\<-+÷×=>:;,. *'],
              },
              {
                label: "Content Secondary font",
                name: "Inter",
                fontFamily: "var(--font-inter), sans-serif",
                accent: "Medium",
                samples: ["ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz", "1234567890", '\'?""!(%) [#]{@}/&\\<−+÷×⇒:;,. *'],
              },
            ].map((font) => (
              <div key={font.name} className={`${cardClassName} bg-accent-blue p-10 md:p-14`}>
                <p className="text-[20px] font-medium text-ink/45">{font.label}</p>
                <div className="mt-6 flex items-end gap-4">
                  <h3 className="text-[52px] leading-none text-ink md:text-[66px]" style={{ fontFamily: font.fontFamily }}>
                    {font.name}
                  </h3>
                  {font.accent ? <span className="pb-2 text-[28px] text-ink/60">{font.accent}</span> : null}
                </div>
                <div className="mt-14 space-y-5 text-ink" style={{ fontFamily: font.fontFamily }}>
                  <p className="text-[31px] md:text-[39px]">{font.samples[0]}</p>
                  <p className="text-[26px] md:text-[33px]">{font.samples[1]}</p>
                  <p className="text-[27px] md:text-[35px]">{font.samples[2]}</p>
                  <p className="break-all text-[23px] leading-[1.3] md:text-[30px]">{font.samples[3]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Link href={BRAND_PDF_URL} download target="_blank" rel="noopener noreferrer">
              <button className="btn-system btn-primary rotate-[3deg] text-[30px]" style={{ fontFamily: "var(--font-londrina), cursive" }}>
                Download All
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className={sectionWrapClassName}>
        <div className="mx-auto max-w-[1380px] px-8 py-28 md:px-12">
          <div className="grid gap-20 md:grid-cols-2">
            <div>
              <div className="flex justify-center md:justify-start">
                <SectionPill>Implementation Standards</SectionPill>
              </div>
              <div className="mt-16 space-y-10">
                {standards.map((text, index) => (
                  <RuleItem
                    key={text}
                    text={text}
                    icon="check"
                    rotation={["-rotate-[4deg]", "rotate-[3deg]", "-rotate-[2deg]", "rotate-[2deg]"][index]}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-center md:justify-start">
                <SectionPill>Common Violations</SectionPill>
              </div>
              <div className="mt-16 space-y-10">
                {violations.map((text, index) => (
                  <RuleItem
                    key={text}
                    text={text}
                    icon="x"
                    rotation={["rotate-[3deg]", "-rotate-[2deg]", "rotate-[2deg]", "-rotate-[3deg]"][index]}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f4f2]">
        <div className="mx-auto max-w-[1380px] px-8 py-28 md:px-12">
          <div className="grid gap-16 md:grid-cols-2">
            {[
              {
                pill: "Download Assets",
                body: "All official brand materials are available for download. Assets are CC0 and free to use.",
                rotate: "-rotate-[3deg]",
              },
              {
                pill: "Usage Guidelines",
                body: (
                  <>
                    Download the full AthenaX brand guidelines for detailed documentation on colors, assets, and typography. For questions, contact{" "}
                    <Link href={`mailto:${EMAIL}`} className="underline underline-offset-4">
                      {EMAIL}
                    </Link>
                    .
                  </>
                ),
                rotate: "rotate-[3deg]",
              },
            ].map((item) => (
              <div key={item.pill} className="flex flex-col items-center text-center">
                <SectionPill>{item.pill}</SectionPill>
                <p className="mt-14 max-w-[620px] text-[28px] leading-[1.45] text-ink/60">{item.body}</p>
                <div className="mt-14">
                  <Link href={BRAND_PDF_URL} download target="_blank" rel="noopener noreferrer">
                    <button className={`btn-system btn-primary ${item.rotate} text-[28px]`} style={{ fontFamily: "var(--font-londrina), cursive" }}>
                      Download PDF
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={sectionWrapClassName}>
        <div className="mx-auto max-w-[1380px] px-8 py-28 md:px-12">
          <div className="grid gap-16 md:grid-cols-2">
            {[
              {
                pill: "Partnerships",
                body: "An official partnership with AthenaX means structured collaboration on ecosystem growth. This might include:",
                items: partnershipItems,
                footer: "Partners may use AthenaX branding as needed but must not modify the logo.",
              },
              {
                pill: "Ecosystem",
                body: "If you’re building with AthenaX without an official partnership, you’re an ecosystem contributor. This might include:",
                items: ecosystemItems,
                footer:
                  "Logo modification is discouraged but permitted for creative purposes. The brand cannot be used to imply official partnership with AthenaX or NounsDAO.",
              },
            ].map((section) => (
              <div key={section.pill} className="flex flex-col items-center text-center">
                <SectionPill>{section.pill}</SectionPill>
                <p className="mt-14 max-w-[690px] text-[28px] leading-[1.45] text-ink/60">{section.body}</p>

                <div className="mt-14 w-full max-w-[760px] space-y-10">
                  {section.items.map((item, index) => (
                    <div key={item} className="flex items-start gap-6 text-left">
                      <span
                        className="w-[110px] shrink-0 text-[64px] leading-none tracking-[-0.05em] text-ink"
                        style={{ fontFamily: "var(--font-londrina), cursive" }}
                      >
                        {String(index + 1).padStart(2, "0")}.
                      </span>
                      <span className="pt-1 text-[28px] font-medium leading-[1.4] text-ink">{item}</span>
                    </div>
                  ))}
                </div>

                <p className="mt-16 max-w-[720px] text-[24px] leading-[1.55] text-ink/55">{section.footer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
