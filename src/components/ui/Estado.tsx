"use client";

import type { ReactNode } from "react";
import type { UseQueryResult } from "react-query";
import type { Resposta } from "@/lib/api";

export function Carregando({ linhas = 4 }: { linhas?: number }) {
  return (
    <div role="status" aria-label="Carregando" className="space-y-2.5">
      {Array.from({ length: linhas }, (_, i) => (
        <div key={i} className="h-9 animate-pulse rounded-lg bg-subtle" style={{ opacity: 1 - i * 0.15 }} />
      ))}
    </div>
  );
}

export function ErroBox({ mensagem, aoTentar }: { mensagem: string; aoTentar?: () => void }) {
  return (
    <div
      role="alert"
      className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
    >
      <p>{mensagem}</p>
      {aoTentar && (
        <button type="button" onClick={aoTentar} className="mt-2 font-medium underline">
          Tentar de novo
        </button>
      )}
    </div>
  );
}

export function Vazio({ children = "Nada por aqui." }: { children?: ReactNode }) {
  return <p className="py-8 text-center text-sm text-muted">{children}</p>;
}

/** Cuida dos três estados de uma consulta (carregando, erro, vazio) e entrega os dados prontos. */
export function Consulta<T>({
  q,
  children,
  vazio,
  linhas,
}: {
  q: UseQueryResult<Resposta<T>, Error>;
  children: (dados: T, paging: Resposta<T>["paging"]) => ReactNode;
  /** devolve a mensagem quando a resposta veio sem conteúdo útil */
  vazio?: (dados: T) => string | false;
  linhas?: number;
}) {
  if (q.isLoading) return <Carregando linhas={linhas} />;
  if (q.error) return <ErroBox mensagem={q.error.message} aoTentar={() => q.refetch()} />;
  if (!q.data) return null;

  const mensagem = vazio?.(q.data.response);
  if (mensagem) return <Vazio>{mensagem}</Vazio>;
  return (
    <div className={q.isFetching ? "opacity-60 transition-opacity" : ""}>
      {children(q.data.response, q.data.paging)}
    </div>
  );
}

export const vazioSeLista =
  (mensagem: string) =>
  (dados: unknown): string | false =>
    Array.isArray(dados) && dados.length === 0 ? mensagem : false;
