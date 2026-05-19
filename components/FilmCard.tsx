import { Clock, ExternalLink, Star } from "lucide-react";
import type { FilmResult } from "@/lib/schemas";

export function FilmCard({ film }: { film: FilmResult }) {
  return (
    <a
      href={film.letterboxdUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="card-hover group relative block overflow-hidden rounded-lg bg-surface"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-surface-2">
        {film.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={film.posterUrl}
            alt={film.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-200 group-hover:brightness-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted">
            sem poster
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2">
          <span className="inline-flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            <Clock size={11} />
            {formatDuration(film.duration)}
          </span>
          {film.rating !== null && (
            <span className="inline-flex items-center gap-1 rounded bg-accent/90 px-1.5 py-0.5 text-xs font-bold text-bg">
              <Star size={11} fill="currentColor" />
              {film.rating.toFixed(2)}
            </span>
          )}
        </div>
        <div className="absolute right-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-muted opacity-0 transition group-hover:opacity-100">
          #{film.position}
        </div>
      </div>
      <div className="p-2">
        <div className="flex items-start justify-between gap-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-white">
            {film.title}
          </h3>
          <ExternalLink
            size={12}
            className="mt-0.5 flex-shrink-0 text-muted opacity-0 transition group-hover:opacity-100"
          />
        </div>
        {film.year && (
          <p className="mt-0.5 text-xs text-muted">{film.year}</p>
        )}
      </div>
    </a>
  );
}

function formatDuration(min: number): string {
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m === 0 ? `${h}h` : `${h}h${m}m`;
}
