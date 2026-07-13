const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/svg+xml"];

// resvg (next/og) can't decode WebP, so normalize every remote image to JPEG
// through the wsrv.nl image proxy before embedding.
export function toJpegUrl(url: string): string {
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=jpg&w=800`;
}

export async function fetchImageDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = (res.headers.get("content-type") ?? "image/jpeg").split(";")[0].trim();
    // Skip formats resvg can't handle (e.g. webp)
    if (!SUPPORTED_IMAGE_TYPES.includes(ct)) return null;
    const buf = await res.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = "";
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return `data:${ct};base64,${btoa(binary)}`;
  } catch {
    return null;
  }
}
