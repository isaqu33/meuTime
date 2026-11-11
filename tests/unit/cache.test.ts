import { describe, expect, it } from "vitest";
import { criarCache } from "../../src/lib/cacheUpstream";

describe("criarCache", () => {
  it("devolve o valor até expirar e depois esquece", () => {
    let agora = 0;
    const c = criarCache(10, () => agora);
    c.guardar("a", { x: 1 }, 1000);
    expect(c.obter("a")).toEqual({ x: 1 });
    agora = 1000;
    expect(c.obter("a")).toBeUndefined();
  });

  it("descarta as entradas mais antigas ao passar do limite", () => {
    const c = criarCache(2, () => 0);
    c.guardar("a", 1, 1000);
    c.guardar("b", 2, 1000);
    c.guardar("c", 3, 1000);
    expect(c.obter("a")).toBeUndefined();
    expect(c.obter("b")).toBe(2);
    expect(c.obter("c")).toBe(3);
  });
});
