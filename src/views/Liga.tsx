"use client";

import Link from "next/link";
import { CaretLeft } from "phosphor-react";
import { useState } from "react";
import { TabelaClassificacao, TabelaJogos, TabelaRanking } from "@/components/futebol/comuns";
import { Abas } from "@/components/ui/Abas";
import { Cartao, Pilula } from "@/components/ui/Cartao";
import { Alternador, Seletor } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { pais } from "@/lib/formatar";
import type { Classificacao, JogadorApi, Jogo, LiganaApi } from "@/types/apiFootball";
import { TabelaTimes } from "@/components/futebol/TabelaTimes";
import { TabelaLesoes } from "./jogo/abas";
import type { Lesao, TimeApi } from "@/types/apiFootball";

function Classificacoes({ id, temporada }: { id: string; temporada: number }) {
  const q = useApi<Classificacao[]>("standings", { league: id, season: temporada });
  return (
    <Consulta q={q} vazio={vazioSeLista("Esta competição não tem classificação na temporada.")}>
      {([c]) => (
        <div className="space-y-6">
          {c.league.standings.map((grupo, i) => (
            <Cartao key={i} titulo={grupo[0]?.group ?? "Classificação"} semPadding>
              <TabelaClassificacao linhas={grupo} />
            </Cartao>
          ))}
        </div>
      )}
    </Consulta>
  );
}

const RANKINGS = {
  topscorers: {
    texto: "Artilheiros",
    rotulo: "Gols",
    valor: (j: JogadorApi) => j.statistics[0]?.goals.total ?? null,
  },
  topassists: {
    texto: "Assistências",
    rotulo: "Assistências",
    valor: (j: JogadorApi) => j.statistics[0]?.goals.assists ?? null,
  },
  topyellowcards: {
    texto: "Amarelos",
    rotulo: "Amarelos",
    valor: (j: JogadorApi) => j.statistics[0]?.cards.yellow ?? null,
  },
  topredcards: {
    texto: "Vermelhos",
    rotulo: "Vermelhos",
    valor: (j: JogadorApi) => j.statistics[0]?.cards.red ?? null,
  },
} as const;
type ChaveRanking = keyof typeof RANKINGS;

function Rankings({ id, temporada }: { id: string; temporada: number }) {
  const [tipo, setTipo] = useState<ChaveRanking>("topscorers");
  const q = useApi<JogadorApi[]>(`players/${tipo}`, { league: id, season: temporada });
  const r = RANKINGS[tipo];
  return (
    <div className="space-y-4">
      <Alternador
        rotulo="Ranking"
        valor={tipo}
        onChange={(v) => setTipo(v as ChaveRanking)}
        opcoes={(Object.keys(RANKINGS) as ChaveRanking[]).map((k) => ({
          valor: k,
          texto: RANKINGS[k].texto,
        }))}
      />
      <Cartao semPadding>
        <Consulta q={q} vazio={vazioSeLista("Sem ranking para esta liga e temporada.")}>
          {(js) => <TabelaRanking jogadores={js} valor={r.valor} rotuloValor={r.rotulo} />}
        </Consulta>
      </Cartao>
    </div>
  );
}

function JogosDaLiga({ id, temporada }: { id: string; temporada: number }) {
  const { fuso } = usePreferencias();
  const [rodada, setRodada] = useState("");
  const rodadas = useApi<string[]>("fixtures/rounds", { league: id, season: temporada });
  const q = useApi<Jogo[]>("fixtures", {
    league: id,
    season: temporada,
    round: rodada || undefined,
    timezone: fuso,
  });
  return (
    <div className="space-y-4">
      <Seletor
        rotulo="Rodada"
        valor={rodada}
        onChange={setRodada}
        opcoes={[
          { valor: "", texto: "Todas" },
          ...(rodadas.data?.response ?? []).map((r) => ({ valor: r, texto: r })),
        ]}
        className="w-64"
      />
      <Cartao semPadding>
        <Consulta q={q} vazio={vazioSeLista("Nenhum jogo encontrado.")}>
          {(jogos) => <TabelaJogos jogos={jogos} />}
        </Consulta>
      </Cartao>
    </div>
  );
}

export default function Liga({ id }: { id: string }) {
  const { temporada } = usePreferencias();
  const info = useApi<LiganaApi[]>("leagues", { id }, { staleTime: 60 * 60_000 });

  return (
    <>
      <Link href="/ligas" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <CaretLeft size={14} /> Ligas e copas
      </Link>

      <Consulta q={info} vazio={(d) => (d.length === 0 ? "Competição não encontrada." : false)} linhas={2}>
        {([l]) => (
          <div className="space-y-6">
            <Cartao>
              <div className="flex items-center gap-4">
                <Escudo src={l.league.logo} nome={l.league.name} tamanho={56} />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{l.league.name}</h1>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted">
                    <Escudo src={l.country.flag} nome={l.country.name} tamanho={16} />
                    {pais(l.country.name)}
                    <Pilula tom="marca">{l.league.type === "League" ? "Liga" : "Copa"}</Pilula>
                    <span>Temporada {temporada}</span>
                  </p>
                </div>
              </div>
            </Cartao>

            <Abas
              itens={[
                { rotulo: "Classificação", conteudo: () => <Classificacoes id={id} temporada={temporada} /> },
                { rotulo: "Rankings", conteudo: () => <Rankings id={id} temporada={temporada} /> },
                { rotulo: "Jogos", conteudo: () => <JogosDaLiga id={id} temporada={temporada} /> },
                { rotulo: "Times", conteudo: () => <TimesDaLiga id={id} temporada={temporada} /> },
                { rotulo: "Lesões", conteudo: () => <LesoesDaLiga id={id} temporada={temporada} /> },
              ]}
            />
          </div>
        )}
      </Consulta>
    </>
  );
}

function TimesDaLiga({ id, temporada }: { id: string; temporada: number }) {
  const q = useApi<TimeApi[]>("teams", { league: id, season: temporada });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhum time encontrado.")}>
        {(ts) => <TabelaTimes times={ts} />}
      </Consulta>
    </Cartao>
  );
}

function LesoesDaLiga({ id, temporada }: { id: string; temporada: number }) {
  const q = useApi<Lesao[]>("injuries", { league: id, season: temporada });
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nenhuma lesão informada.")}>
        {(ls) => <TabelaLesoes lesoes={ls} mostrarJogo />}
      </Consulta>
    </Cartao>
  );
}
