"use client";

import { useState } from "react";
import { LinkTime } from "@/components/futebol/comuns";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { CampoBusca } from "@/components/ui/Campos";
import { Consulta, Vazio, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { useApi } from "@/hooks/useApi";
import { pais } from "@/lib/formatar";
import type { Tecnico } from "@/types/apiFootball";

export default function Tecnicos() {
  const [busca, setBusca] = useState("");
  const pronto = busca.length >= 3;
  const q = useApi<Tecnico[]>("coachs", { search: busca }, { enabled: pronto });

  const colunas: Coluna<Tecnico>[] = [
    {
      titulo: "Técnico",
      render: (t) => (
        <span className="inline-flex items-center gap-2">
          <Escudo src={t.photo} nome={t.name} tamanho={32} redondo />
          {t.name}
        </span>
      ),
      ordenar: (t) => t.name,
    },
    { titulo: "Nacionalidade", render: (t) => pais(t.nationality) },
    {
      titulo: "Idade",
      alinhar: "right",
      render: (t) => <span className="tabular">{t.age ?? "-"}</span>,
      ordenar: (t) => t.age ?? 0,
    },
    { titulo: "Time atual", render: (t) => (t.team ? <LinkTime time={t.team} tamanho={20} /> : "-") },
  ];

  return (
    <>
      <PaginaTitulo
        titulo="Técnicos"
        descricao="Busque um treinador pelo nome para ver a carreira, os troféus e os afastamentos."
      />
      <Cartao className="mb-6">
        <CampoBusca
          valor={busca}
          onChange={setBusca}
          placeholder="Nome do técnico (mín. 3 letras)"
          rotulo="Buscar técnico"
        />
      </Cartao>
      <Cartao semPadding>
        {!pronto ? (
          <Vazio>Digite pelo menos 3 letras para buscar um técnico.</Vazio>
        ) : (
          <Consulta q={q} vazio={vazioSeLista("Nenhum técnico encontrado.")}>
            {(ts) => (
              <Tabela
                rotulo="Técnicos"
                colunas={colunas}
                linhas={ts}
                chave={(t) => t.id}
                href={(t) => `/tecnicos/${t.id}`}
                tamanhoInicial={10}
              />
            )}
          </Consulta>
        )}
      </Cartao>
    </>
  );
}
