"use client";

import { LinkTime } from "@/components/futebol/comuns";
import { Pilula } from "@/components/ui/Cartao";
import { Tabela, type Coluna } from "@/components/ui/Tabela";
import { formatarData } from "@/lib/formatar";
import type { Ref, Transferencia } from "@/types/apiFootball";

interface Linha {
  data: string;
  jogador: { id: number; name: string };
  de: Ref | null;
  para: Ref | null;
  tipo: string | null;
}

/** A API agrupa por jogador; a tabela mostra uma transferência por linha, da mais recente para a mais antiga. */
export function achatar(transferencias: Transferencia[]): Linha[] {
  return transferencias
    .flatMap((t) =>
      t.transfers.map((x) => ({
        data: x.date,
        jogador: t.player,
        de: x.teams.out?.id ? x.teams.out : null,
        para: x.teams.in?.id ? x.teams.in : null,
        tipo: x.type,
      }))
    )
    .sort((a, b) => b.data.localeCompare(a.data));
}

const TIPOS: Record<string, string> = {
  Loan: "Empréstimo",
  Free: "Livre",
  "N/A": "-",
  "Back from loan": "Fim de empréstimo",
};

export function TabelaTransferencias({
  transferencias,
  timeId,
  mostrarJogador = true,
}: {
  transferencias: Transferencia[];
  /** destaca entradas e saídas em relação a este time */
  timeId?: number;
  mostrarJogador?: boolean;
}) {
  const linhas = achatar(transferencias);

  const colunas: Coluna<Linha>[] = [
    {
      titulo: "Data",
      render: (l) => <span className="tabular whitespace-nowrap">{formatarData(l.data)}</span>,
      ordenar: (l) => l.data,
    },
    ...(mostrarJogador
      ? [{ titulo: "Jogador", render: (l: Linha) => l.jogador.name, ordenar: (l: Linha) => l.jogador.name }]
      : []),
    {
      titulo: "Saiu de",
      render: (l) => (l.de ? <LinkTime time={l.de} tamanho={20} /> : <span className="text-muted">-</span>),
    },
    {
      titulo: "Foi para",
      render: (l) =>
        l.para ? <LinkTime time={l.para} tamanho={20} /> : <span className="text-muted">-</span>,
    },
    {
      titulo: "Tipo",
      render: (l) => {
        const entrou = timeId !== undefined && l.para?.id === timeId;
        const saiu = timeId !== undefined && l.de?.id === timeId;
        return (
          <span className="inline-flex items-center gap-1.5">
            {entrou && <Pilula tom="ok">Entrada</Pilula>}
            {saiu && <Pilula tom="perigo">Saída</Pilula>}
            <span className="text-muted">{l.tipo ? (TIPOS[l.tipo] ?? l.tipo) : "-"}</span>
          </span>
        );
      },
    },
  ];

  return (
    <Tabela
      rotulo="Transferências"
      colunas={colunas}
      linhas={linhas}
      chave={(l, i) => `${l.jogador.id}-${l.data}-${i}`}
      href={mostrarJogador ? (l) => `/jogadores/${l.jogador.id}` : undefined}
      buscavel={(l) => `${l.jogador.name} ${l.de?.name ?? ""} ${l.para?.name ?? ""}`}
      tamanhoInicial={10}
    />
  );
}
