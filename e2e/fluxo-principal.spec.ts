import { expect, test, type Browser, type Page } from "@playwright/test";
import { chaveValida as CHAVE_VALIDA } from "./chave-demo.json";

// Cada teste usa o seu "IP" para não esgotar o limite de 5 tentativas de login por IP
const comIp = (ip: string) => ({ "x-forwarded-for": ip });

async function entrar(page: Page, chave = CHAVE_VALIDA) {
  await page.goto("/login");
  await page.getByLabel(/chave de acesso/i).fill(chave);
  await page.getByRole("button", { name: "Entrar" }).click();
}

async function logado(browser: Browser, ip: string) {
  const ctx = await browser.newContext({ extraHTTPHeaders: comIp(ip) });
  const page = await ctx.newPage();
  await entrar(page);
  await expect(page.getByRole("heading", { name: "Início" })).toBeVisible();
  return { ctx, page };
}

test.describe("autenticação", () => {
  test("sem sessão, o painel redireciona para /login", async ({ page }) => {
    await page.goto("/jogos");
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole("heading", { name: "Bem-vindo!" })).toBeVisible();
  });

  test("chave inválida mostra erro e não entra", async ({ browser }) => {
    const ctx = await browser.newContext({ extraHTTPHeaders: comIp("10.0.0.1") });
    const page = await ctx.newPage();
    await entrar(page, "chaveerrada0123456789");
    await expect(page.locator("#erro-login")).toContainText("Chave inválida");
    await expect(page).toHaveURL(/\/login$/);
    await ctx.close();
  });

  test("formato inválido é recusado no próprio formulário", async ({ page }) => {
    await entrar(page, "curta");
    await expect(page.locator("#erro-login")).toContainText("16 a 64 caracteres");
  });

  test("após 5 tentativas erradas o login é bloqueado temporariamente", async ({ browser }) => {
    const ctx = await browser.newContext({ extraHTTPHeaders: comIp("10.0.0.5") });
    const page = await ctx.newPage();

    for (let i = 0; i < 5; i++) {
      await entrar(page, `chaveerrada${i}0123456789`);
      // espera a resposta: navegar antes disso cancelaria a requisição e ela não seria contada
      await expect(page.locator("#erro-login")).toContainText("Chave inválida");
    }
    await entrar(page, CHAVE_VALIDA);
    await expect(page.locator("#erro-login")).toContainText("Muitas tentativas");
    await expect(page).toHaveURL(/\/login$/);
    await ctx.close();
  });

  test("login, a chave nunca chega ao navegador e sair volta ao login", async ({ browser }) => {
    const ctx = await browser.newContext({ extraHTTPHeaders: comIp("10.0.0.2") });
    const page = await ctx.newPage();

    const respostasDoProxy: string[] = [];
    page.on("response", async (r) => {
      if (r.url().includes("/api/backend/")) respostasDoProxy.push(await r.text());
    });

    await entrar(page);
    await expect(page.getByRole("heading", { name: "Início" })).toBeVisible();
    await expect(page.getByText("Unidos FC").first()).toBeVisible();

    const cookies = await ctx.cookies();
    const sessao = cookies.find((c) => c.name.endsWith("authjs.session-token"));
    expect(sessao?.httpOnly).toBe(true);
    expect(cookies.map((c) => c.value).join()).not.toContain(CHAVE_VALIDA);
    expect(await page.evaluate(() => document.cookie)).not.toContain(CHAVE_VALIDA);
    expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain(CHAVE_VALIDA);
    expect(respostasDoProxy.length).toBeGreaterThan(0);
    expect(respostasDoProxy.join()).not.toContain(CHAVE_VALIDA);

    await page.getByRole("button", { name: "Menu do usuário" }).click();
    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page).toHaveURL(/\/login/);
    await ctx.close();
  });
});

