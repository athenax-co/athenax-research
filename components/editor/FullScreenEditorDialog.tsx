"use client";

import dynamic from "next/dynamic";
import { Dialog as BaseDialog } from "@base-ui/react";
import TrafficLights from "@/components/ui/TrafficLights";
import { Logo } from "@/components/layout/Navbar";
import { Button } from "../ui/button";

const PaperEditor = dynamic(() => import("./PaperEditor"), { ssr: false });

interface FullScreenEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onChange: (json: string) => void;
}

export function FullScreenEditorDialog({ open, onOpenChange, value, onChange }: FullScreenEditorDialogProps) {
  return (
    <BaseDialog.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <BaseDialog.Portal>
        <BaseDialog.Popup className="fixed inset-0 z-200 flex flex-col bg-white outline-none transition-all duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0">
          {/* Title bar — matches .window-titlebar exactly */}
          <div className="window-titlebar justify-between">
            {/* Left: traffic lights + label */}
            <div className="flex items-center gap-0">
              <TrafficLights />
              <span className="titlebar-label">PAPER_CONTENT.SYS</span>
            </div>

            {/* Center: AthenaX logo */}
            <Logo />

            {/* Right: close + save */}
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => onOpenChange(false)} aria-label="Close editor">
                ×
              </Button>
              <Button size="sm" onClick={() => onOpenChange(false)}>
                Save &amp; Close →
              </Button>
            </div>
          </div>

          {/* Editor surface */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto max-w-3xl px-6 py-10">
              {open && <PaperEditor key="fullscreen-editor" onChange={onChange} initialContent={value || undefined} />}
            </div>
          </div>
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
