import type { CacheRepository } from "./repository";
import { LibSqlCache } from "./libsql";

let cached: CacheRepository | null = null;

export function getCache(): CacheRepository {
  if (cached) return cached;
  const url = process.env.LIBSQL_URL ?? defaultUrl();
  const authToken = process.env.LIBSQL_AUTH_TOKEN;
  cached = new LibSqlCache(url, authToken);
  return cached;
}

function defaultUrl(): string {
  if (process.env.VERCEL) return "file:/tmp/cache.db";
  return "file:./data/cache.db";
}
