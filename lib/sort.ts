import type { FilmResult, SortKey } from "@/lib/schemas";

export function sortFilms(films: FilmResult[], sort: SortKey): void {
  switch (sort) {
    case "rating":
      films.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
      break;
    case "oldest":
      films.sort((a, b) => b.position - a.position);
      break;
    case "newest":
      films.sort((a, b) => a.position - b.position);
      break;
    case "duration":
      films.sort((a, b) => a.duration - b.duration);
      break;
  }
}
