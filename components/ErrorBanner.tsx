import { AlertCircle, RefreshCcw } from "lucide-react";
import type { ApiError } from "@/lib/schemas";

type Props = {
  error: ApiError;
  onRetry?: () => void;
};

export function ErrorBanner({ error, onRetry }: Props) {
  const { title, message } = describe(error);
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
          tentar de novo
        </button>
      )}
    </div>
  );
}

function describe(err: ApiError): { title: string; message: string } {
  switch (err.error) {
    case "user_not_found":
      return {
        title: "usuário não encontrado",
        message: `não achei "${err.username}" no Letterboxd. confere se escreveu certo.`,
      };
    case "private_watchlist":
      return {
        title: "watchlist privada",
        message: `a watchlist de "${err.username}" não está pública. peça pra ela liberar nas configurações de privacidade do Letterboxd.`,
      };
    case "rate_limited":
      return {
        title: "Letterboxd pediu pra esperar",
        message: err.retryAfter
          ? `o Letterboxd está limitando requisições. tente de novo em ${err.retryAfter}s.`
          : "o Letterboxd está limitando requisições. tente de novo em alguns minutos.",
      };
    case "scrape_failed":
      return {
        title: "deu ruim no scraping",
        message: err.message || "tente de novo em alguns instantes.",
      };
    case "bad_request":
      return {
        title: "input inválido",
        message: err.message,
      };
  }
}
