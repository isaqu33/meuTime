"use client";

import Link from "next/link";
import { CaretLeft } from "phosphor-react";
import { useState } from "react";
import { TabelaJogos } from "@/components/futebol/comuns";
import { TabelaTransferencias } from "@/components/futebol/Transferencias";
import { Abas } from "@/components/ui/Abas";
import { Cartao, DefLista, Metrica, Pilula } from "@/components/ui/Cartao";
import { Seletor } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { RodapePaginacao, Tabela, type Coluna } from "@/components/ui/Tabela";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { gramado, numero, pais, posicao } from "@/lib/formatar";
import type {
  Elenco,
  EstatisticasTemporadaTime,
  JogadorApi,
  Jogo,
  Lesao,
  LiganaApi,
  TimeApi,
  Tecnico,
  Transferencia,
} from "@/types/apiFootball";
import { TabelaLesoes } from "./jogo/abas";

function AbaElenco({ id }: { id: string }) {
  const q = useApi<Elenco[]>("players/squads", { team: id });
  type Linha = Elenco["players"][number];
  const colunas: Coluna<Linha>[] = [
    {
      titulo: "Nº",
      alinhar: "center",
      render: (p) => <span className="tabular text-muted">{p.number ?? "-"}</span>,
      ordenar: (p) => p.number ?? 999,
    },
    {
      titulo: "Jogador",
      render: (p) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={p.photo} nome={p.name} tamanho={28} redondo />
          {p.name}
        </span>
      ),
      ordenar: (p) => p.name,
    },
    { titulo: "Posição", render: (p) => posicao(p.position), ordenar: (p) => p.position },
    {
      titulo: "Idade",
      alinhar: "right",
      render: (p) => <span className="tabular">{p.age ?? "-"}</span>,
      ordenar: (p) => p.age ?? 0,
    },
  ];
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Elenco indisponível.")}>
        {([e]) => (
          <Tabela
            rotulo="Elenco"
            colunas={colunas}
            linhas={e?.players ?? []}
            chave={(p) => p.id}
            href={(p) => `/jogadores/${p.id}`}
            buscavel={(p) => p.name}
            tamanhoInicial={20}
          />
        )}
      </Consulta>
    </Cartao>
  );
}

function AbaJogos({ id }: { id: string }) {
  const { temporada, fuso } = usePreferencias();
  const q = useApi<Jogo[]>("fixtures", { team: id, season: temporada, timezone: fuso });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhum jogo na temporada.")}>
        {(jogos) => <TabelaJogos jogos={jogos} mostrarLiga />}
      </Consulta>
    </Cartao>
  );
}

