import { scrapeFilm } from "@/lib/letterboxd/film";

async function main() {
  const slugs = process.argv.slice(2);
  const list = slugs.length ? slugs : ["parasite-2019", "psycho", "the-truman-show"];

  for (const slug of list) {
    const t0 = Date.now();
    const f = await scrapeFilm(slug);
    const dt = Date.now() - t0;
    console.log(`[${dt}ms] ${slug} →`, {
      title: f.title,
      year: f.year,
      durationMin: f.durationMin,
      rating: f.rating,
      posterUrl: f.posterUrl ? `${f.posterUrl.slice(0, 60)}...` : null,
    });
  }
}

main().catch((err) => {
  console.error("ERRO:", err);
  process.exit(1);
});
