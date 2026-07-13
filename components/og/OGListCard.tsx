import { INK, CREAM, WHITE, MUTED, BODY, categoryBg, cap, clamp, Dot, stageTone } from "./OGCard";

export type OGListProduct = {
  name: string;
  shortDesc?: string | null;
  logo: string | null; // pre-fetched data URI, or null
  categories: string[];
  subCategories: string[];
  stage?: string | null;
  founded?: number | null;
};

export type OGListCardProps = {
  activeCategory: string | null; // null → the unfiltered card
  chips: string[];
  products: OGListProduct[];
  total: number; // count for the current filter
  totalLaunches: number; // global stats, independent of filter
  categoriesCount: number;
  thisWeek: number;
  thisMonth: number;
  brandLogo: string | null; // pre-fetched AthenaX mark, or null for the letter fallback
};

const YELLOW = "#f5d94e";
const DANGER = "#e8323c";
const HAIRLINE = "#d8d4cc";
const ROWS = 3;

// Matches ProductBadge's real baseClasses exactly (components/ui/ProductBadge.tsx):
// text-[10px] px-2.5 py-[3px] border-[1.5px] font-semibold tracking-[0.04em] — the OG
// canvas is ~1200px, the same as the page's real rendered content width, so this is a
// 1:1 copy, not a scaled-down approximation.
function ListBadge({ label, bg, uppercase = true }: { label: string; bg: string; uppercase?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: bg,
        borderWidth: 1.5,
        borderStyle: "solid",
        borderColor: INK,
        borderTopLeftRadius: 999,
        borderTopRightRadius: 999,
        borderBottomLeftRadius: 999,
        borderBottomRightRadius: 999,
        paddingTop: 3,
        paddingBottom: 3,
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: "Space Mono",
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: INK,
        whiteSpace: "nowrap",
      }}
    >
      {uppercase ? label.toUpperCase() : label}
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────

function NavPill({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
        borderTopLeftRadius: 999,
        borderTopRightRadius: 999,
        borderBottomLeftRadius: 999,
        borderBottomRightRadius: 999,
        backgroundColor: active ? YELLOW : "transparent",
        borderWidth: active ? 2 : 0,
        borderStyle: "solid",
        borderColor: INK,
        fontSize: 15,
        fontWeight: active ? 700 : 500,
        color: INK,
      }}
    >
      {label}
    </div>
  );
}

function Navbar({ logo }: { logo: string | null }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 62,
        flexShrink: 0,
        paddingLeft: 40,
        paddingRight: 40,
        backgroundColor: CREAM,
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        borderBottomColor: INK,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            borderRadius: 7,
            backgroundColor: INK,
            overflow: "hidden",
          }}
        >
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={24} height={24} style={{ objectFit: "contain" }} alt="" />
          ) : (
            <div style={{ display: "flex", color: WHITE, fontSize: 17, fontWeight: 700 }}>A</div>
          )}
        </div>
        <div style={{ display: "flex", fontFamily: "Londrina Solid", fontSize: 32, color: INK, letterSpacing: "-0.02em" }}>AthenaX</div>
        <div
          style={{
            display: "flex",
            fontFamily: "Space Mono",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: WHITE,
            backgroundColor: INK,
            borderRadius: 4,
            paddingTop: 2,
            paddingBottom: 2,
            paddingLeft: 5,
            paddingRight: 5,
          }}
        >
          [BETA]
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <NavPill label="Home" active={false} />
        <NavPill label="Launch" active={true} />
        <NavPill label="Research" active={false} />
        <NavPill label="Roadmap" active={false} />
      </div>

      <div
        style={{
          display: "flex",
          backgroundColor: DANGER,
          color: WHITE,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: INK,
          borderRadius: 10,
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 20,
          paddingRight: 20,
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        Sign In
      </div>
    </div>
  );
}

// ── Stats window (LAUNCH_STATS.SYS) ─────────────────────────────────────────

function StatCol({ value, label, last }: { value: number; label: string; last: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 20,
        paddingRight: 20,
        borderRightWidth: last ? 0 : 2,
        borderRightStyle: "solid",
        borderRightColor: HAIRLINE,
      }}
    >
      <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 20, fontWeight: 700, color: DANGER, marginBottom: 2 }}>{value}</div>
      <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 10, letterSpacing: "0.03em", color: MUTED }}>{label}</div>
    </div>
  );
}

