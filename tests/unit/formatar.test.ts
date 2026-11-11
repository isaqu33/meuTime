import { describe, expect, it } from "vitest";
import { formatarData, formatarDataHora, numero, posicao, statusJogo } from "../../src/lib/formatar";

describe("formatar", () => {
  it("formatarData não desloca o dia por causa do fuso", () => {
    expect(formatarData("1998-04-12")).toBe("12/04/1998");
    expect(formatarData("2023-01-01T00:00:00+00:00")).toBe("01/01/2023");
    expect(formatarData(null)).toBe("-");
  });

  it("formatarDataHora usa o fuso informado e tolera data inválida", () => {
    expect(formatarDataHora("2023-05-10T18:00:00+00:00", "America/Sao_Paulo")).toContain("15:00");
    expect(formatarDataHora("lixo")).toBe("-");
  });

  it("statusJogo separa ao vivo, encerrado, agendado e adiado", () => {
    expect(statusJogo("2H", 67)).toMatchObject({ texto: "67'", aoVivo: true });
    expect(statusJogo("HT")).toMatchObject({ texto: "Intervalo", aoVivo: true });
    expect(statusJogo("FT")).toMatchObject({ texto: "Encerrado", aoVivo: false });
    expect(statusJogo("NS")).toMatchObject({ texto: "Agendado", aoVivo: false });
    expect(statusJogo("PST")).toMatchObject({ texto: "Adiado" });
  });

  it("numero e posicao tratam nulos", () => {
    expect(numero(null)).toBe("-");
    expect(numero(1500)).toBe("1.500");
    expect(posicao("Attacker")).toBe("Atacante");
    expect(posicao(null)).toBe("-");
    expect(posicao("Libero")).toBe("Libero");
  });
});
