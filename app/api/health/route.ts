import { NextResponse } from "next/server";

// Liveness: o processo está de pé. (Sem banco/cache aqui, não há readiness separado.)
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ status: "ok" });
}
