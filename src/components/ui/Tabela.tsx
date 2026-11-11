"use client";

import { CaretDown, CaretUp, MagnifyingGlass } from "phosphor-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Paginacao } from "./Paginacao";
import { Vazio } from "./Estado";

export interface Coluna<T> {
  titulo: string;
  render: (linha: T, indice: number) => ReactNode;
  alinhar?: "left" | "right" | "center";
  /** valor usado para ordenar ao clicar no título */
  ordenar?: (linha: T) => string | number;
  className?: string;
}

const alinhamento = { left: "text-left", right: "text-right", center: "text-center" };

/** Ordena sem mudar o array original; nulos vão para o fim. Exportada para teste. */
export function ordenarLinhas<T>(linhas: T[], valor: (l: T) => string | number, direcao: 1 | -1): T[] {
  return [...linhas].sort((a, b) => {
    const va = valor(a);
    const vb = valor(b);
    if (va === vb) return 0;
    return (
      (typeof va === "number" && typeof vb === "number"
        ? va - vb
        : String(va).localeCompare(String(vb), "pt-BR")) * direcao
    );
  });
}

export function Tabela<T>({
  colunas,
  linhas,
  chave,
  tamanhoInicial = 10,
  buscavel,
  vazio = "Nenhum resultado.",
  href,
  rotulo,
}: {
  colunas: Coluna<T>[];
  linhas: T[];
  chave: (linha: T, indice: number) => string | number;
  tamanhoInicial?: number;
  /** texto pesquisável de cada linha; liga o campo de filtro da tabela */
  buscavel?: (linha: T) => string;
  vazio?: string;
  /** torna a primeira coluna um link */
  href?: (linha: T) => string | undefined;
  rotulo: string;
}) {
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] = useState(tamanhoInicial);
  const [filtro, setFiltro] = useState("");
  const [ordem, setOrdem] = useState<{ coluna: number; direcao: 1 | -1 } | null>(null);

  const filtradas = useMemo(() => {
    const f = filtro.trim().toLowerCase();
    return buscavel && f ? linhas.filter((l) => buscavel(l).toLowerCase().includes(f)) : linhas;
  }, [linhas, filtro, buscavel]);

  const ordenadas = useMemo(() => {
    const valor = ordem !== null ? colunas[ordem.coluna]?.ordenar : undefined;
    return ordem !== null && valor ? ordenarLinhas(filtradas, valor, ordem.direcao) : filtradas;
  }, [filtradas, ordem, colunas]);

  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / tamanho));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * tamanho;
  const visiveis = ordenadas.slice(inicio, inicio + tamanho);

  // dados novos (outra liga, outra temporada) voltam para a primeira página
  useEffect(() => setPagina(1), [linhas, filtro, tamanho]);

  function alternarOrdem(indice: number) {
    setOrdem((atual) =>
      atual?.coluna === indice
        ? atual.direcao === 1
          ? { coluna: indice, direcao: -1 }
          : null
        : { coluna: indice, direcao: 1 }
    );
  }

  return (
    <div>
      {buscavel && (
        <div className="border-b border-line px-4 py-3">
          <label className="relative block">
            <span className="sr-only">Filtrar {rotulo}</span>
            <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
            <input
              type="search"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              placeholder="Filtrar nesta lista..."
              className="h-9 w-full rounded-lg border border-line bg-surface pl-9 pr-3 text-sm text-fg placeholder:text-muted sm:w-72"
            />
          </label>
        </div>
      )}

      {ordenadas.length === 0 ? (
        <Vazio>{vazio}</Vazio>
      ) : (
        <div className="overflow-x-auto">
          <table aria-label={rotulo} className="w-full min-w-max text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                {colunas.map((c, i) => (
                  <th
                    key={c.titulo}
                    scope="col"
                    aria-sort={
                      ordem?.coluna === i ? (ordem.direcao === 1 ? "ascending" : "descending") : undefined
                    }
                    className={`px-4 py-2.5 font-medium ${alinhamento[c.alinhar ?? "left"]}`}
                  >
                    {c.ordenar ? (
                      <button
                        type="button"
                        onClick={() => alternarOrdem(i)}
                        className="inline-flex items-center gap-1 hover:text-fg"
                      >
                        {c.titulo}
                        {ordem?.coluna === i &&
                          (ordem.direcao === 1 ? <CaretUp size={12} /> : <CaretDown size={12} />)}
                      </button>
                    ) : (
                      c.titulo
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visiveis.map((linha, i) => {
                const destino = href?.(linha);
                return (
                  <tr
                    key={chave(linha, inicio + i)}
                    className="border-b border-line last:border-0 hover:bg-subtle/60"
                  >
                    {colunas.map((c, ci) => {
                      const conteudo = c.render(linha, inicio + i);
                      return (
                        <td
                          key={c.titulo}
                          className={`px-4 py-2.5 ${alinhamento[c.alinhar ?? "left"]} ${c.className ?? ""}`}
                        >
                          {ci === 0 && destino ? (
                            <Link
                              href={destino}
                              className="font-medium text-fg hover:text-brand hover:underline"
                            >
                              {conteudo}
                            </Link>
                          ) : (
                            conteudo
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {ordenadas.length > 0 && (
        <RodapePaginacao
          pagina={paginaAtual}
          totalPaginas={totalPaginas}
          onPagina={setPagina}
          tamanho={tamanho}
          onTamanho={setTamanho}
          inicio={inicio + 1}
          fim={Math.min(inicio + tamanho, ordenadas.length)}
          total={ordenadas.length}
        />
      )}
    </div>
  );
}

export function RodapePaginacao({
  pagina,
  totalPaginas,
  onPagina,
  tamanho,
  onTamanho,
  inicio,
  fim,
  total,
}: {
  pagina: number;
  totalPaginas: number;
  onPagina: (p: number) => void;
  tamanho?: number;
  onTamanho?: (t: number) => void;
  inicio?: number;
  fim?: number;
  total?: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted">
      <div className="flex items-center gap-3">
        {total !== undefined && (
          <span className="tabular">
            {inicio}–{fim} de {total}
          </span>
        )}
        {tamanho !== undefined && onTamanho && (
          <label className="flex items-center gap-1.5">
            Por página
            <select
              value={tamanho}
              onChange={(e) => onTamanho(Number(e.target.value))}
              className="h-8 rounded-md border border-line bg-surface px-1.5 text-fg"
            >
              {[10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}
        {total === undefined && (
          <span className="tabular">
            Página {pagina} de {totalPaginas}
          </span>
        )}
      </div>
      <Paginacao pagina={pagina} totalPaginas={totalPaginas} onChange={onPagina} />
    </div>
  );
}
