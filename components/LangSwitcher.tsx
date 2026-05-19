"use client";

import clsx from "clsx";
import { useI18n } from "@/lib/i18n";

export function LangSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1"
      role="group"
      aria-label="language"
    >
      <FlagButton
        active={locale === "en"}
        onClick={() => setLocale("en")}
        label={t("lang.english")}
      >
        <UsFlag />
      </FlagButton>
      <FlagButton
        active={locale === "pt"}
        onClick={() => setLocale("pt")}
        label={t("lang.portuguese")}
      >
        <BrFlag />
      </FlagButton>
    </div>
  );
}

function FlagButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={clsx(
        "flex h-7 w-9 items-center justify-center overflow-hidden rounded-full transition",
        active
          ? "ring-2 ring-accent"
          : "opacity-50 grayscale hover:opacity-100 hover:grayscale-0",
      )}
    >
      {children}
    </button>
  );
}

function UsFlag() {
  return (
    <svg
      viewBox="0 0 19 10"
      width="22"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="19" height="10" fill="#B22234" />
      <path
        d="M0,1.15 H19 M0,2.31 H19 M0,3.46 H19 M0,4.62 H19 M0,5.77 H19 M0,6.92 H19 M0,8.08 H19 M0,9.23 H19"
        stroke="#fff"
        strokeWidth="0.77"
      />
      <rect width="7.6" height="5.38" fill="#3C3B6E" />
    </svg>
  );
}

function BrFlag() {
  return (
    <svg
      viewBox="0 0 20 14"
      width="22"
      height="16"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="20" height="14" fill="#009C3B" />
      <path d="M10,1.5 L18.2,7 L10,12.5 L1.8,7 Z" fill="#FFDF00" />
      <circle cx="10" cy="7" r="2.6" fill="#002776" />
    </svg>
  );
}
