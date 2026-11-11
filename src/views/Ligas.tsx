"use client";

import { useState } from "react";
import { Cartao, PaginaTitulo, Pilula } from "@/components/ui/Cartao";
import { Seletor } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { pais } from "@/lib/formatar";
import type { LiganaApi } from "@/types/apiFootball";

export default function Ligas() {
  const { temporada } = usePreferencias();
  const [tipo, setTipo] = useState("");
  const q = useApi<LiganaApi[]>(
    "leagues",
    { season: temporada, type: tipo || undefined },
    { staleTime: 60 * 60_000 }
  );

  const colunas: Coluna<LiganaApi>[] = [
    {
      titulo: "Competição",
      render: (l) => (
        <span className="inline-flex items-center gap-3">
          <Escudo src={l.league.logo} nome={l.league.name} tamanho={28} />
          {l.league.name}
        </span>
      ),
      ordenar: (l) => l.league.name,
    },
    {
      titulo: "País",
      render: (l) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={l.country.flag} nome={l.country.name} tamanho={18} />
          {pais(l.country.name)}
        </span>
      ),
      ordenar: (l) => l.country.name,
    },
    {
      titulo: "Tipo",
      render: (l) => (
        <Pilula tom={l.league.type === "League" ? "marca" : "aviso"}>
          {l.league.type === "League" ? "Liga" : "Copa"}
        </Pilula>
      ),
    },
    {
      titulo: "ID",
      alinhar: "right",
      render: (l) => <span className="tabular text-muted">{l.league.id}</span>,
      ordenar: (l) => l.league.id,
    },
  ];

  return (
    <>
      <PaginaTitulo titulo="Ligas e copas" descricao={`Competições com dados na temporada ${temporada}.`} />
      <Cartao className="mb-6">
        <Seletor
          rotulo="Tipo"
          valor={tipo}
          onChange={setTipo}
          opcoes={[
            { valor: "", texto: "Todas" },
            { valor: "league", texto: "Ligas" },
            { valor: "cup", texto: "Copas" },
          ]}
          className="w-48"
        />
      </Cartao>
      <Cartao semPadding>
        <Consulta q={q} vazio={vazioSeLista("Nenhuma competição encontrada.")} linhas={8}>
          {(ligas) => (
            <Tabela
              rotulo="Ligas e copas"
              colunas={colunas}
              linhas={ligas}
              chave={(l) => l.league.id}
              href={(l) => `/ligas/${l.league.id}`}
              buscavel={(l) => `${l.league.name} ${l.country.name} ${pais(l.country.name)}`}
              tamanhoInicial={20}
            />
          )}
        </Consulta>
      </Cartao>
    </>
  );
}
