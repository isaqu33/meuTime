// A "chave de acesso" é a API key da API-Sports. Validar o formato antes de gastar uma requisição
// (o plano gratuito tem limite diário) e antes de qualquer coisa chegar ao upstream.
const FORMATO = /^[A-Za-z0-9]{16,64}$/;

export function normalizarChave(valor: unknown): string {
  return typeof valor === "string" ? valor.trim() : "";
}

export function chaveValida(valor: unknown): boolean {
  return FORMATO.test(normalizarChave(valor));
}
