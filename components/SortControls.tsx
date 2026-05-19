"use client";

import { ArrowDownNarrowWide, Clock, History, Sparkles, Star } from "lucide-react";
import clsx from "clsx";
import type { SortKey } from "@/lib/schemas";

type Props = {
  value: SortKey;
  onChange: (next: SortKey) => void;
};

const OPTIONS: { key: SortKey; label: string; Icon: typeof Star }[] = [
  { key: "rating", label: "melhor nota", Icon: Star },
  { key: "oldest", label: "há mais tempo", Icon: History },
  { key: "newest", label: "adicionados recente", Icon: Sparkles },
  { key: "duration", label: "mais curtos", Icon: Clock },
];

export function SortControls({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted">
        <ArrowDownNarrowWide size={14} />
        ordenar por
      </span>
      {OPTIONS.map(({ key, label, Icon }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={clsx(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition",
            value === key
              ? "border-accent bg-accent/10 text-accent"
              : "border-border bg-surface text-muted hover:border-accent-2 hover:text-white",
          )}
        >
          <Icon size={12} />
          {label}
        </button>
      ))}
    </div>
  );
}
