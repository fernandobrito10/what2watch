import type { Film, WatchlistEntry } from "@/lib/schemas";

export const FILM_TTL_MS = 30 * 24 * 60 * 60 * 1000;
export const WATCHLIST_TTL_MS = 6 * 60 * 60 * 1000;

export interface CacheRepository {
  getFilm(slug: string): Promise<Film | null>;
  getFilms(slugs: string[]): Promise<Map<string, Film>>;
  upsertFilms(films: Film[]): Promise<void>;
  getWatchlist(username: string): Promise<WatchlistEntry[] | null>;
  saveWatchlist(username: string, entries: WatchlistEntry[]): Promise<void>;
}
