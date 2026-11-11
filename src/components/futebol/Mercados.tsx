"use client";

import { Tabela, type Coluna } from "@/components/ui/Tabela";

export interface Mercado {
  id: number;
  name: string;
  values: { value: string; odd: string; suspended?: boolean }[];
}

/** Mercados de apostas (odds) numa tabela paginada: um mercado por linha, as opções como chips. */
export function Mercados({ mercados }: { mercados: Mercado[] }) {
  const colunas: Coluna<Mercado>[] = [
    {
      titulo: "Mercado",
      render: (m) => <span className="font-medium">{m.name}</span>,
      ordenar: (m) => m.name,
    },
    {
      titulo: "Opções",
      render: (m) => (
        <span className="flex flex-wrap gap-1.5">
          {m.values.slice(0, 12).map((v, i) => (
            <span
              key={`${v.value}-${i}`}
              className={`tabular inline-flex items-center gap-1.5 rounded-md bg-subtle px-2 py-1 text-xs ${v.suspended ? "opacity-50" : ""}`}
            >
              <span className="text-muted">{v.value}</span>
              <b className="text-brand">{v.odd}</b>
            </span>
          ))}
          {m.values.length > 12 && <span className="text-xs text-muted">+{m.values.length - 12}</span>}
        </span>
      ),
    },
  ];
  return (
    <Tabela
      rotulo="Mercados de odds"
      colunas={colunas}
      linhas={mercados}
      chave={(m) => m.id}
      buscavel={(m) => m.name}
      tamanhoInicial={10}
      vazio="Sem odds para este jogo."
    />
  );
}
