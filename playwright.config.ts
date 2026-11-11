import { defineConfig } from "@playwright/test";

// O e2e é autossuficiente: sobe uma API-Sports falsa (e2e/mock-api-football.mjs, porta 3082) e o app
// em modo dev (porta 3083) apontando para ela. Não precisa de chave real nem de internet.
const MOCK_PORT = 3082;
const APP_PORT = 3083;

export default defineConfig({
  testDir: "e2e",
  timeout: 90_000,
  expect: { timeout: 30_000 }, // o modo dev compila cada rota na primeira visita
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${APP_PORT}`,
    trace: "retain-on-failure",
    locale: "pt-BR",
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium", channel: process.env.CI ? undefined : "chrome" } },
  ],
  webServer: [
    {
      command: "node e2e/mock-api-football.mjs",
      url: `http://localhost:${MOCK_PORT}/status`,
      // o mock responde 200 (com `errors`) mesmo sem chave, então a URL acima serve de sonda
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm run dev -- -p ${APP_PORT}`,
      url: `http://localhost:${APP_PORT}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        AUTH_SECRET: "e2e-only-secret",
        AUTH_URL: `http://localhost:${APP_PORT}`,
        AUTH_TRUST_HOST: "true",
        API_FOOTBALL_URL: `http://localhost:${MOCK_PORT}`,
      },
    },
  ],
});
