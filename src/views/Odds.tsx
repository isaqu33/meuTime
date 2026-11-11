"use client";

import Link from "next/link";
import { useState } from "react";
import { Abas } from "@/components/ui/Abas";
import { Cartao, PaginaTitulo } from "@/components/ui/Cartao";
import { Seletor } from "@/components/ui/Campos";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { RodapePaginacao, Tabela, type Coluna } from "@/components/ui/Tabela";
import { LIGAS_POPULARES } from "@/data/ligas";
import { usePreferencias } from "@/contexts/Preferencias";
import { useApi } from "@/hooks/useApi";
import { formatarDataHora } from "@/lib/formatar";
import type { Item, MapeamentoOdds, OddLiga } from "@/types/apiFootball";

function Lista({ caminho, titulo }: { caminho: string; titulo: string }) {
  const q = useApi<Item[]>(caminho, {}, { staleTime: 24 * 60 * 60_000 });
  const colunas: Coluna<Item>[] = [
    {
      titulo: "ID",
      alinhar: "right",
      render: (i) => <span className="tabular text-muted">{i.id}</span>,
      ordenar: (i) => i.id,
    },
    { titulo: titulo, render: (i) => i.name, ordenar: (i) => i.name },
  ];
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Nada encontrado.")}>
        {(itens) => (
          <Tabela
            rotulo={titulo}
            colunas={colunas}
            linhas={itens}
            chave={(i) => i.id}
            buscavel={(i) => i.name}
            tamanhoInicial={20}
          />
        )}
      </Consulta>
    </Cartao>
  );
}

function OddsPorLiga() {
  const { liga: ligaPadrao, temporada, fuso } = usePreferencias();
  const [liga, setLiga] = useState<number>(ligaPadrao);
  const [pagina, setPagina] = useState(1);
  const q = useApi<OddLiga[]>("odds", { league: liga, season: temporada, page: pagina, timezone: fuso });

  const colunas: Coluna<OddLiga>[] = [
    {
      titulo: "Jogo",
      render: (o) => (
        <Link href={`/jogos/${o.fixture.id}`} className="font-medium hover:text-brand hover:underline">
          Jogo #{o.fixture.id}
        </Link>
      ),
    },
    {
      titulo: "Data",
      render: (o) => <span className="tabular">{formatarDataHora(o.fixture.date, fuso)}</span>,
    },
    {
      titulo: "Casas com odds",
      alinhar: "right",
      render: (o) => <span className="tabular">{o.bookmakers.length}</span>,
      ordenar: (o) => o.bookmakers.length,
    },
    {
      titulo: "Resultado final (casa · empate · fora)",
      render: (o) => {
        const mercado = o.bookmakers[0]?.bets.find((b) => b.id === 1);
        return mercado ? (
          <span className="tabular">{mercado.values.map((v) => v.odd).join(" · ")}</span>
        ) : (
          "-"
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Seletor
        rotulo="Liga"
        valor={liga}
        onChange={(v) => {
          setLiga(v);
          setPagina(1);
        }}
        opcoes={LIGAS_POPULARES.map((l) => ({ valor: l.id, texto: l.nome }))}
        className="w-56"
      />
      <Cartao semPadding>
        <Consulta q={q} vazio={vazioSeLista("Sem odds para esta liga e temporada.")}>
          {(os, paging) => (
            <>
              <Tabela
                rotulo="Odds por liga"
                colunas={colunas}
                linhas={os}
                chave={(o) => o.fixture.id}
                tamanhoInicial={10}
              />
              {paging && <RodapePaginacao pagina={pagina} totalPaginas={paging.total} onPagina={setPagina} />}
            </>
          )}
        </Consulta>
      </Cartao>
    </div>
  );
}

function Cobertura() {
  const { fuso } = usePreferencias();
  const [pagina, setPagina] = useState(1);
  const q = useApi<MapeamentoOdds[]>("odds/mapping", { page: pagina });
  const colunas: Coluna<MapeamentoOdds>[] = [
    {
      titulo: "Jogo",
      render: (m) => (
        <Link href={`/jogos/${m.fixture.id}`} className="font-medium hover:text-brand hover:underline">
          Jogo #{m.fixture.id}
        </Link>
      ),
    },
    {
      titulo: "Liga",
      render: (m) => (
        <Link href={`/ligas/${m.league.id}`} className="hover:text-brand hover:underline">
          #{m.league.id}
        </Link>
      ),
    },
    { titulo: "Temporada", render: (m) => <span className="tabular">{m.league.season}</span> },
    {
      titulo: "Data",
      render: (m) => <span className="tabular">{formatarDataHora(m.fixture.date, fuso)}</span>,
    },
  ];
  return (
    <Cartao semPadding>
      <Consulta q={q} vazio={vazioSeLista("Sem jogos com odds disponíveis.")}>
        {(ms, paging) => (
          <>
            <Tabela
              rotulo="Jogos com odds"
              colunas={colunas}
              linhas={ms}
              chave={(m) => m.fixture.id}
              tamanhoInicial={10}
            />
            {paging && <RodapePaginacao pagina={pagina} totalPaginas={paging.total} onPagina={setPagina} />}
          </>
        )}
      </Consulta>
    </Cartao>
  );
}

export default function Odds() {
  return (
    <>
      <PaginaTitulo
        titulo="Odds"
        descricao="Cotações por liga, jogos com odds e o catálogo de casas e mercados. As odds de cada partida ficam na aba Odds do jogo."
      />
      <Abas
        itens={[
          { rotulo: "Por liga", conteudo: () => <OddsPorLiga /> },
          { rotulo: "Jogos com odds", conteudo: () => <Cobertura /> },
          {
            rotulo: "Casas de apostas",
            conteudo: () => <Lista caminho="odds/bookmakers" titulo="Casa de apostas" />,
          },
          { rotulo: "Mercados pré-jogo", conteudo: () => <Lista caminho="odds/bets" titulo="Mercado" /> },
          { rotulo: "Mercados ao vivo", conteudo: () => <Lista caminho="odds/live/bets" titulo="Mercado" /> },
        ]}
      />
    </>
  );
}
