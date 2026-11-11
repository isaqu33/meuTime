"use client";

import Link from "next/link";
import { LinkTime, TabelaJogos } from "@/components/futebol/comuns";
import { Cartao, Metrica, PaginaTitulo } from "@/components/ui/Cartao";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { LIGAS_POPULARES } from "@/data/ligas";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import type { Classificacao, JogadorApi, Jogo } from "@/types/apiFootball";

export default function Inicio() {
  const { liga, temporada, fuso } = usePreferencias();
  const nomeLiga = LIGAS_POPULARES.find((l) => l.id === liga)?.nome ?? `Liga ${liga}`;

  const aoVivo = useApi<Jogo[]>("fixtures", { live: "all", timezone: fuso }, { staleTime: 30_000 });
  const tabela = useApi<Classificacao[]>("standings", { league: liga, season: temporada });
  const artilheiros = useApi<JogadorApi[]>("players/topscorers", { league: liga, season: temporada });

  return (
    <>
      <PaginaTitulo
        titulo="Início"
        descricao={`${nomeLiga} · temporada ${temporada} (mude a liga e a temporada nas preferências)`}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Metrica rotulo="Jogos ao vivo agora" valor={aoVivo.data?.response.length ?? "-"} />
        <Metrica
          rotulo="Líder"
          valor={tabela.data?.response[0]?.league.standings[0]?.[0]?.team.name ?? "-"}
        />
        <Metrica
          rotulo="Artilheiro"
          valor={artilheiros.data?.response[0]?.player.name ?? "-"}
          detalhe={`${artilheiros.data?.response[0]?.statistics[0]?.goals.total ?? 0} gols`}
        />
        <Metrica rotulo="Temporada" valor={temporada} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Cartao titulo="Jogos ao vivo" semPadding>
            <Consulta q={aoVivo} vazio={vazioSeLista("Nenhum jogo ao vivo no momento.")}>
              {(jogos) => <TabelaJogos jogos={jogos} mostrarLiga tamanhoInicial={10} />}
            </Consulta>
          </Cartao>

          <Cartao
            titulo={`Classificação · ${nomeLiga}`}
            acao={
              <Link href={`/ligas/${liga}`} className="text-sm font-medium text-brand hover:underline">
                Ver liga completa
              </Link>
            }
            semPadding
          >
            <Consulta
              q={tabela}
              vazio={(d) => (d.length === 0 ? "Sem classificação para esta liga e temporada." : false)}
            >
              {(d) => (
                <ul className="divide-y divide-line">
                  {d[0].league.standings[0].slice(0, 6).map((l) => (
                    <li key={l.team.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                      <span className="tabular w-5 text-center text-muted">{l.rank}</span>
                      <LinkTime time={l.team} />
                      <span className="tabular ml-auto font-semibold">{l.points} pts</span>
                    </li>
                  ))}
                </ul>
              )}
            </Consulta>
          </Cartao>
        </div>

        <Cartao titulo="Artilheiros" semPadding>
          <Consulta q={artilheiros} vazio={vazioSeLista("Sem artilheiros para esta liga e temporada.")}>
            {(jogadores) => (
              <ul className="divide-y divide-line">
                {jogadores.slice(0, 8).map((j, i) => (
                  <li key={j.player.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                    <span className="tabular w-5 text-center text-muted">{i + 1}</span>
                    <Escudo src={j.player.photo} nome={j.player.name} tamanho={28} redondo />
                    <Link
                      href={`/jogadores/${j.player.id}`}
                      className="font-medium hover:text-brand hover:underline"
                    >
                      {j.player.name}
                    </Link>
                    <span className="tabular ml-auto font-semibold">{j.statistics[0]?.goals.total ?? 0}</span>
                  </li>
                ))}
              </ul>
            )}
          </Consulta>
        </Cartao>
      </div>
    </>
  );
}
