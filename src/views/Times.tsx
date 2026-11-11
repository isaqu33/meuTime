"use client";

import { useState } from "react";
import { TabelaTimes } from "@/components/futebol/TabelaTimes";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { Alternador, CampoBusca, Seletor } from "@/components/ui/Campos";
import { Consulta, Vazio, vazioSeLista } from "@/components/ui/Estado";
import { LIGAS_POPULARES } from "@/data/ligas";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import type { Pais, TimeApi } from "@/types/apiFootball";

type Modo = "liga" | "busca" | "pais";

export default function Times() {
  const { liga: ligaPadrao, temporada } = usePreferencias();
  const [modo, setModo] = useState<Modo>("liga");
  const [liga, setLiga] = useState<number>(ligaPadrao);
  const [busca, setBusca] = useState("");
  const [pais, setPais] = useState("Brazil");

  const paises = useApi<Pais[]>("countries", {}, { enabled: modo === "pais", staleTime: 24 * 60 * 60_000 });

  const params =
    modo === "liga"
      ? { league: liga, season: temporada }
      : modo === "busca"
        ? { search: busca }
        : { country: pais };
  const pronto = modo !== "busca" || busca.length >= 3;
  const q = useApi<TimeApi[]>("teams", params, { enabled: pronto });

  return (
    <>
      <PaginaTitulo titulo="Times" descricao="Clubes e seleções, com estádio, fundação e capacidade." />

      <Cartao className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <Alternador
            rotulo="Tipo de consulta"
            valor={modo}
            onChange={(v) => setModo(v as Modo)}
            opcoes={[
              { valor: "liga", texto: "Por liga" },
              { valor: "pais", texto: "Por país" },
              { valor: "busca", texto: "Buscar por nome" },
            ]}
          />
          {modo === "liga" && (
            <Seletor
              rotulo="Liga"
              valor={liga}
              onChange={setLiga}
              opcoes={LIGAS_POPULARES.map((l) => ({ valor: l.id, texto: l.nome }))}
              className="w-56"
            />
          )}
          {modo === "pais" && (
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
          )}
          {modo === "busca" && (
            <CampoBusca
              valor={busca}
              onChange={setBusca}
              placeholder="Nome do time (mín. 3 letras)"
              rotulo="Buscar time"
            />
          )}
        </div>
      </Cartao>

      <Cartao semPadding>
        {!pronto ? (
          <Vazio>Digite pelo menos 3 letras para buscar.</Vazio>
        ) : (
          <Consulta q={q} vazio={vazioSeLista("Nenhum time encontrado.")} linhas={8}>
            {(times) => <TabelaTimes times={times} />}
          </Consulta>
        )}
      </Cartao>
    </>
  );
}
