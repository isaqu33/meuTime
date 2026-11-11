"use client";

import Link from "next/link";
import { Escudo } from "@/components/ui/Escudo";
import { Pilula } from "@/components/ui/Cartao";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { usePreferencias } from "@/contexts/Preferencias";
import { formatarDataHora, statusJogo } from "@/lib/formatar";
import type { Jogo, LinhaClassificacao, JogadorApi, Ref } from "@/types/apiFootball";

export function LinkTime({ time, tamanho = 24 }: { time: Ref; tamanho?: number }) {
  return (
    <Link
      href={`/times/${time.id}`}
      className="inline-flex items-center gap-2 hover:text-brand hover:underline"
    >
      <Escudo src={time.logo} nome={time.name} tamanho={tamanho} />
      <span>{time.name}</span>
    </Link>
  );
}

export function PlacarPilula({ jogo }: { jogo: Jogo }) {
  const s = statusJogo(jogo.fixture.status.short, jogo.fixture.status.elapsed);
  return <Pilula tom={s.tom}>{s.texto}</Pilula>;
}

export const placar = (jogo: Jogo): string =>
  jogo.goals.home === null || jogo.goals.away === null ? "×" : `${jogo.goals.home} × ${jogo.goals.away}`;

export function TabelaJogos({
  jogos,
  mostrarLiga = false,
  tamanhoInicial = 10,
}: {
  jogos: Jogo[];
  mostrarLiga?: boolean;
  tamanhoInicial?: number;
}) {
  const { fuso } = usePreferencias();

  const colunas: Coluna<Jogo>[] = [
    {
      titulo: "Data",
      render: (j) => (
        <span className="tabular whitespace-nowrap text-muted">{formatarDataHora(j.fixture.date, fuso)}</span>
      ),
      ordenar: (j) => j.fixture.date,
    },
    ...(mostrarLiga
      ? [
          {
            titulo: "Competição",
            render: (j: Jogo) => (
              <span className="flex items-center gap-2">
                <Escudo src={j.league.logo} nome={j.league.name} tamanho={20} />
                <span className="whitespace-nowrap">{j.league.name}</span>
              </span>
            ),
          },
        ]
      : [{ titulo: "Rodada", render: (j: Jogo) => <span className="text-muted">{j.league.round}</span> }]),
    {
      titulo: "Mandante",
      alinhar: "right",
      render: (j) => (
        <span className="inline-flex items-center justify-end gap-2">
          <span className={j.teams.home.winner ? "font-semibold" : ""}>{j.teams.home.name}</span>
          <Escudo src={j.teams.home.logo} nome={j.teams.home.name} tamanho={22} />
        </span>
      ),
    },
    {
      titulo: "Placar",
      alinhar: "center",
      render: (j) => (
        <Link
          href={`/jogos/${j.fixture.id}`}
          className="tabular rounded-md bg-subtle px-2.5 py-1 font-semibold hover:bg-brand-soft"
        >
          {placar(j)}
        </Link>
      ),
    },
    {
      titulo: "Visitante",
      render: (j) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={j.teams.away.logo} nome={j.teams.away.name} tamanho={22} />
          <span className={j.teams.away.winner ? "font-semibold" : ""}>{j.teams.away.name}</span>
        </span>
      ),
    },
    { titulo: "Situação", render: (j) => <PlacarPilula jogo={j} /> },
  ];

  return (
    <Tabela
      rotulo="Jogos"
      colunas={colunas}
      linhas={jogos}
      chave={(j) => j.fixture.id}
      tamanhoInicial={tamanhoInicial}
      buscavel={(j) => `${j.teams.home.name} ${j.teams.away.name} ${j.league.name} ${j.league.round}`}
      vazio="Nenhum jogo encontrado."
    />
  );
}

