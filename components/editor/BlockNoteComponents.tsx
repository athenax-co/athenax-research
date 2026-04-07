"use client";

/**
 * Minimal plain-HTML implementation of BlockNote's ComponentsContext.
 * Provides just enough UI for the editor to render without a UI adapter library.
 */

import React, { ReactNode, useState, useRef, useEffect } from "react";
import { ComponentsContext } from "@blocknote/react";
import { cn } from "@/utils/lib";

// ── Toolbar ──────────────────────────────────────────────────────────────────

const ToolbarRoot = ({
  children,
  className,
  onMouseEnter,
  onMouseLeave,
}: {
  children?: ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  variant?: "default" | "action-toolbar";
}) => (
  <div
    className={cn(
      "flex flex-wrap gap-0.5 px-2 py-1 bg-cream border border-ink rounded shadow-[0_2px_8px_rgba(28,28,39,0.12)]",
      className
    )}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);

const ToolbarButton = ({
  children,
  label,
  icon,
  onClick,
  isSelected,
  isDisabled,
  mainTooltip,
}: any) => (
  <button
    title={mainTooltip ?? label}
    disabled={isDisabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={cn(
      "flex items-center gap-1 px-1.5 py-0.5 rounded text-[13px] text-ink [font-family:var(--font-space-grotesk)] transition-colors border",
      isSelected
        ? "bg-yellow border-ink"
        : "bg-transparent border-transparent hover:bg-yellow/40",
      isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
    )}
  >
    {icon ?? <span className="text-[11px]">{children ?? label}</span>}
  </button>
);

const ToolbarSelect = ({ items, isDisabled }: any) => {
  const selectedIndex = items?.findIndex((item: any) => item.isSelected) ?? 0;
  return (
    <select
      disabled={isDisabled}
      value={selectedIndex < 0 ? 0 : selectedIndex}
      onChange={(e) => items[Number(e.target.value)]?.onClick()}
      className={cn(
        "px-1.5 py-0.5 bg-cream border border-ink rounded text-[13px] text-ink",
        isDisabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
      )}
    >
      {items?.map((item: any, i: number) => (
        <option key={i} value={i}>
          {item.text}
        </option>
      ))}
    </select>
  );
};

// ── SideMenu ─────────────────────────────────────────────────────────────────

const SideMenuRoot = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <div className={cn("flex flex-row gap-0.5 items-center", className)}>
    {children}
  </div>
);

const SideMenuButton = ({
  children,
  label,
  icon,
  onClick,
  draggable,
  onDragStart,
  onDragEnd,
}: any) => (
  <button
    title={label}
    onClick={onClick}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    className="flex items-center justify-center w-6 h-6 bg-transparent border-none rounded p-0 cursor-pointer text-ink opacity-50 hover:opacity-100 transition-opacity"
  >
    {icon ?? children ?? label}
  </button>
);

// ── SuggestionMenu ────────────────────────────────────────────────────────────

const SuggestionMenuRoot = ({ children, className, id }: any) => (
  <div
    id={id}
    className={cn(
      "bg-cream border-2 border-ink rounded-md shadow-[4px_4px_0_#1c1c27] min-w-55 max-h-75 overflow-y-auto z-10000 py-1",
      className
    )}
  >
    {children}
  </div>
);

const SuggestionMenuItem = ({ item, isSelected, onClick, id, className }: any) => (
  <div
    id={id}
    className={cn(
      "flex items-center gap-2.5 px-3 py-1.5 cursor-pointer text-[14px] text-ink [font-family:var(--font-space-grotesk)] transition-colors",
      isSelected ? "bg-yellow" : "hover:bg-yellow/40",
      className
    )}
    onClick={onClick}
  >
    {item.icon && (
      <span className="w-5 flex items-center justify-center">{item.icon}</span>
    )}
    <div>
      <div className="font-medium">{item.title}</div>
      {item.subtext && <div className="text-[12px] opacity-60">{item.subtext}</div>}
    </div>
  </div>
);

const SuggestionMenuLabel = ({ children, className }: any) => (
  <div className={cn("px-3 pt-1 pb-0.5 text-[11px] font-semibold tracking-widest uppercase text-ink/60 [font-family:var(--font-space-grotesk)]", className)}>
    {children}
  </div>
);

