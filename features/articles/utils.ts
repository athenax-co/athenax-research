import { slugify } from "@/utils/lib";

export interface TOCHeading {
  id: string;
  text: string;
  tag: string;
}

export const extractMarkdownHeadings = (markdown: string): TOCHeading[] => {
  const lines = markdown.split("\n");
  return lines.flatMap((line) => {
    const match = line.match(/^(#{1,2})\s+(.+)/);
    if (!match) return [];
    const tag = `h${match[1].length}`;
    const raw = match[2].trim();
    const text = raw.replace(/\*\*(.+?)\*\*|__(.+?)__|[*_`]/g, "$1$2");
    return [{ id: slugify(raw), text, tag }];
  });
};
