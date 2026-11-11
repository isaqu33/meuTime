"use client";

import { useState } from "react";

/** Logo/foto com tamanho fixo; se a imagem falhar mostra a inicial em vez de um ícone quebrado. */
export function Escudo({
  src,
  nome = "",
  tamanho = 28,
  redondo = false,
}: {
  src?: string | null;
  nome?: string;
  tamanho?: number;
  redondo?: boolean;
}) {
  const [falhou, setFalhou] = useState(false);
  const forma = redondo ? "rounded-full" : "rounded-md";

  if (!src || falhou) {
    return (
      <span
        aria-hidden
        style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.42 }}
        className={`inline-flex shrink-0 items-center justify-center bg-subtle font-semibold text-muted ${forma}`}
      >
        {nome.slice(0, 1).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      width={tamanho}
      height={tamanho}
      onError={() => setFalhou(true)}
      style={{ width: tamanho, height: tamanho }}
      className={`shrink-0 object-contain ${forma}`}
    />
  );
}
