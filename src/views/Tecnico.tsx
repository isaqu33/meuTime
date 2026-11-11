"use client";

import Link from "next/link";
import { CaretLeft } from "phosphor-react";
import { TabelaAfastamentos, TabelaTrofeus } from "@/components/futebol/Carreira";
import { LinkTime } from "@/components/futebol/comuns";
import { Abas } from "@/components/ui/Abas";
import { Cartao, DefLista } from "@/components/ui/Cartao";
import { Consulta, vazioSeLista } from "@/components/ui/Estado";
import { Escudo } from "@/components/ui/Escudo";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { useApi } from "@/hooks/useApi";
import { formatarData, pais } from "@/lib/formatar";
import type { Afastamento, Tecnico as TecnicoApi, Trofeu } from "@/types/apiFootball";

type Passagem = TecnicoApi["career"][number];

function Carreira({ carreira }: { carreira: Passagem[] }) {
  const colunas: Coluna<Passagem>[] = [
    { titulo: "Time", render: (p) => <LinkTime time={p.team} />, ordenar: (p) => p.team.name },
    {
      titulo: "Início",
      render: (p) => <span className="tabular">{formatarData(p.start)}</span>,
      ordenar: (p) => p.start ?? "",
    },
    {
      titulo: "Fim",
      render: (p) => <span className="tabular">{p.end ? formatarData(p.end) : "Atual"}</span>,
      ordenar: (p) => p.end ?? "9999",
    },
  ];
  return (
    <Cartao semPadding>
      <Tabela
        rotulo="Carreira"
        colunas={colunas}
        linhas={[...carreira].sort((a, b) => (b.start ?? "").localeCompare(a.start ?? ""))}
        chave={(p, i) => `${p.team.id}-${p.start}-${i}`}
        buscavel={(p) => p.team.name}
        tamanhoInicial={10}
      />
    </Cartao>
  );
}

export default function Tecnico({ id }: { id: string }) {
  const q = useApi<TecnicoApi[]>("coachs", { id }, { staleTime: 60 * 60_000 });
  const trofeus = useApi<Trofeu[]>("trophies", { coach: id });
  const afastamentos = useApi<Afastamento[]>("sidelined", { coach: id });

  return (
    <>
      <Link href="/tecnicos" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-fg">
        <CaretLeft size={14} /> Técnicos
      </Link>

      <Consulta q={q} vazio={(d) => (d.length === 0 ? "Técnico não encontrado." : false)} linhas={2}>
        {([t]) => (
          <div className="space-y-6">
            <Cartao>
              <div className="flex flex-wrap items-center gap-5">
                <Escudo src={t.photo} nome={t.name} tamanho={88} redondo />
                <div className="min-w-48 flex-1">
                  <h1 className="text-2xl font-bold tracking-tight">{t.name}</h1>
                  <p className="text-sm text-muted">{pais(t.nationality)}</p>
                  {t.team && (
                    <p className="mt-2 text-sm">
                      <LinkTime time={t.team} tamanho={20} />
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5 border-t border-line pt-4">
                <DefLista
                  itens={[
                    ["Idade", t.age],
                    ["Nascimento", t.birth.date ? formatarData(t.birth.date) : null],
                    ["Local de nascimento", [t.birth.place, t.birth.country].filter(Boolean).join(", ")],
                  ]}
                />
              </div>
            </Cartao>

            <Abas
              itens={[
                { rotulo: "Carreira", conteudo: () => <Carreira carreira={t.career} /> },
                {
                  rotulo: "Troféus",
                  conteudo: () => (
                    <Cartao semPadding>
                      <Consulta q={trofeus} vazio={vazioSeLista("Nenhum troféu registrado.")}>
                        {(ts) => <TabelaTrofeus trofeus={ts} />}
                      </Consulta>
                    </Cartao>
                  ),
                },
                {
                  rotulo: "Afastamentos",
                  conteudo: () => (
                    <Cartao semPadding>
                      <Consulta q={afastamentos} vazio={vazioSeLista("Nenhum afastamento registrado.")}>
                        {(as) => <TabelaAfastamentos afastamentos={as} />}
                      </Consulta>
                    </Cartao>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Consulta>
    </>
  );
}
