export class LetterboxdNotFound extends Error {
  constructor(public readonly username: string) {
    super(`Usuário '${username}' não encontrado no Letterboxd`);
    this.name = "LetterboxdNotFound";
  }
}

export class PrivateWatchlist extends Error {
  constructor(public readonly username: string) {
    super(`Watchlist de '${username}' está privada`);
    this.name = "PrivateWatchlist";
  }
}

export class RateLimited extends Error {
  constructor(public readonly retryAfter?: number) {
    super(`Rate limited pelo Letterboxd`);
    this.name = "RateLimited";
  }
}

export class ScrapeFailed extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ScrapeFailed";
  }
}