function StatsWindow({ totalLaunches, categoriesCount }: { totalLaunches: number; categoriesCount: number }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: INK,
        borderRadius: 12,
        backgroundColor: WHITE,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          paddingTop: 7,
          paddingBottom: 7,
          paddingLeft: 14,
          paddingRight: 14,
          backgroundColor: CREAM,
          borderBottomWidth: 2,
          borderBottomStyle: "solid",
          borderBottomColor: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Dot color="#e8323c" />
          <Dot color="#f5d94e" />
          <Dot color="#4caf50" />
        </div>
        <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 12, letterSpacing: "0.05em", color: INK }}>LAUNCH_STATS.SYS</div>
      </div>
      <div style={{ display: "flex" }}>
        <StatCol value={totalLaunches} label="TOTAL LAUNCHES" last={false} />
        <StatCol value={categoriesCount} label="CATEGORIES" last={false} />
        <StatCol value={11} label="INVESTOR INTROS MADE" last={true} />
      </div>
    </div>
  );
}

// ── Time tabs + search (decorative — matches the real filter row) ──────────

function TimeTab({ label, count, active }: { label: string; count: number; active: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        backgroundColor: active ? YELLOW : WHITE,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: INK,
        borderRadius: 8,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 16,
        paddingRight: 16,
        fontSize: 13,
        fontWeight: 600,
        color: INK,
      }}
    >
      {label}
      <span style={{ display: "flex", fontFamily: "Space Mono", fontSize: 10, opacity: 0.6 }}>({count})</span>
    </div>
  );
}

function TimeTabsRow({ total, thisWeek, thisMonth }: { total: number; thisWeek: number; thisMonth: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <TimeTab label="All" count={total} active={true} />
        <TimeTab label="This Week" count={thisWeek} active={false} />
        <TimeTab label="This Month" count={thisMonth} active={false} />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: 240,
          backgroundColor: WHITE,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: INK,
          borderRadius: 8,
          paddingTop: 7,
          paddingBottom: 7,
          paddingLeft: 12,
          paddingRight: 12,
          fontSize: 13,
          color: "#aaa",
        }}
      >
        Search projects...
      </div>
    </div>
  );
}

// ── Product rows ─────────────────────────────────────────────────────────

function Logo({ product }: { product: OGListProduct }) {
  const box = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 46,
    height: 46,
    borderWidth: 2,
    borderStyle: "solid" as const,
    borderColor: INK,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: WHITE,
    flexShrink: 0,
  };
  if (product.logo) {
    return (
      <div style={{ ...box, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.logo} width={42} height={42} style={{ objectFit: "contain" }} alt="" />
      </div>
    );
  }
  return (
    <div style={{ ...box, fontFamily: "Space Grotesk", fontSize: 19, fontWeight: 700, color: INK }}>{product.name.charAt(0).toUpperCase()}</div>
  );
}

function ViewButtons() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5, width: 92, flexShrink: 0 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: DANGER,
          color: WHITE,
          fontSize: 12,
          fontWeight: 700,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: INK,
          borderRadius: 8,
          paddingTop: 6,
          paddingBottom: 6,
        }}
      >
        View →
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: WHITE,
          color: INK,
          fontSize: 11,
          fontWeight: 600,
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: INK,
          borderRadius: 8,
          paddingTop: 5,
          paddingBottom: 5,
        }}
      >
        Bookmark
      </div>
    </div>
  );
}

