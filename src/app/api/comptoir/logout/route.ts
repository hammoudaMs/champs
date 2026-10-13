import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/comptoir-auth";

export const runtime = "nodejs";

export async function POST() {
  const cookie = clearSessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
