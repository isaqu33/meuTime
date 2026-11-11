"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

// Preferências de interface (não são dados do usuário): temporada, liga padrão e fuso dos horários.
export interface Preferencias {
  temporada: number;
  liga: number;
  fuso: string;
}

export const PADRAO: Preferencias = { temporada: 2023, liga: 71, fuso: "America/Sao_Paulo" };
const CHAVE = "meutime:preferencias";

interface Contexto extends Preferencias {
  alterar: (parcial: Partial<Preferencias>) => void;
}

const PreferenciasContext = createContext<Contexto>({ ...PADRAO, alterar: () => {} });

export function PreferenciasProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferencias>(PADRAO);
  const [pronto, setPronto] = useState(false);

  // lê só depois de montar (evita divergência na hidratação) e só então libera as consultas
  useEffect(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? "null");
      if (salvo && typeof salvo === "object") {
        setPrefs({
          temporada: Number.isInteger(salvo.temporada) ? salvo.temporada : PADRAO.temporada,
          liga: Number.isInteger(salvo.liga) ? salvo.liga : PADRAO.liga,
          fuso: typeof salvo.fuso === "string" ? salvo.fuso : PADRAO.fuso,
        });
      }
    } catch {}
    setPronto(true);
  }, []);

  const alterar = useCallback((parcial: Partial<Preferencias>) => {
    setPrefs((atual) => {
      const novo = { ...atual, ...parcial };
      try {
        localStorage.setItem(CHAVE, JSON.stringify(novo));
      } catch {}
      return novo;
    });
  }, []);

  const valor = useMemo(() => ({ ...prefs, alterar }), [prefs, alterar]);

  return (
    <PreferenciasContext.Provider value={valor}>{pronto ? children : null}</PreferenciasContext.Provider>
  );
}

export const usePreferencias = () => useContext(PreferenciasContext);
