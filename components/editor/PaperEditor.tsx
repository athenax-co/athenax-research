"use client";

import { useCreateBlockNote, BlockNoteViewRaw, SideMenuController, SideMenu, DragHandleMenu, RemoveBlockItem } from "@blocknote/react";
import "@blocknote/react/style.css";
import { useState } from "react";
import WindowCard from "@/components/ui/WindowCard";
import { BlockNoteComponentsProvider } from "./BlockNoteComponents";
import { Button } from "@/components/ui/button";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";

const CustomDragHandleMenu = (props: any) => (
  <DragHandleMenu {...props}>
    <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
  </DragHandleMenu>
);

const CustomSideMenu = (props: any) => <SideMenu {...props} dragHandleMenu={CustomDragHandleMenu} />;

// Map site design tokens to BlockNote's CSS variables
const editorVars: React.CSSProperties & Record<string, string> = {
  "--bn-colors-editor-text": "#1c1c27",
  "--bn-colors-editor-background": "#ffffff",
  "--bn-colors-menu-text": "#1c1c27",
  "--bn-colors-menu-background": "#F2EFE9",
  "--bn-colors-tooltip-text": "#1c1c27",
  "--bn-colors-tooltip-background": "#F5D94E",
  "--bn-colors-hovered-text": "#1c1c27",
  "--bn-colors-hovered-background": "#F5D94E",
  "--bn-colors-selected-text": "#1c1c27",
  "--bn-colors-selected-background": "#F5D94E",
  "--bn-colors-disabled-text": "#999999",
  "--bn-colors-disabled-background": "#e8e8e8",
  "--bn-colors-shadow": "#1c1c27",
  "--bn-colors-border": "#1c1c2730",
  "--bn-colors-side-menu": "#1c1c2750",
  "--bn-font-family": "var(--font-space-grotesk), sans-serif",
  "--bn-border-radius": "4px",
};

const PaperEditor = () => {
  const editor = useCreateBlockNote();
  const [isDirty, setIsDirty] = useState(false);

  useUnsavedChangesGuard(isDirty);

  const handleSubmit = () => {
    const blocks = editor.document;
    console.log("=== BlockNote raw output ===");
    console.log(JSON.stringify(blocks, null, 2));
    setIsDirty(false);
  };

  return (
    <WindowCard label="PAPER_EDITOR.SYS">
      <div
        style={{
          border: "2px solid #1c1c27",
          borderRadius: 6,
          minHeight: 480,
          overflow: "hidden",
          ...editorVars,
        }}
      >
        <style>
          {`.bn-editor a { color: #0b6e99; text-decoration: underline; cursor: pointer; }
          .bn-editor a:hover { color: #0a5a7a; }
          .bn-editor { padding-top: 16px; padding-bottom: 16px; }`}
        </style>
        <BlockNoteComponentsProvider>
          <BlockNoteViewRaw editor={editor} theme="light" sideMenu={false} onChange={() => setIsDirty(true)}>
            <SideMenuController sideMenu={CustomSideMenu} />
          </BlockNoteViewRaw>
        </BlockNoteComponentsProvider>
      </div>
      <div className="flex justify-end mt-3">
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </WindowCard>
  );
};

export default PaperEditor;
