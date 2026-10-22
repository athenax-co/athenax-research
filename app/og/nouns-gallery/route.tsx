import { ImageResponse } from "next/og";
import { IMAGE_BASE, NOUNS_PHOTO_HIGHLIGHTS } from "@/app/launch/nouns-events";
import { CREAM, INK, MUTED, WHITE } from "@/components/og/OGCard";
import { fetchImageDataUri, toJpegUrl } from "@/utils/og";

export const runtime = "edge";

const YELLOW = "#f5d94e";
const BRAND_LOGO_URL = "https://athenax.mypinx.store/Logo_Icon_White.png";

const PHOTO_W = 300;
const PHOTO_H = 200;

// Hand-placed polaroid collage on the right half of the card.
const FRAMES = [
  { left: 0, top: 36, rotate: -4 },
  { left: 320, top: 8, rotate: 3 },
  { left: 24, top: 290, rotate: 2 },
  { left: 344, top: 266, rotate: -3 },
];

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;

  try {
    const picks = NOUNS_PHOTO_HIGHLIGHTS.slice(0, FRAMES.length);
    const [photos, brandLogo, grotesk, groteskBold, mono, londrina] = await Promise.all([
      Promise.all(picks.map((p) => fetchImageDataUri(toJpegUrl(`${IMAGE_BASE}/${p.file}.webp`)))),
      fetchImageDataUri(BRAND_LOGO_URL),
      fetchFont(origin, "SpaceGrotesk-Regular"),
      fetchFont(origin, "SpaceGrotesk-Bold"),
      fetchFont(origin, "SpaceMono-Regular"),
      fetchFont(origin, "LondrinaSolid-Regular"),
    ]);

    return new ImageResponse(
      (
        <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: CREAM, fontFamily: "Space Grotesk", color: INK }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 500,
              paddingTop: 56,
              paddingBottom: 52,
              paddingLeft: 64,
              paddingRight: 24,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  fontFamily: "Space Mono",
                  fontSize: 16,
                  backgroundColor: WHITE,
                  borderWidth: 2,
                  borderStyle: "solid",
                  borderColor: INK,
                  borderRadius: 8,
                  paddingTop: 6,
                  paddingBottom: 6,
                  paddingLeft: 12,
                  paddingRight: 12,
                }}
              >
                /root/nouns/gallery
              </div>
              <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 0.95, marginTop: 28 }}>
                Nouns
              </div>
              <div style={{ display: "flex", fontFamily: "Londrina Solid", fontSize: 92, lineHeight: 0.95 }}>in the Wild</div>
              <div style={{ display: "flex", fontSize: 22, color: MUTED, lineHeight: 1.35, marginTop: 24, maxWidth: 380 }}>
                Photos from the Community Kickoff at The Spot.
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 9,
                  backgroundColor: INK,
                }}
              >
                {brandLogo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={brandLogo} width={30} height={30} style={{ objectFit: "contain" }} alt="" />
                ) : (
                  <div style={{ display: "flex", color: WHITE, fontSize: 20, fontWeight: 700 }}>A</div>
                )}
              </div>
              <div style={{ display: "flex", fontFamily: "Londrina Solid", fontSize: 36, letterSpacing: "-0.02em" }}>AthenaX</div>
              <div style={{ display: "flex", fontFamily: "Space Mono", fontSize: 16, color: MUTED, marginLeft: 8 }}>athenax.co</div>
            </div>
          </div>

          <div style={{ display: "flex", position: "relative", flex: 1, marginTop: 36, marginRight: 40 }}>
            {FRAMES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  position: "absolute",
                  left: f.left,
                  top: f.top,
                  width: PHOTO_W + 20,
                  height: PHOTO_H + 20,
                  transform: `rotate(${f.rotate}deg)`,
                }}
              >
                {/* Offset block stands in for the site's hard ink shadow. */}
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    left: 8,
                    top: 8,
                    width: PHOTO_W + 20,
                    height: PHOTO_H + 20,
                    backgroundColor: INK,
                    borderRadius: 14,
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: PHOTO_W + 20,
                    height: PHOTO_H + 20,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: i === 1 ? YELLOW : WHITE,
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderColor: INK,
                    borderRadius: 14,
                  }}
                >
                  {photos[i] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photos[i]!} width={PHOTO_W - 6} height={PHOTO_H - 6} style={{ objectFit: "cover", borderRadius: 8 }} alt="" />
                  ) : (
                    <div style={{ display: "flex", width: PHOTO_W - 6, height: PHOTO_H - 6, backgroundColor: "#d8d4cc", borderRadius: 8 }} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          { name: "Space Grotesk", data: grotesk, weight: 400, style: "normal" },
          { name: "Space Grotesk", data: groteskBold, weight: 700, style: "normal" },
          { name: "Space Mono", data: mono, weight: 400, style: "normal" },
          { name: "Londrina Solid", data: londrina, weight: 400, style: "normal" },
        ],
        headers: { "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" },
      }
    );
  } catch {
    return new Response(null, { status: 302, headers: { Location: `${origin}/AthenaX_OG.jpg` } });
  }
}

async function fetchFont(origin: string, name: string): Promise<ArrayBuffer> {
  const res = await fetch(new URL(`/fonts/${name}.ttf`, origin));
  if (!res.ok) throw new Error(`font fetch failed: ${name}`);
  return res.arrayBuffer();
}
