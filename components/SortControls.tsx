"use client";

import {
  ArrowDownNarrowWide,
  Clock,
  History,
  Sparkles,
  Star,
} from "lucide-react";
import clsx from "clsx";
import type { SortKey } from "@/lib/schemas";
import { useT } from "@/lib/i18n";

type Props = {
  value: SortKey;
  onChange: (next: SortKey) => void;
};

const OPTIONS: { key: SortKey; messageKey: string; Icon: typeof Star }[] = [
  { key: "rating", messageKey: "sort.rating", Icon: Star },
  { key: "oldest", messageKey: "sort.oldest", Icon: History },
  { key: "newest", messageKey: "sort.newest", Icon: Sparkles },
  { key: "duration", messageKey: "sort.duration", Icon: Clock },
];

export function SortControls({ value, onChange }: Props) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted">
        <ArrowDownNarrowWide size={14} />
        {t("sort.label")}
      </span>
      {OPTIONS.map(({ key, messageKey, Icon }) => (
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
          {t(messageKey)}
        </button>
      ))}
    </div>
  );
}
