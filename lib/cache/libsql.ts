import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import type { Film, WatchlistEntry } from "@/lib/schemas";
import {
  type CacheRepository,
  FILM_TTL_MS,
  WATCHLIST_TTL_MS,
} from "./repository";

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS films (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    duration_min INTEGER,
    rating REAL,
    poster_url TEXT,
    fetched_at INTEGER NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS idx_films_fetched ON films(fetched_at)`,
  `CREATE TABLE IF NOT EXISTS watchlists (
    username TEXT NOT NULL,
    slug TEXT NOT NULL,
    position INTEGER NOT NULL,
    PRIMARY KEY (username, slug)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_wl_user ON watchlists(username, position)`,
  `CREATE TABLE IF NOT EXISTS watchlist_meta (
    username TEXT PRIMARY KEY,
    fetched_at INTEGER NOT NULL,
    total_count INTEGER
  )`,
];

export class LibSqlCache implements CacheRepository {
  private client: Client;
  private initPromise: Promise<void> | null = null;

  constructor(url: string, authToken?: string) {
    if (url.startsWith("file:")) {
      const path = url.slice("file:".length);
      if (path) mkdirSync(dirname(path) || ".", { recursive: true });
    }
    this.client = createClient({ url, authToken });
  }

  private ensureSchema(): Promise<void> {
    if (!this.initPromise) {
      this.initPromise = (async () => {
        for (const stmt of SCHEMA) await this.client.execute(stmt);
      })();
    }
    return this.initPromise;
  }

  async getFilm(slug: string): Promise<Film | null> {
    await this.ensureSchema();
    const r = await this.client.execute({
      sql: "SELECT * FROM films WHERE slug = ?",
      args: [slug],
    });
    const row = r.rows[0];
    if (!row) return null;
    const film = rowToFilm(row);
    if (Date.now() - film.fetchedAt > FILM_TTL_MS) return null;
    return film;
  }

  async getFilms(slugs: string[]): Promise<Map<string, Film>> {
    await this.ensureSchema();
    const out = new Map<string, Film>();
    if (slugs.length === 0) return out;
    const placeholders = slugs.map(() => "?").join(",");
    const r = await this.client.execute({
      sql: `SELECT * FROM films WHERE slug IN (${placeholders})`,
      args: slugs,
    });
    const now = Date.now();
    for (const row of r.rows) {
      const film = rowToFilm(row);
      if (now - film.fetchedAt > FILM_TTL_MS) continue;
      out.set(film.slug, film);
    }
    return out;
  }

  async upsertFilms(films: Film[]): Promise<void> {
    await this.ensureSchema();
    if (films.length === 0) return;
    await this.client.batch(
      films.map((f) => ({
        sql: `INSERT INTO films (slug, title, year, duration_min, rating, poster_url, fetched_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(slug) DO UPDATE SET
                title = excluded.title,
                year = excluded.year,
                duration_min = excluded.duration_min,
                rating = excluded.rating,
                poster_url = excluded.poster_url,
                fetched_at = excluded.fetched_at`,
        args: [
          f.slug,
          f.title,
          f.year,
          f.durationMin,
          f.rating,
          f.posterUrl,
          f.fetchedAt,
        ],
      })),
      "write",
    );
  }

  async getWatchlist(username: string): Promise<WatchlistEntry[] | null> {
    await this.ensureSchema();
    const meta = await this.client.execute({
      sql: "SELECT fetched_at FROM watchlist_meta WHERE username = ?",
      args: [username],
    });
    if (meta.rows.length === 0) return null;
    const fetchedAt = Number(meta.rows[0].fetched_at);
    if (Date.now() - fetchedAt > WATCHLIST_TTL_MS) return null;
    const r = await this.client.execute({
      sql: "SELECT slug, position FROM watchlists WHERE username = ? ORDER BY position ASC",
      args: [username],
    });
    return r.rows.map((row) => ({
      slug: String(row.slug),
      position: Number(row.position),
    }));
  }

  async saveWatchlist(
    username: string,
    entries: WatchlistEntry[],
  ): Promise<void> {
    await this.ensureSchema();
    const now = Date.now();
    await this.client.batch(
      [
        { sql: "DELETE FROM watchlists WHERE username = ?", args: [username] },
        ...entries.map((e) => ({
          sql: "INSERT INTO watchlists (username, slug, position) VALUES (?, ?, ?)",
          args: [username, e.slug, e.position],
        })),
        {
          sql: `INSERT INTO watchlist_meta (username, fetched_at, total_count)
                VALUES (?, ?, ?)
                ON CONFLICT(username) DO UPDATE SET
                  fetched_at = excluded.fetched_at,
                  total_count = excluded.total_count`,
          args: [username, now, entries.length],
        },
      ],
      "write",
    );
  }
}

type Row = Record<string, unknown>;

function rowToFilm(row: Row): Film {
  return {
    slug: String(row.slug),
    title: String(row.title),
    year: row.year !== null && row.year !== undefined ? Number(row.year) : null,
    durationMin:
      row.duration_min !== null && row.duration_min !== undefined
        ? Number(row.duration_min)
        : null,
    rating:
      row.rating !== null && row.rating !== undefined
        ? Number(row.rating)
        : null,
    posterUrl:
      row.poster_url !== null && row.poster_url !== undefined
        ? String(row.poster_url)
        : null,
    fetchedAt: Number(row.fetched_at),
  };
}
