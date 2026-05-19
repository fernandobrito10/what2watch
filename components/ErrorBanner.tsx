"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import type { ApiError } from "@/lib/schemas";
import { useT } from "@/lib/i18n";

type Props = {
  error: ApiError;
  onRetry?: () => void;
};

export function ErrorBanner({ error, onRetry }: Props) {
  const t = useT();
  const { title, message } = describe(error, t);
  return (
    <div className="flex items-start gap-3 rounded-lg border border-accent-3/30 bg-accent-3/10 p-4">
      <AlertCircle className="mt-0.5 flex-shrink-0 text-accent-3" size={20} />
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold text-accent-3">{title}</h3>
        <p className="text-sm text-white/80">{message}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-md border border-accent-3/40 px-3 py-1.5 text-xs font-medium text-accent-3 transition hover:bg-accent-3/20"
        >
          <RefreshCcw size={12} />
          {t("errors.retry")}
        </button>
      )}
    </div>
  );
}

type T = (key: string, vars?: Record<string, string | number>) => string;

function describe(err: ApiError, t: T): { title: string; message: string } {
  switch (err.error) {
    case "user_not_found":
      return {
        title: t("errors.userNotFoundTitle"),
        message: t("errors.userNotFound", { user: err.username }),
      };
    case "private_watchlist":
      return {
        title: t("errors.privateTitle"),
        message: t("errors.private", { user: err.username }),
      };
    case "rate_limited":
      return {
        title: t("errors.rateLimitedTitle"),
        message: err.retryAfter
          ? t("errors.rateLimited", { sec: err.retryAfter })
          : t("errors.rateLimitedNoSec"),
      };
    case "scrape_failed":
      return {
        title: t("errors.scrapeFailedTitle"),
        message: err.message || t("errors.scrapeFailed"),
      };
    case "bad_request":
      return {
        title: t("errors.badRequestTitle"),
        message: err.message,
      };
  }
}
