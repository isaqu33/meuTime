"use client";

import { useState } from "react";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { Alternador } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { useApi } from "@/hooks/useApi";
import { pais } from "@/lib/formatar";
import type { Pais } from "@/types/apiFootball";

export default function Paises() {
  const [modo, setModo] = useState("todos");
  const q = useApi<Pais[]>(
    modo === "todos" ? "countries" : "teams/countries",
    {},
    { staleTime: 24 * 60 * 60_000 }
  );

  const colunas: Coluna<Pais>[] = [
    {
      titulo: "País",
      render: (p) => (
        <span className="inline-flex items-center gap-3">
          <Escudo src={p.flag} nome={p.name} tamanho={22} />
          {p.name}
        </span>
      ),
      ordenar: (p) => p.name,
    },
    { titulo: "Em português", render: (p) => pais(p.name) },
    {
      titulo: "Código",
      render: (p) => <span className="tabular text-muted">{p.code ?? "-"}</span>,
      ordenar: (p) => p.code ?? "",
    },
  ];

  return (
    <>
      <PaginaTitulo titulo="Países" descricao="Países com dados na API-Sports." />
      <div className="mb-4">
        <Alternador
          rotulo="Lista"
          valor={modo}
          onChange={setModo}
          opcoes={[
            { valor: "todos", texto: "Todos" },
            { valor: "times", texto: "Com times cadastrados" },
          ]}
        />
      </div>
      <Cartao semPadding>
        <Consulta q={q} vazio={vazioSeLista("Nenhum país encontrado.")} linhas={8}>
          {(ps) => (
            <Tabela
              rotulo="Países"
              colunas={colunas}
              linhas={ps}
              chave={(p) => p.name}
              buscavel={(p) => `${p.name} ${pais(p.name)} ${p.code ?? ""}`}
              tamanhoInicial={20}
            />
          )}
        </Consulta>
      </Cartao>
    </>
  );
}
