"use client";

import { Film } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { ErrorBanner } from "@/components/ErrorBanner";
import { FilmGrid } from "@/components/FilmGrid";
import { Footer } from "@/components/Footer";
import { LangSwitcher } from "@/components/LangSwitcher";
import { LoadingState } from "@/components/LoadingState";
import { SearchForm, type SearchValues } from "@/components/SearchForm";
import { SortControls } from "@/components/SortControls";
import { useT } from "@/lib/i18n";
import { sortFilms } from "@/lib/sort";
import type { ApiError, ApiResponse, SortKey } from "@/lib/schemas";

type State =
  | { kind: "idle" }
  | { kind: "loading"; user: string }
  | { kind: "error"; error: ApiError; lastValues: SearchValues }
  | { kind: "success"; data: ApiResponse };

export default function HomePage() {
  const t = useT();
  const [state, setState] = useState<State>({ kind: "idle" });
  const [sort, setSort] = useState<SortKey>("rating");

  const search = useCallback(async (values: SearchValues) => {
    setState({ kind: "loading", user: values.user });
    try {
      const url = `/api/watchlist?user=${encodeURIComponent(values.user)}&minutes=${values.minutes}`;
      const res = await fetch(url);
      const body = await res.json();
      if (!res.ok) {
        setState({ kind: "error", error: body as ApiError, lastValues: values });
        return;
      }
      setState({ kind: "success", data: body as ApiResponse });
    } catch (err) {
      setState({
        kind: "error",
        error: {
          error: "scrape_failed",
          message: err instanceof Error ? err.message : "network error",
        },
        lastValues: values,
      });
    }
  }, []);

  const sortedFilms = useMemo(() => {
    if (state.kind !== "success") return [];
    const copy = [...state.data.films];
    sortFilms(copy, sort);
    return copy;
  }, [state, sort]);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 flex items-start justify-between gap-4 sm:mb-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Film className="text-accent" size={28} />
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {t("header.brand")}
            </h1>
          </div>
          <p className="max-w-2xl text-sm text-muted sm:text-base">
            {t("header.description")}
          </p>
        </div>
        <LangSwitcher />
      </header>

      <section className="mb-10 rounded-xl border border-border bg-surface/40 p-4 sm:p-6">
        <SearchForm onSubmit={search} loading={state.kind === "loading"} />
      </section>

      <section>
        {state.kind === "loading" && <LoadingState username={state.user} />}

        {state.kind === "error" && (
          <ErrorBanner
            error={state.error}
            onRetry={() => search(state.lastValues)}
          />
        )}

        {state.kind === "success" && (
          <SuccessView
            data={state.data}
            sort={sort}
            onSortChange={setSort}
            sortedFilms={sortedFilms}
          />
        )}
      </section>

      <Footer />
    </main>
  );
}

function SuccessView({
  data,
  sort,
  onSortChange,
  sortedFilms,
}: {
  data: ApiResponse;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  sortedFilms: ApiResponse["films"];
}) {
  const t = useT();
  if (data.matched === 0) {
    return (
      <div className="rounded-lg border border-border bg-surface/40 p-8 text-center">
        <p className="text-base text-white">
          {t("success.noneFound", {
            user: data.username,
            minutes: data.availableMinutes,
          })}
        </p>
        <p className="mt-2 text-sm text-muted">{t("success.noneFoundHint")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {t("success.summary", {
            matched: data.matched,
            total: data.totalInWatchlist,
            minutes: data.availableMinutes,
          })}
        </p>
        <SortControls value={sort} onChange={onSortChange} />
      </div>
      <FilmGrid films={sortedFilms} />
    </div>
  );
}
