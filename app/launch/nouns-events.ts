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

export interface GalleryVideo {
  src: string;
  poster: string;
  title: string;
  place: string;
}

const VIDEO_BASE = `${IMAGE_BASE}/videos`;

export const NOUNS_VIDEOS: GalleryVideo[] = [
  {
    src: `${VIDEO_BASE}/Nouns_30s_web.mp4`,
    poster: `${VIDEO_BASE}/Nouns_30s_poster.jpg`,
    title: "Community Kickoff highlights",
    place: COMMUNITY_KICKOFF,
  },
  {
    src: `${VIDEO_BASE}/Nouns_60s_web.mp4`,
    poster: `${VIDEO_BASE}/Nouns_60s_poster.jpg`,
    title: "Community Kickoff recap",
    place: COMMUNITY_KICKOFF,
  },
];

export const TOKEN2049_SINGAPORE = "Token2049 · Singapore";
export const FUTURA_CANVAS = "FuturaCanvas · KBW Seoul";
export const DIGITAL_AF = "DIGITAL AF! · Seoul";

const SG = "Robinhood_Chain_Community";

// Launch page carousel — the curated set, in display order.
export const NOUNS_CAROUSEL_PHOTOS: GallerySlide[] = [
  {
    file: `${SG}/01-sg-nouns-dao-wall-entrance`,
    title: "Nouns DAO Wall at the Entrance",
    alt: "Wide view of the Nouns DAO photo wall of pixel-art Nouns at the venue entrance in Singapore",
    place: TOKEN2049_SINGAPORE,
    highlight: true,
  },
  {
    file: "FuturaCanvas/02-kbw-live-doodle-screen",
    title: "Live Doodle Screen at FuturaCanvas",
    alt: "Big screen covered in colourful hand-drawn doodle faces at FuturaCanvas in Seoul",
    place: FUTURA_CANVAS,
    highlight: true,
  },
  {
    file: `${SG}/03-sg-defi-dave`,
    title: "DeFi Dave at the Photo Wall",
    alt: "DeFi Dave in a sakura-print t-shirt smiling in front of the Nouns DAO photo wall",
    place: TOKEN2049_SINGAPORE,
    highlight: true,
  },
  {
    file: "Digital_AF/04-kbw-projected-wall",
    title: "Projected Wall at DIGITAL AF!",
    alt: "The projected Nouns DAO coloring wall glowing in the DIGITAL AF! gallery in Seoul",
    place: DIGITAL_AF,
    highlight: true,
  },
  {
    file: `${SG}/05-sg-guest-photoshoot-1`,
    title: "Guest Photoshoot",
    alt: "Photographer taking a guest’s portrait at the Nouns DAO photo wall",
    place: TOKEN2049_SINGAPORE,
  },
  {
    file: `${SG}/06-sg-guests-at-the-event-1`,
    title: "Guests at the Event",
    alt: "Guest in a black noggles bucket hat talking with other guests at the Nouns event in Singapore",
    place: TOKEN2049_SINGAPORE,
  },
  {
    file: "FuturaCanvas/07-kbw-futuracanvas-talk",
    title: "FuturaCanvas Talk on Stage",
    alt: "Speakers on stage during a talk at FuturaCanvas in Seoul",
    place: FUTURA_CANVAS,
  },
  {
    file: `${SG}/08-sg-nouns-screen-bar`,
    title: "Nouns Screen by the Bar",
    alt: "Standing digital screen showing Nouns beside the bar at the venue",
    place: TOKEN2049_SINGAPORE,
  },
  {
    file: "Digital_AF/09-kbw-denis-meyers-airbrushing",
    title: "Denis Meyers Airbrushing the Wall",
    alt: "Artist Denis Meyers airbrushing the Nouns wall at DIGITAL AF! in Seoul",
    place: DIGITAL_AF,
    highlight: true,
  },
  {
    file: `${SG}/20261006-11`,
    title: "Meet the Nouns Flyers",
    alt: "“Meet the Nouns” flyers fanned out on a wooden table",
    place: TOKEN2049_SINGAPORE,
  },
  {
    file: `${SG}/11-sg-guest-photoshoot-2`,
    title: "Guest Photoshoot",
    alt: "Guest in a noggles bucket hat posing for a photo at the Nouns event",
    place: TOKEN2049_SINGAPORE,
  },
  {
    file: "FuturaCanvas/12-kbw-athenax-drawing",
    title: "AthenaX Drawing at FuturaCanvas",
    alt: "AthenaX team drawing on the Face It screen at FuturaCanvas in Seoul",
    place: FUTURA_CANVAS,
    highlight: true,
  },
  {
    file: `${SG}/13-sg-guests-at-the-event-2`,
    title: "Guests at the Event",
    alt: "Two guests in noggles bucket hats at the Nouns event in Singapore",
    place: TOKEN2049_SINGAPORE,
  },
  {
    file: "Digital_AF/14-kbw-mia-wallace-drawing",
    title: "Mia Wallace Von Dal’z Drawing on the Projected Wall",
    alt: "Mia Wallace Von Dal’z drawing on the projected Nouns DAO coloring wall at DIGITAL AF!",
    place: DIGITAL_AF,
    highlight: true,
  },
  {
    file: `${SG}/15-sg-nouns-dao-wall`,
    title: "Nouns DAO Wall",
    alt: "Close view of the Nouns DAO wall of pixel-art Nouns",
    place: TOKEN2049_SINGAPORE,
  },
  {
    file: `${SG}/20261006-13`,
    title: "Noggles Bucket Hat + Nouns Tee",
    alt: "Black bucket hat with the red noggles logo next to a white Nouns t-shirt",
    place: TOKEN2049_SINGAPORE,
    highlight: true,
  },
  {
    file: "Digital_AF/17-kbw-pink-airbrush",
    title: "Pink Airbrush by Denis Meyers",
    alt: "Pink airbrushed creature wearing noggles by Denis Meyers, sprayed over the Nouns DAO wall",
    place: DIGITAL_AF,
    highlight: true,
  },
  {
    file: `${SG}/18-sg-guest-photoshoot-3`,
    title: "Guest Photoshoot",
    alt: "Guest in sunglasses and a noggles bucket hat holding a glass of wine at the photo wall",
    place: TOKEN2049_SINGAPORE,
  },
  {
    file: `${SG}/19-sg-meet-the-nouns-flyers`,
    title: "Meet the Nouns Flyers",
    alt: "Close-up of “Meet the Nouns” flyers on a table",
    place: TOKEN2049_SINGAPORE,
  },
];
