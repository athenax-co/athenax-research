"use client";

import { BlockNoteViewRaw, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/react/style.css";
import { BlockNoteComponentsProvider } from "./BlockNoteComponents";
import { cn } from "@/lib/utils";

interface BlockNoteViewerProps {
  content: string;
  className?: string;
}

const viewerVars: React.CSSProperties & Record<string, string> = {
  "--bn-colors-editor-text": "#1c1c27",
  "--bn-colors-editor-background": "transparent",
  "--bn-font-family": "var(--font-space-grotesk), sans-serif",
  "--bn-border-radius": "4px",
};

const parseContent = (content: string) => {
  try {
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
};

export default function BlockNoteViewer({ content, className }: BlockNoteViewerProps) {
  const parsed = parseContent(content);
  const editor = useCreateBlockNote({ initialContent: parsed }, [content]);

  if (!parsed) {
    return <p className={cn("text-sm leading-7 text-muted", className)}>No content available.</p>;
  }

  return (
    <div style={viewerVars} className={cn("blocknote-viewer w-full text-ink", className)}>
      <style>{`
        .blocknote-viewer .bn-editor {
          background: transparent;
          padding: 0;
        }

        .blocknote-viewer .bn-editor a {
          color: #0b6e99;
          text-decoration: underline;
        }

        .blocknote-viewer .bn-block-content {
          padding-left: 0;
          padding-right: 0;
        }
      `}</style>
      <BlockNoteComponentsProvider>
        <BlockNoteViewRaw
          editor={editor}
          theme="light"
          editable={false}
          formattingToolbar={false}
          linkToolbar={false}
          slashMenu={false}
          sideMenu={false}
          filePanel={false}
          tableHandles={false}
          emojiPicker={false}
          comments={false}
        />
      </BlockNoteComponentsProvider>
    </div>
  );
}
