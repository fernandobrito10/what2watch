import { Loader2 } from "lucide-react";

export function LoadingState({ username }: { username: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <Loader2 className="animate-spin text-accent" size={32} />
      <div className="space-y-1">
        <p className="text-base font-medium text-white">
          raspando a watchlist de <span className="text-accent">{username}</span>...
        </p>
        <p className="text-sm text-muted">
          primeira busca pode levar 30-60s. as próximas são instantâneas pelo cache.
        </p>
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
