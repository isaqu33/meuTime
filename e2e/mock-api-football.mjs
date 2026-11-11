// API-Sports falsa para os testes e2e e as capturas de tela: dados fictícios, sem internet nem cota.
// Imita o comportamento real: HTTP 200 mesmo com erro (campo `errors`), chave no cabeçalho
// x-apisports-key e `paging` nas listas paginadas. Endpoint sem dados próprios responde lista vazia.
import { readFileSync } from "node:fs";
import { createServer } from "node:http";

export const { chaveValida: CHAVE_VALIDA } = JSON.parse(
  readFileSync(new URL("./chave-demo.json", import.meta.url), "utf8")
);
export const PORTA = Number(process.env.MOCK_PORT ?? 3082);

const logo = (cor, letra) =>
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="${cor}"/><text x="32" y="42" font-size="28" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#fff">${letra}</text></svg>`
  );
const CORES = ["#00816a", "#c0392b", "#2c3e8f", "#d68910", "#7d3c98", "#117a8b"];

const NOMES_TIMES = [
  "Unidos FC",
  "Atlético Norte",
  "Esporte Sul",
  "Real Litoral",
  "Sport Central",
  "Grêmio Vale",
  "Ferroviário",
  "Operário",
  "Náutico Azul",
  "Estrela do Mar",
  "Tupi",
  "Guarani Velho",
  "União Serrana",
  "Cruzeiro Alto",
  "Vitória Nova",
  "Bandeirante",
  "Inter Planalto",
  "Ponte Verde",
  "Amazonas SC",
  "Coritiba Sul",
  "Fluminense Leste",
  "Palmeiras Oeste",
  "Botafogo Norte",
  "Santa Cruz Real",
];
const times = NOMES_TIMES.map((name, i) => ({
  id: 100 + i,
  name,
  code: name.slice(0, 3).toUpperCase(),
  country: "Brazil",
  founded: 1900 + i * 3,
  national: false,
  logo: logo(CORES[i % CORES.length], name[0]),
}));
const ref = (t) => ({ id: t.id, name: t.name, logo: t.logo });
const estadio = (t) => ({
  id: 5000 + t.id,
  name: `Arena ${t.name}`,
  address: "Rua do Futebol, 10",
  city: "Cidade Exemplo",
  country: "Brazil",
  capacity: 20000 + t.id * 100,
  surface: "grass",
  image: logo("#64748b", "E"),
});

const ligaInfo = (id, name, tipo = "League") => ({
  league: { id, name, type: tipo, logo: logo("#00816a", name[0]) },
  country: { name: "Brazil", code: "BR", flag: logo("#2e8b57", "B") },
  seasons: [{ year: 2023, start: "2023-04-01", end: "2023-12-03", current: true }],
});
const ligas = [
  ligaInfo(71, "Brasileirão Série A"),
  ...Array.from({ length: 44 }, (_, i) =>
    ligaInfo(900 + i, `Liga Exemplo ${i + 1}`, i % 5 === 0 ? "Cup" : "League")
  ),
];

const nomesJogadores = [
  ["Rafael", "Souza"],
  ["Lucas", "Almeida"],
  ["Mateus", "Ribeiro"],
  ["Bruno", "Costa"],
  ["Diego", "Lima"],
  ["Thiago", "Moura"],
  ["Caio", "Barros"],
  ["Pedro", "Nunes"],
  ["Gustavo", "Rocha"],
  ["Felipe", "Dias"],
];
const posicoes = ["Goalkeeper", "Defender", "Midfielder", "Attacker"];
const jogadores = Array.from({ length: 25 }, (_, i) => {
  const [firstname, lastname] = nomesJogadores[i % nomesJogadores.length];
  return {
    id: 276 + i,
    firstname,
    lastname: i < 10 ? lastname : `${lastname} ${i}`,
    posicao: posicoes[i % 4],
  };
});
const perfil = (j) => ({
  id: j.id,
  name: `${j.firstname[0]}. ${j.lastname}`,
  firstname: j.firstname,
  lastname: j.lastname,
  age: 20 + (j.id % 15),
  birth: { date: "1998-04-12", place: "Cidade Exemplo", country: "Brazil" },
  nationality: "Brazil",
  height: "180 cm",
  weight: "75 kg",
  number: j.id % 30,
  position: j.posicao,
  photo: logo("#64748b", j.firstname[0]),
});
const estatistica = (j, time) => ({
  team: ref(time),
  league: {
    id: 71,
    name: "Brasileirão Série A",
    country: "Brazil",
    logo: logo("#00816a", "B"),
    season: 2023,
  },
  games: { appearences: 20 + (j.id % 10), lineups: 18, minutes: 1800, position: j.posicao, rating: "7.1234" },
  shots: { total: 30, on: 12 },
  goals: { total: 20 - (j.id - 276), conceded: 0, assists: 5, saves: null },
  passes: { total: 800, key: 20, accuracy: 80 },
  tackles: { total: 25, interceptions: 10 },
  duels: { total: 200, won: 100 },
  dribbles: { attempts: 40, success: 20 },
  cards: { yellow: 4, yellowred: 0, red: 1 },
  penalty: { scored: 2, missed: 0, saved: null },
});
const jogadorCompleto = (j, i = 0) => ({
  player: { ...perfil(j), injured: false, number: undefined, position: undefined },
  statistics: [
    estatistica(j, times[i % times.length]),
    { ...estatistica(j, times[(i + 1) % times.length]), cards: { yellow: 1, yellowred: 0, red: null } },
  ],
});

