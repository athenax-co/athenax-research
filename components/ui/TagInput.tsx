"use client";

import { useRef } from "react";

interface TagInputProps {
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addAnother?: string;
}

export default function TagInput({ value, onChange, placeholder = "Type and press Enter", addAnother = "Add another…" }: TagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const add = (raw: string) => {
    const tags = raw.split(/[,;]+/).map((t) => t.trim()).filter(Boolean);
    const next = [...value];
    for (const tag of tags) {
      if (!next.includes(tag)) next.push(tag);
    }
    if (next.length !== value.length) onChange(next);
  };

  const remove = (i: number) => onChange(value.filter((_, j) => j !== i));

  return (
    <div
      className="inp flex flex-wrap gap-1.5 min-h-10 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded bg-[#F0EDE8] px-2 py-0.5 text-sm font-medium">
          {tag}
          <button type="button" className="text-muted hover:text-foreground leading-none" onClick={() => remove(i)}>
            ×
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        className="flex-1 min-w-32 bg-transparent outline-none text-sm placeholder:text-muted"
        placeholder={value.length === 0 ? placeholder : addAnother}
        onKeyDown={(e) => {
          const val = e.currentTarget.value.trim();
          if ((e.key === "Enter" || e.key === ",") && val) {
            e.preventDefault();
            add(val);
            e.currentTarget.value = "";
          } else if (e.key === "Backspace" && !e.currentTarget.value && value.length > 0) {
            remove(value.length - 1);
          }
        }}
        onPaste={(e) => {
          const text = e.clipboardData.getData("text");
          if (/[,;]/.test(text)) {
            e.preventDefault();
            add(e.currentTarget.value + text);
            e.currentTarget.value = "";
          }
        }}
        onBlur={(e) => {
          if (e.currentTarget.value.trim()) {
            add(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}
