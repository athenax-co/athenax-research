"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/lib";
import type { TOCHeading } from "@/lib/api";
import WindowCard from "@/components/ui/WindowCard";

export default function ArticleTOC({ headings }: { headings: TOCHeading[] }) {
  const items = headings.filter((h) => h.tag !== "h1");
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-10% 0% -70% 0%", threshold: 0 }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <aside className="w-70 min-w-50 sticky top-24 shrink-0 self-start">
      <WindowCard label="Table of Contents" bodyClass="window-body-cream">
        <div className="p-2 flex flex-col gap-0.5">
          <p className="titlebar-label pb-1.5">On this page</p>
          {items.map(({ id, text, tag }) => {
            const isActive = activeId === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveId(id);
                }}
                className={cn(
                  "block text-sm leading-[1.4] py-1 px-2 rounded no-underline transition-colors duration-100 border-l-2",
                  tag === "h3" ? "ml-2" : "",
                  isActive
                    ? "text-ink font-medium border-l-yellow bg-[#f5d94e1a]"
                    : "text-muted border-l-transparent hover:text-ink hover:bg-[#1c1c270a]"
                )}
              >
                {text}
              </a>
            );
          })}
        </div>
      </WindowCard>
    </aside>
  );
}
