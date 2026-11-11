"use client";

import Link from "next/link";
import { CaretLeft } from "phosphor-react";
import { placar } from "@/components/futebol/comuns";
import { Abas } from "@/components/ui/Abas";
import { Cartao, Pilula } from "@/components/ui/Cartao";
import { Consulta } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { formatarDataHora, pais, statusJogo } from "@/lib/formatar";
import type { Jogo as JogoApi } from "@/types/apiFootball";
import {
  AbaConfronto,
  AbaEscalacoes,
  AbaEstatisticas,
  AbaEventos,
  AbaJogadores,
  AbaLesoes,
  AbaOdds,
  AbaPrevisoes,
} from "./abas";

export default function Jogo({ id }: { id: string }) {
  const { fuso } = usePreferencias();
  const q = useApi<JogoApi[]>("fixtures", { id, timezone: fuso }, { staleTime: 60_000 });

  return (
    <>
      <Link href="/jogos" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <CaretLeft size={14} /> Jogos
      </Link>

      <Consulta q={q} vazio={(d) => (d.length === 0 ? "Jogo não encontrado." : false)}>
        {([jogo]) => {
          const status = statusJogo(jogo.fixture.status.short, jogo.fixture.status.elapsed);
          return (
            <div className="space-y-6">
              <Cartao>
                <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
                  <Link
                    href={`/ligas/${jogo.league.id}`}
                    className="inline-flex items-center gap-2 hover:text-brand"
                  >
                    <Escudo src={jogo.league.logo} nome={jogo.league.name} tamanho={20} />
                    {jogo.league.name} · {jogo.league.round}
                  </Link>
                  <Pilula tom={status.tom}>{status.texto}</Pilula>
                </div>

                <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Escudo src={jogo.teams.home.logo} nome={jogo.teams.home.name} tamanho={64} />
                    <Link
                      href={`/times/${jogo.teams.home.id}`}
                      className="font-semibold hover:text-brand hover:underline"
                    >
                      {jogo.teams.home.name}
                    </Link>
                  </div>
                  <div>
                    <p className="tabular text-4xl font-bold tracking-tight">{placar(jogo)}</p>
                    {jogo.score.halftime.home !== null && (
                      <p className="tabular text-xs text-muted">
                        Intervalo {jogo.score.halftime.home} × {jogo.score.halftime.away}
                      </p>
                    )}
                    {jogo.score.penalty.home !== null && (
                      <p className="tabular text-xs text-muted">
                        Pênaltis {jogo.score.penalty.home} × {jogo.score.penalty.away}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Escudo src={jogo.teams.away.logo} nome={jogo.teams.away.name} tamanho={64} />
                    <Link
                      href={`/times/${jogo.teams.away.id}`}
                      className="font-semibold hover:text-brand hover:underline"
                    >
                      {jogo.teams.away.name}
                    </Link>
                  </div>
                </div>

                <p className="text-center text-xs text-muted">
                  {formatarDataHora(jogo.fixture.date, fuso)}
                  {jogo.fixture.venue.name &&
                    ` · ${jogo.fixture.venue.name}, ${jogo.fixture.venue.city ?? pais(jogo.league.country)}`}
                  {jogo.fixture.referee && ` · Árbitro: ${jogo.fixture.referee}`}
                </p>
              </Cartao>

              <Abas
                itens={[
                  { rotulo: "Eventos", conteudo: () => <AbaEventos id={id} /> },
                  { rotulo: "Estatísticas", conteudo: () => <AbaEstatisticas id={id} /> },
                  { rotulo: "Escalações", conteudo: () => <AbaEscalacoes id={id} /> },
                  { rotulo: "Jogadores", conteudo: () => <AbaJogadores id={id} /> },
                  { rotulo: "Confronto direto", conteudo: () => <AbaConfronto jogo={jogo} /> },
                  { rotulo: "Previsões", conteudo: () => <AbaPrevisoes id={id} /> },
                  { rotulo: "Odds", conteudo: () => <AbaOdds id={id} aoVivo={status.aoVivo} /> },
                  { rotulo: "Lesões", conteudo: () => <AbaLesoes id={id} /> },
                ]}
              />
            </div>
          );
        }}
      </Consulta>
    </>
  );
}
