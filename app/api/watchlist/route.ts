import { NextResponse } from "next/server";
import { fetchAndRank } from "@/lib/pipeline";
import { SearchRequest, type ApiError } from "@/lib/schemas";
import {
  LetterboxdNotFound,
  PrivateWatchlist,
  RateLimited,
  ScrapeFailed,
} from "@/lib/letterboxd/errors";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = {
    user: searchParams.get("user") ?? "",
    minutes: searchParams.get("minutes") ?? "",
    sort: searchParams.get("sort") ?? undefined,
  };

  const parsed = SearchRequest.safeParse(raw);
  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    return errorResponse(400, { error: "bad_request", message });
  }

  const { user, minutes, sort } = parsed.data;

  try {
    const result = await fetchAndRank(user, minutes, sort);
    return NextResponse.json({
      ...result,
      availableMinutes: minutes,
    });
  } catch (err) {
    if (err instanceof LetterboxdNotFound) {
      return errorResponse(404, { error: "user_not_found", username: user });
    }
    if (err instanceof PrivateWatchlist) {
      return errorResponse(403, { error: "private_watchlist", username: user });
    }
    if (err instanceof RateLimited) {
      return errorResponse(429, {
        error: "rate_limited",
        retryAfter: err.retryAfter,
      });
    }
    if (err instanceof ScrapeFailed) {
      return errorResponse(500, {
        error: "scrape_failed",
        message: err.message,
      });
    }
    console.error("[/api/watchlist] erro inesperado:", err);
    return errorResponse(500, {
      error: "scrape_failed",
      message: err instanceof Error ? err.message : "erro desconhecido",
    });
  }
}

function errorResponse(status: number, body: ApiError) {
  return NextResponse.json(body, { status });
}
