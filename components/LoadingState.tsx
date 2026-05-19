"use client";

import { Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n";

export function LoadingState({ username }: { username: string }) {
  const t = useT();
  const title = t("loading.title", { user: username });
  const subtitle = t("loading.subtitle");
  const [before, after] = title.split(username);
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Loader2 className="animate-spin text-accent" size={32} />
      <div className="space-y-1">
        <p className="text-base font-medium text-white">
          {before}
          <span className="text-accent">{username}</span>
          {after}
        </p>
        <p className="text-sm text-muted">{subtitle}</p>
      </div>
      <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] animate-pulse rounded-lg bg-surface"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