const gols = (h, a) => ({ home: h, away: a });
const jogos = Array.from({ length: 30 }, (_, i) => {
  const casa = times[(i * 2) % times.length];
  const fora = times[(i * 2 + 1) % times.length];
  const aoVivo = i === 0;
  return {
    fixture: {
      id: i + 1,
      referee: "Árbitro Exemplo",
      date: `2023-05-${String(1 + (i % 28)).padStart(2, "0")}T21:00:00+00:00`,
      status: aoVivo
        ? { long: "Second Half", short: "2H", elapsed: 67 }
        : { long: "Match Finished", short: "FT", elapsed: 90 },
      venue: { id: 5000 + casa.id, name: `Arena ${casa.name}`, city: "Cidade Exemplo" },
    },
    league: {
      id: 71,
      name: "Brasileirão Série A",
      country: "Brazil",
      logo: logo("#00816a", "B"),
      flag: null,
      season: 2023,
      round: `Regular Season - ${1 + Math.floor(i / 12)}`,
    },
    teams: {
      home: { ...ref(casa), winner: !aoVivo && i % 2 === 0 },
      away: { ...ref(fora), winner: !aoVivo && i % 2 === 1 },
    },
    goals: gols(2 + (i % 2), 1),
    score: {
      halftime: gols(1, 0),
      fulltime: gols(2 + (i % 2), 1),
      extratime: gols(null, null),
      penalty: gols(null, null),
    },
  };
});

const classificacao = times.map((t, i) => ({
  rank: i + 1,
  team: ref(t),
  points: 60 - i * 2,
  goalsDiff: 20 - i,
  group: "Brasileirão Série A",
  form: "WWDLW",
  description: i < 4 ? "Promotion - Libertadores" : null,
  all: {
    played: 30,
    win: 18 - (i >> 1),
    draw: 6,
    lose: 6 + (i >> 1),
    goals: { for: 50 - i, against: 30 + i },
  },
}));

const ok = (response, paging) => ({ errors: [], response, paging: paging ?? { current: 1, total: 1 } });

