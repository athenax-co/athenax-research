// Copy rule: never name Robinhood Chain together with Nouns in titles, alt text or labels.
export interface GallerySlide {
  file: string;
  alt: string;
  place: string;
  title?: string;
  highlight?: boolean;
}

export const IMAGE_BASE = "https://admin-athenax.mypinx.store/nouns-images";

export const TOKEN2049_SINGAPORE = "Token2049 · Singapore";
export const FUTURA_CANVAS = "FuturaCanvas · KBW Seoul";
export const DIGITAL_AF = "DIGITAL AF! · Seoul";

export const GALLERY_EVENTS = [
  { slug: "token2049-singapore", label: "Token2049 Singapore", place: TOKEN2049_SINGAPORE },
  { slug: "futura-canvas", label: "FuturaCanvas", place: FUTURA_CANVAS },
  { slug: "digital-af", label: "DIGITAL AF!", place: DIGITAL_AF },
] as const;

export type GalleryEventSlug = (typeof GALLERY_EVENTS)[number]["slug"];

const SG = "Robinhood_Chain_Community";

export const NOUNS_PHOTOS: GallerySlide[] = [
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

export const NOUNS_PHOTO_HIGHLIGHTS = NOUNS_PHOTOS.filter((p) => p.highlight);
