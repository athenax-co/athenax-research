export interface GallerySlide {
  file: string;
  title: string;
  place: string;
  alt: string;
}

export const IMAGE_BASE = "https://admin-athenax.mypinx.store/nouns-images";

const DIGITAL_AF = "Digital AF! · Seoul";
const T2049 = "Singapore · Token2049";

export const NOUNS_IN_THE_WILD_SLIDES: GallerySlide[] = [
  {
    file: "01-antoine-grenez-mia-wallace-von-dalz",
    title: "Antoine Grenez & Mia Wallace Von Dal’z",
    place: "FuturaCanvas · KBW 2026",
    alt: "Antoine Grenez and Mia Wallace Von Dal’z on stage at FuturaCanvas beneath a slide reading “Has new technology actually freed the creator?”",
  },
  {
    file: "02-live-doodle-screen",
    title: "Live Doodle Screen",
    place: "FuturaCanvas · KBW 2026",
    alt: "Large screen filled with colourful hand-drawn doodle faces, one labelled Nouns DAO",
  },
  {
    file: "03-pink-airbrush-by-denis-meyers",
    title: "Pink Airbrush by Denis Meyers",
    place: DIGITAL_AF,
    alt: "Pink airbrushed creature wearing noggles by Denis Meyers, sprayed over the Nouns DAO wall lettering “Art Culture”",
  },
  {
    file: "04-draw-with-nouns-art-exhibition",
    title: "Draw with Nouns Art Exhibition",
    place: DIGITAL_AF,
    alt: "The projected Nouns DAO coloring wall glowing in the dim gallery, line-drawn Nouns around the noggles logo",
  },
  {
    file: "05-mia-wallace-von-dalz-drawing-on-the-wall",
    title: "Mia Wallace Von Dal’z Drawing on the Wall",
    place: DIGITAL_AF,
    alt: "Mia Wallace Von Dal’z drawing on the projected Nouns DAO coloring wall in the gallery",
  },
  {
    file: "06-community-kickoff",
    title: "Community Kickoff",
    place: T2049,
    alt: "Guest in a black noggles bucket hat striking a pose in front of the Nouns DAO photo wall",
  },
  {
    file: "07-meet-the-nouns-flyers",
    title: "Meet the Nouns Flyers",
    place: T2049,
    alt: "“Meet the Nouns” flyers fanned out on a wooden table",
  },
  {
    file: "08-nouns-at-the-spot",
    title: "Nouns at The Spot",
    place: T2049,
    alt: "Standing digital screen reading NOUNS, Singapore 2026, beside the bar at The Spot",
  },
  {
    file: "09-nouns-private-event",
    title: "Nouns Private Event",
    place: T2049,
    alt: "Guests talking beside the Nouns DAO photo wall",
  },
  {
    file: "10-defi-dave-at-nouns-private-event",
    title: "DeFi Dave at Nouns Private Event",
    place: T2049,
    alt: "DeFi Dave in a sakura-print t-shirt smiling in front of the Nouns DAO photo wall",
  },
  {
    file: "11-guest-photoshoot",
    title: "Guest Photoshoot",
    place: T2049,
    alt: "Photographer taking a guest’s portrait at the Nouns DAO photo wall",
  },
  {
    file: "12-guests-at-nouns-private-event",
    title: "Guests at Nouns Private Event",
    place: T2049,
    alt: "Guest in a black noggles bucket hat and white shirt talking with other guests",
  },
  {
    file: "13-guests-at-nouns-private-event",
    title: "Guests at Nouns Private Event",
    place: T2049,
    alt: "Two guests in noggles bucket hats posing at the venue entrance",
  },
  {
    file: "14-guest-in-front-of-nouns-photo-wall",
    title: "Guest in front of Nouns Photo Wall",
    place: T2049,
    alt: "Guest in a noggles bucket hat and sunglasses, holding a glass of wine in front of the Nouns DAO photo wall",
  },
];
