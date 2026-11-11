import { criarCache, type Cache } from "./cacheUpstream";
import { criarLimitador, type Limitador } from "./rateLimit";

// Guardados em globalThis para sobreviver ao hot reload do `next dev`.
const g = globalThis as unknown as {
  __meutime?: { login: Limitador; proxy: Limitador; cache: Cache };
};

g.__meutime ??= {
  // tentativas de login por IP (chave errada repetida)
  login: criarLimitador({ limite: 5, janelaMs: 15 * 60_000 }),
  // chamadas ao proxy por IP (a API-Sports limita a 10 por minuto no plano gratuito)
  proxy: criarLimitador({ limite: 120, janelaMs: 60_000 }),
  cache: criarCache(),
};

export const limitadorLogin = g.__meutime.login;
export const limitadorProxy = g.__meutime.proxy;
export const cacheUpstream = g.__meutime.cache;
