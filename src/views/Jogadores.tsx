"use client";

import { useState } from "react";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { Alternador, CampoBusca, Seletor } from "@/components/ui/Campos";
import { Consulta, Vazio, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { RodapePaginacao, Tabela, type Coluna } from "@/components/ui/Tabela";
import { LinkTime } from "@/components/futebol/comuns";
import { LIGAS_POPULARES } from "@/data/ligas";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { pais, posicao } from "@/lib/formatar";
import type { JogadorApi, JogadorPerfil } from "@/types/apiFootball";

type Modo = "perfis" | "liga";

function PorPerfil() {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const pronto = busca.length >= 3;
  const q = useApi<JogadorPerfil[]>("players/profiles", { search: busca, page: pagina }, { enabled: pronto });

  const colunas: Coluna<JogadorPerfil>[] = [
    {
      titulo: "Jogador",
      render: (j) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={j.player.photo} nome={j.player.name} tamanho={32} redondo />
          {j.player.name}
        </span>
      ),
      ordenar: (j) => j.player.name,
    },
    {
      titulo: "Nome completo",
      render: (j) => `${j.player.firstname ?? ""} ${j.player.lastname ?? ""}`.trim() || "-",
    },
    { titulo: "Nacionalidade", render: (j) => pais(j.player.nationality) },
    { titulo: "Posição", render: (j) => posicao(j.player.position) },
    {
      titulo: "Idade",
      alinhar: "right",
      render: (j) => <span className="tabular">{j.player.age ?? "-"}</span>,
      ordenar: (j) => j.player.age ?? 0,
    },
  ];

  return (
    <>
      <Cartao className="mb-6">
        <CampoBusca
          valor={busca}
          onChange={(v) => {
            setBusca(v);
            setPagina(1);
          }}
          placeholder="Nome do jogador (mín. 3 letras)"
          rotulo="Buscar jogador"
        />
      </Cartao>
      <Cartao semPadding>
        {!pronto ? (
          <Vazio>Digite pelo menos 3 letras para buscar um jogador.</Vazio>
        ) : (
          <Consulta q={q} vazio={vazioSeLista("Nenhum jogador encontrado.")}>
            {(js, paging) => (
              <>
                <Tabela
                  rotulo="Perfis de jogadores"
                  colunas={colunas}
                  linhas={js}
                  chave={(j) => j.player.id}
                  href={(j) => `/jogadores/${j.player.id}`}
                  tamanhoInicial={20}
                />
                {paging && (
                  <RodapePaginacao pagina={pagina} totalPaginas={paging.total} onPagina={setPagina} />
                )}
              </>
            )}
          </Consulta>
        )}
      </Cartao>
    </>
  );
}

function PorLiga() {
  const { liga: ligaPadrao, temporada } = usePreferencias();
  const [liga, setLiga] = useState<number>(ligaPadrao);
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const q = useApi<JogadorApi[]>("players", {
    league: liga,
    season: temporada,
    search: busca || undefined,
    page: pagina,
  });

  const colunas: Coluna<JogadorApi>[] = [
    {
      titulo: "Jogador",
      render: (j) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={j.player.photo} nome={j.player.name} tamanho={32} redondo />
          {j.player.name}
        </span>
      ),
      ordenar: (j) => j.player.name,
    },
    {
      titulo: "Time",
      render: (j) => (j.statistics[0] ? <LinkTime time={j.statistics[0].team} tamanho={20} /> : "-"),
    },
    { titulo: "Posição", render: (j) => posicao(j.statistics[0]?.games.position) },
    {
      titulo: "Jogos",
      alinhar: "right",
      render: (j) => <span className="tabular">{j.statistics[0]?.games.appearences ?? 0}</span>,
      ordenar: (j) => j.statistics[0]?.games.appearences ?? 0,
    },
    {
      titulo: "Gols",
      alinhar: "right",
      render: (j) => <span className="tabular">{j.statistics[0]?.goals.total ?? 0}</span>,
      ordenar: (j) => j.statistics[0]?.goals.total ?? 0,
    },
    {
      titulo: "Assist.",
      alinhar: "right",
      render: (j) => <span className="tabular">{j.statistics[0]?.goals.assists ?? 0}</span>,
      ordenar: (j) => j.statistics[0]?.goals.assists ?? 0,
    },
    {
      titulo: "Nota",
      alinhar: "right",
      render: (j) => <b className="tabular">{j.statistics[0]?.games.rating?.slice(0, 4) ?? "-"}</b>,
    },
  ];

  return (
    <>
      <Cartao className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <Seletor
            rotulo="Liga"
            valor={liga}
            onChange={(v) => {
              setLiga(v);
              setPagina(1);
            }}
            opcoes={LIGAS_POPULARES.map((l) => ({ valor: l.id, texto: l.nome }))}
            className="w-56"
          />
          <CampoBusca
            valor={busca}
            onChange={(v) => {
              setBusca(v);
              setPagina(1);
            }}
            placeholder="Filtrar por nome (mín. 3 letras)"
            rotulo="Filtrar jogadores"
          />
        </div>
      </Cartao>
      <Cartao semPadding>
        <Consulta q={q} vazio={vazioSeLista("Nenhum jogador encontrado.")} linhas={8}>
          {(js, paging) => (
            <>
              <Tabela
                rotulo="Jogadores da liga"
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
    </>
  );
}

export default function Jogadores() {
  const [modo, setModo] = useState<Modo>("perfis");
  return (
    <>
      <PaginaTitulo
        titulo="Jogadores"
        descricao="Busque qualquer jogador pelo nome ou veja os atletas de uma liga na temporada."
      />
      <div className="mb-4">
        <Alternador
          rotulo="Tipo de consulta"
          valor={modo}
          onChange={(v) => setModo(v as Modo)}
          opcoes={[
            { valor: "perfis", texto: "Buscar por nome" },
            { valor: "liga", texto: "Por liga" },
          ]}
        />
      </div>
      {modo === "perfis" ? <PorPerfil /> : <PorLiga />}
    </>
  );
}
