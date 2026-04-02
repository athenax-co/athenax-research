import Link from "next/link";
import WindowCard from "@/components/ui/WindowCard";
import { DocSection } from "@/components/ui/Docs";

export default function Page() {
  const mediaLogos = [
    { title: "Primary Lockup", src: "Logo_Dark.svg", bg: "#F2EFE9" },
    { title: "Inverse Lockup", src: "Logo_White.svg", bg: "#1C1C27" },
    { title: "Accent Lockup", src: "Logo_Yellow.svg", bg: "#1C1C27" },
    { title: "Icon Mark", src: "Logo.svg", bg: "#F2EFE9" },
  ];

  const palette = [
    { name: "Primary Red", hex: "#E8323C", bg: "#E8323C", use: "Primary accents, calls to action, and key emphasis" },
    { name: "Near-Black", hex: "#1C1C27", bg: "#1C1C27", use: "Primary text, strokes, dark surfaces" },
    { name: "Cream", hex: "#F2EFE9", bg: "#F2EFE9", use: "Page fields, neutral canvas, and brand background" },
    { name: "Yellow", hex: "#F5D94E", bg: "#F5D94E", use: "Labels, highlights, and category markers" },
  ];

  const usageGood = [
    "Use the supplied lockups and icon files without distortion.",
    "Keep generous clear space around the mark in crowded layouts.",
    "Pair the brand with high-contrast surfaces and strong typography.",
    "Attribute AthenaX accurately when describing sponsorship or partnership.",
  ];

  const usageBad = [
    "Do not redraw, stretch, skew, or rotate the symbol.",
    "Do not invent gradients, shadows, or alternate colorways.",
    "Do not imply endorsement, investment, or partnership unless confirmed.",
    "Do not combine the mark with unrelated icons into a new hybrid logo.",
  ];

  return (
    <>
      <div className="space-y-8">
        <WindowCard label="MEDIA_KIT_OVERVIEW" bodyClass="window-body window-body-yellow">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="path-badge mb-3.5">CC0 / OPEN BRAND SYSTEM</div>
              <h2 className="mb-3 text-[34px] leading-[1.02]">AthenaX Press & Brand Pack</h2>
              <p className="mb-4.5 text-[15px] leading-[1.7] text-muted">
                AthenaX is a research coordination system for frontier technology. This media kit gives editors, sponsors, and builders a clean way to
                talk about the project and use the brand responsibly.
              </p>
              <div className="mb-4.5 flex flex-wrap gap-2">
                {["CC0 assets", "Logo lockups", "Palette", "Voice notes", "Usage rules"].map((item) => (
                  <span key={item} className="ftag">
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="https://athenax.mypinx.store/Brand/Brand%20Guidelines.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Download Brand PDF
                </Link>
                <Link href="/launch" className="btn btn-outline">
                  See Product Surface
                </Link>
              </div>
            </div>
            <div className="stat-card bg-white">
              <div className="stat-label">Boilerplate</div>
              <div className="text-sm leading-[1.75] text-[#1C1C27]">
                AthenaX connects researchers, builders, and protocol ecosystems so validated ideas can move from paper to product. It is designed to
                make open research fundable, legible, and easier to build on.
              </div>
            </div>
          </div>
        </WindowCard>

        <DocSection title="Logo System">
          <div className="grid gap-4 md:grid-cols-2">
            {mediaLogos.map((logo) => (
              <WindowCard key={logo.title} label={logo.title.toUpperCase().replace(/ /g, "_")} bodyClass="window-body">
                <div className="flex min-h-45 items-center justify-center rounded-xl border-2 border-[#1C1C27] p-7" style={{ background: logo.bg }}>
                  <img
                    src={`https://athenax.mypinx.store/Brand/${logo.src}`}
                    alt={logo.title}
                    width={520}
                    height={240}
                    className={logo.title === "Icon Mark" ? "block h-auto w-45" : "block h-auto w-[78%]"}
                  />
                </div>
                <div className="mt-3.5 text-[13px] leading-[1.65] text-muted">
                  {logo.title === "Primary Lockup" && "Default mark for editorial coverage, decks, landing pages, and ecosystem references."}
                  {logo.title === "Inverse Lockup" && "Use on dark surfaces where maximum legibility is needed."}
                  {logo.title === "Accent Lockup" && "Best for highlighted placements, feature cards, and branded modules."}
                  {logo.title === "Icon Mark" && "Use the icon on its own in tight UI contexts or social/profile placements."}
                </div>
              </WindowCard>
            ))}
          </div>
        </DocSection>

        <DocSection title="Palette & Voice">
          <div className="grid gap-4 lg:grid-cols-2">
            <WindowCard label="PALETTE.TOKENS" bodyClass="window-body window-body-blue">
              <div className="flex flex-col gap-3">
                {palette.map((color) => (
                  <div key={color.name} className="grid grid-cols-[88px_1fr] items-center gap-3.5 border-b border-b-black/10 py-2.5 last:border-b-0">
                    <div className="h-13 rounded-[10px] border-2 border-[#1C1C27] shadow-[3px_3px_0_#1C1C27]" style={{ background: color.bg }} />
                    <div>
                      <div className="text-sm font-bold text-[#1C1C27]">
                        {color.name} <span className="font-['Space_Mono',monospace] text-[11px] text-muted">{color.hex}</span>
                      </div>
                      <div className="text-[13px] leading-[1.55] text-muted">{color.use}</div>
                    </div>
                  </div>
                ))}
              </div>
            </WindowCard>

            <WindowCard label="VOICE_AND_COPY" bodyClass="window-body">
              <div className="text-sm leading-8 text-[#1C1C27]">
                <div className="mb-3">
                  <strong>Core tone:</strong> rigorous, open, builder-literate, quietly ambitious.
                </div>
                <div className="mb-3">
                  <strong>Preferred language:</strong> research coordination, protocol ecosystems, public goods, frontier technology, open
                  infrastructure.
                </div>
                <div className="mb-3">
                  <strong>Avoid:</strong> vague hype language, empty futurism, or framing AthenaX as just another media/news brand.
                </div>
                <div className="mb-4">
                  <strong>Short descriptor:</strong> AthenaX is a research operating system for frontier technology.
                </div>
                <div className="stat-card bg-cream p-4">
                  <div className="stat-label">Recommended quote</div>
                  <div className="text-[15px] leading-[1.7]">
                    “AthenaX helps serious research travel farther by giving it structure, visibility, and a path into products.”
                  </div>
                </div>
              </div>
            </WindowCard>
          </div>
        </DocSection>

        <DocSection title="Usage Rules">
          <div className="grid gap-4 lg:grid-cols-2">
            <WindowCard label="DO" bodyClass="window-body window-body-yellow">
              <div className="flex flex-col gap-3.5">
                {usageGood.map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg border-2 border-[#1C1C27] bg-white font-bold shadow-[2px_2px_0_#1C1C27]">
                      {index + 1}
                    </div>
                    <div className="text-sm leading-[1.7] text-[#1C1C27]">{item}</div>
                  </div>
                ))}
              </div>
            </WindowCard>

            <WindowCard label="DO_NOT" bodyClass="window-body">
              <div className="flex flex-col gap-3.5">
                {usageBad.map((item, index) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg border-2 border-[#1C1C27] bg-[#F5DDE0] font-bold text-[#E8323C] shadow-[2px_2px_0_#1C1C27]">
                      {index + 1}
                    </div>
                    <div className="text-sm leading-[1.7] text-[#1C1C27]">{item}</div>
                  </div>
                ))}
              </div>
            </WindowCard>
          </div>
        </DocSection>

        <DocSection title="Press Contact & Downloads">
          <div className="grid gap-4 lg:grid-cols-2">
            <WindowCard label="PRESS_CONTACT" bodyClass="window-body">
              <div className="text-sm leading-8 text-[#1C1C27]">
                <div className="mb-2.5">
                  <strong>Email:</strong>{" "}
                  <a href="mailto:info@athenax.co" className="text-[#E8323C] underline">
                    info@athenax.co
                  </a>
                </div>
                <div className="mb-2.5">
                  <strong>Best for:</strong> press requests, partner decks, conference materials, podcast notes, sponsorship references.
                </div>
                <div>
                  <strong>Licence:</strong> CC0. Assets are open to use, adapt, and distribute, but usage must not falsely imply endorsement or a
                  formal partnership.
                </div>
              </div>
            </WindowCard>

            <WindowCard label="DOWNLOADS" bodyClass="window-body window-body-blue">
              <div className="flex flex-col gap-3">
                <Link
                  href="https://athenax.mypinx.store/Brand/Brand%20Guidelines.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full justify-center"
                >
                  Download Brand Guidelines PDF
                </Link>
                <Link
                  href="https://athenax.mypinx.store/Brand/Logo.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline w-full justify-center"
                >
                  Download SVG Mark
                </Link>
                <Link
                  href="https://athenax.mypinx.store/Brand/Logo_Dark.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline w-full justify-center"
                >
                  Download Primary Lockup
                </Link>
              </div>
            </WindowCard>
          </div>
        </DocSection>
      </div>
    </>
  );
}
