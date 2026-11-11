// Gera as capturas do README (screenshots/) com dados fictícios da API-Sports falsa.
// Uso: npm run screenshots   (usa o Chrome instalado; o gráfico de cartões carrega do CDN do Google)
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { chromium } from "@playwright/test";

const { chaveValida } = JSON.parse(readFileSync(new URL("./chave-demo.json", import.meta.url), "utf8"));
const APP = "http://localhost:3083";

const filhos = [
  spawn("node", ["e2e/mock-api-football.mjs"], { stdio: "inherit" }),
  spawn("npm", ["run", "dev", "--", "-p", "3083"], {
    stdio: "inherit",
    env: {
      ...process.env,
      AUTH_SECRET: "screenshots-only",
      AUTH_URL: APP,
      AUTH_TRUST_HOST: "true",
      API_FOOTBALL_URL: "http://localhost:3082",
    },
  }),
];

async function aguardar() {
  for (let i = 0; i < 120; i++) {
    try {
      if ((await fetch(`${APP}/api/health`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("app não subiu");
}

try {
  await aguardar();
  mkdirSync("screenshots", { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });

  async function sessao(esquema) {
    const ctx = await browser.newContext({
      viewport: { width: 1360, height: 860 },
      locale: "pt-BR",
      colorScheme: esquema,
    });
    const page = await ctx.newPage();
    await page.goto(`${APP}/login`);
    return { ctx, page };
  }
  async function entrar(page) {
    await page.getByLabel(/chave de acesso/i).fill(chaveValida);
    await page.getByRole("button", { name: "Entrar" }).click();
    await page.getByRole("heading", { name: "Início" }).waitFor();
    await page.getByText("Unidos FC").first().waitFor();
  }
  const foto = (page, nome, cheia = false) =>
    page.screenshot({ path: `screenshots/${nome}.png`, fullPage: cheia });

  // tema claro
  const claro = await sessao("light");
  await foto(claro.page, "login-claro");
  await entrar(claro.page);
  await foto(claro.page, "inicio-claro");
  await claro.page.goto(`${APP}/jogos`);
  await claro.page.getByText("1–10 de 30").waitFor();
  await foto(claro.page, "jogos-claro");
  await claro.page.goto(`${APP}/jogos/1`);
  await claro.page.getByText("Normal Goal").waitFor();
  await foto(claro.page, "jogo-claro", true);
  await claro.ctx.close();

  // tema escuro
  const escuro = await sessao("dark");
  await foto(escuro.page, "login-escuro");
  await entrar(escuro.page);
  await foto(escuro.page, "inicio-escuro");
  await escuro.page.goto(`${APP}/ligas/71`);
  await escuro.page.getByRole("table", { name: "Classificação" }).waitFor();
  await foto(escuro.page, "liga-escuro");
  await escuro.page.goto(`${APP}/times/100`);
  await escuro.page.getByRole("table", { name: "Elenco" }).waitFor();
  await foto(escuro.page, "time-escuro");
  await escuro.page.goto(`${APP}/jogadores/276`);
  await escuro.page.getByRole("table", { name: "Estatísticas por competição" }).waitFor();
  await foto(escuro.page, "jogador-escuro");
  await escuro.ctx.close();

  await browser.close();
} finally {
  for (const f of filhos) f.kill();
}
