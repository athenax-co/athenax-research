"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/utils/lib";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Strikethrough as StrikethroughIcon,
  Link,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  FileCode2,
  Minus,
  List,
  ListOrdered,
  ListTodo,
  type LucideIcon,
} from "lucide-react";

type WrapAction = {
  label: string;
  title: string;
  before: string;
  after?: string;
  placeholder?: string;
  block?: boolean;
  icon?: LucideIcon;
};

const TOOLBAR: (WrapAction | "sep")[] = [
  { label: "B", title: "Bold", before: "**", after: "**", placeholder: "bold text", icon: BoldIcon },
  { label: "I", title: "Italic", before: "_", after: "_", placeholder: "italic text", icon: ItalicIcon },
  { label: "~~", title: "Strikethrough", before: "~~", after: "~~", placeholder: "strikethrough", icon: StrikethroughIcon },
  "sep",
  { label: "H1", title: "Heading 1", before: "# ", placeholder: "Heading", block: true, icon: Heading1 },
  { label: "H2", title: "Heading 2", before: "## ", placeholder: "Heading", block: true, icon: Heading2 },
  { label: "H3", title: "Heading 3", before: "### ", placeholder: "Heading", block: true, icon: Heading3 },
  "sep",
  { label: '"', title: "Blockquote", before: "> ", placeholder: "quote", block: true, icon: Quote },
  { label: "</>", title: "Inline code", before: "`", after: "`", placeholder: "code", icon: Code },
  { label: "```", title: "Code block", before: "```\n", after: "\n```", placeholder: "code", block: true, icon: FileCode2 },
  { label: "Link", title: "Link", before: "[", after: "](url)", placeholder: "link text", icon: Link },
  "sep",
  { label: "—", title: "Horizontal rule", before: "\n---\n", block: true, icon: Minus },
  { label: "ul", title: "Unordered list", before: "- ", placeholder: "item", block: true, icon: List },
  { label: "ol", title: "Ordered list", before: "1. ", placeholder: "item", block: true, icon: ListOrdered },
  { label: "[ ]", title: "Task list", before: "- [ ] ", placeholder: "task", block: true, icon: ListTodo },
];

function applyWrap(textarea: HTMLTextAreaElement, action: WrapAction, setValue: (v: string) => void) {
  const { selectionStart: ss, selectionEnd: se, value } = textarea;
  const selected = value.slice(ss, se) || action.placeholder || "";

  let insert: string;
  let cursorStart: number;
  let cursorEnd: number;

  if (action.block && !action.after) {
    insert = action.before + selected;
    cursorStart = ss + action.before.length;
    cursorEnd = cursorStart + selected.length;
  } else {
    const after = action.after ?? "";
    insert = action.before + selected + after;
    cursorStart = ss + action.before.length;
    cursorEnd = cursorStart + selected.length;
  }

  const next = value.slice(0, ss) + insert + value.slice(se);
  setValue(next);

  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(cursorStart, cursorEnd);
  });
}

type Tab = "write" | "preview";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = "# Start writing...\n\nUse the toolbar above or write Markdown directly.",
  minHeight = "min-h-72",
  className,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<Tab>("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleToolbar = (action: WrapAction) => {
    if (!textareaRef.current) return;
    applyWrap(textareaRef.current, action, onChange);
  };

  return (
    <div className={cn("rounded-lg border-2 border-ink overflow-hidden", className)}>
      {/* Toolbar + tab row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink bg-cream px-3.5 py-2">
        <div className="flex shrink-0 gap-1">
          {(["write", "preview"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "cursor-pointer rounded-[7px] border px-3.5 py-1.25 text-[13px] font-semibold capitalize text-ink transition-colors",
                tab === t ? "border-ink bg-white" : "border-transparent bg-transparent hover:bg-white/70"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "write" && (
          <div className="flex flex-wrap items-center gap-0.5">
            {TOOLBAR.map((item, i) =>
              item === "sep" ? (
                <span key={`sep-${i}`} className="mx-1 inline-block h-5 w-px bg-[#1c1c2730]" />
              ) : (
                (() => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      title={item.title}
                      aria-label={item.title}
                      onClick={() => handleToolbar(item)}
                      className={cn(
                        "min-w-7 cursor-pointer rounded-[5px] border border-transparent bg-transparent px-1.75 py-1 text-center leading-none text-ink transition-colors hover:border-[#1c1c2740] hover:bg-white",
                        item.label === "B" && "text-[13px] font-bold",
                        item.label !== "B" && "font-mono text-[13px] font-normal",
                        item.label === "I" && "italic"
                      )}
                    >
                      {Icon ? <Icon className="size-3.5" /> : item.label}
                    </button>
                  );
                })()
              )
            )}
          </div>
        )}
      </div>

      {/* Editor / Preview body */}
      <div className="bg-white px-5 py-4">
        {tab === "write" ? (
          <textarea
            ref={textareaRef}
            className={cn("block w-full resize-y border-0 bg-transparent text-sm leading-relaxed text-ink outline-none", minHeight)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            spellCheck={false}
          />
        ) : (
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
              "[&_blockquote]:mb-3 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#1c1c2740] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted",
              "[&_hr]:my-6 [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-[#d8d4cc]",
              "[&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse",
              "[&_th]:border [&_th]:border-[#d8d4cc] [&_th]:bg-cream [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold",
              "[&_td]:border [&_td]:border-[#d8d4cc] [&_td]:px-3 [&_td]:py-2 [&_td]:text-left",
              minHeight
            )}
          >
            {value.trim() ? (
              <ReactMarkdown>{value}</ReactMarkdown>
            ) : (
              <p className="text-sm italic text-muted">Nothing to preview yet. Switch to Write and start typing.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