const SuggestionMenuEmpty = ({ children, className }: any) => (
  <div className={cn("px-3 py-2 text-[13px] text-ink/40 italic [font-family:var(--font-space-grotesk)]", className)}>
    {children ?? "No results"}
  </div>
);

const SuggestionMenuLoader = ({ className }: any) => (
  <div className={cn("px-3 py-2 text-[13px] text-ink/40", className)}>
    Loading…
  </div>
);

// ── GridSuggestionMenu ────────────────────────────────────────────────────────

const GridSuggestionMenuRoot = ({ children, className, id, columns }: any) => (
  <div
    id={id}
    className={cn("bg-cream border-2 border-ink rounded-md shadow-[4px_4px_0_#1c1c27] p-1 z-10000", className)}
    style={{ display: "grid", gridTemplateColumns: `repeat(${columns ?? 8}, 1fr)` }}
  >
    {children}
  </div>
);

const GridSuggestionMenuItem = ({ item, isSelected, onClick, id, className }: any) => (
  <div
    id={id}
    className={cn(
      "flex items-center justify-center p-1 rounded cursor-pointer text-[20px] transition-colors",
      isSelected ? "bg-yellow" : "hover:bg-yellow/40",
      className
    )}
    onClick={onClick}
    title={item.title}
  >
    {item.icon ?? item.title?.[0]}
  </div>
);

const GridSuggestionMenuEmpty = ({ children, className, columns }: any) => (
  <div
    className={cn("p-2 text-[13px] text-ink/40", className)}
    style={{ gridColumn: `span ${columns ?? 8}` }}
  >
    {children ?? "No results"}
  </div>
);

const GridSuggestionMenuLoader = ({ className, columns }: any) => (
  <div
    className={cn("p-2 text-[13px] text-ink/40", className)}
    style={{ gridColumn: `span ${columns ?? 8}` }}
  >
    Loading…
  </div>
);

// ── FilePanel ─────────────────────────────────────────────────────────────────

const FilePanelRoot = ({ tabs, openTab, setOpenTab, className }: any) => (
  <div className={cn("bg-cream border-2 border-ink rounded-md p-3 min-w-70", className)}>
    <div className="flex gap-1 mb-2">
      {tabs?.map((tab: any) => (
        <button
          key={tab.name}
          onClick={() => setOpenTab(tab.name)}
          className={cn(
            "px-2.5 py-1 border border-ink rounded text-[13px] cursor-pointer transition-colors",
            openTab === tab.name ? "bg-yellow" : "bg-transparent hover:bg-yellow/40"
          )}
        >
          {tab.name}
        </button>
      ))}
    </div>
    {tabs?.find((t: any) => t.name === openTab)?.tabPanel}
  </div>
);

const FilePanelButton = ({ children, label, onClick, className }: any) => (
  <button
    className={cn("px-2.5 py-1.5 bg-ink text-cream border-none rounded text-[13px] cursor-pointer mt-1.5 hover:opacity-80 transition-opacity", className)}
    onClick={onClick}
  >
    {children ?? label}
  </button>
);

const FilePanelFileInput = ({ accept, placeholder, onChange, className }: any) => (
  <input
    className={cn("text-[13px] w-full", className)}
    type="file"
    accept={accept}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.files?.[0] ?? null)}
  />
);

const FilePanelTabPanel = ({ children, className }: any) => (
  <div className={className}>{children}</div>
);

const FilePanelTextInput = ({ value, placeholder, onChange, onKeyDown, className }: any) => (
  <input
    className={cn("w-full px-2 py-1.5 border border-ink rounded text-[13px] bg-white outline-none", className)}
    type="text"
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    onKeyDown={onKeyDown}
  />
);

// ── TableHandle ───────────────────────────────────────────────────────────────

const TableHandleRoot = ({ children, draggable, onDragStart, onDragEnd, style, label, className }: any) => (
  <div
    className={cn("cursor-grab bg-cream border border-ink rounded flex items-center justify-center w-4 h-4", className)}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    style={style}
    title={label}
  >
    {children ?? "⠿"}
  </div>
);

