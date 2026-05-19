"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_LOCALE, type Locale, messages } from "./messages";

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "what2watch.locale";

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let next: Locale | null = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "pt") next = stored;
    } catch {}
    if (!next && typeof navigator !== "undefined") {
      const lang = navigator.language?.toLowerCase() ?? "";
      if (lang.startsWith("pt")) next = "pt";
    }
    if (next && next !== locale) setLocaleState(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale === "pt" ? "pt-BR" : "en";
    }
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  }, []);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      const parts = key.split(".");
      let value: unknown = messages[locale];
      for (const p of parts) {
        if (value && typeof value === "object" && p in (value as object)) {
          value = (value as Record<string, unknown>)[p];
        } else {
          value = undefined;
          break;
        }
      }
      if (typeof value !== "string") return key;
      if (!vars) return value;
      return Object.entries(vars).reduce(
        (acc, [k, v]) => acc.split(`{${k}}`).join(String(v)),
        value,
      );
    },
    [locale],
  );

  const ctx = useMemo<Ctx>(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return (
    <LocaleContext.Provider value={ctx}>{children}</LocaleContext.Provider>
  );
}

export function useI18n(): Ctx {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useI18n must be used inside LocaleProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}

export function useLocale() {
  const { locale, setLocale } = useI18n();
  return { locale, setLocale };
}

export type { Locale } from "./messages";