function AbaEstatisticas({ id }: { id: string }) {
  const { temporada } = usePreferencias();
  const ligas = useApi<LiganaApi[]>("leagues", { team: id, season: temporada });
  const [liga, setLiga] = useState<number | null>(null);
  const lista = ligas.data?.response ?? [];
  const ligaAtual = liga ?? lista[0]?.league.id ?? null;
  const q = useApi<EstatisticasTemporadaTime>(
    "teams/statistics",
    { team: id, league: ligaAtual, season: temporada },
    { enabled: ligaAtual !== null }
  );

  return (
    <div className="space-y-4">
      <Consulta q={ligas} vazio={vazioSeLista("Este time não disputou competições nesta temporada.")}>
        {(ls) => (
          <Seletor
            rotulo="Competição"
            valor={ligaAtual ?? 0}
            onChange={setLiga}
            opcoes={ls.map((l) => ({ valor: l.league.id, texto: l.league.name }))}
            className="w-72"
          />
        )}
      </Consulta>
      {ligaAtual !== null && (
        <Cartao>
          <Consulta q={q}>
            {(e) => (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Metrica
                  rotulo="Jogos"
                  valor={e.fixtures.played.total}
                  detalhe={`${e.fixtures.played.home} em casa · ${e.fixtures.played.away} fora`}
                />
                <Metrica rotulo="Vitórias" valor={e.fixtures.wins.total} />
                <Metrica rotulo="Empates" valor={e.fixtures.draws.total} />
                <Metrica rotulo="Derrotas" valor={e.fixtures.loses.total} />
                <Metrica
                  rotulo="Gols marcados"
                  valor={e.goals.for.total.total}
                  detalhe={`${e.goals.for.average.total} por jogo`}
                />
                <Metrica
                  rotulo="Gols sofridos"
                  valor={e.goals.against.total.total}
                  detalhe={`${e.goals.against.average.total} por jogo`}
                />
                <Metrica rotulo="Jogos sem sofrer gol" valor={e.clean_sheet.total} />
                <Metrica rotulo="Jogos sem marcar" valor={e.failed_to_score.total} />
                <div className="col-span-2 md:col-span-4">
                  <p className="mb-2 text-xs text-muted">Esquemas mais usados</p>
                  <div className="flex flex-wrap gap-2">
                    {e.lineups.map((l) => (
                      <Pilula key={l.formation} tom="marca">
                        {l.formation} · {l.played}x
                      </Pilula>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Consulta>
        </Cartao>
      )}
    </div>
  );
}

function AbaJogadoresTemporada({ id }: { id: string }) {
  const { temporada } = usePreferencias();
  const [pagina, setPagina] = useState(1);
  const q = useApi<JogadorApi[]>("players", { team: id, season: temporada, page: pagina });
  const colunas: Coluna<JogadorApi>[] = [
    {
      titulo: "Jogador",
      render: (j) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={j.player.photo} nome={j.player.name} tamanho={28} redondo />
          {j.player.name}
        </span>
      ),
    },
    { titulo: "Posição", render: (j) => posicao(j.statistics[0]?.games.position) },
    {
      titulo: "Jogos",
      alinhar: "right",
      render: (j) => <span className="tabular">{j.statistics[0]?.games.appearences ?? 0}</span>,
    },
    {
      titulo: "Gols",
      alinhar: "right",
      render: (j) => <span className="tabular">{j.statistics[0]?.goals.total ?? 0}</span>,
    },
    {
      titulo: "Assist.",
      alinhar: "right",
      render: (j) => <span className="tabular">{j.statistics[0]?.goals.assists ?? 0}</span>,
    },
    {
      titulo: "Nota",
      alinhar: "right",
      render: (j) => <b className="tabular">{j.statistics[0]?.games.rating?.slice(0, 4) ?? "-"}</b>,
    },
  ];
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Sem estatísticas de jogadores nesta temporada.")}>
        {(js, paging) => (
          <>
            <Tabela
              rotulo="Jogadores da temporada"
              colunas={colunas}
              linhas={js}
              chave={(j) => j.player.id}
              href={(j) => `/jogadores/${j.player.id}`}
              tamanhoInicial={20}
            />
            {paging && <RodapePaginacao pagina={pagina} totalPaginas={paging.total} onPagina={setPagina} />}
          </>
        )}
      </Consulta>
    </Cartao>
  );
}

function AbaTransferencias({ id }: { id: string }) {
  const q = useApi<Transferencia[]>("transfers", { team: id });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhuma transferência registrada.")}>
        {(ts) => <TabelaTransferencias transferencias={ts} timeId={Number(id)} />}
      </Consulta>
    </Cartao>
  );
}

function AbaTecnico({ id }: { id: string }) {
  const q = useApi<Tecnico[]>("coachs", { team: id });
  return (
    <Consulta q={q} vazio={vazioSeLista("Técnico não informado.")}>
      {(ts) => (
        <div className="grid gap-4 md:grid-cols-2">
          {ts.map((t) => (
            <Cartao key={t.id}>
              <Link href={`/tecnicos/${t.id}`} className="flex items-center gap-4 hover:text-brand">
                <Escudo src={t.photo} nome={t.name} tamanho={56} redondo />
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-sm text-muted">
                    {pais(t.nationality)} · {t.age ?? "-"} anos
                  </p>
                </div>
              </Link>
            </Cartao>
          ))}
        </div>
      )}
    </Consulta>
  );
}

function AbaLesoes({ id }: { id: string }) {
  const { temporada } = usePreferencias();
  const q = useApi<Lesao[]>("injuries", { team: id, season: temporada });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhuma lesão informada.")}>
        {(ls) => <TabelaLesoes lesoes={ls} mostrarJogo />}
      </Consulta>
    </Cartao>
  );
}

function AbaTemporadas({ id }: { id: string }) {
  const q = useApi<number[]>("teams/seasons", { team: id });
  return (
    <Cartao titulo="Temporadas com dados">
      <Consulta q={q} vazio={vazioSeLista("Sem temporadas.")}>
        {(anos) => (
          <div className="flex flex-wrap gap-2">
            {[...anos].reverse().map((a) => (
              <Pilula key={a}>{a}</Pilula>
            ))}
          </div>
        )}
      </Consulta>
    </Cartao>
  );
}

export default function Time({ id }: { id: string }) {
  const q = useApi<TimeApi[]>("teams", { id }, { staleTime: 60 * 60_000 });

  return (
    <>
      <Link href="/times" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <CaretLeft size={14} /> Times
      </Link>

      <Consulta q={q} vazio={(d) => (d.length === 0 ? "Time não encontrado." : false)} linhas={2}>
        {([t]) => (
          <div className="space-y-6">
            <Cartao>
              <div className="flex flex-wrap items-center gap-5">
                <Escudo src={t.team.logo} nome={t.team.name} tamanho={72} />
                <div className="min-w-48 flex-1">
                  <h1 className="text-2xl font-bold tracking-tight">{t.team.name}</h1>
                  <p className="text-sm text-muted">
                    {pais(t.team.country)}
                    {t.team.founded ? ` · fundado em ${t.team.founded}` : ""}{" "}
                    {t.team.national && <Pilula tom="marca">Seleção</Pilula>}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-line pt-4">
                <DefLista
                  itens={[
                    ["Estádio", t.venue.name],
                    ["Cidade", t.venue.city],
                    ["Capacidade", t.venue.capacity ? numero(t.venue.capacity) : null],
                    ["Gramado", gramado(t.venue.surface)],
                    ["Endereço", t.venue.address],
                    ["Sigla", t.team.code],
                  ]}
                />
              </div>
            </Cartao>

            <Abas
              itens={[
                { rotulo: "Elenco", conteudo: () => <AbaElenco id={id} /> },
                { rotulo: "Jogos", conteudo: () => <AbaJogos id={id} /> },
                { rotulo: "Estatísticas", conteudo: () => <AbaEstatisticas id={id} /> },
                { rotulo: "Jogadores da temporada", conteudo: () => <AbaJogadoresTemporada id={id} /> },
                { rotulo: "Transferências", conteudo: () => <AbaTransferencias id={id} /> },
                { rotulo: "Técnico", conteudo: () => <AbaTecnico id={id} /> },
                { rotulo: "Lesões", conteudo: () => <AbaLesoes id={id} /> },
                { rotulo: "Temporadas", conteudo: () => <AbaTemporadas id={id} /> },
              ]}
            />
          </div>
        )}
      </Consulta>
    </>
  );
}
