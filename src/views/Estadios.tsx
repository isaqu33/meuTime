"use client";

import { useState } from "react";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { Alternador, CampoBusca, Seletor } from "@/components/ui/Campos";
import { Consulta, Vazio, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { useApi } from "@/hooks/useApi";
import { gramado, numero } from "@/lib/formatar";
import type { Estadio, Pais } from "@/types/apiFootball";

export default function Estadios() {
  const [modo, setModo] = useState("pais");
  const [pais, setPais] = useState("Brazil");
  const [busca, setBusca] = useState("");

  const paises = useApi<Pais[]>("countries", {}, { enabled: modo === "pais", staleTime: 24 * 60 * 60_000 });
  const pronto = modo === "pais" || busca.length >= 3;
  const q = useApi<Estadio[]>("venues", modo === "pais" ? { country: pais } : { search: busca }, {
    enabled: pronto,
  });

  const colunas: Coluna<Estadio>[] = [
    {
      titulo: "Estádio",
      render: (e) => (
        <span className="inline-flex items-center gap-3">
          <Escudo src={e.image} nome={e.name ?? ""} tamanho={36} />
          {e.name}
        </span>
      ),
      ordenar: (e) => e.name ?? "",
    },
    { titulo: "Cidade", render: (e) => e.city ?? "-", ordenar: (e) => e.city ?? "" },
    { titulo: "País", render: (e) => e.country ?? "-" },
    {
      titulo: "Capacidade",
      alinhar: "right",
      render: (e) => <span className="tabular">{numero(e.capacity)}</span>,
      ordenar: (e) => e.capacity ?? 0,
    },
    { titulo: "Gramado", render: (e) => gramado(e.surface) ?? "-" },
  ];

  return (
    <>
      <PaginaTitulo
        titulo="Estádios"
        descricao="Arenas por país ou por nome, com cidade, capacidade e gramado."
      />
      <Cartao className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <Alternador
            rotulo="Tipo de consulta"
            valor={modo}
            onChange={setModo}
            opcoes={[
              { valor: "pais", texto: "Por país" },
              { valor: "busca", texto: "Buscar por nome" },
            ]}
          />
          {modo === "pais" ? (
            <Seletor
              rotulo="País"
              valor={pais}
              onChange={setPais}
              opcoes={(paises.data?.response ?? [{ name: "Brazil" } as Pais]).map((p) => ({
                valor: p.name,
                texto: p.name,
              }))}
              className="w-56"
            />
          ) : (
            <CampoBusca
              valor={busca}
              onChange={setBusca}
              placeholder="Nome do estádio (mín. 3 letras)"
              rotulo="Buscar estádio"
            />
          )}
        </div>
      </Cartao>
      <Cartao semPadding>
        {!pronto ? (
          <Vazio>Digite pelo menos 3 letras para buscar.</Vazio>
        ) : (
          <Consulta q={q} vazio={vazioSeLista("Nenhum estádio encontrado.")} linhas={8}>
            {(es) => (
              <Tabela
                rotulo="Estádios"
                colunas={colunas}
                linhas={es}
                chave={(e, i) => e.id ?? i}
                buscavel={(e) => `${e.name} ${e.city}`}
                tamanhoInicial={10}
              />
            )}
          </Consulta>
        )}
      </Cartao>
    </>
  );
}
