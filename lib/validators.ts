import { z } from "zod";

// Mirrors backend app/common/validators.py::validate_url — http/https scheme, real domain hostname.
// Rejects placeholder/garbage text (e.g. "not found") masquerading as a URL.
export const urlSchema = z.url({
  protocol: /^https?$/,
  hostname: z.regexes.domain,
  error: "Must be a valid http:// or https:// URL",
});
