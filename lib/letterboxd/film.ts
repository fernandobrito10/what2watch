import * as cheerio from "cheerio";
import type { Film } from "@/lib/schemas";
import { fetchLetterboxd } from "./client";

export async function scrapeFilm(slug: string): Promise<Film> {
  const html = await fetchLetterboxd(`/film/${slug}/`);
  const $ = cheerio.load(html);

  return {
    slug,
    title: extractTitle($) ?? slug,
    year: extractYear($),
    durationMin: extractDuration($, html),
    rating: extractRating($),
    posterUrl: extractPoster($),
    fetchedAt: Date.now(),
  };
}

function extractTitle($: cheerio.CheerioAPI): string | null {
  const og = $('meta[property="og:title"]').attr("content");
  if (og) {
    return og.replace(/\s*\(\d{4}\)\s*$/, "").trim() || null;
  }
  const h1 = $("h1.headline-1, h1.film-title-wrapper, .filmtitle").first().text().trim();
  return h1 || null;
}

function extractYear($: cheerio.CheerioAPI): number | null {
  const og = $('meta[property="og:title"]').attr("content") ?? "";
  const m = og.match(/\((\d{4})\)\s*$/);
  if (m) return parseInt(m[1], 10);
  const releaseYear = $(".releaseyear a, .number a").first().text().trim();
  if (/^\d{4}$/.test(releaseYear)) return parseInt(releaseYear, 10);
  return null;
}

function extractDuration(
  $: cheerio.CheerioAPI,
  html: string,
): number | null {
  const footer = $("p.text-link.text-footer").text();
  let m = footer.match(/(\d+)\s*(?:mins|min)\b/i);
  if (m) return parseInt(m[1], 10);
  m = html.match(/(\d+)(?:&nbsp;|\xa0|\s)*mins/i);
  if (m) return parseInt(m[1], 10);
  return null;
}

function extractRating($: cheerio.CheerioAPI): number | null {
  const meta = $('meta[name="twitter:data2"]').attr("content");
  if (meta) {
    const m = meta.match(/(\d+(?:\.\d+)?)/);
    if (m) {
      const v = parseFloat(m[1]);
      if (!Number.isNaN(v) && v >= 0 && v <= 5) return v;
    }
  }
  const og = $('meta[name="twitter:label2"]').attr("content");
  if (og && og.toLowerCase().includes("rating")) {
    const data = $('meta[name="twitter:data2"]').attr("content") ?? "";
    const v = parseFloat(data);
    if (!Number.isNaN(v)) return v;
  }
  return null;
}

function extractPoster($: cheerio.CheerioAPI): string | null {
  const og = $('meta[property="og:image"]').attr("content");
  if (og && !og.includes("empty-poster")) return og;
  return null;
}
