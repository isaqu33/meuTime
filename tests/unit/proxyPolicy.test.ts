import { describe, expect, it } from "vitest";
import { resolverRota, ttlCache } from "../../src/lib/proxyPolicy";

const rota = (caminho: string, busca = "") => resolverRota(caminho.split("/"), new URLSearchParams(busca));

describe("resolverRota (lista branca do proxy)", () => {
  it("aceita endpoints e parâmetros conhecidos, inclusive os aninhados", () => {
    expect(rota("teams", "search=Brazil")).toMatchObject({ ok: true, upstream: "teams?search=Brazil" });
    expect(rota("players", "season=2022&league=2")).toMatchObject({
      ok: true,
      upstream: "players?league=2&season=2022",
    });
    expect(rota("fixtures", "live=all")).toMatchObject({ ok: true, upstream: "fixtures?live=all" });
    expect(rota("fixtures", "live=39-61").ok).toBe(true);
    expect(rota("fixtures/headtohead", "h2h=33-34&last=10").ok).toBe(true);
    expect(rota("players/topscorers", "league=71&season=2023").ok).toBe(true);
    expect(rota("odds/live/bets").ok).toBe(true);
    expect(rota("timezone").ok).toBe(true);
    expect(rota("fixtures", "date=2023-05-10&timezone=America/Sao_Paulo").ok).toBe(true);
  });

  it("ordena os parâmetros: a mesma consulta gera a mesma chave de cache", () => {
    expect(rota("players", "season=2023&league=71")).toEqual(rota("players", "league=71&season=2023"));
  });

  it("aceita nome com acento", () => {
    expect(rota("teams", "search=São Paulo").ok).toBe(true);
  });

  it("recusa endpoint fora da lista com 404 (inclusive /status e caminhos inventados)", () => {
    expect(rota("status")).toEqual({ ok: false, status: 404 });
    expect(rota("teams/foo")).toEqual({ ok: false, status: 404 });
    expect(rota("fixtures/events/extra")).toEqual({ ok: false, status: 404 });
    expect(rota("..")).toEqual({ ok: false, status: 404 });
    expect(rota("__proto__")).toEqual({ ok: false, status: 404 });
    expect(rota("constructor")).toEqual({ ok: false, status: 404 });
  });

  it("recusa parâmetro desconhecido ou repetido com 400", () => {
    expect(rota("teams", "search=Brazil&foo=1")).toEqual({ ok: false, status: 400 });
    expect(rota("players", "season=2022&season=2023")).toEqual({ ok: false, status: 400 });
    expect(rota("standings", "league=71&page=2")).toEqual({ ok: false, status: 400 });
    // parâmetro que existe em outro endpoint, mas não neste
    expect(rota("predictions", "league=71")).toEqual({ ok: false, status: 400 });
  });

  it("recusa valor fora do formato (injeção de caminhos, valores gigantes)", () => {
    expect(rota("players", "season=2022&id=1/../status")).toEqual({ ok: false, status: 400 });
    expect(rota("players", "id=1&season=20x2")).toEqual({ ok: false, status: 400 });
    expect(rota("players", "league=1234567890")).toEqual({ ok: false, status: 400 });
    expect(rota("teams", "search=ab")).toEqual({ ok: false, status: 400 });
    expect(rota("teams", `search=${"a".repeat(41)}`)).toEqual({ ok: false, status: 400 });
    expect(rota("teams", "search=<script>")).toEqual({ ok: false, status: 400 });
    expect(rota("fixtures", "live=none")).toEqual({ ok: false, status: 400 });
    expect(rota("fixtures", "date=10/05/2023")).toEqual({ ok: false, status: 400 });
    expect(rota("fixtures", "timezone=../../etc")).toEqual({ ok: false, status: 400 });
    expect(rota("fixtures/headtohead", "h2h=33")).toEqual({ ok: false, status: 400 });
  });

  it("permite chamada sem parâmetros em endpoint conhecido", () => {
    expect(rota("fixtures")).toMatchObject({ ok: true, upstream: "fixtures" });
  });
});

describe("ttlCache", () => {
  const ttl = (c: string, b = "") => ttlCache(c, new URLSearchParams(b));

  it("dados ao vivo expiram rápido; dados estáticos duram horas", () => {
    expect(ttl("fixtures", "live=all")).toBe(30_000);
    expect(ttl("odds/live")).toBe(30_000);
    expect(ttl("countries")).toBeGreaterThan(ttl("teams"));
    expect(ttl("teams")).toBeGreaterThan(ttl("standings"));
    expect(ttl("fixtures", "date=2023-01-01")).toBeGreaterThan(30_000);
  });
});
