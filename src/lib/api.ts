import axios from "axios";
import { extrairErros } from "./apiFootball";
import type { Paging } from "@/types/apiFootball";

// O navegador só fala com o proxy do Next (/api/backend); a chave nunca passa por aqui.
const http = axios.create({ baseURL: "/api/backend" });

export class ApiError extends Error {}

export type Params = Record<string, string | number | boolean | null | undefined>;
export interface Resposta<T> {
  response: T;
  paging: Paging | null;
}

/** Mensagens da API-Sports (em inglês) que valem uma explicação em português. */
export function traduzirErro(mensagem: string): string {
  const m = mensagem.toLowerCase();
  if (m.includes("do not have access to this season"))
    return "Seu plano não tem acesso a esta temporada (o plano gratuito cobre 2021 a 2023). Troque a temporada no topo da página.";
  if (m.includes("do not have access to this date"))
    return "Seu plano não tem acesso a esta data (o plano gratuito cobre jogos de 2021 a 2023).";
  if (m.includes("request limit") || m.includes("limit for the day"))
    return "O limite diário de requisições da sua chave acabou. Tente de novo amanhã ou use um plano maior.";
  if (m.includes("rate limit") || m.includes("too many requests"))
    return "Muitas requisições por minuto. Aguarde um instante e tente de novo.";
  return mensagem;
}

/** Remove parâmetros vazios: o proxy recusa o que não está na lista branca. */
export function limparParams(params: Params): Record<string, string> {
  const saida: Record<string, string> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") saida[k] = String(v);
  }
  return saida;
}

export async function consultar<T>(caminho: string, params: Params = {}): Promise<Resposta<T>> {
  try {
    const { data } = await http.get(caminho, { params: limparParams(params) });
    const erros = extrairErros(data);
    if (erros.length > 0) throw new ApiError(erros.map(traduzirErro).join("; "));
    return { response: data.response as T, paging: data.paging ?? null };
  } catch (erro) {
    if (erro instanceof ApiError) throw erro;
    if (axios.isAxiosError(erro)) {
      if (erro.response?.status === 401) window.location.assign("/login");
      if (erro.response?.status === 429) {
        throw new ApiError("Muitas requisições. Aguarde um instante e tente de novo.");
      }
      if (erro.response?.status === 400) throw new ApiError("Consulta inválida.");
    }
    throw new ApiError("Erro na conexão com a API de futebol.");
  }
}
