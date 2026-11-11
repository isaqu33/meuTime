"use client";

import Link from "next/link";
import { CaretLeft } from "phosphor-react";
import { LinkTime } from "@/components/futebol/comuns";
import { TabelaTransferencias } from "@/components/futebol/Transferencias";
import { Abas } from "@/components/ui/Abas";
import { Cartao, DefLista, Pilula } from "@/components/ui/Cartao";
import { Seletor } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { TabelaAfastamentos, TabelaTrofeus } from "@/components/futebol/Carreira";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { formatarData, pais, posicao } from "@/lib/formatar";
import type {
  Afastamento,
  EstatisticaJogador,
  JogadorApi,
  JogadorPerfil,
  TimeDoJogador,
  Transferencia,
  Trofeu,
} from "@/types/apiFootball";
import { useState } from "react";

function AbaEstatisticas({ id }: { id: string }) {
  const { temporada } = usePreferencias();
  const anos = useApi<number[]>("players/seasons", { player: id });
  const [ano, setAno] = useState<number | null>(null);
  const lista = anos.data?.response ?? [];
  const atual = ano ?? (lista.includes(temporada) ? temporada : (lista[lista.length - 1] ?? temporada));
  const q = useApi<JogadorApi[]>("players", { id, season: atual });

  const colunas: Coluna<EstatisticaJogador>[] = [
    {
      titulo: "Competição",
      render: (e) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={e.league.logo} nome={e.league.name ?? ""} tamanho={22} />
          {e.league.name}
        </span>
      ),
      ordenar: (e) => e.league.name ?? "",
    },
    { titulo: "Time", render: (e) => <LinkTime time={e.team} tamanho={20} /> },
    {
      titulo: "Jogos",
      alinhar: "right",
      render: (e) => <span className="tabular">{e.games.appearences ?? 0}</span>,
      ordenar: (e) => e.games.appearences ?? 0,
    },
    {
      titulo: "Min",
      alinhar: "right",
      render: (e) => <span className="tabular">{e.games.minutes ?? 0}</span>,
      ordenar: (e) => e.games.minutes ?? 0,
    },
    {
      titulo: "Gols",
      alinhar: "right",
      render: (e) => <b className="tabular">{e.goals.total ?? 0}</b>,
      ordenar: (e) => e.goals.total ?? 0,
    },
    {
      titulo: "Assist.",
      alinhar: "right",
      render: (e) => <span className="tabular">{e.goals.assists ?? 0}</span>,
      ordenar: (e) => e.goals.assists ?? 0,
    },
    {
      titulo: "Chutes",
      alinhar: "right",
      render: (e) => <span className="tabular">{e.shots.total ?? 0}</span>,
    },
    {
      titulo: "Passes",
      alinhar: "right",
      render: (e) => <span className="tabular">{e.passes.total ?? 0}</span>,
    },
    {
      titulo: "Desarmes",
      alinhar: "right",
      render: (e) => <span className="tabular">{e.tackles.total ?? 0}</span>,
    },
    {
      titulo: "Nota",
      alinhar: "right",
      render: (e) => <b className="tabular">{e.games.rating?.slice(0, 4) ?? "-"}</b>,
    },
    {
      titulo: "Cartões",
      alinhar: "right",
      render: (e) => (
        <span className="tabular">
          🟨{e.cards.yellow ?? 0} 🟥{e.cards.red ?? 0}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <Seletor
        rotulo="Temporada"
        valor={atual}
        onChange={setAno}
        opcoes={(lista.length ? [...lista].reverse() : [atual]).map((a) => ({ valor: a, texto: String(a) }))}
        className="w-40"
      />
      <Cartao semPadding>
        <Consulta q={q} vazio={vazioSeLista("Sem estatísticas nesta temporada.")}>
          {([j]) => (
            <Tabela
              rotulo="Estatísticas por competição"
              colunas={colunas}
              linhas={j?.statistics ?? []}
              chave={(e, i) => `${e.league.id}-${e.team.id}-${i}`}
              tamanhoInicial={10}
            />
          )}
        </Consulta>
      </Cartao>
    </div>
  );
}

function AbaTransferencias({ id }: { id: string }) {
  const q = useApi<Transferencia[]>("transfers", { player: id });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhuma transferência registrada.")}>
        {(ts) => <TabelaTransferencias transferencias={ts} mostrarJogador={false} />}
      </Consulta>
    </Cartao>
  );
}

