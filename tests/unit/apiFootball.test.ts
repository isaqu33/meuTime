import { describe, expect, it, vi } from "vitest";
import { extrairErros, validarChave } from "../../src/lib/apiFootball";
import { chaveValida, normalizarChave } from "../../src/lib/chave";

const resposta = (corpo: unknown, status = 200) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(corpo), { status })) as unknown as typeof fetch;

describe("extrairErros", () => {
  it("lê erros em objeto, em lista, ou nenhum", () => {
    expect(extrairErros({ errors: { token: "Chave inválida" } })).toEqual(["Chave inválida"]);
    expect(extrairErros({ errors: ["a", "b"] })).toEqual(["a", "b"]);
    expect(extrairErros({ errors: [] })).toEqual([]);
    expect(extrairErros({ errors: {} })).toEqual([]);
    expect(extrairErros(null)).toEqual([]);
  });
});

describe("validarChave", () => {
  const ativa = {
    errors: [],
    response: { account: { firstname: "Maria" }, subscription: { plan: "Free", active: true } },
  };

  it("aceita chave com assinatura ativa e envia a chave no cabeçalho", async () => {
    const fetchImpl = resposta(ativa);
    expect(await validarChave("abc", fetchImpl, "http://api")).toEqual({
      ok: true,
      nome: "Maria",
      plano: "Free",
    });
    expect(fetchImpl).toHaveBeenCalledWith(
      "http://api/status",
      expect.objectContaining({ headers: { "x-apisports-key": "abc" } })
    );
  });

  it("recusa chave inválida (a API responde 200 com `errors` e `response: []`)", async () => {
    const fetchImpl = resposta({ errors: { token: "Error/Missing application key" }, response: [] });
    expect(await validarChave("x", fetchImpl, "http://api")).toEqual({ ok: false, motivo: "invalida" });
  });

  it("recusa assinatura inativa", async () => {
    const corpo = { errors: [], response: { subscription: { plan: "Free", active: false } } };
    expect(await validarChave("x", resposta(corpo), "http://api")).toEqual({ ok: false, motivo: "inativa" });
  });

  it("diferencia 'API fora do ar' de 'chave errada'", async () => {
    expect(await validarChave("x", resposta({}, 500), "http://api")).toEqual({
      ok: false,
      motivo: "indisponivel",
    });
    const falha = vi.fn().mockRejectedValue(new Error("rede")) as unknown as typeof fetch;
    expect(await validarChave("x", falha, "http://api")).toEqual({ ok: false, motivo: "indisponivel" });
  });
});

describe("chaveValida", () => {
  it("aceita só letras e números de 16 a 64 caracteres (depois do trim)", () => {
    expect(chaveValida("a".repeat(32))).toBe(true);
    expect(chaveValida(`  ${"a1".repeat(10)}  `)).toBe(true);
    expect(chaveValida("curta")).toBe(false);
    expect(chaveValida("a".repeat(65))).toBe(false);
    expect(chaveValida(`${"a".repeat(20)}/../`)).toBe(false);
    expect(chaveValida(undefined)).toBe(false);
    expect(chaveValida(123)).toBe(false);
  });

  it("normalizarChave devolve string vazia para não-string", () => {
    expect(normalizarChave(null)).toBe("");
    expect(normalizarChave(" x ")).toBe("x");
  });
});
