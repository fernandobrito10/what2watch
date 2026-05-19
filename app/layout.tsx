import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "O Que Assistir — filmes da sua watchlist do Letterboxd que cabem no seu tempo",
  description:
    "Diga seu usuário do Letterboxd e quanto tempo você tem livre. A gente te mostra os filmes da sua watchlist que dão pra assistir hoje.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
