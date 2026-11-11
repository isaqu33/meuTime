import { useQuery } from "react-query";
import { consultar, type Params, type Resposta } from "@/lib/api";

const CINCO_MINUTOS = 5 * 60_000;

interface Opcoes {
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Consulta um endpoint da API-Sports pelo proxy. `staleTime` alto e sem refetch automático:
 * o plano gratuito tem ~100 requisições por dia (e o servidor ainda guarda cache compartilhado).
 */
export function useApi<T>(
  caminho: string,
  params: Params = {},
  { enabled = true, staleTime = CINCO_MINUTOS }: Opcoes = {}
) {
  return useQuery<Resposta<T>, Error>([caminho, params], () => consultar<T>(caminho, params), {
    enabled,
    staleTime,
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
}

export interface Conta {
  plano: string;
  usadas: number;
  limite: number;
}

export function useConta() {
  return useQuery<Conta, Error>(
    ["conta"],
    async () => {
      const r = await fetch("/api/conta");
      if (!r.ok) throw new Error("conta");
      return r.json();
    },
    { staleTime: 60_000, refetchOnWindowFocus: false, retry: false }
  );
}
