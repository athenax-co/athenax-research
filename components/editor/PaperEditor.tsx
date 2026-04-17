"use client";

import { useCreateBlockNote, BlockNoteViewRaw, SideMenuController, SideMenu, DragHandleMenu, RemoveBlockItem, FormattingToolbarController, SuggestionMenuController, getDefaultReactSlashMenuItems } from "@blocknote/react";
import "@blocknote/react/style.css";
import { BlockNoteComponentsProvider } from "./BlockNoteComponents";

interface PaperEditorProps {
  onChange?: (json: string) => void;
  initialContent?: string;
}

const CustomDragHandleMenu = (props: any) => (
  <DragHandleMenu {...props}>
    <RemoveBlockItem {...props}>Delete</RemoveBlockItem>
  </DragHandleMenu>
);

const CustomSideMenu = (props: any) => <SideMenu {...props} dragHandleMenu={CustomDragHandleMenu} />;

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

const PaperEditor = ({ onChange = () => {}, initialContent }: PaperEditorProps) => {
  const parsed = (() => {
    if (!initialContent) return undefined;
    try {
      return JSON.parse(initialContent);
    } catch {
      return undefined;
    }
  })();

  const editor = useCreateBlockNote({ initialContent: parsed });
  const floatingUIOptions = { elementProps: { style: { zIndex: 300 } } };

  return (
    <div style={editorVars} className="w-full">
      <style>{`
        .bn-editor a { color: #0b6e99; text-decoration: underline; cursor: pointer; }
        .bn-editor a:hover { color: #0a5a7a; }
        .bn-editor { padding: 16px 0; }
      `}</style>
      <BlockNoteComponentsProvider>
        <BlockNoteViewRaw
          editor={editor}
          theme="light"
          sideMenu={false}
          onChange={() => onChange(JSON.stringify(editor.document))}
        >
          <FormattingToolbarController floatingUIOptions={floatingUIOptions} />
          <SuggestionMenuController
            triggerCharacter="/"
            floatingUIOptions={floatingUIOptions}
            getItems={async (query) =>
              getDefaultReactSlashMenuItems(editor).filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase())
              )
            }
          />
          <SideMenuController sideMenu={CustomSideMenu} />
        </BlockNoteViewRaw>
      </BlockNoteComponentsProvider>
    </div>
  );
};

export default PaperEditor;
