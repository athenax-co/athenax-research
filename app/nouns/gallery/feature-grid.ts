export type TileSpan = "big" | "single" | "wide" | "full";

const ROW_TEMPLATES: number[][] = [
  [1, 1, 2],
  [2, 2],
  [1, 1, 1, 1],
];
const LAST_ROW: Record<number, number[]> = { 1: [4], 2: [2, 2], 3: [1, 1, 2], 4: [1, 1, 1, 1] };
const BY_WIDTH: Record<number, TileSpan> = { 1: "single", 2: "wide", 4: "full" };

const FEW: Record<number, TileSpan[]> = {
  1: ["full"],
  2: ["wide", "wide"],
  3: ["big", "wide", "wide"],
  4: ["big", "wide", "single", "single"],
};

export function featureSpans(count: number): TileSpan[] {
  if (count <= 0) return [];
  if (count < 5) return FEW[count];

  const spans: TileSpan[] = count === 6 ? [...FEW[4]] : ["big", "single", "single", "single", "single"];
  let rest = count - spans.length;
  for (let row = 0; rest > 0; row++) {
    let template = ROW_TEMPLATES[row % ROW_TEMPLATES.length];
    if (rest <= 4) template = LAST_ROW[rest];
    else if (rest - template.length === 1) template = template.length < 4 ? ROW_TEMPLATES.find((t) => t.length === template.length + 1)! : [1, 1, 2];
    for (const w of template) spans.push(BY_WIDTH[w]);
    rest -= template.length;
  }
  return spans;
}
