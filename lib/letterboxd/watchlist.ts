import * as cheerio from "cheerio";
import type { WatchlistEntry } from "@/lib/schemas";
import { fetchLetterboxd } from "./client";
import { PrivateWatchlist } from "./errors";

export async function scrapeWatchlist(
  username: string,
): Promise<WatchlistEntry[]> {
  const slugs: string[] = [];
  const seen = new Set<string>();
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const path =
      page === 1
        ? `/${username}/watchlist/`
        : `/${username}/watchlist/page/${page}/`;

    const html = await fetchLetterboxd(path, {
      expect404As: "notFound",
      username,
    });
    const $ = cheerio.load(html);

    if (page === 1 && isPrivateWatchlist($, html)) {
      throw new PrivateWatchlist(username);
    }

    for (const slug of extractSlugsFromPage($)) {
      if (!seen.has(slug)) {
        seen.add(slug);
        slugs.push(slug);
      }
    }

    if (page === 1) {
      totalPages = extractTotalPages($, username);
    }

    page++;
  }

  return slugs.map((slug, idx) => ({ slug, position: idx + 1 }));
}

function extractSlugsFromPage($: cheerio.CheerioAPI): string[] {
  const slugs: string[] = [];
  $("[data-item-slug]").each((_i, el) => {
    const slug = $(el).attr("data-item-slug");
    if (slug) slugs.push(slug);
  });
  if (slugs.length > 0) return slugs;

  $("a[href^='/film/']").each((_i, el) => {
    const href = $(el).attr("href") ?? "";
    const m = href.match(/^\/film\/([^/]+)\/?/);
    if (m) slugs.push(m[1]);
  });
  return slugs;
}

function extractTotalPages(
  $: cheerio.CheerioAPI,
  username: string,
): number {
  let max = 1;
  const prefix = `/${username}/watchlist/page/`;
  $("a[href]").each((_i, el) => {
    const href = $(el).attr("href") ?? "";
    if (!href.startsWith(prefix)) return;
    const m = href.match(/\/page\/(\d+)\/?$/);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return max;
}

function isPrivateWatchlist($: cheerio.CheerioAPI, html: string): boolean {
  if ($("[data-item-slug]").length > 0) return false;
  if (
    html.includes("their watchlist is private") ||
    html.includes("This member's watchlist is private") ||
    html.includes("watchlist is private")
  ) {
    return true;
  }
  return false;
}
