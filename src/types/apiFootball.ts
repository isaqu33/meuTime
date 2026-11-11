// Só os campos que o app usa das respostas da API-Sports (v3.football). Campos que a API pode
// devolver como `null` estão tipados como tal; opcionais (`?`) nem sempre vêm.

export interface Paging {
  current: number;
  total: number;
}

export interface Ref {
  id: number;
  name: string;
  logo?: string | null;
}

export interface Pais {
  name: string;
  code: string | null;
  flag: string | null;
}

export interface LiganaApi {
  league: { id: number; name: string; type: string; logo: string };
  country: Pais;
  seasons: { year: number; start: string; end: string; current: boolean }[];
}

export interface Estadio {
  id: number | null;
  name: string | null;
  address?: string | null;
  city: string | null;
  country?: string | null;
  capacity: number | null;
  surface: string | null;
  image: string | null;
}

export interface TimeApi {
  team: {
    id: number;
    name: string;
    code: string | null;
    country: string | null;
    founded: number | null;
    national: boolean;
    logo: string;
  };
  venue: Estadio;
}

export interface Gols {
  for: number;
  against: number;
}

export interface LinhaClassificacao {
  rank: number;
  team: Ref;
  points: number;
  goalsDiff: number;
  group: string;
  form: string | null;
  description: string | null;
  all: { played: number; win: number; draw: number; lose: number; goals: Gols };
}

export interface Classificacao {
  league: { id: number; name: string; season: number; standings: LinhaClassificacao[][] };
}

export interface Jogo {
  fixture: {
    id: number;
    referee: string | null;
    date: string;
    status: { long: string; short: string; elapsed: number | null };
    venue: { id: number | null; name: string | null; city: string | null };
  };
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string | null;
    season: number;
    round: string;
  };
  teams: { home: Ref & { winner: boolean | null }; away: Ref & { winner: boolean | null } };
  goals: { home: number | null; away: number | null };
  score: {
    halftime: { home: number | null; away: number | null };
    fulltime: { home: number | null; away: number | null };
    extratime: { home: number | null; away: number | null };
    penalty: { home: number | null; away: number | null };
  };
}

export interface Evento {
  time: { elapsed: number; extra: number | null };
  team: Ref;
  player: { id: number | null; name: string | null };
  assist: { id: number | null; name: string | null };
  type: string;
  detail: string;
  comments: string | null;
}

export interface EstatisticasTime {
  team: Ref;
  statistics: { type: string; value: number | string | null }[];
}

export interface JogadorEscalacao {
  player: { id: number; name: string; number: number; pos: string | null; grid: string | null };
}

export interface Escalacao {
  team: Ref;
  coach: { id: number | null; name: string | null; photo: string | null };
  formation: string | null;
  startXI: JogadorEscalacao[];
  substitutes: JogadorEscalacao[];
}

export interface JogadoresDoTime {
  team: Ref;
  players: {
    player: { id: number; name: string; photo: string };
    statistics: {
      games: {
        minutes: number | null;
        number: number | null;
        position: string | null;
        rating: string | null;
      };
      goals: { total: number | null; assists: number | null };
      shots: { total: number | null; on: number | null };
      passes: { total: number | null; key: number | null; accuracy: string | null };
      cards: { yellow: number | null; red: number | null };
    }[];
  }[];
}

export interface Previsao {
  predictions: {
    winner: { id: number | null; name: string | null; comment: string | null } | null;
    win_or_draw: boolean | null;
    under_over: string | null;
    goals: { home: string | null; away: string | null };
    advice: string | null;
    percent: { home: string; draw: string; away: string };
  };
  comparison: Record<string, { home: string; away: string }>;
}

export interface Lesao {
  player: { id: number; name: string; photo: string; type: string; reason: string };
  team: Ref;
  fixture: { id: number; date: string };
  league: { id: number; season: number; name: string };
}

export interface Tecnico {
  id: number;
  name: string;
  firstname: string | null;
  lastname: string | null;
  age: number | null;
  birth: { date: string | null; place: string | null; country: string | null };
  nationality: string | null;
  photo: string;
  team: Ref | null;
  career: { team: Ref; start: string | null; end: string | null }[];
}

export interface EstatisticaJogador {
  team: Ref;
  league: {
    id: number | null;
    name: string | null;
    country: string | null;
    logo: string | null;
    season: number | null;
  };
  games: {
    appearences: number | null;
    lineups: number | null;
    minutes: number | null;
    position: string | null;
    rating: string | null;
  };
  shots: { total: number | null; on: number | null };
  goals: { total: number | null; conceded: number | null; assists: number | null; saves: number | null };
  passes: { total: number | null; key: number | null; accuracy: number | null };
  tackles: { total: number | null; interceptions: number | null };
  duels: { total: number | null; won: number | null };
  dribbles: { attempts: number | null; success: number | null };
  cards: { yellow: number | null; yellowred: number | null; red: number | null };
  penalty: { scored: number | null; missed: number | null; saved: number | null };
}

export interface JogadorApi {
  player: {
    id: number;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    birth: { date: string | null; place: string | null; country: string | null };
    nationality: string | null;
    height: string | null;
    weight: string | null;
    injured: boolean;
    photo: string;
  };
  statistics: EstatisticaJogador[];
}

export interface Elenco {
  team: Ref;
  players: {
    id: number;
    name: string;
    age: number | null;
    number: number | null;
    position: string;
    photo: string;
  }[];
}

export interface Transferencia {
  player: { id: number; name: string };
  transfers: { date: string; type: string | null; teams: { in: Ref; out: Ref } }[];
}

export interface Trofeu {
  league: string;
  country: string;
  season: string;
  place: string;
}

export interface Afastamento {
  type: string;
  start: string;
  end: string | null;
}

export interface Odd {
  fixture: { id: number };
  bookmakers: {
    id: number;
    name: string;
    bets: { id: number; name: string; values: { value: string; odd: string }[] }[];
  }[];
}

export interface OddAoVivo {
  odds: {
    id: number;
    name: string;
    values: { value: string; odd: string; handicap: string | null; suspended: boolean }[];
  }[];
}

export interface Item {
  id: number;
  name: string;
}

export interface EstatisticasTemporadaTime {
  form: string | null;
  fixtures: Record<"played" | "wins" | "draws" | "loses", { home: number; away: number; total: number }>;
  goals: {
    for: { total: { total: number }; average: { total: string } };
    against: { total: { total: number }; average: { total: string } };
  };
  clean_sheet: { total: number };
  failed_to_score: { total: number };
  lineups: { formation: string; played: number }[];
}

export interface JogadorPerfil {
  player: {
    id: number;
    name: string;
    firstname: string | null;
    lastname: string | null;
    age: number | null;
    birth: { date: string | null; place: string | null; country: string | null };
    nationality: string | null;
    height: string | null;
    weight: string | null;
    number: number | null;
    position: string | null;
    photo: string;
  };
}

export interface TimeDoJogador {
  team: Ref;
  seasons: number[];
}

export interface MapeamentoOdds {
  league: { id: number; season: number };
  fixture: { id: number; date: string };
}

export interface OddLiga {
  league: { id: number; name: string };
  fixture: { id: number; date: string };
  bookmakers: Odd["bookmakers"];
}
