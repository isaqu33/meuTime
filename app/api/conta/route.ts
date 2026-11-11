import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { API_FOOTBALL_URL, extrairErros } from "@/lib/apiFootball";

// Plano e uso diário da conta. O `/status` da API-Sports não consome a cota.
export async function GET(req: NextRequest) {
  const secure = req.nextUrl.protocol === "https:";
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: secure,
    salt: secure ? "__Secure-authjs.session-token" : "authjs.session-token",
  });
  if (!token?.apiKey) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const r = await fetch(`${API_FOOTBALL_URL}/status`, {
      headers: { "x-apisports-key": token.apiKey as string },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const corpo = await r.json();
    const s = corpo?.response;
    if (!r.ok || extrairErros(corpo).length > 0 || !s?.requests) throw new Error("status");
    return NextResponse.json(
      {
        plano: s.subscription?.plan ?? "",
        usadas: s.requests.current ?? 0,
        limite: s.requests.limit_day ?? 0,
      },
      { headers: { "cache-control": "private, no-store" } }
    );
  } catch {
    return NextResponse.json({ message: "Upstream unavailable" }, { status: 502 });
  }
}
