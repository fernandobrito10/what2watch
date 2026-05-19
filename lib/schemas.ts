import { z } from "zod";

export const SortKey = z.enum(["rating", "oldest", "newest", "duration"]);
export type SortKey = z.infer<typeof SortKey>;

export const SearchRequest = z.object({
  user: z
    .string()
    .min(1, "informe um usuário")
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/, "username inválido"),
  minutes: z.coerce.number().int().min(1).max(600),
  sort: SortKey.optional().default("rating"),
});
export type SearchRequest = z.infer<typeof SearchRequest>;

export type Film = {
  slug: string;
  title: string;
  year: number | null;
  durationMin: number | null;
  rating: number | null;
  posterUrl: string | null;
  fetchedAt: number;
};

export type WatchlistEntry = {
  slug: string;
  position: number;
};

export type FilmResult = {
  slug: string;
  title: string;
  year: number | null;
  duration: number;
  rating: number | null;
  position: number;
  posterUrl: string | null;
  letterboxdUrl: string;
};

export type ApiResponse = {
  username: string;
  availableMinutes: number;
  totalInWatchlist: number;
  matched: number;
  films: FilmResult[];
};

export type ApiError =
  | { error: "user_not_found"; username: string }
  | { error: "private_watchlist"; username: string }
  | { error: "rate_limited"; retryAfter?: number }
  | { error: "scrape_failed"; message: string }
  | { error: "bad_request"; message: string };
