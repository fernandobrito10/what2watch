import type { FilmResult } from "@/lib/schemas";
import { FilmCard } from "./FilmCard";

export function FilmGrid({ films }: { films: FilmResult[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {films.map((film) => (
        <FilmCard key={film.slug} film={film} />
      ))}
    </div>
  );
}
