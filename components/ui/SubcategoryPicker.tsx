"use client";

import { useState } from "react";
import { useCreateSubcategory, useCategories, useSubcategories } from "@/hooks/queries/useReference";

interface SubcategoryPickerProps {
  categoryIds: number[];
  value: number[];
  onChange: (ids: number[]) => void;
}

export default function SubcategoryPicker({ categoryIds, value, onChange }: SubcategoryPickerProps) {
  const [parentId, setParentId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const { data: rootCategories = [] } = useCategories();
  const { mutateAsync: createSubcategory, isPending: creating } = useCreateSubcategory();

  const selectedParent = parentId ?? (categoryIds.length === 1 ? categoryIds[0] : null);
  const { data: subcategories = [], isPending: loading } = useSubcategories(selectedParent);

  const toggle = (id: number) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };

  const handleParentChange = (id: number) => {
    setParentId(id);
    onChange([]);
  };

  const handleCreate = async () => {
    const name = input.trim();
    if (!name || !selectedParent) return;
    const newSub = await createSubcategory({ parentId: selectedParent, name });
    onChange([...value, newSub.id]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  if (categoryIds.length === 0) {
    return <p className="text-xs text-muted mt-1">Select a category first to see sub-categories.</p>;
  }

  const parentOptions = rootCategories.filter((c) => categoryIds.includes(c.id));
  const canCreate = !!input.trim() && !!selectedParent && !creating;

  return (
    <div className="space-y-2">
      {categoryIds.length > 1 && (
        <select
          className="inp text-xs py-1 h-8 w-auto"
          value={selectedParent ?? ""}
          onChange={(e) => handleParentChange(Number(e.target.value))}
        >
          <option value="" disabled>Select a category…</option>
          {parentOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      )}

      {selectedParent && (
        loading ? (
          <p className="text-xs text-muted pt-1">Loading…</p>
        ) : subcategories.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => toggle(sub.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  value.includes(sub.id)
                    ? "bg-ink text-cream border-ink"
                    : "bg-transparent text-ink border-ink hover:bg-ink/5"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted pt-1">No sub-categories yet — create the first one below.</p>
        )
      )}

      {selectedParent && (
        <div className="flex gap-2 items-center">
          <input
            className="inp text-xs h-8 flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Create new sub-category…"
          />
          <button
            type="button"
            onClick={handleCreate}
            disabled={!canCreate}
            className="text-xs px-3 h-8 border border-ink rounded-full disabled:opacity-40 shrink-0"
          >
            {creating ? "…" : "+ Add"}
          </button>
        </div>
      )}
    </div>
  );
}
