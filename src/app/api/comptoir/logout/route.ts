import { NextResponse } from "next/server";
import { sessionCookie } from "@/lib/comptoir-auth";

export const runtime = "nodejs";

export async function POST() {
  const cookie = sessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, "", { ...cookie.options, maxAge: 0 });
  return response;
}