test.describe("proxy", () => {
  test("exige sessão, só expõe a lista branca e guarda cache no servidor", async ({ browser }) => {
    const ctx = await browser.newContext({ extraHTTPHeaders: comIp("10.0.0.3") });
    const page = await ctx.newPage();

    expect((await page.request.get("/api/backend/teams?search=Brazil")).status()).toBe(401);

    await entrar(page);
    await expect(page.getByRole("heading", { name: "Início" })).toBeVisible();

    const url = "/api/backend/teams?search=Unidos";
    const primeira = await page.request.get(url);
    expect(primeira.status()).toBe(200);
    expect(["MISS", "HIT"]).toContain(primeira.headers()["x-cache"]);
    expect((await page.request.get(url)).headers()["x-cache"]).toBe("HIT");

    expect((await page.request.get("/api/backend/status")).status()).toBe(404);
    expect((await page.request.get("/api/backend/teams?search=Brazil&x=1")).status()).toBe(400);
    expect((await page.request.post(url)).status()).toBe(405);

    const conta = await (await page.request.get("/api/conta")).json();
    expect(conta).toEqual({ plano: "Free", usadas: 3, limite: 100 });
    await ctx.close();
  });

  test("health check responde 200", async ({ request }) => {
    const r = await request.get("/api/health");
    expect(r.status()).toBe(200);
    expect(await r.json()).toEqual({ status: "ok" });
  });
});

