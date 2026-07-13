export type OGCardProduct = {
  name: string;
  shortDesc?: string | null;
  description?: string | null;
  logo?: string | null;
  slug: string;
  stage?: string | null;
  founded?: number | null;
  funding?: number | null;
  createdAt?: string | null;
  categories?: { name: string }[];
  subCategories?: string[] | null;
  voteCount?: number | null;
  backers?: string[];
  grants?: string[];
  links?: { label: string; url: string }[];
  galleryImages?: (string | null)[];
};

export const INK = "#1c1c27";
export const CREAM = "#f2efe9";
export const WHITE = "#ffffff";
export const MUTED = "#888888";
export const BODY = "#555555";
const LINK = "#C4605C";
export const HAIR = "#e3ded5";

const CATEGORY_BG: Record<string, string> = {
  "AI & AGENTS": "#FFE0CC",
  BIOTECH: "#D4ECD5",
  CRYPTO: "#FFE9A0",
  "DEVELOPER TOOLS": "#D4E4F7",
  INFRASTRUCTURE: "#E0DAD0",
  ROBOTICS: "#E0D4F0",
};

export function categoryBg(name: string) {
  return CATEGORY_BG[name.toUpperCase().replace(/\s+/g, " ").trim()] ?? "#E8E4D9";
}

export function stageTone(label: string) {
  const n = label.toUpperCase().trim();
  if (["LIVE", "ACTIVE", "LAUNCHED"].includes(n)) return { bg: "#C8F7C5", border: "#2D6A2E", color: "#2D6A2E" };
  if (["BETA", "ACTIVE DEVELOPMENT"].includes(n)) return { bg: "#FFF3C4", border: "#8B7000", color: "#8B7000" };
  return { bg: "#E8E4D9", border: "#1a1a1a", color: "#1a1a1a" };
}

export function cap(s: string) {
  const t = s.replace(/\s+/g, " ").trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function clamp(s: string, max: number) {
  const t = s.trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max - 24 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

export function Badge({ label, bg, border, color }: { label: string; bg: string; border: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: bg,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: border,
        borderTopLeftRadius: 999,
        borderTopRightRadius: 999,
        borderBottomLeftRadius: 999,
        borderBottomRightRadius: 999,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 13,
        paddingRight: 13,
        fontFamily: "Space Mono",
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: "0.04em",
        color,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
}

export function Dot({ color }: { color: string }) {
  return <div style={{ display: "flex", width: 12, height: 12, borderRadius: 999, backgroundColor: color }} />;
}

function Titlebar({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        paddingTop: 11,
        paddingBottom: 11,
        paddingLeft: 16,
        paddingRight: 16,
        backgroundColor: CREAM,
        borderBottomWidth: 2,
        borderBottomStyle: "solid",
        borderBottomColor: INK,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Dot color="#e8323c" />
        <Dot color="#f5d94e" />
        <Dot color="#4caf50" />
      </div>
      <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 16, letterSpacing: "0.07em", color: INK, marginLeft: 12 }}>
        {label}
      </div>
    </div>
  );
}

function Window({ label, width, height, children }: { label: string; width: number; height: number; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width,
        height,
        backgroundColor: WHITE,
        borderWidth: 2,
        borderStyle: "solid",
        borderColor: INK,
        borderTopLeftRadius: 14,
        borderTopRightRadius: 14,
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        boxShadow: `5px 5px 0 ${INK}`,
      }}
    >
      <Titlebar label={label} />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>
    </div>
  );
}

