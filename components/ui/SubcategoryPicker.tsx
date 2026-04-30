"use client";

import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useCreateSubcategory, useCategories } from "@/hooks/queries/useReference";
import { getSubcategories } from "@/api/reference";
import type { CategoryOut } from "@/types/reference";

interface SubcategoryPickerProps {
  categoryIds: number[];
  value: number[];
  onChange: (ids: number[]) => void;
}

export default function SubcategoryPicker({ categoryIds, value, onChange }: SubcategoryPickerProps) {
  const [input, setInput] = useState("");
  const [createParentId, setCreateParentId] = useState<number | "">("");
  const { data: rootCategories = [] } = useCategories();
  const { mutateAsync: createSubcategory, isPending: creating } = useCreateSubcategory();

  const results = useQueries({
    queries: categoryIds.map((id) => ({
      queryKey: ["subcategories", id],
      queryFn: () => getSubcategories(id),
      staleTime: 2 * 60 * 1000,
    })),
  });

  const allSubcategories: CategoryOut[] = [];
  const seen = new Set<number>();
  for (const result of results) {
    for (const sub of result.data ?? []) {
      if (!seen.has(sub.id)) {
        seen.add(sub.id);
        allSubcategories.push(sub);
      }
    }
  }

  const isLoading = results.some((r) => r.isPending);

  const toggle = (id: number) => {
    onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  };

  const effectiveParentId = categoryIds.length === 1 ? categoryIds[0] : (createParentId !== "" ? createParentId : null);

  const handleCreate = async () => {
    const name = input.trim();
    if (!name || !effectiveParentId) return;
    const newSub = await createSubcategory({ parentId: effectiveParentId, name });
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

  const selectedParentNames = rootCategories
    .filter((c) => categoryIds.includes(c.id))
    .map((c) => ({ id: c.id, name: c.name }));

  const canCreate = !!input.trim() && !!effectiveParentId && !creating;

  return (
    <div className="space-y-2">
      {isLoading ? (
        <p className="text-xs text-muted">Loading…</p>
      ) : allSubcategories.length > 0 ? (
        <div className="flex flex-wrap gap-2 pt-1">
          {allSubcategories.map((sub) => (
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
      )}

      <div className="flex gap-2 items-center">
        {categoryIds.length > 1 && (
          <select
            className="inp text-xs py-1 h-8 w-auto"
            value={createParentId}
            onChange={(e) => setCreateParentId(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">Under…</option>
            {selectedParentNames.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        )}
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
    </div>
  );
}
