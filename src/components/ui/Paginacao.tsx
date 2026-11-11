"use client";

import { CaretLeft, CaretRight } from "phosphor-react";

/** Números de página com reticências: 1 … 4 5 [6] 7 8 … 20 */
export function intervaloPaginas(atual: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const paginas = new Set([1, total, atual, atual - 1, atual + 1]);
  if (atual <= 3) [2, 3, 4].forEach((p) => paginas.add(p));
  if (atual >= total - 2) [total - 1, total - 2, total - 3].forEach((p) => paginas.add(p));
  const ordenadas = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const saida: (number | "…")[] = [];
  ordenadas.forEach((p, i) => {
    if (i > 0 && p - ordenadas[i - 1] > 1) saida.push("…");
    saida.push(p);
  });
  return saida;
}

const botao =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors disabled:opacity-40";

export function Paginacao({
  pagina,
  totalPaginas,
  onChange,
}: {
  pagina: number;
  totalPaginas: number;
  onChange: (pagina: number) => void;
}) {
  if (totalPaginas <= 1) return null;

  return (
    <nav aria-label="Paginação" className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={pagina <= 1}
        onClick={() => onChange(pagina - 1)}
        className={`${botao} border border-line text-fg hover:bg-subtle`}
      >
        <CaretLeft size={14} />
      </button>
      {intervaloPaginas(pagina, totalPaginas).map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            aria-label={`Página ${p}`}
            aria-current={p === pagina ? "page" : undefined}
            onClick={() => onChange(p)}
            className={`${botao} tabular ${
              p === pagina ? "bg-brand font-semibold text-brand-fg" : "text-fg hover:bg-subtle"
            }`}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        aria-label="Próxima página"
        disabled={pagina >= totalPaginas}
        onClick={() => onChange(pagina + 1)}
        className={`${botao} border border-line text-fg hover:bg-subtle`}
      >
        <CaretRight size={14} />
      </button>
    </nav>
  );
}
