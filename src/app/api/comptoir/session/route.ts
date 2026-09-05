import { NextResponse } from "next/server";
import { hasComptoirSession } from "@/lib/comptoir-auth";

export const runtime = "nodejs";

export async function GET() {
  const ok = await hasComptoirSession();
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
