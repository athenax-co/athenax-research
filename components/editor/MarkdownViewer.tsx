"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/utils/lib";
import { slugify } from "@/utils/lib";

function nodeText(children: React.ReactNode): string {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(nodeText).join("");
  if (children && typeof children === "object" && "props" in (children as object))
    return nodeText((children as { props: { children: React.ReactNode } }).props.children);
  return "";
}

interface MarkdownViewerProps {
  content: string;
  className?: string;
}

export default function MarkdownViewer({ content, className }: MarkdownViewerProps) {
  if (!content?.trim()) {
    return <p className={cn("text-sm leading-7 text-muted", className)}>No content available.</p>;
  }

  return (
    <div
      className={cn(
        "text-[0.9375rem] text-ink [font-family:var(--font-space-grotesk),sans-serif]",
        "[&_h1]:mb-3 [&_h1]:text-[1.75rem] [&_h1]:font-bold [&_h1]:leading-[1.2]",
        "[&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-[1.35rem] [&_h2]:font-bold",
        "[&_h3]:mb-[0.4rem] [&_h3]:mt-5 [&_h3]:text-[1.1rem] [&_h3]:font-semibold",
        "[&_p]:mb-3 [&_p]:leading-7",
        "[&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6",
        "[&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6",
        "[&_li]:mb-[0.3rem] [&_li]:leading-[1.65]",
        "[&_code]:rounded-[3px] [&_code]:border [&_code]:border-[#1c1c2720] [&_code]:bg-cream [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:font-mono [&_code]:text-[0.875em]",
        "[&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-ink [&_pre]:p-4 [&_pre]:text-cream",
        "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[0.875em] [&_pre_code]:text-inherit",
        "[&_a]:text-[#0b6e99] [&_a]:underline",
        "[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#E8323C] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[#6B6B7A]",
        "[&_hr]:my-6 [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-[#d8d4cc]",
        "[&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse",
        "[&_th]:border [&_th]:border-[#d8d4cc] [&_th]:bg-cream [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
        "[&_td]:border [&_td]:border-[#d8d4cc] [&_td]:px-3 [&_td]:py-2 [&_td]:text-left",
        className
      )}
    >
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1 id={slugify(nodeText(children))}>{children}</h1>,
          h2: ({ children }) => <h2 id={slugify(nodeText(children))}>{children}</h2>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
