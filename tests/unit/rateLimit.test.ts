import { describe, expect, it } from "vitest";
import { criarLimitador } from "../../src/lib/rateLimit";

describe("criarLimitador", () => {
  it("bloqueia depois do limite e informa quanto esperar", () => {
    let agora = 1_000;
    const l = criarLimitador({ limite: 3, janelaMs: 10_000, agora: () => agora });

    expect(l.tentar("ip").permitido).toBe(true);
    expect(l.tentar("ip").permitido).toBe(true);
    expect(l.tentar("ip").permitido).toBe(true);

    agora = 4_000;
    expect(l.tentar("ip")).toEqual({ permitido: false, retryAfterS: 7 });
  });

  it("libera de novo quando a janela termina", () => {
    let agora = 0;
    const l = criarLimitador({ limite: 1, janelaMs: 1_000, agora: () => agora });

    expect(l.tentar("ip").permitido).toBe(true);
    expect(l.tentar("ip").permitido).toBe(false);
    agora = 1_000;
    expect(l.tentar("ip").permitido).toBe(true);
  });

  it("conta cada chave separadamente", () => {
    const l = criarLimitador({ limite: 1, janelaMs: 1_000, agora: () => 0 });

    expect(l.tentar("a").permitido).toBe(true);
    expect(l.tentar("b").permitido).toBe(true);
    expect(l.tentar("a").permitido).toBe(false);
  });
});
