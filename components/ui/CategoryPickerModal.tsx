"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogTrafficLights } from "@/components/ui/Dialog";
import { useCategories } from "@/hooks/queries/useReference";
import { useSetUserCategories } from "@/hooks/queries/useAuth";

interface CategoryPickerModalProps {
  open: boolean;
  userId: number;
  onDone: () => void;
}

export default function CategoryPickerModal({ open, userId, onDone }: CategoryPickerModalProps) {
  const { data: categories = [] } = useCategories();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { mutate: saveCategories, isPending } = useSetUserCategories();

  const toggle = (id: number) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleSave = () => {
    if (selectedIds.length === 0) { onDone(); return; }
    saveCategories({ userId, categoryIds: selectedIds }, { onSettled: onDone });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-1">
            <DialogTrafficLights />
            <DialogTitle>RESEARCH_INTERESTS.SYS</DialogTitle>
          </div>
        </DialogHeader>

        <DialogBody>
          <p className="text-sm text-subtle mb-1">What are your research interests?</p>
          <p className="text-xs text-muted mb-4">This helps us personalise your experience. You can change these later.</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((c) => {
              const selected = selectedIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    selected
                      ? "bg-ink text-cream border-ink"
                      : "bg-transparent text-ink border-ink hover:bg-ink/5"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>

          <button
            className="btn btn-primary w-full justify-center"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? <span className="spinner" /> : selectedIds.length > 0 ? "Save & Continue →" : "Skip →"}
          </button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
