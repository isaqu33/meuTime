export const API_FOOTBALL_URL = process.env.API_FOOTBALL_URL ?? "https://v3.football.api-sports.io";

/**
 * A API-Sports responde HTTP 200 mesmo quando falha (chave inválida, limite diário...):
 * o erro vem em `errors`, como objeto `{ campo: "mensagem" }` ou como lista.
 */
export function extrairErros(corpo: unknown): string[] {
  const errors = (corpo as { errors?: unknown } | null)?.errors;
  if (!errors) return [];
  if (Array.isArray(errors)) return errors.map(String);
  if (typeof errors === "object") return Object.values(errors as Record<string, unknown>).map(String);
  return [String(errors)];
}

interface StatusConta {
  account: { firstname: string };
  subscription: { plan: string; active: boolean };
}

export type ResultadoChave =
  { ok: true; nome: string; plano: string } | { ok: false; motivo: "invalida" | "inativa" | "indisponivel" };

/** Confere a chave em `/status` (não consome a cota diária da API-Sports). */
export async function validarChave(
  chave: string,
  fetchImpl: typeof fetch = fetch,
  baseUrl: string = API_FOOTBALL_URL
): Promise<ResultadoChave> {
  let corpo: { response?: Partial<StatusConta> | unknown[] };
  try {
    const resposta = await fetchImpl(`${baseUrl}/status`, {
      headers: { "x-apisports-key": chave },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!resposta.ok) return { ok: false, motivo: "indisponivel" };
    corpo = await resposta.json();
  } catch {
    return { ok: false, motivo: "indisponivel" };
  }

  const status = corpo.response;
  if (extrairErros(corpo).length > 0 || !status || Array.isArray(status) || !status.subscription) {
    return { ok: false, motivo: "invalida" };
  }
  if (status.subscription.active !== true) return { ok: false, motivo: "inativa" };

  return {
    ok: true,
    nome: status.account?.firstname || "Jogador",
    plano: status.subscription.plan ?? "",
  };
}
