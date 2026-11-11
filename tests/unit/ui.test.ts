import { describe, expect, it } from "vitest";
import { intervaloPaginas } from "../../src/components/ui/Paginacao";
import { ordenarLinhas } from "../../src/components/ui/Tabela";
import { achatar } from "../../src/components/futebol/Transferencias";
import { limparParams, traduzirErro } from "../../src/lib/api";

describe("intervaloPaginas", () => {
  it("lista tudo quando são poucas páginas", () => {
    expect(intervaloPaginas(1, 5)).toEqual([1, 2, 3, 4, 5]);
  });
  it("usa reticências no meio e mantém primeira, última e vizinhas", () => {
    expect(intervaloPaginas(10, 20)).toEqual([1, "…", 9, 10, 11, "…", 20]);
    expect(intervaloPaginas(1, 20)).toEqual([1, 2, 3, 4, "…", 20]);
    expect(intervaloPaginas(20, 20)).toEqual([1, "…", 17, 18, 19, 20]);
  });
});

describe("ordenarLinhas", () => {
  it("ordena números e textos sem alterar o original", () => {
    const original = [{ n: 3 }, { n: 1 }, { n: 2 }];
    expect(ordenarLinhas(original, (l) => l.n, 1).map((l) => l.n)).toEqual([1, 2, 3]);
    expect(ordenarLinhas(original, (l) => l.n, -1).map((l) => l.n)).toEqual([3, 2, 1]);
    expect(original.map((l) => l.n)).toEqual([3, 1, 2]);
    expect(ordenarLinhas([{ t: "b" }, { t: "á" }], (l) => l.t, 1).map((l) => l.t)).toEqual(["á", "b"]);
  });
});

describe("achatar transferências", () => {
  it("uma linha por transferência, da mais recente para a mais antiga", () => {
    const time = (id: number) => ({ id, name: `T${id}`, logo: "" });
    const linhas = achatar([
      {
        player: { id: 1, name: "A" },
        transfers: [
          { date: "2020-01-01", type: "Free", teams: { in: time(2), out: time(1) } },
          { date: "2022-07-01", type: "Loan", teams: { in: time(3), out: time(2) } },
        ],
      },
    ]);
    expect(linhas.map((l) => l.data)).toEqual(["2022-07-01", "2020-01-01"]);
    expect(linhas[0]).toMatchObject({ de: { id: 2 }, para: { id: 3 } });
  });
});

describe("api", () => {
  it("limparParams remove vazios mas mantém 0 e false", () => {
    expect(limparParams({ a: 1, b: "", c: undefined, d: null, e: false, f: 0 })).toEqual({
      a: "1",
      e: "false",
      f: "0",
    });
  });
  it("traduzirErro explica plano e cota; o resto passa direto", () => {
    expect(traduzirErro("Free plans do not have access to this season, try from 2021 to 2023.")).toContain(
      "2021 a 2023"
    );
    expect(traduzirErro("You have reached the request limit for the day")).toContain("limite diário");
    expect(traduzirErro("Algo novo")).toBe("Algo novo");
  });
});
