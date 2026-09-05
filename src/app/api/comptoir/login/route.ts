import { NextResponse } from "next/server";
import { isValidPin, sessionCookie } from "@/lib/comptoir-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const pin =
    body && typeof body === "object" && typeof (body as { pin?: unknown }).pin === "string"
      ? (body as { pin: string }).pin.trim()
      : "";

  if (!isValidPin(pin)) {
    return NextResponse.json({ error: "invalid" }, { status: 401 });
  }

  const cookie = sessionCookie();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
