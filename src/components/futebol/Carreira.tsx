"use client";

import { Pilula } from "@/components/ui/Cartao";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { formatarData, pais } from "@/lib/formatar";
import type { Afastamento, Trofeu } from "@/types/apiFootball";

export function TabelaTrofeus({ trofeus }: { trofeus: Trofeu[] }) {
  const colunas: Coluna<Trofeu>[] = [
    { titulo: "Competição", render: (t) => t.league, ordenar: (t) => t.league },
    { titulo: "País", render: (t) => pais(t.country), ordenar: (t) => t.country },
    {
      titulo: "Temporada",
      render: (t) => <span className="tabular">{t.season}</span>,
      ordenar: (t) => t.season,
    },
    {
      titulo: "Resultado",
      render: (t) => (
        <Pilula tom={t.place === "Winner" ? "ok" : "neutro"}>
          {t.place === "Winner" ? "Campeão" : t.place === "2nd Place" ? "Vice" : t.place}
        </Pilula>
      ),
      ordenar: (t) => t.place,
    },
  ];
  return (
    <Tabela
      rotulo="Troféus"
      colunas={colunas}
      linhas={[...trofeus].sort((a, b) => b.season.localeCompare(a.season))}
      chave={(t, i) => `${t.league}-${t.season}-${i}`}
      buscavel={(t) => `${t.league} ${t.country} ${t.season}`}
      tamanhoInicial={10}
    />
  );
}

export function TabelaAfastamentos({ afastamentos }: { afastamentos: Afastamento[] }) {
  const colunas: Coluna<Afastamento>[] = [
    { titulo: "Motivo", render: (a) => a.type, ordenar: (a) => a.type },
    {
      titulo: "Início",
      render: (a) => <span className="tabular">{formatarData(a.start)}</span>,
      ordenar: (a) => a.start,
    },
    {
      titulo: "Fim",
      render: (a) => <span className="tabular">{formatarData(a.end)}</span>,
      ordenar: (a) => a.end ?? "",
    },
  ];
  return (
    <Tabela
      rotulo="Afastamentos"
      colunas={colunas}
      linhas={[...afastamentos].sort((a, b) => b.start.localeCompare(a.start))}
      chave={(a, i) => `${a.start}-${i}`}
      tamanhoInicial={10}
    />
  );
}