export function TabelaClassificacao({ linhas }: { linhas: LinhaClassificacao[] }) {
  const colunas: Coluna<LinhaClassificacao>[] = [
    {
      titulo: "#",
      alinhar: "center",
      render: (l) => <span className="tabular font-semibold">{l.rank}</span>,
      ordenar: (l) => l.rank,
    },
    { titulo: "Time", render: (l) => <LinkTime time={l.team} />, ordenar: (l) => l.team.name },
    {
      titulo: "P",
      alinhar: "right",
      render: (l) => <b className="tabular">{l.points}</b>,
      ordenar: (l) => l.points,
    },
    {
      titulo: "J",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.all.played}</span>,
      ordenar: (l) => l.all.played,
    },
    {
      titulo: "V",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.all.win}</span>,
      ordenar: (l) => l.all.win,
    },
    {
      titulo: "E",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.all.draw}</span>,
      ordenar: (l) => l.all.draw,
    },
    {
      titulo: "D",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.all.lose}</span>,
      ordenar: (l) => l.all.lose,
    },
    {
      titulo: "GP",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.all.goals.for}</span>,
      ordenar: (l) => l.all.goals.for,
    },
    {
      titulo: "GC",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.all.goals.against}</span>,
      ordenar: (l) => l.all.goals.against,
    },
    {
      titulo: "SG",
      alinhar: "right",
      render: (l) => <span className="tabular">{l.goalsDiff}</span>,
      ordenar: (l) => l.goalsDiff,
    },
    { titulo: "Forma", render: (l) => <Forma texto={l.form} /> },
  ];
  return (
    <Tabela
      rotulo="Classificação"
      colunas={colunas}
      linhas={linhas}
      chave={(l) => l.team.id}
      tamanhoInicial={20}
      buscavel={(l) => l.team.name}
    />
  );
}

export function Forma({ texto }: { texto: string | null }) {
  if (!texto) return <span className="text-muted">-</span>;
  const cor = { W: "bg-ok", D: "bg-muted", L: "bg-danger" } as Record<string, string>;
  return (
    <span className="inline-flex gap-1" aria-label={`Últimos jogos: ${texto}`}>
      {[...texto].map((c, i) => (
        <span
          key={i}
          className={`h-4 w-4 rounded-sm text-center text-[10px] font-bold leading-4 text-white ${cor[c] ?? "bg-muted"}`}
        >
          {{ W: "V", D: "E", L: "D" }[c] ?? c}
        </span>
      ))}
    </span>
  );
}

/** Ranking de jogadores (artilheiros, assistências, cartões) a partir de `players/top*`. */
export function TabelaRanking({
  jogadores,
  valor,
  rotuloValor,
}: {
  jogadores: JogadorApi[];
  valor: (j: JogadorApi) => number | null;
  rotuloValor: string;
}) {
  const colunas: Coluna<JogadorApi>[] = [
    { titulo: "#", alinhar: "center", render: (_, i) => <span className="tabular text-muted">{i + 1}</span> },
    {
      titulo: "Jogador",
      render: (j) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={j.player.photo} nome={j.player.name} tamanho={28} redondo />
          {j.player.name}
        </span>
      ),
    },
    {
      titulo: "Time",
      render: (j) => (j.statistics[0] ? <LinkTime time={j.statistics[0].team} tamanho={20} /> : "-"),
    },
    {
      titulo: "Jogos",
      alinhar: "right",
      render: (j) => <span className="tabular">{j.statistics[0]?.games.appearences ?? "-"}</span>,
    },
    {
      titulo: rotuloValor,
      alinhar: "right",
      render: (j) => <b className="tabular">{valor(j) ?? 0}</b>,
      ordenar: (j) => valor(j) ?? 0,
    },
  ];
  return (
    <Tabela
      rotulo={`Ranking de ${rotuloValor}`}
      colunas={colunas}
      linhas={jogadores}
      chave={(j) => j.player.id}
      href={(j) => `/jogadores/${j.player.id}`}
      tamanhoInicial={10}
    />
  );
}
