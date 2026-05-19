import pLimit from "p-limit";
import { getCache } from "@/lib/cache";
import { scrapeWatchlist } from "@/lib/letterboxd/watchlist";
import { scrapeFilm } from "@/lib/letterboxd/film";
import { sortFilms } from "@/lib/sort";
import type {
  Film,
  FilmResult,
  SortKey,
  WatchlistEntry,
} from "@/lib/schemas";

const SCRAPE_CONCURRENCY = 6;

export type PipelineResult = {
  username: string;
  totalInWatchlist: number;
  matched: number;
  films: FilmResult[];
};

export async function fetchAndRank(
  username: string,
  availableMinutes: number,
  sort: SortKey,
): Promise<PipelineResult> {
  const cache = getCache();

  let entries = await cache.getWatchlist(username);
  if (!entries) {
    entries = await scrapeWatchlist(username);
    await cache.saveWatchlist(username, entries);
  }

  const slugs = entries.map((e) => e.slug);
  const cached = await cache.getFilms(slugs);
  const missing = slugs.filter((s) => !cached.has(s));

  if (missing.length > 0) {
    const limit = pLimit(SCRAPE_CONCURRENCY);
    const scraped = await Promise.all(
      missing.map((slug) =>
        limit(async () => {
          try {
            return await scrapeFilm(slug);
          } catch (err) {
            console.error(`[scrapeFilm] ${slug} falhou:`, err);
            return null;
          }
        }),
      ),
    );
    const ok = scraped.filter((f): f is Film => f !== null);
    if (ok.length > 0) await cache.upsertFilms(ok);
    for (const f of ok) cached.set(f.slug, f);
  }

  const results: FilmResult[] = [];
  for (const entry of entries) {
    const film = cached.get(entry.slug);
    if (!film) continue;
    if (film.durationMin === null) continue;
    if (film.durationMin > availableMinutes) continue;
    results.push({
      slug: film.slug,
      title: film.title,
      year: film.year,
      duration: film.durationMin,
      rating: film.rating,
      position: entry.position,
      posterUrl: film.posterUrl,
      letterboxdUrl: `https://letterboxd.com/film/${film.slug}/`,
    });
  }

  sortFilms(results, sort);

  return {
    username,
    totalInWatchlist: entries.length,
    matched: results.length,
    films: results,
  };
}

export type { WatchlistEntry };
