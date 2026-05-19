import { scrapeWatchlist } from "@/lib/letterboxd/watchlist";

async function main() {
  const user = process.argv[2] ?? "dave";
  console.log(`raspando watchlist de "${user}"...`);
  const t0 = Date.now();
  const entries = await scrapeWatchlist(user);
  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`encontrados ${entries.length} filmes em ${dt}s`);
  console.log("primeiros 5:", entries.slice(0, 5));
  console.log("últimos 3:", entries.slice(-3));
}

main().catch((err) => {
  console.error("ERRO:", err);
  process.exit(1);
});