const TableHandleExtendButton = ({ children, onClick, onMouseDown, className }: any) => (
  <button
    className={cn("bg-transparent border-none cursor-pointer p-0", className)}
    onClick={onClick}
    onMouseDown={onMouseDown}
  >
    {children}
  </button>
);

// ── Comments ───────────────────────────────────────────────────────────────────

const CommentsCard = ({ children, className, onFocus, onBlur, tabIndex }: any) => (
  <div
    className={cn("border border-ink rounded p-2 mb-1.5", className)}
    onFocus={onFocus}
    onBlur={onBlur}
    tabIndex={tabIndex}
  >
    {children}
  </div>
);

const CommentsCardSection = ({ children, className }: any) => (
  <div className={className}>{children}</div>
);

const CommentsExpandSectionsPrompt = ({ children, className }: any) => (
  <div className={cn("text-[12px] text-ink/50 cursor-pointer", className)}>{children}</div>
);

// Stub — renders nothing since Comments is not used in this project
const CommentsEditor = ({ className }: any) => <div className={className} />;

const CommentsComment = ({ children, className }: any) => (
  <div className={className}>{children}</div>
);

// ── Generic Badge ──────────────────────────────────────────────────────────────

const GenericBadgeRoot = ({ text, icon, isSelected, onClick, mainTooltip, onMouseEnter, className }: any) => (
  <button
    className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 border border-ink rounded-full text-[12px] cursor-pointer transition-colors",
      isSelected ? "bg-yellow" : "bg-cream hover:bg-yellow/40",
      className
    )}
    onClick={onClick}
    title={mainTooltip ?? text}
    onMouseEnter={onMouseEnter}
  >
    {icon}
    {text}
  </button>
);

const GenericBadgeGroup = ({ children, className }: any) => (
  <div className={cn("flex gap-1 flex-wrap", className)}>{children}</div>
);

// ── Generic Form ───────────────────────────────────────────────────────────────

const GenericFormRoot = ({ children }: any) => (
  <div className="flex flex-col gap-2">{children}</div>
);

const GenericFormTextInput = React.forwardRef<HTMLInputElement, any>(
  ({ name, label, icon, value, placeholder, onChange, onKeyDown, onSubmit, disabled, autoFocus, autoComplete, className, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[12px] font-semibold">{label}</label>}
      <div className="flex items-center gap-1.5">
        {icon}
        <input
          ref={ref}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={(e) => { onKeyDown?.(e); if (e.key === "Enter") onSubmit?.(); }}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete={autoComplete}
          className={cn("flex-1 px-2 py-1.5 border border-ink rounded text-[13px] bg-white outline-none", className)}
          {...rest}
        />
      </div>
    </div>
  )
);
GenericFormTextInput.displayName = "GenericFormTextInput";

// ── Generic Menu ────────────────────────────────────────────────────────────────

const MenuOpenContext = React.createContext<{
  open: boolean;
  setOpen: (v: boolean) => void;
}>({ open: false, setOpen: () => {} });

const GenericMenuRoot = ({ children, onOpenChange }: any) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSetOpen = (v: boolean) => {
    setOpen(v);
    onOpenChange?.(v);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) handleSetOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <MenuOpenContext.Provider value={{ open, setOpen: handleSetOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </MenuOpenContext.Provider>
  );
};

const GenericMenuDropdown = ({ children, className, sub }: any) => {
  const { open } = React.useContext(MenuOpenContext);
  if (!open) return null;
  return (
    <div
      className={cn(
        "absolute z-10001 bg-cream border-2 border-ink rounded-md shadow-[4px_4px_0_#1c1c27] min-w-40 py-1",
        sub ? "top-0 left-full" : "top-full left-0",
        className
      )}
    >
      {children}
    </div>
  );
};

const GenericMenuDivider = ({ className }: any) => (
  <hr className={cn("border-none border-t border-ink/10 my-1", className)} />
);

const GenericMenuItem = ({ children, icon, checked, onClick, className }: any) => (
  <div
    className={cn("flex items-center gap-2 px-3 py-1.5 cursor-pointer text-[13px] text-ink hover:bg-yellow transition-colors", className)}
    onClick={onClick}
  >
    {checked !== undefined && <span className="w-4">{checked ? "✓" : ""}</span>}
    {icon}
    {children}
  </div>
);

const GenericMenuLabel = ({ children, className }: any) => (
  <div className={cn("px-3 pt-1 pb-0.5 text-[11px] font-semibold opacity-50", className)}>
    {children}
  </div>
);

const GenericMenuTrigger = ({ children }: any) => {
  const { setOpen, open } = React.useContext(MenuOpenContext);
  return (
    <div className="inline-block" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
      {children}
    </div>
  );
};

const GenericMenuButton = ({ children, label, icon, onClick, draggable, onDragStart, onDragEnd, className }: any) => (
  <button
    className={cn("flex items-center gap-1.5 px-2 py-1 bg-transparent border-none cursor-pointer text-[13px] text-ink hover:bg-yellow/40 transition-colors", className)}
    onClick={onClick}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
  >
    {icon}
    {children ?? label}
  </button>
);

// ── Generic Popover ────────────────────────────────────────────────────────────

const PopoverOpenContext = React.createContext<boolean>(false);

const GenericPopoverRoot = ({ children, open, onOpenChange }: any) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onOpenChange?.(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onOpenChange]);
  return (
    <PopoverOpenContext.Provider value={!!open}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </PopoverOpenContext.Provider>
  );
};

