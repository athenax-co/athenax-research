"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import WindowCard from "@/components/ui/WindowCard";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import { cn } from "@/utils/lib";
import { Button } from "@/components/ui/button";
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

// ── Toolbar actions ──────────────────────────────────────────────────────────

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
    // Line-prefix actions (headings, lists, blockquote, hr)
    insert = action.before + selected;
    cursorStart = ss + action.before.length;
    cursorEnd = cursorStart + selected.length;
  } else {
    // Wrap actions
    const after = action.after ?? "";
    insert = action.before + selected + after;
    cursorStart = ss + action.before.length;
    cursorEnd = cursorStart + selected.length;
  }

  const next = value.slice(0, ss) + insert + value.slice(se);
  setValue(next);

  // Restore selection after React re-renders
  requestAnimationFrame(() => {
    textarea.focus();
    textarea.setSelectionRange(cursorStart, cursorEnd);
  });
}

// ── Component ────────────────────────────────────────────────────────────────

type Tab = "write" | "preview";

export default function MarkdownEditorClient() {
  const [source, setSource] = useState("");
  const [tab, setTab] = useState<Tab>("write");
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useUnsavedChangesGuard(isDirty);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSource(e.target.value);
    setIsDirty(true);
  };

  const handleToolbar = (action: WrapAction) => {
    if (!textareaRef.current) return;
    applyWrap(textareaRef.current, action, (v) => {
      setSource(v);
      setIsDirty(true);
    });
  };

  const handleSave = () => {
    console.log("=== Markdown content ===");
    console.log(source);
    setIsDirty(false);
  };

  return (
    <div>
      <div className="page-wrap section">
        <div className="path-badge">/root/paper/markdown</div>
        <h1 className="mb-2 text-[42px]">Markdown Editor</h1>
        <p className="mb-0 text-base text-muted">Write your paper in Markdown.</p>

        <hr className="divider" />

        <WindowCard label="PAPER.MD" bodyClass="window-body !p-0">
          {/* ── Toolbar + tab row ─────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink bg-cream px-3.5 py-2">
            {/* Write / Preview tabs */}
            <div className="flex shrink-0 gap-1">
              {(["write", "preview"] as Tab[]).map((t) => (
                <button
                  key={t}
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

            {/* Toolbar — only shown in Write tab */}
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
                          title={item.title}
                          aria-label={item.title}
                          onClick={() => handleToolbar(item)}
                          className={cn(
                            "min-w-7 cursor-pointer rounded-[5px] border border-transparent bg-transparent px-1.75 py-1 text-center leading-none text-ink transition-colors hover:border-[#1c1c2740] hover:bg-white",
                            item.label === "B" ? "text-[13px] font-bold" : "font-mono text-[13px] font-normal",
                            item.label === "I" && "italic",
                            ["H1", "H2", "H3"].includes(item.label) && "text-[11px]"
                          )}
                        >
                          {Icon ? <Icon className={cn("size-3.5", ["H1", "H2", "H3"].includes(item.label) && "size-3.5")} /> : item.label}
                        </button>
                      );
                    })()
                  )
                )}
              </div>
            )}
          </div>

          {/* ── Editor / Preview body ──────────────────────────────────────── */}
          <div className="min-h-130 bg-white px-6 py-5">
            {tab === "write" ? (
              <textarea
                ref={textareaRef}
                className="block min-h-120 w-full resize-none border-0 bg-transparent text-sm leading-relaxed text-ink outline-none"
                value={source}
                onChange={handleChange}
                placeholder={"# Start writing your paper...\n\nUse the toolbar above or write Markdown directly."}
                spellCheck={false}
              />
            ) : (
              <div className="min-h-120 text-[0.9375rem] text-ink [font-family:var(--font-space-grotesk),sans-serif] [&_h1]:mb-3 [&_h1]:text-[1.75rem] [&_h1]:font-bold [&_h1]:leading-[1.2] [&_h2]:mb-2 [&_h2]:mt-6 [&_h2]:text-[1.35rem] [&_h2]:font-bold [&_h3]:mb-[0.4rem] [&_h3]:mt-5 [&_h3]:text-[1.1rem] [&_h3]:font-semibold [&_p]:mb-3 [&_p]:leading-7 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-[0.3rem] [&_li]:leading-[1.65] [&_li_input[type='checkbox']]:mr-1.5 [&_code]:rounded-[3px] [&_code]:border [&_code]:border-[#1c1c2720] [&_code]:bg-cream [&_code]:px-[0.35em] [&_code]:py-[0.1em] [&_code]:font-mono [&_code]:text-[0.875em] [&_pre]:mb-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-ink [&_pre]:p-4 [&_pre]:text-cream [&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-[0.875em] [&_pre_code]:text-inherit [&_a]:text-[#0b6e99] [&_a]:underline [&_blockquote]:mb-3 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#1c1c2740] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted [&_hr]:my-6 [&_hr]:border-0 [&_hr]:border-t-2 [&_hr]:border-[#d8d4cc] [&_table]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-[#d8d4cc] [&_th]:bg-cream [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_td]:border [&_td]:border-[#d8d4cc] [&_td]:px-3 [&_td]:py-2 [&_td]:text-left">
                {source.trim() ? (
                  <ReactMarkdown>{source}</ReactMarkdown>
                ) : (
                  <p className="text-sm italic text-muted">Nothing to preview yet. Switch to Write and start typing.</p>
                )}
              </div>
            )}
          </div>
        </WindowCard>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} disabled={!isDirty}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
