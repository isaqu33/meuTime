"use client";

import { Escudo } from "@/components/ui/Escudo";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { numero, pais } from "@/lib/formatar";
import type { TimeApi } from "@/types/apiFootball";

export function TabelaTimes({ times }: { times: TimeApi[] }) {
  const colunas: Coluna<TimeApi>[] = [
    {
      titulo: "Time",
      render: (t) => (
        <span className="inline-flex items-center gap-3">
          <Escudo src={t.team.logo} nome={t.team.name} tamanho={28} />
          {t.team.name}
        </span>
      ),
      ordenar: (t) => t.team.name,
    },
    { titulo: "País", render: (t) => pais(t.team.country), ordenar: (t) => t.team.country ?? "" },
    {
      titulo: "Fundação",
      alinhar: "right",
      render: (t) => <span className="tabular">{t.team.founded ?? "-"}</span>,
      ordenar: (t) => t.team.founded ?? 0,
    },
    { titulo: "Estádio", render: (t) => t.venue.name ?? "-" },
    { titulo: "Cidade", render: (t) => t.venue.city ?? "-" },
    {
      titulo: "Capacidade",
      alinhar: "right",
      render: (t) => <span className="tabular">{numero(t.venue.capacity)}</span>,
      ordenar: (t) => t.venue.capacity ?? 0,
    },
  ];
  return (
    <Tabela
      rotulo="Times"
      colunas={colunas}
      linhas={times}
      chave={(t) => t.team.id}
      href={(t) => `/times/${t.team.id}`}
      buscavel={(t) => `${t.team.name} ${t.team.country ?? ""} ${t.venue.name ?? ""} ${t.venue.city ?? ""}`}
      tamanhoInicial={10}
    />
  );
}
