import type { Metadata } from "next";
import { Suspense } from "react";
import NounsGallery from "./NounsGallery";

const TITLE = "Nouns in the Wild — Gallery | AthenaX";
const DESCRIPTION = "Photos from the Nouns Community Kickoff at The Spot.";
const OG_IMAGE = "/og/nouns-gallery";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: OG_IMAGE, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

export default function Page() {
  return (
    <Suspense>
      <NounsGallery />
    </Suspense>
  );
}