test.describe("painel", () => {
  test("tema escuro/claro alterna, e a escolha sobrevive ao recarregar", async ({ browser }) => {
    const { ctx, page } = await logado(browser, "10.0.1.1");
    const html = page.locator("html");

    await page.emulateMedia({ colorScheme: "light" });
    await page.getByRole("button", { name: /tema escuro/i }).click();
    await expect(html).toHaveClass(/dark/);

    await page.reload();
    await expect(html).toHaveClass(/dark/);

    await page.getByRole("button", { name: /tema claro/i }).click();
    await expect(html).not.toHaveClass(/dark/);
    await ctx.close();
  });

  test("navega por todas as seções do menu", async ({ browser }) => {
    const { ctx, page } = await logado(browser, "10.0.1.2");
    const menu = page.getByRole("navigation", { name: "Principal" });

    const secoes: [string, string][] = [
      ["Jogos", "Jogos"],
      ["Ligas e copas", "Ligas e copas"],
      ["Times", "Times"],
      ["Jogadores", "Jogadores"],
      ["Técnicos", "Técnicos"],
      ["Transferências", "Transferências"],
      ["Lesões", "Lesões e suspensões"],
      ["Odds", "Odds"],
      ["Estádios", "Estádios"],
      ["Países", "Países"],
    ];
    for (const [link, titulo] of secoes) {
      await menu.getByRole("link", { name: link, exact: true }).click();
      await expect(page.getByRole("heading", { name: titulo, level: 1 })).toBeVisible();
    }
    await ctx.close();
  });

  test("lista de jogos pagina, muda o tamanho da página e filtra", async ({ browser }) => {
    const { ctx, page } = await logado(browser, "10.0.1.3");
    await page.goto("/jogos");

    await expect(page.getByText("1–10 de 30")).toBeVisible();
    await page.getByRole("button", { name: "Próxima página" }).click();
    await expect(page.getByText("11–20 de 30")).toBeVisible();
    await page.getByRole("button", { name: "Página 3" }).click();
    await expect(page.getByText("21–30 de 30")).toBeVisible();

    await page.getByLabel("Por página").selectOption("50");
    await expect(page.getByText("1–30 de 30")).toBeVisible();

    await page.getByPlaceholder("Filtrar nesta lista...").fill("Atlético Norte");
    await expect(page.getByText(/1–\d+ de \d+/)).not.toContainText("de 30");
    await ctx.close();
  });

  test("paginação do servidor (jogadores por liga) usa o paging da API", async ({ browser }) => {
    const { ctx, page } = await logado(browser, "10.0.1.4");
    await page.goto("/jogadores");
    await page.getByRole("button", { name: "Por liga" }).click();

    await expect(page.getByText("Página 1 de 2")).toBeVisible();
    await page.getByRole("button", { name: "Próxima página" }).click();
    await expect(page.getByText("Página 2 de 2")).toBeVisible();
    await ctx.close();
  });

  test("jogo: abas de eventos, estatísticas, escalações, previsões e odds", async ({ browser }) => {
    const { ctx, page } = await logado(browser, "10.0.1.5");
    await page.goto("/jogos/1");

    await expect(page.getByText("Brasileirão Série A · Regular Season - 1")).toBeVisible();
    await expect(page.getByText("67'")).toBeVisible();

    await expect(page.getByText("Normal Goal")).toBeVisible();
    await page.getByRole("tab", { name: "Estatísticas" }).click();
    await expect(page.getByText("Posse de bola")).toBeVisible();
    await page.getByRole("tab", { name: "Escalações" }).click();
    await expect(page.getByText("Esquema 4-3-3").first()).toBeVisible();
    await page.getByRole("tab", { name: "Previsões" }).click();
    await expect(page.getByText(/Dupla chance/)).toBeVisible();
    await page.getByRole("tab", { name: "Odds" }).click();
    await expect(page.getByText("Odds ao vivo")).toBeVisible(); // o jogo 1 está ao vivo
    await expect(page.getByText("Match Winner").first()).toBeVisible();
    await ctx.close();
  });

  test("liga: classificação, rankings e jogos; time: elenco e estatísticas; jogador: carreira", async ({
    browser,
  }) => {
    const { ctx, page } = await logado(browser, "10.0.1.6");

    await page.goto("/ligas/71");
    await expect(page.getByRole("heading", { name: "Brasileirão Série A", level: 1 })).toBeVisible();
    await expect(page.getByRole("table", { name: "Classificação" })).toBeVisible();
    await page.getByRole("tab", { name: "Rankings" }).click();
    await page.getByRole("button", { name: "Assistências" }).click();
    await expect(page.getByRole("table", { name: "Ranking de Assistências" })).toBeVisible();

    await page.goto("/times/100");
    await expect(page.getByRole("heading", { name: "Unidos FC" })).toBeVisible();
    await expect(page.getByRole("table", { name: "Elenco" })).toBeVisible();
    await page.getByRole("tab", { name: "Estatísticas" }).click();
    await expect(page.getByText("Esquemas mais usados")).toBeVisible();
    await page.getByRole("tab", { name: "Transferências" }).click();
    await expect(page.getByRole("table", { name: "Transferências" })).toBeVisible();

    await page.goto("/jogadores/276");
    await expect(page.getByRole("heading", { name: "R. Souza" })).toBeVisible();
    await expect(page.getByRole("table", { name: "Estatísticas por competição" })).toBeVisible();
    await page.getByRole("tab", { name: "Troféus" }).click();
    await expect(page.getByRole("table", { name: "Troféus" })).toBeVisible();

    await page.goto("/tecnicos/900");
    await expect(page.getByRole("heading", { name: "Técnico 900" })).toBeVisible();
    await expect(page.getByRole("table", { name: "Carreira" })).toBeVisible();
    await ctx.close();
  });

  test("busca de jogadores exige 3 letras e lista o resultado", async ({ browser }) => {
    const { ctx, page } = await logado(browser, "10.0.1.7");
    await page.goto("/jogadores");

    await expect(page.getByText("Digite pelo menos 3 letras")).toBeVisible();
    await page.getByLabel("Buscar jogador").fill("Raf");
    await expect(page.getByRole("table", { name: "Perfis de jogadores" })).toBeVisible();
    await ctx.close();
  });

  test("plano gratuito: temporada fora de 2021–2023 mostra a explicação em português", async ({
    browser,
  }) => {
    const { ctx, page } = await logado(browser, "10.0.1.8");
    await page.evaluate(() =>
      localStorage.setItem(
        "meutime:preferencias",
        JSON.stringify({ temporada: 2025, liga: 71, fuso: "America/Sao_Paulo" })
      )
    );
    await page.goto("/jogos");
    await expect(page.getByRole("alert").filter({ hasText: "2021 a 2023" })).toBeVisible();
    await ctx.close();
  });

  test("id fora do formato mostra a página 404 sem chamar a API", async ({ browser }) => {
    const { ctx, page } = await logado(browser, "10.0.1.9");
    for (const rota of ["/jogos/abc", "/times/x", "/ligas/1a", "/jogadores/-1", "/tecnicos/zz"]) {
      await page.goto(rota);
      await expect(page.getByRole("heading", { name: "Página não encontrada" })).toBeVisible();
    }
    await ctx.close();
  });
});
