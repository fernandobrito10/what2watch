import { createClient } from "@libsql/client";

async function main() {
  const user = process.argv[2];
  if (!user) {
    console.error("uso: tsx scripts/clear-user-cache.ts <username>");
    process.exit(1);
  }
  const client = createClient({ url: "file:./data/cache.db" });
  const r1 = await client.execute({
    sql: "DELETE FROM watchlists WHERE username = ?",
    args: [user],
  });
  const r2 = await client.execute({
    sql: "DELETE FROM watchlist_meta WHERE username = ?",
    args: [user],
  });
  console.log(
    `removidas ${r1.rowsAffected} entradas e ${r2.rowsAffected} meta para "${user}"`,
  );
  client.close();
}

main().catch((err) => {
  console.error("ERRO:", err);
  process.exit(1);
});
