import pRetry from "p-retry";
import { LetterboxdNotFound, RateLimited, ScrapeFailed } from "./errors";

const BASE_URL = "https://letterboxd.com";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

type FetchOptions = {
  expect404As?: "notFound" | "throw";
  username?: string;
};

export async function fetchLetterboxd(
  path: string,
  opts: FetchOptions = {},
): Promise<string> {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  return pRetry(
    async () => {
      const res = await fetch(url, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,pt-BR;q=0.8",
        },
        redirect: "follow",
      });

      if (res.status === 404) {
        if (opts.expect404As === "notFound") {
          throw new LetterboxdNotFound(opts.username ?? "desconhecido");
        }
        throw new ScrapeFailed(`404 em ${url}`);
      }

      if (res.status === 429 || res.status === 503) {
        const retryAfter = Number(res.headers.get("retry-after")) || undefined;
        throw new RateLimited(retryAfter);
      }

      if (!res.ok) {
        throw new ScrapeFailed(`HTTP ${res.status} em ${url}`);
      }

      return res.text();
    },
    {
      retries: 3,
      minTimeout: 800,
      factor: 2,
      shouldRetry: (err) => err instanceof RateLimited,
    },
  );
}
