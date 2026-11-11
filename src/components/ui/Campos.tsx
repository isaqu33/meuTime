"use client";

import { MagnifyingGlass } from "phosphor-react";
import { useEffect, useId, useState } from "react";

const base =
  "h-9 rounded-lg border border-line bg-surface px-3 text-sm text-fg placeholder:text-muted focus-visible:border-brand";

/** Busca com atraso: só dispara `onChange` 450 ms depois da última tecla (poupa a cota da API). */
export function CampoBusca({
  valor,
  onChange,
  placeholder = "Buscar...",
  minimo = 3,
  rotulo = "Buscar",
}: {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
  /** a API-Sports exige pelo menos 3 letras nas buscas */
  minimo?: number;
  rotulo?: string;
}) {
  const [texto, setTexto] = useState(valor);

  useEffect(() => setTexto(valor), [valor]);
  useEffect(() => {
    const t = texto.trim();
    if (t === valor) return;
    if (t !== "" && t.length < minimo) return;
    const timer = setTimeout(() => onChange(t), 450);
    return () => clearTimeout(timer);
  }, [texto, valor, minimo, onChange]);

  return (
    <label className="relative block">
      <span className="sr-only">{rotulo}</span>
      <MagnifyingGlass size={16} className="pointer-events-none absolute left-3 top-2.5 text-muted" />
      <input
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={placeholder}
        className={`${base} w-full pl-9 sm:w-64`}
      />
    </label>
  );
}

export function Seletor<T extends string | number>({
  rotulo,
  valor,
  onChange,
  opcoes,
  className = "",
}: {
  rotulo: string;
  valor: T;
  onChange: (valor: T) => void;
  opcoes: { valor: T; texto: string }[];
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-muted">
        {rotulo}
      </label>
      <select
        id={id}
        value={valor}
        onChange={(e) => {
          const bruto = e.target.value;
          onChange((typeof valor === "number" ? Number(bruto) : bruto) as T);
        }}
        className={`${base} w-full pr-8`}
      >
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.texto}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CampoData({
  rotulo,
  valor,
  onChange,
}: {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-muted">
        {rotulo}
      </label>
      <input
        id={id}
        type="date"
        value={valor}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        className={base}
      />
    </div>
  );
}

export function Alternador({
  opcoes,
  valor,
  onChange,
  rotulo,
}: {
  opcoes: { valor: string; texto: string }[];
  valor: string;
  onChange: (v: string) => void;
  rotulo: string;
}) {
  return (
    <div
      role="group"
      aria-label={rotulo}
      className="inline-flex rounded-lg border border-line bg-subtle p-0.5"
    >
      {opcoes.map((o) => (
        <button
          key={o.valor}
          type="button"
          aria-pressed={o.valor === valor}
          onClick={() => onChange(o.valor)}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            o.valor === valor ? "bg-surface text-fg shadow-card" : "text-muted hover:text-fg"
          }`}
        >
          {o.texto}
        </button>
      ))}
    </div>
  );
}
