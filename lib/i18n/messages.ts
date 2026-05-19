export type Locale = "en" | "pt";

export const LOCALES: Locale[] = ["en", "pt"];
export const DEFAULT_LOCALE: Locale = "en";

export const messages = {
  en: {
    header: {
      brand: "what2watch",
      tagline: "find what to watch from your Letterboxd watchlist",
      description:
        "enter your Letterboxd username and how much free time you have. we'll check your watchlist and show what fits.",
    },
    form: {
      userLabel: "your Letterboxd username",
      userPlaceholder: "e.g. dave",
      timeLabel: "time available",
      modeMinutes: "minutes",
      modeUntil: "until",
      minSuffix: "min",
      searchButton: "find movies",
      searchingButton: "searching...",
      errorNoUser: "enter your Letterboxd username",
      errorTimeZero: "time must be greater than zero",
      errorTimePast: "that time has already passed — sure about this?",
      errorTooLong: "let's be realistic — 10h max.",
    },
    loading: {
      title: "scraping {user}'s watchlist...",
      subtitle:
        "first search may take 30-60s. next ones are instant from cache.",
    },
    success: {
      summary:
        "{matched} of {total} movies in the watchlist fit in {minutes}min",
      noneFound:
        "no movies in {user}'s watchlist fit in {minutes} minutes",
      noneFoundHint:
        "try increasing the time, or add some shorter films to your watchlist 🙂",
    },
    sort: {
      label: "sort by",
      rating: "highest rated",
      oldest: "longest on watchlist",
      newest: "recently added",
      duration: "shortest",
    },
    errors: {
      userNotFoundTitle: "user not found",
      userNotFound:
        'couldn\'t find "{user}" on Letterboxd. check the spelling.',
      privateTitle: "private watchlist",
      private:
        '"{user}"\'s watchlist isn\'t public. they need to make it public in Letterboxd privacy settings.',
      rateLimitedTitle: "Letterboxd asked us to wait",
      rateLimited:
        "Letterboxd is rate limiting requests. try again in {sec}s.",
      rateLimitedNoSec:
        "Letterboxd is rate limiting requests. try again in a few minutes.",
      scrapeFailedTitle: "scraping failed",
      scrapeFailed: "try again in a few moments.",
      badRequestTitle: "invalid input",
      retry: "try again",
    },
    lang: {
      english: "English",
      portuguese: "Português",
    },
    footer: {
      madeWithBy: "Made with",
      by: "by",
      author: "Fernando Brito",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
      emailLabel: "Email",
    },
  },
  pt: {
    header: {
      brand: "what2watch",
      tagline: "descubra o que assistir da sua watchlist do Letterboxd",
      description:
        "coloque seu usuário do Letterboxd e quanto tempo você tem livre. a gente olha sua watchlist e mostra os filmes que cabem no seu tempo.",
    },
    form: {
      userLabel: "seu usuário do Letterboxd",
      userPlaceholder: "ex: dave",
      timeLabel: "tempo disponível",
      modeMinutes: "minutos",
      modeUntil: "até",
      minSuffix: "min",
      searchButton: "buscar filmes",
      searchingButton: "buscando...",
      errorNoUser: "coloque seu usuário do Letterboxd",
      errorTimeZero: "tempo precisa ser maior que zero",
      errorTimePast: "esse horário já passou. tem certeza?",
      errorTooLong: "vamos ser realistas — máximo 10h.",
    },
    loading: {
      title: "raspando a watchlist de {user}...",
      subtitle:
        "primeira busca pode levar 30-60s. as próximas são instantâneas pelo cache.",
    },
    success: {
      summary:
        "{matched} de {total} filmes da watchlist cabem em {minutes}min",
      noneFound:
        "nenhum filme da watchlist de {user} cabe em {minutes} minutos",
      noneFoundHint:
        "tenta aumentar o tempo, ou bota algum filme mais curto na watchlist 🙂",
    },
    sort: {
      label: "ordenar por",
      rating: "melhor nota",
      oldest: "há mais tempo",
      newest: "adicionados recente",
      duration: "mais curtos",
    },
    errors: {
      userNotFoundTitle: "usuário não encontrado",
      userNotFound:
        'não achei "{user}" no Letterboxd. confere se escreveu certo.',
      privateTitle: "watchlist privada",
      private:
        'a watchlist de "{user}" não está pública. peça pra ela liberar nas configurações de privacidade do Letterboxd.',
      rateLimitedTitle: "Letterboxd pediu pra esperar",
      rateLimited:
        "o Letterboxd está limitando requisições. tente de novo em {sec}s.",
      rateLimitedNoSec:
        "o Letterboxd está limitando requisições. tente de novo em alguns minutos.",
      scrapeFailedTitle: "deu ruim no scraping",
      scrapeFailed: "tente de novo em alguns instantes.",
      badRequestTitle: "input inválido",
      retry: "tentar de novo",
    },
    lang: {
      english: "English",
      portuguese: "Português",
    },
    footer: {
      madeWithBy: "Feito com",
      by: "por",
      author: "Fernando Brito",
      githubLabel: "GitHub",
      linkedinLabel: "LinkedIn",
      emailLabel: "Email",
    },
  },
} as const;

export type MessageKey = string;