function ProductRow({ product, filtered, last }: { product: OGListProduct; filtered: boolean; last: boolean }) {
  // Mirrors the real row: every category, then subcategories, then the quality badge.
  // When the card is already filtered to one category, that badge would be redundant —
  // show subcategories instead (with a bit more room since the category slot is free).
  const badges: { label: string; bg: string; uppercase: boolean }[] = [];
  if (!filtered) product.categories.slice(0, 2).forEach((c) => badges.push({ label: c, bg: categoryBg(c), uppercase: true }));
  product.subCategories.slice(0, filtered ? 2 : 1).forEach((s) => badges.push({ label: s, bg: WHITE, uppercase: true }));
  if (badges.length < 4 && product.stage) {
    const t = stageTone(product.stage);
    badges.push({ label: cap(product.stage), bg: t.bg, uppercase: false });
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        paddingTop: 11,
        paddingBottom: 11,
        borderBottomWidth: last ? 0 : 2,
        borderBottomStyle: "solid",
        borderBottomColor: last ? "transparent" : HAIRLINE,
      }}
    >
      <Logo product={product} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ display: "flex", fontFamily: "Space Grotesk", fontSize: 21, fontWeight: 700, color: INK }}>{clamp(product.name, 24)}</div>
          {badges.map((b) => (
            <ListBadge key={b.label} label={b.label} bg={b.bg} uppercase={b.uppercase} />
          ))}
        </div>
        <div style={{ display: "flex", fontFamily: "Space Grotesk", fontSize: 14, color: BODY, marginBottom: 2 }}>
          {clamp(product.shortDesc || "", 78)}
        </div>
        {product.founded != null && (
          <div style={{ display: "flex", fontSize: 12, color: MUTED }}>{`Founded ${product.founded}`}</div>
        )}
      </div>
      <ViewButtons />
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────

export function OGListCard({
  activeCategory,
  chips,
  products,
  total,
  totalLaunches,
  categoriesCount,
  thisWeek,
  thisMonth,
  brandLogo,
}: OGListCardProps) {
  const shown = products.slice(0, ROWS);
  const subtitle = "Early-stage products across AI, robotics, biotech, crypto, developer tools, infrastructure, and climate.";

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: CREAM,
        fontFamily: "Space Grotesk",
        color: INK,
        overflow: "hidden",
      }}
    >
      <Navbar logo={brandLogo} />

      <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: 20, paddingLeft: 40, paddingRight: 40, overflow: "hidden" }}>
        {/* ── Heading + submit CTA ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 46, fontWeight: 700, color: INK, lineHeight: 1 }}>AthenaX Launch</div>
          </div>
          <div
            style={{
              display: "flex",
              backgroundColor: DANGER,
              color: WHITE,
              borderWidth: 2,
              borderStyle: "solid",
              borderColor: INK,
              borderRadius: 10,
              paddingTop: 9,
              paddingBottom: 9,
              paddingLeft: 16,
              paddingRight: 16,
              fontSize: 14,
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            + Submit Your Product
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 15, color: MUTED, marginTop: 10, lineHeight: 1.3 }}>{subtitle}</div>

        <div style={{ display: "flex", width: "100%", height: 2, backgroundColor: HAIRLINE, marginTop: 20, marginBottom: 14 }} />

        <StatsWindow totalLaunches={totalLaunches} categoriesCount={categoriesCount} />

        <TimeTabsRow total={totalLaunches} thisWeek={thisWeek} thisMonth={thisMonth} />

        <div style={{ display: "flex", width: "100%", height: 2, backgroundColor: INK, marginTop: 12, marginBottom: 12 }} />

        {/* ── Category chips: active one filled yellow, exactly like the page ── */}
        <div style={{ display: "flex", gap: 7, marginBottom: 4 }}>
          {["All", ...chips].map((c) => {
            const active = c === (activeCategory ?? "All");
            return (
              <div
                key={c}
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: active ? YELLOW : WHITE,
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: INK,
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  paddingTop: 7,
                  paddingBottom: 7,
                  paddingLeft: 10,
                  paddingRight: 10,
                  fontSize: 12,
                  fontWeight: active ? 700 : 600,
                  color: INK,
                }}
              >
                {c}
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 8 }}>
          {shown.map((p, i) => (
            <ProductRow key={p.name} product={p} filtered={activeCategory != null} last={i === shown.length - 1} />
          ))}
          {total > shown.length && (
            <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 13, color: MUTED, marginTop: 12 }}>
              {`+ ${total - shown.length} more ${activeCategory ? activeCategory.toLowerCase() : ""} ${total - shown.length === 1 ? "product" : "products"}`.replace(
                /\s+/g,
                " "
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
