"use client";

import { Github, Heart, Linkedin, Mail } from "lucide-react";
import { useT } from "@/lib/i18n";

const SOCIALS = [
  {
    href: "https://github.com/fernandobrito10",
    labelKey: "footer.githubLabel",
    Icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/fernando-brito-b80518236/",
    labelKey: "footer.linkedinLabel",
    Icon: Linkedin,
  },
  {
    href: "mailto:fernandocob29@gmail.com",
    labelKey: "footer.emailLabel",
    Icon: Mail,
  },
];

export function Footer() {
  const t = useT();
  return (
    <footer className="mt-16 border-t border-border/60 pt-8 pb-4">
      <div className="flex flex-col items-center justify-center gap-4 text-sm text-muted sm:flex-row sm:gap-6">
        <p className="inline-flex items-center gap-1.5">
          <span>{t("footer.madeWithBy")}</span>
          <Heart
            size={14}
            className="text-accent-3"
            fill="currentColor"
            aria-label="love"
          />
          <span>{t("footer.by")}</span>
          <span className="font-semibold text-white">
            {t("footer.author")}
          </span>
        </p>
        <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
        <ul className="flex items-center gap-3">
          {SOCIALS.map(({ href, labelKey, Icon }) => {
            const label = t(labelKey);
            const external = href.startsWith("http");
            return (
              <li key={href}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  title={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted transition hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  <Icon size={16} />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