function responder(path, q) {
  const num = (k) => Number(q.get(k));
  switch (path) {
    case "/status":
      return ok({
        account: { firstname: "Maria", lastname: "Souza" },
        subscription: { plan: "Free", active: true },
        requests: { current: 3, limit_day: 100 },
      });
    case "/timezone":
      return ok(["America/Sao_Paulo", "America/Manaus", "Europe/Lisbon", "UTC"]);
    case "/countries":
    case "/teams/countries":
      return ok([
        { name: "Brazil", code: "BR", flag: logo("#2e8b57", "B") },
        { name: "England", code: "GB", flag: logo("#c0392b", "E") },
        ...Array.from({ length: 30 }, (_, i) => ({ name: `País ${i + 1}`, code: `P${i}`, flag: null })),
      ]);
    case "/leagues": {
      if (q.get("id")) return ok(ligas.filter((l) => String(l.league.id) === q.get("id")));
      const tipo = q.get("type");
      return ok(tipo ? ligas.filter((l) => l.league.type.toLowerCase() === tipo) : ligas);
    }
    case "/leagues/seasons":
      return ok([2021, 2022, 2023, 2024, 2025]);
    case "/teams": {
      if (q.get("id"))
        return ok(
          times.filter((t) => String(t.id) === q.get("id")).map((t) => ({ team: t, venue: estadio(t) }))
        );
      const busca = (q.get("search") ?? q.get("name") ?? "").toLowerCase();
      const lista = busca ? times.filter((t) => t.name.toLowerCase().includes(busca)) : times;
      return ok(lista.map((t) => ({ team: t, venue: estadio(t) })));
    }
    case "/teams/seasons":
      return ok([2021, 2022, 2023]);
    case "/teams/statistics":
      return ok({
        form: "WWDLW",
        fixtures: {
          played: { home: 15, away: 15, total: 30 },
          wins: { home: 10, away: 6, total: 16 },
          draws: { home: 3, away: 4, total: 7 },
          loses: { home: 2, away: 5, total: 7 },
        },
        goals: {
          for: { total: { total: 48 }, average: { total: "1.6" } },
          against: { total: { total: 30 }, average: { total: "1.0" } },
        },
        clean_sheet: { total: 10 },
        failed_to_score: { total: 4 },
        lineups: [
          { formation: "4-3-3", played: 20 },
          { formation: "4-4-2", played: 10 },
        ],
      });
    case "/venues":
      return ok(times.slice(0, 12).map(estadio));
    case "/standings":
      return ok([
        { league: { id: 71, name: "Brasileirão Série A", season: 2023, standings: [classificacao] } },
      ]);
    case "/fixtures/rounds":
      return ok(["Regular Season - 1", "Regular Season - 2", "Regular Season - 3"]);
    case "/fixtures": {
      if (q.get("live")) return ok(jogos.slice(0, 1));
      if (q.get("id")) return ok(jogos.filter((j) => String(j.fixture.id) === q.get("id")));
      const rodada = q.get("round");
      return ok(rodada ? jogos.filter((j) => j.league.round === rodada) : jogos);
    }
    case "/fixtures/headtohead":
      return ok(jogos.slice(1, 6));
    case "/fixtures/events":
      return ok([
        {
          time: { elapsed: 12, extra: null },
          team: ref(times[0]),
          player: { id: 276, name: "R. Souza" },
          assist: { id: 277, name: "L. Almeida" },
          type: "Goal",
          detail: "Normal Goal",
          comments: null,
        },
        {
          time: { elapsed: 40, extra: 2 },
          team: ref(times[1]),
          player: { id: 278, name: "M. Ribeiro" },
          assist: { id: null, name: null },
          type: "Card",
          detail: "Yellow Card",
          comments: null,
        },
        {
          time: { elapsed: 58, extra: null },
          team: ref(times[0]),
          player: { id: 279, name: "B. Costa" },
          assist: { id: null, name: null },
          type: "subst",
          detail: "Substitution 1",
          comments: null,
        },
      ]);
    case "/fixtures/statistics":
      return ok([
        {
          team: ref(times[0]),
          statistics: [
            { type: "Shots on Goal", value: 7 },
            { type: "Ball Possession", value: "55%" },
            { type: "Corner Kicks", value: 6 },
          ],
        },
        {
          team: ref(times[1]),
          statistics: [
            { type: "Shots on Goal", value: 3 },
            { type: "Ball Possession", value: "45%" },
            { type: "Corner Kicks", value: 2 },
          ],
        },
      ]);
    case "/fixtures/lineups":
      return ok(
        [times[0], times[1]].map((t, k) => ({
          team: ref(t),
          coach: { id: 900 + k, name: `Técnico ${t.name}`, photo: null },
          formation: "4-3-3",
          startXI: jogadores.slice(k * 11, k * 11 + 11).map((j, n) => ({
            player: { id: j.id, name: perfil(j).name, number: n + 1, pos: "M", grid: null },
          })),
          substitutes: jogadores.slice(k * 11 + 11, k * 11 + 13).map((j, n) => ({
            player: { id: j.id, name: perfil(j).name, number: 20 + n, pos: "F", grid: null },
          })),
        }))
      );
    case "/fixtures/players":
      return ok(
        [times[0], times[1]].map((t, k) => ({
          team: ref(t),
          players: jogadores.slice(k * 11, k * 11 + 11).map((j) => ({
            player: { id: j.id, name: perfil(j).name, photo: perfil(j).photo },
            statistics: [
              {
                games: { minutes: 90, number: 9, position: "F", rating: "7.3" },
                goals: { total: 1, assists: 0 },
                shots: { total: 3, on: 2 },
                passes: { total: 30, key: 2, accuracy: "80" },
                cards: { yellow: 0, red: 0 },
              },
            ],
          })),
        }))
      );
    case "/predictions":
      return ok([
        {
          predictions: {
            winner: { id: times[0].id, name: times[0].name, comment: "Win or draw" },
            win_or_draw: true,
            under_over: "-3.5",
            goals: { home: "-2.5", away: "-1.5" },
            advice: "Dupla chance: Unidos FC ou empate",
            percent: { home: "45%", draw: "35%", away: "20%" },
          },
          comparison: {
            form: { home: "60%", away: "40%" },
            att: { home: "55%", away: "45%" },
            def: { home: "50%", away: "50%" },
            total: { home: "56%", away: "44%" },
          },
        },
      ]);
    case "/odds":
      if (q.get("fixture")) {
        return ok([
          {
            fixture: { id: num("fixture") },
            bookmakers: [
              {
                id: 1,
                name: "Casa Exemplo A",
                bets: Array.from({ length: 12 }, (_, i) => ({
                  id: i + 1,
                  name: i === 0 ? "Match Winner" : `Mercado ${i + 1}`,
                  values: [
                    { value: "Home", odd: "1.85" },
                    { value: "Draw", odd: "3.40" },
                    { value: "Away", odd: "4.20" },
                  ],
                })),
              },
              {
                id: 2,
                name: "Casa Exemplo B",
                bets: [
                  {
                    id: 1,
                    name: "Match Winner",
                    values: [
                      { value: "Home", odd: "1.80" },
                      { value: "Draw", odd: "3.50" },
                      { value: "Away", odd: "4.00" },
                    ],
                  },
                ],
              },
            ],
          },
        ]);
      }
      return ok(
        jogos.slice(0, 8).map((j) => ({
          league: { id: 71, name: "Brasileirão Série A" },
          fixture: { id: j.fixture.id, date: j.fixture.date },
          bookmakers: [
            {
              id: 1,
              name: "Casa Exemplo A",
              bets: [
                {
                  id: 1,
                  name: "Match Winner",
                  values: [
                    { value: "Home", odd: "1.85" },
                    { value: "Draw", odd: "3.40" },
                    { value: "Away", odd: "4.20" },
                  ],
                },
              ],
            },
          ],
        })),
        { current: Number(q.get("page") ?? 1), total: 3 }
      );
    case "/odds/live":
      return ok([
        {
          odds: [
            {
              id: 59,
              name: "Fulltime Result",
              values: [
                { value: "Home", odd: "1.20", handicap: null, suspended: false },
                { value: "Draw", odd: "5.00", handicap: null, suspended: false },
                { value: "Away", odd: "9.00", handicap: null, suspended: true },
              ],
            },
          ],
        },
      ]);
    case "/odds/mapping":
      return ok(
        jogos.slice(0, 6).map((j) => ({
          league: { id: 71, season: 2023 },
          fixture: { id: j.fixture.id, date: j.fixture.date },
        })),
        { current: Number(q.get("page") ?? 1), total: 2 }
      );
    case "/odds/bookmakers":
      return ok([
        { id: 1, name: "Casa Exemplo A" },
        { id: 2, name: "Casa Exemplo B" },
      ]);
    case "/odds/bets":
    case "/odds/live/bets":
      return ok([
        { id: 1, name: "Match Winner" },
        { id: 2, name: "Home/Away" },
      ]);
    case "/injuries":
      return ok(
        jogadores.slice(0, 12).map((j, i) => ({
          player: {
            id: j.id,
            name: perfil(j).name,
            photo: perfil(j).photo,
            type: i % 2 ? "Questionable" : "Missing Fixture",
            reason: i % 2 ? "Muscle Injury" : "Knee Injury",
          },
          team: ref(times[i % 4]),
          fixture: { id: 1 + i, date: "2023-05-10T21:00:00+00:00" },
          league: { id: 71, season: 2023, name: "Brasileirão Série A" },
        }))
      );
    case "/coachs": {
      const tecnico = (id, team) => ({
        id,
        name: `Técnico ${id}`,
        firstname: "Técnico",
        lastname: String(id),
        age: 52,
        birth: { date: "1971-02-03", place: "Cidade Exemplo", country: "Brazil" },
        nationality: "Brazil",
        photo: logo("#7d3c98", "T"),
        team: team ? ref(team) : null,
        career: times.slice(0, 5).map((t, i) => ({
          team: ref(t),
          start: `${2010 + i * 2}-01-01`,
          end: i === 0 ? null : `${2012 + i * 2}-01-01`,
        })),
      });
      if (q.get("id")) return ok([tecnico(num("id"), times[0])]);
      if (q.get("team")) return ok([tecnico(900, times[0])]);
      return ok([tecnico(900, times[0]), tecnico(901, times[1])]);
    }
    case "/players/seasons":
      return ok([2021, 2022, 2023]);
    case "/players/profiles": {
      if (q.get("player"))
        return ok(
          jogadores.filter((j) => String(j.id) === q.get("player")).map((j) => ({ player: perfil(j) }))
        );
      return ok(
        jogadores.slice(0, 10).map((j) => ({ player: perfil(j) })),
        { current: Number(q.get("page") ?? 1), total: 1 }
      );
    }
    case "/players": {
      if (q.get("id"))
        return ok(jogadores.filter((j) => String(j.id) === q.get("id")).map((j) => jogadorCompleto(j)));
      const pagina = Number(q.get("page") ?? 1);
      const fatia = jogadores.slice((pagina - 1) * 20, pagina * 20);
      return ok(
        fatia.map((j, i) => jogadorCompleto(j, i)),
        { current: pagina, total: 2 }
      );
    }
    case "/players/squads":
      return ok([
        {
          team: ref(times[0]),
          players: jogadores.map((j) => ({
            id: j.id,
            name: perfil(j).name,
            age: perfil(j).age,
            number: perfil(j).number,
            position: j.posicao,
            photo: perfil(j).photo,
          })),
        },
      ]);
    case "/players/teams":
      return ok([
        { team: ref(times[0]), seasons: [2021, 2022, 2023] },
        { team: ref(times[1]), seasons: [2019, 2020] },
      ]);
    case "/players/topscorers":
    case "/players/topassists":
    case "/players/topyellowcards":
    case "/players/topredcards":
      return ok(jogadores.slice(0, 20).map((j, i) => jogadorCompleto(j, i)));
    case "/transfers":
      return ok(
        jogadores.slice(0, 15).map((j, i) => ({
          player: { id: j.id, name: perfil(j).name },
          transfers: [
            {
              date: `20${10 + (i % 13)}-07-01`,
              type: i % 3 ? "Free" : "Loan",
              teams: { in: ref(times[0]), out: ref(times[(i % 5) + 1]) },
            },
          ],
        }))
      );
    case "/trophies":
      return ok(
        Array.from({ length: 12 }, (_, i) => ({
          league: `Taça Exemplo ${i + 1}`,
          country: "Brazil",
          season: String(2010 + i),
          place: i % 3 ? "Winner" : "2nd Place",
        }))
      );
    case "/sidelined":
      return ok([
        { type: "Knee Injury", start: "2022-03-01", end: "2022-05-01" },
        { type: "Suspended", start: "2023-01-10", end: null },
      ]);
    default:
      return ok([]);
  }
}

export function criarServidor() {
  return createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://mock");
    const enviar = (corpo) => {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(corpo));
    };

    if (req.headers["x-apisports-key"] !== CHAVE_VALIDA) {
      return enviar({ errors: { token: "Error/Missing application key." }, response: [] });
    }
    // simula o plano gratuito: temporada fora de 2021–2023 devolve erro com HTTP 200
    const temporada = Number(url.searchParams.get("season"));
    if (temporada && (temporada < 2021 || temporada > 2023)) {
      return enviar({
        errors: { plan: "Free plans do not have access to this season, try from 2021 to 2023." },
        response: [],
      });
    }
    return enviar(responder(url.pathname, url.searchParams));
  });
}

// executado direto (`node e2e/mock-api-football.mjs`): sobe o servidor
if (import.meta.url === `file://${process.argv[1]}`) {
  criarServidor().listen(PORTA, () => console.log(`mock API-Sports em http://localhost:${PORTA}`));
}