function ArrowUpRight({ color }: { color: string }) {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export function OGCard({ product: p }: { product: OGCardProduct }) {
  const initial = p.name.charAt(0).toUpperCase();
  const category = p.categories?.[0]?.name ?? null;
  const subCategories = (p.subCategories ?? []).slice(0, 2);
  const stage = p.stage ?? null;
  const tagline = p.shortDesc?.trim() ?? "";
  const launchDate = p.createdAt
    ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;
  const st = stage ? stageTone(stage) : null;

  const description = clamp(p.description || p.shortDesc || "No description provided.", 215);
  const backers = (p.backers ?? []).slice(0, 8);
  const grants = (p.grants ?? []).slice(0, 8);
  const links = (p.links ?? []).slice(0, 4);

  const factRows: { label: string; value: string }[] = [];
  if (category) factRows.push({ label: "Category", value: category });
  if (p.founded != null) factRows.push({ label: "Founded", value: String(p.founded) });
  if (p.funding != null) factRows.push({ label: "Funding", value: `$${p.funding.toLocaleString()}` });
  if (stage) factRows.push({ label: "Stage", value: cap(stage) });

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
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 44,
        paddingRight: 44,
      }}
    >
      {/* ── Top section ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 26,
          paddingBottom: 24,
          borderBottomWidth: 1,
          borderBottomStyle: "solid",
          borderBottomColor: "#ccc6ba",
        }}
      >
        {/* logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 104,
            height: 104,
            flexShrink: 0,
            backgroundColor: WHITE,
            borderWidth: 2,
            borderStyle: "solid",
            borderColor: INK,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            boxShadow: `4px 4px 0 ${INK}`,
          }}
        >
          {p.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.logo} alt={p.name} width={104} height={104} style={{ width: 104, height: 104, objectFit: "cover", borderRadius: 16 }} />
          ) : (
            <div style={{ display: "flex", fontFamily: "Space Grotesk", fontSize: 58, fontWeight: 700, color: INK, lineHeight: 1 }}>{initial}</div>
          )}
        </div>

        {/* name + badges + tagline + meta */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: 2 }}>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 8 }}>
            <div style={{ display: "flex", fontFamily: "Space Grotesk", fontSize: 46, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em", color: INK }}>
              {p.name.length > 26 ? `${p.name.slice(0, 24)}…` : p.name}
            </div>
            {category && <Badge label={category.toUpperCase()} bg={categoryBg(category)} border={INK} color={INK} />}
            {subCategories.map((s) => (
              <Badge key={s} label={s.toUpperCase()} bg={WHITE} border="#1a1a1a" color="#1a1a1a" />
            ))}
            {stage && st && <Badge label={cap(stage)} bg={st.bg} border={st.border} color={st.color} />}
          </div>

          {tagline ? (
            <div style={{ display: "flex", fontSize: 21, lineHeight: 1.5, color: BODY }}>
              {tagline.length > 150 ? `${tagline.slice(0, 147)}…` : tagline}
            </div>
          ) : null}

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, fontFamily: "Space Mono", fontSize: 15, color: MUTED }}>
            {p.founded != null && <span style={{ display: "flex" }}>founded {p.founded}</span>}
            {p.founded != null && launchDate && <span style={{ display: "flex", color: "#c9c3b8" }}>·</span>}
            {launchDate && <span style={{ display: "flex" }}>launched on AthenaX {launchDate}</span>}
          </div>
        </div>
      </div>

      {/* ── Panels ── */}
      <div style={{ display: "flex", gap: 22, marginTop: 24 }}>
        {/* ABOUT.SYS */}
        <Window label="ABOUT.SYS" width={545} height={525}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: 22, paddingBottom: 22, paddingLeft: 24, paddingRight: 24 }}>
            <div style={{ display: "flex", fontSize: 16, lineHeight: 1.65, color: INK, marginBottom: 18 }}>{description}</div>

            <div style={{ display: "flex", flexDirection: "column", marginBottom: 22 }}>
              {factRows.map((row, i) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderBottomWidth: i < factRows.length - 1 ? 1 : 0,
                    borderBottomStyle: "solid",
                    borderBottomColor: HAIR,
                  }}
                >
                  <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 13, letterSpacing: "0.06em", color: MUTED }}>
                    {row.label.toUpperCase()}
                  </div>
                  <div style={{ display: "flex", fontSize: 16, fontWeight: 700, color: INK }}>{row.value}</div>
                </div>
              ))}
            </div>

            {backers.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 13, letterSpacing: "0.06em", color: MUTED, marginBottom: 10 }}>BACKERS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {backers.map((b) => (
                    <div
                      key={b}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: WHITE,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "#d9d4cb",
                        borderTopLeftRadius: 999,
                        borderTopRightRadius: 999,
                        borderBottomLeftRadius: 999,
                        borderBottomRightRadius: 999,
                        paddingTop: 6,
                        paddingBottom: 6,
                        paddingLeft: 15,
                        paddingRight: 15,
                        fontSize: 15,
                        fontWeight: 500,
                        color: INK,
                      }}
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {grants.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 13, letterSpacing: "0.06em", color: MUTED, marginBottom: 10 }}>GRANTS</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {grants.map((g) => (
                    <div
                      key={g}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: WHITE,
                        borderWidth: 1,
                        borderStyle: "solid",
                        borderColor: "#d9d4cb",
                        borderTopLeftRadius: 999,
                        borderTopRightRadius: 999,
                        borderBottomLeftRadius: 999,
                        borderBottomRightRadius: 999,
                        paddingTop: 6,
                        paddingBottom: 6,
                        paddingLeft: 15,
                        paddingRight: 15,
                        fontSize: 15,
                        fontWeight: 500,
                        color: INK,
                      }}
                    >
                      {g}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Window>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* GALLERY.SYS */}
          <Window label="GALLERY.SYS" width={545} height={275}>
            <div style={{ display: "flex", gap: 11, paddingTop: 12, paddingBottom: 12, paddingLeft: 12, paddingRight: 12, flex: 1 }}>
              <GalleryImage src={p.galleryImages?.[0] ?? null} width={280} height={205} />
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                <GalleryImage src={p.galleryImages?.[1] ?? null} width={218} height={97} />
                <GalleryImage src={p.galleryImages?.[2] ?? null} width={218} height={97} />
              </div>
            </div>
          </Window>

          {/* LINKS.SYS */}
          <Window label="LINKS.SYS" width={545} height={230}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingTop: 6, paddingBottom: 6, paddingLeft: 24, paddingRight: 24 }}>
              {links.length > 0 ? (
                links.map((l, i) => (
                  <div
                    key={l.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingTop: 9,
                      paddingBottom: 9,
                      borderBottomWidth: i < links.length - 1 ? 1 : 0,
                      borderBottomStyle: "solid",
                      borderBottomColor: HAIR,
                    }}
                  >
                    <div style={{ display: "flex", fontSize: 17, fontWeight: 700, color: INK }}>{l.label}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <ArrowUpRight color={LINK} />
                      <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 15, color: LINK }}>{l.url}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ display: "flex", paddingTop: 14, fontSize: 15, color: MUTED }}>No links provided.</div>
              )}
            </div>
          </Window>
        </div>
      </div>
    </div>
  );
}

function GalleryImage({ src, width, height }: { src: string | null; width: number; height: number }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={width}
        height={height}
        style={{ width, height, objectFit: "cover", borderRadius: 8, borderWidth: 1, borderStyle: "solid", borderColor: "#ccc8c0" }}
      />
    );
  }
  return (
    <div
      style={{
        display: "flex",
        width,
        height,
        backgroundColor: "#dedad3",
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#ccc8c0",
      }}
    />
  );
}