function AbaTrofeus({ id }: { id: string }) {
  const q = useApi<Trofeu[]>("trophies", { player: id });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhum troféu registrado.")}>
        {(ts) => <TabelaTrofeus trofeus={ts} />}
      </Consulta>
    </Cartao>
  );
}

function AbaAfastamentos({ id }: { id: string }) {
  const q = useApi<Afastamento[]>("sidelined", { player: id });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhum afastamento registrado.")}>
        {(as) => <TabelaAfastamentos afastamentos={as} />}
      </Consulta>
    </Cartao>
  );
}

function AbaTimes({ id }: { id: string }) {
  const q = useApi<TimeDoJogador[]>("players/teams", { player: id });
  const colunas: Coluna<TimeDoJogador>[] = [
    { titulo: "Time", render: (t) => <LinkTime time={t.team} />, ordenar: (t) => t.team.name },
    {
      titulo: "Temporadas",
      render: (t) => (
        <span className="flex flex-wrap gap-1">
          {[...t.seasons]
            .sort((a, b) => b - a)
            .map((s) => (
              <Pilula key={s}>{s}</Pilula>
            ))}
        </span>
      ),
    },
  ];
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Sem histórico de times.")}>
        {(ts) => (
          <Tabela
            rotulo="Times do jogador"
            colunas={colunas}
            linhas={ts}
            chave={(t) => t.team.id}
            tamanhoInicial={10}
          />
        )}
      </Consulta>
    </Cartao>
  );
}

export default function Jogador({ id }: { id: string }) {
  const q = useApi<JogadorPerfil[]>("players/profiles", { player: id }, { staleTime: 60 * 60_000 });

  return (
    <>
      <Link
        href="/jogadores"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg"
      >
        <CaretLeft size={14} /> Jogadores
      </Link>

      <Consulta q={q} vazio={(d) => (d.length === 0 ? "Jogador não encontrado." : false)} linhas={2}>
        {([{ player: p }]) => (
          <div className="space-y-6">
            <Cartao>
              <div className="flex flex-wrap items-center gap-5">
                <Escudo src={p.photo} nome={p.name} tamanho={88} redondo />
                <div className="min-w-48 flex-1">
                  <h1 className="text-2xl font-bold tracking-tight">{p.name}</h1>
                  <p className="text-sm text-muted">
                    {`${p.firstname ?? ""} ${p.lastname ?? ""}`.trim()} · {pais(p.nationality)}
                  </p>
                  <p className="mt-1 flex gap-2">
                    {p.position && <Pilula tom="marca">{posicao(p.position)}</Pilula>}
                    {p.number !== null && <Pilula>Camisa {p.number}</Pilula>}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-line pt-4">
                <DefLista
                  itens={[
                    ["Idade", p.age],
                    ["Nascimento", p.birth.date ? formatarData(p.birth.date) : null],
                    ["Local de nascimento", [p.birth.place, p.birth.country].filter(Boolean).join(", ")],
                    ["Altura", p.height],
                    ["Peso", p.weight],
                  ]}
                />
              </div>
            </Cartao>

            <Abas
              itens={[
                { rotulo: "Estatísticas", conteudo: () => <AbaEstatisticas id={id} /> },
                { rotulo: "Transferências", conteudo: () => <AbaTransferencias id={id} /> },
                { rotulo: "Troféus", conteudo: () => <AbaTrofeus id={id} /> },
                { rotulo: "Afastamentos", conteudo: () => <AbaAfastamentos id={id} /> },
                { rotulo: "Times", conteudo: () => <AbaTimes id={id} /> },
              ]}
            />
          </div>
        )}
      </Consulta>
    </>
  );
}
