"use client";

import { useState } from "react";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { Alternador, CampoData, Seletor } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { LIGAS_POPULARES } from "@/data/ligas";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { dataHoje } from "@/lib/formatar";
import type { Lesao } from "@/types/apiFootball";
import { TabelaLesoes } from "./jogo/abas";

export default function Lesoes() {
  const { liga: ligaPadrao, temporada } = usePreferencias();
  const [modo, setModo] = useState("liga");
  const [liga, setLiga] = useState<number>(ligaPadrao);
  const [data, setData] = useState(dataHoje());

  const params = modo === "liga" ? { league: liga, season: temporada } : { date: data };
  const q = useApi<Lesao[]>("injuries", params);

  return (
    <>
      <PaginaTitulo
        titulo="Lesões e suspensões"
        descricao="Jogadores indisponíveis, por liga e temporada ou por data."
      />
      <Cartao className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <Alternador
            rotulo="Tipo de consulta"
            valor={modo}
            onChange={setModo}
            opcoes={[
              { valor: "liga", texto: "Por liga" },
              { valor: "data", texto: "Por data" },
            ]}
          />
          {modo === "liga" ? (
            <Seletor
              rotulo="Liga"
              valor={liga}
              onChange={setLiga}
              opcoes={LIGAS_POPULARES.map((l) => ({ valor: l.id, texto: l.nome }))}
              className="w-56"
            />
          ) : (
            <CampoData rotulo="Data" valor={data} onChange={setData} />
          )}
        </div>
      </Cartao>
      <Cartao semPadding>
        <Consulta q={q} vazio={vazioSeLista("Nenhuma lesão ou suspensão informada.")} linhas={8}>
          {(ls) => <TabelaLesoes lesoes={ls} mostrarJogo />}
        </Consulta>
      </Cartao>
    </>
  );
}
