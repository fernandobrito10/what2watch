"use client";

import { Clock, Search, User } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { useT } from "@/lib/i18n";

export type SearchValues = {
  user: string;
  minutes: number;
};

type Props = {
  onSubmit: (values: SearchValues) => void;
  loading: boolean;
  initialUser?: string;
};

type Mode = "minutes" | "until";

export function SearchForm({ onSubmit, loading, initialUser = "" }: Props) {
  const t = useT();
  const [user, setUser] = useState(initialUser);
  const [mode, setMode] = useState<Mode>("minutes");
  const [minutes, setMinutes] = useState(120);
  const [untilTime, setUntilTime] = useState(defaultUntilTime());
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user.trim()) {
      setError(t("form.errorNoUser"));
      return;
    }
    const mins = mode === "minutes" ? minutes : minutesUntil(untilTime);
    if (mins < 1) {
      setError(
        mode === "until" ? t("form.errorTimePast") : t("form.errorTimeZero"),
      );
      return;
    }
    if (mins > 600) {
      setError(t("form.errorTooLong"));
      return;
    }
    onSubmit({ user: user.trim(), minutes: mins });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {t("form.userLabel")}
          </span>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              size={18}
            />
            <input
              autoFocus
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder={t("form.userPlaceholder")}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="w-full rounded-lg border border-border bg-surface px-10 py-3 text-base text-white outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
              letterboxd.com/<span className="text-accent-2">{user || "..."}</span>
            </span>
          </div>
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wider text-muted">
            {t("form.timeLabel")}
          </span>
          <div className="flex gap-2">
            <ModeToggle mode={mode} setMode={setMode} />
            {mode === "minutes" ? (
              <div className="relative w-32">
                <Clock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={16}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={600}
                  value={minutes}
                  onChange={(e) =>
                    setMinutes(parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full rounded-lg border border-border bg-surface px-9 py-3 text-base text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">
                  {t("form.minSuffix")}
                </span>
              </div>
            ) : (
              <div className="relative w-44">
                <Clock
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                  size={16}
                />
                <input
                  type="time"
                  value={untilTime}
                  onChange={(e) => setUntilTime(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface py-3 pl-9 pr-3 text-base text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-accent-3" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={clsx(
          "group flex items-center justify-center gap-2 self-start rounded-lg bg-accent px-6 py-3 text-base font-semibold text-bg transition",
          "hover:bg-accent/90 active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <Search size={18} />
        {loading ? t("form.searchingButton") : t("form.searchButton")}
      </button>
    </form>
  );
}

function ModeToggle({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (m: Mode) => void;
}) {
  const t = useT();
  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-1">
      <button
        type="button"
        onClick={() => setMode("minutes")}
        className={clsx(
          "rounded-md px-3 py-2 text-xs font-medium transition",
          mode === "minutes"
            ? "bg-accent text-bg"
            : "text-muted hover:text-white",
        )}
      >
        {t("form.modeMinutes")}
      </button>
      <button
        type="button"
        onClick={() => setMode("until")}
        className={clsx(
          "rounded-md px-3 py-2 text-xs font-medium transition",
          mode === "until" ? "bg-accent text-bg" : "text-muted hover:text-white",
        )}
      >
        {t("form.modeUntil")}
      </button>
    </div>
  );
}

function defaultUntilTime(): string {
  const d = new Date();
  d.setHours(d.getHours() + 2);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function minutesUntil(hhmm: string): number {
  const [h, m] = hhmm.split(":").map((s) => parseInt(s, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return 0;
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target.setDate(target.getDate() + 1);
  }
  return Math.floor((target.getTime() - now.getTime()) / 60000);
}
