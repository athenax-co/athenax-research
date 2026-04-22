"use client";

import React from "react";
import { Dialog as BaseDialog } from "@base-ui/react";
import TrafficLights from "./TrafficLights";

// ─── Dialog ──────────────────────────────────────────────────────────────────

function Dialog({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <BaseDialog.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      {children}
    </BaseDialog.Root>
  );
}

// ─── DialogTrigger ───────────────────────────────────────────────────────────

const DialogTrigger = BaseDialog.Trigger;

// ─── DialogPortal ─────────────────────────────────────────────────────────────

const DialogPortal = BaseDialog.Portal;

// ─── DialogOverlay ────────────────────────────────────────────────────────────

function DialogOverlay({ className }: { className?: string }) {
  return (
    <BaseDialog.Backdrop
      className={[
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px]",
        // Base UI often adds tracking classes we can optionally hook into
        // for animation, but transition utilities work too:
        "transition-opacity duration-200",
        "data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

// ─── DialogContent ────────────────────────────────────────────────────────────

function DialogContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <BaseDialog.Popup
        className={[
          // positioning
          "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
          // sizing
          "w-full max-w-lg max-h-[90vh] overflow-y-auto outline-none",
          // design — matches existing AthenaX window-card aesthetic
          "bg-cream border-2 border-ink rounded-[14px]",
          "shadow-[8px_8px_0_#1c1c27]",
          // animations
          "transition-all duration-200",
          "data-ending-style:opacity-0 data-starting-style:opacity-0",
          "data-ending-style:scale-95 data-starting-style:scale-95",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </BaseDialog.Popup>
    </DialogPortal>
  );
}

// ─── DialogHeader ─────────────────────────────────────────────────────────────

function DialogHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["flex items-center justify-between px-5 py-4", "border-b-2 border-ink bg-cream", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

// ─── DialogTitle ──────────────────────────────────────────────────────────────

function DialogTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <BaseDialog.Title className={["font-mono text-[10px] tracking-widest uppercase text-ink", className].filter(Boolean).join(" ")}>
      {children}
    </BaseDialog.Title>
  );
}

// ─── DialogDescription ────────────────────────────────────────────────────────

function DialogDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <BaseDialog.Description className={["text-sm text-muted mt-1", className].filter(Boolean).join(" ")}>{children}</BaseDialog.Description>;
}

// ─── DialogBody ───────────────────────────────────────────────────────────────

function DialogBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={["px-5 py-6", className].filter(Boolean).join(" ")}>{children}</div>;
}

// ─── DialogFooter ─────────────────────────────────────────────────────────────

function DialogFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={["flex items-center justify-end gap-2.5 px-5 py-4", "border-t-2 border-ink", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

// ─── DialogClose ──────────────────────────────────────────────────────────────

function DialogClose({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <BaseDialog.Close
      className={["text-ink text-xl leading-none cursor-pointer", "hover:opacity-60 transition-opacity", className].filter(Boolean).join(" ")}
    >
      {children ?? "×"}
    </BaseDialog.Close>
  );
}

// ─── Traffic-lights decoration (matches existing Modal aesthetic) ─────────────

function DialogTrafficLights() {
  return <TrafficLights className="gap-2" />;
}

// ─── exports ──────────────────────────────────────────────────────────────────

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter,
  DialogClose,
  DialogTrafficLights,
};
