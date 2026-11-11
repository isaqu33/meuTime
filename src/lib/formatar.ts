export function formatarDataHora(iso: string, fuso = "America/Sao_Paulo"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  try {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: fuso,
    }).format(d);
  } catch {
    return d.toLocaleString("pt-BR");
  }
}

/** "1998-04-12" → "12/04/1998" (sem passar por Date, para não deslocar o dia pelo fuso). */
export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "-";
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : iso;
}

export const dataHoje = (): string => new Date().toISOString().slice(0, 10);

export const numero = (n: number | null | undefined, vazio = "-"): string =>
  n === null || n === undefined ? vazio : n.toLocaleString("pt-BR");

export type Tom = "neutro" | "ok" | "aviso" | "perigo" | "marca";

const AO_VIVO = new Set(["1H", "HT", "2H", "ET", "BT", "P", "SUSP", "INT", "LIVE"]);
const ENCERRADO = new Set(["FT", "AET", "PEN"]);

export function statusJogo(
  curto: string,
  minutos?: number | null
): { texto: string; tom: Tom; aoVivo: boolean } {
  if (AO_VIVO.has(curto)) {
    return {
      texto: curto === "HT" ? "Intervalo" : minutos ? `${minutos}'` : "Ao vivo",
      tom: "perigo",
      aoVivo: true,
    };
  }
  if (ENCERRADO.has(curto)) return { texto: "Encerrado", tom: "neutro", aoVivo: false };
  if (curto === "NS" || curto === "TBD") return { texto: "Agendado", tom: "marca", aoVivo: false };
  if (["PST", "CANC", "ABD", "AWD", "WO"].includes(curto)) {
    return {
      texto: { PST: "Adiado", CANC: "Cancelado", ABD: "Abandonado", AWD: "W.O.", WO: "W.O." }[curto]!,
      tom: "aviso",
      aoVivo: false,
    };
  }
  return { texto: curto, tom: "neutro", aoVivo: false };
}

const POSICOES: Record<string, string> = {
  Goalkeeper: "Goleiro",
  Defender: "Defensor",
  Midfielder: "Meio-campo",
  Attacker: "Atacante",
  G: "Goleiro",
  D: "Defensor",
  M: "Meio-campo",
  F: "Atacante",
};
export const posicao = (p: string | null | undefined): string => (p ? (POSICOES[p] ?? p) : "-");

/** "Brazil" → "Brasil" para os países mais comuns; o resto segue como a API devolve. */
const PAISES: Record<string, string> = {
  Brazil: "Brasil",
  England: "Inglaterra",
  Spain: "Espanha",
  Italy: "Itália",
  Germany: "Alemanha",
  France: "França",
  Portugal: "Portugal",
  Netherlands: "Países Baixos",
  Argentina: "Argentina",
  World: "Mundial",
  Europe: "Europa",
  "South-America": "América do Sul",
  Uruguay: "Uruguai",
  Belgium: "Bélgica",
  Switzerland: "Suíça",
  Mexico: "México",
  USA: "Estados Unidos",
};
export const pais = (p: string | null | undefined): string => (p ? (PAISES[p] ?? p) : "-");

const GRAMADOS: Record<string, string> = {
  grass: "Grama natural",
  "artificial turf": "Grama sintética",
  "artificial grass": "Grama sintética",
};
export const gramado = (g: string | null | undefined): string | null =>
  g ? (GRAMADOS[g.toLowerCase()] ?? g) : null;
