"use client";

import { useState } from "react";
import { useCategories } from "@/hooks/queries/useReference";

interface CategorySelectorProps {
  onChangeIds: (ids: number[]) => void;
}

export default function CategorySelector({ onChangeIds }: CategorySelectorProps) {
  const { data: categories = [] } = useCategories();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggle = (id: number) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    setSelectedIds(next);
    onChangeIds(next);
  };

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {categories.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => toggle(c.id)}
          className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
            selectedIds.includes(c.id)
              ? "bg-ink text-cream border-ink"
              : "bg-transparent text-ink border-ink hover:bg-ink/5"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}
