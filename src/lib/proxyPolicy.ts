// Lista branca do proxy /api/backend: o navegador só alcança estes endpoints da API-Sports,
// só por GET e só com estes parâmetros, cada um validado por regex. Protege a chave e a cota diária.

const num = (max: number) => new RegExp(`^\\d{1,${max}}$`);
const ids = /^\d{1,9}(-\d{1,9}){0,19}$/;
const P = {
  id: num(9),
  ids,
  ano: /^\d{4}$/,
  pagina: num(3),
  qtd: num(3),
  data: /^\d{4}-\d{2}-\d{2}$/,
  bool: /^(true|false)$/,
  busca: /^[\p{L}\p{N} .'-]{3,40}$/u,
  nome: /^[\p{L}\p{N} .'-]{2,40}$/u,
  codigo: /^[A-Za-z]{2,3}$/,
  tipoLiga: /^(league|cup)$/,
  tipoTexto: /^[\p{L} ]{1,30}$/u,
  rodada: /^[\p{L}\p{N} ._:/-]{1,40}$/u,
  status: /^[A-Z0-9]{1,4}(-[A-Z0-9]{1,4}){0,9}$/,
  live: /^(all|\d{1,5}(-\d{1,5})*)$/,
  fuso: /^[A-Za-z_]+(\/[A-Za-z_+\-0-9]+){0,2}$/,
  h2h: /^\d{1,9}-\d{1,9}$/,
};

type Regras = Record<string, RegExp>;

const DEFINICOES: Record<string, Regras> = {
  timezone: {},
  countries: { name: P.nome, code: P.codigo, search: P.busca },
  leagues: {
    id: P.id,
    name: P.nome,
    country: P.nome,
    code: P.codigo,
    season: P.ano,
    team: P.id,
    type: P.tipoLiga,
    current: P.bool,
    search: P.busca,
    last: P.qtd,
  },
  "leagues/seasons": {},
  teams: {
    id: P.id,
    name: P.nome,
    league: P.id,
    season: P.ano,
    country: P.nome,
    code: P.codigo,
    venue: P.id,
    search: P.busca,
  },
  "teams/statistics": { league: P.id, season: P.ano, team: P.id, date: P.data },
  "teams/seasons": { team: P.id },
  "teams/countries": {},
  venues: { id: P.id, name: P.nome, city: P.nome, country: P.nome, search: P.busca },
  standings: { league: P.id, season: P.ano, team: P.id },
  "fixtures/rounds": { league: P.id, season: P.ano, current: P.bool, dates: P.bool, timezone: P.fuso },
  fixtures: {
    id: P.id,
    ids: P.ids,
    live: P.live,
    date: P.data,
    league: P.id,
    season: P.ano,
    team: P.id,
    last: P.qtd,
    next: P.qtd,
    from: P.data,
    to: P.data,
    round: P.rodada,
    status: P.status,
    venue: P.id,
    timezone: P.fuso,
  },
  "fixtures/headtohead": {
    h2h: P.h2h,
    date: P.data,
    league: P.id,
    season: P.ano,
    last: P.qtd,
    next: P.qtd,
    from: P.data,
    to: P.data,
    status: P.status,
    venue: P.id,
    timezone: P.fuso,
  },
  "fixtures/statistics": { fixture: P.id, team: P.id, type: P.tipoTexto, half: P.bool },
  "fixtures/events": { fixture: P.id, team: P.id, player: P.id, type: P.tipoTexto },
  "fixtures/lineups": { fixture: P.id, team: P.id, player: P.id, type: P.tipoTexto },
  "fixtures/players": { fixture: P.id, team: P.id },
  injuries: {
    league: P.id,
    season: P.ano,
    fixture: P.id,
    team: P.id,
    player: P.id,
    date: P.data,
    ids: P.ids,
    timezone: P.fuso,
  },
  predictions: { fixture: P.id },
  coachs: { id: P.id, team: P.id, search: P.busca },
  "players/seasons": { player: P.id },
  "players/profiles": { player: P.id, search: P.busca, page: P.pagina },
  players: { id: P.id, team: P.id, league: P.id, season: P.ano, search: P.busca, page: P.pagina },
  "players/squads": { team: P.id, player: P.id },
  "players/teams": { player: P.id },
  "players/topscorers": { league: P.id, season: P.ano },
  "players/topassists": { league: P.id, season: P.ano },
  "players/topyellowcards": { league: P.id, season: P.ano },
  "players/topredcards": { league: P.id, season: P.ano },
  transfers: { player: P.id, team: P.id },
  trophies: { player: P.id, players: P.ids, coach: P.id, coaches: P.ids },
  sidelined: { player: P.id, players: P.ids, coach: P.id, coaches: P.ids },
  "odds/live": { fixture: P.id, league: P.id, bet: P.id },
  "odds/live/bets": { id: P.id, search: P.busca },
  odds: {
    fixture: P.id,
    league: P.id,
    season: P.ano,
    date: P.data,
    timezone: P.fuso,
    page: P.pagina,
    bookmaker: P.id,
    bet: P.id,
  },
  "odds/mapping": { page: P.pagina },
  "odds/bookmakers": { id: P.id, search: P.busca },
  "odds/bets": { id: P.id, search: P.busca },
};

const ENDPOINTS: ReadonlyMap<string, ReadonlyMap<string, RegExp>> = new Map(
  Object.entries(DEFINICOES).map(([caminho, regras]) => [caminho, new Map(Object.entries(regras))])
);

export type RotaResolvida =
  { ok: true; caminho: string; upstream: string } | { ok: false; status: 400 | 404 };

export function resolverRota(segmentos: string[], busca: URLSearchParams): RotaResolvida {
  const caminho = segmentos.join("/");
  const parametros = ENDPOINTS.get(caminho);
  if (!parametros) return { ok: false, status: 404 };

  // ordena para que a mesma consulta gere sempre a mesma chave de cache
  const saida = new URLSearchParams();
  const entradas = [...busca].sort(([a], [b]) => a.localeCompare(b));
  for (const [nome, valor] of entradas) {
    if (!parametros.get(nome)?.test(valor) || saida.has(nome)) return { ok: false, status: 400 };
    saida.set(nome, valor);
  }

  const query = saida.toString();
  return { ok: true, caminho, upstream: query ? `${caminho}?${query}` : caminho };
}

/** Quanto tempo (ms) a resposta pode ser reaproveitada para qualquer usuário (os dados são públicos). */
export function ttlCache(caminho: string, busca: URLSearchParams): number {
  const MIN = 60_000;
  const HORA = 60 * MIN;
  if (caminho === "odds/live" || busca.has("live")) return 30_000;
  if (
    ["timezone", "countries", "leagues/seasons", "odds/bookmakers", "odds/bets", "odds/live/bets"].includes(
      caminho
    )
  )
    return 24 * HORA;
  if (["leagues", "teams", "teams/seasons", "teams/countries", "venues", "coachs"].includes(caminho))
    return 6 * HORA;
  if (caminho.startsWith("fixtures")) return 5 * MIN;
  return 15 * MIN;
}
