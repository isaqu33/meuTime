"use client";

import { useState } from "react";
import { TabelaJogos } from "@/components/futebol/comuns";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { Alternador, CampoData, Seletor } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { LIGAS_POPULARES } from "@/data/ligas";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { dataHoje } from "@/lib/formatar";
import type { Jogo } from "@/types/apiFootball";

type Modo = "liga" | "data" | "aovivo";
const TODAS = "";

export default function Jogos() {
  const { liga: ligaPadrao, temporada, fuso } = usePreferencias();
  const [modo, setModo] = useState<Modo>("liga");
  const [liga, setLiga] = useState<number>(ligaPadrao);
  const [data, setData] = useState(dataHoje());
  const [rodada, setRodada] = useState(TODAS);

  const rodadas = useApi<string[]>(
    "fixtures/rounds",
    { league: liga, season: temporada },
    { enabled: modo === "liga" }
  );

  const params =
    modo === "liga"
      ? { league: liga, season: temporada, round: rodada || undefined, timezone: fuso }
      : modo === "data"
        ? { date: data, league: liga || undefined, season: undefined, timezone: fuso }
        : { live: "all", timezone: fuso };
  const jogos = useApi<Jogo[]>("fixtures", params, { staleTime: modo === "aovivo" ? 30_000 : undefined });

  const opcoesLiga = LIGAS_POPULARES.map((l) => ({ valor: l.id, texto: l.nome }));

  return (
    <>
      <PaginaTitulo
        titulo="Jogos"
        descricao="Calendário, resultados e partidas ao vivo. Clique no placar para ver os detalhes."
      />

      <Cartao className="mb-6">
        <div className="flex flex-wrap items-end gap-4">
          <Alternador
            rotulo="Tipo de consulta"
            valor={modo}
            onChange={(v) => setModo(v as Modo)}
            opcoes={[
              { valor: "liga", texto: "Por liga" },
              { valor: "data", texto: "Por data" },
              { valor: "aovivo", texto: "Ao vivo" },
            ]}
          />
          {modo !== "aovivo" && (
            <Seletor
              rotulo="Liga"
              valor={liga}
              onChange={(v) => {
                setLiga(v);
                setRodada(TODAS);
              }}
              opcoes={opcoesLiga}
              className="w-56"
            />
          )}
          {modo === "liga" && (
            <Seletor
              rotulo="Rodada"
              valor={rodada}
              onChange={setRodada}
              opcoes={[
                { valor: TODAS, texto: "Todas" },
                ...(rodadas.data?.response ?? []).map((r) => ({ valor: r, texto: r })),
              ]}
              className="w-56"
            />
          )}
          {modo === "data" && <CampoData rotulo="Data" valor={data} onChange={setData} />}
        </div>
      </Cartao>

      <Cartao semPadding>
        <Consulta q={jogos} vazio={vazioSeLista("Nenhum jogo para esta consulta.")} linhas={8}>
          {(lista) => <TabelaJogos jogos={lista} mostrarLiga={modo !== "liga"} />}
        </Consulta>
      </Cartao>
    </>
  );
}