const GenericPopoverContent = ({ children, className }: any) => {
  const open = React.useContext(PopoverOpenContext);
  if (!open) return null;
  return (
    <div className={cn("absolute top-full left-0 mt-1 z-10002 bg-cream border-2 border-ink rounded-md shadow-[4px_4px_0_#1c1c27] p-3 min-w-55", className)}>
      {children}
    </div>
  );
};

const GenericPopoverTrigger = ({ children }: any) => <>{children}</>;

// ── Assemble the full Components object ───────────────────────────────────────

const components: React.ContextType<typeof ComponentsContext> = {
  FormattingToolbar: { Root: ToolbarRoot, Button: ToolbarButton, Select: ToolbarSelect },
  LinkToolbar: { Root: ToolbarRoot, Button: ToolbarButton, Select: ToolbarSelect },
  FilePanel: {
    Root: FilePanelRoot,
    Button: FilePanelButton,
    FileInput: FilePanelFileInput,
    TabPanel: FilePanelTabPanel,
    TextInput: FilePanelTextInput,
  },
  SideMenu: { Root: SideMenuRoot, Button: SideMenuButton },
  SuggestionMenu: {
    Root: SuggestionMenuRoot,
    Item: SuggestionMenuItem,
    Label: SuggestionMenuLabel,
    EmptyItem: SuggestionMenuEmpty,
    Loader: SuggestionMenuLoader,
  },
  GridSuggestionMenu: {
    Root: GridSuggestionMenuRoot,
    Item: GridSuggestionMenuItem,
    EmptyItem: GridSuggestionMenuEmpty,
    Loader: GridSuggestionMenuLoader,
  },
  TableHandle: { Root: TableHandleRoot, ExtendButton: TableHandleExtendButton },
  Comments: {
    Card: CommentsCard,
    CardSection: CommentsCardSection,
    ExpandSectionsPrompt: CommentsExpandSectionsPrompt,
    Editor: CommentsEditor,
    Comment: CommentsComment,
  },
  Generic: {
    Badge: { Root: GenericBadgeRoot, Group: GenericBadgeGroup },
    Form: { Root: GenericFormRoot, TextInput: GenericFormTextInput },
    Menu: {
      Root: GenericMenuRoot,
      Dropdown: GenericMenuDropdown,
      Divider: GenericMenuDivider,
      Item: GenericMenuItem,
      Label: GenericMenuLabel,
      Trigger: GenericMenuTrigger,
      Button: GenericMenuButton,
    },
    Popover: { Root: GenericPopoverRoot, Content: GenericPopoverContent, Trigger: GenericPopoverTrigger },
    Toolbar: { Root: ToolbarRoot, Button: ToolbarButton, Select: ToolbarSelect },
  },
};

export function BlockNoteComponentsProvider({ children }: { children: ReactNode }) {
  return (
    <ComponentsContext.Provider value={components}>
      {children}
    </ComponentsContext.Provider>
  );
}
