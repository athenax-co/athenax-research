import type { Metadata } from "next";
import { Suspense } from "react";
import { IMAGE_BASE, NOUNS_PHOTOS } from "@/app/launch/nouns-events";
import NounsGallery from "./NounsGallery";

const TITLE = "Nouns in the Wild — Gallery | AthenaX";
const DESCRIPTION = "Photos from the Nouns Community Kickoff at The Spot.";
const OG_IMAGE = `${IMAGE_BASE}/${NOUNS_PHOTOS[0].file}.webp`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, images: [{ url: OG_IMAGE, width: 2560, height: 1706 }] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

export default function Page() {
  return (
    <Suspense>
      <NounsGallery />
    </Suspense>
  );
}
