import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { API_FOOTBALL_URL, extrairErros } from "@/lib/apiFootball";
import { cacheUpstream, limitadorProxy } from "@/lib/limitadores";
import { resolverRota, ttlCache } from "@/lib/proxyPolicy";

// Único caminho do navegador até a API-Sports. A chave sai do cookie criptografado, é injetada
// aqui no servidor e nunca volta na resposta. Só GET, só endpoints/parâmetros da lista branca.
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  const rota = resolverRota(params.path, req.nextUrl.searchParams);
  if (!rota.ok) {
    return NextResponse.json(
      { message: rota.status === 404 ? "Not found" : "Bad request" },
      { status: rota.status }
    );
  }

  const secure = req.nextUrl.protocol === "https:";
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: secure,
    salt: secure ? "__Secure-authjs.session-token" : "authjs.session-token",
  });
  if (!token?.apiKey) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "local";
  const limite = limitadorProxy.tentar(ip);
  if (!limite.permitido) {
    return NextResponse.json(
      { message: "Too many requests" },
      { status: 429, headers: { "retry-after": String(limite.retryAfterS) } }
    );
  }

  const headers = { "cache-control": "private, no-store" };

  const guardado = cacheUpstream.obter(rota.upstream);
  if (guardado) return NextResponse.json(guardado, { headers: { ...headers, "x-cache": "HIT" } });

  let upstream: Response;
  try {
    upstream = await fetch(`${API_FOOTBALL_URL}/${rota.upstream}`, {
      headers: { "x-apisports-key": token.apiKey as string },
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return NextResponse.json({ message: "Upstream unavailable" }, { status: 502 });
  }

  const corpo = await upstream.json().catch(() => null);
  if (!upstream.ok || corpo === null) {
    return NextResponse.json({ message: "Upstream error" }, { status: 502 });
  }

  // só `errors`, `response` e `paging` seguem para o navegador (sem cabeçalhos/contas do upstream)
  const saida = {
    errors: extrairErros(corpo),
    response: corpo.response ?? [],
    paging: corpo.paging ?? null,
  };
  // erros (cota, plano, parâmetro) não entram no cache: a próxima tentativa pode dar certo
  if (saida.errors.length === 0) {
    cacheUpstream.guardar(rota.upstream, saida, ttlCache(rota.caminho, req.nextUrl.searchParams));
  }
  return NextResponse.json(saida, { headers: { ...headers, "x-cache": "MISS" } });
}
