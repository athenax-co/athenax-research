// Copy rule: never name Robinhood Chain together with Nouns in titles, alt text or labels.
export interface GallerySlide {
  file: string;
  alt: string;
  place: string;
  title?: string;
  highlight?: boolean;
}

export const IMAGE_BASE = "https://admin-athenax.mypinx.store/nouns-images";

export const COMMUNITY_KICKOFF = "Community Kickoff · The Spot";

export const GALLERY_EVENTS = [{ slug: "community-kickoff", label: "Community Kickoff", place: COMMUNITY_KICKOFF }] as const;

export type GalleryEventSlug = (typeof GALLERY_EVENTS)[number]["slug"];

const KICKOFF_ALT = "Guests at the Community Kickoff at The Spot";
const STANDEE_ALT = "Table sign at the Community Kickoff at The Spot";

export const NOUNS_PHOTOS: GallerySlide[] = [
  { file: "Robinhood_Chain_Community/20261006-7", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-9", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-11", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-12", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-13", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-14", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-15", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-16", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-17", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-19", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-24", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-26", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-27", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-29", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-31", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-33a", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-37", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-38", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-41", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-42", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-48", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-50", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-51", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-52", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-54", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-56", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-58", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-65", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-66", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-68", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-69", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-73", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-74", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-75", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-77", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-78", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-80", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-82", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-83", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-84", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-85", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-87", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-88", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-90", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-92", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-93", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-96", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-97", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-102", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-105", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-106", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-107", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-108", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-109", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-110", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-111", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-112", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-115", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-116", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-117", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-118", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-120", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-121", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/20261006-124", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF, highlight: true },
  { file: "Robinhood_Chain_Community/20261006-125", alt: KICKOFF_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/Standees/20260919-b-1", alt: STANDEE_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/Standees/20260919-b-2", alt: STANDEE_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/Standees/20260919-b-3", alt: STANDEE_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/Standees/20260919-b-4", alt: STANDEE_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/Standees/20260919-b-5", alt: STANDEE_ALT, place: COMMUNITY_KICKOFF },
  { file: "Robinhood_Chain_Community/Standees/20260919-b-6", alt: STANDEE_ALT, place: COMMUNITY_KICKOFF },
];

export const NOUNS_PHOTO_HIGHLIGHTS = NOUNS_PHOTOS.filter((p) => p.highlight);
