import type { ReactNode } from "react";

interface CartaoProps {
  titulo?: ReactNode;
  descricao?: ReactNode;
  acao?: ReactNode;
  children: ReactNode;
  className?: string;
  /** conteúdo encosta nas bordas (tabelas) */
  semPadding?: boolean;
}

export function Cartao({ titulo, descricao, acao, children, className = "", semPadding }: CartaoProps) {
  return (
    <section className={`rounded-xl border border-line bg-surface shadow-card ${className}`}>
      {(titulo || acao) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
          <div>
            {titulo && <h2 className="text-sm font-semibold text-fg">{titulo}</h2>}
            {descricao && <p className="text-xs text-muted">{descricao}</p>}
          </div>
          {acao}
        </header>
      )}
      <div className={semPadding ? "" : "p-4"}>{children}</div>
    </section>
  );
}

export function PaginaTitulo({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-fg">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-muted">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

export function Pilula({
  children,
  tom = "neutro",
}: {
  children: ReactNode;
  tom?: "neutro" | "ok" | "aviso" | "perigo" | "marca";
}) {
  const cores = {
    neutro: "bg-subtle text-muted",
    ok: "bg-ok/15 text-ok",
    aviso: "bg-warn/15 text-warn",
    perigo: "bg-danger/15 text-danger",
    marca: "bg-brand-soft text-brand",
  }[tom];
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cores}`}>
      {children}
    </span>
  );
}

export function Metrica({
  rotulo,
  valor,
  detalhe,
}: {
  rotulo: string;
  valor: ReactNode;
  detalhe?: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-subtle px-3 py-2.5">
      <p className="text-xs text-muted">{rotulo}</p>
      <p className="tabular text-lg font-semibold text-fg">{valor}</p>
      {detalhe && <p className="text-xs text-muted">{detalhe}</p>}
    </div>
  );
}

/** Lista de pares rótulo/valor; ignora valores vazios. */
export function DefLista({ itens }: { itens: [string, ReactNode][] }) {
  const visiveis = itens.filter(([, v]) => v !== null && v !== undefined && v !== "");
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
      {visiveis.map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-muted">{k}</dt>
          <dd className="text-sm font-medium text-fg">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
