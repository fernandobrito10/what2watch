import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { LocaleProvider } from "@/lib/i18n";
import "./globals.css";

export const metadata: Metadata = {
  title: "what2watch — find what to watch from your Letterboxd watchlist",
  description:
    "Enter your Letterboxd username and how much free time you have. We'll show the movies from your watchlist that fit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
        <Analytics />
      </body>
    </html>
  );
}
